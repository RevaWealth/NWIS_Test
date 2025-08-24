# 🚀 NWIS Token Deployment Guide

Step-by-step guide to deploy the NWIS token on various networks.

## 📋 Prerequisites

### Required
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Ethereum wallet with private key
- Testnet ETH (for Sepolia deployment)
- Mainnet ETH (for mainnet deployment)

### Optional
- [Etherscan](https://etherscan.io/) account for contract verification
- [Infura](https://infura.io/) or [Alchemy](https://alchemy.com/) account for RPC endpoints

## 🔧 Environment Setup

### 1. Create .env File

```bash
# Copy the template
cp env.template .env

# Edit with your values
nano .env
```

### 2. Required Environment Variables

```bash
# Your wallet's private key (without 0x prefix)
PRIVATE_KEY=794788838f920914cb161dddb7c838fe7a52b40c24fff8318afbdcfa4ddf0c5b

# Sepolia testnet RPC URL
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### 3. Optional Environment Variables

```bash
# Mainnet RPC URL (for mainnet deployment)
MAINNET_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Alternative RPC providers
ALCHEMY_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
ALCHEMY_MAINNET_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
```

## 🚀 Deployment Steps

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Compile Contracts

```bash
npm run compile
```

### Step 3: Choose Deployment Network

#### Option A: Local Development (Recommended for Testing)

```bash
# Start local blockchain
npx ganache-cli --gasLimit 100000000 --port 8545

# In another terminal, deploy
npm run deploy:local
```

#### Option B: Sepolia Testnet (Recommended for Testing)

```bash
# Deploy to Sepolia
npm run deploy:sepolia
```

#### Option C: Ethereum Mainnet (Production)

```bash
# Deploy to mainnet
npm run deploy:mainnet
```

## 📊 Deployment Configuration

### Token Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| **Name** | "NexusWealth Investment Solutions" | Full token name |
| **Symbol** | "NWIS" | Token symbol |
| **Decimals** | 18 | Token decimal places |
| **Max Supply** | 50,000,000,000 | 50 billion tokens (immutable) |
| **Initial Supply** | 50,000,000,000 | 50 billion tokens minted to deployer |

### Network-Specific Settings

#### Local Development
- **Gas Limit**: 100,000,000
- **Gas Price**: 2 Gwei
- **Network ID**: 1337

#### Sepolia Testnet
- **Gas Limit**: 59,900,000
- **Gas Price**: 50 Gwei
- **Network ID**: 11155111
- **Confirmations**: 2

#### Ethereum Mainnet
- **Gas Limit**: 59,900,000
- **Gas Price**: 20 Gwei
- **Network ID**: 1
- **Confirmations**: 5

## 🔍 Post-Deployment Verification

### 1. Check Contract Deployment

```bash
# Open Truffle console
npm run console:sepolia

# Check contract address
const token = await NexusWealthToken.deployed()
console.log("Contract Address:", token.address)

# Verify basic info
const name = await token.name()
const symbol = await token.symbol()
const totalSupply = await token.totalSupply()
console.log("Name:", name)
console.log("Symbol:", symbol)
console.log("Total Supply:", web3.utils.fromWei(totalSupply, "ether"))
```

### 2. Verify on Etherscan

```bash
# Verify contract on Etherscan
npm run verify:sepolia
```

### 3. Test Basic Functions

```bash
# Check owner
const owner = await token.owner()
console.log("Owner:", owner)

# Check deployer account
const accounts = await web3.eth.getAccounts()
console.log("Deployer:", accounts[0])

# Verify owner match
console.log("Owner Match:", owner === accounts[0])
```

## 🧪 Testing the Deployment

### 1. Test Token Transfer

```bash
# Transfer some tokens to another account
const accounts = await web3.eth.getAccounts()
const recipient = accounts[1]
const amount = web3.utils.toWei("1000", "ether")

await token.transfer(recipient, amount)
console.log("Transfer successful")

# Check balances
const deployerBalance = await token.balanceOf(accounts[0])
const recipientBalance = await token.balanceOf(recipient)
console.log("Deployer Balance:", web3.utils.fromWei(deployerBalance, "ether"))
console.log("Recipient Balance:", web3.utils.fromWei(recipientBalance, "ether"))
```

### 2. Test Voting System

```bash
# Create a proposal
const proposalTx = await token.createProposal("Test Proposal")
console.log("Proposal created")

# Get proposal ID
const proposalId = 0 // First proposal

# Vote on proposal
await token.castVote(proposalId, true)
console.log("Vote cast successfully")

# Check proposal status
const proposal = await token.getProposal(proposalId)
console.log("For Votes:", web3.utils.fromWei(proposal.forVotes, "ether"))
```

### 3. Test Bridge Functionality

```bash
# Set up bridge operator
const accounts = await web3.eth.getAccounts()
await token.setBridgeOperator(accounts[1], true)
console.log("Bridge operator set")

# Check bridge parameters
const maxBridgeAmount = await token.maxBridgeAmount()
const bridgeFee = await token.bridgeFee()
console.log("Max Bridge Amount:", web3.utils.fromWei(maxBridgeAmount, "ether"))
console.log("Bridge Fee:", web3.utils.fromWei(bridgeFee, "ether"))
```

## 🚨 Troubleshooting

### Common Issues

#### 1. "Too Many Requests" Error
- **Cause**: Infura rate limit reached
- **Solution**: Wait 1-2 minutes or use Alchemy instead

#### 2. "Out of Gas" Error
- **Cause**: Contract too large for network
- **Solution**: Contract is now optimized to 16.6 KB (should work on all networks)

#### 3. "Invalid Private Key" Error
- **Cause**: Private key format incorrect
- **Solution**: Remove 0x prefix from private key

#### 4. "Insufficient Balance" Error
- **Cause**: Not enough ETH for gas fees
- **Solution**: Add more ETH to your wallet

### Gas Optimization

The contract is already optimized with:
- **Solidity Optimizer**: Enabled with runs=1
- **Yul Optimizer**: Ultra optimization enabled
- **Revert String Stripping**: Reduces contract size
- **EVM Version**: Latest (Paris) for better optimization

## 📋 Deployment Checklist

- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Contracts compiled successfully
- [ ] Network RPC endpoint working
- [ ] Sufficient ETH balance for gas
- [ ] Private key correctly formatted
- [ ] Contract deployed successfully
- [ ] Basic functions tested
- [ ] Contract verified on Etherscan (optional)

## 🔐 Security Notes

- **Never share your private key**
- **Test thoroughly on testnets first**
- **Verify contract source code on Etherscan**
- **Use hardware wallets for mainnet deployment**
- **Keep deployment wallet secure**

## 📞 Support

If you encounter issues:
1. Check this deployment guide
2. Review the README.md
3. Check network status and gas prices
4. Verify environment configuration
5. Contact development team

---

**🎯 Ready to deploy?** Start with local development, then move to Sepolia testnet before considering mainnet deployment.


