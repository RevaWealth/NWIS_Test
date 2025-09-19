'use client'

import { useEffect, useState } from "react"

// Force dynamic rendering to prevent SSR issues with wallet connections
export const dynamic = 'force-dynamic'
import Image from "next/image"
import Link from "next/link"
import CountdownTimer from "../../countdown-timer"
import TokenPurchaseNew from "../../token-purchase-new"
import Navbar from "../../navbar"

interface TokenSaleData {
  currentPrice: string
  amountRaised: string
  tokenValue: string
}

export default function TokenPurchasePage() {
  const [tokenSaleData, setTokenSaleData] = useState<TokenSaleData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/token-sale")
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data: TokenSaleData = await response.json()
        setTokenSaleData(data)
      } catch (error) {
        console.error("Failed to fetch token sale data:", error)
        setTokenSaleData({
          currentPrice: "$0.007125",
          amountRaised: "$345,000",
          tokenValue: "1 NWIS = $0.007125",
        })
      }
    }
    fetchData()
  }, [])

  if (!tokenSaleData) {
    return (
      <div 
        className="min-h-screen bg-white !bg-white flex items-center justify-center" 
        style={{backgroundColor: 'white'}}
      >
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-sky-950 to-sky-900 py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Buy NWIS Tokens</h1>
          <p className="text-xl text-[#a57e24] font-medium">Start on your path to financial freedom</p>
        </div>
      </div>

      {/* Main Content - Centered Token Sale Box */}
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-lg">
          {/* Token Sale Box */}
          <div className="bg-[#0c1220] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="relative">
              <div className="bg-sky-900 p-4 text-white flex items-center justify-between">
                <div className="flex items-center">
                  <span className="font-bold">{"Series A"} </span>
                </div>
                <span className="text-sm"> {"Seed Funding"} </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-sky-950">
              <p className="text-gray-400 text-sm text-center mb-4">Can't find tokens in your wallet?</p>

              <h3 className="text-2xl font-bold text-center mb-6">
                <span className="text-white">First Stage - Buy </span>
                <span className="text-[rgba(165,126,36,1)]">NWIS</span>
                <span className="text-white"> Now</span>
              </h3>

              <CountdownTimer />

              <p className="text-gray-400 text-center text-sm mt-4 mb-6">ICO Starts October 1st, 2025</p>

              <TokenPurchaseNew />
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Ready to start building your generational wealth?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/about/story"
                className="text-sky-600 hover:text-sky-700 font-medium transition-colors"
              >
                Learn More About NexusWealth
              </Link>
              <span className="text-xs text-gray-400">•</span>
              <Link
                href="/tokenomics"
                className="text-sky-600 hover:text-sky-700 font-medium transition-colors"
              >
                View Tokenomics
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

