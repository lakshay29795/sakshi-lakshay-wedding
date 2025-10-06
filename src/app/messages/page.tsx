import { Metadata } from 'next';
import { VideoMessages } from '@/components/features/video-messages';

export const metadata: Metadata = {
  title: 'Special Messages | Sakshi & Lakshay',
  description: 'Heartfelt video messages from family and loved ones',
};

export default function MessagesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blush-pink/10 via-white to-sage-green/10">
      <VideoMessages />
    </main>
  );
}

