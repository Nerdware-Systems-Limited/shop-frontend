import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, AlertCircle, Check, Clock, Mail, Phone, MapPin } from 'lucide-react';

const TermsOfService = () => {
  const lastUpdated = "January 1, 2026";

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-12">
          <div className="bg-gray-50 border-l-4 border-black p-6 mb-8">
            <p className="text-gray-700">
              Welcome to Sound Wave Audio. By accessing our website and purchasing our products, 
              you agree to comply with and be bound by the following terms and conditions.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          {/* Section 1: Acceptance of Terms */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-4">
              By accessing and using the Sound Wave Audio website (soundwaveaudio.co.ke), 
              you acknowledge that you have read, understood, and agree to be bound by these 
              Terms of Service. If you disagree with any part of these terms, you may not 
              access our website or purchase our products.
            </p>
          </section>

          {/* Section 2: Products and Services */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Products and Services</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">2.1 Product Information</h3>
                <p className="text-gray-700">
                  We make every effort to display our products accurately. However, product colors, 
                  specifications, and prices are subject to change without notice. All car audio 
                  equipment is subject to availability.
                </p>
              </div>
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">2.2 Installation Services</h3>
                <p className="text-gray-700">
                  Professional installation services are available at our Ngara location. 
                  Installation prices are separate from product prices and will be quoted 
                  based on your specific vehicle and audio setup requirements.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Orders and Payments */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Orders and Payments</h2>
            <div className="space-y-4">
              <div className="border border-black p-5">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  3.1 Order Confirmation
                </h3>
                <p className="text-gray-700">
                  Your order is confirmed only when you receive an order confirmation email 
                  from us. We reserve the right to cancel any order at our discretion.
                </p>
              </div>
              <div className="border border-black p-5">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  3.2 Payment Terms
                </h3>
                <p className="text-gray-700">
                  We accept M-Pesa and cash on delivery. All payments must be made in 
                  Kenyan Shillings (KES). For installation services, a 50% deposit may 
                  be required.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Shipping and Delivery */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Shipping and Delivery</h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                • Delivery times are estimates and not guaranteed
              </p>
              <p className="text-gray-700">
                • We deliver within Nairobi and surrounding areas
              </p>
              <p className="text-gray-700">
                • Installation products must be collected from our Ngara showroom
              </p>
              <p className="text-gray-700">
                • Shipping costs are calculated at checkout
              </p>
            </div>
          </section>

          {/* Section 5: Returns and Warranties */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Returns and Warranties</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
                  <p className="text-yellow-700">
                    Car audio equipment returns are subject to manufacturer warranty terms. 
                    Please contact us immediately if you receive a defective product.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                • Defective products must be reported within 7 days of delivery
              </p>
              <p className="text-gray-700">
                • Installation errors are covered under our 30-day workmanship warranty
              </p>
              <p className="text-gray-700">
                • Custom installations are non-returnable
              </p>
            </div>
          </section>

          {/* Section 6: Intellectual Property */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700">
              All content on this website, including logos, product images, and descriptions, 
              are the property of Sound Wave Audio and are protected by copyright laws. 
              Unauthorized use is prohibited.
            </p>
          </section>

          {/* Section 7: Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700">
              Sound Wave Audio shall not be liable for any indirect, incidental, or consequential 
              damages arising from the use of our products or services. Our total liability 
              shall not exceed the purchase price of the product.
            </p>
          </section>

          {/* Section 8: Governing Law */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Governing Law</h2>
            <p className="text-gray-700">
              These Terms of Service are governed by and construed in accordance with the laws 
              of the Republic of Kenya. Any disputes shall be subject to the exclusive 
              jurisdiction of the courts in Nairobi.
              </p>
            </section>

          {/* Section 9: Changes to Terms */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting to our website. Continued use of our services constitutes 
              acceptance of the modified terms.
            </p>
          </section>

          {/* Contact Information */}
          <div className="bg-black text-white p-8 rounded-2xl mt-12">
            <h3 className="text-xl font-bold mb-6">Contact Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-gray-300">Park Road Business Center, Ring Road, Ngara, Nairobi</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-gray-300">+254 724 013 583</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-300">info@soundwaveaudio.co.ke</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Business Hours</p>
                  <p className="text-gray-300">Mon-Sat: 8:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              By using our website and services, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms of Service.
            </p>
            <div className="flex justify-center gap-6 mt-8">
              <Link to="/" className="text-sm text-gray-600 hover:text-black">
                Home
              </Link>
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-black">
                Privacy Policy
              </Link>
              <Link to="/contact" className="text-sm text-gray-600 hover:text-black">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;