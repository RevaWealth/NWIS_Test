const NexusWealthToken = artifacts.require("NexusWealthToken");

module.exports = async function(callback) {
  try {
    console.log("🚀 Multi-Chain NWIS Token Deployment");
    console.log("=====================================");
    
    const accounts = await web3.eth.getAccounts();
    const deployer = accounts[0];
    
    console.log("👤 Deployer:", deployer);
    console.log("🌐 Current Network:", await web3.eth.net.getNetworkType());
    console.log("🔗 Chain ID:", await web3.eth.getChainId());
    
    // Token configuration
    const TOKEN_NAME = "NexusWealth Investment Solutions";
    const TOKEN_SYMBOL = "NWIS";
    const TOKEN_DECIMALS = 18;
    const MAX_SUPPLY = web3.utils.toWei("50000000000", "ether"); // 50 billion
    const INITIAL_SUPPLY = web3.utils.toWei("50000000000", "ether"); // 50 billion
    
    console.log("\n📊 Token Configuration:");
    console.log("Name:", TOKEN_NAME);
    console.log("Symbol:", TOKEN_SYMBOL);
    console.log("Decimals:", TOKEN_DECIMALS);
    console.log("Max Supply:", web3.utils.fromWei(MAX_SUPPLY, "ether"), "NWIS");
    console.log("Initial Supply:", web3.utils.fromWei(INITIAL_SUPPLY, "ether"), "NWIS");
    
    // Deploy token contract
    console.log("\n📦 Deploying NWIS Token...");
    
    const token = await NexusWealthToken.new(
      TOKEN_NAME,
      TOKEN_SYMBOL,
      TOKEN_DECIMALS,
      MAX_SUPPLY,
      INITIAL_SUPPLY,
      { from: deployer }
    );
    
    console.log("✅ NWIS Token deployed to:", token.address);
    
    // Verify deployment
    console.log("\n🔍 Verifying deployment...");
    
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    const totalSupply = await token.totalSupply();
    const maxSupply = await token.maxSupply();
    const owner = await token.owner();
    
    console.log("✅ Verification successful:");
    console.log("   Name:", name);
    console.log("   Symbol:", symbol);
    console.log("   Decimals:", decimals);
    console.log("   Total Supply:", web3.utils.fromWei(totalSupply, "ether"), "NWIS");
    console.log("   Max Supply:", web3.utils.fromWei(maxSupply, "ether"), "NWIS");
    console.log("   Owner:", owner);
    console.log("   Owner Match:", owner === deployer);
    
    // Set up bridge operators
    console.log("\n👥 Setting up bridge operators...");
    
    if (accounts.length > 1) {
      await token.setBridgeOperator(accounts[1], true, { from: deployer });
      console.log("✅ Bridge Operator 1:", accounts[1]);
    }
    
    if (accounts.length > 2) {
      await token.setBridgeOperator(accounts[2], true, { from: deployer });
      console.log("✅ Bridge Operator 2:", accounts[2]);
    }
    
    // Configure supported chains
    console.log("\n🌐 Configuring supported chains...");
    
    const currentChainId = await web3.eth.getChainId();
    console.log("Current Chain ID:", currentChainId);
    
    // Set current chain as supported
    await token.setSupportedChain(currentChainId, true, { from: deployer });
    console.log("✅ Current chain supported");
    
    // Set other main chains as supported
    const mainChains = [1, 8453]; // Ethereum Mainnet, Base
    const testChains = [11155111, 84532]; // Sepolia, Base Sepolia
    
    for (const chainId of mainChains) {
      if (chainId !== currentChainId) {
        await token.setSupportedChain(chainId, true, { from: deployer });
        console.log("✅ Chain", chainId, "supported");
      }
    }
    
    // Display bridge configuration
    console.log("\n📊 Bridge Configuration:");
    
    const bridgeStats = await token.getBridgeStats();
    const maxBridgeAmount = await token.maxBridgeAmount();
    const bridgeFee = await token.bridgeFee();
    
    console.log("Max Bridge Amount:", web3.utils.fromWei(maxBridgeAmount, "ether"), "NWIS");
    console.log("Bridge Fee:", web3.utils.fromWei(bridgeFee, "ether"), "ETH");
    console.log("Total Bridge Requests:", bridgeStats.totalRequests.toString());
    console.log("Fees Collected:", web3.utils.fromWei(bridgeStats.feesCollected, "ether"), "ETH");
    
    // Display supported chains
    console.log("\n🌍 Supported Chains:");
    
    const allChains = [...mainChains, ...testChains, currentChainId];
    const chainNames = {
      1: "Ethereum Mainnet",
      8453: "Base",
      11155111: "Sepolia Testnet",
      84532: "Base Sepolia Testnet"
    };
    
    for (const chainId of allChains) {
      const isSupported = await token.supportedChains(chainId);
      const chainName = chainNames[chainId] || `Chain ${chainId}`;
      const status = isSupported ? "✅ Supported" : "❌ Not Supported";
      console.log(`${chainName} (${chainId}): ${status}`);
    }
    
    console.log("\n🎉 Multi-Chain Deployment Complete!");
    console.log("\n📋 Deployment Summary:");
    console.log("Contract Address:", token.address);
    console.log("Network:", await web3.eth.net.getNetworkType());
    console.log("Chain ID:", currentChainId);
    console.log("Deployer:", deployer);
    
    console.log("\n🚀 Next Steps:");
    console.log("1. Deploy on other networks (Ethereum, Base)");
    console.log("2. Set up bridge operators on each network");
    console.log("3. Test cross-chain bridge functionality");
    console.log("4. Verify contracts on block explorers");
    
    console.log("\n⚠️ Important Notes:");
    console.log("- Each network needs separate deployment");
    console.log("- Bridge operators must be set up on each network");
    console.log("- Test bridge functionality on testnets first");
    console.log("- Monitor bridge operations and fees");
    
  } catch (error) {
    console.error("❌ Multi-chain deployment failed:", error);
  }
  
  callback();
};



