'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, FileText, Calculator, Scale, Shield } from 'lucide-react'
import { Button } from '../../component/UI/button'
import Navbar from '../../sections/navbar'
import dynamic from 'next/dynamic'
import { pdfjs } from 'react-pdf'
import { isMobileDevice, isWalletBrowser } from '../../lib/wallet-browser-utils'

// Only initialize PDF.js on client-side to avoid SSR issues
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
}

// Disable SSR for PDF components
const MobilePdfViewer = dynamic(() => import('../../components/MobilePdfViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
        <p className="text-base text-gray-600">Loading document...</p>
      </div>
    </div>
  )
})

const DesktopPdfViewer = dynamic(() => import('../../components/DesktopPdfViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
        <p className="text-base text-gray-600">Loading document...</p>
      </div>
    </div>
  )
})

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Detect mobile device and desktop
  useEffect(() => {
    const checkBrowser = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                            window.innerWidth <= 768
      const isWallet = isWalletBrowser()
      const isDesktopBrowser = !isMobileDevice && !isWallet
      
      console.log('Browser detection:', {
        userAgent: navigator.userAgent,
        windowWidth: window.innerWidth,
        isMobile: isMobileDevice,
        isWallet: isWallet,
        isDesktop: isDesktopBrowser
      })
      
      setIsMobile(isMobileDevice)
      setIsDesktop(isDesktopBrowser)
      
      // Set default tab for desktop users only
      if (!isMobileDevice && !activeTab) {
        setActiveTab('whitepaper')
      }
    }
    
    checkBrowser()
    window.addEventListener('resize', checkBrowser)
    return () => window.removeEventListener('resize', checkBrowser)
  }, [activeTab])

  const documentTabs = [
    {
      id: 'whitepaper',
      name: 'Whitepaper',
      icon: FileText,
      description: 'Complete project overview',
      file: '/api/pdf?file=WPV4.pdf'
    },
    {
      id: 'tokenomics',
      name: 'Tokenomics',
      icon: Calculator,
      description: 'Token distribution & economics',
      file: '/api/pdf?file=Tokenomics.pdf'
    },
    {
      id: 'legal',
      name: 'Legal Documents',
      icon: Scale,
      description: 'Terms & legal compliance',
      file: '/api/pdf?file=Whitepaper.pdf', // Placeholder - will be updated with actual legal docs
      hasSubTabs: true,
      subTabs: [
        {
          id: 'terms-of-service',
          name: 'Token Buyer Disclaimer',
          description: 'Token purchase terms and disclaimer',
          file: '/api/pdf?file=TBD.pdf'
        },
        {
          id: 'privacy-policy',
          name: 'Token Purchase Agreement',
          description: 'Token purchase terms and conditions',
          file: '/api/pdf?file=TPA.pdf'
        },
        {
          id: 'risk-factors',
          name: 'Risk Factors',
          description: 'Investment risks and disclosures',
          file: '/api/pdf?file=Risk Factors.pdf'
        },
        {
          id: 'regulatory-positioning',
          name: 'Regulatory Positioning Statement',
          description: 'Regulatory compliance and positioning',
          file: '/api/pdf?file=Regulatory Positioning Statement.pdf'
        }
      ]
    },
    {
      id: 'security',
      name: 'Security Audit',
      icon: Shield,
      description: 'Smart contract audit reports',
      file: '/api/pdf?file=Certik.pdf'
    }
  ]

  // Memoize the active document (string URL) so <Document file=...> is stable
  const activeDocUrl = useMemo(() => {
    if (!activeTab) return null;
    
    const mainTab = documentTabs.find(t => t.id === activeTab);
    if (!mainTab) return null;
    
    if (mainTab.hasSubTabs && activeSubTab && mainTab.subTabs) {
      const sub = mainTab.subTabs.find(s => s.id === activeSubTab);
      if (sub) {
        console.log('Using sub-tab file:', sub.file, 'for sub-tab:', activeSubTab)
        return sub.file;
      }
    }
    console.log('Using main tab file:', mainTab.file, 'for tab:', activeTab)
    return mainTab.file;
  }, [activeTab, activeSubTab, documentTabs]);



  const handleOpenInNewTab = () => {
    const activeDocument = documentTabs.find(tab => tab.id === activeTab)
    if (activeDocument) {
      // Extract filename from API route for direct download
      const filename = activeDocument.file.split('file=')[1]
      window.open(`/${filename}`, '_blank')
    }
  }

  const handleTabChange = (tabId: string) => {
    console.log('Tab changed to:', tabId, 'isMobile:', isMobile)
    
    const tab = documentTabs.find(t => t.id === tabId)
    
    // Always update the active tab state first
    setActiveTab(tabId)
    setActiveSubTab(null) // Reset subtab when changing main tab
    
    if (isMobile) {
      // On mobile, only open PDF in new tab if the tab has no sub-tabs
      if (tab && !tab.hasSubTabs) {
        const filename = tab.file.split('file=')[1]
        console.log('Opening PDF in new tab:', filename)
        window.open(`/${filename}`, '_blank')
        return
      }
      // If tab has sub-tabs, let it show the sub-tabs menu instead
    } else {
      // On desktop, only open PDF directly if the tab has no sub-tabs
      if (tab && !tab.hasSubTabs) {
        // Let it proceed to show the PDF in embedded viewer
      } else if (tab && tab.hasSubTabs) {
        // If tab has sub-tabs, just select the tab and let user choose sub-tab
        return
      }
    }
  }

  const handleSubTabChange = (subTabId: string) => {
    console.log('Sub-tab changed to:', subTabId, 'isMobile:', isMobile)
    
    if (isMobile) {
      // On mobile, open PDF in new tab
      const mainTab = documentTabs.find(t => t.id === activeTab)
      if (mainTab?.hasSubTabs && mainTab.subTabs) {
        const subTab = mainTab.subTabs.find(s => s.id === subTabId)
        if (subTab) {
          const filename = subTab.file.split('file=')[1]
          console.log('Opening sub-tab PDF in new tab:', filename)
          window.open(`/${filename}`, '_blank')
          return
        }
      }
    }
    
    setActiveSubTab(subTabId)
  }

  const getActiveDocument = () => {
    if (!activeTab) {
      return {
        id: 'none',
        name: 'Select a Document',
        description: 'Choose a document to view',
        file: ''
      }
    }
    
    const mainTab = documentTabs.find(tab => tab.id === activeTab)
    if (!mainTab) {
      return {
        id: 'none',
        name: 'Select a Document',
        description: 'Choose a document to view',
        file: ''
      }
    }
    
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
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <div className="bg-[#000000] shadow-sm border-b border-sky-800">
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
                className="flex items-center space-x-2 border-[#000000] text-[#000000] hover:bg-sky-900 hover:text-white text-xs sm:text-sm px-3 sm:px-4 py-2"
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
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 ${
        isMobile && activeTab === 'legal' ? 'pb-32' : ''
      }`}>
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[500px]">
          
          {/* Vertical Tab Bar */}
          <div className={`w-full lg:w-80 bg-white rounded-lg shadow-lg p-4 ${
            isMobile && activeTab === 'legal' ? 'pb-32' : ''
          }`}>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Available Documents</h2>
            
            {/* ST4.mp4 Video */}
            <div className="mb-4 rounded-lg overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-auto"
              >
                <source src="/images/ST4.mp4" type="video/mp4" />
              </video>
            </div>
            
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
                          ? 'bg-[#000000] text-white shadow-md'
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
          </div>

          {/* Document Content Area - Hide on mobile for simple documents that open in new tab */}
          {!(isMobile && activeTab && activeTab !== 'legal' && activeTab !== 'security') && (
          <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
            {/* No document selected - show default message for desktop only */}
            {!activeTab ? (
              !isMobile ? (
                /* Desktop - No document selected */
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-sky-50 to-sky-100">
                  <div className="text-center max-w-md mx-auto p-8">
                    <div className="mb-6">
                      <div className="text-6xl mb-4">📄</div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">Select a Document</h2>
                      <p className="text-gray-600 mb-6">Choose a document from the left panel to view it here.</p>
                    </div>
                    
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-gray-100 rounded-full p-3">
                          <FileText className="h-8 w-8 text-gray-600" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Available Documents</h3>
                      <p className="text-gray-700 font-medium text-lg">Whitepaper, Tokenomics, Legal Documents</p>
                      <p className="text-gray-600 text-sm mt-2">Click on any document tab to get started.</p>
                    </div>
                  </div>
                </div>
              ) : null
            ) : isMobile && activeTab === 'legal' ? (
              /* Mobile Legal Documents - Show sub-tabs */
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-sky-50 to-sky-100">
                <div className="text-center max-w-md mx-auto p-8">
                  <div className="mb-6">
                    <div className="text-6xl mb-4">📋</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Legal Documents</h2>
                    <p className="text-gray-600 mb-6">Choose a specific legal document to view:</p>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        const filename = 'TBD.pdf'
                        console.log('Opening TBD in new tab:', filename)
                        window.open(`/${filename}`, '_blank')
                      }}
                      className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <div className="text-left">
                        <div className="font-semibold">Token Buyer Disclaimer</div>
                        <div className="text-sm text-blue-100">Token purchase terms and disclaimer</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        const filename = 'TPA.pdf'
                        console.log('Opening TPA in new tab:', filename)
                        window.open(`/${filename}`, '_blank')
                      }}
                      className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <div className="text-left">
                        <div className="font-semibold">Token Purchase Agreement</div>
                        <div className="text-sm text-green-100">Token purchase terms and conditions</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        const filename = 'Risk Factors.pdf'
                        console.log('Opening Risk Factors in new tab:', filename)
                        window.open(`/${filename}`, '_blank')
                      }}
                      className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      <div className="text-left">
                        <div className="font-semibold">Risk Factors</div>
                        <div className="text-sm text-purple-100">Investment risks and disclosures</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        const filename = 'Regulatory Positioning Statement.pdf'
                        console.log('Opening Regulatory Positioning Statement in new tab:', filename)
                        window.open(`/${filename}`, '_blank')
                      }}
                      className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <div className="text-left">
                        <div className="font-semibold">Regulatory Positioning Statement</div>
                        <div className="text-sm text-orange-100">Regulatory compliance and positioning</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : activeTab === 'legal' && !activeSubTab ? (
              /* Desktop Legal Documents - Show sub-tabs selection */
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-sky-50 to-sky-100">
                <div className="text-center max-w-2xl mx-auto p-8">
                  <div className="mb-8">
                    <div className="text-6xl mb-4">📋</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Legal Documents</h2>
                    <p className="text-gray-600 text-lg">Choose a specific legal document to view:</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                    <button
                      onClick={() => {
                        console.log('Opening TBD sub-tab')
                        setActiveSubTab('terms-of-service')
                      }}
                      className="p-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
                    >
                      <div className="text-left">
                        <div className="text-2xl mb-2">📄</div>
                        <div className="text-xl font-semibold mb-2">Token Buyer Disclaimer</div>
                        <div className="text-blue-100">Token purchase terms and disclaimer</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        console.log('Opening TPA sub-tab')
                        setActiveSubTab('privacy-policy')
                      }}
                      className="p-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl"
                    >
                      <div className="text-left">
                        <div className="text-2xl mb-2">📋</div>
                        <div className="text-xl font-semibold mb-2">Token Purchase Agreement</div>
                        <div className="text-green-100">Token purchase terms and conditions</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        console.log('Opening Risk Factors sub-tab')
                        setActiveSubTab('risk-factors')
                      }}
                      className="p-6 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-lg hover:shadow-xl"
                    >
                      <div className="text-left">
                        <div className="text-2xl mb-2">⚠️</div>
                        <div className="text-xl font-semibold mb-2">Risk Factors</div>
                        <div className="text-purple-100">Investment risks and disclosures</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        console.log('Opening Regulatory Positioning sub-tab')
                        setActiveSubTab('regulatory-positioning')
                      }}
                      className="p-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
                    >
                      <div className="text-left">
                        <div className="text-2xl mb-2">🏛️</div>
                        <div className="text-xl font-semibold mb-2">Regulatory Positioning Statement</div>
                        <div className="text-orange-100">Regulatory compliance and positioning</div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="mt-8 text-sm text-gray-500">
                    <p>Click on any document above to view it in the embedded PDF viewer.</p>
                  </div>
                </div>
              </div>
            ) : activeDocUrl ? (
              isMobile ? (
                // On mobile, don't show PDF viewer since PDFs open in new tab
                null
              ) : (
                <DesktopPdfViewer
                  fileUrl={activeDocUrl}
                />
              )
            ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
                      <p className="text-base text-gray-600">Loading document...</p>
                    </div>
                  </div>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  )
}
