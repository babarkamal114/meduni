import { Section, Text, Link } from '@react-email/components';
import { EmailLayout } from './components/email-layout';
import { siteConfig } from '@/config/site';

type ContentType = 'webinar' | 'module' | 'lesson' | 'content' | 'case study';

interface MarketingNotificationEmailProps {
  recipientName: string;
  contentType: ContentType;
  contentTitle: string;
  contentDescription?: string;
  ctaUrl: string;
  ctaLabel: string;
  unsubscribeUrl: string;
}

const COPY_MAP: Record<ContentType, string> = {
  webinar: 'A new webinar has been added',
  module: 'A new learning module is available',
  lesson: 'A new lesson has been published',
  content: 'New learning content is available',
  'case study': 'A new case study has been published',
};

export function MarketingNotificationEmail({
  recipientName,
  contentType,
  contentTitle,
  contentDescription,
  ctaUrl,
  ctaLabel,
  unsubscribeUrl,
}: MarketingNotificationEmailProps): React.ReactElement {
  const fullCtaUrl = ctaUrl.startsWith('http') ? ctaUrl : `${siteConfig.url}${ctaUrl}`;

  return (
    <EmailLayout
      previewText={`${COPY_MAP[contentType]}: ${contentTitle}`}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={greeting}>Hi {recipientName},</Text>
      <Text style={paragraph}>{COPY_MAP[contentType]}:</Text>
      <Section style={contentBox}>
        <Text style={contentTitle_style}>{contentTitle}</Text>
        {contentDescription && (
          <Text style={descriptionStyle}>{contentDescription}</Text>
        )}
      </Section>
      <Section style={ctaSection}>
        <Link href={fullCtaUrl} style={ctaButton}>
          {ctaLabel}
        </Link>
      </Section>
      <Text style={smallText}>
        You are receiving this because you opted in to marketing emails from{' '}
        {siteConfig.name}. You can{' '}
        <Link href={unsubscribeUrl} style={tealLink}>
          unsubscribe
        </Link>{' '}
        at any time.
      </Text>
    </EmailLayout>
  );
}

const greeting: React.CSSProperties = {
  margin: '0 0 16px',
  fontSize: '16px',
  color: '#64748b',
};

const paragraph: React.CSSProperties = {
  margin: '0 0 16px',
  fontSize: '15px',
  lineHeight: '1.6',
};

const contentBox: React.CSSProperties = {
  backgroundColor: '#f0fdfa',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
  borderLeft: '4px solid #0d9488',
};

const contentTitle_style: React.CSSProperties = {
  margin: '0 0 8px',
  fontSize: '18px',
  fontWeight: 600,
  color: '#0f172a',
};

const descriptionStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '14px',
  color: '#64748b',
  lineHeight: '1.5',
};

const ctaSection: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const ctaButton: React.CSSProperties = {
  display: 'inline-block',
  padding: '14px 28px',
  backgroundColor: '#0d9488',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 500,
  textDecoration: 'none',
  borderRadius: '8px',
};

const smallText: React.CSSProperties = {
  margin: '16px 0 0',
  fontSize: '13px',
  color: '#94a3b8',
  lineHeight: '1.6',
};

const tealLink: React.CSSProperties = {
  color: '#0d9488',
  textDecoration: 'underline',
};
