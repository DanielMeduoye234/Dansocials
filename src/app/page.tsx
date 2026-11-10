'use client';

import React, { useState, useEffect } from 'react';
import { PortfolioItem, Company, MediaType } from '@/types/portfolio';
import { getPortfolioItems, resetToSeedData } from '@/lib/supabase';
import { initialProjects } from '@/data/initialProjects';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CompanyShowcase from '@/components/CompanyShowcase';
import PortfolioGrid from '@/components/PortfolioGrid';
import OtherVideoProjectsSection from '@/components/OtherVideoProjectsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ProjectModal from '@/components/ProjectModal';
import GetInTouchModal from '@/components/GetInTouchModal';
import FloatingContactButton from '@/components/FloatingContactButton';

export default function Home() {
  const [items, setItems] = useState<PortfolioItem[]>(initialProjects);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | 'All'>('All');
  const [selectedType, setSelectedType] = useState<MediaType | 'All'>('All');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Load items from Supabase or LocalStorage
  useEffect(() => {
    async function loadWorks() {
      try {
        const data = await getPortfolioItems();
        setItems(data);
      } catch (err) {
        console.error('Failed to load portfolio works:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWorks();
  }, []);

  const handleResetToSeed = () => {
    const defaultData = resetToSeedData();
    setItems(defaultData);
    setSelectedCompany('All');
    setSelectedType('All');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-sky-200 selection:text-sky-900">
      {/* Top Navigation with Mobile Animated Hamburger Drawer */}
      <Navbar
        onFilterCompany={setSelectedCompany}
        onFilterType={setSelectedType}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        activeCompany={selectedCompany}
        activeType={selectedType}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section with Formula 1 Speed Styling & Clean Punchy Copy */}
        <Hero
          onFilterCompany={setSelectedCompany}
          onFilterType={setSelectedType}
          onOpenContactModal={() => setIsContactModalOpen(true)}
          totalWorksCount={items.length}
        />

        {/* Company Experience Spotlight (Hexavia & Tdotwheels) */}
        <CompanyShowcase
          onSelectCompany={setSelectedCompany}
          activeCompany={selectedCompany}
        />

        {/* Interactive Portfolio Grid */}
        <PortfolioGrid
          items={items}
          onSelectProject={setSelectedProject}
          selectedCompany={selectedCompany}
          onChangeCompany={setSelectedCompany}
          selectedType={selectedType}
          onChangeType={setSelectedType}
          onResetToSeed={handleResetToSeed}
        />

        {/* Other Video Editing Projects (PaidFlow Videos Folder) */}
        <OtherVideoProjectsSection
          items={items}
          onSelectProject={setSelectedProject}
        />

        {/* Contact & Booking */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onFilterCompany={setSelectedCompany}
        onFilterType={setSelectedType}
        onOpenContactModal={() => setIsContactModalOpen(true)}
      />

      {/* Full Video Modal Alone */}
      <ProjectModal
        item={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Get In Touch Floating Modal (WhatsApp: +2349167560387 | Call: +2347013468525) */}
      <GetInTouchModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* Persistent Floating Contact Button (Bottom Right) */}
      <FloatingContactButton
        onOpenModal={() => setIsContactModalOpen(true)}
      />
    </div>
  );
}
