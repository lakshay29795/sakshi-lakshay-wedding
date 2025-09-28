import { Metadata } from 'next';
import { DreamsBoard } from '@/components/features/dreams-board';

export const metadata: Metadata = {
  title: 'Dreams Board',
  description: 'Create and visualize your future dreams together with our interactive drag-and-drop vision board.',
};

export default function DreamsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/20">
      <div className="container mx-auto px-4 py-12">
        <DreamsBoard />
      </div>
    </div>
  );
}
