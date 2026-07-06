import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Preview,
} from '@react-email/components';
import { siteConfig } from '@/config/site';

interface EmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
  unsubscribeUrl?: string;
}

export function EmailLayout({
  previewText,
  children,
  unsubscribeUrl,
}: EmailLayoutProps): React.ReactElement {
  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logoText}>{siteConfig.name}</Text>
          </Section>

          <Section style={content}>{children}</Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              {siteConfig.name} &middot; Expert-led clinical medicine education
            </Text>
            {unsubscribeUrl && (
              <Text style={footerText}>
                <Link href={unsubscribeUrl} style={unsubscribeLink}>
                  Unsubscribe from marketing emails
                </Link>
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  margin: 0,
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  lineHeight: '1.6',
  color: '#334155',
  backgroundColor: '#f8fafc',
};

const container: React.CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '32px 24px',
};

const header: React.CSSProperties = {
  backgroundColor: '#0d9488',
  borderRadius: '12px 12px 0 0',
  padding: '24px 32px',
  textAlign: 'center' as const,
};

const logoText: React.CSSProperties = {
  margin: 0,
  fontSize: '22px',
  fontWeight: 700,
  color: '#ffffff',
  letterSpacing: '0.5px',
};

const content: React.CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '32px',
};

const divider: React.CSSProperties = {
  borderColor: '#e2e8f0',
  margin: 0,
};

const footer: React.CSSProperties = {
  padding: '20px 32px',
  textAlign: 'center' as const,
};

const footerText: React.CSSProperties = {
  margin: '4px 0',
  fontSize: '12px',
  color: '#94a3b8',
};

const unsubscribeLink: React.CSSProperties = {
  color: '#94a3b8',
  textDecoration: 'underline',
};
