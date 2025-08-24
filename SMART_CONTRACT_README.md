# NexusWealth Investment Solutions Smart Contract Deployment Guide

This guide explains how to deploy and test the NexusWealth presale smart contract and NexusWealth Investment Solutions token using Truffle.

## 📋 Prerequisites

- Node.js and npm installed
- Truffle installed globally: `npm install -g truffle`
- Ganache or local blockchain running
- MetaMask or similar wallet for testing

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Blockchain
```bash
# Start Ganache or use truffle develop
truffle develop
```

### 3. Deploy Contracts
```bash
# Deploy to local development network
truffle migrate --reset

# Deploy to specific network
truffle migrate --network sepolia
truffle migrate --network mainnet
```

## 📁 Scripts Overview

### Deployment Scripts

#### `migrations/3_deploy_nexus_wealth_presale.js`
- **Purpose**: Main deployment script for presale contract
- **Usage**: `truffle migrate --reset`
- **Features**: 
  - Deploys MockERC20 token for testing
  - Deploys NexusWealthPresale contract
  - Configures network-specific parameters
  - Transfers tokens to presale contract

#### `migrations/4_deploy_nexus_wealth_token.js`
- **Purpose**: Deploy the production NexusWealth Investment Solutions token
- **Usage**: `truffle migrate --reset`
- **Features**:
  - Deploys production-ready ERC20 token
  - Configures 50 billion max supply
  - Sets up role-based access control
  - Initializes with 35 billion tokens

#### `scripts/deploy-truffle.js`
- **Purpose**: Alternative deployment script
- **Usage**: `truffle exec scripts/deploy-truffle.js`
- **Features**: Same as migration but can be run independently

### Testing Scripts

#### `scripts/test-presale-truffle.js`
- **Purpose**: Comprehensive testing of presale contract
- **Usage**: `truffle exec scripts/test-presale-truffle.js`
- **Tests**:
  - Contract deployment verification
  - Sale activation
  - Token purchases
  - Purchase limits
  - Vesting mechanism
  - ETH withdrawal
  - Pause/unpause functionality
  - Emergency functions
  - Gas optimization

#### `scripts/test-token-comprehensive.js`
- **Purpose**: Comprehensive testing of NexusWealth Investment Solutions token contract
- **Usage**: `truffle exec scripts/test-token-comprehensive.js`
- **Tests**:
  - Token deployment and basic info
  - Role-based access control
  - Token statistics and supply management
  - Basic transfers and balances
  - Minting and burning functionality
  - Vesting schedule creation
  - Blacklist functionality
  - Pause/unpause functionality
  - Advanced admin functions
  - Gas optimization checks

#### `scripts/interact-truffle.js`
- **Purpose**: Interactive presale contract management
- **Usage**: `truffle exec scripts/interact-truffle.js`
- **Features**:
  - Display contract state
  - Start/stop sale
  - Set sale parameters
  - Test purchases
  - Manage vesting

#### `scripts/manage-token.js`
- **Purpose**: NexusWealth Investment Solutions token contract management and operations
- **Usage**: `truffle exec scripts/manage-token.js`
- **Features**:
  - Display token state and statistics
  - Check account balances and roles
  - Mint and burn tokens
  - Create and manage vesting schedules
  - Blacklist management
  - Contract pause/unpause
  - Role management

## ⚙️ Configuration

### Network Configuration
The deployment scripts automatically configure parameters based on the network:

- **Development**: 0.001 ETH per token, 1M tokens, 0.01-10 ETH limits
- **Sepolia**: 0.001 ETH per token, 1M tokens, 0.01-10 ETH limits  
- **Mainnet**: 0.001 ETH per token, 10M tokens, 0.1-100 ETH limits

### Token Configuration
- **Name**: NexusWealth Investment Solutions
- **Description**: NexusWealth Investment Solutions
- **Symbol**: NWIS
- **Decimals**: 18
- **Max Supply**: 50,000,000,000 NWIS (50 billion) - **IMMUTABLE**
- **Initial Supply**: 35,000,000,000 NWIS (35 billion)

### Address Configuration
Update these addresses in the deployment scripts:

```javascript
const TREASURY_ADDRESS = "0x..."; // Your treasury wallet
const DEV_ADDRESS = "0x...";      // Your development wallet
```

## 🔧 Contract Management

### Presale Contract

#### Starting the Sale
```javascript
// In Truffle console or script
await presale.setSaleStatus(true, { from: owner });
```

#### Setting Sale End Time
```javascript
const endTime = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
await presale.setSaleEndTime(endTime, { from: owner });
```

#### Starting Vesting
```javascript
await presale.startVesting({ from: owner });
```

#### Withdrawing ETH
```javascript
await presale.withdrawETH({ from: owner });
```

### Token Contract

#### Minting Tokens
```javascript
await token.mint(recipient, amount, "Reason", { from: minter });
```

#### Burning Tokens
```javascript
await token.burn(amount, "Reason", { from: burner });
```

#### Creating Vesting Schedule
```javascript
await token.createVestingSchedule(
  beneficiary,
  amount,
  startTime,
  duration,
  cliff,
  revocable,
  { from: vestingRole }
);
```

#### Releasing Vested Tokens
```javascript
await token.releaseVestedTokens(beneficiary, { from: beneficiary });
```

#### Managing Blacklist
```javascript
await token.setBlacklisted(account, true, { from: owner }); // Blacklist
await token.setBlacklisted(account, false, { from: owner }); // Unblacklist
```

#### Voting Management
```javascript
// Create a proposal
await token.createProposal(
  "Increase Token Supply",
  "Proposal to increase max supply by 10%",
  Math.floor(Date.now() / 1000) + 86400, // Start in 24 hours
  604800, // Duration: 7 days
  web3.utils.toWei("1000000", "ether") // Quorum: 1M tokens
);

// Cast a vote
await token.castVote(0, true, { from: voter }); // Vote for proposal 0

// Execute passed proposal
await token.executeProposal(0, { from: owner });

// Check voting power at specific time
const votingPower = await token.getVotingPowerAtTimestamp(voter, proposalStartTime);
```

#### Permit Management (Gasless Approvals)
```javascript
// Get domain separator and nonce for permit signature
const domainSeparator = await token.getDomainSeparator();
const nonce = await token.getNonce(owner);

// Create permit signature (off-chain)
const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
const permitSignature = await owner._signTypedData(
  domainSeparator,
  {
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
  },
  {
    owner: owner,
    spender: spender,
    value: amount,
    nonce: nonce,
    deadline: deadline
  }
);

// Use permit to approve spending
const { v, r, s } = ethers.utils.splitSignature(permitSignature);
await token.permit(owner, spender, amount, deadline, v, r, s);
```

#### Cross-Chain Bridging Management
```javascript
// Set up bridge operators and supported chains
await token.setBridgeOperator(bridgeOperator, true, { from: owner });
await token.setSupportedChain(137, true, { from: owner }); // Polygon
await token.setSupportedChain(56, true, { from: owner });  // BSC

// Update bridge configuration
await token.updateBridgeFee(web3.utils.toWei("0.002", "ether"), { from: owner });
await token.updateBridgeLimits(
  web3.utils.toWei("500", "ether"),      // Min: 500 tokens
  web3.utils.toWei("50000000", "ether")  // Max: 50M tokens
, { from: owner });

// Initiate cross-chain bridge
await token.initiateBridge(
  recipientAddress,
  web3.utils.toWei("10000", "ether"), // 10K tokens
  137, // Polygon chain ID
  "", // Target address (empty for EVM chains)
  { value: web3.utils.toWei("0.001", "ether") } // Bridge fee
);

// Process bridge on destination chain (bridge operator)
await token.processBridge(
  requestId,
  recipientAddress,
  web3.utils.toWei("10000", "ether"),
  sourceChainId,
  bridgeHash,
  { from: bridgeOperator }
);

// Check bridge status
const bridgeRequest = await token.getBridgeRequest(requestId);
const bridgeStats = await token.getBridgeStats();
const isProcessed = await token.isBridgeProcessed(bridgeHash);
```

#### Pausing/Unpausing
```javascript
await token.pause({ from: pauser });     // Pause
await token.unpause({ from: pauser });   // Unpause
```

## 🧪 Testing

### Run All Tests
```bash
# Test presale contract
truffle exec scripts/test-presale-truffle.js

# Test token contract
truffle exec scripts/test-token-comprehensive.js
```

### Interactive Testing
```bash
truffle console
# Then interact with contracts directly
```

### Test Specific Functions
```bash
# Test presale
truffle exec scripts/interact-truffle.js

# Test token management
truffle exec scripts/manage-token.js
```

## 🌐 Network Deployment

### Local Development
```bash
truffle migrate --reset
```

### Sepolia Testnet
```bash
# Set up .env file with your private key and RPC URL
truffle migrate --network sepolia
```

### Mainnet
```bash
# Be very careful with mainnet deployment
truffle migrate --network mainnet
```

## 📊 Contract Verification

### Verify on Etherscan
```bash
# Install truffle-plugin-verify
npm install --save-dev truffle-plugin-verify

# Verify contracts
truffle run verify NexusWealthPresale --network sepolia
truffle run verify NexusWealthToken --network sepolia
```

## 🔐 Access Control

The NexusWealth Investment Solutions token uses OpenZeppelin's Ownable pattern for access control:

- **Owner**: Has full control over all administrative functions
  - Can mint new tokens (up to immutable max supply)
  - Can burn tokens from any address
  - Can pause/unpause token transfers
  - Can blacklist/unblacklist accounts
  - Can create and manage vesting schedules
  - Can recover mistakenly sent ERC20 tokens
  - Can transfer ownership to a new address

## 📅 Vesting System

The NexusWealth Investment Solutions token contract includes a sophisticated vesting system:

- **Cliff Period**: Tokens are locked for a specified duration
- **Linear Vesting**: Tokens vest linearly over the vesting period
- **Revocable Schedules**: Can be revoked if needed
- **Automatic Calculation**: Claimable amounts calculated automatically
- **Flexible Parameters**: Customizable start time, duration, and cliff

## 🗳️ Voting System

The NexusWealth Investment Solutions token implements a timestamp-based voting system:

- **Timestamp-Based Voting Power**: Voting power is determined by token balance at proposal start time
- **Proposal Management**: Create, vote on, and execute governance proposals
- **Quorum Requirements**: Configurable minimum voting participation
- **Vote Tracking**: Comprehensive tracking of all votes and voting power
- **Checkpoint System**: Efficient balance tracking for historical voting power

### Voting Functions
- `createProposal()` - Create new governance proposals (Owner only)
- `castVote()` - Vote on active proposals
- `executeProposal()` - Execute passed proposals (Owner only)
- `cancelProposal()` - Cancel proposals (Proposer only)
- `getVotingPowerAtTimestamp()` - Get voting power at specific time
- `getProposal()` - Get proposal details
- `getVoteInfo()` - Get voting information for specific proposal/voter

## 🌉 Cross-Chain Bridging System

The NexusWealth Investment Solutions token features a secure cross-chain bridging system:

- **Multi-Chain Support**: Transfer tokens between different blockchain networks
- **Secure Verification**: Cryptographic hash verification for bridge integrity
- **Operator Management**: Trusted bridge operators for cross-chain processing
- **Fee System**: Configurable bridge fees for sustainability
- **Amount Limits**: Configurable minimum and maximum bridge amounts
- **Non-EVM Support**: String-based addressing for non-Ethereum chains

### Bridge Configuration
- **Bridge Fee**: 0.001 ETH per bridge request
- **Min Amount**: 1,000 NWIS tokens
- **Max Amount**: 50,000,000 NWIS tokens (50 million)
- **Supported Chains**: Configurable by owner
- **Bridge Operators**: Trusted addresses for processing bridges

### Bridge Workflow
1. **Initiation**: User burns tokens and pays bridge fee
2. **Verification**: Bridge hash created for security
3. **Processing**: Bridge operator processes on target chain
4. **Completion**: Tokens minted on destination chain

## 🛡️ Security Features

The NexusWealth Investment Solutions token implements multiple security measures:

- **ReentrancyGuard**: Prevents reentrancy attacks on critical functions
- **Pausable**: Can pause all transfers in emergency situations
- **Blacklist**: Can block specific addresses from transfers
- **Ownable**: Simple and secure single-owner access control
- **Input validation**: Comprehensive parameter checks and requirements
- **Immutable Max Supply**: Maximum token supply cannot be changed after deployment
- **Access Control**: Secure ownership management with OpenZeppelin's Ownable
- **Voting Security**: Timestamp-based voting power prevents manipulation
- **Permit Security**: EIP-2612 compliant permit with blacklist integration
- **Bridge Security**: Cryptographic verification and operator management

## 🚨 Security Considerations

1. **Private Keys**: Never commit private keys to version control
2. **Address Verification**: Double-check all addresses before deployment
3. **Testing**: Always test on testnets before mainnet
4. **Auditing**: Consider professional smart contract audit
5. **Access Control**: Review owner permissions and access controls
6. **Ownership Management**: Carefully manage ownership transfers
7. **Vesting Security**: Ensure vesting schedules are properly configured
8. **Permit Signatures**: Verify signature validity and deadline enforcement
9. **Blacklist Integration**: Ensure permit respects blacklist status
10. **Bridge Security**: Verify bridge operators and hash verification
11. **Cross-Chain Risks**: Understand risks of cross-chain operations

## 🔍 Troubleshooting

### Common Issues

#### Contract Deployment Fails
- Check gas limits in truffle-config.js
- Verify account has sufficient ETH for deployment
- Check Solidity compiler version compatibility

#### Transaction Reverts
- Verify sale is active (for presale)
- Check purchase limits (for presale)
- Ensure sufficient token balance in contract
- Check role permissions (for token operations)

#### Gas Estimation Errors
- Check function parameters
- Verify contract state
- Ensure account has sufficient ETH
- Check role permissions

### Debug Commands
```bash
# Check presale state
truffle console
const presale = await NexusWealthPresale.deployed()
const saleInfo = await presale.getSaleInfo()
console.log(saleInfo)

# Check token state
const token = await NexusWealthToken.deployed()
const stats = await token.getTokenStats()
console.log(stats)

# Check vesting info
const vestingInfo = await token.getVestingInfo(beneficiary)
console.log(vestingInfo)
```

## 📚 Additional Resources

- [Truffle Documentation](https://www.trufflesuite.com/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethereum Development](https://ethereum.org/developers/)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review contract code and configuration
3. Test on local network first
4. Check Truffle and network logs

## 📝 License

This project is licensed under the MIT License.

## 🪙 NexusWealth Investment Solutions Token Characteristics

### **Basic Token Info**
- **Name**: NexusWealth Investment Solutions
- **Description**: NexusWealth Investment Solutions
- **Symbol**: NWIS
- **Decimals**: 18
- **Max Supply**: 50,000,000,000 NWIS (50 billion) - **IMMUTABLE**
- **Initial Supply**: 35,000,000,000 NWIS (35 billion)

### **Core ERC20 Functions**
- `transfer(address to, uint256 amount)` - Standard token transfer
- `transferFrom(address from, address to, uint256 amount)` - Approved transfer
- `approve(address spender, uint256 amount)` - Approve spending
- `allowance(address owner, address spender)` - Check allowance
- `balanceOf(address account)` - Check balance
- `totalSupply()` - Get current total supply

### **Permit Functions (Gasless Approvals)**
- `permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)` - Approve spending using signature
- `getDomainSeparator()` - Get domain separator for permit signatures
- `getNonce(address owner)` - Get current nonce for permit signatures

### **Cross-Chain Bridging Functions**
- `initiateBridge(address to, uint256 amount, uint256 targetChainId, string targetAddress)` - Start cross-chain transfer
- `processBridge(uint256 requestId, address recipient, uint256 amount, uint256 sourceChainId, bytes32 bridgeHash)` - Complete bridge (operators only)
- `getBridgeRequest(uint256 requestId)` - Get bridge request details
- `getBridgeStats()` - Get bridge statistics
- `isBridgeProcessed(bytes32 bridgeHash)` - Check if bridge was processed
- `setBridgeOperator(address operator, bool isOperator)` - Manage bridge operators (Owner only)
- `setSupportedChain(uint256 chainId, bool isSupported)` - Manage supported chains (Owner only)
- `updateBridgeFee(uint256 newFee)` - Update bridge fee (Owner only)
- `updateBridgeLimits(uint256 minAmount, uint256 maxAmount)` - Update bridge limits (Owner only)
- `withdrawBridgeFees()` - Withdraw accumulated fees (Owner only)
