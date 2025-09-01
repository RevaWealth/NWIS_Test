import { NextResponse } from 'next/server';
import Web3 from 'web3';

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

// Contract address on Sepolia testnet - UPDATED
const PRESALE_CONTRACT_ADDRESS = "0x30e0c9c7e3661176595f1d2b1a1563a990ac0b0e";

// Sepolia RPC endpoint (using Alchemy)
const SEPOLIA_RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/t_cKAT7elVCzwNTz3E8Ht";

export async function GET() {
  try {
    console.log('🔗 Connecting to Sepolia testnet...');
    
    // Connect to Sepolia testnet
    const web3 = new Web3(SEPOLIA_RPC_URL);
    
    // Test basic connection
    const blockNumber = await web3.eth.getBlockNumber();
    console.log('✅ Connected to Sepolia. Latest block:', blockNumber);
    
    // Create contract instance
    const presaleContract = new web3.eth.Contract(PRESALE_ABI, PRESALE_CONTRACT_ADDRESS);
    
    console.log('📊 Fetching sale status...');
    const saleStatus = await presaleContract.methods.saleStatus().call();
    console.log('✅ Sale status:', saleStatus);
    
    console.log('📊 Fetching total tokens for sale...');
    const totalTokensForSale = await presaleContract.methods.totalTokensforSale().call();
    console.log('✅ Total tokens for sale:', totalTokensForSale);
    
    console.log('📊 Fetching total tokens sold...');
    const totalTokensSold = await presaleContract.methods.totalTokensSold().call();
    console.log('✅ Total tokens sold:', totalTokensSold);
    
    // Get current tier information
    console.log('📊 Fetching current tier info...');
    const currentTierInfo = await presaleContract.methods.getCurrentTierInfo().call();
    console.log('✅ Current tier info:', currentTierInfo);
    
    console.log('📊 Fetching next tier info...');
    const nextTierInfo = await presaleContract.methods.getNextTierInfo().call();
    console.log('✅ Next tier info:', nextTierInfo);
    
    // Convert price from smallest units (6 decimals) to USD
    const currentPriceUSD = parseFloat(currentTierInfo.price) / 1e6;
    
    // Calculate progress percentage
    const progressPercentage = totalTokensForSale > 0 
      ? ((parseFloat(totalTokensSold) / parseFloat(totalTokensForSale)) * 100).toFixed(2)
      : "0.00";
    
    // Calculate amount raised (tokens sold * current price)
    const amountRaised = parseFloat(totalTokensSold) * currentPriceUSD;
    
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
        price: parseFloat(nextTierInfo.price) / 1e6
      } : null,
      tokensUntilNextTier: nextTierInfo.hasNextTier 
        ? (parseFloat(nextTierInfo.startAmount) - parseFloat(totalTokensSold)).toString()
        : "0"
    };

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ Error fetching token sale data:', error);
    
    // Log specific error details for debugging
    if (error.message) {
      console.error('❌ Error message:', error.message);
    }
    if (error.code) {
      console.error('❌ Error code:', error.code);
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
