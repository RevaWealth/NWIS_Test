import Link from "next/link"

export default function InstitutionsFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-semibold">Company</h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="#" className="hover:text-neutral-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-neutral-900">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-neutral-900">
                  Newsroom
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Solutions</h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="#" className="hover:text-neutral-900">
                  Fixed Income
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-neutral-900">
                  Equities
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-neutral-900">
                  Alternatives
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-neutral-900">
                  Multi-Asset
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Insights</h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="#" className="hover:text-neutral-900">
                  Research
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-neutral-900">
                  Market views
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-neutral-900">
                  Webinars
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Support</h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="#contact" className="hover:text-neutral-900">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-neutral-900">
                  Legal
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-neutral-900">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-xs text-neutral-500">
          © {new Date().getFullYear()} NexusWealth. For institutional and professional investors only. All rights
          reserved.
        </div>
      </div>
    </footer>
  )
}
