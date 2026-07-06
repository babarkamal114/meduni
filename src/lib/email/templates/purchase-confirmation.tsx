import { Section, Text, Link, Hr } from '@react-email/components';
import { EmailLayout } from './components/email-layout';
import { siteConfig } from '@/config/site';

interface PurchaseConfirmationEmailProps {
  buyerName: string;
  webinarTitle: string;
  webinarExpert: string;
  webinarDate: string;
  amount: string;
  receiptId: string;
  webinarUrl: string;
}

export function PurchaseConfirmationEmail({
  buyerName,
  webinarTitle,
  webinarExpert,
  webinarDate,
  amount,
  receiptId,
  webinarUrl,
}: PurchaseConfirmationEmailProps): React.ReactElement {
  const dashboardUrl = `${siteConfig.url}${webinarUrl}`;

  return (
    <EmailLayout previewText={`Your ticket for ${webinarTitle} is confirmed`}>
      <Text style={greeting}>Hi {buyerName},</Text>
      <Text style={paragraph}>
        Your ticket has been confirmed. Here are your booking details:
      </Text>

      <Section style={invoiceBox}>
        <Text style={invoiceHeader}>Booking Confirmation</Text>
        <Hr style={invoiceDivider} />
        <table style={invoiceTable} cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td style={labelCell}>Receipt</td>
              <td style={valueCell}>{receiptId}</td>
            </tr>
            <tr>
              <td style={labelCell}>Webinar</td>
              <td style={valueCell}>{webinarTitle}</td>
            </tr>
            <tr>
              <td style={labelCell}>Expert</td>
              <td style={valueCell}>{webinarExpert}</td>
            </tr>
            <tr>
              <td style={labelCell}>Date</td>
              <td style={valueCell}>{webinarDate}</td>
            </tr>
            <Hr style={invoiceDivider} />
            <tr>
              <td style={labelCell}>Amount Paid</td>
              <td style={{ ...valueCell, fontWeight: 600, color: '#0d9488' }}>
                {amount}
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section style={ctaSection}>
        <Link href={dashboardUrl} style={ctaButton}>
          View in Dashboard
        </Link>
      </Section>

      <Text style={smallText}>
        Your webinar access is now available in your dashboard. If you have any
        questions, contact us at{' '}
        <Link href={`mailto:${siteConfig.contactEmail}`} style={tealLink}>
          {siteConfig.contactEmail}
        </Link>
        .
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
  margin: '0 0 24px',
  fontSize: '15px',
  lineHeight: '1.6',
};

const invoiceBox: React.CSSProperties = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
  border: '1px solid #e2e8f0',
};

const invoiceHeader: React.CSSProperties = {
  margin: '0 0 12px',
  fontSize: '14px',
  fontWeight: 600,
  color: '#0f172a',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const invoiceDivider: React.CSSProperties = {
  borderColor: '#e2e8f0',
  margin: '12px 0',
};

const invoiceTable: React.CSSProperties = {
  width: '100%',
};

const labelCell: React.CSSProperties = {
  padding: '6px 0',
  fontSize: '13px',
  color: '#64748b',
  width: '120px',
  verticalAlign: 'top',
};

const valueCell: React.CSSProperties = {
  padding: '6px 0',
  fontSize: '14px',
  color: '#0f172a',
  textAlign: 'right' as const,
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
  textDecoration: 'none',
};
