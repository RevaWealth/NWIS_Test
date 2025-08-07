import { Gem, ShieldCheck, TrendingUp, Globe, Zap, Lock } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: <Gem className="h-8 w-8 text-purple-400" />,
      title: "Tokenized Real-World Assets",
      description: "Invest in fractionalized real estate, commodities, and more, all on the blockchain.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-blue-400" />,
      title: "Enhanced Security",
      description: "Leveraging blockchain's immutability and cryptographic security for your investments.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-400" />,
      title: "Passive Income Streams",
      description: "Earn returns from real-world assets, distributed directly to your digital wallet.",
    },
    {
      icon: <Globe className="h-8 w-8 text-orange-400" />,
      title: "Global Accessibility",
      description: "Democratizing investment opportunities for everyone, everywhere.",
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: "Instant Liquidity",
      description: "Trade your tokenized assets on secondary markets with ease.",
    },
    {
      icon: <Lock className="h-8 w-8 text-red-400" />,
      title: "Transparent & Auditable",
      description: "All transactions are recorded on the blockchain, ensuring full transparency.",
    },
  ]

  return (
    <section id="features" className="py-20 bg-[#070b14] text-white">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-4xl font-bold mb-12 text-blue-400">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#0c1220] p-8 rounded-xl border border-gray-800 shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="mb-4 p-3 rounded-full bg-gray-800/50">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
