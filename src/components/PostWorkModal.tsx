'use client';

import React, { useState } from 'react';
import { Company, MediaType, PortfolioItem } from '@/types/portfolio';
import { savePortfolioItem, uploadMediaToSupabase, isVideoFile } from '@/lib/supabase';
import confetti from 'canvas-confetti';
import { 
  X, Plus, Play, Image, Sparkles, Check, Link as LinkIcon, 
  BarChart2, Tag, Target, TrendingUp, Upload, Loader2, Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PostWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkAdded: (newItem: PortfolioItem) => void;
}

export default function PostWorkModal({
  isOpen,
  onClose,
  onWorkAdded,
}: PostWorkModalProps) {
  // Form State
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState<Company>('Hexavia');
  const [mediaType, setMediaType] = useState<MediaType>('video');
  const [mediaUrl, setMediaUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [description, setDescription] = useState('');
  const [strategyHighlights, setStrategyHighlights] = useState('');
  const [views, setViews] = useState('');
  const [engagementRate, setEngagementRate] = useState('');
  const [impressions, setImpressions] = useState('');
  const [leadsOrSales, setLeadsOrSales] = useState('');
  const [isMetaAd, setIsMetaAd] = useState(false);
  const [roas, setRoas] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const detectedVideo = isVideoFile(file);
    setIsUploading(true);
    setUploadStatus(`Uploading ${detectedVideo ? 'video' : 'image'}...`);

    try {
      const result = await uploadMediaToSupabase(file);
      if (result.url) {
        if (detectedVideo) {
          setVideoUrl(result.url);
          setMediaType('video');
          if (!mediaUrl) {
            setMediaUrl(result.url);
          }
        } else {
          setMediaUrl(result.url);
        }
        setUploadStatus(
          result.storage === 'local'
            ? 'Uploaded to Local High-Capacity Storage!'
            : 'Uploaded to Supabase Cloud!'
        );
      } else {
        alert(result.error || 'Failed to upload media');
        setUploadStatus(null);
      }
    } catch (err: any) {
      alert(err.message || 'Upload error');
      setUploadStatus(null);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) {
      alert('Please wait for your upload to finish before publishing.');
      return;
    }
    if (!title.trim()) {
      alert('Please enter a title for your work.');
      return;
    }

    const fallbackUrl = videoUrl.trim() || mediaUrl.trim() || instagramUrl.trim();
    if (!fallbackUrl) {
      alert('Please upload a file or provide a media URL first.');
      return;
    }

    setIsSubmitting(true);

    const highlightsArray = strategyHighlights
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const tagsArray = tags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
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
      mediaUrl: fallbackUrl,
      thumbnailUrl: fallbackUrl,
      videoUrl: mediaType === 'video' ? (videoUrl.trim() || undefined) : undefined,
      instagramUrl: instagramUrl.trim() || undefined,
      reelId,
      description: description.trim() || `Social media growth campaign managed for ${company}. Focused on high-retention audience scaling and creative positioning.`,
      strategyHighlights: highlightsArray.length > 0 ? highlightsArray : [
        'Optimized for initial 3-second hook retention',
        'Formula 1-inspired visual cadence and dynamic typography',
        'High-converting audience targeting and testing'
      ],
      metrics: {
        views: views.trim() || '250K+',
        engagementRate: engagementRate.trim() || '8.2%',
        impressions: impressions.trim() || '620K',
        leadsOrSales: leadsOrSales.trim() || undefined,
        roas: isMetaAd ? (roas.trim() || '4.5x ROAS') : undefined,
      },
      isMetaAd,
      metaAdDetails: isMetaAd ? {
        campaignType: 'Conversions / Sales',
        roas: roas.trim() || '4.5x',
      } : undefined,
      tags: tagsArray.length > 0 ? tagsArray : ['Growth', 'Viral', company, mediaType === 'video' ? 'Reels' : 'Design'],
      createdAt: new Date().toISOString(),
      featured: true,
    };

    try {
      await savePortfolioItem(newItem);
      
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0284c7', '#38bdf8', '#bae6fd', '#0369a1', '#2563eb']
        });
      } catch (err) {}

      setShowSuccessToast(true);
      onWorkAdded(newItem);

      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessToast(false);
        onClose();
        // Reset form
        setTitle('');
        setMediaUrl('');
        setVideoUrl('');
        setInstagramUrl('');
        setDescription('');
        setStrategyHighlights('');
        setViews('');
        setEngagementRate('');
        setImpressions('');
        setLeadsOrSales('');
        setIsMetaAd(false);
        setRoas('');
        setTags('');
      }, 1000);

    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert('Error saving work. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 lg:p-8 bg-slate-950/70 backdrop-blur-md">
        
        {/* Background backdrop */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Card with Framer Motion */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-sky-100 z-10 flex flex-col"
        >
          
          {/* Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 bg-white/95 backdrop-blur-md border-b border-sky-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-sky-600 flex items-center justify-center text-white shadow-glow-sm">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-f1 font-extrabold text-base sm:text-lg text-slate-900 tracking-wide uppercase">
                  POST NEW WORK // SMM STUDIO
                </h2>
                <p className="text-[11px] text-slate-500">
                  Publish works for Hexavia or Tdotwheels across Video, Graphics &amp; Meta Ads
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Alert */}
          {showSuccessToast && (
            <div className="m-4 p-3.5 rounded-xl bg-sky-50 border border-sky-300 flex items-center space-x-2.5 text-sky-900 animate-in fade-in">
              <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <p className="font-f1 font-bold text-xs uppercase">WORK PUBLISHED SUCCESSFULLY!</p>
                <p className="text-[11px] text-sky-700">Added to your live portfolio showcase.</p>
              </div>
            </div>
          )}

          {/* Form Body - Compact Spacing */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            
            {/* 1. Company Selection */}
            <div>
              <label className="block font-f1 text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                1. Select Company <span className="text-sky-600">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setCompany('Hexavia')}
                  className={`p-3 rounded-xl border-2 text-left transition-all flex items-center space-x-2.5 ${
                    company === 'Hexavia'
                      ? 'border-sky-500 bg-sky-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-sky-200'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-f1 font-bold text-xs ${
                    company === 'Hexavia' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    HX
                  </div>
                  <div>
                    <span className="font-f1 font-extrabold text-xs block text-slate-900 uppercase">
                      Hexavia
                    </span>
                    <span className="text-[10px] text-slate-500">Corporate &amp; Advisory</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCompany('Tdotwheels')}
                  className={`p-3 rounded-xl border-2 text-left transition-all flex items-center space-x-2.5 ${
                    company === 'Tdotwheels'
                      ? 'border-sky-500 bg-sky-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-sky-200'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-f1 font-bold text-xs ${
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

                <button
                  type="button"
                  onClick={() => {
                    setCompany('Paidflow');
                    setMediaType('video');
                  }}
                  className={`p-3 rounded-xl border-2 text-left transition-all flex items-center space-x-2.5 ${
                    company === 'Paidflow' || company === 'Other'
                      ? 'border-rose-500 bg-rose-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-rose-200'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-f1 font-bold text-xs ${
                    company === 'Paidflow' || company === 'Other' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    PF
                  </div>
                  <div>
                    <span className="font-f1 font-extrabold text-xs block text-slate-900 uppercase">
                      Paidflow / Other
                    </span>
                    <span className="text-[10px] text-slate-500">Other Video Editing</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Category Selection */}
            <div>
              <label className="block font-f1 text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                2. Select Category / Skill <span className="text-sky-600">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`p-3 rounded-xl border-2 text-center transition-all flex items-center justify-center space-x-2 ${
                    mediaType === 'video'
                      ? 'border-sky-500 bg-sky-50/70 text-sky-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-sky-200'
                  }`}
                >
                  <Play className={`w-3.5 h-3.5 ${mediaType === 'video' ? 'text-sky-600 fill-sky-600' : 'text-slate-400'}`} />
                  <span className="font-f1 font-extrabold text-xs uppercase">VIDEO WORK</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMediaType('graphics')}
                  className={`p-3 rounded-xl border-2 text-center transition-all flex items-center justify-center space-x-2 ${
                    mediaType === 'graphics'
                      ? 'border-sky-500 bg-sky-50/70 text-sky-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-sky-200'
                  }`}
                >
                  <Image className={`w-3.5 h-3.5 ${mediaType === 'graphics' ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span className="font-f1 font-extrabold text-xs uppercase">GRAPHICS WORK</span>
                </button>
              </div>
            </div>

            {/* Meta Ads Campaign Toggle */}
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="font-f1 font-bold text-xs text-blue-900 block">
                    Meta Ads Campaign?
                  </span>
                  <span className="text-[10px] text-blue-700">
                    Flag as paid Facebook / Instagram ad campaign with ROAS metrics
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isMetaAd}
                onChange={(e) => setIsMetaAd(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* 3. Title */}
            <div>
              <label className="block font-f1 text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Work Title <span className="text-sky-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Masterclass Viral Leadership Reel"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-200 outline-none text-slate-900 text-xs sm:text-sm transition-all"
              />
            </div>

            {/* 4. Media Upload & URLs */}
            <div className="space-y-2.5">
              {/* Supabase Storage Direct Upload */}
              <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5">
                    <Cloud className="w-4 h-4 text-sky-600" />
                    <span className="font-f1 text-[11px] font-bold uppercase tracking-wider text-sky-900">
                      Upload File to Supabase Cloud
                    </span>
                  </div>
                  {uploadStatus && (
                    <span className="text-[10px] font-medium text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      {isUploading && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
                      <span>{uploadStatus}</span>
                    </span>
                  )}
                </div>

                <label className="flex items-center justify-center space-x-2 px-3 py-2 bg-white rounded-lg border-2 border-dashed border-sky-300 hover:border-sky-500 hover:bg-sky-50/50 cursor-pointer transition-all text-xs text-sky-700">
                  <Upload className="w-3.5 h-3.5 text-sky-500" />
                  <span className="font-medium">
                    {isUploading ? 'Uploading to Supabase...' : 'Choose image or video file (max 50MB)'}
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

              {/* Or manual URL */}
              <div>
                <label className="block font-f1 text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Preview Image URL (or paste external URL)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://... or Supabase storage link"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 outline-none text-slate-900 text-xs sm:text-sm"
                  />
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Instagram Reel URL */}
              {mediaType === 'video' && (
                <div>
                  <label className="block font-f1 text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Instagram Reel URL <span className="text-pink-600">*</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.instagram.com/reel/DWzqdVkiUXC/..."
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 outline-none text-slate-900 text-xs sm:text-sm"
                  />
                </div>
              )}
            </div>

            {/* 5. Metrics & ROAS */}
            <div>
              <label className="block font-f1 text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Campaign Telemetry &amp; Metrics
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Views</span>
                  <input
                    type="text"
                    placeholder="e.g. 450K"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:border-sky-500 text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Engagement</span>
                  <input
                    type="text"
                    placeholder="e.g. 9.4%"
                    value={engagementRate}
                    onChange={(e) => setEngagementRate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:border-sky-500 text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Impressions</span>
                  <input
                    type="text"
                    placeholder="e.g. 1.2M"
                    value={impressions}
                    onChange={(e) => setImpressions(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:border-sky-500 text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">
                    {isMetaAd ? 'ROAS' : 'Conversions'}
                  </span>
                  <input
                    type="text"
                    placeholder={isMetaAd ? "e.g. 5.2x ROAS" : "e.g. 420 Orders"}
                    value={isMetaAd ? roas : leadsOrSales}
                    onChange={(e) => isMetaAd ? setRoas(e.target.value) : setLeadsOrSales(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:border-sky-500 text-xs font-semibold text-sky-800"
                  />
                </div>
              </div>
            </div>

            {/* 6. Description */}
            <div>
              <label className="block font-f1 text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Description / Strategy
              </label>
              <textarea
                rows={2}
                placeholder="Explain the strategy, visual direction, and campaign outcome..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-500 outline-none text-slate-900 text-xs transition-all"
              />
            </div>

            {/* 7. Tags */}
            <div>
              <label className="block font-f1 text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Reels, Viral, Strategy, Meta Ads"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-500 outline-none text-slate-900 text-xs transition-all"
              />
            </div>

            {/* Submit Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold text-xs"
              >
                Cancel
              </button>

              <button
                id="btn-submit-post-work"
                type="submit"
                disabled={isSubmitting || isUploading}
                className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 text-white font-f1 font-extrabold text-xs uppercase tracking-wide shadow-md disabled:opacity-50"
              >
                {isUploading ? (
                  <span>UPLOADING VIDEO...</span>
                ) : isSubmitting ? (
                  <span>PUBLISHING...</span>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>PUBLISH WORK</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
