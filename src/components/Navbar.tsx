'use client';

import React, { useState } from 'react';
import { Company, MediaType } from '@/types/portfolio';
import { Menu, X, ArrowUpRight, MessageCircle, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onFilterCompany: (company: Company | 'All') => void;
  onFilterType: (type: MediaType | 'All') => void;
  onOpenContactModal: () => void;
  activeCompany: Company | 'All';
  activeType: MediaType | 'All';
}

export default function Navbar({
  onFilterCompany,
  onFilterType,
  onOpenContactModal,
  activeCompany,
  activeType,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-sky-100/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18">
          
          {/* Brand Logo - Compact & Spacious on Mobile */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <a 
              href="#" 
              className="group flex items-center space-x-2 focus:outline-none min-w-0"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center text-white shadow-sm flex-shrink-0"
              >
                <span className="font-f1 font-black text-sm sm:text-base italic tracking-tighter">D</span>
              </motion.div>
              
              <div className="flex flex-col min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-f1 font-extrabold text-xs sm:text-sm md:text-base tracking-wider text-slate-900 group-hover:text-sky-600 transition-colors whitespace-nowrap">
                    DANIEL MEDUOYE
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-f1 font-bold bg-sky-100 text-sky-800 rounded border border-sky-200">
                    SMM
                  </span>
                </div>
                <span className="hidden sm:block text-[10px] font-medium text-slate-500 tracking-wide uppercase truncate">
                  Social Media Manager &amp; Video Editor
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => scrollToSection('portfolio')}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-sky-600 hover:bg-sky-50/70 rounded-lg transition-colors cursor-pointer"
            >
              Portfolio
            </button>

            {/* Quick Company Direct Filters */}
            <div className="flex items-center space-x-1 px-2 border-l border-r border-slate-200/80">
              <button
                onClick={() => {
                  onFilterCompany('Hexavia');
                  scrollToSection('portfolio');
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeCompany === 'Hexavia'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                Hexavia
              </button>
              <button
                onClick={() => {
                  onFilterCompany('Tdotwheels');
                  scrollToSection('portfolio');
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeCompany === 'Tdotwheels'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                Tdotwheels
              </button>
            </div>

            <button
              onClick={() => scrollToSection('experience')}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-sky-600 hover:bg-sky-50/70 rounded-lg transition-colors cursor-pointer"
            >
              Experience
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-sky-600 hover:bg-sky-50/70 rounded-lg transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center space-x-2.5">
            <button
              onClick={onOpenContactModal}
              className="inline-flex items-center space-x-1 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-f1 font-bold tracking-wide shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <span>GET IN TOUCH</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
            </button>
          </div>

          {/* Mobile Right Controls: Only Hamburger Menu (No Clutter!) */}
          <div className="flex md:hidden items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-sky-600 hover:bg-sky-50 focus:outline-none border border-slate-200"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-sky-600" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>

        </div>
      </div>

      {/* Mobile Animated Hamburger Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-sky-100 bg-white shadow-xl"
          >
            <div className="px-4 py-4 space-y-3">
              {/* Quick Company Filters */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onFilterCompany('Hexavia');
                    scrollToSection('portfolio');
                  }}
                  className={`py-2 px-3 rounded-xl font-bold text-xs text-center border transition-all ${
                    activeCompany === 'Hexavia'
                      ? 'bg-sky-500 text-white border-sky-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  HEXAVIA
                </button>
                <button
                  onClick={() => {
                    onFilterCompany('Tdotwheels');
                    scrollToSection('portfolio');
                  }}
                  className={`py-2 px-3 rounded-xl font-bold text-xs text-center border transition-all ${
                    activeCompany === 'Tdotwheels'
                      ? 'bg-slate-900 text-white border-slate-800 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  TDOTWHEELS
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col space-y-1 pt-1 border-t border-slate-100">
                <button
                  onClick={() => scrollToSection('portfolio')}
                  className="px-3 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-sky-50 rounded-lg flex items-center justify-between"
                >
                  <span>Featured Works</span>
                  <span className="text-[10px] text-sky-600 font-bold uppercase">View</span>
                </button>

                <button
                  onClick={() => scrollToSection('experience')}
                  className="px-3 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-sky-50 rounded-lg"
                >
                  Brand Experience
                </button>

                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-3 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-sky-50 rounded-lg"
                >
                  Direct Contact
                </button>

                {/* Primary Contact CTA inside Mobile Drawer */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenContactModal();
                  }}
                  className="mt-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-600 text-white font-f1 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md shadow-emerald-500/20"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>GET IN TOUCH (WHATSAPP &amp; CALL)</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
