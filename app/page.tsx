"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
// removed unused Clock import
import AnnouncementBar from "../announcement-bar"
import Navbar from "../navbar"
import AboutSection from "../about-section"
import FeaturesSection from "../features-section"
import TokenomicsSection from "../tokenomics-section"
import RoadmapSection from "../roadmap-section"
import TeamSection from "../team-section"
import PartnersSection from "../partners-section"
import FAQSection from "../faq-section"
import ContactSection from "../contact-section"
import Footer from "../footer"
import CountdownTimer from "../countdown-timer"
import { PageLoader } from "../component/page-loader"
import MobileVideo from "../component/mobile-video"
import Link from "next/link"

interface TokenSaleData {
  currentPrice: string
  amountRaised: string
  tokenValue: string
  progressPercentage: string
  totalTokensForSale: string
  totalTokensSold: string
  minPurchase: string
  maxPurchase: string
  saleActive: boolean
  saleStartTime: string
  saleEndTime: string
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
          progressPercentage: "75",
          totalTokensForSale: "1000000",
          totalTokensSold: "750000",
          minPurchase: "100",
          maxPurchase: "10000",
          saleActive: true,
          saleStartTime: "2024-01-01T00:00:00Z",
          saleEndTime: "2024-12-31T23:59:59Z"
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

      <main className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-center">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
          {/* Background video */}
          <div className="absolute inset-0 z-0">
            <MobileVideo
              src="/images/SS6.mp4"
              poster=""
              alt="Background video for hero section"
              className="w-full h-full object-cover object-center sm:object-[center_top] pointer-events-none select-none"
              fallbackImage="/images/NWIS.png"
              fallbackAlt="Background video for hero section"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900/60 via-slate-800/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl text-center">
              <h1 className="font-bold mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-white leading-tight">
                NexusWealth Investment Solutions
              </h1>
              <h2 className="font-bold mb-4 sm:mb-6 py-2 sm:py-3 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-[#a57e24] leading-tight">
                Empowering Individuals to Build Generational Wealth through Blockchain Tokenization
              </h2>
              <p className="max-w-2xl mx-auto text-gray-300 text-sm sm:text-base px-2">
                Revolutionizing real-world investment through Tokenized innovation.
              </p>
              
              {/* ICO Launch Countdown Timer */}
              <div className="mt-8 sm:mt-10 flex justify-center">
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#a57e24] mb-4 sm:mb-6 text-center">
                    ICO Launch
                  </h3>
                  <CountdownTimer />
                </div>
              </div>
              
              {/* Buy NWIS Token Button */}
              <div className="mt-8 sm:mt-10 flex justify-center">
                <Link
                  href="/token-purchase"
                  className="inline-flex items-center px-8 py-4 bg-[#a57e24] hover:bg-[#8a671d] text-white font-semibold text-lg rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Buy NWIS Token
                </Link>
              </div>
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
        <ContactSection />
        <Footer />
      </main>
    </div>
  )
}
