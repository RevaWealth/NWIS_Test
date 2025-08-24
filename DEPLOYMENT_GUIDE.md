# 🚀 NexusWealth Investment Solutions Token Deployment Guide - Sepolia Testnet

This guide will walk you through deploying the NexusWealth Investment Solutions token on Sepolia testnet.

## 📋 Prerequisites

### 1. **Environment Setup**
Create a `.env` file in your project root with the following variables:

```bash
# Network RPC URLs
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
MAINNET_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID
POLYGON_URL=https://polygon-rpc.com
BSC_URL=https://bsc-dataseed1.binance.org

# Your wallet private key (NEVER commit this to version control!)
PRIVATE_KEY=your_private_key_here

# API Keys for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
BSCSCAN_API_KEY=your_bscscan_api_key_here
```

### 2. **Required Accounts & Services**
- **MetaMask Wallet** with Sepolia testnet configured
- **Infura Account** for RPC endpoint (or alternative provider)
- **Etherscan Account** for contract verification
- **Sepolia Testnet ETH** for gas fees

### 3. **Install Dependencies**
```bash
npm install
# or
yarn install
```

## 🔧 Configuration Steps

### 1. **Get Sepolia Testnet ETH**
- Visit [Sepolia Faucet](https://sepoliafaucet.com/)
- Connect your wallet and request test ETH
- You'll need at least 0.1 ETH for deployment

### 2. **Set Up Infura (or alternative)**
- Go to [Infura](https://infura.io/)
- Create a new project
- Copy your project ID
- Update `SEPOLIA_URL` in your `.env` file

### 3. **Get Etherscan API Key**
- Visit [Etherscan](https://etherscan.io/)
- Create an account and get your API key
- Update `ETHERSCAN_API_KEY` in your `.env` file

### 4. **Export Your Private Key**
- **⚠️ WARNING: Never share your private key!**
- In MetaMask: Account → Three dots → Account details → Export private key
- Copy the private key and update `PRIVATE_KEY` in your `.env` file

## 🚀 Deployment Commands

### 1. **Compile Contracts**
```bash
truffle compile
```

### 2. **Deploy to Sepolia**
```bash
truffle migrate --network sepolia
```

### 3. **Verify Contract (Optional)**
```bash
truffle run verify NexusWealthToken --network sepolia
```

## 📊 Expected Deployment Results

### **Token Configuration**
- **Name**: NexusWealth Investment Solutions
- **Symbol**: NWIS
- **Decimals**: 18
- **Max Supply**: 50,000,000,000 NWIS (50 billion)
- **Initial Supply**: 35,000,000,000 NWIS (35 billion)

### **Contract Features**
- ✅ Standard ERC20 functionality
- ✅ Minting and burning capabilities
- ✅ Pausable transfers
- ✅ Ownable access control
- ✅ Anti-reentrancy protection
- ✅ Token vesting support
- ✅ Blacklist functionality
- ✅ Timestamp-based voting system
- ✅ Permit functionality for gasless approvals
- ✅ Custom cross-chain bridging system

## 🔍 Post-Deployment Verification

### 1. **Check Contract on Etherscan**
- Visit [Sepolia Etherscan](https://sepolia.etherscan.io/)
- Search for your contract address
- Verify all functions are visible

### 2. **Test Basic Functions**
```bash
# Connect to Truffle console
truffle console --network sepolia

# Get deployed contract
const token = await NexusWealthToken.deployed()

# Check basic info
await token.name()
await token.symbol()
await token.decimals()
await token.maxSupply()
await token.totalSupply()
await token.owner()
```

### 3. **Test Token Transfer**
```bash
# Check deployer balance
const deployer = accounts[0]
const balance = await token.balanceOf(deployer)
web3.utils.fromWei(balance, 'ether')

# Transfer some tokens (if you have another account)
await token.transfer(recipientAddress, web3.utils.toWei('1000', 'ether'))
```

## 🧪 Testing Commands

### **Run All Tests**
```bash
# Test token contract
truffle exec scripts/test-token-comprehensive.js --network sepolia

# Test token management
truffle exec scripts/manage-token.js --network sepolia
```

### **Test Specific Features**
```bash
# Test voting system
truffle console --network sepolia
const token = await NexusWealthToken.deployed()
await token.createProposal("Test Proposal", "Test Description", Math.floor(Date.now()/1000) + 3600, 86400, web3.utils.toWei('1000000', 'ether'))

# Test cross-chain bridging
await token.setSupportedChain(137, true) // Enable Polygon
await token.setBridgeOperator(bridgeOperatorAddress, true)
```

## 🚨 Important Security Notes

### **Private Key Security**
- ⚠️ **NEVER commit your `.env` file to version control**
- ⚠️ **NEVER share your private key**
- ⚠️ **Use a dedicated wallet for testing**

### **Network Security**
- ✅ Always verify you're on the correct network
- ✅ Double-check contract addresses before interactions
- ✅ Test with small amounts first

### **Contract Verification**
- ✅ Verify your contract on Etherscan after deployment
- ✅ Keep deployment information secure
- ✅ Document all contract addresses

## 🔧 Troubleshooting

### **Common Issues**

#### **"Insufficient funds"**
- Get more Sepolia testnet ETH from faucet
- Check your wallet balance

#### **"Network not found"**
- Verify your `.env` file configuration
- Check RPC endpoint URLs

#### **"Gas estimation failed"**
- Increase gas limit in `truffle-config.js`
- Check contract constructor parameters

#### **"Contract verification failed"**
- Ensure Etherscan API key is correct
- Check contract compilation

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify your configuration
3. Test on local network first
4. Check Truffle and network logs

## 🎯 Next Steps After Deployment

1. **Test all token functions**
2. **Set up bridge operators and supported chains**
3. **Configure voting parameters**
4. **Test cross-chain bridging**
5. **Deploy presale contract**
6. **Consider mainnet deployment**

---

**Happy Deploying! 🚀**
