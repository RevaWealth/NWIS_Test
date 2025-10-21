import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function PartnersSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const partners = [
    { name: "Certik Skynet", logo: "/images/Certik.JPG", url: "https://skynet.certik.com/projects/nwis" },
    { name: "CoinMarketCap", logo: "/images/CMC.JPEG" },
    { name: "CoinTelegraph", logo: "/images/CT.png" },
    { name: "CoinGecko", logo: "/images/CG2.jpg" },
    { name: "Partner 5", logo: "/placeholder.svg?height=80&width=150" },
    { name: "Partner 6", logo: "/placeholder.svg?height=80&width=150" },
  ]

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Calculate items per slide
  const itemsPerSlide = isMobile ? 2 : 6
  const totalSlides = isMobile ? Math.ceil(partners.length / 2) : 1

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  // Touch handling functions
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) return
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!isMobile || !touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  // Get current partners to display
  const getCurrentPartners = () => {
    if (isMobile) {
      // Mobile: show 2 items per slide
      const startIndex = currentSlide * 2
      const endIndex = startIndex + 2
      return partners.slice(startIndex, endIndex)
    } else {
      // Desktop: show all partners
      return partners
    }
  }

  return (
    <section id="partners" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-white mb-12">Our Valued Partners</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-center">
          {partners.map((partner, index) => (
                <div
                  key={index}
                  className="flex justify-center items-center p-1 bg-black rounded-2xl aspect-square w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32"
                >
                  {partner.url ? (
                    <Link href={partner.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                      <div className="w-full h-full rounded-xl overflow-hidden">
                        <Image
                          src={partner.logo || "/placeholder.svg"}
                          alt={partner.name}
                          width={250}
                          height={250}
                          className="object-cover transition-all duration-300 cursor-pointer w-full h-full"
                        />
                      </div>
                    </Link>
                  ) : (
                    <div className="w-full h-full rounded-xl overflow-hidden">
                      <Image
                        src={partner.logo || "/placeholder.svg"}
                        alt={partner.name}
                        width={250}
                        height={250}
                        className="object-cover transition-all duration-300 w-full h-full"
                      />
                    </div>
                  )}
                </div>
          ))}
        </div>
      </div>
    </section>
  )
}
