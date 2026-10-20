'use client';

import React, { useState, useMemo } from 'react';
import { PortfolioItem, Company, MediaType } from '@/types/portfolio';
import ProjectCard from './ProjectCard';
import { 
  Filter, Play, Image, Layers, Search, Sparkles, 
  RotateCcw, ArrowUpDown, Instagram, ExternalLink 
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
    <section id="portfolio" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-5 border-b border-sky-100 gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-[10px] sm:text-xs font-f1 font-bold tracking-wider uppercase mb-1.5">
              <Sparkles className="w-3 h-3 text-sky-500" />
              <span>CURATED CAMPAIGNS</span>
            </div>
            <h2 className="font-f1 text-xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
              FEATURED <span className="text-sky-600">PORTFOLIO WORKS</span>
            </h2>
            <p className="mt-1 text-slate-500 text-xs sm:text-sm">
              Explore short-form video reels and creative campaigns across Hexavia &amp; Tdotwheels.
            </p>
          </div>

          <div className="text-xs font-medium text-slate-500">
            Showing <strong className="text-slate-900">{filteredItems.length}</strong> campaigns
          </div>
        </div>

        {/* Streamlined Filter Controls Bar */}
        <div className="bg-sky-50/50 p-3.5 sm:p-5 rounded-2xl border border-sky-100 mb-6 space-y-3.5">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            {/* Filter 1: Company Selector */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs font-f1 font-bold uppercase text-slate-600 mr-1">
                BRAND:
              </span>

              <button
                onClick={() => onChangeCompany('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-f1 font-bold transition-all ${
                  selectedCompany === 'All'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-50'
                }`}
              >
                ALL
              </button>

              <button
                onClick={() => onChangeCompany('Hexavia')}
                className={`px-3 py-1.5 rounded-lg text-xs font-f1 font-bold transition-all ${
                  selectedCompany === 'Hexavia'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-50'
                }`}
              >
                HEXAVIA
              </button>

              <button
                onClick={() => onChangeCompany('Tdotwheels')}
                className={`px-3 py-1.5 rounded-lg text-xs font-f1 font-bold transition-all ${
                  selectedCompany === 'Tdotwheels'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-50'
                }`}
              >
                TDOTWHEELS
              </button>
            </div>

            {/* Filter 2: Category Selector */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs font-f1 font-bold uppercase text-slate-600 mr-1">
                TYPE:
              </span>

              <button
                onClick={() => onChangeType('All')}
                className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-f1 font-bold transition-all ${
                  selectedType === 'All'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-50'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>ALL</span>
              </button>

              <button
                onClick={() => onChangeType('video')}
                className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-f1 font-bold transition-all ${
                  selectedType === 'video'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-50'
                }`}
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>VIDEOS</span>
              </button>

              <button
                onClick={() => onChangeType('graphics')}
                className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-f1 font-bold transition-all ${
                  selectedType === 'graphics'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-50'
                }`}
              >
                <Image className="w-3 h-3" />
                <span>GRAPHICS</span>
              </button>
            </div>

          </div>

          {/* Search Bar & Sorter */}
          <div className="pt-2 border-t border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="relative w-full sm:max-w-xs md:max-w-sm">
              <input
                type="text"
                placeholder="Search works or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 sm:py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 sm:top-2.5" />
            </div>

            <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center space-x-1 text-xs text-slate-500 font-medium">
                <ArrowUpDown className="w-3.5 h-3.5 text-sky-600" />
                <span className="text-[11px] sm:text-xs">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] sm:text-xs font-semibold text-slate-700 focus:outline-none focus:border-sky-400"
                >
                  <option value="newest">Newest First</option>
                  <option value="views">Highest Views</option>
                </select>
              </div>

              {(selectedCompany !== 'All' || selectedType !== 'All' || searchQuery) && (
                <button
                  onClick={resetAllFilters}
                  className="inline-flex items-center space-x-1 text-[11px] sm:text-xs font-f1 font-bold text-sky-600 hover:text-sky-800"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>RESET</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Portfolio Cards Grid with Framer Motion */}
        {filteredItems.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7"
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
          <div className="text-center py-12 px-4 bg-sky-50/40 rounded-3xl border border-sky-100">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-3">
              <Filter className="w-5 h-5" />
            </div>
            <h3 className="font-f1 font-bold text-base text-slate-900 uppercase">
              No Campaigns Found
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              No works match your current filters.
            </p>
            <div className="mt-4 flex items-center justify-center space-x-3">
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-f1 font-bold text-slate-700 hover:bg-slate-50"
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
