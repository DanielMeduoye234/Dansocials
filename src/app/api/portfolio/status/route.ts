import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { initialProjects } from '@/data/initialProjects';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function GET() {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({
      connected: false,
      error: 'Supabase credentials missing from environment',
    });
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    // Check bucket
    const { data: buckets } = await supabase.storage.listBuckets();
    const mediaBucket = buckets?.find((b: any) => b.name === 'portfolio-media');

    // Check table
    const { data: rows, error } = await supabase
      .from('portfolio_works')
      .select('id, title, company, is_meta_ad')
      .limit(10);

    if (error) {
      return NextResponse.json({
        connected: true,
        tableExists: false,
        error: error.message,
        code: error.code,
        mediaBucketConfigured: Boolean(mediaBucket),
        hint: 'Table public.portfolio_works needs to be created using supabase_schema.sql in the Supabase Dashboard SQL Editor.',
      });
    }

    // If table exists but has 0 rows, auto-seed with initialProjects!
    let totalCount = rows?.length || 0;
    let seeded = false;

    if (totalCount === 0) {
      const dbRows = initialProjects.map((item) => ({
        title: item.title,
        company: item.company,
        media_type: item.mediaType,
        media_url: item.mediaUrl,
        thumbnail_url: item.thumbnailUrl || item.mediaUrl,
        video_url: item.videoUrl || null,
        description: item.description,
        strategy_highlights: item.strategyHighlights,
        metrics: item.metrics,
        tags: item.tags,
        client_objective: item.clientObjective || null,
        deliverables: item.deliverables || null,
        is_meta_ad: item.isMetaAd ?? false,
        meta_ad_details: item.metaAdDetails ?? null,
        instagram_url: item.instagramUrl || null,
        reel_id: item.reelId || null,
        featured: item.featured ?? false,
        created_at: item.createdAt,
      }));

      const { data: inserted, error: insertErr } = await supabase
        .from('portfolio_works')
        .insert(dbRows)
        .select();

      if (!insertErr && inserted) {
        seeded = true;
        totalCount = inserted.length;
      }
    }

    return NextResponse.json({
      connected: true,
      tableExists: true,
      totalWorksInSupabase: totalCount,
      mediaBucketConfigured: Boolean(mediaBucket),
      autoSeeded: seeded,
    });
  } catch (err: any) {
    return NextResponse.json({
      connected: false,
      error: err.message,
    });
  }
}
