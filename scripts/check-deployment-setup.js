require('dotenv').config();

console.log("🔍 Deployment Environment Check");
console.log("===============================");

// Check environment variables
const checks = [
    {
        name: "Private Key",
        value: process.env.PRIVATE_KEY,
        required: true,
        validator: (val) => val && (val.startsWith('0x') ? val.length === 66 : val.length === 64)
    },
    {
        name: "Sepolia RPC URL",
        value: process.env.SEPOLIA_URL,
        required: true,
        validator: (val) => val && (val.includes('infura.io') || val.includes('alchemy.com') || val.includes('sepolia'))
    },
    {
        name: "Etherscan API Key",
        value: process.env.ETHERSCAN_API_KEY,
        required: false,
        validator: (val) => !val || val.length > 0
    }
];

let allPassed = true;

checks.forEach(check => {
    const isValid = check.validator(check.value);
    const status = isValid ? "✅ PASS" : "❌ FAIL";
    const required = check.required ? "(Required)" : "(Optional)";
    
    console.log(`${check.name} ${required}: ${status}`);
    
    if (check.required && !isValid) {
        allPassed = false;
        if (check.name === "Private Key") {
            console.log("   → Export your wallet's private key and add it to .env");
        } else if (check.name === "Sepolia RPC URL") {
            console.log("   → Get a Sepolia RPC URL from Infura or Alchemy");
        }
    }
});

console.log("\n📋 Configuration Status:");
if (allPassed) {
    console.log("✅ Environment is ready for deployment!");
    console.log("\n🚀 Next Steps:");
    console.log("1. Ensure your wallet has Sepolia ETH");
    console.log("2. Run: npx truffle migrate --f 4 --to 4 --network sepolia");
    console.log("3. Run: npx truffle migrate --f 5 --to 5 --network sepolia");
} else {
    console.log("❌ Environment needs configuration");
    console.log("\n📖 See DEPLOYMENT_SETUP_GUIDE.md for setup instructions");
}

console.log("\n💡 Tips:");
console.log("- Use a dedicated test wallet");
console.log("- Never share your private key");
console.log("- Get Sepolia ETH from a faucet");
console.log("- Test on Sepolia before mainnet");
