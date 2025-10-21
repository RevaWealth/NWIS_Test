"use client"

import { Button } from "@/component/UI/button"

export function WalletButton() {
  const handleLaunchApp = () => {
    window.open("https://App.nwis.io", "_blank")
  }

  return (
    <Button
      onClick={handleLaunchApp}
      className="bg-[#a57e24] hover:bg-[#8a671d] text-white font-semibold py-3 transition-colors duration-200"
    >
      Launch App
    </Button>
  )
}
