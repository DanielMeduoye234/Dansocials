'use client';

import React, { useState, useMemo } from 'react';
import { PortfolioItem } from '@/types/portfolio';
import { Play, Eye, Film, Sparkles, ArrowRight, Volume2, Layers, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OtherVideoProjectsSectionProps {
  items: PortfolioItem[];
  onSelectProject: (item: PortfolioItem) => void;
}

export default function OtherVideoProjectsSection({
  items,
  onSelectProject,
}: OtherVideoProjectsSectionProps) {
  const [seriesFilter, setSeriesFilter] = useState<'all' | 'giant-mistakes' | 'vs' | 'commercial'>('all');

  // Get all items belonging to Paidflow or Other video editing projects
  const otherVideoItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.company === 'Paidflow' ||
        item.company === 'Other' ||
        item.videoUrl?.includes('/paidflow/') ||
        item.mediaUrl?.includes('/paidflow/') ||
        item.tags?.some((t) => t.toLowerCase() === 'paidflow')
    );
  }, [items]);

  const filteredVideos = useMemo(() => {
    if (seriesFilter === 'all') return otherVideoItems;
    return otherVideoItems.filter((item) => {
      const titleLower = item.title.toLowerCase();
      const urlLower = (item.videoUrl || item.mediaUrl || '').toLowerCase();
      if (seriesFilter === 'giant-mistakes') {
        return titleLower.includes('giant mistakes') || urlLower.includes('_gm_');
      }
      if (seriesFilter === 'vs') {
        return titleLower.includes(' vs') || urlLower.includes('_vs_');
      }
      if (seriesFilter === 'commercial') {
        return (
          !titleLower.includes('giant mistakes') &&
          !urlLower.includes('_gm_') &&
          !titleLower.includes(' vs') &&
          !urlLower.includes('_vs_')
        );
      }
      return true;
    });
  }, [otherVideoItems, seriesFilter]);

  return (
    <section
      id="other-video-projects"
      className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border-t border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 sm:pb-8 border-b border-slate-800 mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] sm:text-xs font-f1 font-bold tracking-wider uppercase mb-3">
              <Film className="w-3.5 h-3.5 text-rose-500" />
              <span>PAIDFLOW VIDEOS FOLDER // 3D MOTION &amp; VOICEOVER REELS</span>
            </div>

            <h2 className="font-f1 text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
              OTHER VIDEO <span className="text-rose-500">EDITING PROJECTS</span>
            </h2>

            <p className="mt-2 text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed font-sans">
              Full-stack short-form video production for <strong className="text-white">Paidflow AI</strong> — featuring{' '}
              <em>Giant Mistakes</em> 3D enterprise case studies, head-to-head <em>VS</em> comparison edits, blueprint breakdowns, and commercial voiceover reels.
            </p>
          </div>

          {/* Fast Project Highlights Pill Box */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 bg-slate-900/90 p-3.5 sm:p-4 rounded-2xl border border-slate-800 flex-shrink-0">
            <div className="text-center px-2">
              <span className="block text-[10px] font-f1 font-bold text-slate-400 uppercase">Videos</span>
              <span className="font-f1 font-black text-base sm:text-xl text-rose-500">
                {otherVideoItems.length}
              </span>
            </div>
            <div className="text-center px-2 border-l border-r border-slate-800">
              <span className="block text-[10px] font-f1 font-bold text-slate-400 uppercase">Audio Mastering</span>
              <span className="font-f1 font-black text-base sm:text-xl text-white">-14 LUFS</span>
            </div>
            <div className="text-center px-2">
              <span className="block text-[10px] font-f1 font-bold text-slate-400 uppercase">Format</span>
              <span className="font-f1 font-black text-base sm:text-xl text-sky-400">9:16 HD</span>
            </div>
          </div>
        </div>

        {/* Series Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSeriesFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold whitespace-nowrap transition-all cursor-pointer ${
                seriesFilter === 'all'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              All Paidflow Videos ({otherVideoItems.length})
            </button>

            <button
              onClick={() => setSeriesFilter('giant-mistakes')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold whitespace-nowrap transition-all cursor-pointer ${
                seriesFilter === 'giant-mistakes'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              Giant Mistakes Series (Apple, Nike, Hershey)
            </button>

            <button
              onClick={() => setSeriesFilter('vs')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold whitespace-nowrap transition-all cursor-pointer ${
                seriesFilter === 'vs'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              VS Comparisons (Slack &amp; WhatsApp)
            </button>

            <button
              onClick={() => setSeriesFilter('commercial')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold whitespace-nowrap transition-all cursor-pointer ${
                seriesFilter === 'commercial'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              Commercials &amp; Blueprints
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-400">
            <Volume2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Click any card to watch full video with voiceover</span>
          </div>
        </div>

        {/* Video Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <AnimatePresence>
            {filteredVideos.map((item) => {
              const videoSrc = item.videoUrl || item.mediaUrl;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => onSelectProject(item)}
                  className="group relative rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/60 overflow-hidden shadow-lg hover:shadow-rose-500/10 flex flex-col cursor-pointer transition-all"
                >
                  {/* Video Preview Container */}
                  <div className="relative aspect-[9/12] w-full bg-black overflow-hidden flex items-center justify-center">
                    <video
                      src={`${videoSrc}#t=0.5`}
                      muted
                      playsInline
                      loop
                      preload="metadata"
                      onMouseEnter={(e) => {
                        e.currentTarget.play().catch(() => {});
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0.5;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-f1 font-bold uppercase tracking-wider bg-rose-600 text-white shadow-md">
                        {item.company}
                      </span>

                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[9px] font-f1 font-bold uppercase bg-slate-950/85 text-slate-200 border border-white/15 backdrop-blur-xs">
                        <Film className="w-2.5 h-2.5 text-rose-400" />
                        <span>MP4 EDIT</span>
                      </span>
                    </div>

                    {/* Center Play Action */}
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-rose-600/90 group-hover:bg-rose-500 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                      <span className="mt-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 text-[10px] font-f1 font-bold uppercase tracking-wider text-white border border-white/10">
                        Play With Sound
                      </span>
                    </div>

                    {/* Bottom Video Telemetry */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
                      <span className="text-[10px] font-f1 font-bold text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                        Paidflow Videos
                      </span>
                      {item.metrics?.views && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-f1 font-bold bg-slate-950/80 text-white border border-slate-800">
                          <Eye className="w-3 h-3 text-rose-400" />
                          <span>{item.metrics.views}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-sans font-bold text-sm text-white group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                      <div className="flex flex-wrap gap-1 mb-2.5">
                        {item.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 text-[9px] font-medium bg-slate-800 text-slate-300 rounded border border-slate-700"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-f1 font-bold text-rose-400 group-hover:text-rose-300">
                        <span className="uppercase tracking-wider">WATCH FULL VIDEO</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

