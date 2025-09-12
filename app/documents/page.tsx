'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, FileText, Calculator, Scale, Shield, TrendingUp } from 'lucide-react'
import { Button } from '../../component/UI/button'
import Navbar from '../../navbar'

export default function DocumentsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [pdfScale, setPdfScale] = useState(1)
  const [activeTab, setActiveTab] = useState('whitepaper')

  const documentTabs = [
    {
      id: 'whitepaper',
      name: 'Whitepaper',
      icon: FileText,
      description: 'Complete project overview',
      file: '/Whitepaper.pdf'
    },
    {
      id: 'tokenomics',
      name: 'Tokenomics',
      icon: Calculator,
      description: 'Token distribution & economics',
      file: '/Whitepaper.pdf' // Placeholder - will be updated with actual tokenomics doc
    },
    {
      id: 'legal',
      name: 'Legal Documents',
      icon: Scale,
      description: 'Terms & legal compliance',
      file: '/Whitepaper.pdf' // Placeholder - will be updated with actual legal docs
    },
    {
      id: 'security',
      name: 'Security Audit',
      icon: Shield,
      description: 'Smart contract audit reports',
      file: '/Whitepaper.pdf' // Placeholder - will be updated with actual audit docs
    },
    {
      id: 'roadmap',
      name: 'Roadmap',
      icon: TrendingUp,
      description: 'Project timeline & milestones',
      file: '/Whitepaper.pdf' // Placeholder - will be updated with actual roadmap doc
    }
  ]

  const handleLoad = () => {
    setIsLoading(false)
    // Set appropriate scale based on screen size
    if (window.innerWidth <= 480) {
      setPdfScale(0.8)
    } else if (window.innerWidth <= 640) {
      setPdfScale(0.9)
    } else {
      setPdfScale(1)
    }
  }

  const handleOpenInNewTab = () => {
    const activeDocument = documentTabs.find(tab => tab.id === activeTab)
    if (activeDocument) {
      window.open(activeDocument.file, '_blank')
    }
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setIsLoading(true)
  }

  const getActiveDocument = () => {
    return documentTabs.find(tab => tab.id === activeTab) || documentTabs[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <div className="bg-sky-950 shadow-sm border-b border-sky-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex-1 text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-white">NexusWealth Documents</h1>
              <p className="text-sm sm:text-base text-sky-200">{getActiveDocument().name} - {getActiveDocument().description}</p>
            </div>
            <div className="flex items-center">
              <Button
                onClick={handleOpenInNewTab}
                variant="outline"
                className="flex items-center space-x-2 border-sky-950 text-sky-950 hover:bg-sky-900 hover:text-white text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Open in New Tab</span>
                <span className="sm:hidden">Open</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-300px)] min-h-[600px]">
          
          {/* Vertical Tab Bar */}
          <div className="w-full lg:w-80 bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Available Documents</h2>
            
            <div className="space-y-2">
              {documentTabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-sky-950 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`h-5 w-5 ${
                        activeTab === tab.id ? 'text-white' : 'text-gray-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${
                          activeTab === tab.id ? 'text-white' : 'text-gray-900'
                        }`}>
                          {tab.name}
                        </p>
                        <p className={`text-xs mt-1 ${
                          activeTab === tab.id ? 'text-sky-200' : 'text-gray-500'
                        }`}>
                          {tab.description}
                        </p>
                      </div>
                      {activeTab === tab.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Document Info */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-800 mb-2">Document Info</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p><span className="font-medium">Type:</span> PDF Document</p>
                <p><span className="font-medium">Format:</span> Interactive Viewer</p>
                <p><span className="font-medium">Access:</span> Public</p>
              </div>
            </div>
          </div>

          {/* Document Content Area */}
          <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
            {isLoading && (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
                  <p className="text-base text-gray-600">Loading document...</p>
                </div>
              </div>
            )}
            
            <div className="pdf-container relative w-full h-full overflow-hidden">
              <iframe
                src={`${getActiveDocument().file}#view=FitH&scrollbar=0&toolbar=0&navpanes=0&zoom=page-fit`}
                className="h-full w-full"
                onLoad={handleLoad}
                title={getActiveDocument().name}
                style={{ 
                  border: 'none',
                  transform: `scale(${pdfScale})`,
                  transformOrigin: 'center top',
                  width: `${100 / pdfScale}%`,
                  height: `${100 / pdfScale}%`,
                  maxWidth: '100%'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-white border-t mt-4 sm:mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="text-center text-gray-600">
            <p className="mb-2 text-sm sm:text-base">
              <strong>NexusWealth Investment Solutions (NWIS)</strong> - Empowering individuals to build generational wealth through blockchain tokenization.
            </p>
            <p className="text-xs sm:text-sm">
              This whitepaper outlines our vision for revolutionizing real-world investment through decentralized innovation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
