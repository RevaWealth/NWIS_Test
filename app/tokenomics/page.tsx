'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../../navbar'

export default function TokenomicsPage() {
  const tokenomics = [
    { label: "Presale", value: "30,000,000,000 NWIS", percentage: 60, color: "from-blue-500 to-cyan-500" },
    { label: "Treasury", value: "10,000,000,000 NWIS", percentage: 20, color: "from-green-500 to-emerald-500" },
    { label: "Team & Advisors", value: "7,500,000,000 NWIS", percentage: 15, color: "from-yellow-500 to-amber-500" },
    { label: "Marketing", value: "2,500,000,000 NWIS", percentage: 5, color: "from-orange-500 to-red-500" }, 
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <Navbar />

      {/* Tokenomics Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
            <span className="text-sky-600">NWIS</span> Tokenomics
          </h2>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-gray-600 px-4">
            Transparent and sustainable token distribution designed for long-term growth and investors benefit.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-start lg:items-center">
          <div className="space-y-4 sm:space-y-6">
            {tokenomics.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 sm:p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r ${item.color} mr-3 sm:mr-4`}></div>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">{item.label}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 text-sm sm:text-base">{item.value}</div>
                  <div className="text-xs sm:text-sm text-slate-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="w-64 h-64 sm:w-80 sm:h-80 mx-auto relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                
                {/* Colored segments */}
                <defs>
                  <linearGradient id="presale-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="liquidity-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="marketing-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                  <linearGradient id="team-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                
                {/* Presale - 60% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#presale-gradient)"
                  strokeWidth="8"
                  strokeDasharray="150.72 251.2"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                
                {/* Liquidity - 15% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#liquidity-gradient)"
                  strokeWidth="8"
                  strokeDasharray="47.68 251.2"
                  strokeDashoffset="-150.72"
                  strokeLinecap="round"
                />
                            
                {/* Team - 15% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#team-gradient)"
                  strokeWidth="8"
                  strokeDasharray="37.68 251.2"
                  strokeDashoffset="-198.52"
                  strokeLinecap="round"
                />

                {/* Marketing - 10% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#marketing-gradient)"
                  strokeWidth="8"
                  strokeDasharray="12.12 251.2"
                  strokeDashoffset="-236.4"
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">50B</div>
                  <div className="text-xs sm:text-sm text-gray-600">Total Supply</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Tokenomics Info */}
        <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Growth Potential</h3>
            <p className="text-sm sm:text-base text-gray-600">Strategic allocation designed for sustainable long-term growth and value appreciation.</p>
          </div>

          <div className="text-center p-4 sm:p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Transparency</h3>
            <p className="text-sm sm:text-base text-gray-600">Clear and verifiable token distribution with community governance and oversight.</p>
          </div>

          <div className="text-center p-4 sm:p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
            <p className="text-sm sm:text-base text-gray-600">Token holders participate in key decisions on Treasury Management.</p>
          </div>
        </div>

        {/* New Sky-950 Section */}
        <div className="mt-8 sm:mt-12 md:mt-16 bg-sky-950 w-full">
          <div className="w-full text-center py-8 sm:py-12 md:py-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 sm:mb-12 px-4">
              <span style={{color: '#a57e24'}}>NWIS</span> Token Distribution - <span className="text-sky-300">Timeline</span>
            </h2>
            
            {/* Image between title and buttons */}
            <div className="flex justify-center mb-8 sm:mb-12 px-4">
              <Image
                src="/images/NWISTDT.png"
                alt="NWIS Token Distribution"
                width={5400}
                height={5400}
                className="w-full h-auto max-w-4xl object-contain"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
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
                className="inline-flex items-center justify-center px-6 sm:px-8 py-2 sm:py-3 border-2 border-sky-300 text-sky-300 hover:bg-sky-300 hover:text-sky-950 font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base"
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
