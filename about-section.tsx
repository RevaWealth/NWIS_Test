import Image from "next/image"

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-[#000000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-white mb-16">About NexusWealth</h2>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <p className="text-base text-white leading-relaxed">
              NexusWealth Investment Solutions (NWIS) is at the forefront of revolutionizing real-world investment
              through decentralized innovation. Our platform leverages blockchain technology to create a transparent,
              secure, and accessible ecosystem to create and manage wealth.
            </p>
            <p className="text-base text-white leading-relaxed">
              We believe in empowering individuals to build generational wealth by providing access to diverse
              investment opportunities that were traditionally exclusive. This approach not only enhances liquidity but
              also reduces traditional barriers to entry, offering unprecedented access to lucrative investment avenues,
              including Agriculture, Infrastructure, Renewable Energy, and Real Estate.
            </p>
            <p className="text-base text-white leading-relaxed">
            </p>
          </div>
          <div className="flex justify-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="rounded-xl shadow-lg w-full max-w-[600px] h-[400px] object-cover"
            >
              <source src="/images/ST1.mp4" type="video/mp4" />
              {/* Fallback image if video fails to load */}
              <Image
                src="/images/NWISTDT.png"
                alt="Family running together in a sunny field — freedom and prosperity"
                width={600}
                height={400}
                className="rounded-xl shadow-lg"
                sizes="(min-width: 768px) 600px, 100vw"
                priority
              />
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}
