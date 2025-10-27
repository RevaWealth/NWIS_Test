import { Play, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

export default function LearnMoreSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const videos = [
    {
      id: "video1",
      thumbnail: "https://img.youtube.com/vi/0boDI8BGmHM/maxresdefault.jpg", // YouTube thumbnail
      youtubeUrl: "https://www.youtube.com/watch?v=0boDI8BGmHM",
      duration: "5:30"
    },
    {
      id: "video2",
      thumbnail: "https://img.youtube.com/vi/x_8pkH8P7Eo/hqdefault.jpg",
      youtubeUrl: "https://youtu.be/x_8pkH8P7Eo",
      duration: "New Video"
    },
    {
      id: "video3", 
      thumbnail: "https://img.youtube.com/vi/example2/maxresdefault.jpg",
      youtubeUrl: "https://www.youtube.com/@NWIS-Foundation",
      duration: "7:15"
    },
    {
      id: "video4",
      thumbnail: "https://img.youtube.com/vi/example3/maxresdefault.jpg", 
      youtubeUrl: "https://www.youtube.com/@NWIS-Foundation",
      duration: "4:45"
    }
    // Video 5 and 6 are hidden for now
    // {
    //   id: "video5",
    //   thumbnail: "https://img.youtube.com/vi/example4/maxresdefault.jpg",
    //   youtubeUrl: "https://www.youtube.com/@NWIS-Foundation", 
    //   duration: "8:20"
    // },
    // {
    //   id: "video6",
    //   thumbnail: "https://img.youtube.com/vi/example5/maxresdefault.jpg",
    //   youtubeUrl: "https://www.youtube.com/@NWIS-Foundation",
    //   duration: "6:10"
    // },
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
  const totalSlides = isMobile ? videos.length : 2 // 2 slides for desktop (4 videos total, 3 per slide)

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

  // Get current videos to display with overlapping effect for desktop
  const getCurrentVideos = () => {
    if (isMobile) {
      // Mobile: show one item at a time
      return [videos[currentSlide]]
    } else {
      // Desktop: overlapping slides
      // Slide 1: videos 1-3 (indices 0-2)
      // Slide 2: videos 2-4 (indices 1-3) 
      // Slide 3: videos 3-5 (indices 2-4)
      // Slide 4: videos 4-6 (indices 3-5)
      const startIndex = currentSlide
      const endIndex = startIndex + 3
      return videos.slice(startIndex, endIndex)
    }
  }

  const handleVideoClick = (youtubeUrl: string) => {
    window.open(youtubeUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="learn-more" className="py-12 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-4 text-white">Learn More</h2>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Watch our educational videos to understand how NexusWealth is revolutionizing the asset management industry
        </p>
        
        {/* Sliding Videos Container */}
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

          {/* Videos Grid */}
          <div 
            ref={containerRef}
            className={`${isMobile ? 'mx-4' : 'mx-12 sm:mx-16'}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {getCurrentVideos().map((video, index) => {
                // Calculate the actual video index for proper key
                const actualIndex = isMobile ? currentSlide : currentSlide + index
                return (
                  <div
                    key={actualIndex}
                    className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden"
                    onClick={() => handleVideoClick(video.youtubeUrl)}
                  >
                    {/* Video Thumbnail */}
                    <div className="relative aspect-video bg-slate-700">
                      <Image
                        src={video.thumbnail}
                        alt="YouTube video thumbnail"
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to a placeholder if image doesn't exist
                          const target = e.target as HTMLImageElement
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzM0MTU1Ii8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+WW91VHViZTwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjYwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTlhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5WaWRlbzwvdGV4dD48L3N2Zz4='
                        }}
                      />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-200">
                        <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 transition-all duration-200 transform hover:scale-110">
                          <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
                        </div>
                      </div>
                      
                      {/* Duration Badge */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    
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
