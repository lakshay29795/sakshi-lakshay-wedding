import type { Metadata } from 'next';
import { InteractiveTimeline } from '@/components/features/interactive-timeline';
import { relationshipTimeline } from '@/data/wedding-info';

export const metadata: Metadata = {
  title: 'Our Love Story',
  description: 'Discover how Sakshi and Lakshay\'s journey began and the moments that brought them together. From their first meeting to their engagement, explore the timeline of their love story.',
  openGraph: {
    title: 'Our Love Story | Sakshi & Lakshay\'s Wedding',
    description: 'Discover how Sakshi and Lakshay\'s journey began and the moments that brought them together.',
    images: [
      {
        url: '/images/timeline/love-story-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Sakshi and Lakshay\'s Love Story',
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
