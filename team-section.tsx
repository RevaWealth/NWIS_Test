import Image from "next/image"
import { Linkedin, Twitter } from "lucide-react"
import Link from "next/link"

export default function TeamSection() {
  const teamMembers = [
    {
      name: "Michael Sarabian",
      role: "CEO & Founder",
      image: "/placeholder.svg?height=150&width=150",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Ali JK",
      role: "CTO & Co-Founder",
      image: "/placeholder.svg?height=150&width=150",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Pam Aryan",
      role: "Lead Investment Strategist",
      image: "/placeholder.svg?height=150&width=150",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "David Brown",
      role: "Lead Blockchain Developer",
      image: "/placeholder.svg?height=150&width=150",
      linkedin: "#",
      twitter: "#",
    },
  ]

  return (
    <section id="team" className="py-20 bg-[#0c1220]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-12">Meet Our Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-[#070b14] p-6 rounded-xl border border-gray-800 text-center space-y-4">
              <Image
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                width={150}
                height={150}
                className="rounded-full mx-auto border-2 border-blue-500"
              />
              <h3 className="text-xl font-semibold text-white">{member.name}</h3>
              <p className="text-blue-400">{member.role}</p>
              <div className="flex justify-center space-x-4">
                <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-6 w-6 text-gray-400 hover:text-blue-600" />
                </Link>
                <Link href={member.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-6 w-6 text-gray-400 hover:text-blue-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
