import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/component/UI/dialog"
import { Button } from "@/component/UI/button"
import { useState, useRef, useEffect } from "react"
import { getDialogConfig, isWalletBrowser } from "@/lib/wallet-browser-utils"

interface TokenPurchaseAgreementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAgree: () => void
}

export const TokenPurchaseAgreementDialog = ({ 
  open, 
  onOpenChange, 
  onAgree 
}: TokenPurchaseAgreementDialogProps) => {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isWallet = isWalletBrowser()
  const dialogConfig = getDialogConfig()

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    onOpenChange(false)
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10
    setIsScrolledToBottom(isAtBottom)
  }

  // Reset scroll state when dialog opens
  useEffect(() => {
    if (open) {
      setIsScrolledToBottom(false)
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0
      }
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`${isWallet ? 'max-w-[95vw]' : 'sm:max-w-4xl'} bg-sky-950 border-sky-800 flex flex-col`}
        style={{
          zIndex: dialogConfig.zIndex,
          maxWidth: isWallet ? '95vw' : undefined,
          maxHeight: dialogConfig.maxHeight,
          margin: dialogConfig.margin,
        }}
      >
        <DialogTitle className="text-xl font-bold text-white mb-4 flex-shrink-0">
          Token Purchase Agreement
        </DialogTitle>
        <DialogDescription className="text-gray-300 mb-4 flex-shrink-0">
          Please review the Token Purchase Agreement carefully before proceeding. You must scroll to the bottom to enable the Agree button.
        </DialogDescription>
        
        <div className={`flex-1 bg-white rounded-lg overflow-hidden mb-4`}>
          <div 
            ref={scrollRef}
            className={`h-full overflow-y-auto ${isWallet ? 'p-2' : 'p-4 sm:p-6'}`}
            onScroll={handleScroll}
            style={{
              maxHeight: '60vh',
              minHeight: '400px',
            }}
          >
            <div className="prose prose-sm max-w-none">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Token Purchase Agreement (TPA)</h1>
              
              <p className="text-gray-700 mb-4">
                This Token Purchase Agreement ("Agreement") is between:
              </p>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-2"><strong>Issuer:</strong> NexusWealth Foundation, a non-profit entity organized under the laws of British Virgin Island (the "Issuer").</p>
                <p className="text-gray-700 mb-2"><strong>Purchaser:</strong> The individual or entity executing this Agreement (the "Purchaser").</p>
                <p className="text-gray-700 mb-2"><strong>Operating Entity:</strong> NexusWealth LLC, a U.S.-based entity managing the NexusWealth Investment Solutions ecosystem (the "Operating Entity").</p>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Purpose and Intent</h2>
              <div className="mb-6">
                <p className="text-gray-700 mb-2">1.1 The Purchaser agrees to buy, and the Issuer agrees to sell, NWIS tokens ("Tokens") for use within the NexusWealth Investment Solutions ecosystem (the "Ecosystem").</p>
                <p className="text-gray-700 mb-2">1.2 Tokens are not securities, do not represent equity or ownership, and carry no profit-sharing, dividend, or distribution rights.</p>
                <p className="text-gray-700 mb-2">1.3 Tokens are solely for governance and participation purposes as outlined in the Governance Token Policy incorporated herein.</p>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Purchase Terms</h2>
              <div className="mb-6">
                <p className="text-gray-700 mb-2">2.1 Purchase Price: Starting at $0.001 per Token, payable in ETH / USDC / USDT at the time of purchase.</p>
                <p className="text-gray-700 mb-2">2.2 Delivery: Tokens will be delivered to the Purchaser's designated blockchain wallet address upon:</p>
                <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                  <li>Receipt of payment</li>
                  <li>Confirmation of jurisdictional eligibility</li>
                </ul>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Representations of the Purchaser</h2>
              <div className="mb-6">
                <p className="text-gray-700 mb-2">The Purchaser represents and warrants that:</p>
                <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                  <li>They have read and accepted the Token Purchase Disclaimer;</li>
                  <li>They are not purchasing Tokens for speculative or investment purposes;</li>
                  <li>If located in the U.S., they are an accredited investor under Regulation D;</li>
                  <li>If outside the U.S., they qualify under Regulation S for non-U.S. persons;</li>
                  <li>They comply with all laws of their jurisdiction regarding digital assets.</li>
                </ul>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Token Utility & Governance</h2>
              <div className="mb-6">
                <p className="text-gray-700 mb-2">4.1 Tokens may be used for:</p>
                <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                  <li>Voting on proposals</li>
                  <li>Participating in community governance</li>
                  <li>Accessing certain features within the Ecosystem</li>
                </ul>
                <p className="text-gray-700 mb-2">4.2 Tokens grant no rights to company equity, no claims on assets, and no entitlement to profits.</p>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Transfer Restrictions</h2>
              <div className="mb-6">
                <p className="text-gray-700 mb-2">5.1 Tokens purchased under Reg D may not be resold in the U.S. for at least 12 months unless permitted by applicable law.</p>
                <p className="text-gray-700 mb-2">5.2 Tokens may not be offered or sold to prohibited jurisdictions or sanctioned individuals/entities (OFAC, FATF lists).</p>
                <p className="text-gray-700 mb-2">5.3 The Issuer reserves the right to implement geofencing and KYC requirements to enforce these restrictions.</p>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Risk Disclosure</h2>
              <div className="mb-6">
                <p className="text-gray-700 mb-2">The Purchaser acknowledges the following risks:</p>
                <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                  <li><strong>Regulatory Risk:</strong> Future laws may affect the use, transfer, or legality of Tokens.</li>
                  <li><strong>Technology Risk:</strong> Smart contracts, blockchain systems, or wallets may fail or be hacked.</li>
                  <li><strong>Market Risk:</strong> Token value may fluctuate; there is no guarantee of liquidity or secondary market availability.</li>
                </ul>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. No Investment Advice</h2>
              <div className="mb-6">
                <p className="text-gray-700 mb-2">The Purchaser agrees that neither the Issuer nor the Operating Entity has provided legal, financial, or tax advice regarding the purchase or holding of Tokens.</p>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Governing Law and Dispute Resolution</h2>
              <div className="mb-6">
                <p className="text-gray-700 mb-2">8.1 This Agreement shall be governed by the laws of British Virgin Islands.</p>
                <p className="text-gray-700 mb-2">8.2 Any disputes shall be resolved by binding arbitration in BVI, under [ICC or LCIA Rules].</p>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Liability Limitation</h2>
              <div className="mb-6">
                <p className="text-gray-700 mb-2">The Issuer and Operating Entity shall not be liable for:</p>
                <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                  <li>Loss of funds due to private key mismanagement</li>
                  <li>Unauthorized transactions by third parties</li>
                  <li>Losses arising from regulatory or technological changes</li>
                </ul>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Entire Agreement</h2>
              <div className="mb-6">
                <p className="text-gray-700 mb-2">This Agreement, together with the Governance Token Policy and Token Purchase Disclaimer, constitutes the entire understanding between the parties regarding the purchase and use of Tokens.</p>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">Exhibits</h2>
              <div className="mb-6">
                <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                  <li>Exhibit A: Governance Token Policy</li>
                  <li>Exhibit B: Token Purchase Disclaimer</li>
                </ul>
              </div>

              <div className="border-t pt-6 mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Exhibit A – Governance Token Policy</h2>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Purpose</h3>
                <div className="mb-6">
                  <p className="text-gray-700 mb-2">This Governance Token Policy ("Policy") governs the rights, responsibilities, and limitations associated with the NWIS Governance Tokens ("Tokens") issued by NexusWealth Foundation (the "Foundation") for use in the NexusWealth Investment Solutions Ecosystem (the "Ecosystem").</p>
                  <p className="text-gray-700 mb-2">This Policy is incorporated by reference into the Token Purchase Agreement ("Agreement") and the Operating Agreement of NexusWealth LLC where applicable.</p>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Nature of Governance Tokens</h3>
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-2">2.1 Non-Security Status</h4>
                  <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                    <li>Tokens are not securities under U.S. or international law to the fullest extent permissible.</li>
                    <li>Tokens do not represent equity, ownership, or membership interests in the NexusWealth Foundation, NexusWealth LLC, or any related entity.</li>
                    <li>Tokens carry no rights to dividends, profit-sharing, or distributions of any kind.</li>
                  </ul>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">2.2 Non-Investment Nature</h4>
                  <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                    <li>Tokens are issued for functional, governance, and participation purposes only within the Ecosystem.</li>
                    <li>The Foundation makes no promises or representations regarding token value, appreciation, or liquidity.</li>
                  </ul>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Governance Rights</h3>
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-2">3.1 Voting Rights</h4>
                  <p className="text-gray-700 mb-2">Each Token provides holders with the right to vote on proposals affecting the Ecosystem, including:</p>
                  <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                    <li>Treasury allocations for community initiatives</li>
                    <li>Protocol feature upgrades or improvements</li>
                    <li>Governance parameter changes (e.g., quorum, voting thresholds)</li>
                    <li>Ecosystem grants or incentive programs</li>
                  </ul>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">3.2 Proposal Submission</h4>
                  <p className="text-gray-700 mb-2">Token holders holding at least X% of circulating tokens may submit proposals for voting.</p>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">3.3 Quorum & Approval</h4>
                  <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                    <li>Votes require at least X% quorum of total circulating tokens.</li>
                    <li>A simple majority (&gt;50%) or supermajority (e.g., 67%) may be required depending on proposal type.</li>
                  </ul>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Treasury Governance</h3>
                <div className="mb-6">
                  <p className="text-gray-700 mb-2">4.1 The Foundation may establish an on-chain treasury for ecosystem development and grant funding.</p>
                  <p className="text-gray-700 mb-2">4.2 Token holders may vote on treasury allocations, subject to multi-signature (multi-sig) execution for security.</p>
                  <p className="text-gray-700 mb-2">4.3 Treasury votes are binding only within the scope defined by this Policy and the Operating Agreement.</p>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Decentralization Roadmap</h3>
                <div className="mb-6">
                  <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                    <li>The Foundation may transfer certain governance powers to token holders over time as the Ecosystem matures.</li>
                    <li>Initial phases may require multi-sig approval or Foundation oversight until full decentralization is feasible.</li>
                  </ul>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Compliance & Legal Restrictions</h3>
                <div className="mb-6">
                  <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                    <li>Tokens are subject to KYC/AML requirements as determined by the Foundation.</li>
                    <li>Tokens may not be offered or sold in prohibited jurisdictions or to restricted persons.</li>
                    <li>The Foundation reserves the right to modify governance processes to comply with applicable laws.</li>
                  </ul>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">7. No Ownership or Profit Rights</h3>
                <div className="mb-6">
                  <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                    <li>Holding Tokens does not provide any ownership claim over the Foundation, NexusWealth LLC, or affiliated entities.</li>
                    <li>Tokens do not entitle holders to financial returns, liquidation rights, or equity distributions.</li>
                  </ul>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Disclaimers & Risk Acknowledgment</h3>
                <div className="mb-6">
                  <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                    <li>The Foundation disclaims all liability for token value, liquidity, or market performance.</li>
                    <li>Token holders assume full responsibility for compliance with local laws and tax obligations.</li>
                  </ul>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">9. Amendments</h3>
                <div className="mb-6">
                  <p className="text-gray-700 mb-2">This Policy may be amended by:</p>
                  <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                    <li>(a) a majority vote of token holders under the governance process, and</li>
                    <li>(b) approval by the Foundation and NexusWealth LLC where legally required.</li>
                  </ul>
                </div>
              </div>

              <div className="border-t pt-6 mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Exhibit B – Token Buyer Disclaimer</h2>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Token Buyer Disclaimer</h3>
                
                <p className="text-gray-700 mb-4 font-semibold">Important Notice to All Purchasers of NexusWealth Investment Solutions Governance Tokens ("NWIS"):</p>
                
                <p className="text-gray-700 mb-4">By purchasing or otherwise acquiring Tokens issued by NexusWealth LLC (the "Foundation") in connection with the NexusWealth Investment Solutions ecosystem (the "Ecosystem"), you acknowledge and agree to the following terms:</p>

                <h4 className="text-md font-semibold text-gray-900 mb-2">1. No Investment or Equity Rights</h4>
                <div className="mb-6">
                  <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                    <li>The Tokens do not represent equity, ownership, or membership interests in NexusWealth Investment Solutions LLC, the Foundation, or any affiliated entity.</li>
                    <li>The Tokens do not grant any right to profits, dividends, revenue-sharing, or distributions of any kind.</li>
                    <li>The purchase of Tokens does not constitute an investment in the Foundation, LLC, or any related business entity.</li>
                  </ul>
                </div>

                <h4 className="text-md font-semibold text-gray-900 mb-2">2. Purpose of Tokens</h4>
                <div className="mb-6">
                  <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                    <li>The Tokens are issued solely for governance and participation within the Ecosystem.</li>
                    <li>Token holders may use Tokens to create and vote on proposals, participate in community governance, or access certain features of the Ecosystem.</li>
                    <li>Tokens are intended to have immediate functional utility and are not sold for speculative purposes.</li>
                  </ul>
                </div>

                <h4 className="text-md font-semibold text-gray-900 mb-2">3. No Expectation of Profit</h4>
                <div className="mb-6">
                  <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                    <li>You acknowledge that no representations, warranties, or guarantees have been made regarding the future value, appreciation, or liquidity of the Tokens.</li>
                    <li>The Foundation and its affiliates expressly disclaim any responsibility for any change in Token value.</li>
                  </ul>
                </div>

                <h4 className="text-md font-semibold text-gray-900 mb-2">4. Regulatory Compliance</h4>
                <div className="mb-6">
                  <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                    <li>The Tokens are not registered securities under the laws of the United States or any other jurisdiction.</li>
                    <li>Tokens may only be offered or sold pursuant to applicable exemptions (e.g., Regulation D, Regulation S) or in compliance with the laws of the purchaser's jurisdiction.</li>
                    <li>Purchasers are solely responsible for ensuring compliance with the laws of their jurisdiction prior to purchasing Tokens.</li>
                  </ul>
                </div>

                <h4 className="text-md font-semibold text-gray-900 mb-2">5. Restrictions on U.S. Persons (if applicable)</h4>
                <div className="mb-6">
                  <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                    <li>Tokens may not be offered or sold to U.S. Persons except as permitted under Regulation D of the Securities Act of 1933.</li>
                    <li>The Foundation may use geofencing or other technological measures to restrict access by U.S. Persons where required.</li>
                  </ul>
                </div>

                <h4 className="text-md font-semibold text-gray-900 mb-2">6. No Professional Advice</h4>
                <div className="mb-6">
                  <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                    <li>Nothing contained in the offering of Tokens constitutes legal, financial, or tax advice.</li>
                    <li>Purchasers should consult with their own legal, financial, and tax advisors prior to any purchase.</li>
                  </ul>
                </div>

                <h4 className="text-md font-semibold text-gray-900 mb-2">7. Assumption of Risk</h4>
                <div className="mb-6">
                  <ul className="list-disc list-inside text-gray-700 mb-2 ml-4">
                    <li>Purchasing Tokens involves significant risks, including regulatory, technological, and market risks.</li>
                    <li>By acquiring Tokens, you acknowledge and accept these risks without recourse against the Foundation, LLC, or their affiliates.</li>
                  </ul>
                </div>

                <h4 className="text-md font-semibold text-gray-900 mb-2">8. Acknowledgment and Acceptance</h4>
                <div className="mb-6">
                  <p className="text-gray-700 mb-2">By proceeding with the purchase of Tokens, you acknowledge that you have read, understood, and accepted this disclaimer and agree to abide by all applicable terms and conditions set forth by the Foundation and its affiliates.</p>
                </div>
              </div>

              {/* Bottom indicator */}
              <div className="text-center py-4 border-t border-gray-200 mt-8">
                <p className="text-sm text-gray-500">
                  {isScrolledToBottom ? "✅ You have reached the end of the agreement" : "📜 Please scroll to the bottom to enable the Agree button"}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`flex ${isWallet ? 'flex-col gap-2' : 'flex-col sm:flex-row justify-center gap-2 sm:gap-4'} flex-shrink-0 mt-auto`}>
          <Button
            onClick={handleClose}
            className={`${isWallet ? 'w-full' : 'w-full sm:w-auto'} px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200`}
          >
            Close
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onAgree()
              onOpenChange(false)
            }}
            disabled={!isScrolledToBottom}
            className={`${isWallet ? 'w-full' : 'w-full sm:w-auto'} px-8 py-3 font-semibold rounded-lg transition-all duration-200 ${
              isScrolledToBottom 
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' 
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            {isScrolledToBottom ? 'Agree' : 'Scroll to Bottom First'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
