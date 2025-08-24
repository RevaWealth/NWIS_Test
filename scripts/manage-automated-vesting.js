const NexusWealthToken = artifacts.require("NexusWealthToken");

module.exports = async function(callback) {
    try {
        console.log("🤖 Automated Vesting Management System");
        console.log("====================================");

        const token = await NexusWealthToken.deployed();
        const accounts = await web3.eth.getAccounts();
        const owner = accounts[0];

        // Helper function to format token amounts
        const formatTokens = (amount) => {
            return web3.utils.fromWei(amount, "ether");
        };

        // Helper function to format time
        const formatTime = (timestamp) => {
            return new Date(timestamp * 1000).toISOString();
        };

        // Display current automated vesting status
        console.log("\n📊 Current Automated Vesting Status:");
        console.log("-----------------------------------");
        
        const stats = await token.getAutomatedVestingStats();
        console.log("Enabled:", stats.isEnabled);
        console.log("Last Release Time:", formatTime(stats.lastReleaseTime));
        console.log("Release Interval:", formatTokens(await token.automatedReleaseInterval()), "days");
        console.log("Max Release Amount:", formatTokens(await token.maxAutomatedReleaseAmount()), "NWIS");

        // Display available templates
        console.log("\n📋 Available Vesting Templates:");
        console.log("-------------------------------");
        
        const templateNames = ["Team_Vesting", "Advisor_Vesting", "Investor_Vesting"];
        for (const name of templateNames) {
            try {
                const template = await token.vestingTemplates(name);
                if (template.name !== "") {
                    console.log(`\n${name}:`);
                    console.log("   Duration:", formatTokens(template.duration), "days");
                    console.log("   Cliff:", formatTokens(template.cliff), "days");
                    console.log("   Release Interval:", formatTokens(template.releaseInterval), "days");
                    console.log("   Revocable:", template.revocable);
                }
            } catch (error) {
                // Template doesn't exist
            }
        }

        // Display active automated vesting schedules
        console.log("\n👥 Active Automated Vesting Schedules:");
        console.log("-------------------------------------");
        
        // Note: In a real implementation, you'd track automated schedules separately
        // For now, we'll show a sample of how to check specific addresses
        const sampleAddresses = [accounts[1], accounts[2], accounts[3]];
        
        for (let i = 0; i < sampleAddresses.length; i++) {
            try {
                const vestingInfo = await token.getVestingInfo(sampleAddresses[i]);
                if (vestingInfo.totalAmount > 0 && vestingInfo.isAutomated) {
                    console.log(`\nBeneficiary ${i + 1} (${sampleAddresses[i]}):`);
                    console.log("   Total Amount:", formatTokens(vestingInfo.totalAmount), "NWIS");
                    console.log("   Released Amount:", formatTokens(vestingInfo.releasedAmount), "NWIS");
                    console.log("   Remaining:", formatTokens(vestingInfo.totalAmount - vestingInfo.releasedAmount), "NWIS");
                    console.log("   Start Time:", formatTime(vestingInfo.startTime));
                    console.log("   Next Release:", formatTime(await token.getNextReleaseTime(sampleAddresses[i])));
                    
                    const releasable = await token.getAutomatedReleasableAmount(sampleAddresses[i]);
                    console.log("   Currently Releasable:", formatTokens(releasable), "NWIS");
                }
            } catch (error) {
                // No vesting schedule for this address
            }
        }

        // Management functions
        console.log("\n🔧 Available Management Functions:");
        console.log("--------------------------------");
        console.log("1. Create new vesting template");
        console.log("2. Create batch vesting schedules");
        console.log("3. Release automated vesting");
        console.log("4. Update automated vesting settings");
        console.log("5. Manage operators");
        console.log("6. View detailed vesting info");

        // Example: Create a new template
        console.log("\n📝 Example: Creating a New Vesting Template");
        console.log("------------------------------------------");
        
        try {
            await token.createVestingTemplate(
                "Partnership_Vesting",
                web3.utils.toWei("548", "ether"), // 1.5 years
                web3.utils.toWei("180", "ether"), // 6 months cliff
                web3.utils.toWei("60", "ether")   // Bi-monthly releases
            );
            console.log("✅ Created Partnership_Vesting template");
        } catch (error) {
            console.log("Template already exists or error:", error.message);
        }

        // Example: Update automated vesting settings
        console.log("\n⚙️ Example: Updating Automated Vesting Settings");
        console.log("---------------------------------------------");
        
        const currentMaxRelease = await token.maxAutomatedReleaseAmount();
        const newMaxRelease = web3.utils.toWei("750000", "ether"); // 750K tokens
        
        if (currentMaxRelease.toString() !== newMaxRelease.toString()) {
            await token.updateMaxAutomatedReleaseAmount(newMaxRelease);
            console.log("✅ Updated max release amount to 750K tokens");
        } else {
            console.log("Max release amount already set to 750K tokens");
        }

        // Example: Set up an operator
        console.log("\n🔐 Example: Setting Up Automated Vesting Operator");
        console.log("------------------------------------------------");
        
        const newOperator = accounts[5];
        await token.setAutomatedVestingOperator(newOperator, true);
        console.log("✅ Set operator:", newOperator);
        
        const isOperator = await token.automatedVestingOperators(newOperator);
        console.log("Operator status:", isOperator);

        // Example: Check if automated release is possible
        console.log("\n⏰ Example: Checking Automated Release Readiness");
        console.log("---------------------------------------------");
        
        const currentTime = Math.floor(Date.now() / 1000);
        const lastRelease = await token.lastAutomatedReleaseTime();
        const interval = await token.automatedReleaseInterval();
        
        console.log("Current Time:", formatTime(currentTime));
        console.log("Last Release:", formatTime(lastRelease));
        console.log("Release Interval:", formatTokens(interval), "days");
        
        const timeSinceLastRelease = currentTime - lastRelease;
        const canRelease = timeSinceLastRelease >= interval;
        
        console.log("Time Since Last Release:", formatTokens(web3.utils.toBN(timeSinceLastRelease)), "days");
        console.log("Can Release:", canRelease);

        // Example: Prepare beneficiaries for release
        console.log("\n💰 Example: Preparing Beneficiaries for Release");
        console.log("---------------------------------------------");
        
        const beneficiariesToRelease = [];
        for (let i = 0; i < sampleAddresses.length; i++) {
            try {
                const releasable = await token.getAutomatedReleasableAmount(sampleAddresses[i]);
                if (releasable > 0) {
                    beneficiariesToRelease.push(sampleAddresses[i]);
                    console.log(`Beneficiary ${i + 1}: ${formatTokens(releasable)} NWIS releasable`);
                }
            } catch (error) {
                // No automated vesting schedule
            }
        }

        if (beneficiariesToRelease.length > 0 && canRelease) {
            console.log(`\n🎯 Ready to release for ${beneficiariesToRelease.length} beneficiaries`);
            console.log("To execute release, call:");
            console.log(`await token.releaseAutomatedVesting([${beneficiariesToRelease.map(addr => `"${addr}"`).join(", ")}], { from: "${owner}" })`);
        } else if (beneficiariesToRelease.length === 0) {
            console.log("No beneficiaries have releasable amounts");
        } else {
            console.log("Not enough time has passed since last release");
        }

        console.log("\n🎉 Automated Vesting Management Complete!");
        console.log("========================================");
        console.log("\n💡 Tips for Automated Vesting:");
        console.log("   • Set up templates for different vesting types");
        console.log("   • Use batch creation for multiple beneficiaries");
        console.log("   • Configure appropriate release intervals");
        console.log("   • Set reasonable max release amounts");
        console.log("   • Monitor release times and amounts");
        console.log("   • Use operators for decentralized management");

    } catch (error) {
        console.error("❌ Management script failed:", error);
        throw error;
    }
};

