import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

function getUploadSupabaseConfig() {
  const defaultUrl = 'https://gpjghzmaykgpwsxfwjbz.supabase.co';
  const defaultKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamdoem1heWtncHdzeGZ3amJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjQ4MjY1NSwiZXhwIjoyMTA4MDU4NjU1fQ.Ssdd5m7TRNYTOE4I71MLayLS0t0T_Qjp2CMwFfw6NLo';

  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || defaultUrl,
    serviceRoleKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      defaultKey,
  };
}

function inferContentType(fileName: string, providedType?: string): string {
  if (providedType && providedType !== 'application/octet-stream') {
    return providedType;
  }
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'mp4':
    case 'm4v':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    case 'webm':
      return 'video/webm';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    default:
      return providedType || 'application/octet-stream';
  }
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

// GET /api/upload?filename=video.mp4 -> Generates a signed upload URL so browser can upload directly to Supabase Storage without hitting Next.js/Vercel body size limits
export async function GET(req: NextRequest) {
  try {
    const { supabaseUrl, serviceRoleKey } = getUploadSupabaseConfig();
    const { searchParams } = new URL(req.url);
    const rawName = searchParams.get('filename') || `media_${Date.now()}.mp4`;
    const cleanFileName = sanitizeFileName(rawName);
    const filePath = `uploads/${Date.now()}_${cleanFileName}`;

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await supabase.storage
      .from('portfolio-media')
      .createSignedUploadUrl(filePath);

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: error?.message || 'Could not create signed upload URL' },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from('portfolio-media')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      signedUrl: data.signedUrl,
      token: data.token,
      path: filePath,
      publicUrl: publicUrlData.publicUrl,
    });
  } catch (err: any) {
    console.error('Signed upload URL error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to initialize upload' },
      { status: 500 }
    );
  }
}

// POST /api/upload -> Server-side upload with automatic local public/uploads fallback for large videos (>50MB) or cloud errors
export async function POST(req: NextRequest) {
  try {
    const { supabaseUrl, serviceRoleKey } = getUploadSupabaseConfig();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in form data' },
        { status: 400 }
      );
    }

    // Allow up to 300MB videos
    const MAX_SIZE_BYTES = 300 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 300MB limit' },
        { status: 400 }
      );
    }

    const cleanFileName = sanitizeFileName(file.name || `upload_${Date.now()}.mp4`);
    const uniqueFileName = `${Date.now()}_${cleanFileName}`;
    const filePath = `uploads/${uniqueFileName}`;
    const contentType = inferContentType(cleanFileName, file.type);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Try Supabase Storage first if file is within Supabase's 50MB cloud object limit
    const SUPABASE_CLOUD_LIMIT = 49 * 1024 * 1024;
    let supabaseUploadError: string | null = null;

    if (supabaseUrl && serviceRoleKey && file.size <= SUPABASE_CLOUD_LIMIT) {
      try {
        const supabase = createClient(supabaseUrl, serviceRoleKey);
        const { error: uploadError } = await supabase.storage
          .from('portfolio-media')
          .upload(filePath, buffer, {
            contentType,
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('portfolio-media')
            .getPublicUrl(filePath);

          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            path: filePath,
            storage: 'supabase',
          });
        } else {
          supabaseUploadError = uploadError.message;
          console.warn('Supabase storage upload warning, trying local public fallback:', uploadError.message);
        }
      } catch (cloudErr: any) {
        supabaseUploadError = cloudErr.message;
        console.warn('Supabase storage exception, trying local public fallback:', cloudErr.message);
      }
    }

    // 2. Fallback: Save directly into public/uploads/ so large videos (>50MB) or offline/timeout uploads succeed reliably
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadsDir, { recursive: true });
      const localFilePath = path.join(uploadsDir, uniqueFileName);
      await writeFile(localFilePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${uniqueFileName}`,
        path: `uploads/${uniqueFileName}`,
        storage: 'local',
      });
    } catch (fsErr: any) {
      console.error('Local fallback write error:', fsErr);
      return NextResponse.json(
        {
          success: false,
          error:
            supabaseUploadError ||
            (file.size > SUPABASE_CLOUD_LIMIT
              ? 'Video exceeds Supabase 50MB cloud limit and local filesystem is read-only. Please compress video under 50MB.'
              : fsErr.message || 'Failed to upload file'),
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error('Upload API route error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error during upload' },
      { status: 500 }
    );
  }
}
