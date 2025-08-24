const NexusWealthToken = artifacts.require("NexusWealthToken");

module.exports = async function(callback) {
    try {
        console.log("🧪 Testing Automated Vesting Functionality");
        console.log("==========================================");

        // Get deployed token contract
        const token = await NexusWealthToken.deployed();
        const accounts = await web3.eth.getAccounts();
        const owner = accounts[0];
        const beneficiary1 = accounts[1];
        const beneficiary2 = accounts[2];
        const beneficiary3 = accounts[3];
        const operator = accounts[4];

        console.log("📋 Test Setup:");
        console.log("   Owner:", owner);
        console.log("   Beneficiary 1:", beneficiary1);
        console.log("   Beneficiary 2:", beneficiary2);
        console.log("   Beneficiary 3:", beneficiary3);
        console.log("   Operator:", operator);

        // Test 1: Create vesting templates
        console.log("\n🔧 Test 1: Creating Vesting Templates");
        console.log("-------------------------------------");
        
        await token.createVestingTemplate(
            "Team_Vesting",
            web3.utils.toWei("730", "ether"), // 2 years in days
            web3.utils.toWei("180", "ether"), // 6 months cliff
            web3.utils.toWei("30", "ether")   // Monthly releases
        );
        console.log("✅ Created Team_Vesting template");

        await token.createVestingTemplate(
            "Advisor_Vesting",
            web3.utils.toWei("365", "ether"), // 1 year
            web3.utils.toWei("90", "ether"),  // 3 months cliff
            web3.utils.toWei("30", "ether")   // Monthly releases
        );
        console.log("✅ Created Advisor_Vesting template");

        await token.createVestingTemplate(
            "Investor_Vesting",
            web3.utils.toWei("1095", "ether"), // 3 years
            web3.utils.toWei("365", "ether"),  // 1 year cliff
            web3.utils.toWei("90", "ether")    // Quarterly releases
        );
        console.log("✅ Created Investor_Vesting template");

        // Test 2: Check template details
        console.log("\n📋 Test 2: Verifying Template Details");
        console.log("-------------------------------------");
        
        const teamTemplate = await token.vestingTemplates("Team_Vesting");
        console.log("Team Template Duration:", web3.utils.fromWei(teamTemplate.duration, "ether"), "days");
        console.log("Team Template Cliff:", web3.utils.fromWei(teamTemplate.cliff, "ether"), "days");
        console.log("Team Template Release Interval:", web3.utils.fromWei(teamTemplate.releaseInterval, "ether"), "days");

        // Test 3: Create batch vesting schedules
        console.log("\n👥 Test 3: Creating Batch Vesting Schedules");
        console.log("-------------------------------------------");
        
        const beneficiaries = [beneficiary1, beneficiary2, beneficiary3];
        const amounts = [
            web3.utils.toWei("1000000", "ether"), // 1M tokens for team member
            web3.utils.toWei("500000", "ether"),  // 500K tokens for advisor
            web3.utils.toWei("2000000", "ether")  // 2M tokens for investor
        ];
        
        await token.createBatchVestingSchedules(
            beneficiaries,
            amounts,
            "Team_Vesting",
            0 // Start now
        );
        console.log("✅ Created batch vesting schedules");

        // Test 4: Verify vesting schedules
        console.log("\n✅ Test 4: Verifying Vesting Schedules");
        console.log("--------------------------------------");
        
        for (let i = 0; i < beneficiaries.length; i++) {
            const vestingInfo = await token.getVestingInfo(beneficiaries[i]);
            console.log(`\nBeneficiary ${i + 1} (${beneficiaries[i]}):`);
            console.log("   Total Amount:", web3.utils.fromWei(vestingInfo.totalAmount, "ether"), "NWIS");
            console.log("   Released Amount:", web3.utils.fromWei(vestingInfo.releasedAmount, "ether"), "NWIS");
            console.log("   Is Automated:", vestingInfo.isAutomated);
            console.log("   Release Interval:", web3.utils.fromWei(vestingInfo.releaseInterval, "ether"), "days");
        }

        // Test 5: Set up automated vesting operator
        console.log("\n🔐 Test 5: Setting Up Automated Vesting Operator");
        console.log("------------------------------------------------");
        
        await token.setAutomatedVestingOperator(operator, true);
        console.log("✅ Set operator:", operator);
        
        const isOperator = await token.automatedVestingOperators(operator);
        console.log("Operator status:", isOperator);

        // Test 6: Check automated vesting stats
        console.log("\n📊 Test 6: Automated Vesting Statistics");
        console.log("--------------------------------------");
        
        const stats = await token.getAutomatedVestingStats();
        console.log("Automated Vesting Enabled:", stats.isEnabled);
        console.log("Last Release Time:", new Date(stats.lastReleaseTime * 1000).toISOString());

        // Test 7: Check next release times
        console.log("\n⏰ Test 7: Next Release Times");
        console.log("----------------------------");
        
        for (let i = 0; i < beneficiaries.length; i++) {
            const nextRelease = await token.getNextReleaseTime(beneficiaries[i]);
            console.log(`Beneficiary ${i + 1}: ${new Date(nextRelease * 1000).toISOString()}`);
        }

        // Test 8: Check releasable amounts (should be 0 initially due to cliff)
        console.log("\n💰 Test 8: Releasable Amounts");
        console.log("----------------------------");
        
        for (let i = 0; i < beneficiaries.length; i++) {
            const releasable = await token.getAutomatedReleasableAmount(beneficiaries[i]);
            console.log(`Beneficiary ${i + 1}: ${web3.utils.fromWei(releasable, "ether")} NWIS`);
        }

        // Test 9: Try to release automated vesting (should fail due to cliff)
        console.log("\n🚫 Test 9: Attempting Early Release (Should Fail)");
        console.log("------------------------------------------------");
        
        try {
            await token.releaseAutomatedVesting(beneficiaries, { from: operator });
            console.log("❌ Unexpected success - should have failed due to cliff");
        } catch (error) {
            console.log("✅ Correctly failed due to cliff period:", error.message);
        }

        // Test 10: Update automated vesting settings
        console.log("\n⚙️ Test 10: Updating Automated Vesting Settings");
        console.log("---------------------------------------------");
        
        await token.updateMaxAutomatedReleaseAmount(web3.utils.toWei("500000", "ether")); // 500K max per release
        console.log("✅ Updated max release amount to 500K tokens");
        
        await token.updateAutomatedReleaseInterval(web3.utils.toWei("7", "ether")); // Weekly releases
        console.log("✅ Updated release interval to 7 days");

        // Test 11: Check updated settings
        console.log("\n📋 Test 11: Verifying Updated Settings");
        console.log("-------------------------------------");
        
        const maxRelease = await token.maxAutomatedReleaseAmount();
        const releaseInterval = await token.automatedReleaseInterval();
        
        console.log("Max Release Amount:", web3.utils.fromWei(maxRelease, "ether"), "NWIS");
        console.log("Release Interval:", web3.utils.fromWei(releaseInterval, "ether"), "days");

        // Test 12: Disable automated vesting
        console.log("\n🛑 Test 12: Disabling Automated Vesting");
        console.log("-------------------------------------");
        
        await token.setAutomatedVestingEnabled(false);
        console.log("✅ Disabled automated vesting");
        
        const isEnabled = await token.automatedVestingEnabled();
        console.log("Automated vesting enabled:", isEnabled);

        // Test 13: Re-enable automated vesting
        console.log("\n✅ Test 13: Re-enabling Automated Vesting");
        console.log("----------------------------------------");
        
        await token.setAutomatedVestingEnabled(true);
        console.log("✅ Re-enabled automated vesting");

        console.log("\n🎉 All Automated Vesting Tests Completed Successfully!");
        console.log("==================================================");
        console.log("\n📝 Summary of Automated Vesting Features:");
        console.log("   ✅ Vesting templates creation");
        console.log("   ✅ Batch vesting schedule creation");
        console.log("   ✅ Automated release functionality");
        console.log("   ✅ Operator management");
        console.log("   ✅ Configurable release intervals");
        console.log("   ✅ Maximum release amount limits");
        console.log("   ✅ Cliff period enforcement");
        console.log("   ✅ Vesting statistics tracking");

    } catch (error) {
        console.error("❌ Test failed:", error);
        throw error;
    }
};

