"use client"

import Image from "next/image"
import Link from "next/link"

export default function InstitutionsPage() {
  return (
    <div className="bg-white text-neutral-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/placeholder.svg?height=800&width=1600"
            alt="Abstract background"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-white/80" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Institutional investing reimagined</h1>
            <p className="mt-6 text-lg text-neutral-600">
              Access strategies, research, and technology to help meet your portfolio objectives across market cycles.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#contact"
                className="inline-flex items-center rounded-md bg-neutral-900 px-5 py-3 text-white hover:bg-neutral-800"
              >
                Contact us
              </Link>
              <Link
                href="#insights"
                className="inline-flex items-center rounded-md border border-neutral-300 px-5 py-3 text-neutral-900 hover:bg-neutral-50"
              >
                View insights
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section id="solutions" className="py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Solutions by asset class</h2>
            <p className="mt-2 text-neutral-600">Explore capabilities across public and private markets.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Fixed Income",
                desc: "Core, credit, unconstrained, and LDI solutions.",
                img: "/placeholder.svg?height=260&width=400",
              },
              {
                title: "Equities",
                desc: "Active, factor, and index exposures across regions.",
                img: "/placeholder.svg?height=260&width=400",
              },
              {
                title: "Alternatives",
                desc: "Private markets, real assets, and hedge fund strategies.",
                img: "/placeholder.svg?height=260&width=400",
              },
              {
                title: "Multi-Asset",
                desc: "Outcome-focused portfolios and model solutions.",
                img: "/placeholder.svg?height=260&width=400",
              },
            ].map((c) => (
              <article
                key={c.title}
                className="group rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors overflow-hidden bg-white"
              >
                <div className="relative h-40">
                  <Image
                    src={c.img || "/placeholder.svg"}
                    alt={c.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg">{c.title}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{c.desc}</p>
                  <Link
                    href="#"
                    className="mt-4 inline-block text-sm font-medium text-neutral-900 underline underline-offset-4"
                  >
                    Explore {c.title}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured insights */}
      <section id="insights" className="py-14 lg:py-20 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Featured insights</h2>
              <p className="mt-2 text-neutral-600">Timely perspectives and research from our investment teams.</p>
            </div>
            <Link href="#" className="text-neutral-900 font-medium underline underline-offset-4">
              All insights
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <article key={i} className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
                <div className="relative h-44">
                  <Image
                    src={`/placeholder.svg?height=320&width=640&query=market%20research%20${i}`}
                    alt={`Insight ${i}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">Research</p>
                  <h3 className="mt-2 font-semibold">Quarterly market outlook {i}: positioning for shifting regimes</h3>
                  <p className="mt-2 text-sm text-neutral-600">
                    Our team assesses macro drivers and potential paths for rates, inflation, and risk assets.
                  </p>
                  <Link
                    href="#"
                    className="mt-3 inline-block text-sm font-medium text-neutral-900 underline underline-offset-4"
                  >
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why work with us */}
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">Why work with NexusWealth</h2>
            <p className="mt-2 text-neutral-600">
              Scale, research depth, and technology to help you pursue your goals.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "$500B+", label: "Institutional AUM across strategies" },
              { value: "250+", label: "Investment professionals worldwide" },
              { value: "90+", label: "Countries with institutional clients" },
              { value: "24/7", label: "Client service and portfolio tools" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-neutral-200 bg-white p-6">
                <div className="text-3xl font-extrabold">{stat.value}</div>
                <div className="mt-2 text-neutral-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-14 lg:py-20 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Let’s talk</h2>
              <p className="mt-3 text-neutral-600">
                Tell us about your objectives. Our institutional team will be in touch.
              </p>
              <ul className="mt-6 space-y-2 text-neutral-700">
                <li>• Custom portfolio solutions</li>
                <li>• OCIO and advisory</li>
                <li>• Risk and analytics</li>
                <li>• Technology and tooling</li>
              </ul>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="rounded-lg border border-neutral-200 bg-white p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm">First name</span>
                  <input
                    name="firstName"
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm">Last name</span>
                  <input
                    name="lastName"
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    required
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm">Business email</span>
                  <input
                    type="email"
                    name="email"
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    required
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm">Organization</span>
                  <input
                    name="org"
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm">Message</span>
                  <textarea
                    name="message"
                    rows={4}
                    className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="mt-4 inline-flex items-center rounded-md bg-neutral-900 px-5 py-3 text-white hover:bg-neutral-800"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
