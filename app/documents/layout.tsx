// Force dynamic rendering for documents page to prevent SSR issues with PDF.js
export const dynamic = 'force-dynamic'

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
