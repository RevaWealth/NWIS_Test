'use client'

import { useEffect, useState } from "react"

import Image from "next/image"
import Link from "next/link"
import CountdownTimer from "../../countdown-timer"
import TokenPurchaseNew from "../../token-purchase-new"
import Navbar from "../../navbar"
import { isMobileDevice, isWalletBrowser } from "../../lib/wallet-browser-utils"

interface TokenSaleData {
  currentPrice: string
  amountRaised: string
  tokenValue: string
}

export default function TokenPurchasePage() {
  const [tokenSaleData, setTokenSaleData] = useState<TokenSaleData | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)

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
          currentPrice: "$0.001",
          amountRaised: "$345,000",
          tokenValue: "1 NWIS = $0.001",
        })
      }
    }
    fetchData()
  }, [])

  // Detect if it's desktop browser (not mobile and not wallet)
  useEffect(() => {
    const checkBrowser = () => {
      const isMobile = isMobileDevice()
      const isWallet = isWalletBrowser()
      setIsDesktop(!isMobile && !isWallet)
    }
    
    checkBrowser()
    window.addEventListener('resize', checkBrowser)
    return () => window.removeEventListener('resize', checkBrowser)
  }, [])

  if (!tokenSaleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 relative">
      {/* ST5.mp4 Video Background - Desktop Only */}
      {isDesktop && (
        <div className="fixed inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/images/ST5.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay to ensure content readability */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10">
        {/* Header */}
        <Navbar />

        {/* Hero Section */}
        <div className="bg-gradient-to-b from-sky-950 to-sky-900 py-8 px-4">
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">NWIS Token Presale</h1>
            <p className="text-xl text-[#a57e24] font-medium">Own stake in the disruptive force that is reshaping the future of asset management</p>
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
            <p className="text-gray-300 mb-4">
              Ready to start building your generational wealth?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/about/story"
                className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
              >
                Learn More About NexusWealth
              </Link>
              <span className="text-xs text-gray-500">•</span>
              <Link
                href="/tokenomics"
                className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
              >
                View Tokenomics
              </Link>
            </div>
          </div>
        </div>
        </main>
      </div>
    </div>
  )
}

