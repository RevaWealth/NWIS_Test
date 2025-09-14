'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, FileText, Calculator, Scale, Shield } from 'lucide-react'
import { Button } from '../../component/UI/button'
import Navbar from '../../navbar'

export default function DocumentsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [pdfScale, setPdfScale] = useState(1)
  const [activeTab, setActiveTab] = useState('whitepaper')
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null)

  const documentTabs = [
    {
      id: 'whitepaper',
      name: 'Whitepaper',
      icon: FileText,
      description: 'Complete project overview',
      file: '/WPV4.pdf'
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
      file: '/Whitepaper.pdf', // Placeholder - will be updated with actual legal docs
      hasSubTabs: true,
      subTabs: [
        {
          id: 'terms-of-service',
          name: 'Token Buyer Disclaimer',
          description: 'Token purchase terms and disclaimer',
          file: '/TBD.pdf'
        },
        {
          id: 'privacy-policy',
          name: 'Token Buyer Purchase Agreement',
          description: 'Token purchase terms and conditions',
          file: '/TPA.pdf'
        }
      ]
    },
    {
      id: 'security',
      name: 'Security Audit',
      icon: Shield,
      description: 'Smart contract audit reports',
      file: '/Whitepaper.pdf' // Placeholder - will be updated with actual audit docs
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
    setActiveSubTab(null) // Reset subtab when changing main tab
    setIsLoading(true)
  }

  const handleSubTabChange = (subTabId: string) => {
    setActiveSubTab(subTabId)
    setIsLoading(true)
  }

  const getActiveDocument = () => {
    const mainTab = documentTabs.find(tab => tab.id === activeTab) || documentTabs[0]
    
    // If this tab has subtabs and a subtab is active, return the subtab
    if (mainTab.hasSubTabs && activeSubTab && mainTab.subTabs) {
      const subTab = mainTab.subTabs.find(sub => sub.id === activeSubTab)
      if (subTab) {
        return {
          id: subTab.id,
          name: subTab.name,
          description: subTab.description,
          file: subTab.file
        }
      }
    }
    
    // Otherwise return the main tab
    return mainTab
  }

  const getActiveMainTab = () => {
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
                disabled={activeTab === 'security'}
                className={`flex items-center space-x-2 border-sky-950 text-sky-950 hover:bg-sky-900 hover:text-white text-xs sm:text-sm px-3 sm:px-4 py-2 ${
                  activeTab === 'security' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">
                  {activeTab === 'security' ? 'Not Available' : 'Open in New Tab'}
                </span>
                <span className="sm:hidden">
                  {activeTab === 'security' ? 'N/A' : 'Open'}
                </span>
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
                const isActive = activeTab === tab.id
                const hasSubTabs = tab.hasSubTabs && tab.subTabs
                
                return (
                  <div key={tab.id}>
                    {/* Main Tab Button */}
                    <button
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                        isActive
                          ? 'bg-sky-950 text-white shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`h-5 w-5 ${
                          isActive ? 'text-white' : 'text-gray-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm ${
                            isActive ? 'text-white' : 'text-gray-900'
                          }`}>
                            {tab.name}
                          </p>
                          <p className={`text-xs mt-1 ${
                            isActive ? 'text-sky-200' : 'text-gray-500'
                          }`}>
                            {tab.description}
                          </p>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </button>

                    {/* SubTabs for Legal Documents */}
                    {isActive && hasSubTabs && (
                      <div className="ml-6 mt-2 space-y-1 border-l-2 border-sky-200 pl-4">
                        {tab.subTabs!.map((subTab) => (
                          <button
                            key={subTab.id}
                            onClick={() => handleSubTabChange(subTab.id)}
                            className={`w-full p-2 rounded-md text-left transition-all duration-200 ${
                              activeSubTab === subTab.id
                                ? 'bg-sky-800 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <div className={`w-1 h-1 rounded-full ${
                                activeSubTab === subTab.id ? 'bg-white' : 'bg-gray-400'
                              }`}></div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium text-xs ${
                                  activeSubTab === subTab.id ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {subTab.name}
                                </p>
                                <p className={`text-xs mt-1 ${
                                  activeSubTab === subTab.id ? 'text-sky-200' : 'text-gray-500'
                                }`}>
                                  {subTab.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
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
            {/* Security Audit Banner */}
            {activeTab === 'security' ? (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-sky-50 to-sky-100">
                <div className="text-center max-w-md mx-auto p-8">
                  <div className="mb-6">
                    <Shield className="h-16 w-16 text-sky-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Security Audit</h2>
                    <p className="text-gray-600 mb-6">Smart contract audit reports and security assessments</p>
                  </div>
                  
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-yellow-100 rounded-full p-3">
                        <Shield className="h-8 w-8 text-yellow-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Coming Soon</h3>
                    <p className="text-yellow-700 font-medium text-lg">Will be Available Q4 of 2026</p>
                    <p className="text-yellow-600 text-sm mt-2">Our comprehensive security audit reports are currently in development and will be published in Q4 2026.</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
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
