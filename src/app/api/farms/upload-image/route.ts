import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';
import { authorizeRequest } from '@/lib/server/jwt-utils';

export const runtime = 'nodejs';

const MAX_BYTES = 3 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export async function POST(request: NextRequest) {
  try {
    const authResult = authorizeRequest(request, 'moderator');
    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized', details: authResult.error },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const farmId = String(formData.get('farmId') || '').trim();
    const farmName = String(formData.get('farmName') || '').trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Use JPG, PNG, WebP or GIF.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large. Max 3 MB.' }, { status: 400 });
    }

    const ext = EXT_BY_MIME[file.type] || path.extname(file.name).toLowerCase() || '.webp';
    const baseName = slugify(farmName) || slugify(farmId) || 'route';
    const suffix = randomBytes(4).toString('hex');
    const filename = `${baseName}-${suffix}${ext}`;

    const routesDir = path.join(process.cwd(), 'public', 'images', 'routes');
    await fs.mkdir(routesDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(routesDir, filename);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/images/routes/${filename}`;

    return NextResponse.json({ url: publicUrl, filename });
  } catch (error) {
    console.error('Route image upload failed:', error);
    return NextResponse.json(
      {
        error: 'Upload failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
