import { getMarketingOptedInUsers } from '@/lib/data/email-preferences';
import { getUnsubscribeUrl } from '@/lib/email/unsubscribe';
import { renderEmail } from '@/lib/email/render';
import { sendBatchEmails } from '@/lib/email/resend';
import { MarketingNotificationEmail } from '@/lib/email/templates/marketing-notification';
import type { BatchEmailItem } from '@/lib/email/resend';

type ContentType = 'webinar' | 'module' | 'lesson' | 'content' | 'case study';

interface SendMarketingEmailOptions {
  contentType: ContentType;
  contentTitle: string;
  contentDescription?: string;
  ctaUrl: string;
  ctaLabel: string;
}

const BATCH_SIZE = 100;

export async function sendMarketingEmailToAll(opts: SendMarketingEmailOptions): Promise<void> {
  try {
    const recipients = await getMarketingOptedInUsers();
    if (recipients.length === 0) return;

    const emails: BatchEmailItem[] = [];

    for (const recipient of recipients) {
      const name = recipient.fullName?.trim() || recipient.email.split('@')[0] || 'there';
      const unsubscribeUrl = getUnsubscribeUrl(recipient.userId);

      const html = await renderEmail(
        MarketingNotificationEmail({
          recipientName: name,
          contentType: opts.contentType,
          contentTitle: opts.contentTitle,
          contentDescription: opts.contentDescription,
          ctaUrl: opts.ctaUrl,
          ctaLabel: opts.ctaLabel,
          unsubscribeUrl,
        }),
      );

      emails.push({
        to: recipient.email,
        subject: `New on MedUni: ${opts.contentTitle}`,
        html,
      });
    }

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      const { success, error } = await sendBatchEmails(batch);
      if (!success) {
        console.error(`[marketing-email] Batch ${i / BATCH_SIZE + 1} failed:`, error?.message);
      }
    }
  } catch (err) {
    console.error('[marketing-email] Failed to send marketing emails:', err);
  }
}
