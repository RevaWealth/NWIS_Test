import Navbar from "../../sections/navbar"
import Footer from "../../sections/footer"

export default function Careers() {
  return (
    <div className="flex flex-col min-h-screen bg-[#070b14]">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Job Openings
          </h1>
          <p className="text-sm text-gray-400 mb-8">
            No job openings are available at this time.
          </p>
          
          <div className="bg-[#000000] rounded-xl border border-gray-800 p-8 md:p-12">
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              You think you got what it takes to be a member of our legendary team? 
              We love to hear from you! Please email your extraordinary resume to{" "}
              <a 
                href="mailto:Careers@NWIS.io" 
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-semibold"
              >
                Careers@NWIS.io
              </a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
