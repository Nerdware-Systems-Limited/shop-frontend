import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clock, MapPin, Package, Shield, Phone, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const ShippingPolicy = () => {
  const deliveryZones = [
    { zone: 'Nairobi CBD', time: '1-2 business days', cost: 'KES 500', note: 'Free for orders over KES 5,000' },
    { zone: 'Nairobi Metropolitan', time: '2-3 business days', cost: 'KES 800', note: 'Free for orders over KES 8,000' },
    { zone: 'Kiambu, Thika, Machakos', time: '3-4 business days', cost: 'KES 1,200', note: 'Free for orders over KES 10,000' },
    { zone: 'Other Major Towns', time: '5-7 business days', cost: 'KES 2,500', note: 'Quoted per location' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Shipping Policy
          </h1>
          <p className="text-gray-600">
            Reliable delivery for your car audio equipment across Kenya
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Delivery Time</h3>
            </div>
            <p className="text-gray-700 text-sm">
              1-7 business days depending on location and product availability
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Free Shipping</h3>
            </div>
            <p className="text-gray-700 text-sm">
              Available for orders above KES 5,000 within Nairobi CBD
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Secure Delivery</h3>
            </div>
            <p className="text-gray-700 text-sm">
              All packages are insured and tracked for your peace of mind
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Section 1: Delivery Areas */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              1. Delivery Areas & Coverage
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Delivery Zone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Estimated Time
                    </th>
                    <th className="px6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Shipping Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {deliveryZones.map((zone, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                          <span className="font-medium text-gray-900">{zone.zone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {zone.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {zone.cost}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {zone.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2: Processing Time */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Order Processing Time</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Standard Processing</h3>
                    <p className="text-blue-800">
                      Orders are processed within <strong>24-48 hours</strong> during business days (Monday - Saturday).
                      Installation equipment may require additional processing time for configuration and testing.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Same-Day Dispatch</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Orders placed before 12 PM
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      In-stock items only
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Nairobi CBD only
                    </li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Extended Processing</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      Custom installations: 3-5 days
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      Special orders: 7-14 days
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      Imported equipment: 2-4 weeks
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Shipping Methods */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Shipping Methods</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Standard Delivery</h3>
                  <p className="text-gray-700 mb-2">
                    Our trusted delivery partners ensure safe and timely delivery. All packages include:
                  </p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Real-time tracking updates via SMS/Email</li>
                    <li>• Insurance coverage up to KES 50,000</li>
                    <li>• Professional handling of audio equipment</li>
                    <li>• Delivery confirmation with signature</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Pickup from Showroom</h3>
                  <p className="text-gray-700">
                    Collect your order from our Ngara showroom for free. Ideal for:
                  </p>
                  <ul className="space-y-1 text-gray-600 mt-2">
                    <li>• Installation equipment requiring professional setup</li>
                    <li>• Immediate collection of in-stock items</li>
                    <li>• Consultation with our audio experts</li>
                    <li>• Testing equipment before installation</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Installation Equipment */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Installation Equipment Shipping</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Important Notice for Installation Equipment</h3>
                  <p className="text-amber-800 mb-4">
                    Due to the sensitive nature of car audio equipment and the risk of damage during transit, 
                    we strongly recommend professional installation at our Ngara workshop.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Recommended</h4>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• Professional installation at our workshop</li>
                        <li>• Free delivery for installation appointments</li>
                        <li>• Quality guarantee on workmanship</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Shipping Available</h4>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• Additional packaging for protection</li>
                        <li>• Special handling fees apply</li>
                        <li>• Installation warranty may be limited</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Tracking & Support */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Order Tracking & Support</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="space-y-4">
                <p className="text-gray-700">
                  Once your order ships, you'll receive a tracking number via SMS and email. 
                  You can track your package in real-time through our website or contact our 
                  support team for updates.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Need Help?</p>
                      <p className="text-sm text-gray-600">Our support team is here to assist</p>
                    </div>
                  </div>
                  <a 
                    href="tel:+254724013583" 
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Call Support: +254 724 013 583
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-6">Important Shipping Notes</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                <p>Delivery times are estimates and not guaranteed. Delays may occur due to weather, traffic, or customs clearance.</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                <p>Someone must be available to receive the delivery. If no one is available, we will attempt redelivery the next business day.</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                <p>Please inspect your package upon delivery. Report any damage within 24 hours for insurance claims.</p>
              </div>
            </div>
          </div>

          {/* Contact & Navigation */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-6">
              For specific shipping inquiries or custom delivery arrangements, contact our logistics team.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/" className="text-sm text-gray-600 hover:text-black">
                Home
              </Link>
              <Link to="/returns" className="text-sm text-gray-600 hover:text-black">
                Returns & Exchanges
              </Link>
              <Link to="/contact" className="text-sm text-gray-600 hover:text-black">
                Contact Us
              </Link>
              <Link to="/products" className="text-sm text-gray-600 hover:text-black">
                Shop Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;