"use client"

import type * as React from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider } from "connectkit"
import { config } from "@/lib/wagmi" // Import the wagmi config

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
    },
  },
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider 
          theme="midnight" 
          mode="dark"
          options={{
            hideBalance: false,
            embedGoogleFonts: true,
            // Enable QR code functionality
            walletConnectCTA: "link",
            // Enable mobile wallet support
            mobileWallets: [
              {
                id: "metamask",
                name: "MetaMask",
                links: {
                  native: "metamask://",
                  universal: "https://metamask.app.link",
                },
              },
              {
                id: "trust",
                name: "Trust Wallet",
                links: {
                  native: "trust://",
                  universal: "https://link.trustwallet.com",
                },
              },
            ],
            // Enable all wallet connection methods
            initialChainId: 1,
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
