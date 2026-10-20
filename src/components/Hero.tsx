'use client';

import React from 'react';
import { Company, MediaType } from '@/types/portfolio';
import { Play, Image, TrendingUp, ArrowRight, ShieldCheck, Mail, ExternalLink, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  onFilterCompany: (company: Company | 'All') => void;
  onFilterType: (type: MediaType | 'All') => void;
  onOpenContactModal: () => void;
  totalWorksCount: number;
}

export default function Hero({
  onFilterCompany,
  onFilterType,
  onOpenContactModal,
  totalWorksCount,
}: HeroProps) {
  const scrollToPortfolio = () => {
    const el = document.getElementById('portfolio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-white pt-6 pb-10 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20 border-b border-sky-100">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-racing-grid opacity-70 pointer-events-none" />
      
      {/* Soft light-blue radial glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] sm:w-[850px] h-[350px] sm:h-[450px] bg-gradient-to-b from-sky-200/50 via-sky-100/30 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/2 -right-32 w-64 h-64 bg-sky-200/40 blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center mb-4 sm:mb-6"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 shadow-sm text-sky-800 text-[10px] sm:text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <span className="font-f1 tracking-wider uppercase text-[10px] sm:text-[11px] font-bold">
              OFFICIAL PORTFOLIO // DANIEL MEDUOYE
            </span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-f1 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] uppercase"
          >
            DANIEL MEDUOYE <br />
            <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 bg-clip-text text-transparent text-xl sm:text-3xl md:text-4xl lg:text-5xl block mt-2 sm:mt-3">
              SOCIAL MEDIA MANAGER &amp; VIDEO EDITOR
            </span>
          </motion.h1>

          {/* Crisp, Concise Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 sm:mt-6 text-xs sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-2 font-normal"
          >
            Crafting high-retention Reels, viral short-form video edits, and rapid social growth for <span className="font-bold text-slate-900">Hexavia</span> &amp; <span className="font-bold text-slate-900">Tdotwheels</span>.
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={scrollToPortfolio}
              className="inline-flex items-center space-x-2 px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-f1 font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all"
            >
              <span>EXPLORE WORKS</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenContactModal}
              className="inline-flex items-center space-x-2 px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 font-f1 font-bold text-xs sm:text-sm tracking-wide transition-all shadow-sm"
            >
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600" />
              <span>GET IN TOUCH</span>
            </motion.button>
          </motion.div>

          {/* Quick Filters */}
          <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] sm:text-xs">Quick Filter:</span>
            
            <button
              onClick={() => {
                onFilterType('video');
                scrollToPortfolio();
              }}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md font-bold font-f1 bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors"
            >
              <Play className="w-2.5 h-2.5 fill-sky-600" />
              <span>VIDEOS</span>
            </button>

            <button
              onClick={() => {
                onFilterType('graphics');
                scrollToPortfolio();
              }}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md font-bold font-f1 bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors"
            >
              <Image className="w-2.5 h-2.5 text-sky-600" />
              <span>GRAPHICS</span>
            </button>

            <span className="text-slate-300 hidden sm:inline">|</span>

            <button
              onClick={() => {
                onFilterCompany('Hexavia');
                scrollToPortfolio();
              }}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md font-bold font-f1 bg-slate-50 text-slate-700 border border-slate-200 hover:bg-sky-50 hover:text-sky-700 transition-colors"
            >
              <span>HEXAVIA</span>
            </button>

            <button
              onClick={() => {
                onFilterCompany('Tdotwheels');
                scrollToPortfolio();
              }}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md font-bold font-f1 bg-slate-50 text-slate-700 border border-slate-200 hover:bg-sky-50 hover:text-sky-700 transition-colors"
            >
              <span>TDOTWHEELS</span>
            </button>
          </div>

          {/* Recruiter Live Verification Quick Links */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Recruiter Live Check:</span>
            <a
              href="https://www.instagram.com/hexavianigeria/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 hover:text-sky-600 border border-slate-200 transition-colors"
            >
              <Instagram className="w-3 h-3 text-pink-600" />
              <span>Hexavia IG</span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
            </a>
            <a
              href="https://www.instagram.com/tdot_wheels/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 hover:text-sky-600 border border-slate-200 transition-colors"
            >
              <Instagram className="w-3 h-3 text-pink-600" />
              <span>Tdotwheels IG</span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
            </a>
            <a
              href="https://www.tiktok.com/@tdot_wheels_official"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 hover:text-sky-600 border border-slate-200 transition-colors"
            >
              <svg className="w-3 h-3 fill-current text-slate-800" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.32V8.71a8.18 8.18 0 0 0 4.91 1.62v-3.64h-1z"/>
              </svg>
              <span>Tdotwheels TikTok</span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* F1 Pit-Wall Telemetry Metrics Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 sm:mt-12 max-w-4xl mx-auto"
        >
          <div className="glass-panel rounded-2xl p-3 sm:p-5 shadow-card border border-sky-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-sky-100">
              
              {/* Stat 1 */}
              <div className="flex flex-col items-center justify-center p-1.5 sm:p-2 text-center">
                <div className="flex items-center space-x-1 text-sky-600 mb-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-[10px] sm:text-[11px] font-f1 font-bold uppercase tracking-wider text-slate-500">
                    Impressions
                  </span>
                </div>
                <span className="font-f1 font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                  8.2M+
                </span>
                <span className="text-[10px] text-sky-600 font-medium">Organic &amp; Paid</span>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-center justify-center p-1.5 sm:p-2 text-center">
                <div className="flex items-center space-x-1 text-sky-600 mb-0.5">
                  <Play className="w-3.5 h-3.5 fill-sky-600" />
                  <span className="text-[10px] sm:text-[11px] font-f1 font-bold uppercase tracking-wider text-slate-500">
                    Peak Video Reel
                  </span>
                </div>
                <span className="font-f1 font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                  1.4M
                </span>
                <span className="text-[10px] text-sky-600 font-medium">Organic Virality</span>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center justify-center p-1.5 sm:p-2 text-center pt-2 sm:pt-2">
                <div className="flex items-center space-x-1 text-sky-600 mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px] sm:text-[11px] font-f1 font-bold uppercase tracking-wider text-slate-500">
                    Portfolio Works
                  </span>
                </div>
                <span className="font-f1 font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                  {totalWorksCount} Works
                </span>
                <span className="text-[10px] text-sky-600 font-medium">Curated Catalog</span>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col items-center justify-center p-1.5 sm:p-2 text-center pt-2 sm:pt-2">
                <div className="flex items-center space-x-1 text-sky-600 mb-0.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  <span className="text-[10px] sm:text-[11px] font-f1 font-bold uppercase tracking-wider text-slate-500">
                    Flagship Brands
                  </span>
                </div>
                <span className="font-f1 font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                  2 Brands
                </span>
                <span className="text-[10px] text-sky-600 font-medium">Hexavia &amp; Tdotwheels</span>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
