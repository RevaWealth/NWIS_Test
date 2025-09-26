import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { WalletProvider } from "../wallet-provider"
import { ErrorBoundary } from "../sections/error-boundary"
import { Toaster } from "@/component/UI/toaster"
import { ThemeProvider } from "../component/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NexusWealth Investment Solutions - NWIS Token Sale",
  description:
    "Empowering Individuals to Build Generational Wealth through Blockchain. Join the NWIS token presale now.",
  keywords: "blockchain, cryptocurrency, token sale, investment, DeFi, NWIS",
  authors: [{ name: "NexusWealth Team" }],
  openGraph: {
    title: "NexusWealth Investment Solutions - NWIS Token Sale",
    description: "Revolutionizing real-world investment through decentralized innovation.",
    type: "website",
  },
  generator: "v0.dev",
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
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <WalletProvider>
            {/* Force light theme so background is always white */}
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
              {children}
              <Toaster />
            </ThemeProvider>
          </WalletProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
