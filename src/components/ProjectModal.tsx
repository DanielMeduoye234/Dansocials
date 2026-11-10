'use client';

import React, { useEffect } from 'react';
import { PortfolioItem } from '@/types/portfolio';
import { X, Eye, Instagram, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
}

export default function ProjectModal({ item, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const isHexavia = item.company === 'Hexavia';
  const isPaidflow = item.company === 'Paidflow' || item.company === 'Other';
  const videoSrc =
    item.videoUrl ||
    (item.mediaType === 'video' &&
    typeof item.mediaUrl === 'string' &&
    (item.mediaUrl.endsWith('.mp4') ||
      item.mediaUrl.endsWith('.mov') ||
      item.mediaUrl.endsWith('.webm'))
      ? item.mediaUrl
      : undefined);

  const officialAccount =
    item.company === 'Tdotwheels'
      ? '@tdot_wheels'
      : item.company === 'Hexavia'
      ? '@hexavianigeria'
      : 'paidflow.online';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md">
        
        {/* Click outside to close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Window: Dedicated Theater Mode for Full Video Alone */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-[500px] md:max-w-[540px] max-h-[96vh] flex flex-col bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden z-10"
        >
          
          {/* Minimal Floating Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950/95 border-b border-slate-800/80 z-20">
            <div className="flex items-center space-x-2 min-w-0 pr-2">
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-sans font-bold uppercase tracking-wide ${
                  isHexavia
                    ? 'bg-sky-500 text-white'
                    : isPaidflow
                    ? 'bg-rose-600 text-white'
                    : 'bg-white text-slate-900'
                }`}
              >
                {item.company}
              </span>

              <h3 className="font-sans font-bold text-xs sm:text-sm text-white truncate">
                {item.title}
              </h3>
            </div>

            <div className="flex items-center space-x-1.5 flex-shrink-0">
              {item.instagramUrl && (
                <a
                  href={item.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 hover:text-white text-[11px] font-bold transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Instagram</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}

              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full Video Alone Container */}
          <div className="relative flex-1 w-full bg-black flex items-center justify-center overflow-hidden">
            {item.reelId ? (
              <div className="w-full flex flex-col items-center justify-center p-1 sm:p-2">
                <iframe
                  src={`https://www.instagram.com/reel/${item.reelId}/embed/`}
                  width="100%"
                  height="640"
                  frameBorder="0"
                  scrolling="no"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  className="w-full max-w-[460px] mx-auto rounded-2xl border border-slate-800 bg-black min-h-[580px] sm:min-h-[620px]"
                />
              </div>
            ) : videoSrc ? (
              <video
                src={videoSrc}
                controls
                autoPlay
                playsInline
                className="w-full max-h-[80vh] object-contain rounded-xl bg-black"
              />
            ) : (
              <div className="p-2 w-full flex items-center justify-center">
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  className="w-full max-h-[75vh] object-contain rounded-2xl"
                />
              </div>
            )}
          </div>

          {/* Minimal Bottom Info Strip */}
          <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              {item.metrics.views && (
                <span className="inline-flex items-center space-x-1 font-semibold text-slate-300">
                  <Eye className="w-3.5 h-3.5 text-sky-400" />
                  <span>{item.metrics.views} views</span>
                </span>
              )}
              {item.metrics.engagementRate && (
                <span className="text-[11px] text-sky-400 font-medium">
                  • {item.metrics.engagementRate} eng
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-400">
                Project: <strong className="text-white">{officialAccount}</strong>
              </span>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
