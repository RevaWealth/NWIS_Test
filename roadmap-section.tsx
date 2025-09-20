import { CheckCircle } from 'lucide-react'

export default function RoadmapSection() {
  const roadmapPhases = [
    {
      title: "Phase 1: Foundation & ICO (Q3 2025)",
      items: [
        "Corporate Inception & Whitepaper Release",
        "Smart Contract Development & Audit",
        "Website Launch & Community Building",
        "NWIS Token Presale - Series A Seed funding",
      ],
      completed: true,
    },
    {
      title: "Phase 2: Platform Development, Marketing/Fundraising (Q4 2025)",
      items: [
        "Resource Onboarding and Team Expansion",
        "Staking Platform Launch",
        "Initial Real-World Asset Integration",
        "Global Marketing Campaigns",
      ],
      completed: false,
    },
    {
      title: "Phase 3: Ecosystem Expansion (Q1 2026)",
      items: [
        "NWIS Token Listing on DEXs",
        "Token Holders Access to NexusWealth Strategic Investment Paths",
        "Partnership Expansion",
        "NexusWealth Collateralized Loans",
      ],
      completed: false,
    },
    {
      title: "Phase 4: Ecosystem Expansion (Q4 2026)",
      items: [
        "Cross-Chain Compatibility",
        "Decentralized Governance Implementation",
        "First 3rd Party Audit Publish",
        "Yield Payouts",
      ],
      completed: false,
    },
    {
      title: "Phase 5: Exponential Growth (Q2 2027+)",
      items: [
        "Expansion to New Global Investment Categories",
        "Quarterly Audits",
        "Monthly Yield Payouts",
        "Global Regulatory Compliance",
      ],
      completed: false,
    },
  ]

  return (
    <section id="roadmap" className="py-20 bg-[#070b14] bg-sky-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 md:mb-12">Our Roadmap</h2>
        <div className="relative">
          {/* Vertical timeline line - hidden on mobile, visible on desktop */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-700 hidden md:block"></div>

          <div className="space-y-12 md:space-y-16">
            {roadmapPhases.map((phase, index) => (
              <div
                key={index}
                className="relative flex flex-col md:flex-row items-center mb-8 md:mb-0"
              >
                {/* Phase content - alternates left and right */}
                <div 
                  className={`w-full md:w-1/2 p-6 md:p-4 text-center bg-slate-800/50 md:bg-transparent rounded-lg md:rounded-none ${
                    index % 2 === 0 
                      ? 'md:text-left md:pl-16' 
                      : 'md:order-2 md:text-left md:pl-16'
                  }`}
                >
                  {/* Mobile milestone icon - positioned above title on mobile */}
                  <div className="md:hidden flex justify-center mb-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        phase.completed 
                          ? "bg-green-500" 
                          : "bg-gray-700 border-2 border-gray-500"
                      }`}
                    >
                      {phase.completed && (
                        <CheckCircle className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 leading-tight">
                    {phase.title}
                  </h3>
                  <ul className="space-y-2 text-gray-300 text-sm md:text-base">
                    {phase.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start justify-center md:justify-start">
                        <CheckCircle
                          className={`h-4 w-4 md:h-5 md:w-5 mr-2 mt-0.5 flex-shrink-0 ${
                            phase.completed ? "text-green-500" : "text-gray-500"
                          }`}
                        />
                        <span className="text-center md:text-left">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Desktop center timeline circle - hidden on mobile */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      phase.completed 
                        ? "bg-green-500" 
                        : "bg-gray-700 border-2 border-gray-500"
                    }`}
                  >
                    {phase.completed && (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>

                {/* Empty space for balance */}
                <div className={`hidden md:block md:w-1/2 ${
                  index % 2 === 0 ? 'md:order-2' : ''
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
