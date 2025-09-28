import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { InteractiveLoveMap } from '@/components/features/interactive-love-map';
import { LoveLanguageQuiz } from '@/components/features/love-language-quiz';
import { CoupleAvatars } from '@/components/features/couple-avatars';
import { SimpleMusicPlayer } from '@/components/features/simple-music-player';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Map, Brain, Palette, Music } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Interactive Features',
  description: 'Explore our love story through interactive maps, quizzes, custom avatars, and music.',
};

const features = [
  {
    id: 'map',
    title: 'Our Love Story Map',
    description: 'Explore the special places in our relationship journey',
    icon: <Map className="w-6 h-6" />,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'quiz',
    title: 'Love Language Quiz',
    description: 'Discover your love language and see how compatible you are',
    icon: <Brain className="w-6 h-6" />,
    color: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'avatars',
    title: 'Custom Couple Avatars',
    description: 'AI-generated illustrations of Sakshi & Lakshay in various styles',
    icon: <Palette className="w-6 h-6" />,
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 'music',
    title: 'Our Songs Playlist',
    description: 'Listen to the soundtrack of our love story',
    icon: <Music className="w-6 h-6" />,
    color: 'bg-rose-100 text-rose-700',
  },
];

export default function InteractivePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Hero Section */}
      <Section className="pt-24 pb-12">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Heart className="w-8 h-8 text-sage-green" />
              <h1 className="text-4xl md:text-5xl font-serif text-charcoal">
                Interactive Love Story
              </h1>
              <Heart className="w-8 h-8 text-sage-green" />
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Dive deeper into our love story with these interactive features. Explore our journey, 
              discover your love language, enjoy our custom avatars, and listen to the songs that 
              define our relationship.
            </p>
          </div>
        </Container>
      </Section>

      {/* Features Overview */}
      <Section className="py-12">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature) => (
              <Card key={feature.id} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-serif text-lg text-charcoal mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Interactive Love Map */}
      <Section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Map className="w-4 h-4 mr-2" />
              Interactive Map
            </Badge>
            <h2 className="text-3xl font-serif text-charcoal mb-4">
              Our Love Story Map
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow our journey through the special places that shaped our love story. 
              Click on each location to discover the memories we made there.
            </p>
          </div>
          <InteractiveLoveMap />
        </Container>
      </Section>

      {/* Love Language Quiz */}
      <Section className="py-16 bg-gradient-to-br from-blush-pink/10 to-sage-green/10">
        <Container>
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Brain className="w-4 h-4 mr-2" />
              Personality Quiz
            </Badge>
            <h2 className="text-3xl font-serif text-charcoal mb-4">
              Love Language Quiz
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover how you express and receive love. Understanding your love language 
              can help strengthen your relationships and create deeper connections.
            </p>
          </div>
          <LoveLanguageQuiz />
        </Container>
      </Section>

      {/* Custom Couple Avatars */}
      <Section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Palette className="w-4 h-4 mr-2" />
              AI Art
            </Badge>
            <h2 className="text-3xl font-serif text-charcoal mb-4">
              Custom Couple Avatars
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              AI-generated custom illustrations of Sakshi & Lakshay in various artistic styles. 
              Perfect for wedding invitations, social media, and keepsakes.
            </p>
          </div>
          <CoupleAvatars />
        </Container>
      </Section>

      {/* Our Songs Playlist */}
      <Section className="py-16 bg-gradient-to-br from-sage-green/10 to-blush-pink/10">
        <Container>
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Music className="w-4 h-4 mr-2" />
              Music
            </Badge>
            <h2 className="text-3xl font-serif text-charcoal mb-4">
              Our Songs Playlist
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The soundtrack to our love story. Each song holds a special memory and meaning 
              in our journey together. Listen to previews and discover the stories behind each track.
            </p>
          </div>
          <SimpleMusicPlayer />
        </Container>
      </Section>

      {/* Call to Action */}
      <Section className="py-16 bg-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif text-charcoal mb-4">
              Share Your Experience
            </h2>
            <p className="text-muted-foreground mb-8">
              We'd love to hear what you think about these interactive features! 
              Share your quiz results, favorite songs, or memories from the places on our map.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/guestbook"
                className="inline-flex items-center justify-center px-6 py-3 bg-sage-green text-white rounded-lg hover:bg-sage-green/90 transition-colors"
              >
                <Heart className="w-4 h-4 mr-2" />
                Leave a Message
              </a>
              <a
                href="/rsvp"
                className="inline-flex items-center justify-center px-6 py-3 border border-sage-green text-sage-green rounded-lg hover:bg-sage-green/5 transition-colors"
              >
                RSVP to Our Wedding
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
