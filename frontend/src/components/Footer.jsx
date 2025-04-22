import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="backdrop-blur-md bg-white/10 text-white border-t border-white/20 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Brand & Description */}
        <div>
          <h2 className="text-2xl font-bold text-yellow-400">NomadNest</h2>
          <p className="text-sm mt-2 text-gray-700 font-semibold">
            Plan your perfect trip in seconds. Smart, simple & tailored just for you.
          </p>
        </div>

        {/* Quick Links */}
        <div >
          <h3 className="font-bold text-lg mb-2text-gray-700 text-gray-700">Quick Links</h3>
          <ul className="space-y-1 text-sm text-gray-800 font-semibold">
            <li><a href="#" className="hover:text-yellow-400">Home</a></li>
            <li><a href="#" className="hover:text-yellow-400">Explore</a></li>
            <li><a href="#" className="hover:text-yellow-400">Contact</a></li>
            <li><a href="#" className="hover:text-yellow-400">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-bold text-lg mb-2 text-gray-700">Follow Us</h3>
          <div className="flex justify-center md:justify-start gap-4 text-gray-800 font-semibold">
            <a href="#" className="hover:text-yellow-400"><Facebook size={20} /></a>
            <a href="#" className="hover:text-yellow-400"><Instagram size={20} /></a>
            <a href="#" className="hover:text-yellow-400"><Twitter size={20} /></a>
            <a href="#" className="hover:text-yellow-400"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 text-sm text-center py-4 text-gray-800">
        &copy; {new Date().getFullYear()} NomadNest. All rights reserved.
      </div>
    </footer>
  );
}
