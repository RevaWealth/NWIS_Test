'use client'

import { useEffect, useMemo, useState } from 'react'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

type PdfSource =
  | { type: 'url'; url: string }
  | { type: 'blob'; blobUrl: string }

const WHITEPAPER_TEXT = `
Nexus Wealth Investment Solution (NWIS) 
White Paper v3.0

1. Abstract 
Nexus Wealth Investment Solution (NWIS) introduces a transformative investment
framework designed to support large-scale infrastructure projects—including real estate,
energy, and transportation—through decentralized blockchain technology. By tokenizing
physical assets, NWIS lowers traditional barriers to investment and creates liquidity in
markets previously limited to institutional players. While our broader vision encompasses
infrastructure at scale, our first flagship project will focus on real estate development: a
100-unit residential complex in Southern California. This project will showcase the full
potential of NWIS’s platform—delivering transparency, fractional ownership, and passive
income to global investors.

Tokenization offers a groundbreaking approach to infrastructure investment by transforming
large, traditionally illiquid assets into divisible, tradeable digital tokens. This opens the door
to a broader investor base, enabling individuals and institutions to contribute capital to energy
systems, smart cities, transit networks, and real estate without needing to manage entire
projects or navigate complex financial instruments. With built-in transparency, automation,
and liquidity, tokenization addresses long-standing inefficiencies and introduces new layers
of efficiency, democratization, and investor control.

NWIS is uniquely positioned to lead this transformation. Our multidisciplinary team includes
seasoned professionals from infrastructure development, wealth management, and blockchain
innovation. This combination ensures that we not only understand the physical and financial
complexities of infrastructure but also know how to leverage cutting-edge decentralized
finance (DeFi) technologies to unlock their value for everyday investors and institutions
alike.

2. NWIS Protocol Innovations 
2.1 Real Estate Tokenization Framework 
As mentioned above, the first target project of NWIS is to implement a tokenization model
that transforms physical real estate assets into digital tokens. Each token represents a share of
a specific income-producing property. This model enables fractional investment, allowing
individuals to access lucrative property markets without purchasing entire units. Additionally,
because the tokens can be traded on regulated secondary markets, they bring a new level of
liquidity to the traditionally illiquid real estate sector. Investors can choose to buy, sell, or
hold tokens based on their financial goals.

2.2 Smart Contract Utility 
The NWIS platform relies on smart contracts to streamline and secure core operations. Every
stage of the investment process—from transferring ownership to distributing rental
income—is managed automatically through code. This automation minimizes human error,
eliminates costly intermediaries, and ensures timely payments and updates. Investors benefit
from predictable and transparent operations, enhancing trust and efficiency across the
platform.

2.3 Compliance and Governance 
Legal compliance and investor governance are built into NWIS from the ground up. The
platform integrates compliance mechanisms such as AML and KYC to ensure safety and
legality in every transaction. Moreover, NWIS offers token holders the ability to participate
in key decision-making processes through on-chain governance. Whether it's approving
property purchases or initiating profit distribution models, our community of investors has a
voice in shaping the future of the platform.

3. Market Problems and Our Solution 
3.1 Traditional Barriers 
Entering the real estate market has historically required significant capital, creating a barrier
for most individual investors. Furthermore, international investors face legal and logistical
challenges, and even for domestic participants, liquidating real estate assets can take months,
if not years. These factors make real estate a slow, expensive, and often inaccessible asset
class.

3.2 NWIS Advantage 
NWIS eliminates these barriers by allowing anyone to invest in real estate with minimal
funds and without geographic limitations. Our platform turns large, illiquid properties into
accessible and tradeable digital assets. Investors can participate in prime residential
developments, receive passive rental income, and enjoy capital appreciation—without the
traditional headaches. Through a simplified, borderless, and automated system, NWIS offers
a fresh, empowering alternative to traditional investing.

4. Technical Architecture 
4.1 Core Components 
NWIS is built on a robust technical stack designed for transparency, efficiency, and security.
At its foundation is a blockchain-based token infrastructure that represents fractional
ownership of real-world properties. Every asset is recorded on an immutable registry,
ensuring verifiable ownership and transaction history. Smart contracts handle rental
distributions, ownership transfers, and governance workflows—all autonomously and without
intermediaries.

4.2 Security and Privacy 
Security is paramount in any financial ecosystem. NWIS ensures platform integrity through
regular smart contract audits and the use of multi-signature wallets for treasury operations.
All investor data is protected using encrypted storage, and strict identity verification ensures
compliance with global standards. The system also incorporates secure data oracles to
provide real-time updates on rental income, property valuations, and market trends,
maintaining investor confidence and system reliability.

5. Tokenomics 
5.1 Token Structure 
The NWIS platform is powered by its native token, RealEstateX ($NWIS), which serves as a
direct link between investors and real assets. A total of 100 million tokens have been issued,
with each token priced at $0.50 during the initial offering. Owning these tokens provides
tangible benefits: fractional equity in residential properties, entitlement to a share of the rental
income, and the right to participate in governance decisions that shape the platform’s
evolution. The $NWIS token is the gateway to a diversified, high-yield real estate portfolio,
all managed transparently and securely on-chain.

5.2 Distribution 
To ensure long-term viability and strategic alignment, NWIS has adopted a carefully
designed token distribution model. Sixty percent of the total supply will be made available to
public investors during the token sale. The team and advisors will receive 15%, subject to a
multi-year vesting schedule to maintain alignment with platform growth. Another 15% is
reserved for the treasury, providing capital for future expansion. Five percent each is
allocated to legal compliance and operational marketing to ensure both regulatory strength
and global visibility.

5.3 Use of Funds 
The capital raised from the token sale will be strategically deployed to maximize investor
returns and project success. Approximately $15 million will be directed toward land
acquisition, securing high-potential plots in Southern California. Around $3 million will
cover architectural design and permitting. The bulk of the funds—$30 million—will be
allocated to construction. Legal structuring and operational costs are capped at $1 million
each to maintain efficiency and compliance.

6. Investor Returns 
6.1 Passive Income 
Holders of $NWIS tokens will enjoy regular passive income derived from rental revenues.
Income is pooled from all properties under management and automatically distributed to
token holders via smart contracts. These distributions, made quarterly, ensure transparency
and punctuality while requiring no effort from investors beyond holding their tokens.

6.2 Exit Strategies 
NWIS also supports capital appreciation through token resale and property liquidation. When
properties are sold post-development, net profits are distributed to token holders based on
their stake. Additionally, the ability to trade tokens on compliant secondary markets provides
early liquidity—a major improvement over traditional real estate timelines. These options
ensure that investors can tailor their exit based on market trends and personal financial
strategies.

7. Legal and Regulatory Compliance 
7.1 Legal Framework 
NWIS is committed to full regulatory compliance. The initial token offering will be
conducted under Regulation D and Regulation S exemptions, targeting accredited and
international investors, respectively. As the platform matures, we will pursue Regulation A+
approval to broaden access to U.S.-based retail investors. Each jurisdiction’s legal
requirements will be carefully mapped and implemented to ensure lawful participation and
capital protection.

7.2 Security Measures 
To maintain investor trust and protect capital, NWIS undergoes continuous smart contract
auditing by third-party security firms. Identity verification processes such as KYC are
mandatory, and international tax compliance is embedded into platform workflows. These
features not only safeguard assets but also position NWIS as a legally resilient investment
ecosystem.

8. Risks and Mitigation 
While NWIS introduces numerous innovations, it also acknowledges the risks inherent in real
estate and blockchain investment. Below are key risks and our mitigation strategies:
1. Market Risk: Real estate markets are subject to macroeconomic cycles that could impact
property values and rental demand.
Mitigation: Diversification across regions and careful market analysis help reduce
exposure. Projects are selected based on high-demand and growth potential areas.

2. Regulatory Uncertainty: Evolving laws around tokenized assets and securities may impact
operations or access.
Mitigation: NWIS works with legal advisors to ensure multi-jurisdictional compliance
and will progressively upgrade frameworks to meet regulatory changes.

3. Liquidity Risk: Token holders may face challenges selling tokens in underdeveloped
secondary markets.
Mitigation: We are actively pursuing listings on regulated exchanges and
decentralized platforms to ensure token liquidity and tradability.

4. Smart Contract Vulnerabilities: Code-based operations can be exposed to security flaws.
Mitigation: All contracts undergo third-party audits and bug bounty programs are
planned to ensure ongoing integrity.

5. Construction and Operational Delays: Real estate developments may experience delays or
budget overruns.
Mitigation: Conservative budgeting, experienced construction partners, and
contingency reserves are used to reduce these risks.

Example Investment Equation:
Let’s define investor return over time:
R(t) = (P * r * t / 4) + (S * (P / T))
Where:
R(t) = Total return over time t (quarters)
P = Number of tokens held
r = Quarterly rental income rate per token
S = Net profit from asset sale
T = Total tokens in circulation
This model shows how rental yield and capital appreciation contribute to long-term value for
investors.

9. Roadmap and Development Plan 
We aim to democratize real estate investment by leveraging blockchain technology to fund,
build, and manage a 100-unit residential complex in Southern California. By tokenizing the
project, we enable fractional ownership, enhanced transparency, and early liquidity for
investors.

The centerpiece of our first initiative is a thoughtfully designed, mid-density residential
complex comprised of 100 individual units, each averaging 1,000 square feet. Strategically
located in one of Southern California’s high-growth regions, the development focuses on
delivering long-term value and sustainability. This project reflects our vision to create
modern, accessible housing while maximizing returns for token holders through rental
income and potential appreciation.

Key financial and development metrics for this project include:
Total Units: 100
Average Unit Size: 1,000 ft²
Total Buildable Area: 100,000 ft²
Estimated Construction Cost: $300 per ft²
Total Construction Budget: $30 million
Initial Raise Goal: $50 million through token sale

The funds raised will be allocated for land acquisition, design, permitting, and construction,
with a strategic reserve set aside to handle market shifts or unexpected costs.

Phase Timeline
Token Structuring Q2 2025
Legal Framework Q2–Q3 2025
Token Sale Launch Q3 2025
Land Acquisition Q4 2025
Design & Permitting Q4 2025 – Q2 2026
Construction Begins Q3 2026 – Q4 2027
Rental/Sales Launch 2028 onward

10. Future Vision 
NWIS envisions a global marketplace where anyone can invest in real estate as easily as
purchasing digital assets online. By lowering the barrier to entry, enhancing liquidity, and
embracing decentralized governance, we aim to create a thriving ecosystem where property
development and ownership are transparent, efficient, and universally accessible. From a
100-unit residential complex in Southern California to a network of international
developments, NWIS is laying the foundation for a more inclusive, investor-driven real estate
future.
`

export default function WhitepaperPage() {
  const [pdfSource, setPdfSource] = useState<PdfSource | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Attempt to load an existing PDF from public/whitepaper.pdf first
  useEffect(() => {
    let cancelled = false
    async function loadOrGenerate() {
      try {
        setError(null)
        // Check if a real PDF exists at /whitepaper.pdf
        const res = await fetch('/whitepaper.pdf', { method: 'HEAD' })
        if (!cancelled && res.ok) {
          setPdfSource({ type: 'url', url: '/whitepaper.pdf' })
          return
        }
      } catch {
        // ignore and generate from text
      }

      // Fall back: generate a PDF on the client from the provided text
      try {
        setIsGenerating(true)
        const blobUrl = await generatePdfFromText(WHITEPAPER_TEXT)
        if (!cancelled) setPdfSource({ type: 'blob', blobUrl })
      } catch (e) {
        if (!cancelled) setError('Failed to generate the whitepaper PDF. Please try again.')
      } finally {
        if (!cancelled) setIsGenerating(false)
      }
    }
    loadOrGenerate()
    return () => {
      cancelled = true
      if (pdfSource?.type === 'blob') {
        URL.revokeObjectURL(pdfSource.blobUrl)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const viewer = useMemo(() => {
    if (!pdfSource) return null
    const src = pdfSource.type === 'url' ? pdfSource.url : pdfSource.blobUrl
    return (
      <iframe
        title="NWIS Whitepaper PDF"
        src={src}
        className="w-full h-[calc(100vh-120px)] border rounded-md bg-white"
      />
    )
  }, [pdfSource])

  const onDownload = async () => {
    if (!pdfSource) return
    const src = pdfSource.type === 'url' ? pdfSource.url : pdfSource.blobUrl
    const a = document.createElement('a')
    a.href = src
    a.download = 'NWIS-Whitepaper.pdf'
    a.click()
  }

  const onPrint = () => {
    // Open in a new tab to print (works for both URL and blob)
    if (!pdfSource) return
    const src = pdfSource.type === 'url' ? pdfSource.url : pdfSource.blobUrl
    const w = window.open(src, '_blank')
    w?.focus()
    w?.print()
  }

  return (
    <main className="min-h-screen w-full bg-white text-slate-800">
      <section className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            NexusWealth Investment Solutions — Whitepaper
          </h1>
          <div className="flex gap-2">
            <button
              onClick={onDownload}
              disabled={!pdfSource}
              className="inline-flex items-center rounded-md bg-[#2A3650] px-3 py-2 text-white hover:opacity-90 disabled:opacity-50"
            >
              Download
            </button>
            <button
              onClick={onPrint}
              disabled={!pdfSource}
              className="inline-flex items-center rounded-md border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Print
            </button>
          </div>
        </header>

        {isGenerating && (
          <div className="flex h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <svg className="h-6 w-6 animate-spin text-slate-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z" />
              </svg>
              <span>Preparing whitepaper…</span>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-rose-700">
            {error}
          </div>
        )}

        {!isGenerating && !error && viewer}
      </section>
    </main>
  )
}

async function generatePdfFromText(text: string): Promise<string> {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const fontSize = 12
  const margin = 56 // 0.78in
  const pageWidth = 612 // 8.5in
  const pageHeight = 792 // 11in
  const maxWidth = pageWidth - margin * 2
  const lineHeight = fontSize * 1.35

  // Simple word-wrap using font measurement
  const paragraphs = text.split(/\n\s*\n/g)
  let page = pdfDoc.addPage([pageWidth, pageHeight])
  let y = pageHeight - margin

  const drawLine = (line: string) => {
    page.drawText(line, {
      x: margin,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    })
  }

  for (const para of paragraphs) {
    const words = para.replace(/\n/g, ' ').split(/\s+/)
    let line = ''
    for (const word of words) {
      const tentative = line.length ? `${line} ${word}` : word
      const width = font.widthOfTextAtSize(tentative, fontSize)
      if (width <= maxWidth) {
        line = tentative
      } else {
        if (y - lineHeight < margin) {
          page = pdfDoc.addPage([pageWidth, pageHeight])
          y = pageHeight - margin
        } else {
          y -= lineHeight
        }
        drawLine(line)
        line = word
      }
    }
    // Draw remaining line in the paragraph
    if (line) {
      if (y - lineHeight < margin) {
        page = pdfDoc.addPage([pageWidth, pageHeight])
        y = pageHeight - margin
      } else {
        y -= lineHeight
      }
      drawLine(line)
    }
    // Paragraph spacing
    if (y - lineHeight * 1.5 < margin) {
      page = pdfDoc.addPage([pageWidth, pageHeight])
      y = pageHeight - margin
    } else {
      y -= lineHeight * 1.5
    }
  }

  const bytes = await pdfDoc.save()
  const blob = new Blob([bytes], { type: 'application/pdf' })
  return URL.createObjectURL(blob)
}
