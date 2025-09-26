"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import Navbar from "../../sections/navbar"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Create mailto link with form data
      const mailtoLink = `mailto:Support@NWIS.io?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`
      
      // Open default email client
      window.location.href = mailtoLink
      
      setSubmitStatus("success")
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-blue-900 to-[#000000]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Contact us
          </h1>
          <p className="text-xl text-sky-200 max-w-3xl mx-auto">
            Have questions about NWIS? Need support? We're here to help you on your journey to financial freedom.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Get in Touch</h2>
              <p className="text-sky-200 mb-8">
                Our support team is ready to assist you with any questions about NWIS tokens, 
                investment opportunities, or technical support.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-sky-600 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Email Support</h3>
                  <p className="text-sky-200">Support@NWIS.io</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-sky-600 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Response Time</h3>
                  <p className="text-sky-200">5 to 7 business days</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-sky-600 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Global Support</h3>
                  <p className="text-sky-200">Available worldwide</p>
                </div>
              </div>
            </div>

            <div className="bg-sky-900/50 p-6 rounded-lg border border-sky-700">
              <h3 className="text-white font-semibold mb-3">Why Contact us?</h3>
              <ul className="text-sky-200 space-y-2 text-sm">
                <li>• Technical support with wallet connections</li>
                <li>• Questions about NWIS token purchases</li>

                <li>• Partnership opportunities</li>
                <li>• General inquiries about our platform</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-sky-200 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-sky-200 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-sky-200 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-sky-200 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
              </button>

              {submitStatus === "success" && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg text-center">
                  Message sent successfully! Your email client should open with the message ready to send.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-center">
                  There was an error. Please try again or email us directly at Support@NWIS.io
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sky-300 text-sm">
                Or email us directly at{" "}
                <a 
                  href="mailto:Support@NWIS.io" 
                  className="text-sky-200 hover:text-white underline"
                >
                  Support@NWIS.io
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
