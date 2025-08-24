export default function TokenomicsSection() {
  const tokenomics = [
    { label: "Total Supply", value: "50,000,000,000 NWIS", percentage: 100, color: "from-purple-600 to-pink-600" },
    { label: "Presale", value: "30,000,000,000 NWIS", percentage: 60, color: "from-blue-500 to-cyan-500" },
    { label: "Liquidity", value: "7,500,000,000 NWIS", percentage: 15, color: "from-green-500 to-emerald-500" },
    { label: "Marketing", value: "5,000,000,000 NWIS", percentage: 10, color: "from-orange-500 to-red-500" },
    { label: "Team", value: "7,500,000,000 NWIS", percentage: 15, color: "from-yellow-500 to-amber-500" },
  ]

  return (
    <section className="py-20 bg-[#0c1220] relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-black">
            <span className="text-black">NWIS</span> Tokenomics
          </h2>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-black px-4">
            Transparent and sustainable token distribution designed for long-term growth and investors benefit.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-start lg:items-center">
          <div className="space-y-4 sm:space-y-6">
            {tokenomics.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 sm:p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r ${item.color} mr-3 sm:mr-4`}></div>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">{item.label}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 text-sm sm:text-base">{item.value}</div>
                  <div className="text-xs sm:text-sm text-slate-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
          <div className="relative">
            <div className="w-64 h-64 sm:w-80 sm:h-80 mx-auto relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                
                {/* Colored segments */}
                <defs>
                  <linearGradient id="main-presale-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="main-liquidity-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="main-marketing-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                  <linearGradient id="main-team-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
                  stroke="url(#main-presale-gradient)"
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
                  stroke="url(#main-liquidity-gradient)"
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
                  stroke="url(#main-marketing-gradient)"
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
                  stroke="url(#main-team-gradient)"
                  strokeWidth="8"
                  strokeDasharray="37.68 251.2"
                  strokeDashoffset="-213.52"
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">50B</div>
                  <div className="text-xs sm:text-sm text-gray-600">Total Supply</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
