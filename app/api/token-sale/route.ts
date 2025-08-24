import { NextResponse } from 'next/server';
import Web3 from 'web3';

// Contract ABI for the presale contract
const PRESALE_ABI = [
  {
    "inputs": [],
    "name": "getSaleInfo",
    "outputs": [
      { "name": "_saleActive", "type": "bool" },
      { "name": "_tokenPrice", "type": "uint256" },
      { "name": "_totalTokensForSale", "type": "uint256" },
      { "name": "_totalTokensSold", "type": "uint256" },
      { "name": "_minPurchase", "type": "uint256" },
      { "name": "_maxPurchase", "type": "uint256" },
      { "name": "_saleStartTime", "type": "uint256" },
      { "name": "_saleEndTime", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract addresses from our deployment
const PRESALE_CONTRACT_ADDRESS = "0xBcFc8FD134C113F3DBeb419A207d4D1cc477dC47";
const LOCAL_BLOCKCHAIN_URL = "http://127.0.0.1:8545";

export async function GET() {
  try {
    // Connect to local blockchain
    const web3 = new Web3(LOCAL_BLOCKCHAIN_URL);
    
    // Create contract instance
    const presaleContract = new web3.eth.Contract(PRESALE_ABI, PRESALE_CONTRACT_ADDRESS);
    
    // Get sale information from smart contract
    const saleInfo = await presaleContract.methods.getSaleInfo().call();
    
    // Convert wei to ether for display
    const tokenPriceEth = web3.utils.fromWei(saleInfo._tokenPrice, 'ether');
    const totalTokensForSale = web3.utils.fromWei(saleInfo._totalTokensForSale, 'ether');
    const totalTokensSold = web3.utils.fromWei(saleInfo._totalTokensSold, 'ether');
    const minPurchase = web3.utils.fromWei(saleInfo._minPurchase, 'ether');
    const maxPurchase = web3.utils.fromWei(saleInfo._maxPurchase, 'ether');
    
    // Calculate amount raised (tokens sold * price)
    const amountRaised = parseFloat(totalTokensSold) * parseFloat(tokenPriceEth);
    
    // Calculate progress percentage
    const progressPercentage = (parseFloat(totalTokensSold) / parseFloat(totalTokensForSale)) * 100;
    
    const data = {
      currentPrice: `$${parseFloat(tokenPriceEth).toFixed(6)}`,
      amountRaised: `$${amountRaised.toLocaleString()}`,
      tokenValue: `1 NWIS = $${parseFloat(tokenPriceEth).toFixed(6)}`,
      progressPercentage: progressPercentage.toFixed(2),
      totalTokensForSale: totalTokensForSale,
      totalTokensSold: totalTokensSold,
      minPurchase: minPurchase,
      maxPurchase: maxPurchase,
      saleActive: saleInfo._saleActive,
      saleStartTime: saleInfo._saleStartTime,
      saleEndTime: saleInfo._saleEndTime
    };

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching token sale data:', error);
    
    // Fallback data if contract connection fails
    const fallbackData = {
      currentPrice: "$0.007125",
      amountRaised: "$0",
      tokenValue: "1 NWIS = $0.007125",
      progressPercentage: "0.00",
      totalTokensForSale: "1000000",
      totalTokensSold: "0",
      minPurchase: "0.01",
      maxPurchase: "10",
      saleActive: false,
      saleStartTime: "0",
      saleEndTime: "0"
    };

    return NextResponse.json(fallbackData);
  }
}
