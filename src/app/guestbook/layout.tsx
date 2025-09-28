import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guest Book - Sakshi & Lakshay Wedding',
  description: 'Share your love, wishes, and memories with Sarah and Michael as they begin their journey together.',
  keywords: ['guest book', 'wedding', 'messages', 'wishes', 'sarah & michael'],
  openGraph: {
    title: 'Guest Book - Sakshi & Lakshay Wedding',
    description: 'Share your love, wishes, and memories with Sarah and Michael as they begin their journey together.',
    url: 'https://yourweddingwebsite.com/guestbook',
    type: 'website',
    images: [
      {
        url: 'https://yourweddingwebsite.com/og-guestbook.jpg',
        width: 1200,
        height: 630,
        alt: 'Sakshi & Lakshay Wedding Guest Book',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guest Book - Sakshi & Lakshay Wedding',
    description: 'Share your love, wishes, and memories with Sarah and Michael.',
    images: ['https://yourweddingwebsite.com/og-guestbook.jpg'],
  },
};

export default function GuestBookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
