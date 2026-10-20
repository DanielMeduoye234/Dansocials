'use client';

import React from 'react';
import { MessageCircle, Phone, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingContactButtonProps {
  onOpenModal: () => void;
}

export default function FloatingContactButton({ onOpenModal }: FloatingContactButtonProps) {
  return (
    <div className="fixed bottom-5 right-4 sm:bottom-7 sm:right-7 z-40">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenModal}
        className="group relative flex items-center space-x-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-slate-950 text-white shadow-xl hover:shadow-2xl border border-slate-800 transition-all cursor-pointer"
        aria-label="Get In Touch on WhatsApp or Phone"
      >
        {/* Pulsing Green Online Indicator */}
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>

        {/* WhatsApp & Phone Icons combo */}
        <div className="flex items-center -space-x-1">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm ring-2 ring-slate-950">
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
          </div>
          <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-sm ring-2 ring-slate-950">
            <Phone className="w-3 h-3 text-white" />
          </div>
        </div>

        <div className="flex flex-col text-left">
          <span className="font-f1 font-extrabold text-[11px] sm:text-xs uppercase tracking-wider text-white group-hover:text-sky-300 transition-colors">
            GET IN TOUCH
          </span>
          <span className="text-[9px] text-slate-400 font-medium hidden sm:inline-block">
            WhatsApp &bull; Call
          </span>
        </div>
      </motion.button>
    </div>
  );
}
