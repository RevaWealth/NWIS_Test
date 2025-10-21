"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/UI/button"
import { WalletButton } from "@/components/wallet-button"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "Buy NWIS Tokens", href: "https://App.nwis.io" },
    { name: "Stake", href: "/stake" },
        { name: "Governance", href: "/governance" },
    { name: "Finance", href: "/finance" },
  ]



  return (
    <nav className="w-full bg-[#000000] border-b border-gray-800 sticky top-0 inset-x-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="https://nwis.io" className="flex items-center" aria-label="Go to homepage">
              <Image
                src="/images/NWISLogo.svg"
                alt="NWIS logo"
                width={178}
                height={95}
                priority
                className="w-32 md:w-40 lg:w-48 h-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                <Link 
                  href={item.href} 
                  className={`transition-colors duration-200 font-medium px-3 py-2 block ${
                    item.name === "Buy NWIS Tokens" 
                      ? "text-[#a57e24] hover:text-[#8a6919]" 
                      : "text-white hover:text-sky-200"
                  }`}
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Wallet Button */}
          <div className="flex items-center space-x-3">
            <div className="flex">
              <WalletButton />
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#000000] transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700 bg-[#000000]">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={`block px-3 py-3 text-base font-medium transition-colors ${
                      item.name === "Buy NWIS Tokens" 
                        ? "text-[#a57e24] hover:text-[#8a6919]" 
                        : "text-sky-200 hover:text-white"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
              
                  {/* Mobile Buy NWIS Token Button */}
                  <div className="pt-4 border-t border-gray-700">
                    <div className="px-3">
                      <Link
                        href="https://App.nwis.io"
                        className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-[#a57e24] hover:bg-[#8a671d] text-white font-semibold text-sm sm:text-base rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Buy NWIS Token
                      </Link>
                    </div>
                  </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
