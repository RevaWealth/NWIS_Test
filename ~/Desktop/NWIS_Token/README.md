# 🚀 NWIS Token - NexusWealth Investment Solutions

Advanced ERC20 token with governance, voting, and cross-chain bridging capabilities.

## 📋 Overview

**NWIS** (NexusWealth Investment Solutions) is a feature-rich ERC20 token designed for the NexusWealth ecosystem, featuring:

- ✅ **Standard ERC20** functionality with minting/burning
- 🗳️ **Governance voting** system with timestamp-based voting power
- 🌉 **Cross-chain bridging** with customizable limits and fees
- 🚫 **Blacklist functionality** for compliance
- ⏸️ **Pausable transfers** for emergency situations
- 🔐 **Permit functionality** (EIP-2612) for gasless approvals

## 🏗️ Contract Specifications

| Feature | Value |
|---------|-------|
| **Name** | NexusWealth Investment Solutions |
| **Symbol** | NWIS |
| **Decimals** | 18 |
| **Max Supply** | 50,000,000,000 NWIS (50 billion) |
| **Initial Supply** | 50,000,000,000 NWIS (50 billion) |
| **Contract Size** | ~16.6 KB (optimized) |
| **Standard** | ERC20 + Extensions |

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Clone or navigate to the project
cd ~/Desktop/NWIS_Token

# Install dependencies
npm install

# Copy environment template
cp env.template .env

# Edit .env with your values
nano .env
```

### 2. Configure .env File

```bash
# Required
PRIVATE_KEY=your_private_key_without_0x_prefix
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
ETHERSCAN_API_KEY=your_etherscan_api_key

# Optional
MAINNET_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Deploy

```bash
# Local development
npm run deploy:local

# Sepolia testnet
npm run deploy:sepolia

# Mainnet (be careful!)
npm run deploy:mainnet
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile all contracts |
| `npm run deploy:local` | Deploy to local Ganache |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run deploy:mainnet` | Deploy to Ethereum mainnet |
| `npm run verify:sepolia` | Verify contract on Etherscan |
| `npm run verify:mainnet` | Verify contract on Etherscan |
| `npm run console:local` | Open Truffle console (local) |
| `npm run console:sepolia` | Open Truffle console (Sepolia) |

## 🌉 Cross-Chain Bridging

### Supported Chains
- **Ethereum Mainnet** (Chain ID: 1)
- **Sepolia Testnet** (Chain ID: 11155111)

### Bridge Limits
- **Max Bridge Amount**: 50,000,000 NWIS per transaction
- **Bridge Fee**: 0.001 ETH (configurable)
- **Min Bridge Amount**: 1 NWIS

### Bridge Process
1. User calls `initiateBridge()` with target chain and amount
2. Tokens are burned on source chain
3. Bridge operator calls `processBridge()` on target chain
4. Tokens are minted to recipient on target chain

## 🗳️ Governance & Voting

### Voting System
- **Voting Power**: Based on token balance at proposal start time
- **Voting Period**: 7 days (configurable)
- **Voting Delay**: 1 day (configurable)
- **Quorum**: 1% of max supply (500,000,000 NWIS)

### Proposal Lifecycle
1. **Creation**: Anyone can create proposals
2. **Voting**: Token holders vote during voting period
3. **Execution**: Owner executes successful proposals
4. **Cancellation**: Owner can cancel proposals

## 🔐 Access Control

### Owner Functions
- Mint new tokens
- Pause/unpause transfers
- Set blacklist operators
- Set bridge operators
- Update bridge parameters
- Withdraw bridge fees

### Blacklist Operators
- Set account blacklist status
- Managed by owner

### Bridge Operators
- Process bridge requests
- Managed by owner

## 📊 Token Economics

### Supply Distribution
- **Total Supply**: 50 billion NWIS
- **Initial Mint**: 50 billion NWIS (100%)
- **Max Supply**: 50 billion NWIS (immutable)
- **Remaining Mintable**: 0 NWIS

### Token Utility
- **Governance**: Voting on protocol decisions
- **Staking**: Future staking rewards
- **Bridging**: Cross-chain transfers
- **Trading**: DEX liquidity and trading

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npx truffle test test/NexusWealthToken.test.js

# Run with specific network
npx truffle test --network sepolia
```

## 📚 Documentation

- **Contract**: `contracts/NexusWealthToken.sol`
- **Deployment**: `migrations/4_deploy_nexus_wealth_token.js`
- **Configuration**: `truffle-config.js`

## 🔒 Security Features

- **Reentrancy Protection**: Prevents reentrancy attacks
- **Blacklist System**: Compliance and security control
- **Pausable Transfers**: Emergency stop functionality
- **Access Control**: Owner-only administrative functions
- **Input Validation**: Comprehensive parameter checks

## 🌐 Network Support

| Network | Chain ID | Status | Gas Limit | Gas Price |
|---------|----------|--------|-----------|-----------|
| **Local** | 1337 | ✅ Ready | 100M | 2 Gwei |
| **Sepolia** | 11155111 | ✅ Ready | 59.9M | 50 Gwei |
| **Mainnet** | 1 | ✅ Ready | 59.9M | 20 Gwei |

## 📞 Support

For technical support or questions:
- **GitHub Issues**: Create an issue in this repository
- **Documentation**: Check the docs folder
- **Team**: Contact NexusWealth development team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**⚠️ Important**: This is production-ready code. Always test thoroughly on testnets before mainnet deployment.


