const NexusWealthToken = artifacts.require("NexusWealthToken");

module.exports = async function(callback) {
  try {
    console.log("🌉 Setting up Cross-Chain Bridge between Ethereum and Base");
    console.log("=========================================================");
    
    // Get deployed token contracts on both networks
    // Note: You'll need to run this script on each network separately
    
    const token = await NexusWealthToken.deployed();
    console.log("✅ Connected to token contract:", token.address);
    
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    
    console.log("\n🔗 Bridge Setup Steps:");
    console.log("1. Set up bridge operators on both networks");
    console.log("2. Configure supported chains");
    console.log("3. Set bridge parameters");
    console.log("4. Test bridge functionality");
    
    // Step 1: Set up bridge operators
    console.log("\n👥 Setting up Bridge Operators:");
    
    // Set multiple bridge operators for redundancy
    if (accounts.length > 1) {
      await token.setBridgeOperator(accounts[1], true, { from: owner });
      console.log("✅ Bridge Operator 1:", accounts[1]);
    }
    
    if (accounts.length > 2) {
      await token.setBridgeOperator(accounts[2], true, { from: owner });
      console.log("✅ Bridge Operator 2:", accounts[2]);
    }
    
    // Step 2: Configure supported chains
    console.log("\n🌐 Configuring Supported Chains:");
    
    // Ethereum Mainnet (Chain ID: 1)
    await token.setSupportedChain(1, true, { from: owner });
    console.log("✅ Ethereum Mainnet (Chain ID: 1) - Supported");
    
    // Base (Chain ID: 8453)
    await token.setSupportedChain(8453, true, { from: owner });
    console.log("✅ Base (Chain ID: 8453) - Supported");
    
    // Sepolia Testnet (Chain ID: 11155111)
    await token.setSupportedChain(11155111, true, { from: owner });
    console.log("✅ Sepolia Testnet (Chain ID: 11155111) - Supported");
    
    // Base Sepolia Testnet (Chain ID: 84532)
    await token.setSupportedChain(84532, true, { from: owner });
    console.log("✅ Base Sepolia Testnet (Chain ID: 84532) - Supported");
    
    // Step 3: Configure bridge parameters
    console.log("\n⚙️ Configuring Bridge Parameters:");
    
    // Update bridge fee (0.001 ETH)
    const currentFee = await token.bridgeFee();
    console.log("Current Bridge Fee:", web3.utils.fromWei(currentFee, "ether"), "ETH");
    
    // Update max bridge amount (50 million NWIS)
    const currentMaxAmount = await token.maxBridgeAmount();
    console.log("Current Max Bridge Amount:", web3.utils.fromWei(currentMaxAmount, "ether"), "NWIS");
    
    // Step 4: Display bridge configuration
    console.log("\n📊 Bridge Configuration Summary:");
    
    const bridgeStats = await token.getBridgeStats();
    console.log("Total Bridge Requests:", bridgeStats.totalRequests.toString());
    console.log("Processed Requests:", bridgeStats.processedRequests.toString());
    console.log("Fees Collected:", web3.utils.fromWei(bridgeStats.feesCollected, "ether"), "ETH");
    console.log("Max Bridge Amount:", web3.utils.fromWei(bridgeStats.maxAmount, "ether"), "NWIS");
    
    // Step 5: Bridge operator verification
    console.log("\n🔐 Bridge Operator Verification:");
    
    if (accounts.length > 1) {
      const isOperator1 = await token.bridgeOperators(accounts[1]);
      console.log("Operator 1 Status:", isOperator1 ? "✅ Active" : "❌ Inactive");
    }
    
    if (accounts.length > 2) {
      const isOperator2 = await token.bridgeOperators(accounts[2]);
      console.log("Operator 2 Status:", isOperator2 ? "✅ Active" : "❌ Inactive");
    }
    
    // Step 6: Supported chains verification
    console.log("\n🌍 Supported Chains Verification:");
    
    const chains = [1, 8453, 11155111, 84532];
    const chainNames = {
      1: "Ethereum Mainnet",
      8453: "Base",
      11155111: "Sepolia Testnet",
      84532: "Base Sepolia Testnet"
    };
    
    for (const chainId of chains) {
      const isSupported = await token.supportedChains(chainId);
      console.log(`${chainNames[chainId]} (${chainId}):`, isSupported ? "✅ Supported" : "❌ Not Supported");
    }
    
    console.log("\n🎉 Bridge Setup Complete!");
    console.log("\n📋 Next Steps:");
    console.log("1. Deploy NWIS token on Base network");
    console.log("2. Set up bridge operators on Base network");
    console.log("3. Test cross-chain bridge functionality");
    console.log("4. Monitor bridge operations");
    
    console.log("\n⚠️ Important Notes:");
    console.log("- Bridge operators can process bridge requests");
    console.log("- Each network needs its own bridge setup");
    console.log("- Monitor bridge fees and limits");
    console.log("- Test thoroughly on testnets first");
    
  } catch (error) {
    console.error("❌ Bridge setup failed:", error);
  }
  
  callback();
};



