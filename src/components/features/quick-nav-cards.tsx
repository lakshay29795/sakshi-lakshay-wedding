'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Heading, Text } from '@/components/ui/typography';
import { WeddingCard, WeddingCardContent, WeddingCardHeader, WeddingCardTitle, WeddingCardDescription } from '@/components/ui/wedding-card';
import { StaggerContainer, StaggerItem } from '@/components/animations/stagger-container';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { 
  Heart, 
  Camera, 
  Calendar, 
  MapPin, 
  MessageCircle, 
  Gift,
  Clock,
  Users
} from 'lucide-react';

interface QuickNavCardsProps {
  className?: string;
}

const navigationCards = [
  {
    href: '/story',
    title: 'Our Love Story',
    description: 'Discover how our journey began and the moments that brought us together',
    icon: Heart,
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
  },
  {
    href: '/gallery',
    title: 'Photo Gallery',
    description: 'Browse through our favorite memories and engagement photos',
    icon: Camera,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    href: '/details',
    title: 'Wedding Details',
    description: 'Find all the important information about our special day',
    icon: Calendar,
    color: 'text-sage-green',
    bgColor: 'bg-sage-green/10',
  },
  {
    href: '/rsvp',
    title: 'RSVP',
    description: 'Let us know if you can join us for our celebration',
    icon: Users,
    color: 'text-gold-accent',
    bgColor: 'bg-gold-accent/10',
  },
  {
    href: '/venue',
    title: 'Venue & Travel',
    description: 'Get directions and accommodation recommendations',
    icon: MapPin,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
  },
  {
    href: '/guestbook',
    title: 'Guest Book',
    description: 'Leave us a message and share your well wishes',
    icon: MessageCircle,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    href: '/registry',
    title: 'Gift Registry',
    description: 'Find the perfect gift to help us start our new life together',
    icon: Gift,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
  },
  {
    href: '/schedule',
    title: 'Wedding Schedule',
    description: 'View the timeline of events for our wedding day',
    icon: Clock,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  },
];

export function QuickNavCards({ className }: QuickNavCardsProps) {
  return (
    <Section 
      id="about-section"
      className={cn(className)} 
      padding="lg" 
      background="muted"
    >
      <Container size="xl">
        <ScrollReveal>
          <div className="text-center mb-12">
            <Heading size="h2" variant="romantic" className="mb-4">
              Celebrate With Us
            </Heading>
            <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
              Everything you need to know about our special day, all in one place
            </Text>
          </div>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {navigationCards.map((card) => {
              const Icon = card.icon;
              
              return (
                <StaggerItem key={card.href}>
                  <Link href={card.href} className="block h-full group">
                    <WeddingCard 
                      variant="default" 
                      padding="lg" 
                      hover="lift"
                      className="h-full transition-all duration-300 group-hover:shadow-xl group-hover:border-sage-green/30"
                    >
                      <WeddingCardHeader>
                        <div className={cn(
                          'w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110',
                          card.bgColor
                        )}>
                          <Icon className={cn('h-6 w-6', card.color)} />
                        </div>
                        
                        <WeddingCardTitle className="group-hover:text-sage-green transition-colors">
                          {card.title}
                        </WeddingCardTitle>
                      </WeddingCardHeader>
                      
                      <WeddingCardContent>
                        <WeddingCardDescription>
                          {card.description}
                        </WeddingCardDescription>
                      </WeddingCardContent>
                    </WeddingCard>
                  </Link>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>
      </Container>
    </Section>
  );
}
