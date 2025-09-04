import Image from "next/image"
import { Linkedin } from "lucide-react"
import Link from "next/link"

export default function TeamSection() {
  // Team member information with LinkedIn profiles
  // IMPORTANT: Update these LinkedIn URLs with the actual profile URLs for your team members
  // Current URLs are placeholders - replace with real LinkedIn profile URLs
  // Format: https://www.linkedin.com/in/username
  const teamMembers = [
    {
      name: "Michael Sarabian",
      role: "Co-Founder & CEO",
      image: "/images/Michael.JPEG",
      linkedin: "http://linkedin.com/in/michael-sarabian-17a306371",
      twitter: "#",
    },
    {
      name: "Jonathan Goebel",
      role: "Co-Founder & CFO",
      image: "/images/Jon.jpg",
      linkedin: "http://linkedin.com/in/jonathan-goebel-4131726a",
      twitter: "#",
    },
    {
      name: "Ali JK",
      role: "Co-Founder & CTO",
      image: "/images/Ali.jpg",
      linkedin: "https://www.linkedin.com/in/ali-jk",
      twitter: "#",
    },
    {
      name: "Pari Mah",
      role: "VP of Marketing",
      image: "/images/Pari.jpg",
      linkedin: "https://www.linkedin.com/in/pari-mah-marketingmanager",
      twitter: "#",
    },
  ]

  return (
    <section id="team" className="py-20 bg-[#0c1220] bg-sky-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-white mb-12">Meet Our Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-[#070b14] p-6 rounded-xl border border-gray-800 text-center space-y-4 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-[150px] h-[150px] mx-auto rounded-full border-2 border-blue-500 overflow-hidden">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-white">{member.name}</h3>
              <p className="text-blue-400">{member.role}</p>
              <div className="flex justify-center">
                <Link 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative p-2 rounded-lg hover:bg-blue-600/10 transition-all duration-200"
                  title={`View ${member.name}'s LinkedIn Profile`}
                  aria-label={`View ${member.name}'s LinkedIn Profile`}
                >
                  <Linkedin className="h-6 w-6 text-gray-400 hover:text-blue-600 transition-colors duration-200" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    LinkedIn Profile
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
