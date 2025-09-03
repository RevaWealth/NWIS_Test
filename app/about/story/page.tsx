'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Building2, Users, TrendingUp, Globe, Shield, Target, ArrowRight, ChevronRight } from 'lucide-react'
import Navbar from '../../../navbar'

export default function AboutNexusWealthPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['overview', 'principles', 'leadership', 'history', 'sustainability'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const companyStats = [
    { label: "Assets Under Management", value: "Coming Soon", description: "Total NWIS token market cap" },
    { label: "Global Reach", value: "Coming Soon", description: "Countries with NWIS holders" },
    { label: "Investment Sectors", value: "Coming Soon", description: "Agriculture, Infrastructure, Energy, Real Estate" },
    { label: "Community Members", value: "Coming Soon", description: "Active NWIS token holders" },
  ]
  const coreValues = [
    {
      icon: Shield,
      title: "Transparency",
      description: "Complete visibility into all investment decisions and token allocations"
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Cutting-edge blockchain technology for democratized investment access"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Breaking down geographical barriers to premium investment opportunities"
    },
    {
      icon: TrendingUp,
      title: "Growth",
      description: "Sustainable wealth creation through diversified tokenized assets"
    }
  ]

  const leadershipTeam = [
    {
      name: "Michael Sarabian",
      title: "Co-Founder & CEO",
      bio: "Visionary leader with extensive experience in blockchain technology and Solutions Architecture, driving NexusWealth's mission to democratize investment opportunities.",
      image: "/images/Michael.JPEG"
    },
    {
      name: "Jonathan Goebel",
      title: "Co-Founder & CFO",
      bio: "Financial strategist with deep expertise in corporate finance and investment management, ensuring sustainable growth and financial excellence.",
      image: "/images/Jon.jpg"
    },
    {
      name: "Ali JK",
      title: "Co-Founder & CTO",
      bio: "Technology innovator and blockchain expert, leading the development of cutting-edge tokenization platforms and secure investment infrastructure.",
      image: "/images/Ali.jpg"
    },
    {
      name: "Pari Mah",
      title: "VP of Marketing",
      bio: "Marketing strategist with proven track record in building brand awareness and driving community engagement in the E-commerce and fintech space.",
      image: "/images/Pari.jpg"
    }
  ]
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />
      
      {/* Header */}
      <div className="bg-sky-950 shadow-sm border-b border-sky-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">About NexusWealth Investment Solutions</h1>
              <p className="text-[#a57e24]">Building the next generation global leader in asset management and financial services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sky-50 to-blue-50 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-sky-900 mb-4 sm:mb-6">
              Revolutionizing Investment Through Blockchain
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto px-4">
              As a global investment manager and fiduciary to our community, our purpose at NexusWealth is to help everyone experience financial well-being. 
              Since 2023, we've been a leading provider of blockchain-based investment solutions.
            </p>
          </div>

          {/* Company Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {companyStats.map((stat, index) => (
              <div key={index} className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="text-2xl sm:text-3xl font-bold text-sky-600 mb-2">{stat.value}</div>
                <div className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-xs sm:text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap justify-center sm:justify-start space-x-2 sm:space-x-4 md:space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'principles', label: 'Principles' },
              { id: 'leadership', label: 'Leadership' },
              { id: 'history', label: 'History' },
              { id: 'sustainability', label: 'Sustainability' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8 sm:space-y-12 md:space-y-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-start lg:items-center">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Our Mission
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                    NexusWealth Investment Solutions (NWIS) is at the forefront of revolutionizing real-world investment 
                    through decentralized innovation. Our platform leverages blockchain technology to create a transparent, 
                    secure, and accessible ecosystem for wealth creation.
                  </p>
                  <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                    We believe in empowering individuals to build generational wealth by providing access to diverse 
                    investment opportunities that were traditionally exclusive to institutional and accredited investors.
                  </p>
                  <div className="flex items-center text-sky-600 font-semibold hover:text-sky-700 cursor-pointer">
                    <span>Learn more about our approach</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </div>
                <div className="relative">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="rounded-xl shadow-lg w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover"
                  >
                    <source src="/images/ST2.mp4" type="video/mp4" />
                    {/* Fallback image if video fails to load */}
                    <Image
                      src="/images/SS5.jpg"
                      alt="Global investment opportunities"
                      width={600}
                      height={400}
                      className="rounded-xl shadow-lg"
                    />
                  </video>
                </div>
              </div>

              {/* Core Values */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Our Core Values</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                  {coreValues.map((value, index) => {
                    const Icon = value.icon
                    return (
                      <div key={index} className="text-center p-4 sm:p-6 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-sky-600" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{value.title}</h4>
                        <p className="text-sm sm:text-base text-gray-600">{value.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Principles Tab */}
          {activeTab === 'principles' && (
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Our Investment Principles</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-8 rounded-lg">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Democratization of Finance</h4>
                  <p className="text-gray-600 mb-4">
                    We believe that access to premium investment opportunities should not be limited by geography, 
                    wealth, or institutional barriers. Our tokenization approach makes high-quality assets accessible to everyone.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-sky-600 mr-2" />
                      Fractional ownership of premium assets
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-sky-600 mr-2" />
                      Global accessibility through blockchain
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-sky-600 mr-2" />
                      Reduced minimum investment requirements
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-8 rounded-lg">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Sustainable Growth</h4>
                  <p className="text-gray-600 mb-4">
                    Our investment strategy focuses on long-term value creation through sustainable practices and 
                    responsible asset management that benefits both investors and communities.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-sky-600 mr-2" />
                      Environmental responsibility
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-sky-600 mr-2" />
                      Social impact considerations
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-sky-600 mr-2" />
                      Long-term value creation
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Leadership Tab */}
          {activeTab === 'leadership' && (
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Our Leadership Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {leadershipTeam.map((member, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="p-6">
                      <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 text-center mb-2">{member.name}</h4>
                      <p className="text-sky-600 text-center mb-3 font-medium">{member.title}</p>
                      <p className="text-gray-600 text-center text-sm leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Our Journey</h3>
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sky-600 font-bold text-lg">2024</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Foundation</h4>
                    <p className="text-gray-600">
                      NexusWealth was founded with a vision to democratize access to premium investment opportunities 
                      through blockchain technology and tokenization.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sky-600 font-bold text-lg">2025</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Platform Launch</h4>
                    <p className="text-gray-600">
                      Successfully launched our tokenization platform and began offering NWIS tokens to the public, 
                      marking a new era in democratized investment.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sky-600 font-bold text-lg">2026</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Global Expansion</h4>
                    <p className="text-gray-600">
                      Expanding our reach globally and introducing new tokenized asset classes to provide even more 
                      diverse investment opportunities for our community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sustainability Tab */}
          {activeTab === 'sustainability' && (
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Our Commitment to Sustainability</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-green-50 p-8 rounded-lg border border-green-200">
                  <h4 className="text-xl font-semibold text-green-800 mb-4">Environmental Responsibility</h4>
                  <p className="text-green-700 mb-4">
                    We prioritize investments in renewable energy, sustainable agriculture, and green infrastructure 
                    projects that contribute to environmental conservation and climate action.
                  </p>
                  <ul className="space-y-2 text-green-700">
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-green-600 mr-2" />
                      Renewable energy projects
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-green-600 mr-2" />
                      Sustainable agriculture
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-green-600 mr-2" />
                      Green infrastructure
                    </li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-8 rounded-lg border border-blue-200">
                  <h4 className="text-xl font-semibold text-blue-800 mb-4">Social Impact</h4>
                  <p className="text-blue-700 mb-4">
                    Our investments are designed to create positive social impact, supporting communities and 
                    promoting inclusive economic growth across all regions.
                  </p>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-blue-600 mr-2" />
                      Community development
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-blue-600 mr-2" />
                      Job creation
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-blue-600 mr-2" />
                      Inclusive growth
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-sky-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Join the Future of Investment
          </h3>
          <p className="text-xl text-sky-200 mb-8 max-w-3xl mx-auto">
            Become part of the NexusWealth community and start building your generational wealth through 
            our innovative tokenization platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/token-purchase"
              className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Buy NWIS Tokens
            </Link>
            <Link
              href="/contact"
              className="border border-sky-300 text-sky-300 hover:bg-sky-800 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
