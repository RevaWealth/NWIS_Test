"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Clock } from "lucide-react"
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

    // Fetch data
    const fetchData = async () => {
      try {
        const response = await fetch("/api/token-sale")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: TokenSaleData = await response.json()
        setTokenSaleData(data)
      } catch (error) {
        console.error("Failed to fetch token sale data:", error)
        // Fallback to default values if fetch fails
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

      <main className="flex-1 relative overflow-hidden border-white bg-white text-center">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-purple-900/10 to-transparent pointer-events-none"></div>

        {/* Wireframe graphics */}
        <div className="absolute bottom-0 left-0 w-1/3 h-[300px] opacity-50">
          <Image
            src="/placeholder.svg?height=300&width=400"
            alt="Wireframe graphic"
            width={400}
            height={300}
            className="object-contain"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
        <div className="absolute bottom-0 right-0 w-1/3 h-[300px] opacity-50">
          <Image
            src="/placeholder.svg?height=300&width=400"
            alt="Wireframe graphic"
            width={400}
            height={300}
            className="object-contain"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>

        {/* Hero Section */}
        <div className="w-full text-center relative z-10 bg-white px-0 mx-0">
          <h1 className="font-bold mb-4 text-4xl sm:text-5xl md:text-7xl text-sky-900">
            NexusWealth Investment Solutions{" "}
          </h1>
          <h2 className="font-bold mb-6 py-5 text-2xl sm:text-3xl md:text-4xl text-orange-500">
            <span className="text-orange-500">Empowering Individuals </span>
            <span className="text-orange-500">{"to Build Generational Wealth"}</span>
            <span className="text-orange-500"> through </span>
            <br className="md:hidden" />
            <span className="text-orange-500">Blockchain</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-16">
            Revolutionizing real-world investment through decentralized innovation.
          </p>

          {/* Token Sale Box */}
          <div className="max-w-lg mx-auto bg-[#0c1220] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
            <div className="relative">
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-4 text-white flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-purple-900/50 rounded-lg p-2 mr-3">
                    <Clock className="h-5 w-5" />
                  </div>
                  <span className="font-bold">{"Series A"} </span>
                </div>
                <span className="text-sm"> {"Seed Funding"} </span>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-400 text-sm text-center mb-4">{"Can't find tokens in your wallet?"}</p>

              <h3 className="text-2xl font-bold text-center mb-6">
                <span className="text-indigo-400"> First Stage - Buy </span>
                <span className="text-pink-500">NWIS</span>
                <span className="text-white"> Now</span>
              </h3>

              <CountdownTimer days={6} hours={2} minutes={28} seconds={14} />

              <p className="text-gray-400 text-center text-sm mt-4 mb-6">{"Time's Almost Up"}</p>

              <TokenPurchase
                currentPrice={tokenSaleData.currentPrice}
                amountRaised={tokenSaleData.amountRaised}
                tokenValue={tokenSaleData.tokenValue}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Additional Sections */}
      <AboutSection />
      <FeaturesSection />
      <RoadmapSection />
      <TokenomicsSection />
      <TeamSection />
      <PartnersSection />
      <FAQSection />
      <Footer />
    </div>
  )
}
