'use client'

import { useState, useEffect } from 'react'
import Navbar from '../../sections/navbar'
import AnnouncementBar from '../../sections/announcement-bar'
import { Copy, ExternalLink, Download } from 'lucide-react'

interface QuestLog {
  id: number
  walletAddress: string
  transactionHash: string
  questId: number
  timestamp: string
  status: string
  xPostLink?: string
  instagramPostLink?: string
}

export default function QuestLogPage() {
  const [logs, setLogs] = useState<QuestLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'early' | 'social'>('early')
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/quest-log')
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error('Error fetching quest logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (text: string, type: 'address' | 'hash') => {
    navigator.clipboard.writeText(text)
    if (type === 'address') {
      setCopiedAddress(text)
      setTimeout(() => setCopiedAddress(null), 2000)
    } else {
      setCopiedHash(text)
      setTimeout(() => setCopiedHash(null), 2000)
    }
  }

  const handleExport = () => {
    const csv = filteredLogs.map(log => {
      if (activeTab === 'social') {
        return `${log.timestamp},${log.xPostLink || ''},${log.instagramPostLink || ''}`
      } else {
        return `${log.walletAddress},${log.transactionHash},${log.timestamp}`
      }
    }).join('\n')
    
    const headers = activeTab === 'social' 
      ? 'Timestamp,X Post Link,Instagram Post Link'
      : 'Wallet Address,Transaction Hash,Timestamp'
    
    const csvContent = `${headers}\n${csv}`
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quest-log-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // Filter logs based on active tab
  const filteredLogs = activeTab === 'social' 
    ? logs.filter(log => log.questId === 2 && log.xPostLink && log.instagramPostLink)
    : logs.filter(log => log.questId === 1) // Early Adopters only

  // Calculate stats for each tab
  const earlyAdoptersCount = logs.filter(log => log.questId === 1).length
  const socialLogsCount = logs.filter(log => log.questId === 2 && log.xPostLink && log.instagramPostLink).length
  const uniqueEarlyAdopters = new Set(logs.filter(log => log.questId === 1).map(l => l.walletAddress)).size
  const uniqueSocialParticipants = new Set(logs.filter(log => log.questId === 2 && log.xPostLink && log.instagramPostLink).map(l => l.walletAddress)).size

  const getQuestName = (questId: number) => {
    const questNames: { [key: number]: string } = {
    1: 'Early Investor Quest',
      2: 'Social Media Champion',
      3: 'Community Builder'
    }
    return questNames[questId] || 'Unknown Quest'
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const shortenHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Announcement Bar */}
      <AnnouncementBar />
      
      {/* Navbar */}
      <Navbar />

      {/* Quest Log Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">
            Quest <span className="text-[#a57e24]">Completion Log</span>
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-gray-300 px-4">
            Track and verify quest completions with wallet addresses and transaction hashes
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('early')}
              className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'early'
                  ? 'bg-[#a57e24] text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Early Adopters ({earlyAdoptersCount})
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'social'
                  ? 'bg-[#a57e24] text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Social Media Posts ({socialLogsCount})
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <div className="text-3xl font-bold text-[#a57e24] mb-2">
              {activeTab === 'early' ? earlyAdoptersCount : socialLogsCount}
            </div>
            <div className="text-gray-400">
              {activeTab === 'early' ? 'Early Adopter Completions' : 'Social Media Submissions'}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {activeTab === 'early' ? uniqueEarlyAdopters : uniqueSocialParticipants}
            </div>
            <div className="text-gray-400">Unique Participants</div>
          </div>
        </div>


        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                {activeTab === 'early' ? (
                  <>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">#</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Timestamp</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Wallet Address</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tx Hash</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Timestamp</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">X Post</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">IG Post</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={activeTab === 'early' ? 4 : 3} className="px-6 py-12">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a57e24]"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={activeTab === 'early' ? 4 : 3} className="px-6 py-12 text-center">
                    <p className="text-gray-400">
                      {activeTab === 'social' ? 'No social media posts submitted yet' : 'No early adopter completions logged yet'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <tr key={log.id} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                    {activeTab === 'early' ? (
                      <>
                        <td className="px-6 py-4 text-sm text-gray-400">{log.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-300 font-mono">
                              {shortenAddress(log.walletAddress)}
                            </span>
                            <button
                              onClick={() => handleCopy(log.walletAddress, 'address')}
                              className="p-1 hover:bg-gray-700 rounded transition-colors"
                              title="Copy full address"
                            >
                              <Copy className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-300 font-mono">
                              {shortenHash(log.transactionHash)}
                            </span>
                            <button
                              onClick={() => handleCopy(log.transactionHash, 'hash')}
                              className="p-1 hover:bg-gray-700 rounded transition-colors"
                              title="Copy full hash"
                            >
                              <Copy className="h-4 w-4 text-gray-400" />
                            </button>
                            <a
                              href={`https://etherscan.io/tx/${log.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 hover:bg-gray-700 rounded transition-colors"
                              title="View on Etherscan"
                            >
                              <ExternalLink className="h-4 w-4 text-blue-400" />
                            </a>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {log.xPostLink ? (
                            <a
                              href={log.xPostLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-300 hover:text-blue-200 break-all"
                              title={log.xPostLink}
                            >
                              {log.xPostLink}
                            </a>
                          ) : (
                            <span className="text-xs text-gray-500">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {log.instagramPostLink ? (
                            <a
                              href={log.instagramPostLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-pink-300 hover:text-pink-200 break-all"
                              title={log.instagramPostLink}
                            >
                              {log.instagramPostLink}
                            </a>
                          ) : (
                            <span className="text-xs text-gray-500">N/A</span>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
