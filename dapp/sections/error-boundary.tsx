"use client"

import * as React from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-red-900 text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{"Oops! Something went wrong."}</h1>
            <p className="text-lg">{"We're sorry for the inconvenience. Please try again later."}</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
