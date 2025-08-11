import { getDefaultConfig } from "connectkit"
import { createConfig } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"

// Check if we have a valid WalletConnect project ID
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

// Create config with proper WalletConnect handling
export const config = createConfig(
  getDefaultConfig({
    appName: "NexusWealth Investment Solutions",
    chains: [mainnet, sepolia],
    walletConnectProjectId: walletConnectProjectId || "5564c86f2bd7f6fbadb17a8af2161f9f", // User's actual project ID
  }),
)
