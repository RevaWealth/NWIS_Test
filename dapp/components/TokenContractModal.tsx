"use client"

import { useState } from "react"
import { X, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/UI/button"
import { useToast } from "@/hooks/use-toast"

interface TokenContractModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TokenContractModal({ isOpen, onClose }: TokenContractModalProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  
  const contractAddress = "0x3E3A84C2bE12035c68b39A2748D42aAabA329455"
  const metamaskGuideUrl = "https://support.metamask.io/manage-crypto/tokens/how-to-display-tokens-in-metamask/"

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Token contract address copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0c1220] border border-gray-800 rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">Add NWIS Token to Wallet</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contract Address Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Token Contract Address
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                <code className="text-sm text-white break-all">
                  {contractAddress}
                </code>
              </div>
              <Button
                onClick={handleCopyAddress}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-700 p-1"
              >
                <Copy className="h-3 w-3" />
                {copied ? "Copied!" : ""}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <p className="text-gray-300 text-sm">
              To add NWIS token to your Wallet:
            </p>
            <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
              <li>Open your Wallet</li>
              <li>Click on "Import tokens"</li>
              <li>Paste the contract address above</li>
              <li>Click "Add Custom Token"</li>
            </ol>
          </div>

          {/* MetaMask Guide Link */}
          <div className="pt-4 border-t border-gray-800">
            <a
              href={metamaskGuideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#a57e24] hover:text-[#8a6919] transition-colors text-sm font-medium"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              MetaMask Custom Token Guide
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-800">
          <Button
            onClick={onClose}
            className="bg-[#a57e24] hover:bg-[#8a671d] text-white"
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  )
}
