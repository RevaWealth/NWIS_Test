"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/UI/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card"
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Wallet,
  BarChart3,
  Percent,
  Activity,
  Target
} from "lucide-react"
import Navbar from "@/sections/navbar"

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Mock data - replace with real data from smart contracts
  const financeData = {
    totalValueLocked: "Estimating...",
    totalRevenue: "Estimating...",
    activeInvestments: "Estimating...",
    roi: "Estimating...",
    portfolios: [
      {
        id: 1,
        name: "Real Estate Fund",
        value: "$0",
        change: "+0%",
        icon: "🏢"
      },
      {
        id: 2,
        name: "Agriculture Fund",
        value: "$0",
        change: "+0%",
        icon: "🌾"
      },
      {
        id: 3,
        name: "Infrastructure Fund",
        value: "$0",
        change: "+0%",
        icon: "🏗️"
      },
      {
        id: 4,
        name: "Renewable Energy Fund",
        value: "$0",
        change: "+0%",
        icon: "⚡"
      },
      {
        id: 5,
        name: "NexusWealth Indexed Fund",
        value: "$0",
        change: "+0%",
        icon: "📈"
      },
      {
        id: 6,
        name: "NexusWealth Specialty Fund",
        value: "$0",
        change: "+0%",
        icon: "🏦"
      },
      {
        id: 7,
        name: "NexusWealth Hedge Fund",
        value: "$0",
        change: "+0%",
        icon: "💰"
      },
      {
        id: 8,
        name: "NexusWealth Private Equity Fund",
        value: "$0",
        change: "+0%",
        icon: "💰"
      }
    ]
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <Navbar />
      
      {/* Q4 2026 Watermark Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          {/* Multiple Q4 2026 texts to cover the entire page */}
          <div 
            className="absolute font-bold text-4xl md:text-6xl lg:text-7xl"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              color: '#c9a061',
              opacity: 0.25,
              top: '10%',
              left: '-15%'
            }}
          >
            Q4 2026
          </div>
          <div 
            className="absolute font-bold text-4xl md:text-6xl lg:text-7xl"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              color: '#c9a061',
              opacity: 0.25,
              top: '10%',
              left: '15%'
            }}
          >
            Q4 2026
          </div>
          <div 
            className="absolute font-bold text-4xl md:text-6xl lg:text-7xl"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              color: '#c9a061',
              opacity: 0.25,
              top: '10%',
              left: '45%'
            }}
          >
            Q4 2026
          </div>
          <div 
            className="absolute font-bold text-4xl md:text-6xl lg:text-7xl"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              color: '#c9a061',
              opacity: 0.25,
              top: '35%',
              left: '-15%'
            }}
          >
            Q4 2026
          </div>
          <div 
            className="absolute font-bold text-4xl md:text-6xl lg:text-7xl"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              color: '#c9a061',
              opacity: 0.25,
              top: '35%',
              left: '15%'
            }}
          >
            Q4 2026
          </div>
          <div 
            className="absolute font-bold text-4xl md:text-6xl lg:text-7xl"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              color: '#c9a061',
              opacity: 0.25,
              top: '35%',
              left: '45%'
            }}
          >
            Q4 2026
          </div>
          <div 
            className="absolute font-bold text-4xl md:text-6xl lg:text-7xl"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              color: '#c9a061',
              opacity: 0.25,
              top: '60%',
              left: '-15%'
            }}
          >
            Q4 2026
          </div>
          <div 
            className="absolute font-bold text-4xl md:text-6xl lg:text-7xl"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              color: '#c9a061',
              opacity: 0.25,
              top: '60%',
              left: '15%'
            }}
          >
            Q4 2026
          </div>
          <div 
            className="absolute font-bold text-4xl md:text-6xl lg:text-7xl"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              color: '#c9a061',
              opacity: 0.25,
              top: '60%',
              left: '45%'
            }}
          >
            Q4 2026
          </div>
          <div 
            className="absolute font-bold text-4xl md:text-6xl lg:text-7xl"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              color: '#c9a061',
              opacity: 0.25,
              top: '85%',
              left: '-15%'
            }}
          >
            Q4 2026
          </div>
          <div 
            className="absolute font-bold text-4xl md:text-6xl lg:text-7xl"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              color: '#c9a061',
              opacity: 0.25,
              top: '85%',
              left: '15%'
            }}
          >
            Q4 2026
          </div>
          <div 
            className="absolute font-bold text-4xl md:text-6xl lg:text-7xl"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              color: '#c9a061',
              opacity: 0.25,
              top: '85%',
              left: '45%'
            }}
          >
            Q4 2026
          </div>
          <div 
            className="absolute font-bold text-4xl md:text-6xl lg:text-7xl"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              color: '#c9a061',
              opacity: 0.25,
              top: '10%',
              left: '75%'
            }}
          >
            Q4 2026
          </div>
          <div 
            className="absolute font-bold text-4xl md:text-6xl lg:text-7xl"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              color: '#c9a061',
              opacity: 0.25,
              top: '35%',
              left: '75%'
            }}
          >
            Q4 2026
          </div>
          <div 
            className="absolute font-bold text-4xl md:text-6xl lg:text-7xl"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              color: '#c9a061',
              opacity: 0.25,
              top: '60%',
              left: '75%'
            }}
          >
            Q4 2026
          </div>
          <div 
            className="absolute font-bold text-4xl md:text-6xl lg:text-7xl"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              color: '#c9a061',
              opacity: 0.25,
              top: '85%',
              left: '75%'
            }}
          >
            Q4 2026
          </div>
        </div>
      </div>
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              NWIS Portfolio Dashboard
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Track your investments performance across all NexusWealth portfolios
            </p>
          </div>

          {/* Video Section */}
          <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
            {videoError ? (
              <div className="relative w-full h-[600px] bg-black">
                <Image
                  src="/images/NWISTDT.png"
                  alt="NexusWealth Portfolio"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-auto max-h-[600px] object-cover"
                onError={() => {
                  console.error('Video loading error')
                  setVideoError(true)
                }}
                onLoadStart={() => {
                  console.log('Video load started')
                }}
                onCanPlay={() => {
                  console.log('Video can play')
                }}
              >
                <source src="/images/ST6.mp4" type="video/mp4" />
                <source src="/images/ST6.mov" type="video/quicktime" />
              </video>
            )}
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Value Locked</p>
                    <p className="text-2xl font-bold">{financeData.totalValueLocked}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold">{financeData.totalRevenue}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Active Investments</p>
                    <p className="text-2xl font-bold">{financeData.activeInvestments}</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Average ROI</p>
                    <p className="text-2xl font-bold">{financeData.roi}</p>
                  </div>
                  <Percent className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Investment Portfolios */}
          <Card className="bg-gray-900 border-gray-800 mb-12">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <PieChart className="h-6 w-6 text-[#a57e24]" />
                Investment Portfolios
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {financeData.portfolios.map((portfolio) => {
                  if (!portfolio) return null
                  return (
                    <Card key={portfolio.id} className="bg-gray-800 border-gray-700 hover:border-[#a57e24] transition-colors">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <div className="text-4xl mb-4">{portfolio.icon}</div>
                          <h3 className="text-lg font-semibold mb-2">{portfolio.name}</h3>
                          <p className="text-2xl font-bold text-[#a57e24] mb-1">{portfolio.value}</p>
                          <p className={`text-sm ${portfolio.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                            {portfolio.change}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#a57e24]" />
                  Investment Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed">
                  NexusWealth diversifies investment opportunities across multiple asset classes. Our portfolio approach ensures 
                  risk mitigation while maximizing returns for our investors.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#a57e24]" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed">
                  Track your investment performance with real-time metrics, detailed analytics, and comprehensive 
                  reporting. All data is transparently recorded on the blockchain for full accountability and trust.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <Button 
              className="bg-[#a57e24] hover:bg-[#8a671d] text-white px-8 py-6 text-lg"
              size="lg"
            >
              <Wallet className="h-5 w-5 mr-2" />
              Start Investing
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

