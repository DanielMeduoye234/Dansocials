'use client';

import React from 'react';
import Link from 'next/link';
import { Company, MediaType } from '@/types/portfolio';
import { ArrowUp, Instagram, ExternalLink } from 'lucide-react';

interface FooterProps {
  onFilterCompany: (company: Company | 'All') => void;
  onFilterType: (type: MediaType | 'All') => void;
  onOpenContactModal?: () => void;
}

export default function Footer({
  onFilterCompany,
  onFilterType,
  onOpenContactModal,
}: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-sky-100 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-sky-100">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-f1 font-black text-sm">
                D
              </div>
              <span className="font-f1 font-extrabold text-base sm:text-lg text-slate-900 tracking-wider">
                DANIEL MEDUOYE // SMM &amp; VIDEO EDITOR
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              High-velocity social media management, short-form video editing, and virality architecture for flagship brands.
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-f1 font-bold bg-sky-50 text-sky-700 border border-sky-200">
                HEXAVIA
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-f1 font-bold bg-slate-900 text-sky-400">
                TDOTWHEELS
              </span>
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <h4 className="font-f1 font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">
              Explore Works
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onFilterCompany('Hexavia')}
                  className="hover:text-sky-600 transition-colors font-medium"
                >
                  Hexavia Campaigns
                </button>
              </li>
              <li>
                <button
                  onClick={() => onFilterCompany('Tdotwheels')}
                  className="hover:text-sky-600 transition-colors font-medium"
                >
                  Tdotwheels Campaigns
                </button>
              </li>
              <li>
                <button
                  onClick={() => onFilterType('video')}
                  className="hover:text-sky-600 transition-colors font-medium"
                >
                  Video Reels &amp; Edits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onFilterType('graphics')}
                  className="hover:text-sky-600 transition-colors font-medium"
                >
                  Graphic Design
                </button>
              </li>
              {onOpenContactModal && (
                <li className="pt-1">
                  <button
                    onClick={onOpenContactModal}
                    className="text-emerald-600 hover:text-emerald-700 font-f1 font-bold text-xs flex items-center space-x-1"
                  >
                    <span>&bull; Get in Touch (WhatsApp / Call)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Verified Brand Pages for Recruiters */}
          <div>
            <h4 className="font-f1 font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">
              Official Channels
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <a
                  href="https://www.instagram.com/hexavianigeria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 hover:text-sky-600 transition-colors font-medium"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  <span>@hexavianigeria</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/tdot_wheels/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 hover:text-sky-600 transition-colors font-medium"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  <span>@tdot_wheels</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@tdot_wheels_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 hover:text-sky-600 transition-colors font-medium"
                >
                  <svg className="w-3.5 h-3.5 fill-current text-slate-800" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.32V8.71a8.18 8.18 0 0 0 4.91 1.62v-3.64h-1z"/>
                  </svg>
                  <span>@tdot_wheels_official</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li className="pt-1 border-t border-slate-100">
                <Link
                  href="/admin"
                  className="text-[11px] text-slate-400 hover:text-sky-600 transition-colors font-medium"
                >
                  Studio Admin Portal
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} Daniel Meduoye. All rights reserved.</p>
          
          <button
            onClick={scrollToTop}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-f1 font-bold text-[11px] transition-colors"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
