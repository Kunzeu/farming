import { Resend } from 'resend';
import { buildVerificationUrl } from '@/lib/server/email-verification';

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(apiKey);
}

function getFromAddress(): string {
  return process.env.EMAIL_FROM || 'True Farming <onboarding@resend.dev>';
}

export async function sendVerificationEmail(
  to: string,
  username: string,
  token: string
): Promise<void> {
  const verifyUrl = buildVerificationUrl(token);
  const resend = getResendClient();

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to,
    subject: 'Confirma tu cuenta en True Farming',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 560px; margin: 0 auto;">
        <h1 style="color: #2563eb;">True Farming</h1>
        <p>Hola <strong>${escapeHtml(username)}</strong>,</p>
        <p>Gracias por registrarte. Confirma tu correo para activar tu cuenta:</p>
        <p style="margin: 32px 0;">
          <a href="${verifyUrl}" style="background: #2563eb; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none; display: inline-block;">
            Confirmar mi cuenta
          </a>
        </p>
        <p style="font-size: 14px; color: #6b7280;">
          Si el botón no funciona, copia y pega este enlace en tu navegador:<br />
          <a href="${verifyUrl}">${verifyUrl}</a>
        </p>
        <p style="font-size: 14px; color: #6b7280;">Este enlace expira en 24 horas.</p>
      </div>
    `,
  });

  if (error) {
    console.error('Resend verification email error:', error);
    throw new Error('No se pudo enviar el email de verificación');
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
