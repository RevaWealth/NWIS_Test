// Contract ABI for the presale contract
export const PRESALE_ABI = [
  // Buy function for ERC20 tokens (USDT, USDC)
  {
    "inputs": [
      {"name": "_token", "type": "address"},
      {"name": "_amount", "type": "uint256"}
    ],
    "name": "buyToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Buy function for ETH purchases
  {
    "inputs": [
      {"name": "_ethUsdPrice", "type": "uint256"},
      {"name": "_backendTimestamp", "type": "uint256"},
      {"name": "_backendSignature", "type": "bytes"}
    ],
    "name": "buyTokenWithEthPrice",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  // Get pay amount function
  {
    "inputs": [
      {"name": "token", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "getPayAmount",
    "outputs": [
      {"name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// ERC20 ABI for token allowance and approval
export const ERC20_ABI = [
  {
    "inputs": [
      {"name": "owner", "type": "address"},
      {"name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "spender", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Contract address from Sepolia deployment
export const PRESALE_CONTRACT_ADDRESS = "0x30e0c9c7e3661176595f1d2b1a1563a990ac0b0e";

// Network configurations
export const NETWORKS = {
  MAINNET: 1,
  SEPOLIA: 11155111,
  POLYGON: 137,
  MUMBAI: 80001,
  BSC: 56,
  BSC_TESTNET: 97,
} as const;

// Required network for the presale
export const REQUIRED_NETWORK = NETWORKS.SEPOLIA;

// Token addresses for different networks
export const TOKEN_ADDRESSES = {
  USDT: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0", // USDT address on Sepolia
  USDC: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8", // USDC address on Sepolia
  ETH: "0x0000000000000000000000000000000000000000", // ETH address (zero address)
} as const;

// Token decimals
export const TOKEN_DECIMALS = {
  ETH: 18,
  USDT: 6,
  USDC: 6,
} as const;

// Default token purchase agreement values
export const DEFAULT_PROPS = {
  currentPrice: "$0.0010",
  amountRaised: "$0",
  tokenValue: "1 NWIS = $0.0010",
  progressPercentage: "0",
  totalTokensForSale: "1000000",
  totalTokensSold: "0"
} as const;
