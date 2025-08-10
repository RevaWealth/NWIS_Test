"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, QrCode } from "lucide-react"
import { WalletButton } from "./component/wallet-button"
import { Button } from "@/component/UI/button"
import * as ConnectKit from "connectkit"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "About", href: "#about" },
    { name: "Whitepaper", href: "/whitepaper" },
    { name: "Tokenomics", href: "#tokenomics" },
    { name: "Roadmap", href: "#roadmap" },
    { name: "Team", href: "#team" },
    { name: "FAQ", href: "#faq" },
  ]

  const handleMobileConnect = () => {
    ConnectKit.open({ initialConnectionMethod: "walletConnect" })
    setIsMenuOpen(false)
  }

  return (
    <nav role="navigation" className="w-full bg-[#2A3650] border-b border-gray-800 sticky top-0 inset-x-0 z-50">
      <div className="w-full px-4">
        <div className="flex justify-between items-center mx-1 w-full">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" aria-label="Go to homepage" className="flex items-center">
              <Image
                src="/images/nwis-logo.png"
                alt="NWIS logo"
                width={2048}
                height={448}
                priority
                className="w-[98px] md:w-[135px] lg:w-[158px] h-auto object-contain shrink-0"
                sizes="(max-width: 768px) 98px, (max-width: 1024px) 135px, 158px"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className="text-gray-200 hover:text-white transition-colors">
                {item.name}
              </Link>
            ))}
          </div>

          {/* Wallet Buttons for Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <WalletButton />
            <Button
              onClick={handleMobileConnect}
              className="bg-[#a57e24] hover:bg-[#8a671d] text-white font-semibold py-2 px-3 flex items-center gap-2 transition-colors duration-200"
              aria-label="Connect with Mobile Wallet (QR Code)"
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-200 hover:text-white"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#2A3650] border-t border-gray-800">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-200 hover:text-white block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                <WalletButton />
                <Button
                  onClick={handleMobileConnect}
                  className="w-full bg-[#a57e24] hover:bg-[#8a671d] text-white font-semibold py-2 flex items-center justify-center gap-2 transition-colors duration-200"
                  aria-label="Connect with Mobile Wallet (QR Code)"
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
