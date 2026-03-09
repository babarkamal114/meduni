import type { Metadata } from 'next';
import { generateMetadata as genMetadata } from '@/lib/seo/metadata';
import { ContactSection } from '@/components/marketing/contact-section';

export const metadata: Metadata = genMetadata({
  title: 'Contact Us',
  description:
    "Get in touch with MedUni. We're here to help with any questions about our medical education platform, webinars, or services.",
  type: 'website',
  url: '/contact',
});

export default function ContactPage(): React.ReactElement {
  return <ContactSection />;
}
