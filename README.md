# Dansocials
## DANIEL MEDUOYE // Social Media Manager & Video Editor
### Accelerated at Formula 1 Speed 🏎️💨

A modern portfolio web application built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Supabase**, featuring **Formula 1 Sports Typography**, **Motion Graphics**, **Meta Ads Campaign Mastery**, and a crisp **White Background & Light Blue** aesthetic.

---

## 🏁 Key Features & Architectural Highlights

### 1. Motion Graphics with Framer Motion 🎬
- **Hero Staggered Entrances**: Smooth typography and badge reveals at Formula 1 velocity.
- **Fluid Layout Animations**: The portfolio grid re-arranges seamlessly with `AnimatePresence` when switching between companies and media types.
- **Interactive Micro-Interactions**: Hover lifts, glow pulses, telemetry progress tickers, and modal spring zoom effects.
- **Celebratory Visuals**: Confetti explosion on case study publishing and inquiry transmission via `canvas-confetti`.

### 2. Meta Ads Campaign Mastery 🎯
- **Paid Growth Command Center**: Showcases end-to-end expertise managing high-ROAS paid funnels on **Facebook & Instagram**.
- **Verified Ad Performance Metrics**:
  - **$5,000** Managed Meta Ad Spend across Facebook & Instagram
  - **4.9x** Average Return on Ad Spend (ROAS) across accounts
  - **3,800+** High-Quality B2B Leads & E-Commerce Conversions
  - **46%** Reduction in Cost Per Acquisition (CPA)
- **4 Paid Advertising Pillars**:
  - Full-Funnel Retargeting Architecture (TOF, MOF, BOF)
  - Conversions API (CAPI) & Server-Side Pixel Tracking (iOS 14.5+ privacy compliant)
  - High-Velocity Creative A/B Testing (Dynamic Creative, Video Hooks, Carousels)
  - Custom Lookalike & Interest Clustering
- **Dedicated Meta Ads Filter**: Instant one-click toggle to isolate Meta Ads case studies for Hexavia and Tdotwheels.

### 3. Compact Mobile Layout & Animated Hamburger Menu 📱
- **Mobile-First Compact Design**: Optimized paddings, tight telemetry grids, and readable typography across all device sizes.
- **Sleek Hamburger Menu**: Animated drawer powered by Framer Motion featuring quick company filters, navigation links, and a direct "+ POST" button.

### 4. Two Flagship Client Showcases (No Years Displayed) 🏢
- **Hexavia**: Corporate strategy, executive masterclasses, founder thought leadership, and high-ticket B2B Meta Lead Ads.
  - Live Instagram: [instagram.com/hexavianigeria](https://www.instagram.com/hexavianigeria/)
- **Tdotwheels**: Automotive virality, forged monoblock rims, race telemetry HUDs, and dynamic product catalog conversion ads.
  - Live Instagram: [instagram.com/tdot_wheels](https://www.instagram.com/tdot_wheels/)
  - Live TikTok: [tiktok.com/@tdot_wheels_official](https://www.tiktok.com/@tdot_wheels_official)
- **Client Testimonials**: Verified quotes from Hexavia and Tdotwheels leadership.

### 5. Dual Skill / Media Categories 🎨
- **Videos**: Short-form viral reels, kinetic typography, exhaust audio synchronization, and documentary case studies.
- **Graphics**: Technical fitment blueprints, educational slide carousels, and typographic quote grids.

### 6. In-App SMM Studio ("Post Work" Modal) 🛠️
- Select Company (**Hexavia** or **Tdotwheels**)
- Select Category (**Video** or **Graphics**)
- Direct **Upload to Supabase Storage** (images, reels, MP4s up to 50MB)
- Toggle **Meta Ads Campaign** with custom ROAS inputs
- Enter Work Title, description, and execution highlights
- Add Cover Image (with 1-click sample presets or direct Supabase upload)
- Enter Campaign Telemetry (Views, Impressions, Engagement Rate, Leads/Sales, ROAS)
- Instant publication with **confetti** and real-time live grid update!

### 7. Supabase Integration & Cloud Storage 🗄️
- Pre-configured Supabase client in `src/lib/supabase.ts`.
- Pre-configured public Supabase Storage bucket: **`portfolio-media`**.
- Server-side direct media file uploader (`/api/upload`) utilizing the Service Role Key.
- Auto-sync status route (`/api/portfolio/status`).
- Optimistic UI updates with localStorage caching fallback.

---

## 🚀 Running the Project

The development server is running at:
```
http://localhost:3000
```

To run manually in PowerShell:
```powershell
npm.cmd run dev
```

To build for production:
```powershell
npm.cmd run build
```

---

## 🗄️ Supabase Database Setup (1 Click)

Your Supabase project is already configured in `.env.local`:
- **Project ID**: `gpjghzmaykgpwsxfwjbz`
- **URL**: `https://gpjghzmaykgpwsxfwjbz.supabase.co`
- **Storage Bucket**: `portfolio-media` (Created & Live!)

To activate your PostgreSQL database table and seed the 9 official user-provided Instagram Reels:
1. Open your Supabase SQL Editor:
   👉 **[https://supabase.com/dashboard/project/gpjghzmaykgpwsxfwjbz/sql/new](https://supabase.com/dashboard/project/gpjghzmaykgpwsxfwjbz/sql/new)**
2. Copy the entire contents of [`supabase_schema.sql`](file:///c:/Users/DELL%20XPS/Downloads/Danmed%20Social/supabase_schema.sql) in this repository.
3. Paste it into the SQL Editor and click **Run** (or press `Ctrl + Enter`).
4. That's it! Your PostgreSQL table `portfolio_works` is created, Row Level Security is configured, and all 9 official reels are seeded into the cloud with zero demo car images.
