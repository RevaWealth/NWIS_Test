import { useState, useCallback } from 'react'
import { ContractData } from '@/lib/types'

export const useContractData = () => {
  const [contractData, setContractData] = useState<ContractData>({
    totalTokensForSale: 0,
    totalTokensSold: 0,
    progressPercentage: "0",
    saleActive: false,
    currentTier: {
      index: 0,
      startAmount: 0,
      endAmount: 0,
      price: 0
    },
    nextTier: {
      index: 0,
      startAmount: 0,
      endAmount: 0,
      price: 0
    }
  })
  const [isLoadingContractData, setIsLoadingContractData] = useState(false)

  const fetchContractData = useCallback(async () => {
    setIsLoadingContractData(true)
    try {
      const response = await fetch('/api/token-sale')
      if (response.ok) {
        const data = await response.json()
        const totalForSale = data.totalTokensForSale || "0"
        const totalSold = data.totalTokensSold || "0"
        
        // Convert from wei to tokens (divide by 10^18)
        const forSaleTokens = parseFloat(totalForSale) / 1e18
        const soldTokens = parseFloat(totalSold) / 1e18
        
        // Get current tier information
        const currentTier = data.currentTier || {
          index: "0",
          startAmount: "0",
          endAmount: "0",
          price: 0
        }
        
        // Convert tier amounts from wei to tokens
        const tierStartTokens = parseFloat(currentTier.startAmount) / 1e18
        const tierEndTokens = parseFloat(currentTier.endAmount) / 1e18
        
        // Calculate progress percentage
        const percentage = forSaleTokens > 0 ? ((soldTokens / forSaleTokens) * 100).toFixed(2) : "0"
        
        console.log('Contract data:', {
          rawTotalForSale: totalForSale,
          rawTotalSold: totalSold,
          convertedForSale: forSaleTokens,
          convertedSold: soldTokens,
          percentage,
          currentTier: {
            index: currentTier.index,
            startTokens: tierStartTokens,
            endTokens: tierEndTokens,
            price: currentTier.price
          }
        })
        
        setContractData({
          totalTokensForSale: forSaleTokens,
          totalTokensSold: soldTokens,
          progressPercentage: percentage,
          saleActive: data.saleActive || false,
          currentTier: {
            index: parseInt(currentTier.index),
            startAmount: tierStartTokens,
            endAmount: tierEndTokens,
            price: currentTier.price
          },
          nextTier: data.nextTier ? {
            index: parseInt(data.nextTier.index),
            startAmount: parseFloat(data.nextTier.startAmount),
            endAmount: parseFloat(data.nextTier.endAmount),
            price: data.nextTier.price
          } : {
            index: 0,
            startAmount: 0,
            endAmount: 0,
            price: 0
          }
        })
      }
    } catch (error) {
      console.error('Error fetching contract data:', error)
    } finally {
      setIsLoadingContractData(false)
    }
  }, [])

  return {
    contractData,
    isLoadingContractData,
    fetchContractData
  }
}
