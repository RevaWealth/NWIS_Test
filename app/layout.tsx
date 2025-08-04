import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "../wallet-provider"
import { ErrorBoundary } from "../error-boundary"
import { Toaster } from "@/component/UI/toaster" // Updated import path
import { ThemeProvider } from "../component/theme-provider" // Updated import path

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
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster />
            </ThemeProvider>
          </WalletProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
