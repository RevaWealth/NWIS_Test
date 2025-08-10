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
      {/* Slim header (unchanged height), reduce logo ~25% */}
      <nav className="mx-auto flex h-7 md:h-8 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/institutions" className="flex items-center gap-3" aria-label="Institutions Home">
          <Image
            src="/images/nwis-logo.png"
            alt="NWIS logo"
            width={2048}
            height={448}
            priority
            className="w-[83px] md:w-[113px] lg:w-[135px] h-auto object-contain shrink-0"
            sizes="(max-width: 768px) 83px, (max-width: 1024px) 113px, 135px"
          />
          <span className="sr-only">NexusWealth Institutional</span>
        </Link>

        <ul className="hidden md:flex items-center gap-5">
          {items.map((it) => (
            <li key={it.name}>
              <Link className="text-sm font-medium text-neutral-800 hover:text-neutral-600" href={it.href}>
                {it.name}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden p-1.5 rounded-md border border-neutral-200"
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
