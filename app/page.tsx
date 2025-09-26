"use client"

import { useEffect } from "react"
import type { Metadata } from "next"
import Image from "next/image"
// removed unused Clock import
import AnnouncementBar from "../sections/announcement-bar"
import Navbar from "../sections/navbar"
import AboutSection from "../sections/about-section"
import FeaturesSection from "../sections/features-section"
import TokenomicsSection from "../sections/tokenomics-section"
import RoadmapSection from "../sections/roadmap-section"
import TeamSection from "../sections/team-section"
import PartnersSection from "../sections/partners-section"
import FAQSection from "../sections/faq-section"
import ContactSection from "../sections/contact-section"
import Footer from "../sections/footer"
import CountdownTimer from "../sections/countdown-timer"
import MobileVideo from "../component/mobile-video"
import Typewriter from "../component/typewriter"
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
              fallbackImage="/images/Feri.svg"
              fallbackAlt="Background video for hero section"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900/60 via-slate-800/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full w-full">
            {/* Main Hero Text with Typewriter Effect - Fixed Top Position */}
            <div className="absolute top-12 sm:top-16 md:top-32 left-1/2 transform -translate-x-1/2 w-full max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8 text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-8xl xl:text-6xl font-bold text-[#a57e24] leading-tight">
                <Typewriter 
                  text="On a mission to disrupt the $130 trillion asset management industry!" 
                  speed={80}
                  delay={2000}
                  className="text-center"
                />
              </h1>
            </div>

            {/* ICO Counter and Button - Fixed Bottom Position */}
            <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-2 sm:px-4 md:px-6 lg:px-8">
              {/* ICO Launch Countdown Timer */}
              <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#a57e24] mb-2 sm:mb-3 md:mb-4 text-center">
                    NWIS DAO Token Presale
                  </h3>
                  <CountdownTimer />
                </div>
              </div>
              
              {/* Buy NWIS Token Button */}
              <div className="flex justify-center">
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
        {/* <PartnersSection /> */}
        <FAQSection />
        <ContactSection />
        <Footer />
        
        {/* Legal Disclaimer Section */}
        <section className="bg-gray-900 border-t border-gray-800 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-xs text-gray-400 leading-relaxed space-y-4">
              <p className="font-semibold text-gray-300 mb-4">
                © 2025 NexusWealth, LLC. All rights reserved.
              </p>
              
              <p>
                This material is provided for informational purposes only and is not intended to be relied upon as a forecast, research or investment advice, and is not a recommendation, offer or solicitation to buy or sell any securities or to adopt any investment strategy. The opinions expressed are subject to change. References to specific securities, asset classes and financial markets are for illustrative purposes only and are not intended to be and should not be interpreted as recommendations. Reliance upon information in this material is at the sole risk and discretion of the reader. The material was prepared without regard to specific objectives, financial situation or needs of any investor.
              </p>
              
              <p>
                This material may contain "forward-looking" information that is not purely historical in nature. Such information may include, among other things, projections, forecasts, and estimates of yields or returns. No representation is made that any performance presented will be achieved by NexusWealth Investment Solutions, or that every assumption made in achieving, calculating or presenting either the forward-looking information or any historical performance information herein has been considered or stated in preparing this material. Any changes to assumptions that may have been made in preparing this material could have a material impact on the investment returns that are presented herein. Past performance is not a reliable indicator of current or future results and should not be the sole factor of consideration when selecting a product or strategy.
              </p>
              
              <p>
                The information and opinions contained in this material are derived from proprietary and nonproprietary sources deemed by NexusWealth Investment Solutions to be reliable, are not necessarily all-inclusive and are not guaranteed as to accuracy.
              </p>
              
              <p>
                In the U.S., this material is for Institutional use only – not for public distribution.
              </p>
              
              <p>
                The information provided here is neither tax nor legal advice. Investors should speak to their tax professional for specific information regarding their tax situation. Investment involves risk including possible loss of principal. International investing involves risks, including risks related to foreign currency, limited liquidity, less government regulation, and the possibility of substantial volatility due to adverse political, economic or other developments. These risks are often heightened for investments in emerging/developing markets or smaller capital markets.
              </p>
              
              <p className="font-semibold text-gray-300">
                FOR INSTITUTIONAL, FINANCIAL PROFESSIONAL, PERMITTED CLIENT AND WHOLESALE INVESTOR USE ONLY. THIS MATERIAL IS NOT TO BE REPRODUCED OR DISTRIBUTED TO PERSONS OTHER THAN THE RECIPIENT.
              </p>
              
              <p>
                NexusWealth® is a registered trademark of NevusWealth, LLC., or its subsidiaries in the United States and elsewhere. All other trademarks are those of their respective owners.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
