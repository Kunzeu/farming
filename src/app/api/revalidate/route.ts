import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

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

    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      path: path || 'farming-routes'
    });
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json({ 
      error: 'Error revalidating', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
