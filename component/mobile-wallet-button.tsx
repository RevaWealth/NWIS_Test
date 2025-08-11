"use client"

import { useState, useEffect } from "react"
import { Button } from "@/component/UI/button"
import { QrCode, X } from "lucide-react"
import { ConnectKitButton } from "connectkit"
import QRCode from "qrcode"

export function MobileWalletButton({ onConnect }: { onConnect?: () => void } = {}) {
  const [showQRModal, setShowQRModal] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")

  // Generate WalletConnect QR code when modal opens
  useEffect(() => {
    if (showQRModal) {
      generateWalletConnectQR()
    }
  }, [showQRModal])

  const generateWalletConnectQR = async () => {
    try {
      // Create a WalletConnect URI for mobile connection
      const walletConnectURI = `wc:${generateRandomId()}@1?bridge=https://bridge.walletconnect.org&key=${generateRandomKey()}`
      
      // Generate QR code
      const qrCode = await QRCode.toDataURL(walletConnectURI, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        }
      })
      
      setQrCodeDataUrl(qrCode)
    } catch (error) {
      console.error("Failed to generate QR code:", error)
    }
  }

  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 15)
  }

  const generateRandomKey = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  const handleMobileConnect = () => {
    setShowQRModal(true)
    // Call the callback to close mobile menu if provided
    if (onConnect) {
      onConnect()
    }
  }

  return (
    <>
      <Button
        onClick={handleMobileConnect}
        className="bg-[#a57e24] hover:bg-[#8a671d] text-white font-semibold py-2 px-3 flex items-center justify-center transition-colors duration-200"
        aria-label="Connect with Mobile Wallet (QR Code)"
      >
        <QrCode className="h-4 w-4" />
      </Button>

      {/* Custom QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Mobile Wallet Connection</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Scan this QR code with your mobile wallet app to connect
              </p>
              
              {/* Actual QR Code */}
              {qrCodeDataUrl ? (
                <div className="mb-4">
                  <img 
                    src={qrCodeDataUrl} 
                    alt="WalletConnect QR Code" 
                    className="w-48 h-48 mx-auto border border-gray-200 rounded-lg"
                  />
                </div>
              ) : (
                <div className="bg-gray-100 w-48 h-48 mx-auto mb-4 flex items-center justify-center rounded-lg">
                  <QrCode className="h-24 w-24 text-gray-400" />
                  <p className="text-gray-500 text-sm">Generating QR...</p>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mb-4">
                Supported apps: MetaMask Mobile, Trust Wallet, Rainbow, etc.
              </p>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowQRModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Close
                </Button>
                <ConnectKitButton.Custom>
                  {({ show }) => (
                    <Button
                      onClick={() => {
                        setShowQRModal(false)
                        if (show) show()
                      }}
                      className="flex-1 bg-[#a57e24] hover:bg-[#8a671d] text-white"
                    >
                      Open Full Modal
                    </Button>
                  )}
                </ConnectKitButton.Custom>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
