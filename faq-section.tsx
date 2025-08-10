import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/component/UI/accordion"

export default function FAQSection() {
  const faqs = [
    {
      question: "What is NWIS Token?",
      answer:
        "NWIS (NexusWealth Investment Solutions) Token is the native cryptocurrency of the NexusWealth platform, designed to facilitate decentralized investments in real-world assets and provide governance rights to its holders.",
    },
    {
      question: "How can I buy NWIS Tokens?",
      answer:
        "You can purchase NWIS Tokens during our ongoing presale by connecting your crypto wallet (e.g., MetaMask) and exchanging ETH, USDT, or BNB for NWIS. Detailed instructions are available on the token purchase section.",
    },
    {
      question: "What are the benefits of holding NWIS Tokens?",
      answer:
        "Holding NWIS Tokens offers several benefits, including participation in platform governance, staking rewards, reduced transaction fees, and exclusive access to premium investment opportunities.",
    },
    {
      question: "Is the NWIS platform secure?",
      answer:
        "Yes, security is our top priority. Our smart contracts undergo rigorous audits by leading blockchain security firms. We also implement industry-standard security practices to protect user assets and data.",
    },
    {
      question: "When will NWIS be listed on exchanges?",
      answer:
        "Following the successful completion of our presale, we plan to list NWIS on major decentralized exchanges (DEXs) in Q1 2025, with centralized exchange (CEX) listings to follow.",
    },
  ]

  return (
    <section id="faq" className="py-20 bg-[#0c1220] bg-sky-950">
      <div className="container mx-auto px-4">
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
