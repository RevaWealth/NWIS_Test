import Link from "next/link"
import Image from "next/image"
import { Facebook, Linkedin, X, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#070b14] py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two horizontal sections */}
        <div className="flex flex-col lg:flex-row">
          {/* Left Section - Logo and Description */}
          <div className="flex-1 pr-0 lg:pr-8 mb-8 lg:mb-0">
            {/* Logo */}
            <div className="mb-1">
              <Link href="/" className="inline-block" aria-label="Go to homepage">
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
            
            {/* Description Text */}
            <div className="text-gray-400 text-md leading-relaxed">
              <p>
                NexusWealth's purpose is to help more and more people experience financial well-being. As a fiduciary to investors and a provider of financial technology, we plan to help millions of people, alll around the world, build savings that serve them throughout their lives by making investing easier and more affordable. For additional information on NexusWealth, please visit our{' '}
                <Link href="/documents" className="text-blue-400 hover:text-blue-300 underline">
                  Whitepaper
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Vertical divider line */}
          <div className="hidden lg:block w-px bg-white mx-8"></div>

          {/* Right Section - Links and Social Media */}
          <div className="flex-1 pl-0 lg:pl-8 mt-8 lg:mt-0">
            {/* Navigation Links - 4 Columns */}
            <div className="grid grid-cols-5 gap-x-16 gap-y-4 w-full">
              {/* Column 1 - Double Width */}
              <div className="col-span-2 flex flex-col space-y-4">
                <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Cookie Notice
                </Link>
                <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Manage Cookies
                </Link>
                  <Link href="/privacy-policy" className="text-gray-400 hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms-and-conditions" className="text-gray-400 hover:text-blue-400 transition-colors">
                    Terms and Conditions
                  </Link>
              </div>
              
              {/* Column 2 */}
              <div className="flex flex-col space-y-4">
                <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Careers
                </Link>
                <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  About us
                </Link>
              </div>
              
              {/* Column 3 */}
              <div className="flex flex-col space-y-4">
                <Link href="/contact" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </div>
              
              {/* Column 4 - Social Media Links */}
              <div className="flex flex-col space-y-4">
                <Link href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <X className="h-6 w-6" />
                </Link>
                <Link href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Linkedin className="h-6 w-6" />
                </Link>
                <Link href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors">
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">
                  <Youtube className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
