"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function InstitutionsNavbar() {
  const [open, setOpen] = useState(false)

  const items = [
    { name: "Solutions", href: "/institutions#solutions" },
    { name: "Insights", href: "/institutions#insights" },
    { name: "Why us", href: "/institutions#why-us" },
    { name: "Contact", href: "/institutions#contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <nav className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/institutions" className="flex items-center gap-3" aria-label="Institutions Home">
          <Image
            src="/images/NWLogo.jpg"
            alt="NexusWealth logo"
            width={2048}
            height={448}
            className="h-7 w-auto object-contain"
            sizes="(max-width: 768px) 120px, 180px"
          />
          <span className="sr-only">NexusWealth Institutional</span>
        </Link>

        <ul className="hidden md:flex items-center gap-6">
          {items.map((it) => (
            <li key={it.name}>
              <Link className="text-sm font-medium text-neutral-800 hover:text-neutral-600" href={it.href}>
                {it.name}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden p-2 rounded-md border border-neutral-200"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <ul className="px-4 py-3 space-y-1">
            {items.map((it) => (
              <li key={it.name}>
                <Link
                  className="block rounded-md px-3 py-2 text-neutral-800 hover:bg-neutral-50"
                  href={it.href}
                  onClick={() => setOpen(false)}
                >
                  {it.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
