import Link from "next/link"
import { Facebook, Linkedin, X, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#070b14] py-12 border-t border-gray-800">
      <div className="container mx-auto px-4 text-center text-gray-400">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <div className="text-lg font-bold text-white">NexusWealth Investment Solutions</div>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-blue-400">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-blue-400">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-blue-400">
              Contact Us
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <X className="h-6 w-6 hover:text-blue-400" />
            </Link>
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-6 w-6 hover:text-blue-600" />
            </Link>
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <Facebook className="h-6 w-6 hover:text-blue-700" />
            </Link>
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <Youtube className="h-6 w-6 hover:text-red-600" />
            </Link>
          </div>
        </div>
        <p>&copy; {new Date().getFullYear()} NexusWealth Investment Solutions. All rights reserved.</p>
      </div>
    </footer>
  )
}
