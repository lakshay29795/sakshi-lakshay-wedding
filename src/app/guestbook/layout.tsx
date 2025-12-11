import React from 'react';
import { Metadata } from 'next';
import { websiteConfig } from '@/config/website.config';

const siteTitle = `${websiteConfig.couple.bride.name} & ${websiteConfig.couple.groom.name} Wedding`;

export const metadata: Metadata = {
  title: `Guest Book - ${siteTitle}`,
  description: `Share your love, wishes, and memories with ${websiteConfig.couple.bride.name} and ${websiteConfig.couple.groom.name} as they begin their journey together.`,
  keywords: ['guest book', 'wedding', 'messages', 'wishes', `${websiteConfig.couple.bride.name.toLowerCase()} & ${websiteConfig.couple.groom.name.toLowerCase()}`],
  openGraph: {
    title: `Guest Book - ${siteTitle}`,
    description: `Share your love, wishes, and memories with ${websiteConfig.couple.bride.name} and ${websiteConfig.couple.groom.name} as they begin their journey together.`,
    url: `${websiteConfig.site.url}/guestbook`,
    type: 'website',
    images: [
      {
        url: `${websiteConfig.site.url}/og-guestbook.jpg`,
        width: 1200,
        height: 630,
        alt: `${siteTitle} Guest Book`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Guest Book - ${siteTitle}`,
    description: `Share your love, wishes, and memories with ${websiteConfig.couple.bride.name} and ${websiteConfig.couple.groom.name}.`,
    images: [`${websiteConfig.site.url}/og-guestbook.jpg`],
  },
};

export default function GuestBookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
