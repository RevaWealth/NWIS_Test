import { Gem, ShieldCheck, TrendingUp, Users } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-blue-500" />,
      title: "Secure & Transparent",
      description: "Leveraging blockchain for immutable records and unparalleled security.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      title: "High-Growth Potential",
      description: "Access to curated real-world assets and DeFi opportunities.",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Community Driven",
      description: "Participate in governance and shape the future of NexusWealth.",
    },
    {
      icon: <Gem className="h-8 w-8 text-yellow-500" />,
      title: "Exclusive Benefits",
      description: "NWIS token holders enjoy staking rewards, fee discounts, and more.",
    },
  ]

  return (
    <section id="features" className="py-20 bg-[#070b14]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-12">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-[#0c1220] p-8 rounded-xl border border-gray-800 text-center space-y-4">
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
