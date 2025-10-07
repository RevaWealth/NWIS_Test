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

// Contract address from Ethereum mainnet deployment
export const PRESALE_CONTRACT_ADDRESS = "0xECA1795FaFC23E7077Da9F6654573844BB8DC43e";

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
export const REQUIRED_NETWORK = NETWORKS.MAINNET;

// Token addresses for different networks
export const TOKEN_ADDRESSES = {
  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT address on Ethereum mainnet
  USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC address on Ethereum mainnet
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
