"use client"

import { useEffect, useState } from "react"
import { X, Wallet, CheckCircle } from "lucide-react"

interface MobileApprovalBannerProps {
  isVisible: boolean
  onClose: () => void
  isApprovalPending: boolean
  isApprovalConfirmed: boolean
}

export const MobileApprovalBanner = ({ 
  isVisible, 
  onClose, 
  isApprovalPending, 
  isApprovalConfirmed 
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

  // Auto-dismiss when approval is confirmed
  useEffect(() => {
    if (isApprovalConfirmed && isVisible) {
      // Show success state briefly, then auto-dismiss
      setTimeout(() => {
        onClose()
      }, 2000)
    }
  }, [isApprovalConfirmed, isVisible, onClose])

  if (!shouldShow) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Banner */}
      <div 
        className={`absolute bottom-0 left-0 right-0 pointer-events-auto transform transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-2xl">
          <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {isApprovalConfirmed ? (
                    <CheckCircle className="h-6 w-6 text-green-300" />
                  ) : (
                    <Wallet className="h-6 w-6 text-blue-200" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white">
                    {isApprovalConfirmed ? "Approval Confirmed!" : "Open Your Wallet"}
                  </h3>
                  <p className="text-xs text-blue-100 mt-1">
                    {isApprovalConfirmed 
                      ? "Transaction approved successfully. You can now proceed with your purchase."
                      : "Please open your wallet app and approve the token transaction."
                    }
                  </p>
                </div>
              </div>
              
              {/* Close button - only show if not auto-dismissing */}
              {!isApprovalConfirmed && (
                <button
                  onClick={onClose}
                  className="flex-shrink-0 ml-3 p-1 rounded-full hover:bg-blue-500 transition-colors"
                >
                  <X className="h-4 w-4 text-blue-200" />
                </button>
              )}
            </div>
            
            {/* Progress indicator for pending approval */}
            {isApprovalPending && !isApprovalConfirmed && (
              <div className="mt-3">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-blue-500 rounded-full h-1.5">
                    <div className="bg-blue-200 h-1.5 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-xs text-blue-200">Waiting for approval...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
