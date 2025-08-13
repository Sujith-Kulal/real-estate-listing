import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <h3 className="text-2xl font-bold">
                <span className="text-green-400">BHUMI</span>
              </h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              BHUMI is a revolutionary land exchange platform that leverages cutting-edge blockchain technology to transform the traditional land marketplace.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors">
                <FaLinkedin className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors">
                <FaTwitter className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors">
                <FaFacebook className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors">
                <FaInstagram className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-green-400">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-300 hover:text-green-400 transition-colors">
                  Search Lands
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-green-400">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <FaPhone className="text-green-400 mt-1 mr-3" />
                <div>
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                  <p className="text-gray-300">+1 (555) 987-6543</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaEnvelope className="text-green-400 mt-1 mr-3" />
                <div>
                  <p className="text-gray-300">info@bhumihub.com</p>
                  <p className="text-gray-300">support@bhumihub.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-green-400 mt-1 mr-3" />
                <div>
                  <p className="text-gray-300">123 Blockchain Street</p>
                  <p className="text-gray-300">Tech District, City</p>
                  <p className="text-gray-300">State 12345, Country</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 BHUMI. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-green-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-green-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-green-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
