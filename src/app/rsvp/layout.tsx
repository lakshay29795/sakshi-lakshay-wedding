import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RSVP | Sakshi & Lakshay\'s Wedding',
  description: 'Please let us know if you can join us for our special day. We can\'t wait to celebrate with you!',
  openGraph: {
    title: 'RSVP | Sakshi & Lakshay\'s Wedding',
    description: 'Please let us know if you can join us for our special day. We can\'t wait to celebrate with you!',
    type: 'website',
  },
};

export default function RSVPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
