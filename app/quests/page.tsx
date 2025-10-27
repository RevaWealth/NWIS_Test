'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../../sections/navbar'
import AnnouncementBar from '../../sections/announcement-bar'
import { SocialMediaModal } from '../../components/SocialMediaModal'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'

export default function QuestsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [showSocialModal, setShowSocialModal] = useState(false)
  const [questProgress, setQuestProgress] = useState({
    1: 0, // Early Adopter Quest progress
    2: 0, // Social Media Champion progress
    3: 0  // Community Builder progress
  })

  // Use ConnectKit and Wagmi hooks for wallet connection
  const { isConnected, address } = useAccount()

  const quests = [
    {
      id: 1,
      title: "Early Adopter Quest",
      description: "Be among the first 1000 users to purchase NWIS tokens",
      reward: "5000 NWIS",
      status: "active",
      category: "trading",
      progress: questProgress[1],
      maxProgress: 1000
    },
    {
      id: 2,
      title: "Social Media Champion",
      description: "Follow NWIS on X and Instagram, tag NWIS in a post with your wallet address.",
      reward: "10000 NWIS",
      status: "active",
      category: "social",
      progress: questProgress[2],
      maxProgress: 1000
    },
  ]

  const categories = [
    { id: 'all', name: 'All Quests', count: quests.length },
    { id: 'trading', name: 'Trading', count: quests.filter(q => q.category === 'trading').length },
    { id: 'social', name: 'Social', count: quests.filter(q => q.category === 'social').length },
    { id: 'referral', name: 'Referral', count: quests.filter(q => q.category === 'referral').length }
  ]

  const filteredQuests = activeTab === 'all' 
    ? quests 
    : quests.filter(quest => quest.category === activeTab)

  // Handle quest button clicks
  const handleQuestClick = (quest: any) => {
    if (quest.id === 1) {
      // Early Adopter Quest - check wallet connection first
      if (!isConnected) {
        // ConnectKit will handle the wallet connection modal
        return
      }
      
      // Wallet is connected, proceed to App.nwis.io
      window.open('https://App.nwis.io', '_blank', 'noopener,noreferrer')
      
      // Start listening for transaction completion
      startTransactionTracking()
    } else if (quest.id === 2) {
      // Social Media Champion Quest - show social media modal
      setShowSocialModal(true)
    } else {
      // Other quests - show coming soon message
      alert('This quest feature is coming soon!')
    }
  }

  // Handle social media quest completion
  const handleSocialQuestComplete = () => {
    setQuestProgress(prev => ({
      ...prev,
      2: Math.min(prev[2] + 1, 1000) // Increment by 1, max 1000
    }))
  }

  // Real blockchain transaction tracking for NWIS token purchases
  const startTransactionTracking = async () => {
    try {
      // Use the already connected wallet address from ConnectKit
      if (!isConnected || !address) {
        alert('Please connect your wallet first to track transactions')
        return
      }
      
      console.log('Tracking transactions for wallet:', address)
      
      // Start listening for NWIS token purchase events
      // This would require the NWIS token contract address and ABI
      const nwisContractAddress = '0x...' // Replace with actual NWIS contract address
      const nwisContractABI = [
        // Transfer event signature
        {
          "anonymous": false,
          "inputs": [
            {"indexed": true, "name": "from", "type": "address"},
            {"indexed": true, "name": "to", "type": "address"},
            {"indexed": false, "name": "value", "type": "uint256"}
          ],
          "name": "Transfer",
          "type": "event"
        }
      ]
      
      // Listen for Transfer events where 'to' is the user's wallet
      // This indicates NWIS tokens being received (purchased)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(nwisContractAddress, nwisContractABI, provider)
      
      // Set up event listener for Transfer events
      contract.on('Transfer', async (from, to, value, event) => {
        if (to.toLowerCase() === address.toLowerCase()) {
          console.log('NWIS tokens received:', ethers.utils.formatEther(value))
          
          // Check if this is a significant purchase (e.g., >= 50,000 NWIS)
          const tokenAmount = parseFloat(ethers.utils.formatEther(value))
          if (tokenAmount >= 50000) { // Minimum purchase requirement
            
            try {
              // Log the quest completion to the API
              const response = await fetch('/api/quest-log', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  walletAddress: address,
                  transactionHash: event.transactionHash,
                  questId: 1, // Early Adopter Quest
                  timestamp: new Date().toISOString(),
                  tokenAmount: tokenAmount
                })
              })

              if (response.ok) {
                // Update local progress
                setQuestProgress(prev => ({
                  ...prev,
                  1: Math.min(prev[1] + 1, 1000) // Increment by 1, max 1000
                }))
                
                alert(`🎉 Early Adopter Quest Completed!\n\nPurchased: ${tokenAmount.toLocaleString()} NWIS\nTransaction: ${event.transactionHash}\n\nYou're now eligible for the $1000 USDT reward!`)
                
                // Stop listening for this wallet (quest completed)
                contract.removeAllListeners('Transfer')
              } else {
                console.error('Failed to log quest completion')
              }
            } catch (error) {
              console.error('Error logging quest completion:', error)
            }
          }
        }
      })
      
      // Show user that tracking has started
      alert(`Transaction tracking started for wallet: ${address.slice(0, 6)}...${address.slice(-4)}\n\nMake your NWIS purchase on App.nwis.io and we'll automatically detect it!`)
      
    } catch (error) {
      console.error('Error setting up transaction tracking:', error)
      alert('Error setting up transaction tracking. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/20'
      case 'locked':
        return 'text-gray-400 bg-gray-400/20'
      case 'completed':
        return 'text-blue-400 bg-blue-400/20'
      default:
        return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trading':
        return 'text-blue-400 bg-blue-400/20'
      case 'social':
        return 'text-purple-400 bg-purple-400/20'
      case 'referral':
        return 'text-green-400 bg-green-400/20'
      case 'education':
        return 'text-yellow-400 bg-yellow-400/20'
      default:
        return 'text-gray-400 bg-gray-400/20'
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Announcement Bar */}
      <AnnouncementBar />
      
      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <div className="text-center pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">
            <span className="text-[#a57e24]">NWIS</span> Quests
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-gray-300">
            Complete quests to earn NWIS tokens and unlock exclusive rewards. Level up your participation in the NWIS ecosystem.
          </p>
        </div>
      </div>

      {/* Special Reward Section */}
      <div className="bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="text-white">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                🎉 Special Reward Alert!
              </h2>
              <div className="space-y-4 text-lg">
                <p className="font-semibold">
                  5 random participants of the Early Adopter and Social Media quests will receive extra <span className="text-[#a57e24] font-bold">$1000 USDT</span>
                </p>
                <p className="text-gray-100">
                  Minimum purchase of <span className="font-bold text-[#a57e24]">50,000 $NWIS</span> is required to be eligible for the reward.
                </p>
                <div className="bg-black bg-opacity-30 rounded-lg p-4 mt-6">
                  <p className="text-sm text-gray-200">
                    <span className="font-semibold">How it works:</span><br/>
                    Must complete both quests (Minumum purchase of 50,000 NWIS applies) → Automatically entered into the random draw → 5 winners receive $1000 USDT each!
                  </p>
                </div>
              </div>
            </div>
            
            {/* Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <Image
                  src="/images/Quest3.png"
                  alt="Quest Reward"
                  width={600}
                  height={600}
                  className="rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quests Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Quest Categories */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === category.id
                  ? 'bg-[#a57e24] text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Quests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredQuests.map((quest) => (
            <div key={quest.id} className="bg-gray-900 border border-gray-700 rounded-xl p-8 hover:border-gray-600 transition-colors transform hover:scale-105 hover:shadow-2xl flex flex-col h-full">
              {/* Quest Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-4">
                  <h3 className="text-2xl font-bold text-white mb-3">{quest.title}</h3>
                  <p className="text-gray-400 text-base leading-relaxed line-clamp-4">{quest.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quest.status)} whitespace-nowrap`}>
                  {quest.status}
                </span>
              </div>

              {/* Spacer to push content to bottom */}
              <div className="flex-grow"></div>

              {/* Quest Category - anchored before progress bar */}
              <div className="mb-4 min-h-[40px] flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(quest.category)}`}>
                  {quest.category}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-base text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{quest.progress}/{quest.maxProgress}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-[#a57e24] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Reward */}
              <div className="flex items-center justify-between">
                <div className="text-base text-gray-400">
                  Reward: <span className="text-[#a57e24] font-semibold text-lg">{quest.reward}</span>
                </div>
                <ConnectKitButton.Custom>
                  {({ isConnected, show }) => {
                    if (quest.id === 1) {
                      return (
                        <button 
                          onClick={() => {
                            if (!isConnected) {
                              show?.()
                            } else {
                              handleQuestClick(quest)
                            }
                          }}
                          className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                            quest.status === 'active'
                              ? 'bg-[#a57e24] hover:bg-[#8a671d] text-white'
                              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          }`}
                          disabled={quest.status !== 'active'}
                        >
                          {isConnected ? 'Start Quest' : 'Connect Wallet'}
                        </button>
                      )
                    } else {
                      return (
                        <button 
                          onClick={() => handleQuestClick(quest)}
                          className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                            quest.status === 'active'
                              ? 'bg-[#a57e24] hover:bg-[#8a671d] text-white'
                              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          }`}
                          disabled={quest.status !== 'active'}
                        >
                          {quest.status === 'active' ? 'Start Quest' : 'Locked'}
                        </button>
                      )
                    }
                  }}
                </ConnectKitButton.Custom>
              </div>
            </div>
          ))}
        </div>

        {/* Quest Log Link */}
        <div className="mt-12 text-center">
          <Link 
            href="/quest-log"
            className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            View Quest Completion Log
          </Link>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16 text-center">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">More Quests Coming Soon</h2>
            <p className="text-gray-400 mb-6">
              We're constantly adding new quests and challenges. Stay tuned for exciting opportunities to earn more NWIS tokens!
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span>• Trading Challenges</span>
              <span>• Community Events</span>
              <span>• Educational Modules</span>
              <span>• Referral Programs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Modal */}
      <SocialMediaModal 
        isOpen={showSocialModal}
        onClose={() => setShowSocialModal(false)}
        onQuestComplete={handleSocialQuestComplete}
      />
    </div>
  )
}