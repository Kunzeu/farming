import { Resend } from 'resend';
import { buildVerificationUrl } from '@/lib/server/email-verification';
import {
  type EmailLocale,
  createEmailSendError,
  getVerificationEmailContent,
} from '@/lib/server/email-i18n';

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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendVerificationEmail(
  to: string,
  username: string,
  token: string,
  locale: EmailLocale = 'en'
): Promise<void> {
  const verifyUrl = buildVerificationUrl(token);
  const resend = getResendClient();
  const { subject, html } = getVerificationEmailContent(
    locale,
    username,
    verifyUrl,
    escapeHtml
  );

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to,
    subject,
    html,
  });

  if (error) {
    console.error('Resend verification email error:', error);
    throw createEmailSendError(locale);
  }
}
