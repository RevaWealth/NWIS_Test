"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, QrCode, ChevronDown, Users, Building2, MessageCircle } from "lucide-react"
import { Button } from "@/component/UI/button"
import { WalletButton } from "@/component/wallet-button"
import { ConnectKitButton } from "connectkit"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const navItems = [
    { name: "About", href: "#about", hasDropdown: true },
    { name: "Whitepaper", href: "/whitepaper" },
    { name: "Tokenomics", href: "/tokenomics" },
    { name: "Roadmap", href: "#roadmap" },
    { name: "Team", href: "#team" },
    { name: "FAQ", href: "#faq" },
  ]

  const aboutDropdownItems = [
    { name: "About NexusWealth Investment Solution", href: "/about/story", icon: Building2 },
    { name: "Our Team", href: "/about/team", icon: Users },
  ]

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsAboutDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsAboutDropdownOpen(false)
    }, 150) // 150ms delay before closing
  }

  const handleMobileConnect = () => {
    // For mobile, we'll use the WalletButton component's functionality
    setIsMenuOpen(false)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <nav role="navigation" className="w-full bg-sky-950 border-b border-gray-800 sticky top-0 inset-x-0 z-50">
      <div className="w-full px-4">
        <div className="flex justify-between items-center mx-1 w-full">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" aria-label="Go to homepage" className="flex items-center">
              <Image
                src="/images/NWIS.png"
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
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    ref={dropdownRef}
                  >
                    <button className="flex items-center space-x-1 text-gray-200 hover:text-white transition-colors py-2">
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {/* Dropdown Ribbon */}
                    {isAboutDropdownOpen && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        {/* Ribbon Header */}
                        <div className="bg-sky-950 text-white px-4 py-3 rounded-t-lg">
                          <h3 className="font-semibold text-lg">About NexusWealth</h3>
                          <p className="text-sky-200 text-sm">Discover our journey and team</p>
                        </div>
                        
                        {/* Dropdown Tabs */}
                        <div className="p-4 space-y-3">
                          {aboutDropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="block p-3 rounded-lg hover:bg-sky-50 transition-colors group"
                            >
                              <span className="text-gray-700 group-hover:text-sky-900 font-medium">
                                {dropdownItem.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                        
                        {/* Ribbon Footer with Contact Button */}
                        <div className="bg-gray-50 px-4 py-3 rounded-b-lg border-t border-gray-200">
                          <Link
                            href="/contact"
                            className="flex items-center justify-center space-x-2 w-full bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>Contact Us</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href={item.href} className="text-gray-200 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                )}
              </div>
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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-sky-950 border-t border-gray-800">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-gray-200 font-medium border-b border-gray-700">
                        {item.name}
                      </div>
                      {aboutDropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-6 py-2 text-gray-300 hover:text-white transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span>{dropdownItem.name}</span>
                        </Link>
                      ))}
                      <div className="px-6 py-2">
                        <Link
                          href="/contact"
                          className="flex items-center justify-center space-x-2 w-full bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Contact Us</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-200 hover:text-white block px-3 py-2 text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
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
