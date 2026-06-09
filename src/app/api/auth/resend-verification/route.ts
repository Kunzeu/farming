import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/postgres-db';
import { canResendVerification, createVerificationToken } from '@/lib/server/email-verification';
import { sendVerificationEmail } from '@/lib/server/email';
import { EMAIL_SEND_FAILED, parseEmailLocale } from '@/lib/server/email-i18n';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    const userResult = await pool.query(
      `SELECT id, email, username, email_verified as "emailVerified"
       FROM users
       WHERE LOWER(email) = $1`,
      [email]
    );

    // Respuesta genérica para no revelar si el email existe
    const genericSuccess = {
      message: 'Si el correo existe y no está verificado, enviamos un nuevo enlace.',
    };

    if (userResult.rows.length === 0) {
      return NextResponse.json(genericSuccess);
    }

    const user = userResult.rows[0];

    if (user.emailVerified) {
      return NextResponse.json(genericSuccess);
    }

    const canResend = await canResendVerification(user.id);
    if (!canResend) {
      return NextResponse.json(
        { error: 'Espera unos minutos antes de solicitar otro email', code: 'RATE_LIMITED' },
        { status: 429 }
      );
    }

    const locale = parseEmailLocale(request, body.locale);
    const token = await createVerificationToken(user.id);
    await sendVerificationEmail(user.email, user.username, token, locale);

    return NextResponse.json(genericSuccess);
  } catch (error) {
    console.error('Resend verification error:', error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    const errorCode = error instanceof Error
      ? (error as Error & { code?: string }).code
      : undefined;

    return NextResponse.json({
      error: errorCode === EMAIL_SEND_FAILED ? message : 'Error interno del servidor',
    }, { status: 500 });
  }
}
