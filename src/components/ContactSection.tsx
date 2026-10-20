'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, Check, Mail, MessageSquare, Sparkles, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [brand, setBrand] = useState('');
  const [service, setService] = useState('meta-ads');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSent(true);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#0284c7', '#38bdf8', '#bae6fd']
        });
      } catch (err) {}

      setName('');
      setEmail('');
      setBrand('');
      setMessage('');
    }, 600);
  };

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-sky-50/50 border-t border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Pitch & Contact Info */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-f1 font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>PIT LANE // COLLABORATE</span>
            </div>

            <h2 className="font-f1 text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase">
              COLLABORATE WITH <br />
              <span className="text-sky-600">DANIEL MEDUOYE</span>
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
              Available for social media management, short-form video editing, viral Reels production, and brand growth.
            </p>

            <div className="space-y-3 pt-1">
              {/* WhatsApp Card */}
              <a
                href="https://wa.me/2349167560387?text=Hi%20Daniel,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project!"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200 transition-all shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-emerald-500/25">
                    <MessageSquare className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-f1 font-extrabold text-emerald-800 uppercase tracking-wider">
                      WhatsApp Chat (Fastest Response)
                    </span>
                    <span className="text-sm font-f1 font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                      +234 916 756 0387
                    </span>
                  </div>
                </div>
                <span className="text-xs font-f1 font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </a>

              {/* Direct Phone Call Card */}
              <a
                href="tel:+2347013468525"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-sky-50/70 hover:bg-sky-100/80 border border-sky-200 transition-all shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Sparkles className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-f1 font-extrabold text-sky-800 uppercase tracking-wider">
                      Direct Voice Call
                    </span>
                    <span className="text-sm font-f1 font-black text-slate-900 group-hover:text-sky-700 transition-colors">
                      +234 701 346 8525
                    </span>
                  </div>
                </div>
                <span className="text-xs font-f1 font-bold text-sky-700 group-hover:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </a>

              {/* Email Card */}
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-f1 font-bold text-slate-400 uppercase">Direct Email</span>
                  <a href="mailto:danielmeduoye@gmail.com" className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-sky-600 transition-colors">
                    danielmeduoye@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="pt-2 border-t border-sky-100 flex items-center space-x-2 text-xs">
              <span className="text-[10px] sm:text-xs font-f1 font-bold text-slate-400 uppercase">Proven Experience:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-f1 font-bold bg-sky-50 text-sky-800 border border-sky-200">
                HEXAVIA
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-f1 font-bold bg-slate-900 text-sky-400">
                TDOTWHEELS
              </span>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-sky-100 shadow-card">
              
              {sent ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center mx-auto shadow-glow-sm">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-f1 font-extrabold text-xl text-slate-900 uppercase">
                    INQUIRY TRANSMITTED!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                    Thank you for reaching out. I will review your brand goals and respond within 24 hours.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-3 px-5 py-2 rounded-xl bg-slate-900 text-white font-f1 font-bold text-xs uppercase hover:bg-slate-800"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-f1 text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Your Name <span className="text-sky-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Alex Morgan"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 text-xs sm:text-sm text-slate-900 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-f1 text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Email Address <span className="text-sky-600">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 text-xs sm:text-sm text-slate-900 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-f1 text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Brand / Company
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Performance"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 text-xs sm:text-sm text-slate-900 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-f1 text-[11px] font-bold uppercase text-slate-700 mb-1">
                        Service Focus
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 text-xs sm:text-sm text-slate-900 outline-none transition-all bg-white"
                      >
                        <option value="videos">Viral Short-Form Video &amp; Reels Production</option>
                        <option value="full-smm">Full Social Media Management Retainer</option>
                        <option value="graphics">Graphic Design &amp; Carousels</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-f1 text-[11px] font-bold uppercase text-slate-700 mb-1">
                      Project Details / Goals
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell me about your social media goals, desired video volume, or audience..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 text-xs sm:text-sm text-slate-900 outline-none transition-all"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center space-x-2 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 text-white font-f1 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-sky-500/25 transition-all"
                  >
                    {isSubmitting ? (
                      <span>TRANSMITTING...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>SEND INQUIRY // INITIATE COLLABORATION</span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
