'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function TokenomicsPage() {
  const tokenomics = [
    { label: "Total Supply", value: "50,000,000,000 NWIS", percentage: 100, color: "from-purple-600 to-pink-600" },
    { label: "Presale", value: "30,000,000,000 NWIS", percentage: 60, color: "from-blue-500 to-cyan-500" },
    { label: "Liquidity", value: "7,500,000,000 NWIS", percentage: 15, color: "from-green-500 to-emerald-500" },
    { label: "Marketing", value: "5,000,000,000 NWIS", percentage: 10, color: "from-orange-500 to-red-500" },
    { label: "Team", value: "7,500,000,000 NWIS", percentage: 15, color: "from-yellow-500 to-amber-500" },
  ]

  // Calculate cumulative percentages for the pie chart
  const segments = tokenomics.slice(1).map((item, index) => {
    const previousTotal = tokenomics.slice(1, index + 1).reduce((sum, prev) => sum + prev.percentage, 0)
    const startOffset =
      index === 0
        ? 0
        : tokenomics.slice(1, index + 1).reduce((sum, prev, i) => sum + tokenomics.slice(1)[i].percentage, 0) -
          item.percentage
    return {
      ...item,
      startOffset: (startOffset / 100) * 251.2, // 251.2 is circumference of circle with radius 40
      dashArray: `${(item.percentage / 100) * 251.2} 251.2`,
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-sky-950 shadow-sm border-b border-sky-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <h1 className="text-2xl font-bold text-white">NWIS Tokenomics</h1>
              <p className="text-sky-200">Transparent and sustainable token distribution</p>
            </div>
            <div className="flex items-center">
              {/* Placeholder for potential future buttons */}
            </div>
          </div>
        </div>
      </div>

      {/* Tokenomics Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            <span className="text-sky-600">NWIS</span> Tokenomics
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            Transparent and sustainable token distribution designed for long-term growth and investors benefit.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {tokenomics.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.color} mr-4`}></div>
                  <span className="font-medium text-gray-900">{item.label}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{item.value}</div>
                  <div className="text-sm text-slate-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="w-80 h-80 mx-auto relative">
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
                  strokeDasharray="37.68 251.2"
                  strokeDashoffset="-150.72"
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
                  strokeDasharray="25.12 251.2"
                  strokeDashoffset="-188.4"
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
                  strokeDashoffset="-213.52"
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50B</div>
                  <div className="text-sm text-gray-600">Total Supply</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Tokenomics Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Growth Potential</h3>
            <p className="text-gray-600">Strategic allocation designed for sustainable long-term growth and value appreciation.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparency</h3>
            <p className="text-gray-600">Clear and verifiable token distribution with community governance and oversight.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
            <p className="text-gray-600">Token holders participate in key decisions and benefit from platform success.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
