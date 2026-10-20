import { createClient } from '@supabase/supabase-js';
import { PortfolioItem } from '@/types/portfolio';
import { initialProjects } from '@/data/initialProjects';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const STORAGE_KEY = 'danmed_social_portfolio_items_v5';

// Helper to clean legacy storage keys containing demo car images or generic videos
function cleanLegacyStorage() {
  if (typeof window === 'undefined') return;
  const legacyKeys = [
    'danmed_social_portfolio_items',
    'danmed_social_portfolio_items_v1',
    'danmed_social_portfolio_items_v2',
    'danmed_social_portfolio_items_v3',
    'danmed_social_portfolio_items_v4'
  ];
  legacyKeys.forEach(k => {
    try { localStorage.removeItem(k); } catch (_) {}
  });
}

// Fetch all items (Supabase with LocalStorage fallback)
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  cleanLegacyStorage();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('portfolio_works')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch notice, falling back to local cache:', error.message);
      } else if (data && data.length > 0) {
        // Filter out any legacy demo rows that contain unsplash demo car images
        const sanitized = data
          .filter((row: any) => {
            const hasUnsplashInMedia = typeof row.media_url === 'string' && row.media_url.includes('unsplash');
            const isDemoMock = row.title?.includes('Fitment Blueprint') || row.title?.includes('Powder Coat') || row.title?.includes('Strategic Architecture');
            return !hasUnsplashInMedia && !isDemoMock;
          })
          .map((row: any) => ({
            id: String(row.id),
            title: row.title,
            company: row.company,
            mediaType: row.media_type,
            mediaUrl: (typeof row.media_url === 'string' && row.media_url.includes('unsplash'))
              ? (row.video_url || row.instagram_url || '')
              : row.media_url,
            thumbnailUrl: (typeof row.thumbnail_url === 'string' && !row.thumbnail_url.includes('unsplash'))
              ? row.thumbnail_url
              : undefined,
            videoUrl: row.video_url || undefined,
            description: row.description,
            strategyHighlights: Array.isArray(row.strategy_highlights)
              ? row.strategy_highlights
              : (row.strategy_highlights ? JSON.parse(row.strategy_highlights) : []),
            metrics: typeof row.metrics === 'object' && row.metrics !== null
              ? row.metrics
              : (row.metrics ? JSON.parse(row.metrics) : {}),
            tags: Array.isArray(row.tags)
              ? row.tags
              : (row.tags ? JSON.parse(row.tags) : []),
            clientObjective: row.client_objective || undefined,
            deliverables: Array.isArray(row.deliverables)
              ? row.deliverables
              : (row.deliverables ? JSON.parse(row.deliverables) : []),
            isMetaAd: Boolean(row.is_meta_ad),
            metaAdDetails: typeof row.meta_ad_details === 'object' && row.meta_ad_details !== null
              ? row.meta_ad_details
              : (row.meta_ad_details ? JSON.parse(row.meta_ad_details) : undefined),
            instagramUrl: row.instagram_url || undefined,
            reelId: row.reel_id || undefined,
            createdAt: row.created_at || new Date().toISOString(),
            featured: Boolean(row.featured),
          }));

        if (sanitized.length > 0) {
          return sanitized;
        }
      }
    } catch (err) {
      console.warn('Supabase query error:', err);
    }
  }

  // Client-side fallback to LocalStorage
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure no stored item contains unsplash car images
          const cleanStored = parsed.filter((item: PortfolioItem) => 
            !item.mediaUrl?.includes('unsplash') && 
            !item.thumbnailUrl?.includes('unsplash') &&
            !item.title?.includes('Fitment Blueprint')
          );
          if (cleanStored.length > 0) {
            return cleanStored;
          }
        }
      }
      // Initialize with default rich case studies (strictly user reel links)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProjects));
    } catch (e) {
      console.error('LocalStorage read error:', e);
    }
  }

  return initialProjects;
}

// Save a new portfolio work
export async function savePortfolioItem(item: PortfolioItem): Promise<{ success: boolean; data?: PortfolioItem; error?: string }> {
  let supabaseSuccess = false;

  if (isSupabaseConfigured && supabase) {
    try {
      const dbPayload = {
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
      };

      const { data, error } = await supabase
        .from('portfolio_works')
        .insert([dbPayload])
        .select()
        .single();

      if (!error && data) {
        supabaseSuccess = true;
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

// Upload media file (Image or Video) to Supabase Storage bucket 'portfolio-media'
export async function uploadMediaToSupabase(file: File): Promise<{ url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { error: result.error || 'Failed to upload media to Supabase' };
    }

    return { url: result.url };
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
