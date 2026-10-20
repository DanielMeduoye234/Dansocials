'use client';

import React, { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, Copy, Check, ArrowRight, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GetInTouchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GetInTouchModal({ isOpen, onClose }: GetInTouchModalProps) {
  const [copiedType, setCopiedType] = useState<'whatsapp' | 'call' | null>(null);

  const whatsappNumber = '+2349167560387';
  const whatsappDisplay = '+234 916 756 0387';
  const whatsappUrl = `https://wa.me/2349167560387?text=Hi%20Daniel,%20I%20checked%20out%20your%20portfolio%20and%20would%20love%20to%20discuss%20a%20project!`;

  const callNumber = '+2347013468525';
  const callDisplay = '+234 701 346 8525';
  const callUrl = `tel:+2347013468525`;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCopy = (text: string, type: 'whatsapp' | 'call') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md">
        
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-white">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-sky-700 flex items-center justify-center text-white font-sans font-black text-sm shadow-sm">
                D
              </div>
              <div>
                <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900 uppercase tracking-tight">
                  Get In Touch &bull; Daniel Meduoye
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 font-sans">
                  Fastest response via WhatsApp or Direct Call
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 space-y-3.5 bg-slate-50/50 overflow-y-auto">
            
            {/* Card 1: WhatsApp (Primary) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 border border-emerald-200/90 shadow-sm hover:border-emerald-400 transition-all">
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 flex-shrink-0">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 mb-0.5">
                      <span className="font-sans font-bold text-xs uppercase tracking-wide text-emerald-950">
                        WhatsApp Chat
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-sans font-bold bg-emerald-100 text-emerald-800">
                        Fastest
                      </span>
                    </div>
                    <span className="font-sans font-extrabold text-sm sm:text-base text-slate-900 tracking-tight block">
                      {whatsappDisplay}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(whatsappNumber, 'whatsapp')}
                  className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg bg-white hover:bg-emerald-50 border border-emerald-200 text-[10px] font-semibold text-emerald-800 transition-colors cursor-pointer"
                  title="Copy WhatsApp number"
                >
                  {copiedType === 'whatsapp' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-emerald-600" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-sans font-bold text-xs sm:text-sm uppercase tracking-wide shadow-sm shadow-emerald-500/25 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 2: Direct Phone Call */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 via-white to-sky-50/40 border border-sky-200/90 shadow-sm hover:border-sky-400 transition-all">
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md flex-shrink-0">
                    <Phone className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 mb-0.5">
                      <span className="font-sans font-bold text-xs uppercase tracking-wide text-slate-900">
                        Direct Phone Call
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-sans font-bold bg-sky-100 text-sky-800">
                        Voice
                      </span>
                    </div>
                    <span className="font-sans font-extrabold text-sm sm:text-base text-slate-900 tracking-tight block">
                      {callDisplay}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(callNumber, 'call')}
                  className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg bg-white hover:bg-sky-50 border border-sky-200 text-[10px] font-semibold text-slate-700 transition-colors cursor-pointer"
                  title="Copy phone number"
                >
                  {copiedType === 'call' ? (
                    <>
                      <Check className="w-3 h-3 text-sky-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={callUrl}
                className="w-full inline-flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-sans font-bold text-xs sm:text-sm uppercase tracking-wide shadow-sm transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span>Call +234 701 346 8525</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
              </a>
            </div>

            {/* Email Alternative Note */}
            <div className="pt-1 flex items-center justify-between text-xs text-slate-500 font-sans">
              <span className="flex items-center space-x-1 truncate pr-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="text-[11px] truncate">
                  Email: <a href="mailto:danielmeduoye@gmail.com" className="font-semibold text-slate-800 underline">danielmeduoye@gmail.com</a>
                </span>
              </span>

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 text-xs font-semibold flex-shrink-0"
              >
                Close
              </button>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
