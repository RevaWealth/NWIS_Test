"use client"

import { useEffect } from "react"
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
import MobileVideo from "../component/mobile-video"
import Link from "next/link"

export default function Home() {

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

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-[#070b14]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-center">
        {/* Hero Section */}
        <section className="relative w-full max-w-[100%] mx-auto overflow-hidden h-[300px] md:h-[900px]">
          {/* Background video */}
          <div className="absolute inset-0 z-0">
            <MobileVideo
              src="/images/Far.mp4"
              poster=""
              alt="Background video for hero section"
              className="w-full h-full object-fill pointer-events-none select-none"
              fallbackImage="/images/Feri.jpg"
              fallbackAlt="Background video for hero section"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900/60 via-slate-800/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-end justify-center w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 pb-4 sm:pb-8 md:pb-12">
            <div className="w-full max-w-4xl text-center">
              {/* ICO Launch Countdown Timer */}
              <div className="mt-4 sm:mt-6 md:mt-8 flex justify-center">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#a57e24] mb-2 sm:mb-3 md:mb-4 text-center">
                    NWIS DAO Token Presale
                  </h3>
                  <CountdownTimer />
                </div>
              </div>
              
              {/* Buy NWIS Token Button */}
              <div className="mt-4 sm:mt-6 md:mt-8 flex justify-center">
                <Link
                  href="/token-purchase"
                  className="inline-flex items-center px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-[#a57e24] hover:bg-[#8a671d] text-white font-semibold text-sm sm:text-base md:text-lg rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-auto"
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
