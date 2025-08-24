const NexusWealthPresale = artifacts.require("NexusWealthPresale");
const MockERC20 = artifacts.require("MockERC20");

module.exports = async function (callback) {
  try {
    console.log("🔧 NexusWealth Presale Contract Interaction Script");
    
    // Get deployed contracts
    const presale = await NexusWealthPresale.deployed();
    const token = await MockERC20.deployed();
    
    console.log("✅ Connected to contracts:");
    console.log("   Presale:", presale.address);
    console.log("   Token:", token.address);
    
    // Get accounts
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    const buyer1 = accounts[1];
    const buyer2 = accounts[2];
    
    console.log("📝 Available accounts:");
    console.log("   Owner:", owner);
    console.log("   Buyer 1:", buyer1);
    console.log("   Buyer 2:", buyer2);
    
    // Display current contract state
    console.log("\n📊 Current Contract State:");
    
    const saleInfo = await presale.getSaleInfo();
    console.log("   Sale Active:", saleInfo._saleActive);
    console.log("   Token Price:", web3.utils.fromWei(saleInfo._tokenPrice, "ether"), "ETH");
    console.log("   Total Tokens:", web3.utils.fromWei(saleInfo._totalTokensForSale, "ether"), "NWIS");
    console.log("   Tokens Sold:", web3.utils.fromWei(saleInfo._totalTokensSold, "ether"), "NWIS");
    console.log("   Min Purchase:", web3.utils.fromWei(saleInfo._minPurchase, "ether"), "ETH");
    console.log("   Max Purchase:", web3.utils.fromWei(saleInfo._maxPurchase, "ether"), "ETH");
    console.log("   Sale Start Time:", saleInfo._saleStartTime.toString() === "0" ? "Not set" : new Date(saleInfo._saleStartTime * 1000));
    console.log("   Sale End Time:", saleInfo._saleEndTime.toString() === "0" ? "Not set" : new Date(saleInfo._saleEndTime * 1000));
    
    const contractOwner = await presale.owner();
    const treasuryAddress = await presale.treasuryAddress();
    const devAddress = await presale.devAddress();
    console.log("   Owner:", contractOwner);
    console.log("   Treasury:", treasuryAddress);
    console.log("   Dev:", devAddress);
    
    // Check token balance in presale contract
    const tokenBalance = await token.balanceOf(presale.address);
    console.log("   Tokens in Contract:", web3.utils.fromWei(tokenBalance, "ether"), "NWIS");
    
    // Check ETH balance in presale contract
    const ethBalance = await web3.eth.getBalance(presale.address);
    console.log("   ETH in Contract:", web3.utils.fromWei(ethBalance, "ether"), "ETH");
    
    // Interactive menu
    console.log("\n🔧 Available Actions:");
    console.log("1. Start the sale");
    console.log("2. Set sale end time");
    console.log("3. Update token price");
    console.log("4. Update purchase limits");
    console.log("5. View contract status");
    console.log("6. Withdraw ETH");
    console.log("7. Withdraw tokens");
    console.log("8. Pause/Unpause contract");
    console.log("9. Test purchase (simulate buyer)");
    console.log("10. Get user info");
    console.log("11. Exit");
    
    // For demonstration, let's show some common actions
    console.log("\n💡 Common Actions Demo:");
    
    // Check if sale is active
    if (!saleInfo._saleActive) {
      console.log("\n🚀 Starting the sale...");
      try {
        await presale.setSaleStatus(true, { from: owner });
        console.log("✅ Sale started successfully!");
      } catch (error) {
        console.log("❌ Failed to start sale:", error.message);
      }
    }
    
    // Set sale end time if not set
    if (saleInfo._saleEndTime.toString() === "0") {
      console.log("\n⏰ Setting sale end time (30 days from now)...");
      try {
        const endTime = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
        await presale.setSaleEndTime(endTime, { from: owner });
        console.log("✅ Sale end time set to:", new Date(endTime * 1000));
      } catch (error) {
        console.log("❌ Failed to set sale end time:", error.message);
      }
    }
    
    // Contract status
    console.log("\n📊 Contract Status:");
    console.log("   Sale Active:", saleInfo._saleActive);
    console.log("   Total Tokens Sold:", web3.utils.fromWei(saleInfo._totalTokensSold, "ether"), "NWIS");
    console.log("   Remaining Tokens:", web3.utils.fromWei(saleInfo._totalTokensForSale - saleInfo._totalTokensSold, "ether"), "NWIS");
    
    // Test a small purchase
    console.log("\n🛒 Testing token purchase...");
    try {
      const purchaseAmount = web3.utils.toWei("0.1", "ether"); // 0.1 ETH
      const expectedTokens = (BigInt(purchaseAmount) * BigInt(10**18)) / BigInt(saleInfo._tokenPrice);
      
      console.log("   Purchase Amount:", web3.utils.fromWei(purchaseAmount, "ether"), "ETH");
      console.log("   Expected Tokens:", web3.utils.fromWei(expectedTokens.toString(), "ether"), "NWIS");
      
      await presale.purchaseTokens({ from: buyer1, value: purchaseAmount });
      console.log("   ✅ Purchase successful!");
      
      // Get buyer info
      const buyerInfo = await presale.getUserInfo(buyer1);
      console.log("   Buyer 1 total purchased:", web3.utils.fromWei(buyerInfo._purchased, "ether"), "ETH");
      console.log("   Buyer 1 tokens purchased:", web3.utils.fromWei(buyerInfo._tokensPurchased, "ether"), "NWIS");
      
    } catch (error) {
      console.log("   ❌ Purchase failed:", error.message);
    }
    
    console.log("\n🎯 To interact with the contract further:");
    console.log("1. Use Truffle console: truffle console");
    console.log("2. Or run this script: truffle exec scripts/interact-truffle.js");
    console.log("3. Or use the test script: truffle exec scripts/test-presale.js");
    
    callback();
    
  } catch (error) {
    console.error("❌ Script failed:", error);
    callback(error);
  }
};


