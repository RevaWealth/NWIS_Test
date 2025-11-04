'use client'

import { X, Instagram } from 'lucide-react'
import { Fragment, useState } from 'react'

interface SocialMediaModalProps {
  isOpen: boolean
  onClose: () => void
  onQuestComplete?: () => void
}

export function SocialMediaModal({ isOpen, onClose, onQuestComplete }: SocialMediaModalProps) {
  const [xPostLink, setXPostLink] = useState('')
  const [instagramPostLink, setInstagramPostLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const validateSocialLinks = (xLink: string, igLink: string) => {
    // X (Twitter) URL patterns
    const xPatterns = [
      /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status\/\d+/i,
      /^https?:\/\/(www\.)?x\.com\/\w+\/status\/\d+/i,
      /^https?:\/\/(www\.)?twitter\.com\/\w+\/status\/\d+/i
    ]
    
    // Instagram URL patterns
    const igPatterns = [
      /^https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?/i,
      /^https?:\/\/(www\.)?instagram\.com\/reel\/[A-Za-z0-9_-]+\/?/i,
      /^https?:\/\/(www\.)?instagram\.com\/tv\/[A-Za-z0-9_-]+\/?/i
    ]
    
    const isValidX = xPatterns.some(pattern => pattern.test(xLink))
    const isValidIG = igPatterns.some(pattern => pattern.test(igLink))
    
    return { isValidX, isValidIG }
  }

  // Get validation results for current inputs
  const validation = validateSocialLinks(xPostLink.trim(), instagramPostLink.trim())
  const isFormValid = xPostLink.trim() && instagramPostLink.trim() && validation.isValidX && validation.isValidIG

  const handleSubmit = async () => {
    if (!xPostLink.trim() || !instagramPostLink.trim()) {
      alert('Please provide both X and Instagram post links')
      return
    }

    // Validate URL formats
    const { isValidX, isValidIG } = validateSocialLinks(xPostLink.trim(), instagramPostLink.trim())
    
    if (!isValidX) {
      alert('Please provide a valid X (Twitter) post link. Format: https://x.com/username/status/1234567890')
      return
    }
    
    if (!isValidIG) {
      alert('Please provide a valid Instagram post link. Format: https://www.instagram.com/p/ABC123/')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Generate mock wallet address for demo
      const mockWalletAddress = '0x' + Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')
      
      // Log the social media quest completion
      const response = await fetch('/api/quest-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: mockWalletAddress,
          transactionHash: `social-${Date.now()}`, // Mock hash for social quest
          questId: 2, // Social Media Champion Quest
          timestamp: new Date().toISOString(),
          xPostLink: xPostLink.trim(),
          instagramPostLink: instagramPostLink.trim()
        })
      })

      if (response.ok) {
        alert('Social Media Quest submitted successfully! Your posts will be reviewed.')
        setXPostLink('')
        setInstagramPostLink('')
        onQuestComplete?.() // Call the callback to update progress
        onClose()
      } else {
        console.error('Failed to submit social media quest')
        alert('Failed to submit quest. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting social media quest:', error)
      alert('Error submitting quest. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Fragment>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-8 max-w-md w-full shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Follow NWIS on Social Media</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <p className="text-gray-300 mb-6">
              Follow NWIS on X (Twitter) and Instagram to complete this quest. Tag us in a post!
            </p>

            {/* Social Media Links */}
            <div className="flex flex-col gap-4">
              <a
                href="https://x.com/nwis_llc?s=21&t=TI3W-zvEjbOFY6gcvBl4hg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
              >
                <div className="p-2 bg-blue-500 rounded-lg">
                  <X className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">Follow on X (Twitter)</p>
                  <p className="text-gray-400 text-sm">@nwis_llc</p>
                </div>
                <div className="text-[#a57e24]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>

              <a
                href="https://www.instagram.com/invites/contact/?igsh=1ud3admh9by2p&utm_content=zh0j9ko"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
              >
                <div className="p-2 bg-pink-500 rounded-lg">
                  <Instagram className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">Follow on Instagram</p>
                  <p className="text-gray-400 text-sm">NWIS Official</p>
                </div>
                <div className="text-[#a57e24]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-[#a57e24]">How to complete:</span>
                <br />
                1. Follow both accounts<br />
                2. Create a post tagging NWIS<br />
                3. Submit the links to your posts below
              </p>
            </div>

            {/* Post Link Input Fields */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  X (Twitter) Post Link
                </label>
                <input
                  type="url"
                  value={xPostLink}
                  onChange={(e) => setXPostLink(e.target.value)}
                  placeholder="https://x.com/yourusername/status/1234567890"
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a57e24] focus:border-transparent ${
                    xPostLink && !validation.isValidX 
                      ? 'border-red-500' 
                      : 'border-gray-600'
                  }`}
                />
                {xPostLink && !validation.isValidX && (
                  <p className="text-red-400 text-xs mt-1">
                    Please enter a valid X post URL (e.g., https://x.com/username/status/1234567890)
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Instagram Post Link
                </label>
                <input
                  type="url"
                  value={instagramPostLink}
                  onChange={(e) => setInstagramPostLink(e.target.value)}
                  placeholder="https://www.instagram.com/p/ABC123/"
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a57e24] focus:border-transparent ${
                    instagramPostLink && !validation.isValidIG 
                      ? 'border-red-500' 
                      : 'border-gray-600'
                  }`}
                />
                {instagramPostLink && !validation.isValidIG && (
                  <p className="text-red-400 text-xs mt-1">
                    Please enter a valid Instagram post URL (e.g., https://www.instagram.com/p/ABC123/)
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
              className="w-full mt-6 px-6 py-3 bg-[#a57e24] hover:bg-[#8a671d] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quest'}
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
