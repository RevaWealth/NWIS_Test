"use client"
import { useEffect, useState } from "react"
import type { JSX } from "react" // Declare JSX variable

export default function CountdownTimer() {
  const calculateTimeLeft = () => {
    const now = new Date()
    // Set target date to October 22nd, 2025 at 8:00 AM PST (16:00:00 UTC)
    const targetDate = new Date('2025-10-22T16:00:00.000Z')
    const difference = +targetDate - +now

    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  // Initialize with default values to prevent hydration mismatch
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set client flag and initial time calculation
    setIsClient(true)
    setTimeLeft(calculateTimeLeft())

    // Set up timer interval
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Check if countdown has reached zero
  const isCountdownOver = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  const timerComponents: JSX.Element[] = []

  Object.keys(timeLeft).forEach((interval) => {
    const value = timeLeft[interval as keyof typeof timeLeft]
    timerComponents.push(
      <div key={interval} className="flex flex-col items-center">
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{String(value).padStart(2, "0")}</span>
        <span className="text-xs sm:text-sm text-white">{interval.charAt(0).toUpperCase() + interval.slice(1)}</span>
      </div>,
    )
  })

  // Show loading state during hydration to prevent mismatch
  if (!isClient) {
    return (
      <div className="flex justify-center space-x-3 sm:space-x-4 md:space-x-6">
        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">--</span>
          <span className="text-xs sm:text-sm text-white">Days</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">--</span>
          <span className="text-xs sm:text-sm text-white">Hours</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">--</span>
          <span className="text-xs sm:text-sm text-white">Minutes</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">--</span>
          <span className="text-xs sm:text-sm text-white">Seconds</span>
        </div>
      </div>
    )
  }

  // If countdown is over, show red "NWIS Presale is Live NOW!" message
  if (isCountdownOver) {
    return (
      <div className="flex justify-center">
        <span className="text-lg sm:text-xl md:text-2xl font-bold text-red-600 animate-pulse">
          NWIS Presale is Live NOW!
        </span>
      </div>
    )
  }

  return (
    <div className="flex justify-center space-x-3 sm:space-x-4 md:space-x-6">
      {timerComponents}
    </div>
  )
}
