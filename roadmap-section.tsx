import { CheckCircle } from "lucide-react"

export default function RoadmapSection() {
  const roadmapPhases = [
    {
      title: "Phase 1: Foundation & Presale (Q4 2024)",
      items: [
        "Project Inception & Whitepaper Release",
        "Smart Contract Development & Audit",
        "Website Launch & Community Building",
        "NWIS Token Presale - Stage 1",
      ],
      completed: true,
    },
    {
      title: "Phase 2: Platform Development (Q1 2025)",
      items: [
        "NWIS Token Listing on DEXs",
        "Staking Platform Launch",
        "Initial Real-World Asset Integration",
        "Partnership Expansion",
      ],
      completed: false,
    },
    {
      title: "Phase 3: Ecosystem Expansion (Q2 2025)",
      items: [
        "Cross-Chain Compatibility",
        "Decentralized Governance Implementation",
        "NFT Integration for Asset Ownership",
        "Global Marketing Campaigns",
      ],
      completed: false,
    },
    {
      title: "Phase 4: Future Growth (Q3 2025+)",
      items: [
        "Expansion to New Asset Classes",
        "Mobile Application Development",
        "Layer 2 Scaling Solutions",
        "Global Regulatory Compliance",
      ],
      completed: false,
    },
  ]

  return (
    <section id="roadmap" className="py-20 bg-[#070b14]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-12">Our Roadmap</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-700 hidden md:block"></div>

          <div className="space-y-16">
            {roadmapPhases.map((phase, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center md:items-start justify-center md:space-x-8"
              >
                <div
                  className={`md:w-1/2 ${index % 2 === 0 ? "md:text-right md:pr-16" : "md:order-2 md:text-left md:pl-16"}`}
                >
                  <h3 className="text-2xl font-semibold text-white mb-4">{phase.title}</h3>
                  <ul className="space-y-2 text-gray-300">
                    {phase.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center">
                        <CheckCircle
                          className={`h-5 w-5 mr-2 ${phase.completed ? "text-green-500" : "text-gray-500"}`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative z-10 flex-shrink-0 mt-4 md:mt-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${phase.completed ? "bg-green-500" : "bg-gray-700 border-2 border-gray-500"}`}
                  >
                    {phase.completed && <CheckCircle className="h-4 w-4 text-white" />}
                  </div>
                </div>
                <div
                  className={`md:w-1/2 ${index % 2 === 0 ? "md:order-2 md:text-left md:pl-16" : "md:text-right md:pr-16"}`}
                >
                  {/* Empty div to balance layout */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
