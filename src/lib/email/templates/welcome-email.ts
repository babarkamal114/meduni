import { siteConfig } from '@/config/site';

export interface WelcomeEmailParams {
  fullName: string | null;
  email: string;
}

export function getWelcomeEmailHtml({ fullName, email }: WelcomeEmailParams): string {
  const name = fullName?.trim() || email.split('@')[0] || 'there';
  const appUrl = siteConfig.url;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${siteConfig.name}</title>
</head>
<body style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #334155; background-color: #f8fafc;">
  <div style="max-width: 560px; margin: 0 auto; padding: 32px 24px;">
    <div style="background: white; border-radius: 12px; padding: 40px 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: #0f172a;">
        Welcome to ${siteConfig.name}
      </h1>
      <p style="margin: 0 0 24px; font-size: 16px; color: #64748b;">
        Hi ${name},
      </p>
      <p style="margin: 0 0 16px; font-size: 15px;">
        Thanks for signing up. You're one step away from getting started.
      </p>
      <p style="margin: 0 0 24px; font-size: 15px;">
        We've sent you a separate email with a link to verify your address. Click that link to confirm your account and then you can sign in to your dashboard, explore expert-led clinical webinars, and track your progress.
      </p>
      <p style="margin: 0; font-size: 15px;">
        If you have any questions, reply to this email or visit <a href="${appUrl}/contact" style="color: #0d9488; text-decoration: none;">our contact page</a>.
      </p>
      <p style="margin: 24px 0 0; font-size: 14px; color: #94a3b8;">
        — The ${siteConfig.name} team
      </p>
    </div>
    <p style="margin: 24px 0 0; font-size: 12px; color: #94a3b8; text-align: center;">
      ${siteConfig.name} · ${siteConfig.description}
    </p>
  </div>
</body>
</html>
  `.trim();
}
