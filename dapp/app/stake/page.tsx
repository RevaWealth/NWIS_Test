"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/UI/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card"
import { 
  TrendingUp, 
  TrendingDown, 
  Lock, 
  Unlock, 
  Award,
  Shield
} from "lucide-react"
import Navbar from "@/sections/navbar"

export default function StakingDashboard() {
  const [activeTab, setActiveTab] = useState("stake")

  // Mock data - replace with real data from smart contracts
  const stakingData = {
    totalStaked: "Estimating...",
    totalRewards: "Estimating...",
    apy: "Estimating...",
    userStaked: "Estimating...",
    userRewards: "Estimating...",
    userPending: "Estimating..."
  }


  return (
    <div className="min-h-screen bg-black text-white relative">
      <Navbar />
      
      {/* Q2 2026 Watermark Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          {/* Multiple Q2 2026 texts to cover the entire page */}
          <div 
            className="absolute text-[#a57e24] font-bold text-4xl md:text-6xl lg:text-7xl opacity-20"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              top: '10%',
              left: '-15%'
            }}
          >
            Q2 2026
          </div>
          <div 
            className="absolute text-[#a57e24] font-bold text-4xl md:text-6xl lg:text-7xl opacity-20"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              top: '10%',
              left: '15%'
            }}
          >
            Q2 2026
          </div>
          <div 
            className="absolute text-[#a57e24] font-bold text-4xl md:text-6xl lg:text-7xl opacity-20"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              top: '10%',
              left: '45%'
            }}
          >
            Q2 2026
          </div>
          <div 
            className="absolute text-[#a57e24] font-bold text-4xl md:text-6xl lg:text-7xl opacity-20"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              top: '35%',
              left: '-15%'
            }}
          >
            Q2 2026
          </div>
          <div 
            className="absolute text-[#a57e24] font-bold text-4xl md:text-6xl lg:text-7xl opacity-20"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              top: '35%',
              left: '15%'
            }}
          >
            Q2 2026
          </div>
          <div 
            className="absolute text-[#a57e24] font-bold text-4xl md:text-6xl lg:text-7xl opacity-20"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              top: '35%',
              left: '45%'
            }}
          >
            Q2 2026
          </div>
          <div 
            className="absolute text-[#a57e24] font-bold text-4xl md:text-6xl lg:text-7xl opacity-20"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              top: '60%',
              left: '-15%'
            }}
          >
            Q2 2026
          </div>
          <div 
            className="absolute text-[#a57e24] font-bold text-4xl md:text-6xl lg:text-7xl opacity-20"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              top: '60%',
              left: '15%'
            }}
          >
            Q2 2026
          </div>
          <div 
            className="absolute text-[#a57e24] font-bold text-4xl md:text-6xl lg:text-7xl opacity-20"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              top: '60%',
              left: '45%'
            }}
          >
            Q2 2026
          </div>
          <div 
            className="absolute text-[#a57e24] font-bold text-4xl md:text-6xl lg:text-7xl opacity-20"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              top: '85%',
              left: '-15%'
            }}
          >
            Q2 2026
          </div>
          <div 
            className="absolute text-[#a57e24] font-bold text-4xl md:text-6xl lg:text-7xl opacity-20"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              top: '85%',
              left: '15%'
            }}
          >
            Q2 2026
          </div>
          <div 
            className="absolute text-[#a57e24] font-bold text-4xl md:text-6xl lg:text-7xl opacity-20"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              top: '85%',
              left: '45%'
            }}
          >
            Q2 2026
          </div>
          <div 
            className="absolute text-[#a57e24] font-bold text-4xl md:text-6xl lg:text-7xl opacity-20"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              top: '10%',
              left: '75%'
            }}
          >
            Q2 2026
          </div>
          <div 
            className="absolute text-[#a57e24] font-bold text-4xl md:text-6xl lg:text-7xl opacity-20"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              top: '35%',
              left: '75%'
            }}
          >
            Q2 2026
          </div>
          <div 
            className="absolute text-[#a57e24] font-bold text-4xl md:text-6xl lg:text-7xl opacity-20"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              top: '60%',
              left: '75%'
            }}
          >
            Q2 2026
          </div>
          <div 
            className="absolute text-[#a57e24] font-bold text-4xl md:text-6xl lg:text-7xl opacity-20"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'top left',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              top: '85%',
              left: '75%'
            }}
          >
            Q2 2026
          </div>
        </div>
      </div>
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              NWIS Staking Dashboard
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Stake your NWIS tokens to earn rewards and participate in NexusWealth's DAO ecosystem
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Staked</p>
                    <p className="text-2xl font-bold">{stakingData.totalStaked}</p>
                  </div>
                  <div className="relative">
                    <Shield className="h-8 w-8 text-purple-500" />
                    <Lock className="h-3 w-3 text-purple-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Rewards</p>
                    <p className="text-2xl font-bold">{stakingData.totalRewards}</p>
                  </div>
                  <Award className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Average APY</p>
                    <p className="text-2xl font-bold">{stakingData.apy}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

          </div>

          {/* User Staking Info */}
          <Card className="bg-gray-900 border-gray-800 mb-12">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Your Staking Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Staked Amount</p>
                  <p className="text-3xl font-bold text-[#a57e24]">{stakingData.userStaked}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Claimed Rewards</p>
                  <p className="text-3xl font-bold text-purple-500">{stakingData.userRewards}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Pending Rewards</p>
                  <p className="text-3xl font-bold text-yellow-500">{stakingData.userPending}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-4 justify-center">
                <Button className="bg-[#a57e24] hover:bg-[#8a671d] text-white">
                  <Lock className="h-4 w-4 mr-2" />
                  Stake More
                </Button>
                <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  <Unlock className="h-4 w-4 mr-2" />
                  Unstake
                </Button>
                <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  <Award className="h-4 w-4 mr-2" />
                  Claim Rewards
                </Button>
              </div>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  )
}
