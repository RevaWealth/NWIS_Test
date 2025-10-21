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
  Users, 
  Award
} from "lucide-react"
import Navbar from "@/sections/navbar"

export default function StakingDashboard() {
  const [activeTab, setActiveTab] = useState("stake")

  // Mock data - replace with real data from smart contracts
  const stakingData = {
    totalStaked: "12,456,789",
    totalRewards: "1,234,567",
    apy: 12.5,
    validators: 45,
    userStaked: "50,000",
    userRewards: "5,234",
    userPending: "1,234"
  }


  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              NWIS Staking Dashboard
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Stake your NWIS tokens to earn rewards and participate in network governance
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Staked</p>
                    <p className="text-2xl font-bold">{stakingData.totalStaked} NWIS</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Rewards</p>
                    <p className="text-2xl font-bold">{stakingData.totalRewards} NWIS</p>
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
                    <p className="text-2xl font-bold">{stakingData.apy}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Validators</p>
                    <p className="text-2xl font-bold">{stakingData.validators}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
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
                  <p className="text-3xl font-bold text-[#a57e24]">{stakingData.userStaked} NWIS</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Claimed Rewards</p>
                  <p className="text-3xl font-bold text-green-500">{stakingData.userRewards} NWIS</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Pending Rewards</p>
                  <p className="text-3xl font-bold text-yellow-500">{stakingData.userPending} NWIS</p>
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


          {/* Staking Guide */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-bold">How to Stake NWIS</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#a57e24] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Choose Validator</h3>
                  <p className="text-gray-400 text-sm">
                    Select a validator based on commission, APY, and uptime performance
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#a57e24] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Stake Tokens</h3>
                  <p className="text-gray-400 text-sm">
                    Enter the amount you want to stake and confirm the transaction
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#a57e24] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Earn Rewards</h3>
                  <p className="text-gray-400 text-sm">
                    Start earning rewards automatically and participate in governance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
