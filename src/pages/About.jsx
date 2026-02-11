/**
 * About Page - Sound Wave Audio
 * 
 * SEO NOTES:
 * - SEO handled by DefaultSEO component in App.jsx
 * - Content optimized for "about sound wave audio", "car audio nairobi", etc.
 * - Minimum 500+ words for SEO value
 * - Semantic HTML (h1, h2, p, etc.) for better indexing
 */

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 lg:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.2em] uppercase">
              About Sound Wave Audio
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Kenya's Premier Car Audio Specialist
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        
        {/* Our Story */}
        <div className="space-y-6 mb-16">
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-center mb-8">
            Our Story
          </h2>
          
          <div className="space-y-4 text-base leading-relaxed text-gray-700">
            <p>
              Sound Wave Audio has a singular vision: to bring premium car audio systems and professional installation services to Kenyan drivers. What started as a small shop in Nairobi's Ngara area has grown into Kenya's most trusted name in car audio excellence.
            </p>

            <p>
              For over 13 years, we've been serving automotive enthusiasts, music lovers, and everyday drivers who demand the best sound quality on Kenyan roads. Our journey began when our founder, a passionate audiophile and automotive technician, recognized a gap in the market for genuine, high-quality car audio products backed by expert installation.
            </p>

            <p>
              Today, Sound Wave Audio stands as an authorized dealer for premium brands including Pioneer, Sony, Kenwood, Nakamichi, JVC, Blaupunkt, Skar Audio, and Taramps. We've installed thousands of car audio systems across Nairobi and throughout Kenya, earning a reputation for quality, reliability, and exceptional customer service.
            </p>

            <p>
              Located at Park Road Business Center on Ring Road, Ngara, our showroom showcases the latest in car audio technology. From entry-level head units to competition-grade subwoofers and amplifiers, we stock everything needed to transform your vehicle's sound system.
            </p>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="bg-gray-50 border border-gray-200 p-8 lg:p-12 mb-16">
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-center mb-8">
            Our Mission
          </h2>
          
          <p className="text-lg text-center text-gray-700 leading-relaxed mb-8">
            To deliver exceptional car audio experiences through premium products, expert installation, and unmatched customer service across Kenya.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center space-y-2">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-gray-900">
                Quality First
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Only genuine products from authorized manufacturers with full warranty coverage
              </p>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-gray-900">
                Expert Installation
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Certified technicians with years of experience in professional car audio installation
              </p>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-gray-900">
                Customer Satisfaction
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Dedicated support before, during, and after your purchase with lifetime consultation
              </p>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="space-y-6 mb-16">
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-center mb-8">
            What We Offer
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 p-6 space-y-3">
              <h3 className="text-sm uppercase tracking-widest font-semibold">
                Premium Products
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Car speakers (component, coaxial, 2-way, 3-way)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Subwoofers (8", 10", 12", 15" models)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Amplifiers (mono, 2-channel, 4-channel, 5-channel)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Head units (single DIN, double DIN, touchscreen)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Equalizers, crossovers, and sound processors</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Installation accessories and wiring kits</span>
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 p-6 space-y-3">
              <h3 className="text-sm uppercase tracking-widest font-semibold">
                Professional Services
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Complete car audio system installation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Custom subwoofer box fabrication</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Sound system tuning and optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Audio system troubleshooting and repairs</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Professional consultation and system design</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Warranty support and after-sales service</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gray-900 text-white p-8 lg:p-12 mb-16">
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-center mb-8">
            Why Choose Sound Wave Audio
          </h2>

          <div className="space-y-4 text-sm leading-relaxed">
            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold mb-2 text-gray-300">
                1. Authorized Dealer Status
              </h3>
              <p className="text-gray-400">
                We are official authorized dealers for all major car audio brands. This means you get genuine products, full manufacturer warranties, and access to the latest models as soon as they're released.
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold mb-2 text-gray-300">
                2. Expert Technical Team
              </h3>
              <p className="text-gray-400">
                Our installation technicians are certified and continuously trained on the latest car audio technologies. We handle everything from basic speaker upgrades to complex multi-amplifier competition systems.
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold mb-2 text-gray-300">
                3. Competitive Pricing
              </h3>
              <p className="text-gray-400">
                As one of Kenya's largest car audio retailers, we maintain competitive pricing on all products while never compromising on quality or service. We offer flexible payment options including M-Pesa.
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold mb-2 text-gray-300">
                4. Convenient Location
              </h3>
              <p className="text-gray-400">
                Our Ngara showroom is easily accessible from anywhere in Nairobi. We also offer free delivery within Nairobi CBD on orders over KSH 5,000 and nationwide shipping across Kenya.
              </p>
            </div>
          </div>
        </div>

        {/* Visit Us */}
        <div className="text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase">
            Visit Our Showroom
          </h2>
          
          <div className="space-y-2 text-sm text-gray-700">
            <p className="font-semibold">Sound Wave Audio</p>
            <p>Park Road Business Center</p>
            <p>Ring Road, Ngara</p>
            <p>Nairobi, Kenya</p>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Phone:</strong> <a href="tel:+254724013583" className="text-blue-600 hover:underline">+254 724 013 583</a></p>
            <p><strong>Email:</strong> <a href="mailto:info@soundwaveaudio.co.ke" className="text-blue-600 hover:underline">info@soundwaveaudio.co.ke</a></p>
            <p><strong>Hours:</strong> Monday - Saturday, 8:00 AM - 6:00 PM</p>
          </div>

          <div className="pt-6">
            <a 
              href="/contact" 
              className="inline-block px-8 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Contact Us Today
            </a>
          </div>
        </div>

      </section>
    </div>
  );
};

export default About;