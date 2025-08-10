import type React from "react"
import type { Metadata } from "next"
import InstitutionsNavbar from "../../components/institutions/navbar"
import InstitutionsFooter from "../../components/institutions/footer"

export const metadata: Metadata = {
  title: "Institutions | NexusWealth",
  description: "Institutional solutions, insights, and strategies for professional investors.",
}

export default function InstitutionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <InstitutionsNavbar />
      <main className="flex-1">{children}</main>
      <InstitutionsFooter />
    </div>
  )
}
