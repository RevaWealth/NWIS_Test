import { useState, useEffect } from 'react'

interface EthPriceData {
  price: number
  timestamp: number
  source: string
  error?: string
}

export function useEthPrice() {
  const [ethPrice, setEthPrice] = useState<number>(2500) // Default fallback
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchEthPrice = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/eth-price')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: EthPriceData = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setEthPrice(data.price)
      setLastUpdated(new Date(data.timestamp))
      console.log('✅ ETH price updated:', data.price, 'from', data.source)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch ETH price'
      setError(errorMessage)
      console.error('❌ ETH price fetch error:', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Fetch on mount
    fetchEthPrice()
    
    // Set up interval to refresh every 30 seconds
    const interval = setInterval(fetchEthPrice, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    ethPrice,
    isLoading,
    error,
    lastUpdated,
    refetch: fetchEthPrice
  }
}
