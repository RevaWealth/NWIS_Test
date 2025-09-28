"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView, trackEvent, trackInteraction, trackConversion, initializeUserTracking, getTrackingData } from '@/lib/cookie-utils'

export function useTracking() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view when pathname changes
    trackPageView(pathname)
  }, [pathname])

  return {
    trackEvent,
    trackInteraction,
    trackConversion,
    getTrackingData
  }
}

// Hook for tracking user interactions
export function useInteractionTracking() {
  const { trackInteraction } = useTracking()

  const trackClick = (element: string, value?: any) => {
    trackInteraction('click', element, value)
  }

  const trackFormSubmit = (formName: string, data?: any) => {
    trackInteraction('form_submit', formName, data)
  }

  const trackButtonClick = (buttonName: string, location?: string) => {
    trackInteraction('button_click', buttonName, location)
  }

  const trackLinkClick = (linkText: string, destination: string) => {
    trackInteraction('link_click', linkText, destination)
  }

  const trackScroll = (percentage: number) => {
    trackInteraction('scroll', 'page', percentage)
  }

  const trackTimeOnPage = (timeInSeconds: number) => {
    trackInteraction('time_on_page', 'page', timeInSeconds)
  }

  return {
    trackClick,
    trackFormSubmit,
    trackButtonClick,
    trackLinkClick,
    trackScroll,
    trackTimeOnPage
  }
}

// Hook for tracking conversions
export function useConversionTracking() {
  const { trackConversion } = useTracking()

  const trackTokenPurchase = (amount: number, currency: string = 'ETH') => {
    trackConversion('token_purchase', amount, currency)
  }

  const trackWalletConnection = (walletType: string) => {
    trackConversion('wallet_connection', undefined, walletType)
  }

  const trackEmailSignup = (email: string) => {
    trackConversion('email_signup', undefined, email)
  }

  const trackDocumentDownload = (documentName: string) => {
    trackConversion('document_download', undefined, documentName)
  }

  return {
    trackTokenPurchase,
    trackWalletConnection,
    trackEmailSignup,
    trackDocumentDownload
  }
}

// Initialize tracking on app start
export function useInitializeTracking() {
  useEffect(() => {
    // Check if user has consented to cookies
    const consent = localStorage.getItem('cookie-consent')
    if (consent) {
      const preferences = JSON.parse(consent)
      initializeUserTracking(preferences)
    }
  }, [])
}
