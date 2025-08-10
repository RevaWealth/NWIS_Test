"use client"

import { ConnectKitButton } from "connectkit"
import { Button } from "@/component/UI/button"

export function WalletButton() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address }) => {
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
