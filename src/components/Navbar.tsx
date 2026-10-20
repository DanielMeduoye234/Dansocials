'use client';

import React, { useState } from 'react';
import { Company, MediaType } from '@/types/portfolio';
import { Menu, X, ArrowUpRight } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-2.5">
            <a 
              href="#" 
              className="group flex items-center space-x-2 focus:outline-none"
            >
              <motion.div 
                whileHover={{ scale: 1.08, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center text-white shadow-glow-sm"
              >
                <span className="font-f1 font-black text-lg sm:text-xl italic tracking-tighter">D</span>
              </motion.div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1 sm:space-x-1.5">
                  <span className="font-f1 font-extrabold text-sm sm:text-base tracking-wider text-slate-900 group-hover:text-sky-600 transition-colors">
                    DANIEL MEDUOYE
                  </span>
                  <span className="inline-block px-1 py-0.2 sm:px-1.5 sm:py-0.5 text-[8px] sm:text-[9px] font-f1 font-bold bg-sky-100 text-sky-800 rounded border border-sky-200">
                    SMM
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 tracking-wide uppercase">
                  Social Media Manager &amp; Video Editor
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => scrollToSection('portfolio')}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-sky-600 hover:bg-sky-50/70 rounded-lg transition-colors"
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
                className={`px-2.5 py-1 text-xs font-f1 font-bold rounded-md transition-all ${
                  activeCompany === 'Hexavia'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                HEXAVIA
              </button>
              <button
                onClick={() => {
                  onFilterCompany('Tdotwheels');
                  scrollToSection('portfolio');
                }}
                className={`px-2.5 py-1 text-xs font-f1 font-bold rounded-md transition-all ${
                  activeCompany === 'Tdotwheels'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                TDOTWHEELS
              </button>
            </div>

            <button
              onClick={() => scrollToSection('experience')}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-sky-600 hover:bg-sky-50/70 rounded-lg transition-colors"
            >
              Experience
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-sky-600 hover:bg-sky-50/70 rounded-lg transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Action CTA: Get in touch modal */}
          <div className="hidden sm:flex items-center space-x-2.5">
            <button
              onClick={onOpenContactModal}
              className="inline-flex items-center space-x-1 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-f1 font-bold tracking-wide shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <span>GET IN TOUCH</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
            </button>
          </div>

          {/* Mobile Right Contact Button & Hamburger Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenContactModal}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-f1 text-xs font-bold shadow-sm"
            >
              CONTACT
            </button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-sky-600 hover:bg-sky-50 focus:outline-none border border-slate-200"
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
            className="md:hidden overflow-hidden border-t border-sky-100 bg-white/98 backdrop-blur-xl shadow-xl"
          >
            <div className="px-4 py-4 space-y-3">
              {/* Quick Company Filters */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onFilterCompany('Hexavia');
                    scrollToSection('portfolio');
                  }}
                  className={`py-2 px-3 rounded-lg font-f1 font-bold text-xs text-center border transition-all ${
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
                  className={`py-2 px-3 rounded-lg font-f1 font-bold text-xs text-center border transition-all ${
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
                  className="px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-sky-50 rounded-lg flex items-center justify-between"
                >
                  <span>Featured Works</span>
                  <span className="text-[10px] text-sky-600 font-f1 font-bold">EXPLORE</span>
                </button>

                <button
                  onClick={() => scrollToSection('experience')}
                  className="px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-sky-50 rounded-lg"
                >
                  Brand Experience
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenContactModal();
                  }}
                  className="px-3 py-2.5 text-left text-xs font-bold text-slate-800 bg-sky-50/70 hover:bg-sky-100 rounded-xl flex items-center justify-between"
                >
                  <span className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Get in Touch (WhatsApp &amp; Call)</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-f1 font-bold">CONNECT</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
