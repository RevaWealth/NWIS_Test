'use client'

import Navbar from "../../sections/navbar"
import Footer from "../../sections/footer"

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 pb-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              Terms and Conditions
            </h1>
            
            <div className="text-gray-400 text-sm leading-relaxed space-y-4">
              <p className="text-center text-gray-300 mb-8">
                <strong>Effective Date:</strong> 05/23/2025<br />
                <strong>Last Updated:</strong> 09/25/2025
              </p>

              <p>
                Welcome to NexusWealth Investment Solutions ("NexusWealth," "we," "us," or "our"). These Terms of Service ("Terms") govern your use of our website, platform, and services (collectively, the "Services"). By accessing or using our Services, you agree to these Terms. If you do not agree, you must not use our Services.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">1. Eligibility</h2>
              <p>To use our Services, you must:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Be at least 18 years of age.</li>
                <li>Have the legal capacity to enter into a binding contract.</li>
                <li>Not be barred under applicable laws, sanctions, or regulatory restrictions.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">2. Services Overview</h2>
              <p>NexusWealth provides a blockchain-powered asset management platform offering:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fractionalized real-world asset investments via tokenization.</li>
                <li>Governance participation through the NexusWealth Investment Solutions (NWIS) token.</li>
                <li>Access to ecosystem tools, reports, and DAO-based decision-making features.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">3. Account Registration</h2>
              <p>You must register for an account to access certain features of the Services. You agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information.</li>
                <li>Maintain the confidentiality of your account credentials.</li>
                <li>Notify us immediately of any unauthorized use of your account.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">4. Token Transactions & Compliance</h2>
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">a. NWIS Tokens</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>NWIS tokens provide governance rights within the NexusWealth ecosystem but do not represent equity, ownership, or profit-sharing in NexusWealth LLC or the BVI Foundation.</li>
                <li>Token holders may participate in governance proposals, treasury allocations, and ecosystem initiatives.</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">b. Regulatory Compliance</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>U.S. investors must meet accredited investor requirements under Regulation D.</li>
                <li>Non-U.S. investors participate under Regulation S, subject to geo-blocking restrictions.</li>
                <li>All token transactions may require KYC/AML verification under applicable laws.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">5. Prohibited Activities</h2>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the Services for unlawful purposes, including money laundering or terrorist financing.</li>
                <li>Circumvent geo-restrictions, transfer restrictions, or compliance safeguards.</li>
                <li>Interfere with the security or functionality of the Services.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">6. Intellectual Property</h2>
              <p>
                All content, trademarks, logos, software, and intellectual property on the platform are owned by NexusWealth or its licensors. Unauthorized use, reproduction, or distribution is prohibited.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">7. DAO Governance</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Governance proposals and voting occur via on-chain or off-chain mechanisms (e.g., Snapshot).</li>
                <li>The BVI Foundation provides legal oversight for DAO treasury execution and compliance.</li>
                <li>NexusWealth reserves the right to veto or delay proposals violating legal obligations.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">8. Disclaimers</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>No Financial Advice:</strong> NexusWealth does not provide investment, legal, or tax advice.</li>
                <li><strong>Token Value Risk:</strong> NWIS tokens and other digital assets are subject to market volatility.</li>
                <li><strong>Service Availability:</strong> We do not guarantee uninterrupted or error-free access to the Services.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">9. Limitation of Liability</h2>
              <p>To the fullest extent permitted by law, NexusWealth, its affiliates, and service providers shall not be liable for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Losses arising from token value fluctuations.</li>
                <li>Unauthorized access to accounts despite reasonable security measures.</li>
                <li>Downtime, errors, or interruptions in Services.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">10. Indemnification</h2>
              <p>You agree to indemnify and hold NexusWealth, its affiliates, and partners harmless from any claims, damages, or liabilities arising from:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your violation of these Terms.</li>
                <li>Your unlawful or fraudulent use of the Services.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">11. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account if you violate these Terms or applicable laws.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">12. Governing Law & Dispute Resolution</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Jurisdiction:</strong> These Terms are governed by the laws of [Jurisdiction – e.g., BVI or Delaware].</li>
                <li><strong>Dispute Resolution:</strong> Disputes shall be resolved via binding arbitration under [ICC/LCIA rules], rather than public courts.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">13. Changes to Terms</h2>
              <p>
                We may update these Terms periodically. Continued use of the Services after changes indicates acceptance of the updated Terms.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">14. Contact Information</h2>
              <p>
                For questions about these Terms, contact us at:<br />
                <strong>Email:</strong> info@nexuswealth.io
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
