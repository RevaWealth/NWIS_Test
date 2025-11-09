import { NextResponse } from 'next/server';
import Web3 from 'web3';

// In-memory cache for token sale data
interface TokenSaleCache {
  data: any;
  timestamp: number;
}

let tokenSaleCache: TokenSaleCache | null = null;
const TOKEN_SALE_CACHE_DURATION = 60000; // 1 minute in milliseconds (longer than ETH price since blockchain data changes less frequently)

type TierInfoResponse = {
  0: string;
  1: string;
  2: string;
  3: string;
  tierIndex: string;
  startAmount: string;
  endAmount: string;
  price: string;
};

type NextTierInfoResponse = {
  0: boolean;
  1: string;
  2: string;
  3: string;
  4: string;
  hasNextTier: boolean;
  tierIndex: string;
  startAmount: string;
  endAmount: string;
  price: string;
};

// Contract ABI for the NexusWealthPresale contract - UPDATED
const PRESALE_ABI = [
  // Sale Status
  {
    "inputs": [],
    "name": "saleStatus",
    "outputs": [{"type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalTokensforSale",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalTokensSold",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Current Tier Information
  {
    "inputs": [],
    "name": "getCurrentTierInfo",
    "outputs": [
      {"name": "tierIndex", "type": "uint256"},
      {"name": "startAmount", "type": "uint256"},
      {"name": "endAmount", "type": "uint256"},
      {"name": "price", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Next Tier Information
  {
    "inputs": [],
    "name": "getNextTierInfo",
    "outputs": [
      {"name": "hasNextTier", "type": "bool"},
      {"name": "tierIndex", "type": "uint256"},
      {"name": "startAmount", "type": "uint256"},
      {"name": "endAmount", "type": "uint256"},
      {"name": "price", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Purchase Preview
  {
    "inputs": [
      {"name": "token", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "getTokenAmount",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Token Whitelist Check
  {
    "inputs": [{"name": "", "type": "address"}],
    "name": "payableTokens",
    "outputs": [{"type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Buy function for ERC20 tokens
  {
    "inputs": [
      {"name": "tokenAddress", "type": "address"},
      {"name": "tokenAmount", "type": "uint256"}
    ],
    "name": "buyToken",
    "outputs": [{"type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract address on ETHEREUM MAINNET
const PRESALE_CONTRACT_ADDRESS = "0xECA1795FaFC23E7077Da9F6654573844BB8DC43e";

// Ethereum Mainnet RPC endpoint (public RPC)
const MAINNET_RPC_URL = "https://ethereum-rpc.publicnode.com";

export async function GET() {
  try {
    const now = Date.now();
    
    // Check if we have a valid cached token sale data
    if (tokenSaleCache && (now - tokenSaleCache.timestamp) < TOKEN_SALE_CACHE_DURATION) {
      console.log('📦 Using cached token sale data');
      return NextResponse.json({
        ...tokenSaleCache.data,
        cached: true
      });
    }
    
    console.log('🔗 Fetching fresh token sale data from blockchain...');
    
    // Connect to Ethereum Mainnet
    const web3 = new Web3(MAINNET_RPC_URL);
    
    // Test basic connection
    const blockNumber = await web3.eth.getBlockNumber();
    console.log('✅ Connected to Ethereum Mainnet. Latest block:', blockNumber);
    
    // Create contract instance
    const presaleContract = new web3.eth.Contract(PRESALE_ABI, PRESALE_CONTRACT_ADDRESS);
    
    console.log('📊 Fetching sale status...');
    const saleStatus = await presaleContract.methods.saleStatus().call() as boolean;
    console.log('✅ Sale status:', saleStatus);
    
    console.log('📊 Fetching total tokens for sale...');
    const totalTokensForSale = await presaleContract.methods.totalTokensforSale().call() as bigint;
    console.log('✅ Total tokens for sale:', totalTokensForSale);
    
    console.log('📊 Fetching total tokens sold...');
    const totalTokensSold = await presaleContract.methods.totalTokensSold().call() as bigint;
    console.log('✅ Total tokens sold:', totalTokensSold);
    
    // Get current tier information
    console.log('📊 Fetching current tier info...');
    const currentTierInfoRaw = await presaleContract.methods.getCurrentTierInfo().call();
    const currentTierInfo = currentTierInfoRaw as unknown as TierInfoResponse;
    console.log('✅ Current tier info:', currentTierInfo);
    
    console.log('📊 Fetching next tier info...');
    const nextTierInfoRaw = await presaleContract.methods.getNextTierInfo().call();
    const nextTierInfo = nextTierInfoRaw as unknown as NextTierInfoResponse;
    console.log('✅ Next tier info:', nextTierInfo);
    
    // Convert price from smallest units (6 decimals) to USD
    const currentPriceUSD = parseFloat(currentTierInfo.price.toString()) / 1e6;
    
    // Convert totals from wei (1e18) to whole tokens
    const totalTokensForSaleTokens = parseFloat(totalTokensForSale.toString()) / 1e18;
    const totalTokensSoldTokens = parseFloat(totalTokensSold.toString()) / 1e18;

    // Calculate progress percentage
    const progressPercentage = totalTokensForSale > 0 
      ? ((totalTokensSoldTokens / totalTokensForSaleTokens) * 100).toFixed(2)
      : "0.00";
    
    // Calculate amount raised (tokens sold * current USD price per token)
    const amountRaised = totalTokensSoldTokens * currentPriceUSD;
    
    const data = {
      saleActive: saleStatus,
      currentPrice: `$${currentPriceUSD.toFixed(4)}`,
      amountRaised: `$${amountRaised.toLocaleString()}`,
      tokenValue: `1 NWIS = $${currentPriceUSD.toFixed(4)}`,
      progressPercentage: progressPercentage,
      totalTokensForSale: totalTokensForSale.toString(),
      totalTokensSold: totalTokensSold.toString(),
      currentTier: {
        index: currentTierInfo.tierIndex.toString(),
        startAmount: currentTierInfo.startAmount.toString(),
        endAmount: currentTierInfo.endAmount.toString(),
        price: currentPriceUSD
      },
      nextTier: nextTierInfo.hasNextTier ? {
        index: nextTierInfo.tierIndex.toString(),
        startAmount: nextTierInfo.startAmount.toString(),
        endAmount: nextTierInfo.endAmount.toString(),
        price: parseFloat(nextTierInfo.price.toString()) / 1e6
      } : null,
      tokensUntilNextTier: nextTierInfo.hasNextTier 
        ? (
            parseFloat(nextTierInfo.startAmount?.toString() ?? "0") -
            parseFloat(totalTokensSold?.toString?.() ?? "0")
          ).toString()
        : "0"
    };

    // Update cache with new data
    tokenSaleCache = {
      data: data,
      timestamp: now
    };

    console.log('✅ Token sale data fetched and cached');

    return NextResponse.json({
      ...data,
      cached: false
    });
    
  } catch (error) {
    console.error('❌ Error fetching token sale data:', error);
    
    // If we have cached data, use it even if it's expired
    if (tokenSaleCache) {
      console.log('📦 Using expired cached token sale data as fallback');
      return NextResponse.json({
        ...tokenSaleCache.data,
        cached: true,
        expired: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    // Log specific error details for debugging
    if (error instanceof Error && error.message) {
      console.error('❌ Error message:', error.message);
    }
    if (typeof error === 'object' && error !== null && 'code' in error) {
      console.error('❌ Error code:', (error as any).code);
    }
    
    // Log the specific step that failed
    console.error('❌ Contract connection failed. Using fallback data.');
    
    // Fallback data if contract connection fails
    const fallbackData = {
      saleActive: false,
      currentPrice: "$0.001",
      amountRaised: "$0",
      tokenValue: "1 NWIS = $0.001",
      progressPercentage: "0.00",
      totalTokensForSale: "30000000000000000000000000000", // 30B tokens with 18 decimals
      totalTokensSold: "0",
      currentTier: {
        index: "0",
        startAmount: "0",
        endAmount: "1000000000000000000000000000",
        price: 0.001
      },
      nextTier: {
        index: "1",
        startAmount: "1000000000000000000000000000",
        endAmount: "3500000000000000000000000000",
        price: 0.002
      },
      tokensUntilNextTier: "1000000000000000000000000000"
    };

    return NextResponse.json(fallbackData);
  }
}
