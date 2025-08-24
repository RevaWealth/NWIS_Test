import Image from "next/image"

export default function PartnersSection() {
  const partners = [
    { name: "Partner 1", logo: "/placeholder.svg?height=80&width=150" },
    { name: "Partner 2", logo: "/placeholder.svg?height=80&width=150" },
    { name: "Partner 3", logo: "/placeholder.svg?height=80&width=150" },
    { name: "Partner 4", logo: "/placeholder.svg?height=80&width=150" },
    { name: "Partner 5", logo: "/placeholder.svg?height=80&width=150" },
    { name: "Partner 6", logo: "/placeholder.svg?height=80&width=150" },
  ]

  return (
    <section id="partners" className="py-20 bg-[#070b14] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-white mb-12">Our Valued Partners</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-center">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex justify-center items-center p-4 bg-[#0c1220] rounded-lg border border-gray-800"
            >
              <Image
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                width={150}
                height={80}
                className="object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
