'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Button } from '../../component/UI/button'

export default function WhitepaperPage() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoad = () => {
    setIsLoading(false)
  }



  const handleOpenInNewTab = () => {
    window.open('/Whitepaper.pdf', '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-sky-950 shadow-sm border-b border-sky-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/images/NWIS.png"
                  alt="NWIS logo"
                  width={80}
                  height={80}
                  className="h-12 w-auto object-contain"
                />
              </Link>
            </div>
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-white">NexusWealth Whitepaper</h1>
              <p className="text-sky-200">NWIS Investment Solutions v3.0</p>
            </div>
            <div className="flex items-center">
              <Button
                onClick={handleOpenInNewTab}
                variant="outline"
                className="flex items-center space-x-2 border-sky-950 text-sky-950 hover:bg-sky-900 hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open in New Tab</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {isLoading && (
            <div className="flex items-center justify-center h-96 bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading whitepaper...</p>
              </div>
            </div>
          )}
          
          <iframe
            src="/Whitepaper.pdf"
            className="w-full h-[calc(100vh-200px)] min-h-[600px]"
            onLoad={handleLoad}
            title="NexusWealth Whitepaper"
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              <strong>NexusWealth Investment Solutions (NWIS)</strong> - Empowering individuals to build generational wealth through blockchain tokenization.
            </p>
            <p className="text-sm">
              This whitepaper outlines our vision for revolutionizing real-world investment through decentralized innovation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
