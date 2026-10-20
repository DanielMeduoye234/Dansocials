'use client';

import React from 'react';
import { Company } from '@/types/portfolio';
import { ArrowUpRight, Play, Eye, Instagram, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompanyShowcaseProps {
  onSelectCompany: (company: Company) => void;
  activeCompany: Company | 'All';
}

export default function CompanyShowcase({
  onSelectCompany,
  activeCompany,
}: CompanyShowcaseProps) {
  const handleCompanyClick = (company: Company) => {
    onSelectCompany(company);
    const el = document.getElementById('portfolio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="experience" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-sky-50/30 to-white border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-f1 font-bold tracking-wider uppercase mb-2">
            <span>CLIENT EXCELLENCE</span>
          </div>
          <h2 className="font-f1 text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
            EXPERIENCE ACROSS <span className="text-sky-600">FLAGSHIP BRANDS</span>
          </h2>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
            High-retention social media management and viral video editing across two distinct industries.
          </p>
        </div>

        {/* 2 Company Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Card 1: Hexavia */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className={`relative rounded-3xl p-5 sm:p-7 bg-white border transition-all duration-300 shadow-card hover:shadow-card-hover ${
              activeCompany === 'Hexavia'
                ? 'border-sky-500 ring-2 ring-sky-400/30'
                : 'border-sky-100 hover:border-sky-300'
            }`}
          >
            {/* Top Row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-sky-600 flex items-center justify-center text-white font-f1 font-black text-base shadow-glow-sm">
                  HX
                </div>
                <div>
                  <h3 className="font-sans font-black text-xl text-slate-900 tracking-wide uppercase">
                    HEXAVIA
                  </h3>
                  <span className="text-[11px] font-bold text-sky-600 tracking-wide uppercase font-sans">
                    Corporate Advisory &amp; Masterclasses
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCompanyClick('Hexavia')}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-sans font-bold border border-sky-200 transition-colors cursor-pointer"
              >
                <span>VIEW WORKS</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Crisp 1-sentence bio */}
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
              Produced executive thought-leadership videos and strategic brand content to grow high-trust business audiences.
            </p>

            {/* Recruiter Live Verification */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 mb-4 flex items-center justify-between">
              <span className="text-[11px] font-f1 font-bold text-slate-600 uppercase">
                Official Channel:
              </span>

              <a
                href="https://www.instagram.com/hexavianigeria/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 text-xs font-bold transition-all shadow-sm"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-600" />
                <span>@hexavianigeria</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>

            {/* Fast Metrics Strip */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-center">
              <div>
                <span className="block text-[10px] font-f1 font-bold text-slate-500 uppercase">Reach</span>
                <span className="font-f1 font-black text-sm sm:text-base text-slate-900">3.8M+</span>
              </div>
              <div>
                <span className="block text-[10px] font-f1 font-bold text-slate-500 uppercase">Engagement</span>
                <span className="font-f1 font-black text-sm sm:text-base text-sky-600">7.8%</span>
              </div>
              <div>
                <span className="block text-[10px] font-f1 font-bold text-slate-500 uppercase">Assets Made</span>
                <span className="font-f1 font-black text-sm sm:text-base text-slate-900">180+</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Tdotwheels */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className={`relative rounded-3xl p-5 sm:p-7 bg-white border transition-all duration-300 shadow-card hover:shadow-card-hover ${
              activeCompany === 'Tdotwheels'
                ? 'border-sky-500 ring-2 ring-sky-400/30'
                : 'border-sky-100 hover:border-sky-300'
            }`}
          >
            {/* Top Row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-f1 font-black text-base shadow-glow-sm">
                  TD
                </div>
                <div>
                  <h3 className="font-sans font-black text-xl text-slate-900 tracking-wide uppercase">
                    TDOTWHEELS
                  </h3>
                  <span className="text-[11px] font-bold text-sky-600 tracking-wide uppercase font-sans">
                    Luxury Automotive &amp; Wheels
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCompanyClick('Tdotwheels')}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-sans font-bold border border-sky-200 transition-colors cursor-pointer"
              >
                <span>VIEW WORKS</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Crisp 1-sentence bio */}
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
              Engineered high-cadence short-form Reels with exhaust sound sync, automotive reveals, and organic viral reach.
            </p>

            {/* Recruiter Live Verification */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 mb-4 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-f1 font-bold text-slate-600 uppercase">
                Official Channels:
              </span>

              <div className="flex items-center space-x-2">
                <a
                  href="https://www.instagram.com/tdot_wheels/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 text-xs font-bold transition-all shadow-sm"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  <span>Instagram</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>

                <a
                  href="https://www.tiktok.com/@tdot_wheels_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 text-xs font-bold transition-all shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 fill-current text-slate-900" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.32V8.71a8.18 8.18 0 0 0 4.91 1.62v-3.64h-1z"/>
                  </svg>
                  <span>TikTok</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Fast Metrics Strip */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-center">
              <div>
                <span className="block text-[10px] font-f1 font-bold text-slate-500 uppercase">Reach</span>
                <span className="font-f1 font-black text-sm sm:text-base text-slate-900">4.4M+</span>
              </div>
              <div>
                <span className="block text-[10px] font-f1 font-bold text-slate-500 uppercase">Peak Reel</span>
                <span className="font-f1 font-black text-sm sm:text-base text-sky-600">1.4M</span>
              </div>
              <div>
                <span className="block text-[10px] font-f1 font-bold text-slate-500 uppercase">Reels Made</span>
                <span className="font-f1 font-black text-sm sm:text-base text-slate-900">240+</span>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
