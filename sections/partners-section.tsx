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
    { name: "Etherscan", logo: "/images/Etherscan.jpeg", url: "https://etherscan.io/token/0x3e3a84c2be12035c68b39a2748d42aaaba329455" },
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
  const itemsPerSlide = isMobile ? 2 : 3
  const totalSlides = isMobile ? Math.ceil(partners.length / 2) : Math.ceil(partners.length / 3)

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
      // Desktop: show 3 items per slide with sliding
      const startIndex = currentSlide * 3
      const endIndex = startIndex + 3
      return partners.slice(startIndex, endIndex)
    }
  }

  return (
    <section id="partners" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-white mb-12">Our Valued Partners</h2>
        
        {/* Sliding Partners Container */}
        <div className="relative">
          {/* Navigation Buttons - Always visible like Key Features */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={totalSlides <= 1}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={totalSlides <= 1}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Partners Grid */}
          <div 
            ref={containerRef}
            className={`${isMobile ? 'mx-12' : 'mx-12 sm:mx-16'}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className={`grid gap-6 items-center justify-center ${
              isMobile ? 'grid-cols-2' : 'grid-cols-3'
            }`}>
              {getCurrentPartners().map((partner, index) => {
                // Calculate the actual partner index for proper key
                const actualIndex = isMobile ? currentSlide * 2 + index : currentSlide * 3 + index
                return (
                  <div
                    key={actualIndex}
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
                )
              })}
            </div>
          </div>
        </div>

        {/* Slide Indicators - Always visible like Key Features */}
        {totalSlides > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => {
              const isActive = index === currentSlide
              return (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-200 rounded-full ${
                    isActive 
                      ? 'w-12 h-3 bg-white'
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-200'
                  }`}
                />
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
