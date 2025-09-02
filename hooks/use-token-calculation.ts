"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract } from "wagmi"

// Mock contract ABI for token calculation and purchase
const TOKEN_SALE_ABI = [
  {
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "currency", type: "string" },
    ],
    name: "calculateTokens",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "currency", type: "string" },
    ],
    name: "buyTokens",
    outputs: [],
    stateMutability: "nonpayable", // Or "payable" if it accepts ETH directly
    type: "function",
  },
] as const

// Mock contract address
const TOKEN_SALE_CONTRACT = "0x1234567890123456789012345678901234567890"

interface UseTokenCalculationProps {
  amount: string
  currency: string
  ethPrice?: number
  enabled?: boolean
}

export function useTokenCalculation({ amount, currency, ethPrice = 2500, enabled = true }: UseTokenCalculationProps) {
  const { isConnected } = useAccount()
  const [isCalculating, setIsCalculating] = useState(false)
  const [tokenAmount, setTokenAmount] = useState<string>("")

  // Mock smart contract call for token calculation
  const { data: contractResult, isLoading: contractLoading } = useReadContract({
    address: TOKEN_SALE_CONTRACT,
    abi: TOKEN_SALE_ABI,
    functionName: "calculateTokens",
    args: amount && currency ? [BigInt(Number.parseFloat(amount) * 1e18), currency] : undefined,
    query: {
      enabled: Boolean(amount && currency && isConnected && enabled),
    },
  })

  useEffect(() => {
    if (!amount || !isConnected) {
      setTokenAmount("")
      return
    }

    // Don't clear token amount if just disabled - only clear if no amount or not connected
    if (!enabled) {
      return
    }

    setIsCalculating(true)

    // Simulate smart contract call delay
    const timer = setTimeout(() => {
      // Calculate based on currency rates with live ETH price
      let calculatedTokens = 0
      
      if (currency === "ETH") {
        // For ETH: (ETH amount * ETH price in USD) / NWIS token price ($0.001)
        const ethAmountUSD = Number.parseFloat(amount) * ethPrice
        calculatedTokens = ethAmountUSD / 0.001
      } else if (currency === "USDT" || currency === "USDC") {
        // For stablecoins: (amount * 1) / NWIS token price ($0.001)
        // Note: USDT/USDC have 6 decimals, but we're calculating based on USD value
        calculatedTokens = Number.parseFloat(amount) / 0.001
      } else {
        // Fallback for other currencies
        calculatedTokens = Number.parseFloat(amount) / 0.001
      }

      setTokenAmount(calculatedTokens.toLocaleString())
      setIsCalculating(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [amount, currency, isConnected, enabled, ethPrice])

  return {
    tokenAmount,
    isCalculating: isCalculating || contractLoading,
    isConnected,
  }
}
