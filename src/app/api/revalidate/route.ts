import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const tag = searchParams.get('tag');

    console.log('Revalidation request:', { path, tag });

    if (path) {
      // Revalidar una ruta específica
      revalidatePath(path);
      console.log(`Revalidated path: ${path}`);
    } else {
      // Revalidar las rutas principales de farmeos
      revalidatePath('/farming-routes');
      revalidatePath('/admin');
      revalidatePath('/moderator');
      console.log('Revalidated main farming paths');
    }

    // También revalidar por tags si se especifica
    if (tag) {
      revalidateTag(tag);
      console.log(`Revalidated tag: ${tag}`);
    }

    // Revalidar tags comunes de farmeos
    revalidateTag('farms');
    revalidateTag('farming-routes');

    const response = NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      path: path || 'farming-routes',
      tag: tag || 'farms'
    });

    // Agregar headers para evitar caché en la respuesta
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json({ 
      error: 'Error revalidating', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
