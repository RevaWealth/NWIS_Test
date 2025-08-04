import { getDefaultConfig } from "connectkit"
import { createConfig } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"

export const config = createConfig(
  getDefaultConfig({
    appName: "NexusWealth Investment Solutions",
    chains: [mainnet, sepolia],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_WALLETCONNECT_PROJECT_ID",
  }),
)
