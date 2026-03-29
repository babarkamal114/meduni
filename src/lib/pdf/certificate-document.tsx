import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from '@react-pdf/renderer';
import type { CertificateData } from '@/lib/data/learning';

const A4_LANDSCAPE = [841.89, 595.28] as [number, number];

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
  },
  outer: {
    flex: 1,
    borderWidth: 3,
    borderColor: '#0d9488',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    margin: 16,
    paddingHorizontal: 40,
    paddingVertical: 32,
    borderWidth: 2,
    borderColor: '#99f6e4',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  certTitle: {
    fontSize: 28,
    color: '#0f172a',
    marginBottom: 4,
    fontFamily: 'Times-Bold',
    letterSpacing: 1,
  },
  certSubtitle: {
    fontSize: 11,
    color: '#0d9488',
    marginBottom: 24,
    fontFamily: 'Times-Roman',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  awardLabel: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 12,
    fontFamily: 'Helvetica',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  userName: {
    fontSize: 22,
    color: '#0f172a',
    marginBottom: 8,
    fontFamily: 'Times-Bold',
  },
  nameUnderline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  lineEnd: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#0d9488',
    marginHorizontal: 4,
  },
  line: {
    width: 80,
    height: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#0d9488',
  },
  lineMid: {
    width: 120,
    height: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#0d9488',
  },
  body: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 8,
    fontFamily: 'Helvetica',
    textAlign: 'center',
    maxWidth: 380,
  },
  moduleHighlight: {
    fontFamily: 'Times-Bold',
    color: '#0f766e',
  },
  date: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 24,
    fontFamily: 'Helvetica',
  },
  signatureRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 48,
    marginBottom: 16,
  },
  signatureBlock: {
    alignItems: 'center',
  },
  signatureLabel: {
    fontSize: 8,
    color: '#0d9488',
    marginBottom: 4,
    fontFamily: 'Helvetica',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  signatureLine: {
    width: 100,
    height: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#5eead4',
  },
  seal: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#0d9488',
    backgroundColor: '#f0fdfa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealText: {
    fontSize: 16,
    fontFamily: 'Times-Bold',
    color: '#0d9488',
  },
  sealLabel: {
    fontSize: 8,
    color: '#0d9488',
    marginTop: 2,
    fontFamily: 'Helvetica',
  },
  footer: {
    fontSize: 8,
    color: '#94a3b8',
    fontFamily: 'Helvetica',
  },
});

interface CertificateDocumentProps {
  data: CertificateData;
  siteName: string;
  verifyUrl?: string;
}

export function CertificateDocument({ data, siteName, verifyUrl }: CertificateDocumentProps) {
  const dateFormatted = new Date(data.certifiedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const verifyText = verifyUrl ? `Verify at ${verifyUrl}` : '';
  const initial = siteName.charAt(0);

  return (
    <Document>
      <Page size={A4_LANDSCAPE} style={styles.page}>
        <View style={styles.outer}>
          <View style={styles.inner}>
            <View style={styles.content}>
              <Text style={styles.certTitle}>CERTIFICATE</Text>
              <Text style={styles.certSubtitle}>of completion</Text>

              <Text style={styles.awardLabel}>The following award is given to</Text>

              <Text style={styles.userName}>{data.userName}</Text>
              <View style={styles.nameUnderline}>
                <View style={styles.lineEnd} />
                <View style={styles.line} />
                <View style={styles.lineMid} />
                <View style={styles.line} />
                <View style={styles.lineEnd} />
              </View>

              <Text style={styles.body}>
                This certificate is presented in recognition of successful completion of the module{' '}
                <Text style={styles.moduleHighlight}>{data.moduleTitle}</Text>
                {' '}and demonstrated competence in the subject matter.
              </Text>

              <Text style={styles.date}>Completed on {dateFormatted}</Text>

              <View style={styles.signatureRow}>
                <View style={styles.signatureBlock}>
                  <Text style={styles.signatureLabel}>Authorised by</Text>
                  <View style={styles.signatureLine} />
                </View>
                <View style={styles.signatureBlock}>
                  <View style={styles.seal}>
                    <Text style={styles.sealText}>{initial}</Text>
                  </View>
                  <Text style={styles.sealLabel}>{siteName}</Text>
                </View>
                <View style={styles.signatureBlock}>
                  <Text style={styles.signatureLabel}>Date</Text>
                  <View style={styles.signatureLine} />
                </View>
              </View>

              {verifyText ? <Text style={styles.footer}>{verifyText}</Text> : null}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
