'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../../sections/navbar'

export default function TokenomicsPage() {
  const tokenomics = [
    { label: "Presale", value: "30,000,000,000 NWIS", percentage: 60, color: "from-blue-500 to-cyan-500" },
    { label: "Treasury", value: "10,000,000,000 NWIS", percentage: 20, color: "from-green-500 to-emerald-500" },
    { label: "Team & Advisors", value: "7,500,000,000 NWIS", percentage: 15, color: "from-yellow-500 to-amber-500" },
    { label: "Marketing", value: "2,500,000,000 NWIS", percentage: 5, color: "from-orange-500 to-red-500" }, 
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <style jsx>{`
      `}</style>
      {/* Navbar */}
      <Navbar />

      {/* Tokenomics Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">
            <span className="text-[#a57e24]">NWIS</span> Tokenomics
          </h2>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-gray-300 px-4">
            Transparent and sustainable token distribution designed for long-term growth and investors benefit.
          </p>
        </div>

        {/* Pie Chart and Video Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          {/* Video Section */}
          <div className="relative">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="rounded-xl shadow-lg w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover"
            >
              <source src="/images/ST3.mp4" type="video/mp4" />
              {/* Fallback message if video fails to load */}
              <div className="w-full h-64 bg-slate-800 rounded-xl flex items-center justify-center">
                <p className="text-gray-400">Video not supported</p>
              </div>
            </video>
          </div>

          {/* Pie Chart Section */}
          <div className="relative">
            <div className="w-80 h-80 sm:w-96 sm:h-96 mx-auto relative">
              <svg className="w-full h-full transform -rotate-90 pie-chart-animated" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="presale-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="treasury-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="team-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                  <linearGradient id="marketing-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                  
                  
                </defs>
                
                {/* Presale segment: 0° to 216° (60%) - Blue */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#presale-gradient)"
                  strokeWidth="8"
                  strokeDasharray="150.8 251.2"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                
                {/* Treasury segment: 216° to 288° (20%) - Green */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#treasury-gradient)"
                  strokeWidth="8"
                  strokeDasharray="50.3 251.2"
                  strokeDashoffset="150.8"
                  strokeLinecap="round"
                />
                
                {/* Team segment: 288° to 342° (15%) - Yellow */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#team-gradient)"
                  strokeWidth="8"
                  strokeDasharray="37.7 251.2"
                  strokeDashoffset="85.96"
                  strokeLinecap="round"
                />
                
                {/* Marketing segment: 342° to 360° (5%) - Orange/Red */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#marketing-gradient)"
                  strokeWidth="8"
                  strokeDasharray="11.6 251.2"
                  strokeDashoffset="287.82"
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-white">50B</div>
                  <div className="text-xs sm:text-sm text-gray-300">Total Supply</div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Token Distribution Details and Timeline Section */}
        <div className="mt-8 sm:mt-12 md:mt-16 bg-[#000000] w-full">
          <div className="w-full py-8 sm:py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 px-4">
              
              {/* Token Distribution Boxes */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">
                  Token Distribution
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  {tokenomics.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-1 bg-slate-800 rounded-lg border border-slate-700 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center">
                        <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r ${item.color} mr-3 sm:mr-4`}></div>
                        <span className="font-medium text-white text-sm sm:text-base">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white text-sm sm:text-base">{item.value}</div>
                        <div className="text-xs sm:text-sm text-slate-400">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Section */}
              <div className="text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">
                  <span style={{color: '#a57e24'}}>NWIS</span> Token Distribution - <span className="text-sky-300">Timeline</span>
                </h3>
                
                {/* Image */}
                <div className="flex justify-center">
                  <Image
                    src="/images/NWISTDT.png"
                    alt="NWIS Token Distribution"
                    width={5400}
                    height={5400}
                    className="w-full h-auto max-w-2xl object-contain"
                  />
                </div>
              </div>
            </div>
            
            {/* Bottom Buttons Section */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-12 md:mt-16">
              <Link 
                href="/token-purchase" 
                className="inline-flex items-center justify-center px-6 sm:px-8 py-2 sm:py-3 text-white font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base"
                style={{ backgroundColor: '#a57e24' }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#8a6919'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#a57e24'}
              >
                Buy NWIS Tokens
              </Link>
              <Link 
                href="/documents" 
                className="inline-flex items-center justify-center px-6 sm:px-8 py-2 sm:py-3 border-2 border-sky-300 text-sky-300 hover:bg-sky-300 hover:text-[#000000] font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
