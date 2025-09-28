import { Metadata } from 'next';
import { SecretSections } from '@/components/features/secret-sections';

export const metadata: Metadata = {
  title: 'Secret Sections',
  description: 'Password-protected intimate stories and moments from Sakshi & Lakshay\'s love journey.',
};

export default function SecretsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-violet-50/20">
      <div className="container mx-auto px-4 py-12">
        <SecretSections />
      </div>
    </div>
  );
}
