const NexusWealthPresale = artifacts.require("NexusWealthPresale");
const MockERC20 = artifacts.require("MockERC20");

module.exports = async function (deployer, network, accounts) {
  console.log("🚀 Starting NexusWealth Presale deployment on", network);
  console.log("📝 Deploying with account:", accounts[0]);
  
  // Configuration parameters
  const config = {
    // Network-specific configurations
    development: {
      tokenPrice: web3.utils.toWei("0.001", "ether"), // 0.001 ETH per token
      totalTokensForSale: web3.utils.toWei("1000000", "ether"), // 1 million tokens
      minPurchase: web3.utils.toWei("0.01", "ether"), // 0.01 ETH minimum
      maxPurchase: web3.utils.toWei("10", "ether"), // 10 ETH maximum
    },
    sepolia: {
      tokenPrice: web3.utils.toWei("0.001", "ether"),
      totalTokensForSale: web3.utils.toWei("1000000", "ether"),
      minPurchase: web3.utils.toWei("0.01", "ether"),
      maxPurchase: web3.utils.toWei("10", "ether"),
    },
    mainnet: {
      tokenPrice: web3.utils.toWei("0.001", "ether"),
      totalTokensForSale: web3.utils.toWei("10000000", "ether"), // 10 million tokens
      minPurchase: web3.utils.toWei("0.1", "ether"),
      maxPurchase: web3.utils.toWei("100", "ether"),
    }
  };

  // Get network configuration
  const networkConfig = config[network] || config.development;
  
  // Addresses (update these with real addresses)
  const TREASURY_ADDRESS = "0x1234567890123456789012345678901234567890"; // Replace with actual treasury address
  const DEV_ADDRESS = "0x0987654321098765432109876543210987654321"; // Replace with actual dev address
  
  console.log("📊 Deployment Parameters:");
  console.log("   Treasury Address:", TREASURY_ADDRESS);
  console.log("   Dev Address:", DEV_ADDRESS);
  console.log("   Token Price:", web3.utils.fromWei(networkConfig.tokenPrice, "ether"), "ETH");
  console.log("   Total Tokens:", web3.utils.fromWei(networkConfig.totalTokensForSale, "ether"), "NWIS");
  console.log("   Min Purchase:", web3.utils.fromWei(networkConfig.minPurchase, "ether"), "ETH");
  console.log("   Max Purchase:", web3.utils.fromWei(networkConfig.maxPurchase, "ether"), "ETH");

  try {
    // Deploy MockERC20 token first (for testing)
    console.log("\n📦 Deploying MockERC20 token...");
    await deployer.deploy(MockERC20, "NexusWealth Investment Solution", "NWIS");
    const mockToken = await MockERC20.deployed();
    console.log("✅ MockERC20 deployed to:", mockToken.address);

    // Deploy the NexusWealth Presale contract
    console.log("\n📦 Deploying NexusWealthPresale...");
    await deployer.deploy(NexusWealthPresale,
      mockToken.address,
      TREASURY_ADDRESS,
      DEV_ADDRESS,
      networkConfig.tokenPrice,
      networkConfig.totalTokensForSale,
      networkConfig.minPurchase,
      networkConfig.maxPurchase
    );
    
    const presale = await NexusWealthPresale.deployed();
    console.log("✅ NexusWealthPresale deployed to:", presale.address);

    // Transfer tokens to the presale contract for sale
    console.log("\n💰 Transferring tokens to presale contract...");
    await mockToken.transfer(presale.address, networkConfig.totalTokensForSale);
    console.log("✅ Transferred", web3.utils.fromWei(networkConfig.totalTokensForSale, "ether"), "tokens to presale contract");

    // Verify the deployment
    console.log("\n🔍 Verifying deployment...");
    const owner = await presale.owner();
    const tokenAddress = await presale.token();
    const treasuryAddress = await presale.treasuryAddress();
    const devAddress = await presale.devAddress();
    const tokenPrice = await presale.tokenPrice();
    const totalTokensForSale = await presale.totalTokensForSale();
    const minPurchase = await presale.minPurchase();
    const maxPurchase = await presale.maxPurchase();

    console.log("✅ Verification successful:");
    console.log("   Owner:", owner);
    console.log("   Token Address:", tokenAddress);
    console.log("   Treasury Address:", treasuryAddress);
    console.log("   Dev Address:", devAddress);
    console.log("   Token Price:", web3.utils.fromWei(tokenPrice, "ether"), "ETH");
    console.log("   Total Tokens:", web3.utils.fromWei(totalTokensForSale, "ether"), "NWIS");
    console.log("   Min Purchase:", web3.utils.fromWei(minPurchase, "ether"), "ETH");
    console.log("   Max Purchase:", web3.utils.fromWei(maxPurchase, "ether"), "ETH");

    // Check token balance in presale contract
    const tokenBalance = await mockToken.balanceOf(presale.address);
    console.log("   Tokens in Presale Contract:", web3.utils.fromWei(tokenBalance, "ether"), "NWIS");

    console.log("\n🎉 Deployment completed successfully!");
    console.log("📋 Contract Addresses:");
    console.log("   MockERC20:", mockToken.address);
    console.log("   NexusWealthPresale:", presale.address);
    
    // Instructions for next steps
    console.log("\n📋 Next Steps:");
    console.log("1. Update TREASURY_ADDRESS and DEV_ADDRESS with real addresses");
    console.log("2. Call presale.setSaleStatus(true) to activate the sale");
    console.log("3. Set sale end time with presale.setSaleEndTime(endTime)");
    console.log("4. Test the contract with: truffle exec scripts/test-presale-truffle.js");
    console.log("5. For production, deploy with real token contract instead of MockERC20");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
};
