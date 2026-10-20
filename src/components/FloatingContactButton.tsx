'use client';

import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingContactButtonProps {
  onOpenModal: () => void;
}

export default function FloatingContactButton({ onOpenModal }: FloatingContactButtonProps) {
  return (
    <aside aria-label="Quick contact" className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-40">
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onOpenModal}
        className="group relative flex items-center justify-center p-3 sm:px-4 sm:py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white shadow-xl hover:shadow-2xl border border-sky-400/40 backdrop-blur-md transition-all cursor-pointer"
        aria-label="Get In Touch on WhatsApp or Phone"
      >
        {/* Pulsing Green Online Indicator */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-white"></span>
        </span>

        {/* WhatsApp & Phone Icons */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
          </div>
          <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-sm flex-shrink-0 hidden sm:flex">
            <Phone className="w-3 h-3 text-white" />
          </div>
          <span className="hidden sm:inline-block font-sans font-bold text-xs uppercase tracking-wider text-white pr-1">
            Get in Touch
          </span>
        </div>
      </motion.button>
    </aside>
  );
}
