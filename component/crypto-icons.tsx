import Image from "next/image"

export function EthIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
    </svg>
  )
}

export function UsdtIcon({ className }: { className?: string }) {
  return <Image src="/images/usdt.png" alt="USDT" width={16} height={16} className={className} />
}

export function UsdcIcon({ className }: { className?: string }) {
  return <Image src="/images/usdc.png" alt="USDC" width={16} height={16} className={className} />
}
