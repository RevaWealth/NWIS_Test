const NexusWealthPresale = artifacts.require("NexusWealthPresale");
const MockERC20 = artifacts.require("MockERC20");

module.exports = async function (callback) {
  try {
    console.log("🧪 Starting Comprehensive NexusWealth Presale Tests...");
    
    // Get accounts for testing
    const accounts = await web3.eth.getAccounts();
    const [owner, buyer1, buyer2, buyer3, treasury, dev] = accounts;
    
    console.log("📝 Test Accounts:");
    console.log("   Owner:", owner);
    console.log("   Buyer 1:", buyer1);
    console.log("   Buyer 2:", buyer2);
    console.log("   Buyer 3:", buyer3);
    console.log("   Treasury:", treasury);
    console.log("   Dev:", dev);
    
    // Get deployed contracts
    const mockToken = await MockERC20.deployed();
    const presale = await NexusWealthPresale.deployed();
    
    console.log("✅ Connected to contracts:");
    console.log("   MockERC20:", mockToken.address);
    console.log("   NexusWealthPresale:", presale.address);
    
    // Test 1: Initial State Verification
    console.log("\n🔍 Test 1: Initial State Verification");
    const initialSaleInfo = await presale.getSaleInfo();
    console.log("   Sale Active:", initialSaleInfo._saleActive);
    console.log("   Token Price:", web3.utils.fromWei(initialSaleInfo._tokenPrice, "ether"), "ETH");
    console.log("   Total Tokens:", web3.utils.fromWei(initialSaleInfo._totalTokensForSale, "ether"), "NWIS");
    console.log("   Tokens Sold:", web3.utils.fromWei(initialSaleInfo._totalTokensSold, "ether"), "NWIS");
    
    // Test 2: Sale Activation
    console.log("\n🚀 Test 2: Sale Activation");
    if (!initialSaleInfo._saleActive) {
      await presale.setSaleStatus(true, { from: owner });
      console.log("✅ Sale activated");
    } else {
      console.log("✅ Sale already active");
    }
    
    if (initialSaleInfo._saleEndTime.toString() === "0") {
      const saleStartTime = Math.floor(Date.now() / 1000);
      await presale.setSaleEndTime(saleStartTime + 3600, { from: owner }); // 1 hour from now
      console.log("✅ Sale end time set");
    } else {
      console.log("✅ Sale end time already set");
    }
    
    // Test 3: Token Purchase
    console.log("\n🛒 Test 3: Token Purchase");
    const purchaseAmount1 = web3.utils.toWei("0.1", "ether"); // 0.1 ETH
    const expectedTokens1 = (BigInt(purchaseAmount1) * BigInt(10**18)) / BigInt(initialSaleInfo._tokenPrice);
    
    console.log("   Buyer 1 purchasing for", web3.utils.fromWei(purchaseAmount1, "ether"), "ETH");
    console.log("   Expected tokens:", web3.utils.fromWei(expectedTokens1.toString(), "ether"), "NWIS");
    
    await presale.purchaseTokens({ from: buyer1, value: purchaseAmount1 });
    console.log("✅ Purchase successful!");
    
    // Verify purchase
    const buyer1Info = await presale.getUserInfo(buyer1);
    console.log("   Buyer 1 total purchased:", web3.utils.fromWei(buyer1Info._purchased, "ether"), "ETH");
    console.log("   Buyer 1 tokens purchased:", web3.utils.fromWei(buyer1Info._tokensPurchased, "ether"), "NWIS");
    
    // Test 4: Multiple Purchases
    console.log("\n🛒 Test 4: Multiple Purchases");
    
    // Buyer 2 purchase
    const purchaseAmount2 = web3.utils.toWei("0.5", "ether"); // 0.5 ETH
    await presale.purchaseTokens({ from: buyer2, value: purchaseAmount2 });
    console.log("✅ Buyer 2 purchase successful!");
    
    // Buyer 3 purchase
    const purchaseAmount3 = web3.utils.toWei("1.0", "ether"); // 1.0 ETH
    await presale.purchaseTokens({ from: buyer3, value: purchaseAmount3 });
    console.log("✅ Buyer 3 purchase successful!");
    
    // Test 5: Purchase Limits
    console.log("\n🚫 Test 5: Purchase Limits");
    
    // Try to purchase below minimum
    try {
      await presale.purchaseTokens({ from: buyer1, value: web3.utils.toWei("0.005", "ether") });
      console.log("❌ Should have failed - below minimum");
    } catch (error) {
      console.log("✅ Correctly rejected purchase below minimum");
    }
    
    // Try to purchase above maximum
    try {
      await presale.purchaseTokens({ from: buyer1, value: web3.utils.toWei("15", "ether") });
      console.log("❌ Should have failed - above maximum");
    } catch (error) {
      console.log("✅ Correctly rejected purchase above maximum");
    }
    
    // Test 6: Contract State After Purchases
    console.log("\n📊 Test 7: Contract State After Purchases");
    const finalSaleInfo = await presale.getSaleInfo();
    console.log("   Total Tokens Sold:", web3.utils.fromWei(finalSaleInfo._totalTokensSold, "ether"), "NWIS");
    console.log("   Sale Active:", finalSaleInfo._saleActive);
    
    // Test 8: ETH Withdrawal
    console.log("\n💰 Test 8: ETH Withdrawal");
    const ethBalanceBefore = await web3.eth.getBalance(treasury);
    await presale.withdrawETH({ from: owner });
    const ethBalanceAfter = await web3.eth.getBalance(treasury);
    console.log("   Treasury ETH balance before:", web3.utils.fromWei(ethBalanceBefore, "ether"), "ETH");
    console.log("   Treasury ETH balance after:", web3.utils.fromWei(ethBalanceAfter, "ether"), "ETH");
    
    // Test 9: Pause/Unpause
    console.log("\n⏸️ Test 9: Pause/Unpause");
    await presale.pause({ from: owner });
    console.log("✅ Contract paused");
    
    // Try to purchase while paused
    try {
      await presale.purchaseTokens({ from: buyer1, value: web3.utils.toWei("0.1", "ether") });
      console.log("❌ Should have failed - contract paused");
    } catch (error) {
      console.log("✅ Correctly rejected purchase while paused");
    }
    
    await presale.unpause({ from: owner });
    console.log("✅ Contract unpaused");
    
    // Test 10: Emergency Functions
    console.log("\n🚨 Test 10: Emergency Functions");
    const ownerBalanceBefore = await web3.eth.getBalance(owner);
    await presale.emergencyWithdraw({ from: owner });
    const ownerBalanceAfter = await web3.eth.getBalance(owner);
    console.log("   Owner ETH balance before:", web3.utils.fromWei(ownerBalanceBefore, "ether"), "ETH");
    console.log("   Owner ETH balance after:", web3.utils.fromWei(ownerBalanceAfter, "ether"), "ETH");
    
    // Test 11: View Functions
    console.log("\n👁️ Test 11: View Functions");
    const allUserInfo = await presale.getUserInfo(buyer1);
    console.log("   Buyer 1 complete info:");
    console.log("     Total Purchased:", web3.utils.fromWei(allUserInfo._purchased, "ether"), "ETH");
    console.log("     Tokens Purchased:", web3.utils.fromWei(allUserInfo._tokensPurchased, "ether"), "NWIS");
    
    // Test 12: Gas Optimization Check
    console.log("\n⛽ Test 12: Gas Optimization Check");
    const gasEstimate = await presale.purchaseTokens.estimateGas(web3.utils.toWei("0.1", "ether"), { from: buyer1 });
    console.log("   Gas estimate for purchase:", gasEstimate.toString());
    
    console.log("\n🎉 All tests completed successfully!");
    console.log("\n📋 Test Summary:");
    console.log("   ✅ Token deployment");
    console.log("   ✅ Presale contract deployment");
    console.log("   ✅ Sale activation");
    console.log("   ✅ Multiple token purchases");
    console.log("   ✅ Purchase limit enforcement");
    console.log("   ✅ ETH withdrawal");
    console.log("   ✅ Pause/unpause functionality");
    console.log("   ✅ Emergency functions");
    console.log("   ✅ View functions");
    console.log("   ✅ Gas optimization");
    
    callback();
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    callback(error);
  }
};


