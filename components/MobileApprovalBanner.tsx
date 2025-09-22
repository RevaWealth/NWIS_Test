"use client"

import { useEffect, useState } from "react"
import { X, Wallet } from "lucide-react"
import { getBannerConfig, isWalletBrowser } from "@/lib/wallet-browser-utils"

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
  const isWallet = isWalletBrowser()
  const bannerConfig = getBannerConfig()

  // Handle banner visibility with animation
  useEffect(() => {
    // Don't show banner if running inside a wallet browser
    if (isVisible && !isWallet) {
      setShouldShow(true)
      // Small delay to ensure DOM is ready for animation
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
      // Wait for animation to complete before hiding
      setTimeout(() => setShouldShow(false), 300)
    }
  }, [isVisible, isWallet])

  // No auto-dismiss - user must close manually with X button

  if (!shouldShow) return null

  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: bannerConfig.zIndex }}
    >
      {/* Backdrop - only show in wallet browsers for better visibility */}
      {isWallet && (
        <div 
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      
      {/* Banner */}
      <div 
        className={`absolute left-0 right-0 pointer-events-auto transform transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          bottom: bannerConfig.bottom,
          maxWidth: bannerConfig.maxWidth,
          margin: bannerConfig.margin,
        }}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <div 
          className={`bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-2xl ${isWallet ? 'rounded-lg mx-2' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <div 
            className={`${isWallet ? 'px-3 py-3' : 'px-4 py-4 sm:px-6'}`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <div className="flex items-center justify-between">
                  <div className={`flex items-center ${isWallet ? 'space-x-2' : 'space-x-3'}`}>
                    <div className="flex-shrink-0">
                      <Wallet className={`${isWallet ? 'h-5 w-5' : 'h-6 w-6'} text-yellow-900`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`${isWallet ? 'text-xs' : 'text-sm'} font-semibold text-black`}>
                        Open Your Wallet
                      </h3>
                      <p className={`${isWallet ? 'text-xs' : 'text-xs'} text-yellow-900 mt-1`}>
                        {isWallet 
                          ? "Approve the transaction in your wallet." 
                          : "Please open your wallet app and approve the token transaction."
                        }
                      </p>
                    </div>
                  </div>
              
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  ;(e.nativeEvent as any).stopImmediatePropagation?.()
                  onClose()
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  ;(e.nativeEvent as any).stopImmediatePropagation?.()
                }}
                onTouchStart={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  ;(e.nativeEvent as any).stopImmediatePropagation?.()
                }}
                className={`flex-shrink-0 ${isWallet ? 'ml-2 p-1' : 'ml-3 p-1'} rounded-full hover:bg-yellow-400 transition-colors`}
              >
                <X className={`${isWallet ? 'h-3 w-3' : 'h-4 w-4'} text-yellow-900`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
