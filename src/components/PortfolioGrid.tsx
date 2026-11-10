'use client';

import React, { useState, useMemo } from 'react';
import { PortfolioItem, Company, MediaType } from '@/types/portfolio';
import ProjectCard from './ProjectCard';
import { 
  Filter, Play, Image, Layers, Search, Sparkles, 
  RotateCcw, ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PortfolioGridProps {
  items: PortfolioItem[];
  onSelectProject: (item: PortfolioItem) => void;
  selectedCompany: Company | 'All';
  onChangeCompany: (company: Company | 'All') => void;
  selectedType: MediaType | 'All';
  onChangeType: (type: MediaType | 'All') => void;
  onResetToSeed: () => void;
}

export default function PortfolioGrid({
  items,
  onSelectProject,
  selectedCompany,
  onChangeCompany,
  selectedType,
  onChangeType,
  onResetToSeed,
}: PortfolioGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'views'>('newest');

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Company Filter
        if (selectedCompany !== 'All' && item.company !== selectedCompany) {
          return false;
        }
        // Media Type Filter
        if (selectedType !== 'All' && item.mediaType !== selectedType) {
          return false;
        }
        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
          const matchCompany = item.company.toLowerCase().includes(q);
          return matchTitle || matchDesc || matchTags || matchCompany;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // views sort
        const parseNum = (val?: string) => {
          if (!val) return 0;
          let clean = val.replace(/[^0-9.]/g, '');
          let n = parseFloat(clean) || 0;
          if (val.toUpperCase().includes('M')) n *= 1000000;
          else if (val.toUpperCase().includes('K')) n *= 1000;
          return n;
        };
        return parseNum(b.metrics.views) - parseNum(a.metrics.views);
      });
  }, [items, selectedCompany, selectedType, searchQuery, sortBy]);

  const resetAllFilters = () => {
    onChangeCompany('All');
    onChangeType('All');
    setSearchQuery('');
  };

  return (
    <section id="portfolio" className="py-8 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-8 pb-3 sm:pb-5 border-b border-sky-100 gap-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-1">
              <Sparkles className="w-3 h-3 text-sky-500" />
              <span>CURATED CAMPAIGNS</span>
            </div>
            <h2 className="font-f1 text-xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
              FEATURED <span className="text-sky-600">PORTFOLIO WORKS</span>
            </h2>
            <p className="mt-0.5 text-slate-500 text-xs sm:text-sm font-sans">
              Explore short-form video reels and creative campaigns across Hexavia, Tdotwheels &amp; Paidflow.
            </p>
          </div>

          <div className="text-[11px] sm:text-xs font-medium text-slate-500 font-sans">
            Showing <strong className="text-slate-900">{filteredItems.length}</strong> campaigns
          </div>
        </div>

        {/* Compact, Modern Swipeable Filters - Never Cluttered on Mobile */}
        <div className="bg-sky-50/40 p-2.5 sm:p-4 rounded-2xl border border-sky-100 mb-6 space-y-2.5">
          
          {/* Horizontal Pill Bar */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
            <button
              onClick={() => {
                onChangeCompany('All');
                onChangeType('All');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-sans font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCompany === 'All' && selectedType === 'All'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-50'
              }`}
            >
              All Works
            </button>

            <button
              onClick={() => {
                onChangeCompany('Hexavia');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-sans font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCompany === 'Hexavia'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-50'
              }`}
            >
              Hexavia
            </button>

            <button
              onClick={() => {
                onChangeCompany('Tdotwheels');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-sans font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCompany === 'Tdotwheels'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-50'
              }`}
            >
              Tdotwheels
            </button>

            <button
              onClick={() => {
                onChangeCompany('Paidflow');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-sans font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCompany === 'Paidflow'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50 hover:text-rose-600'
              }`}
            >
              Other Video Editing (Paidflow)
            </button>

            <button
              onClick={() => {
                onChangeType(selectedType === 'video' ? 'All' : 'video');
              }}
              className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-sans font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedType === 'video'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-50'
              }`}
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>Videos</span>
            </button>

            <button
              onClick={() => {
                onChangeType(selectedType === 'graphics' ? 'All' : 'graphics');
              }}
              className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-sans font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedType === 'graphics'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-50'
              }`}
            >
              <Image className="w-3 h-3" />
              <span>Graphics</span>
            </button>

            {(selectedCompany !== 'All' || selectedType !== 'All' || searchQuery) && (
              <button
                onClick={resetAllFilters}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-sans font-semibold text-sky-700 hover:bg-sky-100 whitespace-nowrap cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Search Bar & Sorter Row */}
          <div className="flex items-center gap-2 pt-1 border-t border-sky-100/70">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search works..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 font-sans transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            <div className="flex items-center space-x-1 text-xs text-slate-500 font-sans flex-shrink-0">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-sky-400"
              >
                <option value="newest">Newest</option>
                <option value="views">Most Views</option>
              </select>
            </div>
          </div>

        </div>

        {/* Portfolio Cards Grid */}
        {filteredItems.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {filteredItems.map((item) => (
                <ProjectCard
                  key={item.id}
                  item={item}
                  onSelect={onSelectProject}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-10 px-4 bg-sky-50/30 rounded-3xl border border-sky-100">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-2">
              <Filter className="w-5 h-5" />
            </div>
            <h3 className="font-sans font-bold text-sm text-slate-900 uppercase">
              No Campaigns Found
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto font-sans">
              No works match your current filters.
            </p>
            <div className="mt-3 flex items-center justify-center">
              <button
                onClick={resetAllFilters}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-sans font-semibold text-slate-700 hover:bg-slate-50"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
