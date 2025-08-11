const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting RevaWealth Presale deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // Deploy the RevaWealth Presale contract
  console.log("\n📦 Deploying RevaWealthPresale...");
  
  // You can modify these addresses as needed
  const ICO_ADDRESS = "0x1234567890123456789012345678901234567890"; // Replace with actual ICO address
  const DEV_ADDRESS = "0x0987654321098765432109876543210987654321"; // Replace with actual DEV address
  
  const RevaWealthPresale = await ethers.getContractFactory("RevaWealthPresale");
  const presale = await RevaWealthPresale.deploy(ICO_ADDRESS, DEV_ADDRESS);
  
  await presale.deployed();
  
  console.log("✅ RevaWealthPresale deployed to:", presale.address);
  console.log("📊 ICO Address:", ICO_ADDRESS);
  console.log("👨‍💻 DEV Address:", DEV_ADDRESS);

  // Wait for a few block confirmations
  console.log("\n⏳ Waiting for confirmations...");
  await presale.deployTransaction.wait(5);
  console.log("✅ Contract confirmed!");

  // Verify the deployment
  console.log("\n🔍 Verifying deployment...");
  const owner = await presale.owner();
  const icoAddress = await presale.ICO();
  const devAddress = await presale.DEV();
  const saleStatus = await presale.saleStatus();

  console.log("✅ Verification successful:");
  console.log("   Owner:", owner);
  console.log("   ICO Address:", icoAddress);
  console.log("   DEV Address:", devAddress);
  console.log("   Sale Status:", saleStatus);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Contract Address:", presale.address);
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contract: "RevaWealthPresale",
    address: presale.address,
    deployer: deployer.address,
    icoAddress: ICO_ADDRESS,
    devAddress: DEV_ADDRESS,
    deploymentTime: new Date().toISOString(),
  };

  console.log("\n📄 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  return presale;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 