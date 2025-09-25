"use client"

import { useState, useEffect } from 'react'

interface TypewriterProps {
  text: string
  speed?: number
  delay?: number
  className?: string
  loopDelay?: number
}

export default function Typewriter({ 
  text, 
  speed = 100, 
  delay = 1000, 
  className = "",
  loopDelay = 5000
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, currentIndex === 0 ? delay : speed)

      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, text, speed, delay])

  // Loop effect - restart after completion
  useEffect(() => {
    if (isComplete) {
      const loopTimeout = setTimeout(() => {
        setDisplayedText('')
        setCurrentIndex(0)
        setIsComplete(false)
      }, loopDelay)

      return () => clearTimeout(loopTimeout)
    }
  }, [isComplete, loopDelay])

  return (
    <span className={`inline-block ${className}`}>
      {displayedText}
    </span>
  )
}
