import { PersonalizedHero } from '@/components/features/personalized-hero';
import { RomanticFeatures } from '@/components/features/romantic-features';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-romantic-cream-light via-romantic-pearl to-romantic-blush-light">
      {/* Personalized Hero Section with Countdown */}
      <PersonalizedHero />
      
      {/* Romantic Features */}
      <RomanticFeatures />
      
      {/* Romantic background overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-romantic-blush/5 to-romantic-lavender/10" />
      </div>
    </div>
  );
}
