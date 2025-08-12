"use client"
import { useEffect, useState } from "react"
import type { JSX } from "react" // Declare JSX variable

interface CountdownTimerProps {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer({
  days: initialDays,
  hours: initialHours,
  minutes: initialMinutes,
  seconds: initialSeconds,
}: CountdownTimerProps) {
  const calculateTimeLeft = () => {
    const now = new Date()
    // For demonstration, let's set a target date in the future
    // In a real app, this would come from a server or a fixed event date
    const targetDate = new Date(
      now.getTime() +
        initialDays * 24 * 60 * 60 * 1000 +
        initialHours * 60 * 60 * 1000 +
        initialMinutes * 60 * 1000 +
        initialSeconds * 1000,
    )
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
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{String(value).padStart(2, "0")}</span>
        <span className="text-xs sm:text-sm text-gray-400">{interval.charAt(0).toUpperCase() + interval.slice(1)}</span>
      </div>,
    )
  })

  return (
    <div className="flex justify-center space-x-3 sm:space-x-4 md:space-x-6">
      {timerComponents.length ? timerComponents : <span className="text-white">Time's up!</span>}
    </div>
  )
}
