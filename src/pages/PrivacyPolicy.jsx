import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Share2, Mail, Phone, Calendar } from 'lucide-react';

const PrivacyPolicy = () => {
  const lastUpdated = "January 1, 2026";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 border border-blue-200">
            <p className="text-gray-800 text-lg">
              At Sound Wave Audio, we are committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard 
              your information when you visit our website or purchase our car audio products.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Section 1: Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              1. Information We Collect
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    Name and contact details
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    Email address
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    Phone number
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    Shipping address
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    Vehicle information for installation
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Automatically Collected</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    IP address and device information
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    Browser type and version
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    Pages visited and time spent
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    Purchase history
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. How We Use Your Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Order Processing</h3>
                  <p className="text-gray-700">
                    To process your purchases, send order confirmations, and arrange delivery/installation
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Customer Support</h3>
                  <p className="text-gray-700">
                    To provide technical support and respond to your inquiries about our products
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Service Improvements</h3>
                  <p className="text-gray-700">
                    To improve our website, products, and installation services based on your feedback
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              3. Information Sharing
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information only in the following circumstances:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Service Providers:</strong> With trusted partners who assist in payment processing, 
                    delivery, and installation services
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Legal Requirements:</strong> When required by law or to protect our rights
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Business Transfers:</strong> In connection with a merger or sale of assets
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Data Security</h2>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Protecting Your Information</h3>
                  <p className="text-green-800 mb-3">
                    We implement appropriate security measures including encryption, secure servers, 
                    and regular security audits to protect your personal information.
                  </p>
                  <p className="text-green-800">
                    While we strive to protect your data, no method of transmission over the internet 
                    is 100% secure. We cannot guarantee absolute security but we work hard to protect it.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Your Rights</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <span className="font-medium text-gray-900">Access your information</span>
                <button className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                  Request Access
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <span className="font-medium text-gray-900">Correct inaccurate data</span>
                <button className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                  Update Information
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <span className="font-medium text-gray-900">Request deletion</span>
                <button className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                  Delete Account
                </button>
              </div>
            </div>
          </section>

          {/* Section 6: Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Cookies and Tracking</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                We use cookies to enhance your browsing experience, analyze site traffic, 
                and personalize content. Cookies help us remember your preferences and 
                shopping cart items.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800">
                  Accept All Cookies
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Manage Preferences
                </button>
              </div>
            </div>
          </section>

          {/* Section 7: Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Changes to This Policy</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <p className="text-yellow-800">
                We may update this Privacy Policy periodically. We will notify you of any 
                material changes by posting the new policy on this page with an updated 
                effective date. We encourage you to review this Privacy Policy regularly.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gray-900 text-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            <p className="text-gray-300 mb-6">
              If you have questions about this Privacy Policy or our data practices, 
              please contact our Data Protection Officer:
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>privacy@soundwaveaudio.co.ke</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>+254 724 013 583</span>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-6">
              By using our website and services, you consent to our Privacy Policy.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/" className="text-sm text-gray-600 hover:text-black">
                Home
              </Link>
              <Link to="/terms" className="text-sm text-gray-600 hover:text-black">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-sm text-gray-600 hover:text-black">
                Contact
              </Link>
              <Link to="/products" className="text-sm text-gray-600 hover:text-black">
                Products
              </Link>
              <Link to="/about" className="text-sm text-gray-600 hover:text-black">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;