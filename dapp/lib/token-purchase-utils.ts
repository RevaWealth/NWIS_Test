import { NETWORKS, TOKEN_ADDRESSES, TOKEN_DECIMALS } from './constants';

// Helper function to get network name from chain ID
export const getNetworkName = (chainId: number | undefined): string => {
  if (!chainId) return 'Unknown'
  switch (chainId) {
    case NETWORKS.MAINNET: return 'Ethereum Mainnet'
    case NETWORKS.SEPOLIA: return 'Sepolia Testnet'
    case NETWORKS.POLYGON: return 'Polygon'
    case NETWORKS.MUMBAI: return 'Mumbai Testnet'
    case NETWORKS.BSC: return 'BSC'
    case NETWORKS.BSC_TESTNET: return 'BSC Testnet'
    default: return `Chain ID ${chainId}`
  }
}

// Get token address for a given currency
export const getTokenAddress = (currency: keyof typeof TOKEN_ADDRESSES): string => {
  return TOKEN_ADDRESSES[currency] || TOKEN_ADDRESSES.ETH;
}

// Convert amount to smallest units based on currency
export const convertToSmallestUnits = (amount: string, currency: keyof typeof TOKEN_DECIMALS): bigint | undefined => {
  const parsedAmount = Number.parseFloat(amount)
  
  // Check if the parsed amount is a valid number
  if (isNaN(parsedAmount) || !isFinite(parsedAmount) || parsedAmount <= 0) {
    return undefined
  }
  
  const decimals = TOKEN_DECIMALS[currency]
  return BigInt(Math.floor(parsedAmount * Math.pow(10, decimals)))
}

// Convert from smallest units to readable format
export const convertFromSmallestUnits = (amount: bigint, currency: keyof typeof TOKEN_DECIMALS): string => {
  const decimals = TOKEN_DECIMALS[currency]
  return (Number(amount) / Math.pow(10, decimals)).toFixed(decimals === 18 ? 6 : 2)
}

// Validate amount input
export const isValidAmount = (amount: string): boolean => {
  if (amount === "") return true
  return /^\d*\.?\d*$/.test(amount)
}

// Calculate ETH amount needed for NWIS tokens
export const calculateEthAmountForNwis = (
  nwisAmount: string, 
  ethPrice: number, 
  nwisPrice: number = 0.001
): number | null => {
  const parsedNwisAmount = Number.parseFloat(nwisAmount)
  if (isNaN(parsedNwisAmount) || !isFinite(parsedNwisAmount) || parsedNwisAmount <= 0) {
    return null
  }
  
  const usdValue = parsedNwisAmount * nwisPrice
  return usdValue / ethPrice
}

// Calculate NWIS tokens from payment amount
export const calculateNwisFromAmount = (
  amount: string,
  currency: keyof typeof TOKEN_DECIMALS,
  ethPrice: number,
  nwisPrice: number = 0.001
): number => {
  const parsedAmount = Number.parseFloat(amount)
  if (isNaN(parsedAmount) || !isFinite(parsedAmount) || parsedAmount <= 0) {
    return 0
  }
  
  if (currency === "ETH") {
    // For ETH: (ETH amount * ETH price in USD) / NWIS token price
    const ethAmountUSD = parsedAmount * ethPrice
    return ethAmountUSD / nwisPrice
  } else {
    // For stablecoins: (amount * 1) / NWIS token price
    return parsedAmount / nwisPrice
  }
}

// Format number with locale string
export const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

// Check if device is mobile
export const isMobileDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
