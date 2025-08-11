'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import CountdownTimer from "../../countdown-timer"
import TokenPurchase from "../../token-purchase"

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
      <div className="bg-sky-950 shadow-sm border-b border-sky-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/images/NWIS.png"
                  alt="NWIS logo"
                  width={80}
                  height={80}
                  className="h-12 w-auto object-contain"
                />
              </Link>
            </div>
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-white">Buy NWIS Tokens</h1>
              <p className="text-[#a57e24]">Start on your path to financial freedom</p>
            </div>
            <div className="flex items-center">
              {/* Placeholder for potential future buttons */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Centered Token Sale Box */}
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-2xl">
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

              <CountdownTimer days={6} hours={2} minutes={28} seconds={14} />

              <p className="text-gray-400 text-center text-sm mt-4 mb-6">Time's Almost Up</p>

              <TokenPurchase
                currentPrice={tokenSaleData.currentPrice}
                amountRaised={tokenSaleData.amountRaised}
                tokenValue={tokenSaleData.tokenValue}
              />
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
              <span className="text-gray-400">•</span>
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
