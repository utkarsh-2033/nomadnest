import React, { useState } from 'react';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ onSidebarToggle }) {
  const [open, setOpen] = useState(false);
  const navLinks = ['Home', 'Explore', 'Contact'];

  return (
    <nav className="backdrop-blur-md bg-white/10 border-b border-white/30 shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <div className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Nomad<span className="text-indigo-300">Nest</span>
        </div>

        {/* large screen */}
        <div className="hidden md:flex space-x-8 text-black font-semibold">
          {navLinks.map(link => (
            <a
              key={link}
              href="#"
              className="relative group"
            >
              {link}
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-yellow-400"></span>
            </a>
          ))}
        </div>

        {/* Mobile Icons */}
        <div className="md:hidden flex items-center gap-3 text-white">
          {/* Sidebar toggle */}
          <button onClick={onSidebarToggle}>
            <LayoutDashboard size={22} />
          </button>

          {/* navbar toggle */}
          <button onClick={() => setOpen(prev => !prev)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="bg-[#1e3a8a] text-white overflow-hidden md:hidden px-6 py-4 space-y-4"
          >
            {navLinks.map(link => (
              <motion.a
                key={link}
                href="#"
                whileHover={{ x: 6 }}
                className="block text-lg font-medium"
              >
                {link}
              </motion.a>
            ))}
          </motion.div>
        )}
    </nav>
  );
}
