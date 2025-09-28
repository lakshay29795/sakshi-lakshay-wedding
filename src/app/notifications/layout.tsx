import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Stay connected with daily love messages, wedding reminders, and special updates from Sakshi & Lakshay.',
  openGraph: {
    title: 'Notifications | Sakshi & Lakshay\'s Wedding',
    description: 'Get personalized notifications about our wedding journey, daily love messages, and important updates.',
    images: ['/images/couple/hero-bg.png'],
  },
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
