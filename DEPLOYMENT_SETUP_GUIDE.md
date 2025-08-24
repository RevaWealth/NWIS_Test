# 🚀 Testnet Deployment Setup Guide

## Prerequisites

Before deploying to Sepolia testnet, you need to set up the following:

### 1. **Ethereum Wallet with Sepolia ETH**
- Create or use an existing Ethereum wallet (MetaMask, etc.)
- Get Sepolia testnet ETH from a faucet:
  - [Sepolia Faucet](https://sepoliafaucet.com/)
  - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
  - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

### 2. **RPC Provider (Infura/Alchemy)**
- Sign up for a free account at [Infura](https://infura.io/) or [Alchemy](https://alchemy.com/)
- Create a new project
- Get your project ID/API key

### 3. **Private Key**
- Export your wallet's private key (keep it secure!)
- Never share or commit your private key to version control

## 🔧 Environment Configuration

### Step 1: Update `.env` File

Replace the placeholder values in your `.env` file with your actual credentials:

```bash
# Ethereum Network Configuration
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_ACTUAL_INFURA_PROJECT_ID

# Block Explorer API Keys (optional for deployment, needed for verification)
ETHERSCAN_API_KEY=your_actual_etherscan_api_key_here

# Contract Addresses (will be filled after deployment)
ICO_ADDRESS=0x1234567890123456789012345678901234567890
DEV_ADDRESS=0x0987654321098765432109876543210987654321
```

### Step 2: Get Your Private Key

**From MetaMask:**
1. Open MetaMask
2. Click the three dots menu
3. Go to "Account details"
4. Click "Export Private Key"
5. Enter your password
6. Copy the private key (starts with 0x)

**⚠️ Security Warning:**
- Never share your private key
- Never commit it to version control
- Use a dedicated wallet for testing
- Keep your main wallet private key secure

### Step 3: Get Sepolia RPC URL

**From Infura:**
1. Go to [Infura](https://infura.io/)
2. Create an account and project
3. Go to your project settings
4. Copy the Sepolia endpoint URL
5. Replace `YOUR_ACTUAL_INFURA_PROJECT_ID` with your project ID

**From Alchemy:**
1. Go to [Alchemy](https://alchemy.com/)
2. Create an account and app
3. Go to your app settings
4. Copy the Sepolia HTTP URL

## 🚀 Deployment Commands

### Step 1: Verify Configuration
```bash
# Check if environment variables are loaded
node -e "require('dotenv').config(); console.log('PRIVATE_KEY:', process.env.PRIVATE_KEY ? 'Set' : 'Not set'); console.log('SEPOLIA_URL:', process.env.SEPOLIA_URL ? 'Set' : 'Not set');"
```

### Step 2: Deploy NWIS Token
```bash
# Deploy the main NWIS token contract
npx truffle migrate --f 4 --to 4 --network sepolia
```

### Step 3: Set Up Automated Vesting
```bash
# Set up automated vesting templates and configuration
npx truffle migrate --f 5 --to 5 --network sepolia
```

### Step 4: Test the Deployment
```bash
# Test automated vesting functionality
npx truffle exec scripts/test-automated-vesting.js --network sepolia

# Run management interface
npx truffle exec scripts/manage-automated-vesting.js --network sepolia
```

## 📋 Deployment Checklist

- [ ] Wallet has Sepolia ETH (at least 0.1 ETH)
- [ ] Private key exported and added to `.env`
- [ ] RPC URL configured in `.env`
- [ ] Environment variables loaded correctly
- [ ] Contracts compiled successfully
- [ ] Ready to deploy

## 🔍 Verification Steps

### After Deployment:
1. **Check Contract Addresses**: Note the deployed contract addresses
2. **Verify on Etherscan**: Check your contracts on [Sepolia Etherscan](https://sepolia.etherscan.io/)
3. **Test Functions**: Run the test scripts to verify functionality
4. **Check Balances**: Verify token balances and vesting schedules

### Example Verification:
```bash
# Check deployment status
npx truffle console --network sepolia

# In the console:
const token = await NexusWealthToken.deployed()
console.log('Token Address:', token.address)
console.log('Owner:', await token.owner())
console.log('Total Supply:', web3.utils.fromWei(await token.totalSupply(), 'ether'))
```

## 🛠️ Troubleshooting

### Common Issues:

**1. "Invalid private key"**
- Ensure private key starts with `0x`
- Check for extra spaces or characters
- Verify the key is from the correct wallet

**2. "Insufficient funds"**
- Get more Sepolia ETH from a faucet
- Check your wallet balance

**3. "Network connection failed"**
- Verify your RPC URL is correct
- Check if your Infura/Alchemy project is active
- Ensure you're using the correct network (Sepolia)

**4. "Gas estimation failed"**
- Increase gas limit in `truffle-config.js`
- Check if contract is too complex
- Verify all dependencies are correct

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your environment configuration
3. Ensure you have sufficient Sepolia ETH
4. Check the Truffle documentation

## 🎯 Next Steps After Deployment

1. **Test All Features**: Run comprehensive tests
2. **Set Up Vesting**: Create vesting schedules for team/investors
3. **Configure Operators**: Set up automated vesting operators
4. **Monitor**: Track vesting releases and token distribution
5. **Mainnet**: When ready, deploy to mainnet using the same process

---

**⚠️ Remember**: This is for testnet deployment. For mainnet, use a dedicated wallet with only the necessary funds and follow strict security practices.


