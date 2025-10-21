import Image from "next/image"

type IconProps = {
  className?: string
}

/**
 * Ethereum icon used in "Buy with ETH" and anywhere EthIcon is referenced.
 * Uses a transparent SVG for crisp rendering at any size.
 */
export function EthIcon({ className }: IconProps) {
  return (
    <Image
      src="/images/eth.svg"
      alt="Ethereum"
      width={20}
      height={20}
      className={`h-5 w-5 object-contain ${className ?? ""}`}
      priority={false}
    />
  )
}

export function UsdtIcon({ className }: IconProps) {
  return (
    <Image
      src="/images/usdt.png"
      alt="USDT"
      width={20}
      height={20}
      className={`h-5 w-5 object-contain ${className ?? ""}`}
    />
  )
}

export function UsdcIcon({ className }: IconProps) {
  return (
    <Image
      src="/images/usdc.png"
      alt="USDC"
      width={20}
      height={20}
      className={`h-5 w-5 object-contain ${className ?? ""}`}
    />
  )
}
