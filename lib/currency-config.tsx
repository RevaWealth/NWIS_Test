import { EthIcon, UsdtIcon, UsdcIcon } from "@/component/crypto-icons"
import { CurrencyConfig, Currency } from "./types"

export const currencyConfig: Record<Currency, CurrencyConfig> = {
  ETH: { icon: EthIcon, color: "text-blue-400" },
  USDT: { icon: UsdtIcon, color: "text-green-500" },
  USDC: { icon: UsdcIcon, color: "text-blue-500" },
}
