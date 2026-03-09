import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { HeroSection } from '@/components/marketing/hero-section';
import { TechMarqueeSection } from '@/components/marketing/tech-marquee-section';
import { FeaturesSection } from '@/components/marketing/features-section';
import { DashboardPreviewSection } from '@/components/marketing/dashboard-preview-section';
import { LatestWebinarsSection } from '@/components/marketing/latest-webinars-section';
import { ArchitectureSection } from '@/components/marketing/architecture-section';
import { PricingSection } from '@/components/marketing/pricing-section';
import { TestimonialsSection } from '@/components/marketing/testimonials-section';
import { FaqSection } from '@/components/marketing/faq-section';
import { CtaStrip } from '@/components/marketing/cta-strip';
import { TimelineSection } from '@/components/marketing/timeline-section';
import { ContactSection } from '@/components/marketing/contact-section';

export const metadata: Metadata = {
  title: 'Home',
  description: siteConfig.description,
};

export default function HomePage(): React.ReactElement {
  return (
    <>
      <HeroSection />
      <TechMarqueeSection />
      <FeaturesSection />
      <DashboardPreviewSection />
      <LatestWebinarsSection />
      <ArchitectureSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaStrip />
      <TimelineSection />
      <ContactSection />
    </>
  );
}
