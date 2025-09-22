'use client'

import { useState } from 'react'

interface DesktopPdfViewerProps {
  fileUrl: string
}

export default function DesktopPdfViewer({ fileUrl }: DesktopPdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div className="h-full w-full bg-gray-50 flex flex-col">

      {/* PDF Content */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-base text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}

        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="text-6xl mb-4">📄</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">PDF Load Error</h2>
              <p className="text-gray-600 mb-6">Unable to load the PDF file. Please try opening it in a new tab.</p>
              <button
                onClick={() => window.open(fileUrl, '_blank')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open PDF in New Tab
              </button>
            </div>
          </div>
        ) : (
          <iframe
            src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0`}
            className="w-full h-full border-0"
            title="PDF Viewer"
            onLoad={handleLoad}
            onError={handleError}
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        )}
      </div>
    </div>
  )
}
