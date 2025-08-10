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
            className="bg-gradient-to-r from-[#CFA238] to-[#A57E24] hover:brightness-110 text-white font-semibold py-3 transition-all duration-200"
          >
            {isConnected ? (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected") : "Connect Wallet"}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}
