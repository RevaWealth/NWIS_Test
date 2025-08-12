"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
// removed unused Clock import
import AnnouncementBar from "../announcement-bar"
import Navbar from "../navbar"
import CountdownTimer from "../countdown-timer"
import TokenPurchase from "../token-purchase"
import AboutSection from "../about-section"
import FeaturesSection from "../features-section"
import TokenomicsSection from "../tokenomics-section"
import RoadmapSection from "../roadmap-section"
import TeamSection from "../team-section"
import PartnersSection from "../partners-section"
import FAQSection from "../faq-section"
import Footer from "../footer"
import { PageLoader } from "../component/page-loader"

interface TokenSaleData {
  currentPrice: string
  amountRaised: string
  tokenValue: string
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [tokenSaleData, setTokenSaleData] = useState<TokenSaleData | null>(null)

  useEffect(() => {
    // Suppress Safe Apps SDK errors
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes("safe-apps-sdk") || event.error?.message?.includes("version.split")) {
        console.warn("Suppressed Safe Apps SDK error:", event.error.message)
        event.preventDefault()
        return false
      }
    }
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes("safe-apps-sdk") || event.reason?.message?.includes("version.split")) {
        console.warn("Suppressed Safe Apps SDK promise rejection:", event.reason.message)
        event.preventDefault()
        return false
      }
    }
    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

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
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  if (isLoading || !tokenSaleData) {
    return <PageLoader />
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#070b14]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 relative overflow-hidden bg-white text-center">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/shutterstock_2506349295.jpg"
              alt="Family flying a kite on the beach with ocean waves in the background"
              fill
              priority
              className="object-cover object-[70%_center] sm:object-center pointer-events-none select-none"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/40 via-white/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl text-center">
              <h1 className="font-bold mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-sky-900 leading-tight">
                NexusWealth Investment Solutions
              </h1>
              <h2 className="font-bold mb-4 sm:mb-6 py-2 sm:py-3 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-[rgba(165,126,36,1)] leading-tight">
                Empowering Individuals to Build Generational Wealth through Blockchain Tokenization
              </h2>
              <p className="max-w-2xl mx-auto text-sky-800 text-sm sm:text-base px-2">
                Revolutionizing real-world investment through Tokenized innovation.
              </p>
            </div>

            <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-[minmax(0,520px)_1fr] md:gap-10 items-start">
              {/* Left column: Token Sale Box (responsive positioning) */}
              <div className="w-full max-w-lg mx-auto md:mx-0 md:-ml-8 lg:-ml-16 xl:-ml-20 2xl:-ml-32 bg-[#0c1220] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
                <div className="relative">
                  <div className="bg-sky-900 p-3 sm:p-4 text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-bold text-sm sm:text-base">{"Series A"} </span>
                    </div>
                    <span className="text-xs sm:text-sm"> {"Seed Funding"} </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6 bg-sky-950">
                  <p className="text-gray-400 text-xs sm:text-sm text-center mb-3 sm:mb-4">Can't find tokens in your wallet?</p>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6 leading-tight">
                    <span className="text-white">First Stage - Buy </span>
                    <span className="text-[rgba(165,126,36,1)]">NWIS</span>
                    <span className="text-white"> Now</span>
                  </h3>

                  <CountdownTimer days={6} hours={2} minutes={28} seconds={14} />

                  <p className="text-gray-400 text-center text-xs sm:text-sm mt-3 sm:mt-4 mb-4 sm:mb-6">Time's Almost Up</p>

                  <TokenPurchase
                    currentPrice={tokenSaleData.currentPrice}
                    amountRaised={tokenSaleData.amountRaised}
                    tokenValue={tokenSaleData.tokenValue}
                  />
                </div>
              </div>

              {/* Right column left empty to keep family unobstructed */}
              <div className="hidden md:block" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* Additional Sections */}
        <AboutSection />
        <FeaturesSection />
        <RoadmapSection />
        <TokenomicsSection />
        <TeamSection />
        <PartnersSection />
        <FAQSection />
        <Footer />
      </main>
    </div>
  )
}
