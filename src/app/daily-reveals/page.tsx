import { Metadata } from 'next';
import { DailyReveals } from '@/components/features/daily-reveals';

export const metadata: Metadata = {
  title: 'Daily Reveals',
  description: 'Discover our love story one day at a time with daily photo reveals leading up to our wedding.',
};

export default function DailyRevealsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/30 via-white to-sage-green/10">
      <div className="container mx-auto px-4 py-12">
        <DailyReveals />
      </div>
    </div>
  );
}
