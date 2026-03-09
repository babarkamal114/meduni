import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget';
import { ScrollToHash } from '@/components/marketing/scroll-to-hash';
import { siteConfig } from '@/config/site';
import { generateMetadata as genMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = genMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  type: 'website',
  url: '/',
});

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<React.ReactElement> {
  return (
    <div className="flex min-h-screen flex-col bg-[#fdfcfa] text-slate-800">
      <ScrollToHash />
      <Navbar />
      <main className="flex-1 relative">{children}</main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}

