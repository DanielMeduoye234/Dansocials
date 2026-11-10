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
    company TEXT NOT NULL CHECK (company IN ('Hexavia', 'Tdotwheels', 'Paidflow', 'Other')),
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

-- Ensure columns and updated company check constraint exist if table was already created
ALTER TABLE public.portfolio_works ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE public.portfolio_works ADD COLUMN IF NOT EXISTS reel_id TEXT;
ALTER TABLE public.portfolio_works ADD COLUMN IF NOT EXISTS is_meta_ad BOOLEAN DEFAULT false;
ALTER TABLE public.portfolio_works ADD COLUMN IF NOT EXISTS meta_ad_details JSONB DEFAULT NULL;
ALTER TABLE public.portfolio_works DROP CONSTRAINT IF EXISTS portfolio_works_company_check;
ALTER TABLE public.portfolio_works ADD CONSTRAINT portfolio_works_company_check CHECK (company IN ('Hexavia', 'Tdotwheels', 'Paidflow', 'Other'));

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

-- 6. Configure Storage Bucket for Media & Graphics (Remove 50MB bucket cap for larger video uploads)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('portfolio-media', 'portfolio-media', true, NULL)
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = NULL;

-- Storage RLS Policies (SELECT, INSERT, UPDATE, DELETE so upsert & direct upload never fail)
DROP POLICY IF EXISTS "Public Access To Portfolio Media" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload To Portfolio Media" ON storage.objects;
DROP POLICY IF EXISTS "Public Update To Portfolio Media" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete From Portfolio Media" ON storage.objects;

CREATE POLICY "Public Access To Portfolio Media"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-media');

CREATE POLICY "Public Upload To Portfolio Media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Public Update To Portfolio Media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-media');

CREATE POLICY "Public Delete From Portfolio Media"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-media');

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
),
-- 10. Paidflow Video 1 (Other Video Editing Project)
(
    'Stop Juggling 4 Apps: Unified Store Operations (Brand Red Edit)',
    'Paidflow',
    'video',
    '/videos/paidflow/paidflow_reel1_4apps_RED.mp4',
    NULL,
    '/videos/paidflow/paidflow_reel1_4apps_RED.mp4',
    NULL,
    NULL,
    'High-energy commercial reel in signature Paidflow Brand Red (#E31E2D), contrasting fragmented 4-app chaos against one unified project management and store execution workspace.',
    '["Frame-0 problem hook illustrating 4-app operational fatigue", "High-contrast #E31E2D Brand Red & #0A0A0A motion typography system", "Engineered to drive 7-day free trial signups at paidflow.online"]'::jsonb,
    '{"views": "310K+", "engagementRate": "11.2%", "impressions": "740K", "sharesOrSaves": "9.4K Saves"}'::jsonb,
    '["Paidflow", "Video Editing", "Motion Graphics", "Brand Red", "SaaS Reel"]'::jsonb,
    'Position Paidflow as the all-in-one operational command center replacing scattered store apps.',
    '["Full Motion Reel Edit", "Custom Sound Design", "Multi-Platform 9:16 Master"]'::jsonb,
    false,
    NULL,
    true,
    '2026-10-29T18:00:00Z'
),
-- 11. Paidflow Video 2 (Other Video Editing Project)
(
    'The 11:47 PM Store Owner Crisis: Automated Task & Order Routing',
    'Paidflow',
    'video',
    '/videos/paidflow/paidflow_reel2_1147_voiceover.mp4',
    NULL,
    '/videos/paidflow/paidflow_reel2_1147_voiceover.mp4',
    NULL,
    NULL,
    'Story-driven voiceover reel capturing the late-night 11:47 PM operational bottleneck of e-commerce founders and demonstrating automated action-item routing in Paidflow.',
    '["Emotional founder storytelling hook (\"11:47 PM\") with synchronized voiceover", "Visual workflow transition from late-night burnout to automated AI task boards", "Loudness-normalized (-14 LUFS) commercial voiceover mix"]'::jsonb,
    '{"views": "275K+", "engagementRate": "10.6%", "impressions": "620K", "sharesOrSaves": "8.1K Saves"}'::jsonb,
    '["Paidflow", "Voiceover Edit", "Storytelling", "Workflow Automation", "Reels"]'::jsonb,
    'Connect emotionally with overwhelmed store owners and showcase automated task routing.',
    '["Voiceover Sync Edit", "Kinetic Captioning", "Audio Mastering (-14 LUFS)"]'::jsonb,
    false,
    NULL,
    true,
    '2026-10-29T16:00:00Z'
),
-- 12. Paidflow Video 3 (Other Video Editing Project)
(
    'Giant Mistakes: Nike’s $400M Inventory & Demand Forecasting Breakdown',
    'Paidflow',
    'video',
    '/videos/paidflow/paidflow_gm_nike.mp4',
    NULL,
    '/videos/paidflow/paidflow_gm_nike.mp4',
    NULL,
    NULL,
    'Fast-paced 3D narrative video edit examining how a $400M demand-forecasting software glitch hit Nike, featuring custom 3D Flo animation and operational lessons for store teams.',
    '["7-act \"Giant Mistakes\" documentary structure (Hook, Damage, Turn, Flo Lesson, CTA)", "Custom 3D props and 3D Flo character integration synced to voiceover cadence", "High-retention educational storytelling format engineered for shares & saves"]'::jsonb,
    '{"views": "490K+", "engagementRate": "12.8%", "impressions": "1.1M", "sharesOrSaves": "19.5K Saves"}'::jsonb,
    '["Paidflow", "Giant Mistakes", "Nike Case Study", "3D Animation", "Video Editing"]'::jsonb,
    'Turn historic enterprise supply-chain breakdowns into viral educational reels.',
    '["3D Motion Reel", "Voiceover & SFX Sync", "Fact-Checked Script Visuals"]'::jsonb,
    false,
    NULL,
    true,
    '2026-10-28T15:00:00Z'
),
-- 13. Paidflow Video 4 (Other Video Editing Project)
(
    'Giant Mistakes: Hershey’s $100M Halloween Fulfillment Meltdown',
    'Paidflow',
    'video',
    '/videos/paidflow/paidflow_gm_hershey.mp4',
    NULL,
    '/videos/paidflow/paidflow_gm_hershey.mp4',
    NULL,
    NULL,
    'High-retention 3D storytelling edit dissecting Hershey’s notorious $100M ERP and supply-chain breakdown during peak Halloween season, paired with structured workflow takeaways.',
    '["High-curiosity financial hook ($100M Halloween miss) on frame 0", "Seamless pacing between archival-style data cards and 3D Flo lesson cards", "Precision audio hit synchronization within ±1 frame"]'::jsonb,
    '{"views": "410K+", "engagementRate": "11.9%", "impressions": "940K", "sharesOrSaves": "15.2K Saves"}'::jsonb,
    '["Paidflow", "Giant Mistakes", "Hershey Case Study", "3D Motion", "Viral Edit"]'::jsonb,
    'Educate e-commerce operators on fulfillment visibility before peak season.',
    '["3D Documentary Reel", "Dynamic Scoreboard & Cards", "Voiceover Master"]'::jsonb,
    false,
    NULL,
    true,
    '2026-10-27T14:00:00Z'
),
-- 14. Paidflow Video 5 (Other Video Editing Project)
(
    'Giant Mistakes: Apple’s Operational Breakdown & Supply Chain Lesson',
    'Paidflow',
    'video',
    '/videos/paidflow/paidflow_gm_apple.mp4',
    NULL,
    '/videos/paidflow/paidflow_gm_apple.mp4',
    NULL,
    NULL,
    '3D animated documentary reel breaking down a historic Apple operational crisis, complete with custom 3D Flo character animation, kinetic typography, and AI voiceover sync.',
    '["Compelling authority hook leveraging Apple’s operational turnaround story", "Clean safe-zone composition optimized for Instagram Reels & YouTube Shorts UI", "High watch-through retention driven by sentence-by-sentence visual reveals"]'::jsonb,
    '{"views": "530K+", "engagementRate": "13.1%", "impressions": "1.25M", "sharesOrSaves": "22.4K Saves"}'::jsonb,
    '["Paidflow", "Giant Mistakes", "Apple Case Study", "Video Editing", "3D Flo"]'::jsonb,
    'Capture broad tech & founder audiences through iconic brand history edits.',
    '["3D Animated Reel", "Custom Audio Mix", "IG & YT Shorts Export"]'::jsonb,
    false,
    NULL,
    true,
    '2026-10-26T13:00:00Z'
),
-- 15. Paidflow Video 6 (Other Video Editing Project)
(
    'Paidflow Blueprint: Precision Product Launch & Sprint Architecture',
    'Paidflow',
    'video',
    '/videos/paidflow/paidflow_bp_iphone.mp4',
    NULL,
    '/videos/paidflow/paidflow_bp_iphone.mp4',
    NULL,
    NULL,
    'Deep-dive motion & voiceover edit analyzing iconic hardware launch precision and showing how modern teams structure high-stakes product rollouts and sprint boards.',
    '["Blueprint breakdown visual theme with step-by-step flow diagrams", "Crisp kinetic typography highlighting milestone and cycle execution", "Fast-paced editing cadence tailored for executive & founder retention"]'::jsonb,
    '{"views": "240K+", "engagementRate": "9.7%", "impressions": "560K", "sharesOrSaves": "7.8K Saves"}'::jsonb,
    '["Paidflow", "Blueprint Series", "Product Launch", "Motion Edit", "Sprint Board"]'::jsonb,
    'Demonstrate structured launch planning and milestone tracking.',
    '["Blueprint Motion Reel", "Flow Diagram Animation", "Sound Design"]'::jsonb,
    false,
    NULL,
    false,
    '2026-10-25T12:00:00Z'
),
-- 16. Paidflow Video 7 (Other Video Editing Project)
(
    'Paidflow vs. Slack: Team Chat vs. Store Operations & Sprint Execution',
    'Paidflow',
    'video',
    '/videos/paidflow/paidflow_vs_slack.mp4',
    NULL,
    '/videos/paidflow/paidflow_vs_slack.mp4',
    NULL,
    NULL,
    'Head-to-head comparison reel featuring 3D referee Flo and a live round-by-round scoreboard comparing general team chat in Slack against dedicated store workflow execution in Paidflow.',
    '["Credible round-by-round VS format where one round fairly goes to the rival", "3D referee Flo with dynamic scoreboard transitions and sound effects", "Clear positioning verdict: \"Just need chat? Use Slack. Running a store team? Use Paidflow.\""]'::jsonb,
    '{"views": "360K+", "engagementRate": "11.4%", "impressions": "830K", "sharesOrSaves": "11.9K Shares"}'::jsonb,
    '["Paidflow", "Paidflow vs Slack", "VS Series", "Comparison Edit", "3D Referee"]'::jsonb,
    'Differentiate structured project & store task execution from standard chat threads.',
    '["VS Format Video Edit", "Scoreboard Motion Graphics", "Voiceover Sync"]'::jsonb,
    false,
    NULL,
    true,
    '2026-10-24T17:00:00Z'
),
-- 17. Paidflow Video 8 (Other Video Editing Project)
(
    'Paidflow vs. WhatsApp: Group Chat Chaos vs. Structured Workflows',
    'Paidflow',
    'video',
    '/videos/paidflow/paidflow_vs_whatsapp.mp4',
    NULL,
    '/videos/paidflow/paidflow_vs_whatsapp.mp4',
    NULL,
    NULL,
    'Dynamic split-round comparison edit illustrating why fast-growing e-commerce teams outgrow unsearchable WhatsApp threads and upgrade to structured sprint boards.',
    '["Relatable hook targeting store teams managing orders inside WhatsApp group chats", "Visual contrast between buried chat messages and trackable Kanban action items", "High comment & share velocity among e-commerce operators"]'::jsonb,
    '{"views": "395K+", "engagementRate": "12.3%", "impressions": "910K", "sharesOrSaves": "14.6K Shares"}'::jsonb,
    '["Paidflow", "Paidflow vs WhatsApp", "VS Series", "Video Editing", "E-Commerce"]'::jsonb,
    'Convert teams relying on ad-hoc messaging apps into structured Paidflow workspaces.',
    '["Comparison Reel Edit", "Custom UI Motion Cards", "Full Audio Mastering"]'::jsonb,
    false,
    NULL,
    true,
    '2026-10-23T15:30:00Z'
);

-- Confirmation Output
SELECT count(*) AS total_works_seeded FROM public.portfolio_works;
