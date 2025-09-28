import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { WalletProvider } from "../wallet-provider"
import { ErrorBoundary } from "../sections/error-boundary"
import { Toaster } from "@/component/UI/toaster"
import { ThemeProvider } from "../component/theme-provider"
import CookieConsent from "../components/CookieConsent"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NWIS Token Sale | NexusWealth Investment Solutions - Blockchain Investment Platform",
  description: "Join the NWIS token presale from NexusWealth Investment Solutions. Empowering individuals to build generational wealth through blockchain technology. Invest in real-world assets including agriculture, infrastructure, renewable energy, and real estate.",
  keywords: "NWIS, NWIS.io, NexusWealth Investment Solutions, blockchain investment, token sale, cryptocurrency, DeFi, real estate investment, agriculture investment, infrastructure investment, renewable energy investment, generational wealth, decentralized finance, token presale, smart contract, Ethereum, Sepolia, Web3 investment platform",
  authors: [{ name: "NexusWealth Investment Solutions Team" }],
  creator: "NexusWealth Investment Solutions",
  publisher: "NexusWealth Investment Solutions",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "NWIS Token Sale | NexusWealth Investment Solutions - Blockchain Investment Platform",
    description: "Join the NWIS token presale from NexusWealth Investment Solutions. Empowering individuals to build generational wealth through blockchain technology and real-world asset investments.",
    type: "website",
    siteName: "NexusWealth Investment Solutions",
    locale: "en_US",
    url: "https://nwis.io",
    images: [
      {
        url: "/images/NWISTDT.png",
        width: 1200,
        height: 630,
        alt: "NexusWealth Investment Solutions - NWIS Token Sale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NWIS Token Sale | NexusWealth Investment Solutions",
    description: "Join the NWIS token presale. Empowering individuals to build generational wealth through blockchain technology.",
    images: ["/images/NWISTDT.png"],
  },
  alternates: {
    canonical: "https://nwis.io",
  },
  category: "Finance",
  classification: "Investment Platform",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ]
  },
  manifest: "/site.webmanifest",
}

// Ensure device-width scaling and prevent automatic zoom that causes layout shifts on mobile
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#a57e24" />
        <meta name="msapplication-TileColor" content="#000000" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "NexusWealth Investment Solutions",
              "alternateName": "NWIS",
              "url": "https://nwis.io",
              "logo": "https://nwis.io/images/NWISTDT.png",
              "description": "Empowering Individuals to Build Generational Wealth through Blockchain. Revolutionizing real-world investment through decentralized innovation.",
              "foundingDate": "2024",
              "industry": "Financial Technology",
              "areaServed": "Worldwide",
              "sameAs": [
                "https://nwis.io"
              ],
              "offers": {
                "@type": "Offer",
                "name": "NWIS Token Sale",
                "description": "Join the NWIS token presale from NexusWealth Investment Solutions. Empowering individuals to build generational wealth through blockchain technology.",
                "category": "Cryptocurrency Token Sale",
                "availability": "https://schema.org/InStock",
                "price": "0.001",
                "priceCurrency": "USD"
              },
              "serviceType": [
                "Blockchain Investment Platform",
                "Token Sale",
                "Real Estate Investment",
                "Agriculture Investment",
                "Infrastructure Investment",
                "Renewable Energy Investment"
              ]
            })
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <WalletProvider>
            {/* Force light theme so background is always white */}
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
              {children}
              <Toaster />
              <CookieConsent />
            </ThemeProvider>
          </WalletProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
