import { createClient } from '@supabase/supabase-js';
import { PortfolioItem, Company } from '@/types/portfolio';
import { initialProjects } from '@/data/initialProjects';

const DEFAULT_SUPABASE_URL = 'https://gpjghzmaykgpwsxfwjbz.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamdoem1heWtncHdzeGZ3amJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0ODI2NTUsImV4cCI6MjEwODA1ODY1NX0.WMCHVWwGEgrS0B1TyiVnVTzeeBO2fjZP0EtBhbA5w34';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const STORAGE_KEY = 'danmed_social_portfolio_items_v6';

// Helper to clean legacy storage keys containing demo car images or generic videos
function cleanLegacyStorage() {
  if (typeof window === 'undefined') return;
  const legacyKeys = [
    'danmed_social_portfolio_items',
    'danmed_social_portfolio_items_v1',
    'danmed_social_portfolio_items_v2',
    'danmed_social_portfolio_items_v3',
    'danmed_social_portfolio_items_v4',
    'danmed_social_portfolio_items_v5'
  ];
  legacyKeys.forEach(k => {
    try { localStorage.removeItem(k); } catch (_) {}
  });
}

// Helper to resolve true company even if DB constraint forced fallback storage
function resolveCompanyAndTags(rawCompany: string, rawTags: string[], mediaUrl?: string, videoUrl?: string): { company: Company; tags: string[] } {
  let resolvedCompany: Company = (rawCompany as Company) || 'Hexavia';
  const cleanTags: string[] = [];

  for (const t of rawTags) {
    if (typeof t === 'string' && t.startsWith('__company:')) {
      const extracted = t.replace('__company:', '').trim() as Company;
      if (extracted) resolvedCompany = extracted;
    } else {
      cleanTags.push(t);
    }
  }

  if (
    resolvedCompany !== 'Paidflow' &&
    resolvedCompany !== 'Other' &&
    (cleanTags.some(t => t.toLowerCase() === 'paidflow') ||
      mediaUrl?.includes('/paidflow/') ||
      videoUrl?.includes('/paidflow/'))
  ) {
    resolvedCompany = 'Paidflow';
  }

  return { company: resolvedCompany, tags: cleanTags };
}

// Merge items without duplicates (by id, videoUrl, instagramUrl, or title)
function mergeUniquePortfolioItems(primary: PortfolioItem[], secondary: PortfolioItem[]): PortfolioItem[] {
  const seenIds = new Set(primary.map(i => String(i.id)));
  const seenTitles = new Set(primary.map(i => i.title.trim().toLowerCase()));
  const seenMedia = new Set(
    primary
      .map(i => (i.videoUrl || i.instagramUrl || i.mediaUrl || '').trim())
      .filter(Boolean)
  );

  const merged = [...primary];

  for (const item of secondary) {
    const idKey = String(item.id);
    const titleKey = item.title.trim().toLowerCase();
    const mediaKey = (item.videoUrl || item.instagramUrl || item.mediaUrl || '').trim();

    if (seenIds.has(idKey) || seenTitles.has(titleKey) || (mediaKey && seenMedia.has(mediaKey))) {
      continue;
    }

    seenIds.add(idKey);
    seenTitles.add(titleKey);
    if (mediaKey) seenMedia.add(mediaKey);
    merged.push(item);
  }

  return merged;
}

// Fetch all items (Supabase + PaidFlow seed videos + LocalStorage fallback)
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  cleanLegacyStorage();

  const paidflowSeedItems = initialProjects.filter(
    p => p.company === 'Paidflow' || p.company === 'Other'
  );

  let localStoredItems: PortfolioItem[] = [];
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          localStoredItems = parsed.filter(
            (item: PortfolioItem) =>
              !item.mediaUrl?.includes('unsplash') &&
              !item.thumbnailUrl?.includes('unsplash') &&
              !item.title?.includes('Fitment Blueprint')
          );
        }
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('portfolio_works')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch notice, falling back to local cache:', error.message);
      } else if (data && data.length > 0) {
        // Filter out any legacy demo rows that contain unsplash demo car images or generic sample videos
        const sanitized: PortfolioItem[] = data
          .filter((row: any) => {
            const hasUnsplashInMedia = typeof row.media_url === 'string' && row.media_url.includes('unsplash');
            const isDemoMock =
              row.title?.includes('Fitment Blueprint') ||
              row.title?.includes('Powder Coat') ||
              row.title?.includes('Strategic Architecture');
            return !hasUnsplashInMedia && !isDemoMock;
          })
          .map((row: any) => {
            const rawTags: string[] = Array.isArray(row.tags)
              ? row.tags
              : row.tags
              ? JSON.parse(row.tags)
              : [];

            // If row has an instagram_url/reel_id and its video_url was an old generic demo video, prefer the official reel
            const isGenericSeedVideo =
              typeof row.video_url === 'string' &&
              (row.video_url.includes('tdot_urban_speed.mp4') ||
                row.video_url.includes('tdot_kingsong_n12.mp4') ||
                row.video_url.includes('hex_brand_documentary.mp4'));

            const effectiveVideoUrl = isGenericSeedVideo ? undefined : (row.video_url || undefined);
            const effectiveMediaUrl =
              isGenericSeedVideo && row.instagram_url
                ? row.instagram_url
                : typeof row.media_url === 'string' && row.media_url.includes('unsplash')
                ? effectiveVideoUrl || row.instagram_url || ''
                : row.media_url;

            const { company, tags } = resolveCompanyAndTags(
              row.company,
              rawTags,
              effectiveMediaUrl,
              effectiveVideoUrl
            );

            return {
              id: String(row.id),
              title: row.title,
              company,
              mediaType: row.media_type,
              mediaUrl: effectiveMediaUrl,
              thumbnailUrl:
                typeof row.thumbnail_url === 'string' &&
                !row.thumbnail_url.includes('unsplash') &&
                !row.thumbnail_url.endsWith('.mp4') &&
                !row.thumbnail_url.endsWith('.mov') &&
                !row.thumbnail_url.endsWith('.webm')
                  ? row.thumbnail_url
                  : undefined,
              videoUrl:
                effectiveVideoUrl ||
                (row.media_type === 'video' &&
                typeof effectiveMediaUrl === 'string' &&
                (effectiveMediaUrl.endsWith('.mp4') ||
                  effectiveMediaUrl.endsWith('.mov') ||
                  effectiveMediaUrl.endsWith('.webm'))
                  ? effectiveMediaUrl
                  : undefined),
              description: row.description || '',
              strategyHighlights: Array.isArray(row.strategy_highlights)
                ? row.strategy_highlights
                : row.strategy_highlights
                ? JSON.parse(row.strategy_highlights)
                : [],
              metrics:
                typeof row.metrics === 'object' && row.metrics !== null
                  ? row.metrics
                  : row.metrics
                  ? JSON.parse(row.metrics)
                  : {},
              tags,
              clientObjective: row.client_objective || undefined,
              deliverables: Array.isArray(row.deliverables)
                ? row.deliverables
                : row.deliverables
                ? JSON.parse(row.deliverables)
                : [],
              isMetaAd: Boolean(row.is_meta_ad),
              metaAdDetails:
                typeof row.meta_ad_details === 'object' && row.meta_ad_details !== null
                  ? row.meta_ad_details
                  : row.meta_ad_details
                  ? JSON.parse(row.meta_ad_details)
                  : undefined,
              instagramUrl: row.instagram_url || undefined,
              reelId: row.reel_id || undefined,
              createdAt: row.created_at || new Date().toISOString(),
              featured: Boolean(row.featured),
            };
          });

        if (sanitized.length > 0) {
          // Ensure Paidflow videos and any locally saved works are always merged
          const withLocal = mergeUniquePortfolioItems(sanitized, localStoredItems);
          const completeList = mergeUniquePortfolioItems(withLocal, paidflowSeedItems);
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(completeList));
            } catch (_) {}
          }
          return completeList;
        }
      }
    } catch (err) {
      console.warn('Supabase query error:', err);
    }
  }

  // Client-side fallback to LocalStorage
  if (localStoredItems.length > 0) {
    const merged = mergeUniquePortfolioItems(localStoredItems, paidflowSeedItems);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch (_) {}
    }
    return merged;
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProjects));
    } catch (_) {}
  }

  return initialProjects;
}

// Save a new portfolio work
export async function savePortfolioItem(
  item: PortfolioItem
): Promise<{ success: boolean; data?: PortfolioItem; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const basePayload = {
        title: item.title,
        company: item.company,
        media_type: item.mediaType,
        media_url: item.mediaUrl,
        thumbnail_url:
          item.thumbnailUrl &&
          !item.thumbnailUrl.endsWith('.mp4') &&
          !item.thumbnailUrl.endsWith('.mov') &&
          !item.thumbnailUrl.endsWith('.webm')
            ? item.thumbnailUrl
            : null,
        video_url: item.videoUrl || (item.mediaType === 'video' ? item.mediaUrl : null),
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
      };

      let { data, error } = await supabase
        .from('portfolio_works')
        .insert([basePayload])
        .select()
        .single();

      // If live DB still has legacy CHECK (company IN ('Hexavia', 'Tdotwheels')) constraint before SQL migration is run,
      // store company in tags metadata and use 'Hexavia' as DB column value so insert still succeeds in Supabase
      if (error && (error.code === '23514' || error.message?.includes('portfolio_works_company_check'))) {
        const compatTags = [
          ...item.tags.filter(t => !t.startsWith('__company:')),
          `__company:${item.company}`,
        ];
        const fallbackPayload = {
          ...basePayload,
          company: 'Hexavia',
          tags: compatTags,
        };
        const retry = await supabase
          .from('portfolio_works')
          .insert([fallbackPayload])
          .select()
          .single();

        data = retry.data;
        error = retry.error;
      }

      if (!error && data) {
        item.id = String(data.id);
      } else if (error) {
        console.warn('Supabase insert warning:', error.message);
      }
    } catch (err: any) {
      console.warn('Supabase insert failed:', err.message);
    }
  }

  // Always update local storage so user sees instant optimistic update
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const items: PortfolioItem[] = stored ? JSON.parse(stored) : [...initialProjects];
      const updated = [item, ...items.filter(p => p.id !== item.id)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }

  return { success: true, data: item };
}

// Helper to check if a File is a video even when browser leaves file.type empty
export function isVideoFile(file: File): boolean {
  if (file.type && file.type.startsWith('video/')) return true;
  const ext = file.name.split('.').pop()?.toLowerCase();
  return ['mp4', 'mov', 'webm', 'm4v', 'mkv', 'avi'].includes(ext || '');
}

// Upload media file (Image or Video) with direct signed Supabase upload + server/local fallback for >50MB videos
export async function uploadMediaToSupabase(
  file: File
): Promise<{ url?: string; error?: string; storage?: string }> {
  const SUPABASE_CLOUD_LIMIT = 49 * 1024 * 1024; // 49MB threshold for Supabase Free Tier

  // 1. Try direct browser-to-Supabase upload via signed URL first (for files <= 49MB)
  // This completely bypasses Next.js/Vercel serverless request body limits (4.5MB)
  if (supabase && file.size <= SUPABASE_CLOUD_LIMIT) {
    try {
      const signRes = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(
          file.type || 'video/mp4'
        )}`
      );
      if (signRes.ok) {
        const signData = await signRes.json();
        if (signData.success && signData.path && signData.token) {
          const { error: directErr } = await supabase.storage
            .from('portfolio-media')
            .uploadToSignedUrl(signData.path, signData.token, file, {
              contentType: file.type || (isVideoFile(file) ? 'video/mp4' : 'application/octet-stream'),
              upsert: true,
            });

          if (!directErr && signData.publicUrl) {
            return { url: signData.publicUrl, storage: 'supabase-direct' };
          } else if (directErr) {
            console.warn('Direct signed upload failed, falling back to POST /api/upload:', directErr.message);
          }
        }
      }
    } catch (directException: any) {
      console.warn('Signed upload preflight warning, falling back to POST /api/upload:', directException.message);
    }
  }

  // 2. Fallback to POST /api/upload (handles server upload to Supabase OR local public/uploads/ for >50MB files)
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      if (res.status === 413) {
        return {
          error: 'File is too large for the server proxy (HTTP 413). Please use a video under 50MB or a direct link.',
        };
      }
      return { error: `Upload failed (HTTP ${res.status}): ${text.slice(0, 120)}` };
    }

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { error: result.error || 'Failed to upload media' };
    }

    return { url: result.url, storage: result.storage };
  } catch (err: any) {
    return { error: err.message || 'Media upload network error' };
  }
}

// Reset to seed data
export function resetToSeedData(): PortfolioItem[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProjects));
  }
  return initialProjects;
}

// Delete portfolio item (Supabase and LocalStorage)
export async function deletePortfolioItem(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('portfolio_works').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items: PortfolioItem[] = JSON.parse(stored);
        const filtered = items.filter(item => String(item.id) !== String(id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      }
    } catch (e) {
      console.error('LocalStorage delete error:', e);
    }
  }

  return true;
}
