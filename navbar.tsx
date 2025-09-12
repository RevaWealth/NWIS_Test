"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown, Users, Building2, MessageCircle } from "lucide-react"
import { Button } from "@/component/UI/button"
import { WalletButton } from "@/component/wallet-button"
import { MobileWalletButton } from "@/component/mobile-wallet-button"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const navItems = [
    { name: "Dashboard", href: "/token-purchase" },
    { name: "About", href: "#about", hasDropdown: true },
    { name: "Documents", href: "/whitepaper" },
    { name: "Tokenomics", href: "/tokenomics" },
    { name: "Roadmap", href: "/#roadmap" },
    { name: "FAQ", href: "/#faq" },
  ]

  const aboutDropdownItems = [
    { name: "About NexusWealth Investment Solution", href: "/about/story", icon: Building2 },
    { name: "Our Team", href: "/about/story?tab=leadership", icon: Users },
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
    }, 150)
  }

  const handleMobileConnect = () => {
    setIsMenuOpen(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <nav className="w-full bg-sky-950 border-b border-gray-800 sticky top-0 inset-x-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center" aria-label="Go to homepage">
              <Image
                src="/images/NWIS.png"
                alt="NWIS logo"
                width={158}
                height={35}
                priority
                className="w-24 md:w-32 lg:w-36 h-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    ref={dropdownRef}
                  >
                    <button className="flex items-center space-x-1 text-white hover:text-sky-200 transition-colors duration-200 font-medium px-3 py-2">
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {/* Enhanced Dropdown */}
                    {isAboutDropdownOpen && (
                      <div 
                        className="absolute top-full left-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        {/* Dropdown Header */}
                        <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white px-6 py-4">
                          <h3 className="font-semibold text-lg">About NexusWealth</h3>
                          <p className="text-sky-100 text-sm mt-1">Discover our journey and team</p>
                        </div>
                        
                        {/* Dropdown Items */}
                        <div className="p-4 space-y-2">
                          {aboutDropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                            >
                              <dropdownItem.icon className="h-5 w-5 text-gray-400 group-hover:text-sky-600" />
                              <span className="text-gray-700 group-hover:text-sky-900 font-medium">
                                {dropdownItem.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                        
                        {/* Dropdown Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                          <Link
                            href="/contact"
                            className="flex items-center justify-center space-x-2 w-full bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>Contact Us</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link 
                    href={item.href} 
                    className="text-white hover:text-sky-200 transition-colors duration-200 font-medium px-3 py-2 block"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Wallet Buttons */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex">
              <WalletButton />
            </div>
            <div className="md:hidden">
              <MobileWalletButton />
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-sky-900 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700 bg-sky-950">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div className="space-y-3">
                      <div className="px-3 py-2 text-white font-semibold text-base border-b border-gray-700">
                        {item.name}
                      </div>
                      {aboutDropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="flex items-center space-x-3 px-6 py-3 text-sky-200 hover:text-white transition-colors text-sm"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <dropdownItem.icon className="h-4 w-4" />
                          <span>{dropdownItem.name}</span>
                        </Link>
                      ))}
                      <div className="px-6 py-3">
                        <Link
                          href="/contact"
                          className="flex items-center justify-center space-x-2 w-full bg-sky-600 hover:bg-sky-700 text-white px-4 py-3 rounded-lg transition-colors font-medium text-sm"
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
                      className="text-sky-200 hover:text-white block px-3 py-3 text-base font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobile Wallet Button */}
              <div className="pt-4 border-t border-gray-700">
                <div className="px-3">
                  <WalletButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
