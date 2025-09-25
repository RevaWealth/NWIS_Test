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
      image: "/images/Mike.jpg",
      linkedin: "http://linkedin.com/in/michael-sarabian-17a306371",
      twitter: "#",
    },
    {
      name: "Pari Mah",
      role: "Co-Founder & CMO",
      image: "/images/Pari2.jpg",
      linkedin: "https://www.linkedin.com/in/pari-mah-marketingmanager",
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
      name: "Jonathan Goebel",
      role: "CFO",
      image: "/images/Jon2.jpg",
      linkedin: "http://linkedin.com/in/jonathan-goebel-4131726a",
      twitter: "#",
    },
  ]

  return (
    <section id="team" className="py-12 bg-[#000000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-white mb-8">Meet Our Leadership Team</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-[#070b14] p-2 sm:p-4 rounded-xl border border-gray-800 text-center space-y-2 sm:space-y-3 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] mx-auto rounded-full border-2 border-blue-500 overflow-hidden">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-white">{member.name}</h3>
              <p className="text-blue-400 text-xs sm:text-sm">{member.role}</p>
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
