// Force dynamic rendering for token-purchase page to prevent SSR issues with wallet connections
export const dynamic = 'force-dynamic'

export default function TokenPurchaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
