'use client'

import Navbar from "../../sections/navbar"
import Footer from "../../sections/footer"

export default function RiskFactorsPage() {
  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 pb-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              Risk Factors
            </h1>
            
            <div className="text-gray-400 text-sm leading-relaxed space-y-4">
              <h2 className="text-2xl font-semibold text-white mb-4">Global Institutional Website Attestation</h2>
              <p>
                Please read this page before proceeding, as it explains certain restrictions imposed by law on the distribution of this information and the countries in which our funds are authorised for sale. It is your responsibility to be aware of and to observe all applicable laws and regulations of any relevant jurisdiction.
              </p>
              <p>
                By clicking to enter this website, the entrant has agreed that you have reviewed and agreed to the terms contained herein in entirety including any legal or regulatory rubric and have consented to the collection, use and disclosure of your personal information as set out in the Privacy section referred to below.
              </p>
              <p>
                By confirming that you have read this important information, you also:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Agree that all access to this website by you will be subject to the disclaimer, risk warnings and other information set out herein; and</li>
                <li>Agree that you are within the respective sophisticated type of audience (or professional/sophisticated /institutional/ qualified investors, as such term may apply in local jurisdictions), and where applicable, meet the requisite investor qualification, for your respective jurisdictions.</li>
              </ul>
              <p>
                The information contained in this website (this "Website") including the documents herein (together, the "Contents") is made available for informational purposes only.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
