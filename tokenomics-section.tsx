import Image from "next/image"

export default function TokenomicsSection() {
  return (
    <section id="tokenomics" className="py-20 bg-[#0c1220]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-12">NWIS Tokenomics</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-gray-300">
            <p>
              The NWIS token is designed to be the backbone of the NexusWealth ecosystem, facilitating transactions,
              governance, and value accrual for its holders.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="font-semibold text-white">Total Supply:</span> 1,000,000,000 NWIS
              </li>
              <li>
                <span className="font-semibold text-white">Presale Allocation:</span> 20%
              </li>
              <li>
                <span className="font-semibold text-white">Liquidity Pool:</span> 15%
              </li>
              <li>
                <span className="font-semibold text-white">Staking Rewards:</span> 25%
              </li>
              <li>
                <span className="font-semibold text-white">Team & Advisors:</span> 15% (vested)
              </li>
              <li>
                <span className="font-semibold text-white">Ecosystem Development:</span> 20%
              </li>
              <li>
                <span className="font-semibold text-white">Marketing & Partnerships:</span> 5%
              </li>
            </ul>
            <p>
              Our tokenomics model ensures long-term sustainability, incentivizes participation, and aligns the
              interests of all stakeholders.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Tokenomics Distribution"
              width={600}
              height={400}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
