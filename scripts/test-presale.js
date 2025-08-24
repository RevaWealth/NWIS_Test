const NexusWealthPresale = artifacts.require("NexusWealthPresale");
const MockERC20 = artifacts.require("MockERC20");

module.exports = async function (callback) {
  try {
    console.log("🧪 Starting presale contract tests...");
    
    // Get deployed contracts
    const presale = await NexusWealthPresale.deployed();
    const token = await MockERC20.deployed();
    
    console.log("📋 Contract Addresses:");
    console.log("   Presale:", presale.address);
    console.log("   Token:", token.address);
    
    // Get sale info
    const saleInfo = await presale.getSaleInfo();
    console.log("\n📊 Sale Information:");
    console.log("   Sale Active:", saleInfo._saleActive);
    console.log("   Token Price:", web3.utils.fromWei(saleInfo._tokenPrice, "ether"), "ETH");
    console.log("   Total Tokens:", web3.utils.fromWei(saleInfo._totalTokensForSale, "ether"));
    console.log("   Tokens Sold:", web3.utils.fromWei(saleInfo._totalTokensSold, "ether"));
    console.log("   Min Purchase:", web3.utils.fromWei(saleInfo._minPurchase, "ether"), "ETH");
    console.log("   Max Purchase:", web3.utils.fromWei(saleInfo._maxPurchase, "ether"), "ETH");
    
    // Check token balance in presale contract
    const tokenBalance = await token.balanceOf(presale.address);
    console.log("\n💰 Token Balance in Presale Contract:");
    console.log("   Balance:", web3.utils.fromWei(tokenBalance, "ether"), "NWIS");
    
    // Get accounts for testing
    const accounts = await web3.eth.getAccounts();
    const buyer = accounts[1]; // Use second account as buyer
    
    console.log("\n👤 Test Buyer Account:", buyer);
    
    // Check buyer's ETH balance
    const buyerBalance = await web3.eth.getBalance(buyer);
    console.log("   ETH Balance:", web3.utils.fromWei(buyerBalance, "ether"), "ETH");
    
    // Test purchase (if sale is active)
    if (saleInfo._saleActive) {
      console.log("\n🛒 Testing token purchase...");
      
      const purchaseAmount = web3.utils.toWei("0.1", "ether"); // 0.1 ETH
      const expectedTokens = (BigInt(purchaseAmount) * BigInt(10**18)) / BigInt(saleInfo._tokenPrice);
      
      console.log("   Purchase Amount:", web3.utils.fromWei(purchaseAmount, "ether"), "ETH");
      console.log("   Expected Tokens:", web3.utils.fromWei(expectedTokens.toString(), "ether"), "NWIS");
      
      // Make purchase
      await presale.purchaseTokens({ from: buyer, value: purchaseAmount });
      console.log("   ✅ Purchase successful!");
      
      // Check updated sale info
      const updatedSaleInfo = await presale.getSaleInfo();
      console.log("   Updated Tokens Sold:", web3.utils.fromWei(updatedSaleInfo._totalTokensSold, "ether"), "NWIS");
      
      // Get buyer info
      const buyerInfo = await presale.getUserInfo(buyer);
      console.log("\n👤 Buyer Information:");
      console.log("   Total Purchased:", web3.utils.fromWei(buyerInfo._purchased, "ether"), "ETH");
      console.log("   Tokens Purchased:", web3.utils.fromWei(buyerInfo._tokensPurchased, "ether"), "NWIS");
      console.log("   Vested Amount:", web3.utils.fromWei(buyerInfo._vestedAmount, "ether"), "NWIS");
      console.log("   Claimable Amount:", web3.utils.fromWei(buyerInfo._claimableAmount, "ether"), "NWIS");
      
    } else {
      console.log("\n⏸️ Sale is not active. Activating sale...");
      
      // Activate sale
      await presale.setSaleStatus(true, { from: accounts[0] });
      console.log("   ✅ Sale activated!");
      
      // Set sale end time (1 hour from now)
      const endTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour
      await presale.setSaleEndTime(endTime, { from: accounts[0] });
      console.log("   ✅ Sale end time set to:", new Date(endTime * 1000));
      
      console.log("\n🛒 Now testing token purchase...");
      
      const purchaseAmount = web3.utils.toWei("0.1", "ether"); // 0.1 ETH
      const expectedTokens = (BigInt(purchaseAmount) * BigInt(10**18)) / BigInt(saleInfo._tokenPrice);
      
      console.log("   Purchase Amount:", web3.utils.fromWei(purchaseAmount, "ether"), "ETH");
      console.log("   Expected Tokens:", web3.utils.fromWei(expectedTokens.toString(), "ether"), "NWIS");
      
      // Make purchase
      await presale.purchaseTokens({ from: buyer, value: purchaseAmount });
      console.log("   ✅ Purchase successful!");
      
      // Get buyer info
      const buyerInfo = await presale.getUserInfo(buyer);
      console.log("\n👤 Buyer Information:");
      console.log("   Total Purchased:", web3.utils.fromWei(buyerInfo._purchased, "ether"), "ETH");
      console.log("   Tokens Purchased:", web3.utils.fromWei(buyerInfo._tokensPurchased, "ether"), "NWIS");
      console.log("   Vested Amount:", web3.utils.fromWei(buyerInfo._vestedAmount, "ether"), "NWIS");
      console.log("   Claimable Amount:", web3.utils.fromWei(buyerInfo._claimableAmount, "ether"), "NWIS");
    }
    
    console.log("\n🎉 All tests completed successfully!");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
  
  callback();
};


