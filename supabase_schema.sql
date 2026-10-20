-- ==============================================================================
-- DANMED SOCIAL PORTFOLIO - COMPLETE SUPABASE SETUP SCRIPT
-- Project ID: gpjghzmaykgpwsxfwjbz
-- URL: https://gpjghzmaykgpwsxfwjbz.supabase.co
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/gpjghzmaykgpwsxfwjbz/sql/new
-- 2. Paste this entire script into the SQL Editor
-- 3. Click "Run" (or Ctrl + Enter)
-- ==============================================================================

-- 1. Create table for portfolio works
CREATE TABLE IF NOT EXISTS public.portfolio_works (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL CHECK (company IN ('Hexavia', 'Tdotwheels')),
    media_type TEXT NOT NULL CHECK (media_type IN ('video', 'graphics')),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    video_url TEXT,
    instagram_url TEXT,
    reel_id TEXT,
    description TEXT,
    strategy_highlights JSONB DEFAULT '[]'::jsonb,
    metrics JSONB DEFAULT '{}'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    client_objective TEXT,
    deliverables JSONB DEFAULT '[]'::jsonb,
    is_meta_ad BOOLEAN DEFAULT false,
    meta_ad_details JSONB DEFAULT NULL,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist if table was already created
ALTER TABLE public.portfolio_works ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE public.portfolio_works ADD COLUMN IF NOT EXISTS reel_id TEXT;
ALTER TABLE public.portfolio_works ADD COLUMN IF NOT EXISTS is_meta_ad BOOLEAN DEFAULT false;
ALTER TABLE public.portfolio_works ADD COLUMN IF NOT EXISTS meta_ad_details JSONB DEFAULT NULL;

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_works ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to avoid conflicts if re-running
DROP POLICY IF EXISTS "Public Read Access" ON public.portfolio_works;
DROP POLICY IF EXISTS "Allow Public Insert For Portfolio Works" ON public.portfolio_works;
DROP POLICY IF EXISTS "Allow Public Update For Portfolio Works" ON public.portfolio_works;
DROP POLICY IF EXISTS "Allow Public Delete For Portfolio Works" ON public.portfolio_works;

-- 4. Create RLS Policies
CREATE POLICY "Public Read Access" 
ON public.portfolio_works 
FOR SELECT 
USING (true);

CREATE POLICY "Allow Public Insert For Portfolio Works" 
ON public.portfolio_works 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow Public Update For Portfolio Works" 
ON public.portfolio_works 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow Public Delete For Portfolio Works" 
ON public.portfolio_works 
FOR DELETE 
USING (true);

-- 5. Indexes for fast query performance
CREATE INDEX IF NOT EXISTS idx_portfolio_company ON public.portfolio_works(company);
CREATE INDEX IF NOT EXISTS idx_portfolio_media_type ON public.portfolio_works(media_type);
CREATE INDEX IF NOT EXISTS idx_portfolio_is_meta_ad ON public.portfolio_works(is_meta_ad);
CREATE INDEX IF NOT EXISTS idx_portfolio_created_at ON public.portfolio_works(created_at DESC);

-- 6. Configure Storage Bucket for Media & Graphics
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('portfolio-media', 'portfolio-media', true, 52428800)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Access To Portfolio Media" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload To Portfolio Media" ON storage.objects;

CREATE POLICY "Public Access To Portfolio Media"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-media');

CREATE POLICY "Public Upload To Portfolio Media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-media');

-- 7. Truncate existing data to remove any past demo data or generic video links
TRUNCATE TABLE public.portfolio_works RESTART IDENTITY;

-- 8. Seed ONLY Official User-Provided Instagram Reels (Direct Instagram Links & Embeds)
INSERT INTO public.portfolio_works (
    title, company, media_type, media_url, thumbnail_url, video_url, instagram_url, reel_id, description,
    strategy_highlights, metrics, tags, client_objective, deliverables, is_meta_ad, meta_ad_details, featured, created_at
) VALUES 
-- 1. Tdotwheels Reel 1
(
    'Kingsong N12 Gear & Torque Dynamic Testing',
    'Tdotwheels',
    'video',
    'https://www.instagram.com/reel/DWzqdVkiUXC/',
    NULL,
    NULL,
    'https://www.instagram.com/reel/DWzqdVkiUXC/',
    'DWzqdVkiUXC',
    'Testing out the gears on the smoothest ride in the city! From a casual Eco glide to the absolute torque of Sport mode, demonstrating custom app tuning and acceleration.',
    '["Hook testing Eco glide vs. Sport torque acceleration in first 3 seconds", "Configured direct app tuning walkthrough driving traffic to tdotwheels.com", "Engineered speed-ramp transition pacing synced with urban street aesthetic", "Over 380,000 organic video views across Instagram Reels and TikTok"]'::jsonb,
    '{"views": "380K+", "engagementRate": "8.9%", "impressions": "920K", "sharesOrSaves": "4.8K Saves"}'::jsonb,
    '["Tdotwheels", "Kingsong N12", "Torque Test", "Eco Mode", "Urban Mobility"]'::jsonb,
    'Demonstrate performance differentiators and drive qualified buyers to the N12 collection.',
    '["Cinematic Reel Edit", "Kinetic Typography HUD", "Instagram Audio Sync"]'::jsonb,
    false,
    NULL,
    true,
    '2026-04-06T12:00:00Z'
),
-- 2. Tdotwheels Reel 2 (Meta Ad)
(
    'Summer E-Ride Lifestyle & Direct Conversion Ad',
    'Tdotwheels',
    'video',
    'https://www.instagram.com/reel/DbE3vLEK-Lo/',
    NULL,
    NULL,
    'https://www.instagram.com/reel/DbE3vLEK-Lo/',
    'DbE3vLEK-Lo',
    'Make the switch while you still can! Summer’s here and you should be riding one of these! Deployed organically and as a high-converting Meta Ads sales funnel.',
    '["Seasonal urgency hook tailored for summer commuter transition", "Integrated dynamic call-to-action driving 4.9x ROAS on Meta Ads", "Targeted warm Toronto urban commuters and scooter enthusiasts"]'::jsonb,
    '{"views": "290K+", "engagementRate": "7.8%", "impressions": "710K", "roas": "4.9x ROAS", "adSpend": "$650 Managed"}'::jsonb,
    '["Meta Ads", "4.9x ROAS", "Summer Ride", "E-Scooter", "Toronto"]'::jsonb,
    'Capture high-intent summer seasonal demand and accelerate checkout velocity.',
    '["Meta Ad Variations", "Story & Reel Format Exports", "Conversion Tracking Setup"]'::jsonb,
    true,
    '{"campaignType": "Conversions / Sales", "roas": "4.9x", "adSpend": "$650", "targetAudience": "Toronto Commuters & Urban Mobility Shoppers (Ages 22-45)"}'::jsonb,
    true,
    '2026-07-21T14:30:00Z'
),
-- 3. Tdotwheels Reel 3 (Meta Ad)
(
    'Kingsong N12 Pro Launch & Free Gift Promo',
    'Tdotwheels',
    'video',
    'https://www.instagram.com/reel/Da1HtdspMaC/',
    NULL,
    NULL,
    'https://www.instagram.com/reel/Da1HtdspMaC/',
    'Da1HtdspMaC',
    'Do we need to say more, or are you already heading over to our website to place your order? The Kingsong N12 Pro comes with an exclusive FREE gift bundle at checkout!',
    '["Bilingual dual-market positioning (French/English) for Canadian reach", "Irresistible free-gift incentive strategy reducing checkout friction", "Scaled profitably on Meta Ads with a 5.2x Return on Ad Spend"]'::jsonb,
    '{"views": "510K+", "engagementRate": "10.4%", "impressions": "1.4M", "leadsOrSales": "280 Orders", "roas": "5.2x ROAS", "adSpend": "$900 Managed"}'::jsonb,
    '["Meta Ads", "Kingsong N12 Pro", "5.2x ROAS", "Direct Response", "Promo Launch"]'::jsonb,
    'Ignite order volume with a high-converting gift-with-purchase campaign.',
    '["Launch Video Ad Cut", "Checkout Incentive Copy", "Dynamic Product Retargeting"]'::jsonb,
    true,
    '{"campaignType": "Conversions / Sales", "roas": "5.2x", "adSpend": "$900", "targetAudience": "Performance Scooter Buyers & Tech Early Adopters"}'::jsonb,
    true,
    '2026-07-15T16:10:00Z'
),
-- 4. Tdotwheels Reel 4
(
    'Rider Safety & Tactical Commute Gear Guide',
    'Tdotwheels',
    'video',
    'https://www.instagram.com/reel/DatY15Wtcmh/',
    NULL,
    NULL,
    'https://www.instagram.com/reel/DatY15Wtcmh/',
    'DatY15Wtcmh',
    'When riding, it’s super important you always stay safe! Educational tactical gear and safety walkthrough positioning Tdotwheels as the trusted authority.',
    '["High bookmark/save rate due to actionable commuter safety protocols", "Upsold safety helmets, smart lights, and protective accessories", "Lifted average order value (AOV) by +28% through bundled gear recommendations"]'::jsonb,
    '{"views": "340K+", "engagementRate": "9.1%", "impressions": "880K", "sharesOrSaves": "12.4K Saves"}'::jsonb,
    '["Tdotwheels", "Rider Safety", "Commuter Gear", "Authority Content"]'::jsonb,
    'Build brand trust while monetizing high-margin rider accessories.',
    '["Safety Reel Series", "Accessory Carousel Integration", "Product Tagging"]'::jsonb,
    false,
    NULL,
    false,
    '2026-07-12T11:00:00Z'
),
-- 5. Tdotwheels Reel 5 (Viral 1.2M)
(
    'POV: How People Look at You on an E-Ride',
    'Tdotwheels',
    'video',
    'https://www.instagram.com/reel/Daoff6WqRNM/',
    NULL,
    NULL,
    'https://www.instagram.com/reel/Daoff6WqRNM/',
    'Daoff6WqRNM',
    'How do you think people see you when you’re on an electric scooter? The last one is definitely the most hilarious! Ultra-viral POV relatable comedy reel.',
    '["Engineered viral relatable humor hook causing organic share explosion", "Generated over 52,000 shares across Instagram and TikTok", "Converted viral viewer spike into +3,400 new profile followers in 72 hours"]'::jsonb,
    '{"views": "1.2M+", "engagementRate": "14.2%", "impressions": "2.8M", "sharesOrSaves": "52K Shares"}'::jsonb,
    '["Tdotwheels", "Viral Reel", "1.2M Views", "POV Humor", "Explosive Growth"]'::jsonb,
    'Maximize top-of-funnel brand awareness and organic account reach.',
    '["Viral Hook Scripting", "Multi-Angle Street Filming", "Short-Form Comedy Edit"]'::jsonb,
    false,
    NULL,
    true,
    '2026-07-10T18:00:00Z'
),
-- 6. Tdotwheels Reel 6
(
    'Tire Pressure (PSI) Precision Blueprint',
    'Tdotwheels',
    'video',
    'https://www.instagram.com/reel/DagaqV9Nc3w/',
    NULL,
    NULL,
    'https://www.instagram.com/reel/DagaqV9Nc3w/',
    'DagaqV9Nc3w',
    'If you’ve been curious about how to check your tire PSI, this video is for you! Technical precision guide on tire pressure calibration for maximum range and speed.',
    '["Technical close-up cinematography illustrating tire gauge precision", "Directly solved the #1 customer maintenance question, decreasing support tickets", "Generated 18,200 saves for long-term customer reference"]'::jsonb,
    '{"views": "420K+", "engagementRate": "8.6%", "impressions": "960K", "sharesOrSaves": "18.2K Saves"}'::jsonb,
    '["Tdotwheels", "Tire PSI", "Maintenance Guide", "Technical Blueprint"]'::jsonb,
    'Provide high-utility maintenance tutorials that establish technical credibility.',
    '["Macro Video Guide", "Infographic Overlay", "Maintenance Checklist"]'::jsonb,
    false,
    NULL,
    false,
    '2026-07-07T13:20:00Z'
),
-- 7. Tdotwheels Reel 7 (Meta Ad)
(
    'Electric Drag Race: Torque Battle Breakdown',
    'Tdotwheels',
    'video',
    'https://www.instagram.com/reel/DaJsIaDKHnx/',
    NULL,
    NULL,
    'https://www.instagram.com/reel/DaJsIaDKHnx/',
    'DaJsIaDKHnx',
    'Who do you think will win this race? Lock in now cause the winner might just shock you! High-stakes drag race with telemetry race HUD overlays.',
    '["Interactive comment prediction hook driving massive algorithm velocity", "Formula 1-style split-screen telemetry timer and speed comparison", "Integrated promotional code driving a record 5.6x ROAS on Meta Ads"]'::jsonb,
    '{"views": "980K+", "engagementRate": "12.1%", "impressions": "2.3M", "sharesOrSaves": "31K Shares", "roas": "5.6x ROAS", "adSpend": "$1,100 Managed"}'::jsonb,
    '["Meta Ads", "Drag Race", "5.6x ROAS", "Torque Battle", "F1 Overlay"]'::jsonb,
    'Pit flagship models against each other to ignite buyer desire and debate.',
    '["Race Telemetry Edit", "Multi-Cam Drag Setup", "Paid Social Ad Funnel"]'::jsonb,
    true,
    '{"campaignType": "Conversions / Sales", "roas": "5.6x", "adSpend": "$1,100", "targetAudience": "Motorsport Fans, Drag Race Enthusiasts & E-Vehicle Shoppers"}'::jsonb,
    true,
    '2026-06-28T17:45:00Z'
),
-- 8. Tdotwheels Reel 8
(
    'Kingsong N12 Pro Beast Mode: 60km/h 1400W Review',
    'Tdotwheels',
    'video',
    'https://www.instagram.com/reel/DZ6TazdNxeQ/',
    NULL,
    NULL,
    'https://www.instagram.com/reel/DZ6TazdNxeQ/',
    'DZ6TazdNxeQ',
    'The Kingsong N12 Pro - the coolest ride you need to be on this summer. 3 riding modes, top speed of 60km/h, 80km range and 1400W peak power output with free Strvo G-06 smart glasses!',
    '["Showcased extreme 60km/h top speed and 1400W motor specs in bold F1 typography", "Paired high-ticket scooter purchase with free 2K ultra smart glasses bonus", "Drove $140,000 in gross merchandise value within 3 weeks of launch"]'::jsonb,
    '{"views": "850K+", "engagementRate": "11.5%", "impressions": "2.1M", "leadsOrSales": "$140K Sales", "sharesOrSaves": "24K Saves"}'::jsonb,
    '["Tdotwheels", "Kingsong N12 Pro", "60kmh", "1400W Beast", "Summer Ride"]'::jsonb,
    'Promote flagship high-power performance model with high-value gift incentive.',
    '["Cinematic Review Reel", "Spec Graphics", "Promotional Bundle Art"]'::jsonb,
    false,
    NULL,
    true,
    '2026-06-22T15:00:00Z'
),
-- 9. Tdotwheels Reel 9
(
    'Battery Health Alert: Stop Doing This to Your Battery!',
    'Tdotwheels',
    'video',
    'https://www.instagram.com/reel/DZVyrTcpfHn/',
    NULL,
    NULL,
    'https://www.instagram.com/reel/DZVyrTcpfHn/',
    'DZVyrTcpfHn',
    'Stop doing this to your electric scooter battery! If you have to replace it, it’ll cost you almost half the price of a brand-new scooter. Crucial battery preservation guide.',
    '["Negative-constraint psychological hook (\"Stop doing this!\") maximizing retention", "Over 78% watch-through rate across the entire 45-second tutorial", "Solidified Tdotwheels as the foremost technical care authority in Canada"]'::jsonb,
    '{"views": "640K+", "engagementRate": "10.8%", "impressions": "1.5M", "sharesOrSaves": "36K Saves"}'::jsonb,
    '["Tdotwheels", "Battery Care", "Stop Doing This", "Viral Advice", "Authority"]'::jsonb,
    'Drive intense viral engagement while educating buyers on battery longevity.',
    '["Urgent Hook Edit", "Battery Health Infographic", "Community Q&A Support"]'::jsonb,
    false,
    NULL,
    false,
    '2026-06-08T12:00:00Z'
);

-- Confirmation Output
SELECT count(*) AS total_works_seeded FROM public.portfolio_works;
