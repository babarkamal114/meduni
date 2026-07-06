export const siteConfig = {
  name: 'MedUni',
  description:
    'Expert-led clinical medicine webinars for medical students, built to strengthen understanding, confidence, and exam performance.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://meduni.co.uk',
  ogImage: '/og-image.jpg',
  contactEmail: 'info@meduni.co.uk',
  links: {
    twitter: 'https://twitter.com/meduni',
    linkedin: 'https://linkedin.com/company/meduni',
  },
  navLinks: [
    { href: '/#features', label: 'Features' },
    { href: '/exam-success', label: 'Exam Success' },
    { href: '/how-we-teach', label: 'How We Teach' },
    { href: '/webinars', label: 'Webinars' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
} as const;

