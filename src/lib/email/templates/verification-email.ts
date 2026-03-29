import { siteConfig } from '@/config/site';

export interface VerificationEmailParams {
  verifyUrl: string;
  fullName: string | null;
}

export function getVerificationEmailHtml({ verifyUrl, fullName }: VerificationEmailParams): string {
  const name = fullName?.trim() || 'there';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email – ${siteConfig.name}</title>
</head>
<body style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #334155; background-color: #f8fafc;">
  <div style="max-width: 560px; margin: 0 auto; padding: 32px 24px;">
    <div style="background: white; border-radius: 12px; padding: 40px 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: #0f172a;">
        Verify your email
      </h1>
      <p style="margin: 0 0 24px; font-size: 16px; color: #64748b;">
        Hi ${name},
      </p>
      <p style="margin: 0 0 24px; font-size: 15px;">
        Please confirm your email address by clicking the button below. This helps us keep your account secure.
      </p>
      <p style="margin: 0 0 32px; text-align: center;">
        <a href="${verifyUrl}" style="display: inline-block; padding: 14px 28px; background-color: #0d9488; color: white; font-size: 16px; font-weight: 500; text-decoration: none; border-radius: 8px;">
          Verify email address
        </a>
      </p>
      <p style="margin: 0; font-size: 14px; color: #64748b;">
        If you didn't create an account with ${siteConfig.name}, you can safely ignore this email.
      </p>
      <p style="margin: 16px 0 0; font-size: 13px; color: #94a3b8;">
        This link expires in 24 hours. If it has expired, sign in and request a new verification email.
      </p>
    </div>
    <p style="margin: 24px 0 0; font-size: 12px; color: #94a3b8; text-align: center;">
      ${siteConfig.name}
    </p>
  </div>
</body>
</html>
  `.trim();
}
