export default function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-purple-900 to-purple-600 py-2 text-sm font-medium text-white overflow-hidden relative">
      <div className="animate-scroll whitespace-nowrap w-max">
        <span className="inline-block px-4">
          NWIS DAO Token Presale Will Go LIVE Soon! Ready to Own a Stake in a Force that will Revolutionize the Asset Management Industry? • 
        </span>
        <span className="inline-block px-4">
          NWIS DAO Token Presale Will Go LIVE Soon! Ready to Own a Stake in a Force that will Revolutionize the Asset Management Industry? • 
        </span>
        <span className="inline-block px-4">
          NWIS DAO Token Presale Will Go LIVE Soon! Ready to Own a Stake in a Force that will Revolutionize the Asset Management Industry? • 
        </span>
        <span className="inline-block px-4">
          NWIS DAO Token Presale Will Go LIVE Soon! Ready to Own a Stake in a Force that will Revolutionize the Asset Management Industry? • 
        </span>
        <span className="inline-block px-4">
          NWIS DAO Token Presale Will Go LIVE Soon! Ready to Own a Stake in a Force that will Revolutionize the Asset Management Industry? • 
        </span>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-scroll {
          animation: scroll 80s linear infinite;
        }
        
        @media (max-width: 768px) {
          .animate-scroll {
            animation: scroll 60s linear infinite;
          }
        }
        
        @media (max-width: 480px) {
          .animate-scroll {
            animation: scroll 40s linear infinite;
          }
        }
      `}</style>
    </div>
  )
}
