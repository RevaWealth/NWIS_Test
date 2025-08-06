"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, QrCode } from 'lucide-react'
import { WalletButton } from "./component/wallet-button"
import { Button } from "@/component/UI/button"
import * as ConnectKit from "connectkit" // Import ConnectKit for global access to its methods

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
    { name: "Tokenomics", href: "#tokenomics" },
    { name: "Roadmap", href: "#roadmap" },
    { name: "Team", href: "#team" },
    { name: "FAQ", href: "#faq" },
  ]

  const handleMobileConnect = () => {
    // Use ConnectKit.open() which is made available by ConnectKitProvider
    ConnectKit.open({ initialConnectionMethod: "walletConnect" })
    setIsMenuOpen(false) // Close mobile menu after clicking
  }

  return (
    <nav className="bg-[#2A3650] border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mx-1 h-[Auto] w-[Auto] leading-7">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/images/nexuswealth-logo-v2.jpg"
                alt="NexusWealth Investment Solutions Logo"
                width={150} // Adjusted width
                height={35} // Adjusted height
                className="h-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className="text-gray-300 hover:text-white transition-colors">
                {item.name}
              </Link>
            ))}
          </div>

          {/* Wallet Buttons for Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <WalletButton />
            <Button
              onClick={handleMobileConnect}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 flex items-center gap-2"
              aria-label="Connect with Mobile Wallet (QR Code)" // Added for accessibility
            >
              <QrCode className="h-4 w-4" />
              {/* Removed "Mobile Wallet" text */}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
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
                  className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                <WalletButton />
                <Button
                  onClick={handleMobileConnect}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 flex items-center justify-center gap-2"
                  aria-label="Connect with Mobile Wallet (QR Code)" // Added for accessibility
                >
                  <QrCode className="h-4 w-4" />
                  {/* Removed "Connect Mobile Wallet" text */}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
