'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Button } from '../../component/UI/button'

export default function WhitepaperPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [pdfScale, setPdfScale] = useState(1)

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
    window.open('/Whitepaper.pdf', '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-sky-950 shadow-sm border-b border-sky-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/images/NWIS.png"
                  alt="NWIS logo"
                  width={80}
                  height={80}
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </Link>
            </div>
            <div className="flex-1 text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-white">NexusWealth Whitepaper</h1>
              <p className="text-sm sm:text-base text-sky-200">NWIS Investment Solutions v3.0</p>
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

      {/* PDF Viewer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden px-0">
          {isLoading && (
            <div className="flex items-center justify-center h-64 sm:h-96 bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-sky-600 mx-auto mb-3 sm:mb-4"></div>
                <p className="text-sm sm:text-base text-gray-600">Loading whitepaper...</p>
              </div>
            </div>
          )}
          
          <div className="pdf-container relative w-full h-[calc(100vh-300px)] sm:h-[calc(100vh-200px)] min-h-[400px] sm:min-h-[600px] overflow-hidden">
            <iframe
              src="/Whitepaper.pdf#view=FitH&scrollbar=0&toolbar=0&navpanes=0&zoom=page-fit"
              className="h-full"
              onLoad={handleLoad}
              title="NexusWealth Whitepaper"
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
