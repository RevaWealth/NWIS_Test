'use client'

import Navbar from "../../sections/navbar"
import Footer from "../../sections/footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 pb-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
              Privacy Policy
            </h1>
            
            <div className="text-gray-400 text-sm leading-relaxed space-y-4">
              <div className="text-center mb-8">
                <p className="text-gray-300">
                  <strong>Effective Date:</strong> 05/01/2025
                </p>
                <p className="text-gray-300">
                  <strong>Last Updated:</strong> 09/09/2025
                </p>
              </div>

              <p>
                NexusWealth Investment Solutions ("NexusWealth," "we," "us," or "our") values your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you access our website, platform, and related services (the "Services").
              </p>

              <p>
                By using our Services, you consent to the data practices described in this Privacy Policy.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">1. Information We Collect</h2>
              <p>
                We may collect the following types of information:
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">a. Information You Provide to Us</h3>
              <p>
                <strong>Personal Identification Information:</strong> Name, email address, phone number, mailing address, KYC/AML documentation for identity verification.
              </p>
              <p>
                <strong>Financial Information:</strong> Payment details, wallet addresses, investment amounts (for token purchases or asset participation).
              </p>
              <p>
                <strong>Account Credentials:</strong> Username, passwords, or authentication credentials for our platform.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">b. Information Collected Automatically</h3>
              <p>
                <strong>Log and Usage Data:</strong> IP address, browser type, device identifiers, access times, and pages viewed.
              </p>
              <p>
                <strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and analytics tools to enhance user experience and measure site traffic.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">c. Information from Third Parties</h3>
              <p>
                We may receive information from regulatory authorities, KYC/AML service providers, or financial institutions for compliance and risk mitigation purposes.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">2. How We Use Your Information</h2>
              <p>
                We use the collected information to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, operate, and maintain the Services.</li>
                <li>Verify user identity to comply with KYC/AML regulations.</li>
                <li>Facilitate token purchases and manage investor accounts.</li>
                <li>Communicate updates, transaction confirmations, and customer support.</li>
                <li>Analyze platform performance and improve user experience.</li>
                <li>Comply with legal, tax, and regulatory obligations (e.g., SEC, CFTC, GDPR, CCPA).</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">3. Legal Basis for Processing (GDPR Compliance)</h2>
              <p>
                If you are in the European Economic Area (EEA), we rely on the following legal bases for processing your information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Consent:</strong> When you voluntarily provide personal data.</li>
                <li><strong>Contractual Necessity:</strong> To perform our obligations under service agreements or token purchases.</li>
                <li><strong>Legal Obligations:</strong> For financial regulations, anti-fraud, or AML compliance.</li>
                <li><strong>Legitimate Interests:</strong> To improve services, security, and platform analytics.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">4. Sharing Your Information</h2>
              <p>
                We do not sell your personal data. We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Providers:</strong> Cloud hosting, payment processors, KYC/AML vendors.</li>
                <li><strong>Regulatory Authorities:</strong> When required by law or financial regulations.</li>
                <li><strong>Affiliates and Partners:</strong> Only to the extent necessary to provide services or comply with regulations.</li>
                <li><strong>Business Transfers:</strong> In case of mergers, acquisitions, or restructuring events.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">5. Data Retention</h2>
              <p>
                We retain personal information only for as long as necessary to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide Services.</li>
                <li>Meet regulatory compliance (e.g., financial record-keeping requirements).</li>
                <li>Resolve disputes and enforce agreements.</li>
              </ul>
              <p>
                After the retention period, we securely delete or anonymize your data.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">6. Your Data Rights</h2>
              <p>
                Depending on your jurisdiction, you may have the following rights:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data.</li>
                <li><strong>Correction:</strong> Request updates or corrections to inaccurate data.</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information where legally permissible.</li>
                <li><strong>Data Portability:</strong> Request your data in a machine-readable format.</li>
                <li><strong>Opt-Out:</strong> Stop receiving marketing communications.</li>
              </ul>
              <p>
                For EU/EEA residents, these rights align with GDPR requirements. For California residents, these rights align with CCPA provisions.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">7. Data Security</h2>
              <p>
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Encryption:</strong> SSL/TLS protocols for data transmission.</li>
                <li><strong>Access Controls:</strong> Role-based and multi-factor authentication for sensitive data.</li>
                <li><strong>Smart Contract Security:</strong> Third-party audits for token and treasury contracts.</li>
              </ul>
              <p>
                However, no method of transmission over the internet or electronic storage is completely secure.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">8. Cross-Border Data Transfers</h2>
              <p>
                If you access our Services outside of [Company Jurisdiction], your information may be transferred and processed in countries with different data protection laws.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">9. Third-Party Links</h2>
              <p>
                Our Services may link to third-party websites or dApps. This Privacy Policy does not apply to external sites. We encourage reviewing their privacy practices.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">10. Children's Privacy</h2>
              <p>
                Our Services are not intended for individuals under 18. We do not knowingly collect personal information from minors.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">11. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised "Last Updated" date.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">12. Contact us</h2>
              <p>
                For privacy-related inquiries or to exercise your data rights, contact us at:
              </p>
              <p>
                <strong>Email:</strong> Support@NWIS.io
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
