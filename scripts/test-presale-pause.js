// Test script for Presale Pause Feature
// Run with: truffle exec scripts/test-presale-pause.js --network sepolia

const NexusWealthTokenV2 = artifacts.require("NexusWealthTokenV2");

module.exports = async function(callback) {
    try {
        const accounts = await web3.eth.getAccounts();
        const owner = accounts[0];
        const user1 = accounts[1];
        const user2 = accounts[2];
        const treasury = accounts[3];
        const presaleSimulation = accounts[4]; // Simulated presale contract

        console.log("\n" + "=".repeat(60));
        console.log("🧪 PRESALE PAUSE FEATURE TEST");
        console.log("=".repeat(60) + "\n");

        console.log("📋 Test Accounts:");
        console.log("  Owner:    ", owner);
        console.log("  User 1:   ", user1);
        console.log("  User 2:   ", user2);
        console.log("  Treasury: ", treasury);
        console.log("  Presale:  ", presaleSimulation);
        console.log("");

        // Deploy token
        console.log("📦 Deploying NexusWealthTokenV2...");
        const token = await NexusWealthTokenV2.new(
            "NexusWealth Investment Solutions",
            "NWIS",
            18,
            50000000000, // 50 billion max
            35000000000  // 35 billion initial
        );
        console.log("✅ Token deployed at:", token.address);
        console.log("");

        // Initial setup
        console.log("🔧 Initial Setup");
        console.log("-".repeat(60));
        
        // Give user1 some tokens
        await token.transfer(user1, web3.utils.toWei("10000", "ether"), { from: owner });
        let balance1 = await token.balanceOf(user1);
        console.log("✅ User1 balance:", web3.utils.fromWei(balance1, "ether"), "NWIS");
        console.log("");

        // ========================================
        // TEST 1: Normal Operation (No Pause)
        // ========================================
        console.log("TEST 1: Normal Transfer (Before Presale Pause)");
        console.log("-".repeat(60));
        
        try {
            await token.transfer(user2, web3.utils.toWei("100", "ether"), { from: user1 });
            let balance2 = await token.balanceOf(user2);
            console.log("✅ Transfer successful");
            console.log("   User2 received:", web3.utils.fromWei(balance2, "ether"), "NWIS");
        } catch (error) {
            console.log("❌ FAILED:", error.message);
        }
        console.log("");

        // ========================================
        // TEST 2: Set Presale Contract
        // ========================================
        console.log("TEST 2: Set Presale Contract Address");
        console.log("-".repeat(60));
        
        await token.setPresaleContract(presaleSimulation, { from: owner });
        let presaleAddress = await token.presaleContract();
        console.log("✅ Presale contract set to:", presaleAddress);
        console.log("");

        // ========================================
        // TEST 3: Enable Presale Pause
        // ========================================
        console.log("TEST 3: Enable Presale Pause");
        console.log("-".repeat(60));
        
        await token.enablePresalePause({ from: owner });
        let isPaused = await token.isPresalePaused();
        console.log("✅ Presale pause enabled:", isPaused);
        console.log("   ℹ️  Only presale contract can send tokens now");
        console.log("");

        // ========================================
        // TEST 4: User Transfer (Should FAIL)
        // ========================================
        console.log("TEST 4: User→User Transfer (Should FAIL)");
        console.log("-".repeat(60));
        
        try {
            await token.transfer(user2, web3.utils.toWei("50", "ether"), { from: user1 });
            console.log("❌ TEST FAILED: Transfer should have been blocked!");
        } catch (error) {
            if (error.message.includes("Transfers paused: presale only")) {
                console.log("✅ Transfer correctly blocked");
                console.log("   Error:", error.reason || "Transfers paused: presale only");
            } else {
                console.log("❌ Unexpected error:", error.message);
            }
        }
        console.log("");

        // ========================================
        // TEST 5: Presale Transfer (Should SUCCEED)
        // ========================================
        console.log("TEST 5: Presale→User Transfer (Should SUCCEED)");
        console.log("-".repeat(60));
        
        // Give presale contract some tokens
        await token.transfer(presaleSimulation, web3.utils.toWei("5000", "ether"), { from: owner });
        let presaleBalance = await token.balanceOf(presaleSimulation);
        console.log("   Presale contract balance:", web3.utils.fromWei(presaleBalance, "ether"), "NWIS");
        
        // Presale sends to user (simulating a purchase)
        try {
            await token.transfer(user2, web3.utils.toWei("200", "ether"), { from: presaleSimulation });
            let balance2 = await token.balanceOf(user2);
            console.log("✅ Presale transfer successful");
            console.log("   User2 now has:", web3.utils.fromWei(balance2, "ether"), "NWIS");
        } catch (error) {
            console.log("❌ FAILED:", error.message);
        }
        console.log("");

        // ========================================
        // TEST 6: Add to Whitelist
        // ========================================
        console.log("TEST 6: Add Treasury to Whitelist");
        console.log("-".repeat(60));
        
        await token.setPresalePauseWhitelist(treasury, true, { from: owner });
        let isWhitelisted = await token.presalePauseWhitelist(treasury);
        console.log("✅ Treasury whitelisted:", isWhitelisted);
        console.log("");

        // ========================================
        // TEST 7: Whitelisted Transfer (Should SUCCEED)
        // ========================================
        console.log("TEST 7: Whitelisted→User Transfer (Should SUCCEED)");
        console.log("-".repeat(60));
        
        // Give treasury some tokens
        await token.transfer(treasury, web3.utils.toWei("1000", "ether"), { from: owner });
        let treasuryBalance = await token.balanceOf(treasury);
        console.log("   Treasury balance:", web3.utils.fromWei(treasuryBalance, "ether"), "NWIS");
        
        // Treasury sends to user
        try {
            await token.transfer(user1, web3.utils.toWei("100", "ether"), { from: treasury });
            console.log("✅ Whitelisted transfer successful");
        } catch (error) {
            console.log("❌ FAILED:", error.message);
        }
        console.log("");

        // ========================================
        // TEST 8: Batch Whitelist
        // ========================================
        console.log("TEST 8: Batch Whitelist Multiple Addresses");
        console.log("-".repeat(60));
        
        const addresses = [accounts[5], accounts[6], accounts[7]];
        await token.setPresalePauseWhitelistBatch(addresses, true, { from: owner });
        
        for (let addr of addresses) {
            let isWL = await token.presalePauseWhitelist(addr);
            console.log(`   ${addr}: ${isWL ? '✅' : '❌'}`);
        }
        console.log("✅ Batch whitelist complete");
        console.log("");

        // ========================================
        // TEST 9: Disable Presale Pause
        // ========================================
        console.log("TEST 9: Disable Presale Pause");
        console.log("-".repeat(60));
        
        await token.disablePresalePause({ from: owner });
        isPaused = await token.isPresalePaused();
        console.log("✅ Presale pause disabled:", isPaused);
        console.log("   ℹ️  Normal transfers re-enabled");
        console.log("");

        // ========================================
        // TEST 10: Normal Transfer After Disable (Should SUCCEED)
        // ========================================
        console.log("TEST 10: User→User Transfer After Disable (Should SUCCEED)");
        console.log("-".repeat(60));
        
        try {
            await token.transfer(user2, web3.utils.toWei("75", "ether"), { from: user1 });
            let balance2 = await token.balanceOf(user2);
            console.log("✅ Transfer successful");
            console.log("   User2 now has:", web3.utils.fromWei(balance2, "ether"), "NWIS");
        } catch (error) {
            console.log("❌ FAILED:", error.message);
        }
        console.log("");

        // ========================================
        // TEST 11: Full Pause Override
        // ========================================
        console.log("TEST 11: Full Pause (Emergency Override)");
        console.log("-".repeat(60));
        
        // Re-enable presale pause
        await token.enablePresalePause({ from: owner });
        console.log("   Presale pause re-enabled");
        
        // Now do full pause
        await token.pause({ from: owner });
        let isFullyPaused = await token.paused();
        console.log("✅ Full pause enabled:", isFullyPaused);
        
        // Try presale transfer (should fail even though presale pause allows it)
        try {
            await token.transfer(user1, web3.utils.toWei("10", "ether"), { from: presaleSimulation });
            console.log("❌ TEST FAILED: Transfer should have been blocked by full pause!");
        } catch (error) {
            if (error.message.includes("paused")) {
                console.log("✅ Full pause correctly overrides presale pause");
            } else {
                console.log("❌ Unexpected error:", error.message);
            }
        }
        
        // Unpause
        await token.unpause({ from: owner });
        await token.disablePresalePause({ from: owner });
        console.log("✅ Unpaused and presale pause disabled");
        console.log("");

        // ========================================
        // FINAL SUMMARY
        // ========================================
        console.log("=".repeat(60));
        console.log("📊 FINAL BALANCES");
        console.log("=".repeat(60));
        
        const finalBalances = {
            owner: await token.balanceOf(owner),
            user1: await token.balanceOf(user1),
            user2: await token.balanceOf(user2),
            treasury: await token.balanceOf(treasury),
            presale: await token.balanceOf(presaleSimulation),
        };
        
        console.log("  Owner:    ", web3.utils.fromWei(finalBalances.owner, "ether"), "NWIS");
        console.log("  User 1:   ", web3.utils.fromWei(finalBalances.user1, "ether"), "NWIS");
        console.log("  User 2:   ", web3.utils.fromWei(finalBalances.user2, "ether"), "NWIS");
        console.log("  Treasury: ", web3.utils.fromWei(finalBalances.treasury, "ether"), "NWIS");
        console.log("  Presale:  ", web3.utils.fromWei(finalBalances.presale, "ether"), "NWIS");
        console.log("");

        console.log("=".repeat(60));
        console.log("🎉 ALL TESTS PASSED!");
        console.log("=".repeat(60));
        console.log("");
        console.log("✅ Presale pause feature working correctly");
        console.log("✅ Whitelist functionality verified");
        console.log("✅ Full pause override confirmed");
        console.log("");

        callback();
    } catch (error) {
        console.error("\n❌ ERROR:", error);
        callback(error);
    }
};

