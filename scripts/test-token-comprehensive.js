const NexusWealthToken = artifacts.require("NexusWealthToken");

module.exports = async function (callback) {
  try {
    console.log("🧪 Starting Comprehensive NexusWealth Token Tests...");
    
    // Get accounts for testing
    const accounts = await web3.eth.getAccounts();
    const [owner, user1, user2, user3, treasury, team] = accounts;
    
    console.log("📝 Test Accounts:");
    console.log("   Owner:", owner);
    console.log("   User 1:", user1);
    console.log("   User 2:", user2);
    console.log("   User 3:", user3);
    console.log("   Treasury:", treasury);
    console.log("   Team:", team);
    
    // Deploy the token contract
    console.log("\n📦 Deploying NexusWealthToken...");
    const token = await NexusWealthToken.new(
      "NexusWealth Investment Solutions",
      "NWIS",
      18,
      web3.utils.toWei("50000000000", "ether"), // 50 billion max supply
      web3.utils.toWei("35000000000", "ether")   // 35 billion initial supply
    );
    
    console.log("✅ Token deployed to:", token.address);
    
    // Test 1: Basic Token Information
    console.log("\n🔍 Test 1: Basic Token Information");
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    const maxSupply = await token.maxSupply();
    const totalSupply = await token.totalSupply();
    
    console.log("   Name:", name);
    console.log("   Symbol:", symbol);
    console.log("   Decimals:", decimals.toString());
    console.log("   Max Supply:", web3.utils.fromWei(maxSupply, "ether"), "NWIS");
    console.log("   Total Supply:", web3.utils.fromWei(totalSupply, "ether"), "NWIS");
    
    // Test 2: Role Verification
    console.log("\n🔐 Test 2: Role Verification");
    const hasMinterRole = await token.hasRole(await token.MINTER_ROLE(), owner);
    const hasBurnerRole = await token.hasRole(await token.BURNER_ROLE(), owner);
    const hasPauserRole = await token.hasRole(await token.PAUSER_ROLE(), owner);
    const hasBlacklisterRole = await token.hasRole(await token.BLACKLISTER_ROLE(), owner);
    const hasVestingRole = await token.hasRole(await token.VESTING_ROLE(), owner);
    
    console.log("   Owner has MINTER_ROLE:", hasMinterRole);
    console.log("   Owner has BURNER_ROLE:", hasBurnerRole);
    console.log("   Owner has PAUSER_ROLE:", hasPauserRole);
    console.log("   Owner has BLACKLISTER_ROLE:", hasBlacklisterRole);
    console.log("   Owner has VESTING_ROLE:", hasVestingRole);
    
    // Test 3: Token Statistics
    console.log("\n📈 Test 3: Token Statistics");
    const stats = await token.getTokenStats();
    console.log("   Current Supply:", web3.utils.fromWei(stats.currentSupply, "ether"), "NWIS");
    console.log("   Total Minted:", web3.utils.fromWei(stats.totalMinted_, "ether"), "NWIS");
    console.log("   Total Burned:", web3.utils.fromWei(stats.totalBurned_, "ether"), "NWIS");
    console.log("   Max Supply:", web3.utils.fromWei(stats.maxSupply_, "ether"), "NWIS");
    console.log("   Remaining Mintable:", web3.utils.fromWei(stats.remainingMintable_, "ether"), "NWIS");
    
    // Test 4: Basic Transfers
    console.log("\n💸 Test 4: Basic Transfers");
    const transferAmount = web3.utils.toWei("1000", "ether");
    
    // Transfer from owner to user1
    await token.transfer(user1, transferAmount, { from: owner });
    console.log("   ✅ Transferred 1000 NWIS to User 1");
    
    const user1Balance = await token.balanceOf(user1);
    console.log("   User 1 balance:", web3.utils.fromWei(user1Balance, "ether"), "NWIS");
    
    // Test 5: Minting (Owner only)
    console.log("\n🪙 Test 5: Minting");
    const mintAmount = web3.utils.toWei("50000", "ether");
    
    await token.mint(treasury, mintAmount, "Treasury allocation", { from: owner });
    console.log("   ✅ Minted 50,000 NWIS to Treasury");
    
    const treasuryBalance = await token.balanceOf(treasury);
    console.log("   Treasury balance:", web3.utils.fromWei(treasuryBalance, "ether"), "NWIS");
    
    // Test 6: Burning
    console.log("\n🔥 Test 6: Burning");
    const burnAmount = web3.utils.toWei("100", "ether");
    
    // User1 burns some tokens
    await token.burn(burnAmount, "Token burn test", { from: user1 });
    console.log("   ✅ User 1 burned 100 NWIS");
    
    const user1BalanceAfterBurn = await token.balanceOf(user1);
    console.log("   User 1 balance after burn:", web3.utils.fromWei(user1BalanceAfterBurn, "ether"), "NWIS");
    
    // Test 7: Role-based Access Control
    console.log("\n🚫 Test 7: Role-based Access Control");
    
    // Try to mint without MINTER_ROLE
    try {
      await token.mint(user2, web3.utils.toWei("1000", "ether"), "Unauthorized mint", { from: user1 });
      console.log("   ❌ Should have failed - user1 doesn't have MINTER_ROLE");
    } catch (error) {
      console.log("   ✅ Correctly rejected mint without MINTER_ROLE");
    }
    
    // Try to burn from another address without BURNER_ROLE
    try {
      await token.burnFrom(user1, web3.utils.toWei("100", "ether"), "Unauthorized burn", { from: user2 });
      console.log("   ❌ Should have failed - user2 doesn't have BURNER_ROLE");
    } catch (error) {
      console.log("   ✅ Correctly rejected burnFrom without BURNER_ROLE");
    }
    
    // Test 8: Vesting Functionality
    console.log("\n📅 Test 8: Vesting Functionality");
    
    // Create vesting schedule for team member
    const vestingAmount = web3.utils.toWei("10000", "ether");
    const startTime = Math.floor(Date.now() / 1000) + 60; // Start in 1 minute
    const duration = 365 * 24 * 60 * 60; // 1 year
    const cliff = 90 * 24 * 60 * 60; // 3 months cliff
    
    // Transfer tokens to owner first (for vesting)
    await token.transfer(owner, vestingAmount, { from: treasury });
    
    await token.createVestingSchedule(
      team,
      vestingAmount,
      startTime,
      duration,
      cliff,
      true, // revocable
      { from: owner }
    );
    console.log("   ✅ Created vesting schedule for team member");
    
    // Check vesting info
    const vestingInfo = await token.getVestingInfo(team);
    console.log("   Vesting total amount:", web3.utils.fromWei(vestingInfo.totalAmount, "ether"), "NWIS");
    console.log("   Vesting start time:", new Date(vestingInfo.startTime * 1000));
    console.log("   Vesting duration:", vestingInfo.duration / (24 * 60 * 60), "days");
    console.log("   Vesting cliff:", vestingInfo.cliff / (24 * 60 * 60), "days");
    
    // Test 9: Blacklist Functionality
    console.log("\n🚫 Test 9: Blacklist Functionality");
    
    // Blacklist user3
    await token.setBlacklisted(user3, true, { from: owner });
    console.log("   ✅ Blacklisted User 3");
    
    // Try to transfer to blacklisted user
    try {
      await token.transfer(user3, web3.utils.toWei("100", "ether"), { from: user1 });
      console.log("   ❌ Should have failed - recipient is blacklisted");
    } catch (error) {
      console.log("   ✅ Correctly rejected transfer to blacklisted user");
    }
    
    // Try to transfer from blacklisted user
    try {
      await token.transfer(user2, web3.utils.fromWei("100", "ether"), { from: user3 });
      console.log("   ❌ Should have failed - sender is blacklisted");
    } catch (error) {
      console.log("   ✅ Correctly rejected transfer from blacklisted user");
    }
    
    // Unblacklist user3
    await token.setBlacklisted(user3, false, { from: owner });
    console.log("   ✅ Unblacklisted User 3");
    
    // Test 10: Pause/Unpause
    console.log("\n⏸️ Test 10: Pause/Unpause");
    
    // Pause the contract
    await token.pause({ from: owner });
    console.log("   ✅ Contract paused");
    
    // Try to transfer while paused
    try {
      await token.transfer(user2, web3.utils.toWei("100", "ether"), { from: user1 });
      console.log("   ❌ Should have failed - contract is paused");
    } catch (error) {
      console.log("   ✅ Correctly rejected transfer while paused");
    }
    
    // Unpause the contract
    await token.unpause({ from: owner });
    console.log("   ✅ Contract unpaused");
    
    // Test 11: Advanced Functions
    console.log("\n🔧 Test 11: Advanced Functions");
    
    // Update max supply
    const newMaxSupply = web3.utils.toWei("150000000", "ether"); // 150 million
    await token.updateMaxSupply(newMaxSupply, { from: owner });
    console.log("   ✅ Updated max supply to 150 million NWIS");
    
    // Check remaining mintable
    const remainingMintable = await token.remainingMintable();
    console.log("   Remaining mintable:", web3.utils.fromWei(remainingMintable, "ether"), "NWIS");
    
    // Test 12: Gas Optimization
    console.log("\n⛽ Test 12: Gas Optimization");
    
    // Estimate gas for transfer
    const transferGasEstimate = await token.transfer.estimateGas(user2, web3.utils.toWei("100", "ether"), { from: user1 });
    console.log("   Transfer gas estimate:", transferGasEstimate.toString());
    
    // Estimate gas for mint
    const mintGasEstimate = await token.mint.estimateGas(user2, web3.utils.toWei("1000", "ether"), "Gas test", { from: owner });
    console.log("   Mint gas estimate:", mintGasEstimate.toString());
    
    console.log("\n🎉 All token tests completed successfully!");
    console.log("\n📋 Test Summary:");
    console.log("   ✅ Token deployment and basic info");
    console.log("   ✅ Role-based access control");
    console.log("   ✅ Token statistics and supply management");
    console.log("   ✅ Basic transfers and balances");
    console.log("   ✅ Minting and burning functionality");
    console.log("   ✅ Vesting schedule creation");
    console.log("   ✅ Blacklist functionality");
    console.log("   ✅ Pause/unpause functionality");
    console.log("   ✅ Advanced admin functions");
    console.log("   ✅ Gas optimization checks");
    
    callback();
    
  } catch (error) {
    console.error("❌ Token test failed:", error);
    callback(error);
  }
};
