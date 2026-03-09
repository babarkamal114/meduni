export const siteConfig = {
  name: 'MedUni',
  description: 'Next-Generation Medical Education Platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://meduni.co.uk',
  ogImage: 'https://meduni.co.uk/og-image.jpg',
  contactEmail: 'hello@meduni.co.uk',
  links: {
    twitter: 'https://twitter.com/meduni',
    linkedin: 'https://linkedin.com/company/meduni',
  },
  navLinks: [
    { href: '/#features', label: 'Features' },
    { href: '/#webinars', label: 'Webinars' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/#testimonials', label: 'Testimonials' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/#timeline', label: 'Timeline' },
    { href: '/#contact', label: 'Contact' },
  ],
} as const;

