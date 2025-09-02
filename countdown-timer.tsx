"use client"
import { useEffect, useState } from "react"
import type { JSX } from "react" // Declare JSX variable

export default function CountdownTimer() {
  const calculateTimeLeft = () => {
    const now = new Date()
    // Set target date to October 1st, 2025
    const targetDate = new Date('2025-10-01T00:00:00.000Z')
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

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearTimeout(timer)
  })

  const timerComponents: JSX.Element[] = []

  Object.keys(timeLeft).forEach((interval) => {
    const value = timeLeft[interval as keyof typeof timeLeft]
    timerComponents.push(
      <div key={interval} className="flex flex-col items-center">
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#a57e24]">{String(value).padStart(2, "0")}</span>
        <span className="text-xs sm:text-sm text-[#a57e24]">{interval.charAt(0).toUpperCase() + interval.slice(1)}</span>
      </div>,
    )
  })

  return (
    <div className="flex justify-center space-x-3 sm:space-x-4 md:space-x-6">
      {timerComponents.length ? timerComponents : <span className="text-[#a57e24]">ICO Started!</span>}
    </div>
  )
}
