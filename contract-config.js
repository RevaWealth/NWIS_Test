/**
 * Contract Configuration for NexusWealth PreSale Dapp
 * This file contains all the necessary contract addresses, ABIs, and configuration
 * for connecting your dapp to the deployed smart contracts on Sepolia testnet.
 */

// ============================================================================
// CONTRACT ADDRESSES (SEPOLIA TESTNET)
// ============================================================================

export const CONTRACT_ADDRESSES = {
    // Main contracts
    PRESALE_CONTRACT: "0x478dBa1446951Ae3679C40bc0e6566e24cedB520",
    NWIS_TOKEN: "0xACCeea4CFe324AD2597EE6193642f60917C254f7",
    
    // Network configuration
    NETWORK_ID: 11155111, // Sepolia testnet
    NETWORK_NAME: "Sepolia Testnet",
    
    // Backend configuration
    BACKEND_SIGNER: "0x9c784Eb444866fAa7101221DB14D96Ae6B7fC9a0",
    ALCHEMY_API_KEY: "iw39nauos-kYHDLTagkEj", // Your Alchemy Project ID
    ALCHEMY_ENDPOINT: "https://eth-sepolia.g.alchemy.com/v2/iw39nauos-kYHDLTagkEj"
};

// ============================================================================
// CONTRACT ABIs (Essential Functions Only)
// ============================================================================

export const PRESALE_CONTRACT_ABI = [
    // Core purchase functions
    "function buyToken(uint256 _ethAmount, uint256 _ethPrice, bytes calldata _signature) external payable",
    "function buyTokenWithEthPrice(uint256 _ethAmount, uint256 _ethPrice, bytes calldata _signature) external payable",
    "function buyTokenWithEthPriceDev(uint256 _ethAmount, uint256 _ethPrice, bytes calldata _signature) external payable",
    
    // Preview functions
    "function previewEthPurchase(uint256 _ethAmount, uint256 _ethPrice) external view returns (uint256 tokensToReceive, uint256 usdValue)",
    "function previewTokenPurchase(uint256 _tokenAmount, address _tokenAddress, uint256 _tokenPrice) external view returns (uint256 tokensToReceive, uint256 usdValue)",
    
    // View functions
    "function saleStatus() external view returns (bool)",
    "function getSaleToken() external view returns (address)",
    "function getTotalTokensForSale() external view returns (uint256)",
    "function getSoldTokens() external view returns (uint256)",
    "function getRemainingTokens() external view returns (uint256)",
    "function getBackendSigner() external view returns (address)",
    "function backendVerificationEnabled() external view returns (bool)",
    "function getPayableTokens() external view returns (address[])",
    "function getTokenPrice(address _token) external view returns (uint256)",
    "function getPurchaseLimits() external view returns (uint256 minPurchase, uint256 maxPurchase)",
    "function getUserPurchaseHistory(address _user) external view returns (uint256 totalPurchased, uint256 totalSpent)",
    
    // Events
    "event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokensReceived, uint256 ethPrice, uint256 timestamp)",
    "event PriceUpdated(address indexed token, uint256 oldPrice, uint256 newPrice, uint256 timestamp)"
];

export const NWIS_TOKEN_ABI = [
    // Basic ERC20 functions
    "function name() external view returns (string memory)",
    "function symbol() external view returns (string memory)",
    "function decimals() external view returns (uint8)",
    "function totalSupply() external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    
    // Advanced features
    "function isBlacklisted(address account) external view returns (bool)",
    "function pause() external",
    "function unpause() external",
    "function paused() external view returns (bool)"
];

// ============================================================================
// NETWORK CONFIGURATION
// ============================================================================

export const NETWORK_CONFIG = {
    sepolia: {
        chainId: "0xaa36a7", // 11155111 in hex
        chainName: "Sepolia testnet",
        nativeCurrency: {
            name: "Sepolia Ether",
            symbol: "SEP",
            decimals: 18
        },
        rpcUrls: [
            "https://eth-sepolia.g.alchemy.com/v2/iw39nauos-kYHDLTagkEj",
            "https://rpc.sepolia.org"
        ],
        blockExplorerUrls: ["https://sepolia.etherscan.io"]
    }
};

// ============================================================================
// PRICING CONFIGURATION
// ============================================================================

export const PRICING_CONFIG = {
    // Default prices (can be updated by backend)
    DEFAULT_ETH_PRICE: 2500, // $2500 USD per ETH
    DEFAULT_NWIS_PRICE: 0.001, // $0.001 USD per NWIS token
    
    // Price update intervals
    PRICE_UPDATE_INTERVAL: 30000, // 30 seconds
    
    // Price sources
    PRICE_SOURCES: {
        COINGECKO: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
        ALCHEMY: "https://eth-sepolia.g.alchemy.com/v2/iw39nauos-kYHDLTagkEj"
    }
};

// ============================================================================
// PURCHASE LIMITS
// ============================================================================

export const PURCHASE_LIMITS = {
    MIN_PURCHASE_ETH: 0.01, // Minimum 0.01 ETH
    MAX_PURCHASE_ETH: 10,   // Maximum 10 ETH
    MIN_PURCHASE_USD: 25,   // Minimum $25 USD
    MAX_PURCHASE_USD: 25000 // Maximum $25,000 USD
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const formatTokenAmount = (amount, decimals = 18) => {
    return (amount / Math.pow(10, decimals)).toFixed(6);
};

export const parseTokenAmount = (amount, decimals = 18) => {
    return Math.floor(amount * Math.pow(10, decimals));
};

export const formatEthAmount = (weiAmount) => {
    return (weiAmount / 1e18).toFixed(6);
};

export const parseEthAmount = (ethAmount) => {
    return Math.floor(ethAmount * 1e18);
};

export const formatUSD = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
    NETWORK_NOT_SUPPORTED: "Please connect to Sepolia testnet",
    INSUFFICIENT_BALANCE: "Insufficient balance for this purchase",
    PURCHASE_LIMITS_EXCEEDED: "Purchase amount exceeds limits",
    SALE_NOT_ACTIVE: "Presale is not currently active",
    INVALID_SIGNATURE: "Invalid price signature from backend",
    USER_REJECTED: "Transaction was rejected by user",
    NETWORK_ERROR: "Network error occurred",
    CONTRACT_ERROR: "Smart contract error occurred"
};

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
    PURCHASE_SUCCESS: "Tokens purchased successfully!",
    APPROVAL_SUCCESS: "Token approval successful!",
    CONNECTION_SUCCESS: "Wallet connected successfully!",
    NETWORK_SWITCHED: "Network switched to Sepolia successfully!"
};

// ============================================================================
// EXPORT DEFAULT CONFIG
// ============================================================================

export default {
    CONTRACT_ADDRESSES,
    PRESALE_CONTRACT_ABI,
    NWIS_TOKEN_ABI,
    NETWORK_CONFIG,
    PRICING_CONFIG,
    PURCHASE_LIMITS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    formatTokenAmount,
    parseTokenAmount,
    formatEthAmount,
    parseEthAmount,
    formatUSD
};
