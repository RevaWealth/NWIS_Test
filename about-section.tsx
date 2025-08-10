import Image from "next/image"

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-[#0c1220] bg-sky-950">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-12">About NexusWealth</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-gray-300">
            <p>
              NexusWealth Investment Solutions (NWIS) is at the forefront of revolutionizing real-world investment
              through decentralized innovation. Our platform leverages blockchain technology to create a transparent,
              secure, and accessible ecosystem to create and manage wealth.
            </p>
            <p>
              We believe in empowering individuals to build generational wealth by providing access to diverse
              investment opportunities that were traditionally exclusive. This approach not only enhances liquidity but
              also reduces traditional barriers to entry, offering unprecedented access to lucrative investment avenues,
              including Agriculture, Infrastructure, Renewable Energy, and Real Estate.
            </p>
            <p>
              Our NWIS token is the cornerstone of this ecosystem, offering holders unique benefits and participation in
              our journey to build the next global asset manager and financial services giant. Join us on our mission to
              democratize finance and create a future where everyone has the tools to achieve financial freedom.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/images/shutterstock_1669254991.jpg"
              alt="Family running together in a sunny field — freedom and prosperity"
              width={600}
              height={400}
              className="rounded-xl shadow-lg"
              sizes="(min-width: 768px) 600px, 100vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
