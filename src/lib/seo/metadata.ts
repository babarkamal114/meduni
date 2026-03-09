import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

interface GenerateMetadataOptions {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'event';
  url?: string;
}

export function generateMetadata({
  title,
  description,
  image,
  type = 'website',
  url,
}: GenerateMetadataOptions): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const ogImage = image || siteConfig.ogImage;
  const canonicalUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;

  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: type === 'event' ? 'website' : type,
      locale: 'en_GB',
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

