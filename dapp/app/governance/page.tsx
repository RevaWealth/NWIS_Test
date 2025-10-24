"use client"

import { useState } from "react"
import { Button } from "@/components/UI/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card"
import { 
  Vote, 
  Users, 
  Clock, 
  CheckCircle,
  XCircle,
  TrendingUp,
  FileText,
  Calendar,
  BarChart3,
  Activity,
  Target,
  Hand
} from "lucide-react"
import Navbar from "@/sections/navbar"

export default function GovernanceDashboard() {
  const [activeTab, setActiveTab] = useState("proposals")

  // Mock data - replace with real data from smart contracts
  const governanceData = {
    totalProposals: "Estimating...",
    activeProposals: "Estimating...",
    totalVoters: "Estimating...",
    participationRate: "Estimating...",
    proposals: [
      {
        id: 1,
        title: "Proposal #1: Protocol Upgrade",
        description: "Upgrade the NWIS protocol to version 2.0 with enhanced security features",
        status: "Active",
        votesFor: "Estimating...",
        votesAgainst: "Estimating...",
        endTime: "Estimating...",
        type: "Protocol Upgrade"
      },
      {
        id: 2,
        title: "Proposal #2: Treasury Allocation",
        description: "Allocate 20% of treasury funds for ecosystem development",
        status: "Passed",
        votesFor: "Estimating...",
        votesAgainst: "Estimating...",
        endTime: "Estimating...",
        type: "Treasury"
      },
      {
        id: 3,
        title: "Proposal #3: Validator Requirements",
        description: "Update minimum staking requirements for validators",
        status: "Rejected",
        votesFor: "Estimating...",
        votesAgainst: "Estimating...",
        endTime: "Estimating...",
        type: "Governance"
      }
    ]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Passed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-yellow-500"
      case "Passed":
        return "text-blue-500"
      case "Rejected":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <Navbar />
      
      {/* Q1 2026 Watermark Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          {/* Multiple Q1 2026 texts to cover the entire page */}
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
                Q1 2026
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
                Q1 2026
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
            Q1 2026
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
            Q1 2026
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
            Q1 2026
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
            Q1 2026
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
            Q1 2026
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
            Q1 2026
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
            Q1 2026
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
            Q1 2026
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
            Q1 2026
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
            Q1 2026
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
            Q1 2026
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
            Q1 2026
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
            Q1 2026
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
            Q1 2026
          </div>
        </div>
      </div>
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              NWIS Governance Dashboard
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Participate in NWIS protocol governance and vote on important proposals
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Proposals</p>
                    <p className="text-2xl font-bold">{governanceData.totalProposals}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Proposals</p>
                    <p className="text-2xl font-bold">{governanceData.activeProposals}</p>
                  </div>
                  <Vote className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Voters</p>
                    <p className="text-2xl font-bold">{governanceData.totalVoters}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Participation Rate</p>
                    <p className="text-2xl font-bold">{governanceData.participationRate}</p>
                  </div>
                  <Hand className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Proposals Section */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Proposals</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {governanceData.proposals.map((proposal) => (
                  <div key={proposal.id} className="border border-gray-700 rounded-lg p-6 hover:bg-gray-800 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{proposal.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{proposal.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500">Type: {proposal.type}</span>
                          <span className="text-gray-500">Ends: {proposal.endTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(proposal.status)}
                        <span className={`font-medium ${getStatusColor(proposal.status)}`}>
                          {proposal.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-blue-400 text-sm">Votes For</span>
                          <CheckCircle className="h-4 w-4 text-blue-400" />
                        </div>
                        <p className="text-xl font-bold text-blue-400">{proposal.votesFor}</p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-red-400 text-sm">Votes Against</span>
                          <XCircle className="h-4 w-4 text-red-400" />
                        </div>
                        <p className="text-xl font-bold text-red-400">{proposal.votesAgainst}</p>
                      </div>
                    </div>

                    {proposal.status === "Active" && (
                      <div className="flex gap-3">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Vote For
                        </Button>
                        <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                          <XCircle className="h-4 w-4 mr-2" />
                          Vote Against
                        </Button>
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Create Proposal Section */}
          <Card className="bg-gray-900 border-gray-800 mt-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Create New Proposal</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Proposal Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a57e24]"
                    placeholder="Enter proposal title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Proposal Type
                  </label>
                  <select className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#a57e24]">
                    <option value="">Select type</option>
                    <option value="treasury">Treasury</option>
                    <option value="governance">Governance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a57e24]"
                  placeholder="Describe your proposal in detail..."
                />
              </div>
              <div className="mt-6 flex gap-4">
                <Button className="bg-[#a57e24] hover:bg-[#8a671d] text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Proposal
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule for Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
