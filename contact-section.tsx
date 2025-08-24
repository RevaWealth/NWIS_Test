import Link from "next/link"
import { Mail, MessageCircle } from "lucide-react"

export default function ContactSection() {
  return (
    <section className="py-20 bg-sky-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Need Help?</h2>
        <p className="text-xl text-sky-200 mb-8 max-w-3xl mx-auto">
          Have questions about NWIS tokens or need technical support? Our team is here to help you on your journey to financial freedom.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-lg rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Contact Support
          </Link>
          
          <a
            href="mailto:Support@NWIS.io"
            className="inline-flex items-center px-8 py-4 border-2 border-sky-300 text-sky-300 hover:bg-sky-800 hover:text-white font-semibold text-lg rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Mail className="h-5 w-5 mr-2" />
            Email Directly
          </a>
        </div>
        
        <div className="mt-8 text-sky-200">
          <p className="text-lg">
            <strong>Support Email:</strong>{" "}
            <a 
              href="mailto:Support@NWIS.io" 
              className="text-sky-300 hover:text-white underline"
            >
              Support@NWIS.io
            </a>
          </p>
                                <p className="text-sm mt-2">Response time: 5 to 7 business days</p>
        </div>
      </div>
    </section>
  )
}
