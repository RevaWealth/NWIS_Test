const { ethers } = require("ethers");
require('dotenv').config();

async function main() {
  console.log("🚀 Starting Sepolia deployment...");
  
  // Check environment variables
  if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "your_private_key_here") {
    console.error("❌ Please set your PRIVATE_KEY in the .env file");
    process.exit(1);
  }
  
  if (!process.env.SEPOLIA_URL || process.env.SEPOLIA_URL.includes("YOUR_INFURA_PROJECT_ID")) {
    console.error("❌ Please set your SEPOLIA_URL in the .env file");
    process.exit(1);
  }
  
  // Connect to Sepolia
  const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("📝 Deploying with account:", wallet.address);
  
  // Check balance
  const balance = await wallet.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH");
  
  if (balance.lt(ethers.utils.parseEther("0.01"))) {
    console.error("❌ Insufficient balance. Please get some Sepolia testnet ETH");
    console.log("💡 Get Sepolia ETH from: https://sepoliafaucet.com/");
    process.exit(1);
  }
  
  console.log("✅ Ready to deploy!");
  console.log("");
  console.log("📋 Next steps:");
  console.log("1. Run: npx truffle migrate --network sepolia");
  console.log("2. Update your .env file with the deployed contract address");
  console.log("3. Verify the contract on Etherscan");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment script failed:", error);
    process.exit(1);
  });


