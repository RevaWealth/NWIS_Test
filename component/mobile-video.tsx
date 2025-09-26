'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface MobileVideoProps {
  src: string
  poster: string
  alt: string
  className?: string
  width?: number
  height?: number
  fallbackImage: string
  fallbackAlt: string
}

export default function MobileVideo({
  src,
  poster,
  alt,
  className = "",
  width,
  height,
  fallbackImage,
  fallbackAlt
}: MobileVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoSupported, setIsVideoSupported] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
      setIsMobile(isMobileDevice)
    }

    checkMobile()

    // Check video support and ensure immediate loading
    const checkVideoSupport = () => {
      if (videoRef.current) {
        const video = videoRef.current
        
        // Set video to load immediately
        video.load()
        
        video.addEventListener('error', (e) => {
          console.error('Video loading error:', e)
          setIsVideoSupported(false)
        })
        
        video.addEventListener('loadstart', () => {
          console.log('Video load started:', src)
        })
        
        video.addEventListener('canplay', () => {
          console.log('Video can play:', src)
        })
        
        // Try to play video immediately
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // On mobile, if autoplay fails, still keep the video ready
            if (isMobile) {
              // Don't immediately fall back, let the video try to load
              setTimeout(() => {
                if (video.readyState < 2) { // HAVE_CURRENT_DATA
                  setIsVideoSupported(false)
                }
              }, 1000)
            }
          })
        }
      }
    }

    if (videoRef.current) {
      checkVideoSupport()
    }
  }, [isMobile])

  // On mobile, if video can't autoplay, show fallback image
  if (isMobile && !isVideoSupported) {
    return (
      <Image
        src={fallbackImage}
        alt={fallbackAlt}
        width={width}
        height={height}
        className={className}
        priority
      />
    )
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className={className}
      width={width}
      height={height}
      style={{ backgroundColor: 'transparent' }}
      onError={() => {
        console.error('Video element error for:', src)
        setIsVideoSupported(false)
      }}
      onLoadStart={() => console.log('Video load started for:', src)}
      onCanPlay={() => console.log('Video can play for:', src)}
    >
      <source src={src} type="video/mp4" />
      {/* Fallback image if video fails to load */}
      <Image
        src={fallbackImage}
        alt={fallbackAlt}
        width={width}
        height={height}
        className={className}
        priority
      />
    </video>
  )
}
