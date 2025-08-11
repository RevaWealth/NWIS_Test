"use client"

import { ConnectKitButton } from "connectkit"
import { Button } from "@/component/UI/button"
import { useState } from "react"

export function WalletButton() {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <Button
        onClick={() => setHasError(false)}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 transition-colors duration-200"
      >
        Retry Connection
      </Button>
    )
  }

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address, error }) => {
        // Handle any connection errors
        if (error && !hasError) {
          console.warn("Wallet connection error:", error)
          setHasError(true)
        }

        return (
          <Button
            onClick={show}
            className="bg-[#a57e24] hover:bg-[#8a671d] text-white font-semibold py-3 transition-colors duration-200"
          >
            {isConnected ? (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected") : "Connect Wallet"}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}
