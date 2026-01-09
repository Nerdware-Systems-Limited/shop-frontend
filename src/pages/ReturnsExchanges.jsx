import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Shield, AlertCircle, CheckCircle, XCircle, Clock, Package, DollarSign, Truck } from 'lucide-react';

const ReturnsExchanges = () => {
  const [selectedReason, setSelectedReason] = useState('');

  const returnReasons = [
    { id: 'defective', label: 'Defective/Damaged Product', timeframe: '7 days', action: 'Full Refund/Replacement' },
    { id: 'wrong-item', label: 'Wrong Item Received', timeframe: '3 days', action: 'Exchange/Refund' },
    { id: 'not-as-described', label: 'Not as Described', timeframe: '7 days', action: 'Refund/Exchange' },
    { id: 'changed-mind', label: 'Changed Mind', timeframe: '14 days', action: 'Store Credit (Restocking fee applies)' },
    { id: 'installation-issue', label: 'Installation Issue', timeframe: '30 days', action: 'Repair/Technical Support' },
  ];

  const returnSteps = [
    { step: 1, title: 'Contact Support', description: 'Call or email within return timeframe' },
    { step: 2, title: 'Get RMA Number', description: 'Receive Return Merchandise Authorization' },
    { step: 3, title: 'Package Product', description: 'Include all original packaging and accessories' },
    { step: 4, title: 'Return to Showroom', description: 'Bring to our Ngara location for inspection' },
    { step: 5, title: 'Receive Resolution', description: 'Refund, exchange, or repair within 7-10 days' },
  ];

  const nonReturnableItems = [
    'Custom-installed audio systems',
    'Products without original packaging',
    'Items damaged due to improper installation',
    'Products modified or altered',
    'Digital products and software',
    'Opened installation cables and wiring',
    'Special order items',
    'Clearance/closeout items marked "Final Sale"',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Returns & Exchanges
          </h1>
          <p className="text-gray-600">
            Hassle-free returns for your car audio equipment
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Return Window</h3>
            </div>
            <p className="text-gray-700 text-sm">
              7-30 days depending on product type and reason
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Warranty Coverage</h3>
            </div>
            <p className="text-gray-700 text-sm">
              1-2 years manufacturer warranty on most products
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Refund Processing</h3>
            </div>
            <p className="text-gray-700 text-sm">
              7-10 business days after return inspection
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Section 1: Return Reasons */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Eligible Return Reasons</h2>
            <div className="space-y-4">
              {returnReasons.map((reason) => (
                <div 
                  key={reason.id}
                  onClick={() => setSelectedReason(reason.id)}
                  className={`p-5 border rounded-xl cursor-pointer transition-all ${
                    selectedReason === reason.id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {selectedReason === reason.id ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full mt-0.5" />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{reason.label}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {reason.timeframe}
                          </span>
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" />
                            {reason.action}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Return Process */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Return Process</h2>
            <div className="space-y-8">
              {/* Steps Timeline */}
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-8">
                  {returnSteps.map((step, index) => (
                    <div key={step.step} className="relative flex items-start gap-6">
                      <div className="relative z-10">
                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-gray-700">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">Important Return Requirements</h3>
                    <ul className="space-y-2 text-yellow-800">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        All original packaging and accessories must be included
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        Product must be in original condition (uninstalled, unused)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        Return authorization number (RMA) must be visible on package
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        Installation equipment must be professionally removed
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Non-Returnable Items */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Non-Returnable Items</h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-4">Items That Cannot Be Returned</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {nonReturnableItems.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-red-800">{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-red-800 mt-4 text-sm">
                    * For installation issues, please contact our technical support team for assistance instead of returning.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Refunds & Exchanges */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Refunds & Exchanges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Refund Policy</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Original Payment Method</span>
                    <span className="font-semibold">7-10 business days</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Store Credit</span>
                    <span className="font-semibold">Immediate</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">M-Pesa Refund</span>
                    <span className="font-semibold">24-48 hours</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  * Restocking fee of 15% applies to "Changed Mind" returns
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Exchange Policy</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-gray-700">Exchanges processed within 3-5 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-gray-700">Price differences handled at time of exchange</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-gray-700">Free shipping on exchanges for defective items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-gray-700">Exchanges must be for same or higher value products</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5: Installation Equipment */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Installation Equipment Returns</h2>
            <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Package className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white mb-3">Special Conditions for Car Audio Equipment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h4 className="font-medium text-yellow-300 mb-2">Professional Installation Required</h4>
                      <p className="text-gray-300 text-sm">
                        For warranty claims, equipment must have been professionally installed at our workshop or by certified installers.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-300 mb-2">Technical Support First</h4>
                      <p className="text-gray-300 text-sm">
                        Before returning, contact our technical team. Many issues can be resolved without returning equipment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Start Your Return</h3>
              <p className="text-gray-700 mb-6">
                Have your order number and reason for return ready. Our support team will guide you through the process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+254724013583" 
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Call Support: +254 724 013 583
                </a>
                <a 
                  href="mailto:returns@soundwaveaudio.co.ke" 
                  className="px-6 py-3 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Email Returns Team
                </a>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/" className="text-sm text-gray-600 hover:text-black">
                Home
              </Link>
              <Link to="/shipping" className="text-sm text-gray-600 hover:text-black">
                Shipping Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-600 hover:text-black">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-black">
                Privacy Policy
              </Link>
              <Link to="/warranty" className="text-sm text-gray-600 hover:text-black">
                Warranty Information
              </Link>
            </div>
            <p className="text-sm text-gray-600 text-center mt-6">
              For urgent installation-related returns, please visit our Ngara showroom for immediate assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsExchanges;