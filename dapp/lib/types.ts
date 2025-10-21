// Token purchase component props
export interface TokenPurchaseProps {
  currentPrice?: string
  amountRaised?: string
  tokenValue?: string
  progressPercentage?: string
  totalTokensForSale?: string
  totalTokensSold?: string
}

// Currency configuration
export interface CurrencyConfig {
  icon: React.ComponentType<{ className?: string }>
  color: string
}

// Contract data structure
export interface ContractData {
  totalTokensForSale: number
  totalTokensSold: number
  progressPercentage: string
  saleActive: boolean
  currentTier: {
    index: number
    startAmount: number
    endAmount: number
    price: number
  }
  nextTier: {
    index: number
    startAmount: number
    endAmount: number
    price: number
  }
}

// Transaction details for confirmation dialog
export interface TransactionDetails {
  amountPaid: string
  gasEstimate: string
  nwisAmount: string
  contractAddress: string
  buyerAddress: string
  currency: string
}

// Currency types
export type Currency = 'ETH' | 'USDT' | 'USDC'

// Network types
export type NetworkId = 1 | 11155111 | 137 | 80001 | 56 | 97
