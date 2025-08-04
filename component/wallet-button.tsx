"use client"

import { ConnectKitButton } from "connectkit"
import { Button } from "@/component/UI/button"

export function WalletButton() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, hide, address, ensName, chain }) => {
        return (
          <Button
            onClick={show}
            className="bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-700 hover:to-purple-600 text-white font-semibold py-3"
          >
            {isConnected ? (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected") : "Connect Wallet"}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}
