import type { Metadata } from 'next';
import { InteractiveTimeline } from '@/components/features/interactive-timeline';
import { relationshipTimeline } from '@/data/wedding-info';
import { websiteConfig } from '@/config/website.config';

const siteTitle = `${websiteConfig.couple.bride.name} & ${websiteConfig.couple.groom.name}'s Wedding`;
const coupleNames = `${websiteConfig.couple.bride.name} and ${websiteConfig.couple.groom.name}`;

export const metadata: Metadata = {
  title: 'Our Love Story',
  description: `Discover how ${coupleNames}'s journey began and the moments that brought them together. From their first meeting to their engagement, explore the timeline of their love story.`,
  openGraph: {
    title: `Our Love Story | ${siteTitle}`,
    description: `Discover how ${coupleNames}'s journey began and the moments that brought them together.`,
    images: [
      {
        url: '/images/timeline/love-story-hero.jpg',
        width: 1200,
        height: 630,
        alt: `${coupleNames}'s Love Story`,
      },
    ],
  },
};

export default function StoryPage() {
  return (
    <div className="min-h-screen">
      <InteractiveTimeline events={relationshipTimeline} />
    </div>
  );
}
