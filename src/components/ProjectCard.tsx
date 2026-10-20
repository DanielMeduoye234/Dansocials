'use client';

import React from 'react';
import { PortfolioItem } from '@/types/portfolio';
import { Play, Image, Eye, TrendingUp, Target, ArrowRight, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  item: PortfolioItem;
  onSelect: (item: PortfolioItem) => void;
}

export default function ProjectCard({ item, onSelect }: ProjectCardProps) {
  const isVideo = item.mediaType === 'video';
  const isHexavia = item.company === 'Hexavia';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect(item)}
      className="group relative bg-white rounded-2xl border border-sky-100 hover:border-sky-300 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Media Preview Box */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center">
        {item.reelId ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 group/reel overflow-hidden">
            {/* Subtle radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.18)_0%,transparent_70%)] group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

            {/* Glowing Instagram Reel Play Center Action */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 p-0.5 shadow-xl group-hover:scale-110 group-hover:shadow-pink-500/30 transition-all duration-300">
                <div className="w-full h-full rounded-full bg-slate-950/90 flex items-center justify-center backdrop-blur-sm">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white ml-0.5 group-hover:text-pink-400 group-hover:fill-pink-400 transition-colors" />
                </div>
              </div>
              <span className="text-[10px] sm:text-[11px] font-f1 font-extrabold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">
                Watch Official Reel
              </span>
            </div>

            {/* Bottom Telemetry Ticker on Card */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between">
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-f1 font-bold bg-slate-900/90 text-pink-400 border border-pink-500/30">
                <Instagram className="w-3 h-3" />
                <span>@{item.company === 'Tdotwheels' ? 'tdot_wheels' : 'hexavianigeria'}</span>
              </span>

              {item.metrics.views && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-f1 font-bold bg-slate-900/90 text-white border border-white/20">
                  <Eye className="w-3 h-3 text-sky-400" />
                  <span>{item.metrics.views}</span>
                </span>
              )}
            </div>
          </div>
        ) : (
          <img
            src={item.mediaUrl}
            alt={item.title}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}

        {/* Top Badges Row */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
          {/* Company Badge */}
          <span
            className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-f1 font-extrabold tracking-wider uppercase shadow-md ${
              isHexavia
                ? 'bg-sky-500 text-white border border-sky-400'
                : 'bg-slate-900 text-sky-400 border border-sky-500/40'
            }`}
          >
            {item.company}
          </span>

          {/* Right Badges */}
          <div className="flex items-center space-x-1.5">
            {item.isMetaAd && (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-f1 font-black tracking-wider uppercase bg-blue-600 text-white shadow-md">
                <Target className="w-2.5 h-2.5" />
                <span>META ADS</span>
              </span>
            )}

            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-f1 font-black tracking-wider uppercase bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-md">
              <Instagram className="w-2.5 h-2.5" />
              <span>IG REEL</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-f1 font-bold text-sm sm:text-base text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 uppercase tracking-wide">
            {item.title}
          </h3>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Highlights & Tags */}
        <div className="mt-3.5 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2.5">
            {item.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium bg-sky-50 text-sky-700 rounded border border-sky-100"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] sm:text-xs font-f1 font-bold text-sky-600 group-hover:text-sky-700">
            <span className="tracking-wider uppercase">
              {item.mediaType === 'video' ? 'WATCH FULL REEL' : 'VIEW WORK'}
            </span>
            <div className="flex items-center space-x-2">
              {item.instagramUrl && (
                <a
                  href={item.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Open Reel on Instagram"
                  className="p-1 rounded-md text-pink-600 hover:text-pink-700 hover:bg-pink-50 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              )}
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
