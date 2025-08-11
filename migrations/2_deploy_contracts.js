const RevaWealthPresale = artifacts.require("RevaWealthPresale");
const MockERC20 = artifacts.require("MockERC20");

module.exports = async function (deployer, network, accounts) {
  console.log("🚀 Starting RevaWealth Presale deployment...");
  console.log("📝 Deploying with account:", accounts[0]);
  console.log("🌐 Network:", network);

  // You can modify these addresses as needed
  const ICO_ADDRESS = "0x1234567890123456789012345678901234567890"; // Replace with actual ICO address
  const DEV_ADDRESS = "0x0987654321098765432109876543210987654321"; // Replace with actual DEV address

  try {
    // Deploy MockERC20 for testing (optional)
    if (network === "development" || network === "test") {
      console.log("📦 Deploying MockERC20 for testing...");
      await deployer.deploy(MockERC20, "Mock Token", "MTK", 18);
      const mockToken = await MockERC20.deployed();
      console.log("✅ MockERC20 deployed to:", mockToken.address);
    }

    // Deploy RevaWealthPresale
    console.log("📦 Deploying RevaWealthPresale...");
    await deployer.deploy(RevaWealthPresale, ICO_ADDRESS, DEV_ADDRESS);
    const presale = await RevaWealthPresale.deployed();
    
    console.log("✅ RevaWealthPresale deployed to:", presale.address);
    console.log("📊 ICO Address:", ICO_ADDRESS);
    console.log("👨‍💻 DEV Address:", DEV_ADDRESS);

    // Verify deployment
    console.log("🔍 Verifying deployment...");
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
      network: network,
      contract: "RevaWealthPresale",
      address: presale.address,
      deployer: accounts[0],
      icoAddress: ICO_ADDRESS,
      devAddress: DEV_ADDRESS,
      deploymentTime: new Date().toISOString(),
    };

    console.log("\n📄 Deployment Info:");
    console.log(JSON.stringify(deploymentInfo, null, 2));

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}; 