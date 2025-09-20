/**
 * Utility functions for detecting and handling wallet browsers
 */

/**
 * Detects if the current browser is a wallet browser
 * Wallet browsers include MetaMask mobile, Trust Wallet, Coinbase Wallet, etc.
 */
export function isWalletBrowser(): boolean {
  if (typeof window === 'undefined') return false

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ''
  
  // Check for wallet browser indicators
  const walletIndicators = [
    'MetaMaskMobile', // MetaMask mobile browser
    'Trust', // Trust Wallet
    'CoinbaseWallet', // Coinbase Wallet
    'Rainbow', // Rainbow Wallet
    'Rabby', // Rabby Wallet
    'BraveWallet', // Brave Wallet
    'WalletConnect', // WalletConnect browsers
    'imToken', // imToken wallet
    'TokenPocket', // TokenPocket wallet
    'SafePal', // SafePal wallet
    'BitKeep', // BitKeep wallet
    'MathWallet', // Math Wallet
    'Phantom', // Phantom wallet (Solana)
  ]

  // Check user agent for wallet indicators
  const isWalletUserAgent = walletIndicators.some(indicator => 
    userAgent.toLowerCase().includes(indicator.toLowerCase())
  )

  // Check for Web3 provider injection (common in wallet browsers)
  const hasWeb3Provider = !!(window as any).ethereum || !!(window as any).web3

  // Check for specific wallet window properties
  const hasWalletProperties = !!(window as any).ethereum?.isMetaMask || 
                             !!(window as any).ethereum?.isTrust ||
                             !!(window as any).ethereum?.isCoinbaseWallet ||
                             !!(window as any).ethereum?.isRabby

  // Check if we're in a WebView (many wallet browsers use WebView)
  const isWebView = /wv|WebView/.test(userAgent)

  // Check for reduced functionality (common in wallet browsers)
  const hasReducedFeatures = !window.localStorage || 
                             typeof window.localStorage.setItem !== 'function' ||
                             typeof window.IndexedDB === 'undefined'

  // Only consider it a wallet browser if it's a mobile device OR has wallet user agent OR is a WebView
  // Desktop browsers with wallet extensions should not be considered wallet browsers
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
  
  return isWalletUserAgent || (isMobile && hasWeb3Provider && (hasWalletProperties || isWebView || hasReducedFeatures))
}

/**
 * Detects if the current browser is a mobile device (including wallet browsers)
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ''
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
  
  return isMobile || window.innerWidth < 768
}

/**
 * Detects if the current browser is a mobile wallet browser specifically
 */
export function isMobileWalletBrowser(): boolean {
  return isMobileDevice() && isWalletBrowser()
}

/**
 * Detects if the current browser is a desktop wallet browser
 */
export function isDesktopWalletBrowser(): boolean {
  return !isMobileDevice() && isWalletBrowser()
}

/**
 * Gets the optimal dialog configuration for the current browser type
 */
export function getDialogConfig() {
  const isWallet = isWalletBrowser()
  const isMobile = isMobileDevice()
  
  return {
    maxHeight: isWallet ? '90vh' : isMobile ? '95vh' : '85vh',
    maxWidth: isWallet ? '95vw' : isMobile ? '95vw' : '4xl',
    margin: isWallet ? '0.5rem' : isMobile ? '0.5rem' : '0',
    padding: isWallet ? '1rem' : isMobile ? '1rem' : '1.5rem',
    zIndex: isWallet ? 80 : 50,
    scrollable: isWallet, // Force scrollable in wallet browsers
    backdrop: isWallet ? true : true, // Always show backdrop in wallet browsers
    closeOnBackdrop: !isWallet, // Prevent accidental closes in wallet browsers
  }
}

/**
 * Gets the optimal banner configuration for the current browser type
 */
export function getBannerConfig() {
  const isWallet = isWalletBrowser()
  const isMobile = isMobileDevice()
  
  return {
    zIndex: isWallet ? 90 : 70,
    bottom: isWallet ? '1rem' : isMobile ? '5rem' : '2rem',
    maxWidth: isWallet ? '90vw' : isMobile ? '95vw' : 'auto',
    margin: isWallet ? '0.5rem' : '0',
  }
}
