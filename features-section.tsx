import { Gem, ShieldCheck, DollarSign, Globe, Zap, Eye } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: <Gem className="h-8 w-8 text-purple-500" />,
      title: "Tokenized Real-World Assets",
      description: "Invest in fractionalized real estate, commodities, and more, all on the blockchain.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-blue-600" />,
      title: "Enhanced Security",
      description: "Leveraging blockchain's immutability and cryptographic security for your investments.",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      title: "Passive Income Streams",
      description: "Earn returns from real-world assets, distributed directly to your digital wallet.",
    },
    {
      icon: <Globe className="h-8 w-8 text-orange-600" />,
      title: "Global Accessibility",
      description: "Democratizing investment opportunities for everyone, everywhere.",
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Instant Liquidity",
      description: "Trade your tokenized assets on secondary markets with ease.",
    },
    {
      icon: <Eye className="h-8 w-8 text-red-600" />,
      title: "Transparent & Auditable",
      description: "All transactions are recorded on the blockchain, ensuring full transparency.",
    },
  ]

  return (
    <section id="features" className="py-20 bg-white text-sky-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-12 text-sky-950">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-sky-950 p-8 rounded-xl border border-gray-800 shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="mb-4 p-3 rounded-full bg-white/20 relative z-10">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
