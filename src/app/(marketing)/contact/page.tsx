import type { Metadata } from 'next';
import { generateMetadata as genMetadata } from '@/lib/seo/metadata';
import { ContactSection } from '@/components/marketing/contact-section';

export const metadata: Metadata = genMetadata({
  title: 'Contact Us',
  description:
    "Contact MedUni for registrations, technical support, group bookings, or teaching enquiries from faculty and consultants.",
  type: 'website',
  url: '/contact',
});

export default function ContactPage(): React.ReactElement {
  return <ContactSection />;
}
