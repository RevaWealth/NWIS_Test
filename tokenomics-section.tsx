export default function TokenomicsSection() {
  const tokenomics = [
    { label: "Total Supply", value: "50,000,000,000 NWIS", percentage: 100, color: "from-purple-600 to-pink-600" },
    { label: "Presale", value: "30,000,000,000 NWIS", percentage: 60, color: "from-blue-500 to-cyan-500" },
    { label: "Liquidity", value: "7,500,000,000 NWIS", percentage: 15, color: "from-green-500 to-emerald-500" },
    { label: "Marketing", value: "5,000,000,000 NWIS", percentage: 10, color: "from-orange-500 to-red-500" },
    { label: "Team", value: "7,500,000,000 NWIS", percentage: 15, color: "from-yellow-500 to-amber-500" },
  ]

  // Calculate cumulative percentages for the pie chart
  const segments = tokenomics.slice(1).map((item, index) => {
    const previousTotal = tokenomics.slice(1, index + 1).reduce((sum, prev) => sum + prev.percentage, 0)
    const startOffset =
      index === 0
        ? 0
        : tokenomics.slice(1, index + 1).reduce((sum, prev, i) => sum + tokenomics.slice(1)[i].percentage, 0) -
          item.percentage
    return {
      ...item,
      startOffset: (startOffset / 100) * 251.2, // 251.2 is circumference of circle with radius 40
      dashArray: `${(item.percentage / 100) * 251.2} 251.2`,
    }
  })

  return (
    <section className="py-20 bg-[#0c1220] relative bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
            <span className="text-black">NWIS</span> Tokenomics
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-black">
            Transparent and sustainable token distribution designed for long-term growth and investors benefit.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {tokenomics.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-[#070b14] rounded-lg border border-gray-800 bg-white"
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.color} mr-4`}></div>
                  <span className="font-medium text-black">{item.label}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-black">{item.value}</div>
                  <div className="text-sm text-slate-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
          <div className="relative">
            <div className="w-80 h-80 mx-auto relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1f2937" strokeWidth="8" />
                {/* Colored segments */}
                <defs>
                  <linearGradient id="presale-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="liquidity-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="marketing-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                  <linearGradient id="team-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                {/* Presale - 60% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#presale-gradient)"
                  strokeWidth="8"
                  strokeDasharray="150.72 251.2"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                {/* Liquidity - 15% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#liquidity-gradient)"
                  strokeWidth="8"
                  strokeDasharray="37.68 251.2"
                  strokeDashoffset="-150.72"
                  strokeLinecap="round"
                />
                {/* Marketing - 10% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#marketing-gradient)"
                  strokeWidth="8"
                  strokeDasharray="25.12 251.2"
                  strokeDashoffset="-188.4"
                  strokeLinecap="round"
                />
                {/* Team - 15% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#team-gradient)"
                  strokeWidth="8"
                  strokeDasharray="37.68 251.2"
                  strokeDashoffset="-213.52"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-black">50B</div>
                  <div className="text-gray-500">Total Supply</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
