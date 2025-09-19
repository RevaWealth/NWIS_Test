"use client"

import { useEffect, useState } from "react"
import { X, Wallet } from "lucide-react"

interface MobileApprovalBannerProps {
  isVisible: boolean
  onClose: () => void
}

export const MobileApprovalBanner = ({ 
  isVisible, 
  onClose
}: MobileApprovalBannerProps) => {
  const [shouldShow, setShouldShow] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Handle banner visibility with animation
  useEffect(() => {
    if (isVisible) {
      setShouldShow(true)
      // Small delay to ensure DOM is ready for animation
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
      // Wait for animation to complete before hiding
      setTimeout(() => setShouldShow(false), 300)
    }
  }, [isVisible])

  // No auto-dismiss - user must close manually with X button

  if (!shouldShow) return null

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Banner */}
      <div 
        className={`absolute bottom-20 left-0 right-0 pointer-events-auto transform transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-2xl">
          <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Wallet className="h-6 w-6 text-yellow-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-black">
                    Open Your Wallet
                  </h3>
                  <p className="text-xs text-yellow-900 mt-1">
                    Please open your wallet app and approve the token transaction.
                  </p>
                </div>
              </div>
              
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onClose()
                }}
                className="flex-shrink-0 ml-3 p-1 rounded-full hover:bg-yellow-400 transition-colors"
              >
                <X className="h-4 w-4 text-yellow-900" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
