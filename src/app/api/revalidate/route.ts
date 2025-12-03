import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export const runtime = 'edge';;

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const tag = searchParams.get('tag');
    const force = searchParams.get('force') === 'true';

    console.log('Revalidation request:', { path, tag, force });

    // Revalidar paths específicos
    const pathsToRevalidate = path ? [path] : ['/farming-routes', '/admin', '/moderator'];

    for (const pathToRevalidate of pathsToRevalidate) {
      try {
        revalidatePath(pathToRevalidate, 'page');
        revalidatePath(pathToRevalidate, 'layout');
        console.log(`Revalidated path: ${pathToRevalidate}`);
      } catch (pathError) {
        console.warn(`Failed to revalidate path ${pathToRevalidate}:`, pathError);
      }
    }

    // Revalidar tags
    const tagsToRevalidate = tag ? [tag] : ['farms', 'farming-routes', 'admin-farms'];

    for (const tagToRevalidate of tagsToRevalidate) {
      try {
        // @ts-expect-error - Next.js 15 type mismatch
        revalidateTag(tagToRevalidate);
        console.log(`Revalidated tag: ${tagToRevalidate}`);
      } catch (tagError) {
        console.warn(`Failed to revalidate tag ${tagToRevalidate}:`, tagError);
      }
    }

    // Si es forzado, también revalidar todo
    if (force) {
      try {
        revalidatePath('/', 'layout');
        // @ts-expect-error - Next.js 15 type mismatch
        revalidateTag('all');
        console.log('Force revalidated all paths and tags');
      } catch (forceError) {
        console.warn('Failed to force revalidate:', forceError);
      }
    }

    const response = NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path: path || 'farming-routes',
      tag: tag || 'farms',
      force,
      pathsRevalidated: pathsToRevalidate,
      tagsRevalidated: tagsToRevalidate
    });

    // Headers más agresivos para producción
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    response.headers.set('CDN-Cache-Control', 'no-cache');
    response.headers.set('Cloudflare-CDN-Cache-Control', 'no-cache');

    return response;
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json({
      error: 'Error revalidating',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
