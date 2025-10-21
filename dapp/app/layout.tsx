import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "../components/wallet-provider"
import { ErrorBoundary } from "../sections/error-boundary"
import { Toaster } from "@/components/UI/toaster"
import { ThemeProvider } from "@/components/UI/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NWIS Token Sale | NexusWealth DApp",
  description: "Purchase NWIS tokens through our secure blockchain-powered platform. Empowering individuals to build generational wealth through blockchain technology.",
  keywords: "NWIS, token sale, Web3, DeFi, NexusWealth, cryptocurrency, blockchain investment",
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
    title: "NWIS Token Sale | NexusWealth DApp",
    description: "Purchase NWIS tokens through our secure blockchain-powered platform",
    type: "website",
    siteName: "NexusWealth DApp",
    locale: "en_US",
    url: "https://app.nwis.io",
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
    title: "NWIS Token Sale | NexusWealth DApp",
    description: "Purchase NWIS tokens through our secure blockchain-powered platform",
    images: ["/images/NWISTDT.png"],
  },
  alternates: {
    canonical: "https://app.nwis.io",
  },
  category: "Finance",
  classification: "Web3 Application",
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
  },
}

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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#a57e24" />
        <meta name="msapplication-TileColor" content="#000000" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "NexusWealth DApp",
              "applicationCategory": "FinanceApplication",
              "url": "https://app.nwis.io",
              "description": "Secure blockchain-powered platform for purchasing NWIS tokens",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "name": "NWIS Token Sale",
                "description": "Purchase NWIS tokens during presale",
                "category": "Cryptocurrency Token Sale",
                "availability": "https://schema.org/InStock",
                "price": "0.001",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <WalletProvider>
            <ThemeProvider 
              attribute="class" 
              defaultTheme="dark" 
              enableSystem={false}
              forcedTheme="dark"
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </WalletProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

