import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/server/password-utils';
import { pool } from '@/lib/postgres-db';
import { createVerificationToken } from '@/lib/server/email-verification';
import { sendVerificationEmail } from '@/lib/server/email';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password, confirmPassword } = body;

    if (!email || !username || !password || !confirmPassword) {
      return NextResponse.json({
        error: 'Todos los campos son requeridos',
      }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({
        error: 'Las contraseñas no coinciden',
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({
        error: 'La contraseña debe tener al menos 6 caracteres',
      }, { status: 400 });
    }

    if (password.length > 50) {
      return NextResponse.json({
        error: 'La contraseña no puede tener más de 50 caracteres',
      }, { status: 400 });
    }

    const countQuery = 'SELECT COUNT(*) as count FROM users';
    const countResult = await pool.query(countQuery);
    const isFirstUser = parseInt(countResult.rows[0].count) === 0;

    const checkQuery = `
      SELECT email, username FROM users
      WHERE email = $1 OR username = $2
    `;

    const checkResult = await pool.query(checkQuery, [email, username]);

    if (checkResult.rows.length > 0) {
      const existingUser = checkResult.rows[0];
      let errorMessage = '';
      let field = '';

      if (existingUser.email === email) {
        errorMessage = 'El email ya está registrado';
        field = 'email';
      } else if (existingUser.username === username) {
        errorMessage = 'El username ya está en uso';
        field = 'username';
      }

      return NextResponse.json({
        error: errorMessage,
        field,
      }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const id = crypto.randomUUID();
    const role = isFirstUser ? 'admin' : 'user';

    const insertQuery = `
      INSERT INTO users (id, email, username, password, role, is_active, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, username, role, is_active as "isActive",
                email_verified as "emailVerified",
                created_at as "createdAt", updated_at as "updatedAt"
    `;

    const values = [id, email, username, hashedPassword, role, true, false];
    const result = await pool.query(insertQuery, values);
    const user = result.rows[0];

    const token = await createVerificationToken(user.id);
    await sendVerificationEmail(user.email, user.username, token);

    return NextResponse.json({
      requiresEmailVerification: true,
      email: user.email,
      message: 'Revisa tu correo para confirmar tu cuenta',
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    if (message.includes('RESEND_API_KEY')) {
      return NextResponse.json({
        error: 'El servicio de email no está configurado',
      }, { status: 503 });
    }
    return NextResponse.json({
      error: message === 'No se pudo enviar el email de verificación'
        ? message
        : 'Error interno del servidor',
    }, { status: 500 });
  }
}
