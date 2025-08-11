'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Building2, Users, TrendingUp, Globe, Shield, Target, ArrowRight, ChevronRight } from 'lucide-react'

export default function AboutNexusWealthPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const companyStats = [
    { label: "Assets Under Management", value: "$50B+", description: "Total NWIS token market cap" },
    { label: "Global Reach", value: "150+", description: "Countries with NWIS holders" },
    { label: "Investment Sectors", value: "4", description: "Agriculture, Infrastructure, Energy, Real Estate" },
    { label: "Community Members", value: "10K+", description: "Active NWIS token holders" },
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
      name: "Alex Chen",
      title: "Chief Executive Officer",
      bio: "Former Goldman Sachs executive with 15+ years in institutional investment management",
      image: "/images/placeholder-user.jpg"
    },
    {
      name: "Sarah Rodriguez",
      title: "Chief Technology Officer",
      bio: "Blockchain pioneer and former CTO at major DeFi protocols",
      image: "/images/placeholder-user.jpg"
    },
    {
      name: "Michael Thompson",
      title: "Chief Investment Officer",
      bio: "20+ years experience in alternative investments and real estate tokenization",
      image: "/images/placeholder-user.jpg"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-sky-950 shadow-sm border-b border-sky-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/images/NWIS.png"
                  alt="NWIS logo"
                  width={80}
                  height={80}
                  className="h-12 w-auto object-contain"
                />
              </Link>
            </div>
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-white">About NexusWealth Investment Solutions</h1>
              <p className="text-[#a57e24]">Building the next generation global leader in asset management and financial services</p>
            </div>
            <div className="flex items-center">
              {/* Placeholder for potential future buttons */}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sky-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-sky-900 mb-6">
              Revolutionizing Investment Through Blockchain
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              As a global investment manager and fiduciary to our community, our purpose at NexusWealth is to help everyone experience financial well-being. 
              Since 2023, we've been a leading provider of blockchain-based investment solutions.
            </p>
          </div>

          {/* Company Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyStats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-sky-600 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
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
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    Our Mission
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    NexusWealth Investment Solutions (NWIS) is at the forefront of revolutionizing real-world investment 
                    through decentralized innovation. Our platform leverages blockchain technology to create a transparent, 
                    secure, and accessible ecosystem for wealth creation.
                  </p>
                  <p className="text-lg text-gray-600 mb-6">
                    We believe in empowering individuals to build generational wealth by providing access to diverse 
                    investment opportunities that were traditionally exclusive to institutional and accredited investors.
                  </p>
                  <div className="flex items-center text-sky-600 font-semibold hover:text-sky-700 cursor-pointer">
                    <span>Learn more about our approach</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </div>
                <div className="relative">
                  <Image
                    src="/images/SS5.jpg"
                    alt="Global investment opportunities"
                    width={600}
                    height={400}
                    className="rounded-xl shadow-lg"
                  />
                </div>
              </div>

              {/* Core Values */}
              <div>
                <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {coreValues.map((value, index) => {
                    const Icon = value.icon
                    return (
                      <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-8 w-8 text-sky-600" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h4>
                        <p className="text-gray-600">{value.description}</p>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {leadershipTeam.map((member, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="p-6">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={120}
                        height={120}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      />
                      <h4 className="text-xl font-semibold text-gray-900 text-center mb-2">{member.name}</h4>
                      <p className="text-sky-600 text-center mb-3">{member.title}</p>
                      <p className="text-gray-600 text-center text-sm">{member.bio}</p>
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
                    <span className="text-sky-600 font-bold text-lg">2023</span>
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
                    <span className="text-sky-600 font-bold text-lg">2024</span>
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
                    <span className="text-sky-600 font-bold text-lg">2025</span>
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
