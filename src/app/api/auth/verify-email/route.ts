import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailToken } from '@/lib/server/email-verification';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body?.token;

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
    }

    const result = await verifyEmailToken(token);

    if (!result) {
      return NextResponse.json(
        { error: 'Enlace inválido o expirado', code: 'INVALID_TOKEN' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Email verificado correctamente',
      email: result.email,
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
