// Cookie utility functions for tracking and analytics

export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

export interface UserTrackingData {
  userId?: string
  sessionId: string
  pageViews: number
  timeOnSite: number
  referrer?: string
  userAgent?: string
  timestamp: number
}

// Initialize user tracking
export const initializeUserTracking = (preferences: CookiePreferences) => {
  if (typeof window === 'undefined') return

  // Generate or retrieve user ID
  let userId = localStorage.getItem('user-id')
  if (!userId) {
    userId = generateUserId()
    localStorage.setItem('user-id', userId)
  }

  // Generate session ID
  const sessionId = generateSessionId()
  sessionStorage.setItem('session-id', sessionId)

  // Initialize tracking data
  const trackingData: UserTrackingData = {
    userId,
    sessionId,
    pageViews: 1,
    timeOnSite: 0,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    timestamp: Date.now()
  }

  // Store tracking data
  sessionStorage.setItem('tracking-data', JSON.stringify(trackingData))

  // Start time tracking
  startTimeTracking()

  // Initialize analytics if enabled
  if (preferences.analytics) {
    initializeAnalytics()
  }

  // Initialize marketing tracking if enabled
  if (preferences.marketing) {
    initializeMarketingTracking()
  }
}

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (typeof window === 'undefined') return

  const trackingData = getTrackingData()
  if (!trackingData) return

  trackingData.pageViews += 1
  trackingData.timestamp = Date.now()
  
  sessionStorage.setItem('tracking-data', JSON.stringify(trackingData))

  // Send to analytics if enabled
  if (window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX', {
      page_path: path,
      page_title: title
    })
  }

  // Track custom events
  trackEvent('page_view', {
    page_path: path,
    page_title: title,
    user_id: trackingData.userId,
    session_id: trackingData.sessionId
  })
}

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window === 'undefined') return

  const trackingData = getTrackingData()
  if (!trackingData) return

  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      user_id: trackingData.userId,
      session_id: trackingData.sessionId
    })
  }

  // Store event locally for analytics
  const events = JSON.parse(localStorage.getItem('tracking-events') || '[]')
  events.push({
    event: eventName,
    parameters,
    timestamp: Date.now(),
    userId: trackingData.userId,
    sessionId: trackingData.sessionId
  })
  
  // Keep only last 100 events
  if (events.length > 100) {
    events.splice(0, events.length - 100)
  }
  
  localStorage.setItem('tracking-events', JSON.stringify(events))
}

// Track user interactions
export const trackInteraction = (interactionType: string, element?: string, value?: any) => {
  trackEvent('user_interaction', {
    interaction_type: interactionType,
    element: element,
    value: value
  })
}

// Track conversion events
export const trackConversion = (conversionType: string, value?: number, currency?: string) => {
  trackEvent('conversion', {
    conversion_type: conversionType,
    value: value,
    currency: currency
  })

  // Send to Google Analytics Enhanced Ecommerce
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: generateTransactionId(),
      value: value,
      currency: currency
    })
  }
}

// Get current tracking data
export const getTrackingData = (): UserTrackingData | null => {
  if (typeof window === 'undefined') return null
  
  const data = sessionStorage.getItem('tracking-data')
  return data ? JSON.parse(data) : null
}

// Get user analytics data
export const getUserAnalytics = () => {
  if (typeof window === 'undefined') return null

  const events = JSON.parse(localStorage.getItem('tracking-events') || '[]')
  const trackingData = getTrackingData()
  
  return {
    user: trackingData,
    events: events,
    totalEvents: events.length,
    sessionDuration: trackingData ? Date.now() - trackingData.timestamp : 0
  }
}

// Start time tracking
const startTimeTracking = () => {
  const startTime = Date.now()
  
  // Update time on site every 30 seconds
  const interval = setInterval(() => {
    const trackingData = getTrackingData()
    if (trackingData) {
      trackingData.timeOnSite = Date.now() - startTime
      sessionStorage.setItem('tracking-data', JSON.stringify(trackingData))
    }
  }, 30000)

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(interval)
  })
}

// Initialize Google Analytics
const initializeAnalytics = () => {
  if (typeof window === 'undefined') return

  // Load Google Analytics script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'}`
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }
  
  gtag('js', new Date())
  gtag('config', process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX', {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
    send_page_view: false // We'll send page views manually
  })

  window.gtag = gtag
}

// Initialize marketing tracking
const initializeMarketingTracking = () => {
  if (typeof window === 'undefined') return

  // Add Facebook Pixel
  if (process.env.NEXT_PUBLIC_FB_PIXEL_ID) {
    const script = document.createElement('script')
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
      fbq('track', 'PageView');
    `
    document.head.appendChild(script)
  }

  // Add other marketing pixels here
}

// Utility functions
const generateUserId = (): string => {
  return 'user_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

const generateSessionId = (): string => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
}

const generateTransactionId = (): string => {
  return 'txn_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
}

// Declare global types
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
    fbq: (...args: any[]) => void
  }
}
