import React from 'react';
import { FaShieldAlt, FaHandshake, FaGlobe, FaChartLine, FaUsers, FaAward } from 'react-icons/fa';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About BHUMI</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Revolutionizing land transactions through blockchain technology and transparent processes
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                BHUMI was founded with a vision to transform the traditional land marketplace by leveraging cutting-edge blockchain technology. We recognized the challenges faced by landowners and buyers in traditional real estate transactions - lack of transparency, security concerns, and inefficient processes.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our platform was built to address these pain points by providing a secure, transparent, and efficient way to manage land listings and connect genuine landowners with serious buyers. We believe that everyone deserves access to secure and transparent land transactions.
              </p>
              <p className="text-lg text-gray-600">
                Today, BHUMI stands as a trusted name in the land exchange industry, serving clients across multiple countries and facilitating thousands of successful transactions.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Quick Facts</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaUsers className="text-2xl mr-3" />
                  <div>
                    <div className="text-2xl font-bold">10,000+</div>
                    <div className="text-green-100">Active Users</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaAward className="text-2xl mr-3" />
                  <div>
                    <div className="text-2xl font-bold">5+</div>
                    <div className="text-green-100">Years Experience</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaGlobe className="text-2xl mr-3" />
                  <div>
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-green-100">Countries Served</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <FaShieldAlt className="text-3xl text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To democratize land ownership by making the transaction process accessible, secure, and transparent for everyone involved. We strive to eliminate barriers and create opportunities for landowners and buyers worldwide.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <FaChartLine className="text-3xl text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become the world's most trusted and efficient land exchange platform, where every transaction is secure, transparent, and beneficial for all parties involved. We envision a future where land transactions are seamless and accessible to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
                          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The principles that guide everything we do at BHUMI
              </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Security First</h3>
              <p className="text-gray-600">We prioritize the security of our users' data and transactions above everything else.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Transparency</h3>
              <p className="text-gray-600">We believe in complete transparency in all our processes and transactions.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGlobe className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Global Reach</h3>
              <p className="text-gray-600">We serve clients worldwide, breaking down geographical barriers.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">User-Centric</h3>
              <p className="text-gray-600">Our users are at the heart of every decision we make.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaAward className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Excellence</h3>
              <p className="text-gray-600">We strive for excellence in every aspect of our service.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Innovation</h3>
              <p className="text-gray-600">We continuously innovate to provide better solutions for our users.</p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
