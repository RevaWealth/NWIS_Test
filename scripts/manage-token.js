const NexusWealthToken = artifacts.require("NexusWealthToken");

module.exports = async function (callback) {
  try {
    console.log("🔧 NexusWealth Investment Solutions Token Management Script");
    
    // Get deployed token contract
    const token = await NexusWealthToken.deployed();
    console.log("✅ Connected to token contract:", token.address);
    
    // Get accounts
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const treasury = accounts[3];
    const team = accounts[4];
    
    console.log("📝 Available accounts:");
    console.log("   Owner:", owner);
    console.log("   User 1:", user1);
    console.log("   User 2:", user2);
    console.log("   Treasury:", treasury);
    console.log("   Team:", team);
    
    // Display current token state
    console.log("\n📊 Current Token State:");
    
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    const maxSupply = await token.maxSupply();
    const totalSupply = await token.totalSupply();
    const stats = await token.getTokenStats();
    
    console.log("   Name:", name);
    console.log("   Symbol:", symbol);
    console.log("   Decimals:", decimals.toString());
    console.log("   Max Supply:", web3.utils.fromWei(maxSupply, "ether"), "NWIS (50 billion)");
    console.log("📊 Token Statistics:");
    console.log(`   Current Supply: ${web3.utils.fromWei(stats.currentSupply, "ether")} NWIS`);
    console.log(`   Total Minted: ${web3.utils.fromWei(stats.totalMinted_, "ether")} NWIS`);
    console.log(`   Total Burned: ${web3.utils.fromWei(stats.totalBurned_, "ether")} NWIS`);
    console.log(`   Max Supply: ${web3.utils.fromWei(stats.maxSupply_, "ether")} NWIS`);
    console.log(`   Remaining Mintable: ${web3.utils.fromWei(stats.remainingMintable_, "ether")} NWIS`);
    console.log(`   Initial Supply: 35,000,000,000 NWIS (35 billion)`);
    
    // Check balances
    console.log("\n💰 Account Balances:");
    const ownerBalance = await token.balanceOf(owner);
    const user1Balance = await token.balanceOf(user1);
    const user2Balance = await token.balanceOf(user2);
    const treasuryBalance = await token.balanceOf(treasury);
    const teamBalance = await token.balanceOf(team);
    
    console.log("   Owner:", web3.utils.fromWei(ownerBalance, "ether"), "NWIS");
    console.log("   User 1:", web3.utils.fromWei(user1Balance, "ether"), "NWIS");
    console.log("   User 2:", web3.utils.fromWei(user2Balance, "ether"), "NWIS");
    console.log("   Treasury:", web3.utils.fromWei(treasuryBalance, "ether"), "NWIS");
    console.log("   Team:", web3.utils.fromWei(teamBalance, "ether"), "NWIS");
    
    // Check roles
    console.log("\n🔐 Role Verification:");
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
    
    // Interactive menu
    console.log("\n🔧 Available Actions:");
    console.log("1. Mint tokens");
    console.log("2. Burn tokens");
    console.log("3. Transfer tokens");
    console.log("4. Create vesting schedule");
    console.log("5. Release vested tokens");
    console.log("6. Blacklist/Unblacklist account");
    console.log("7. Pause/Unpause contract");
    console.log("8. Update max supply");
    console.log("9. Grant/Revoke roles");
    console.log("10. View vesting schedules");
    console.log("11. Exit");
    
    // Demo some common operations
    console.log("\n💡 Common Operations Demo:");
    
    // Mint some tokens to treasury
    if (hasMinterRole) {
      console.log("\n🪙 Minting tokens to Treasury...");
      try {
        const mintAmount = web3.utils.toWei("25000", "ether");
        await token.mint(treasury, mintAmount, "Treasury allocation", { from: owner });
        console.log("   ✅ Minted 25,000 NWIS to Treasury");
        
        const newTreasuryBalance = await token.balanceOf(treasury);
        console.log("   New Treasury balance:", web3.utils.fromWei(newTreasuryBalance, "ether"), "NWIS");
      } catch (error) {
        console.log("   ❌ Minting failed:", error.message);
      }
    }
    
    // Create a vesting schedule for team member
    if (hasVestingRole) {
      console.log("\n📅 Creating vesting schedule for Team...");
      try {
        const vestingAmount = web3.utils.toWei("5000", "ether");
        const startTime = Math.floor(Date.now() / 1000) + 300; // Start in 5 minutes
        const duration = 180 * 24 * 60 * 60; // 6 months
        const cliff = 30 * 24 * 60 * 60; // 1 month cliff
        
        // Transfer tokens to owner first (for vesting)
        if (web3.utils.fromWei(ownerBalance, "ether") >= 5000) {
          await token.createVestingSchedule(
            team,
            vestingAmount,
            startTime,
            duration,
            cliff,
            true, // revocable
            { from: owner }
          );
          console.log("   ✅ Created vesting schedule for Team member");
          console.log("   Vesting amount: 5,000 NWIS");
          console.log("   Start time:", new Date(startTime * 1000));
          console.log("   Duration: 6 months");
          console.log("   Cliff: 1 month");
        } else {
          console.log("   ⚠️ Owner doesn't have enough tokens for vesting");
        }
      } catch (error) {
        console.log("   ❌ Vesting schedule creation failed:", error.message);
      }
    }
    
    // Check vesting schedules
    console.log("\n📋 Vesting Schedules:");
    const teamVestingInfo = await token.getVestingInfo(team);
    if (teamVestingInfo.totalAmount > 0) {
      console.log("   Team member vesting:");
      console.log("     Total amount:", web3.utils.fromWei(teamVestingInfo.totalAmount, "ether"), "NWIS");
      console.log("     Released amount:", web3.utils.fromWei(teamVestingInfo.releasedAmount, "ether"), "NWIS");
      console.log("     Start time:", new Date(teamVestingInfo.startTime * 1000));
      console.log("     Duration:", teamVestingInfo.duration / (24 * 60 * 60), "days");
      console.log("     Cliff:", teamVestingInfo.cliff / (24 * 60 * 60), "days");
      console.log("     Revocable:", teamVestingInfo.revocable);
      console.log("     Revoked:", teamVestingInfo.revoked);
      
      // Check claimable amount
      const claimableAmount = await token.getClaimableAmount(team);
      console.log("     Claimable amount:", web3.utils.fromWei(claimableAmount, "ether"), "NWIS");
    } else {
      console.log("   No vesting schedules found");
    }
    
    // Check blacklisted accounts
    console.log("\n🚫 Blacklisted Accounts:");
    const isOwnerBlacklisted = await token.isBlacklisted(owner);
    const isUser1Blacklisted = await token.isBlacklisted(user1);
    const isUser2Blacklisted = await token.isBlacklisted(user2);
    
    console.log("   Owner blacklisted:", isOwnerBlacklisted);
    console.log("   User 1 blacklisted:", isUser1Blacklisted);
    console.log("   User 2 blacklisted:", isUser2Blacklisted);
    
    // Check contract pause status
    console.log("\n⏸️ Contract Status:");
    try {
      const paused = await token.paused();
      console.log("   Contract paused:", paused);
    } catch (error) {
      console.log("   Could not check pause status");
    }
    
    console.log("\n🎯 To manage the token further:");
    console.log("1. Use Truffle console: truffle console");
    console.log("2. Run this script: truffle exec scripts/manage-token.js");
    console.log("3. Use the test script: truffle exec scripts/test-token-comprehensive.js");
    
    callback();
    
  } catch (error) {
    console.error("❌ Token management script failed:", error);
    callback(error);
  }
};
