import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/UI/accordion"

export default function FAQSection() {
  const faqs = [
    {
      question: "What is NWIS Token?",
      answer:
        "The NWIS token is the governance and participation token of the NexusWealth ecosystem, enabling holders to propose and vote on asset management strategies, treasury allocations, and platform upgrades. It provides decentralized decision-making power without representing equity, ownership, or profit-sharing rights in NexusWealth or its affiliated entities.",
    },
    {
      question: "How can I buy NWIS Tokens?",
      answer:
        "You can purchase NWIS Tokens during our ongoing presale by connecting your crypto wallet (e.g., MetaMask) and exchanging ETH, USDT, or USDC for NWIS. Detailed instructions are available on the token purchase section.",
    },
    {
      question: "What are the benefits of holding NWIS Tokens?",
      answer:
        "Here are the key benefits of holding NWIS tokens:\n\nGovernance Participation – Token holders can propose and vote on important decisions such as asset acquisition strategies, treasury allocations, ecosystem grants, and platform upgrades.\n\nStaking Incentives & Rewards – Participants may stake NWIS tokens to earn rewards or access premium features within the NexusWealth ecosystem.\n\nEarly Access & Ecosystem Privileges – Token holders can gain early or exclusive access to new tokenized asset offerings, platform tools, or community programs.\n\nTreasury Transparency & Influence – Voting power allows holders to directly influence how DAO treasury funds are managed and deployed.\n\nLong-Term Ecosystem Alignment – Tokenomics are designed to reward long-term holders and active participants, aligning incentives across the community.",
    },
    {
      question: "Is the NWIS platform secure?",
      answer:
        "Yes, security is our top priority. Our smart contracts undergo rigorous audits by leading blockchain security firms. We also implement industry-standard security practices to protect user assets and data.",
    },
    {
      question: "When will NWIS be listed on exchanges?",
      answer:
        "Following the successful completion of our presale, we plan to list NWIS on major exchanges in Q1 2026.",
    },
  ]

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-700">
              <AccordionTrigger className="text-lg font-semibold text-white hover:text-blue-400">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 py-4">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
