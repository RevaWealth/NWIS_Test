import { Gem, ShieldCheck, DollarSign, Globe, Zap, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"

export default function FeaturesSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const features = [
    {
      icon: <Gem className="h-8 w-8 text-purple-500" />,
      title: "Tokenized Real-World Assets",
      description: "Invest in fractionalized real estate, commodities, and more, all on the blockchain.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-blue-600" />,
      title: "Enhanced Security",
      description: "Leveraging blockchain's immutability and cryptographic security for your investments.",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      title: "Passive Income Streams",
      description: "Earn returns from real-world assets, distributed directly to your digital wallet.",
    },
    {
      icon: <Globe className="h-8 w-8 text-orange-600" />,
      title: "Global Accessibility",
      description: "Democratizing investment opportunities for everyone, everywhere.",
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Instant Liquidity",
      description: "Trade your tokenized assets on secondary markets with ease.",
    },
    {
      icon: <Eye className="h-8 w-8 text-red-600" />,
      title: "Transparent & Auditable",
      description: "All transactions are recorded on the blockchain, ensuring full transparency.",
    },
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
  const itemsPerSlide = isMobile ? 1 : 3
  const totalSlides = isMobile ? features.length : 4 // 4 slides for desktop with overlapping effect

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

  // Get current features to display with overlapping effect for desktop
  const getCurrentFeatures = () => {
    if (isMobile) {
      // Mobile: show one item at a time
      return [features[currentSlide]]
    } else {
      // Desktop: overlapping slides
      // Slide 1: boxes 1-3 (indices 0-2)
      // Slide 2: boxes 2-4 (indices 1-3) 
      // Slide 3: boxes 3-5 (indices 2-4)
      // Slide 4: boxes 4-6 (indices 3-5)
      const startIndex = currentSlide
      const endIndex = startIndex + 3
      return features.slice(startIndex, endIndex)
    }
  }

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-12 text-white">Key Features</h2>
        
        {/* Sliding Features Container */}
        <div className="relative">
          {/* Navigation Buttons - Always visible */}
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

          {/* Features Grid */}
          <div 
            ref={containerRef}
            className={`${isMobile ? 'mx-4' : 'mx-12 sm:mx-16'}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {getCurrentFeatures().map((feature, index) => {
                // Calculate the actual feature index for proper key
                const actualIndex = isMobile ? currentSlide : currentSlide + index
                return (
                <div
                  key={actualIndex}
                  className="bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-lg flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <div className="mb-4 p-3 rounded-full bg-slate-700 relative z-10">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Slide Indicators - Desktop Only */}
        {!isMobile && (
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
