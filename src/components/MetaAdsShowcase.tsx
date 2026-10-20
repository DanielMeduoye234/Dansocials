'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { metaAdsSummary } from '@/data/initialProjects';
import { Target, TrendingUp, DollarSign, Users, Award, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface MetaAdsShowcaseProps {
  onFilterMetaAds: () => void;
}

export default function MetaAdsShowcase({ onFilterMetaAds }: MetaAdsShowcaseProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section id="meta-ads" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-sky-50/50 to-white border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-f1 font-bold tracking-wider uppercase mb-3 shadow-sm"
          >
            <Target className="w-3.5 h-3.5 text-blue-600" />
            <span>PAID GROWTH SPECIALIST // FACEBOOK &amp; INSTAGRAM</span>
          </motion.div>

          <h2 className="font-f1 text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
            META ADS CAMPAIGN <span className="text-sky-600">COMMAND CENTER</span>
          </h2>
          
          <p className="mt-2.5 text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            Proficient in architecting end-to-end paid advertising funnels on Facebook &amp; Instagram. Transforming creative assets into high-ROAS revenue engines with advanced pixel tracking and audience modeling.
          </p>
        </div>

        {/* 4 Core Telemetry Metrics Bar */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10"
        >
          {/* Metric 1 */}
          <motion.div variants={itemVariants} className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-100 shadow-card">
            <div className="flex items-center space-x-1.5 text-sky-600 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-[10px] sm:text-[11px] font-f1 font-bold uppercase tracking-wider text-slate-400">
                Ad Spend Managed
              </span>
            </div>
            <span className="font-f1 font-black text-xl sm:text-2xl text-slate-900 block">
              {metaAdsSummary.totalSpendManaged}
            </span>
            <span className="text-[11px] text-sky-600 font-medium">Profitable Scaling</span>
          </motion.div>

          {/* Metric 2 */}
          <motion.div variants={itemVariants} className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-100 shadow-card">
            <div className="flex items-center space-x-1.5 text-sky-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[10px] sm:text-[11px] font-f1 font-bold uppercase tracking-wider text-slate-400">
                Average ROAS
              </span>
            </div>
            <span className="font-f1 font-black text-xl sm:text-2xl text-sky-600 block">
              {metaAdsSummary.averageRoas}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Across Hexavia &amp; Tdot</span>
          </motion.div>

          {/* Metric 3 */}
          <motion.div variants={itemVariants} className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-100 shadow-card">
            <div className="flex items-center space-x-1.5 text-sky-600 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-[10px] sm:text-[11px] font-f1 font-bold uppercase tracking-wider text-slate-400">
                Leads &amp; Conversions
              </span>
            </div>
            <span className="font-f1 font-black text-xl sm:text-2xl text-slate-900 block">
              {metaAdsSummary.totalLeadsGenerated}
            </span>
            <span className="text-[11px] text-sky-600 font-medium">B2B &amp; E-Commerce</span>
          </motion.div>

          {/* Metric 4 */}
          <motion.div variants={itemVariants} className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-100 shadow-card">
            <div className="flex items-center space-x-1.5 text-sky-600 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-[10px] sm:text-[11px] font-f1 font-bold uppercase tracking-wider text-slate-400">
                CPA Reduction
              </span>
            </div>
            <span className="font-f1 font-black text-xl sm:text-2xl text-slate-900 block">
              {metaAdsSummary.avgReductionInCac}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Through Creative A/B</span>
          </motion.div>
        </motion.div>

        {/* 4 Execution Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {metaAdsSummary.certifiedPillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-sky-100 shadow-sm hover:shadow-card hover:border-sky-300 transition-all"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-f1 font-bold text-sm sm:text-base text-slate-900 uppercase">
                    {pillar.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Meta Ads Campaign Spotlight Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-f1 font-bold">
              <span>CASE STUDY DATA // VERIFIED ROAS</span>
            </div>
            <h3 className="font-f1 font-black text-xl sm:text-2xl uppercase tracking-tight">
              Meta Ads Scaled for Hexavia &amp; Tdotwheels
            </h3>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
              From corporate B2B lead generation funnels for Hexavia to high-velocity e-commerce wheel checkout campaigns for Tdotwheels.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onFilterMetaAds}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-f1 font-extrabold text-xs uppercase tracking-wider shadow-lg hover:bg-sky-50 transition-colors flex-shrink-0"
          >
            <span>VIEW META ADS CASE STUDIES</span>
            <ArrowRight className="w-4 h-4 text-sky-600" />
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}
