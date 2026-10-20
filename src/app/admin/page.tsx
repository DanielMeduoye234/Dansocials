'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Company, MediaType, PortfolioItem } from '@/types/portfolio';
import { 
  getPortfolioItems, 
  savePortfolioItem, 
  deletePortfolioItem, 
  uploadMediaToSupabase, 
  resetToSeedData,
  isSupabaseConfigured 
} from '@/lib/supabase';
import { initialProjects } from '@/data/initialProjects';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, Plus, Play, Image, Upload, Loader2, Cloud, Check, 
  Trash2, ExternalLink, Instagram, Shield, Eye, Layers, Sparkles, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState<Company>('Hexavia');
  const [mediaType, setMediaType] = useState<MediaType>('video');
  const [mediaUrl, setMediaUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [description, setDescription] = useState('');
  const [views, setViews] = useState('');
  const [engagementRate, setEngagementRate] = useState('');
  const [impressions, setImpressions] = useState('');
  const [leadsOrSales, setLeadsOrSales] = useState('');
  const [isMetaAd, setIsMetaAd] = useState(false);
  const [roas, setRoas] = useState('');
  const [tags, setTags] = useState('');

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filterCompany, setFilterCompany] = useState<Company | 'All'>('All');

  // Load items
  useEffect(() => {
    async function loadWorks() {
      try {
        const data = await getPortfolioItems();
        setItems(data);
      } catch (err) {
        console.error('Failed to load portfolio items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWorks();
  }, []);

  // Handle direct file upload to Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('Uploading file to Supabase Cloud...');

    try {
      const result = await uploadMediaToSupabase(file);
      if (result.url) {
        if (file.type.startsWith('video/')) {
          setVideoUrl(result.url);
          setMediaType('video');
          if (!mediaUrl) setMediaUrl(result.url);
        } else {
          setMediaUrl(result.url);
          setMediaType('graphics');
        }
        setUploadStatus('Successfully uploaded to Supabase Storage!');
      } else {
        alert(result.error || 'Failed to upload media to Supabase');
        setUploadStatus(null);
      }
    } catch (err: any) {
      alert(err.message || 'Upload error');
      setUploadStatus(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Submit Post Work
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title for the work.');
      return;
    }

    setIsSubmitting(true);

    const fallbackUrl = mediaUrl.trim() || videoUrl.trim() || instagramUrl.trim();

    const tagsArray = tags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    if (isMetaAd && !tagsArray.includes('Meta Ads')) {
      tagsArray.unshift('Meta Ads');
    }

    const reelMatch = instagramUrl.match(/reel\/([a-zA-Z0-9_-]+)/);
    const reelId = reelMatch ? reelMatch[1] : undefined;

    const newItem: PortfolioItem = {
      id: `work-${Date.now()}`,
      title: title.trim(),
      company,
      mediaType,
      mediaUrl: fallbackUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: fallbackUrl || undefined,
      videoUrl: mediaType === 'video' ? (videoUrl.trim() || undefined) : undefined,
      instagramUrl: instagramUrl.trim() || undefined,
      reelId,
      description: description.trim() || `Campaign managed for ${company}. High-retention short-form video edit & social growth.`,
      strategyHighlights: [
        'Formula 1-inspired visual cadence & sound sync',
        'Optimized for initial 3-second hook retention',
        'Audience positioning & virality architecture'
      ],
      metrics: {
        views: views.trim() || '250K+',
        engagementRate: engagementRate.trim() || '8.4%',
        impressions: impressions.trim() || '650K',
        leadsOrSales: leadsOrSales.trim() || undefined,
        roas: isMetaAd ? (roas.trim() || '4.5x ROAS') : undefined,
      },
      isMetaAd,
      tags: tagsArray.length > 0 ? tagsArray : ['Growth', 'Viral', company, mediaType === 'video' ? 'Reels' : 'Design'],
      createdAt: new Date().toISOString(),
      featured: true,
    };

    try {
      await savePortfolioItem(newItem);
      setItems((prev) => [newItem, ...prev.filter((p) => p.id !== newItem.id)]);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0284c7', '#38bdf8', '#bae6fd', '#0369a1', '#2563eb']
        });
      } catch (_) {}

      setSuccessMessage(`"${newItem.title}" was published successfully!`);
      setTimeout(() => setSuccessMessage(null), 5000);

      // Reset form
      setTitle('');
      setMediaUrl('');
      setVideoUrl('');
      setInstagramUrl('');
      setDescription('');
      setViews('');
      setEngagementRate('');
      setImpressions('');
      setLeadsOrSales('');
      setIsMetaAd(false);
      setRoas('');
      setTags('');
      setUploadStatus(null);
    } catch (err: any) {
      console.error(err);
      alert('Error saving work. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete an item
  const handleDelete = async (id: string, itemTitle: string) => {
    if (!window.confirm(`Are you sure you want to remove "${itemTitle}" from your portfolio?`)) {
      return;
    }

    try {
      await deletePortfolioItem(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
      setSuccessMessage(`Work removed successfully.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete work');
    }
  };

  // Reset to default seed
  const handleResetToSeed = () => {
    if (window.confirm('Reset portfolio to the 9 official verified Instagram reels?')) {
      const def = resetToSeedData();
      setItems(def);
      setSuccessMessage('Reset to official 9 Instagram Reels.');
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  const filteredItems = items.filter(
    (item) => filterCompany === 'All' || item.company === filterCompany
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-sky-600 transition-colors p-1.5 rounded-lg hover:bg-sky-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </Link>

            <span className="text-slate-300">|</span>

            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center font-f1 font-black text-xs">
                D
              </div>
              <div>
                <span className="font-f1 font-extrabold text-xs sm:text-sm tracking-wide text-slate-900 uppercase">
                  DANIEL MEDUOYE // ADMIN PORTAL
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] text-slate-500 font-medium">
                  Work Studio &amp; Content Manager
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-f1 font-bold text-slate-700 border border-slate-200">
              <Shield className="w-3 h-3 text-sky-600" />
              <span>{isSupabaseConfigured ? 'SUPABASE CLOUD ACTIVE' : 'LOCAL CACHE'}</span>
            </div>

            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-f1 text-xs font-bold transition-all shadow-sm"
            >
              View Live Site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        
        {/* Success Alert Banner */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-emerald-900 shadow-sm"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-f1 font-bold text-xs uppercase">ACTION SUCCESSFUL</p>
                  <p className="text-xs text-emerald-700">{successMessage}</p>
                </div>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section 1: Post New Work Form */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 border border-sky-100 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-2 mb-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-f1 font-bold text-sky-600 uppercase tracking-wider mb-1">
                <Plus className="w-3.5 h-3.5" />
                <span>POST WORK TO LIVE PORTFOLIO</span>
              </div>
              <h1 className="font-f1 text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                CREATE NEW PORTFOLIO ENTRY
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Paste your Instagram Reel link, upload files to Supabase, or add graphics for Hexavia &amp; Tdotwheels.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-semibold text-slate-400">Total Live Works:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-f1 font-black text-xs">
                {items.length}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1 & 2: Company & Media Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Selection */}
              <div>
                <label className="block font-f1 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Brand / Client <span className="text-sky-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCompany('Hexavia')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center space-x-2.5 ${
                      company === 'Hexavia'
                        ? 'border-sky-500 bg-sky-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-sky-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-f1 font-black text-xs ${
                      company === 'Hexavia' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      HX
                    </div>
                    <div>
                      <span className="font-f1 font-extrabold text-xs block text-slate-900 uppercase">
                        Hexavia
                      </span>
                      <span className="text-[10px] text-slate-500">Corporate &amp; Strategy</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCompany('Tdotwheels')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center space-x-2.5 ${
                      company === 'Tdotwheels'
                        ? 'border-sky-500 bg-sky-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-sky-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-f1 font-black text-xs ${
                      company === 'Tdotwheels' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      TD
                    </div>
                    <div>
                      <span className="font-f1 font-extrabold text-xs block text-slate-900 uppercase">
                        Tdotwheels
                      </span>
                      <span className="text-[10px] text-slate-500">Automotive &amp; Wheels</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Media Type Selection */}
              <div>
                <label className="block font-f1 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  2. Category <span className="text-sky-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMediaType('video')}
                    className={`p-3 rounded-2xl border-2 text-center transition-all flex items-center justify-center space-x-2 ${
                      mediaType === 'video'
                        ? 'border-sky-500 bg-sky-50/70 text-sky-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-sky-200'
                    }`}
                  >
                    <Play className={`w-4 h-4 ${mediaType === 'video' ? 'text-sky-600 fill-sky-600' : 'text-slate-400'}`} />
                    <span className="font-f1 font-extrabold text-xs uppercase">VIDEO / REEL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaType('graphics')}
                    className={`p-3 rounded-2xl border-2 text-center transition-all flex items-center justify-center space-x-2 ${
                      mediaType === 'graphics'
                        ? 'border-sky-500 bg-sky-50/70 text-sky-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-sky-200'
                    }`}
                  >
                    <Image className={`w-4 h-4 ${mediaType === 'graphics' ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span className="font-f1 font-extrabold text-xs uppercase">GRAPHICS / POST</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block font-f1 text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Work Title <span className="text-sky-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mercedes-AMG G63 Custom Forged Wheels Reveal Reel"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-slate-900 text-sm font-medium transition-all"
              />
            </div>

            {/* Media Upload & URLs */}
            <div className="space-y-3.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-f1 text-xs font-bold uppercase tracking-wider text-slate-800">
                  Media Source (Instagram Reel or Supabase Upload)
                </span>
                {uploadStatus && (
                  <span className="text-[11px] font-semibold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    {isUploading && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
                    <span>{uploadStatus}</span>
                  </span>
                )}
              </div>

              {/* Instagram Reel URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  <span>Instagram Reel URL (Recommended for full embed):</span>
                </label>
                <input
                  type="url"
                  placeholder="https://www.instagram.com/reel/DWzqdVkiUXC/..."
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-500 outline-none text-slate-900 text-xs sm:text-sm bg-white"
                />
              </div>

              {/* Supabase Storage Direct Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <Cloud className="w-3.5 h-3.5 text-sky-600" />
                  <span>Or Upload Media to Supabase Cloud Storage:</span>
                </label>
                <label className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white rounded-xl border-2 border-dashed border-sky-300 hover:border-sky-500 hover:bg-sky-50/50 cursor-pointer transition-all text-xs text-sky-700 font-medium">
                  <Upload className="w-4 h-4 text-sky-500" />
                  <span>
                    {isUploading ? 'Uploading to Supabase...' : 'Click to select Image or MP4 video (max 50MB)'}
                  </span>
                  <input
                    type="file"
                    accept="image/*,video/mp4,video/quicktime,video/webm"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Custom Image / Video URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Or Direct Image / Video URL:
                </label>
                <input
                  type="url"
                  placeholder="https://... (Direct image or MP4 link)"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-500 outline-none text-slate-900 text-xs bg-white"
                />
              </div>
            </div>

            {/* Campaign Metrics */}
            <div>
              <label className="block font-f1 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Performance Metrics (Optional)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Total Views</span>
                  <input
                    type="text"
                    placeholder="e.g. 520K"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-500 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Engagement</span>
                  <input
                    type="text"
                    placeholder="e.g. 9.8%"
                    value={engagementRate}
                    onChange={(e) => setEngagementRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-500 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Impressions</span>
                  <input
                    type="text"
                    placeholder="e.g. 1.1M"
                    value={impressions}
                    onChange={(e) => setImpressions(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-500 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Conversions / Leads</span>
                  <input
                    type="text"
                    placeholder="e.g. 350+ Leads"
                    value={leadsOrSales}
                    onChange={(e) => setLeadsOrSales(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-500 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Description & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-f1 text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Brief Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short note about the video edit, hook, and audience engagement..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-500 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block font-f1 text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Reels, Wheels, Virality, Luxury"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 text-xs text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 text-white font-f1 font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {isSubmitting ? (
                  <span>PUBLISHING WORK...</span>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>PUBLISH WORK TO PORTFOLIO</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </section>

        {/* Section 2: Manage Existing Works */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3 mb-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-f1 font-bold text-slate-600 uppercase tracking-wider mb-1">
                <Layers className="w-3.5 h-3.5 text-sky-600" />
                <span>PORTFOLIO MANAGER</span>
              </div>
              <h2 className="font-f1 text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                CURRENT PUBLISHED WORKS ({filteredItems.length})
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setFilterCompany('All')}
                  className={`px-3 py-1 rounded-lg text-xs font-f1 font-bold transition-all ${
                    filterCompany === 'All' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ALL
                </button>
                <button
                  onClick={() => setFilterCompany('Hexavia')}
                  className={`px-3 py-1 rounded-lg text-xs font-f1 font-bold transition-all ${
                    filterCompany === 'Hexavia' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  HEXAVIA
                </button>
                <button
                  onClick={() => setFilterCompany('Tdotwheels')}
                  className={`px-3 py-1 rounded-lg text-xs font-f1 font-bold transition-all ${
                    filterCompany === 'Tdotwheels' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  TDOTWHEELS
                </button>
              </div>

              <button
                onClick={handleResetToSeed}
                className="px-3 py-1.5 text-[11px] font-f1 font-bold text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Restore original 9 seed reels"
              >
                Reset Default 9 Reels
              </button>
            </div>
          </div>

          {/* List of Published Works */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 transition-all flex items-start justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.reelId ? (
                        <Instagram className="w-6 h-6 text-pink-500" />
                      ) : item.mediaType === 'video' ? (
                        <Play className="w-5 h-5 text-sky-400 fill-sky-400" />
                      ) : (
                        <Image className="w-5 h-5 text-sky-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-f1 font-bold uppercase ${
                          item.company === 'Hexavia' ? 'bg-sky-100 text-sky-800' : 'bg-slate-900 text-sky-300'
                        }`}>
                          {item.company}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-f1 font-bold bg-slate-100 text-slate-600 uppercase">
                          {item.mediaType}
                        </span>
                        {item.metrics.views && (
                          <span className="text-[10px] text-slate-500 font-semibold flex items-center space-x-0.5">
                            <Eye className="w-3 h-3 text-sky-500" />
                            <span>{item.metrics.views}</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-f1 font-bold text-xs sm:text-sm text-slate-900 truncate uppercase">
                        {item.title}
                      </h4>

                      {item.instagramUrl && (
                        <a
                          href={item.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-[11px] text-pink-600 hover:text-pink-700 font-medium mt-1"
                        >
                          <span>Open Instagram Reel</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete work"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 text-xs">
              No works found for the selected company filter.
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
