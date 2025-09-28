import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { CoupleAvatars } from '@/components/features/couple-avatars';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Download, RefreshCw, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Avatar Demo',
  description: 'Demo page showing how Custom Couple Avatars work',
};

export default function AvatarDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Hero Section */}
      <Section className="pt-24 pb-12">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Palette className="w-8 h-8 text-sage-green" />
              <h1 className="text-4xl md:text-5xl font-serif text-charcoal">
                Custom Couple Avatars Demo
              </h1>
              <Palette className="w-8 h-8 text-sage-green" />
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              This demo shows you exactly how the Custom Couple Avatars feature works. 
              Try all the interactive elements below!
            </p>

            {/* Quick Instructions */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Palette className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-sm mb-2">Choose Style</h3>
                  <p className="text-xs text-muted-foreground">
                    Click on different style cards to see various artistic interpretations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-sm mb-2">Switch Views</h3>
                  <p className="text-xs text-muted-foreground">
                    Use "Sakshi", "Lakshay", or "Together" buttons to switch between individual and couple views
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Download className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-sm mb-2">Download</h3>
                  <p className="text-xs text-muted-foreground">
                    Click "Download" to save your favorite avatars as SVG files
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <RefreshCw className="w-3 h-3 mr-1" />
                Try "New Style" button
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Palette className="w-3 h-3 mr-1" />
                4 Different Art Styles
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Download className="w-3 h-3 mr-1" />
                SVG Download Ready
              </Badge>
            </div>
          </div>
        </Container>
      </Section>

      {/* Avatar Component */}
      <Section className="py-16 bg-white">
        <Container>
          <CoupleAvatars />
        </Container>
      </Section>

      {/* Instructions */}
      <Section className="py-16 bg-gradient-to-br from-sage-green/5 to-blush-pink/5">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif text-charcoal text-center mb-8">
              How It Works
            </h2>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-sage-green rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal mb-2">Style Selection</h3>
                      <p className="text-muted-foreground">
                        The avatar component includes 4 different artistic styles: <strong>Romantic Cartoon</strong> (soft colors with hearts), 
                        <strong>Minimalist</strong> (clean lines), <strong>Watercolor</strong> (artistic texture effects), 
                        and <strong>Vintage</strong> (classic elements with initials).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-sage-green rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal mb-2">Dynamic Generation</h3>
                      <p className="text-muted-foreground">
                        Each avatar is generated dynamically using SVG code with style-specific colors, features, and effects. 
                        The "New Style" button randomly selects different styles to show variations.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-sage-green rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal mb-2">Multiple Views</h3>
                      <p className="text-muted-foreground">
                        You can view individual avatars for Sakshi or Lakshay, or see them together as a couple. 
                        The couple view includes connecting elements like hearts and decorative touches.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-sage-green rounded-full flex items-center justify-center text-white font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal mb-2">Download & Use</h3>
                      <p className="text-muted-foreground">
                        All avatars can be downloaded as high-quality SVG files, perfect for wedding invitations, 
                        social media profiles, thank you cards, or any other wedding-related materials. 
                        SVG format ensures they look crisp at any size.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Call to Action */}
      <Section className="py-16 bg-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif text-charcoal mb-4">
              Ready to Use Your Avatars?
            </h2>
            <p className="text-muted-foreground mb-8">
              Once you've found your favorite style and downloaded the avatars, 
              you can use them in your wedding materials, social media, or anywhere you want to add a personal touch!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/interactive"
                className="inline-flex items-center justify-center px-6 py-3 bg-sage-green text-white rounded-lg hover:bg-sage-green/90 transition-colors"
              >
                <Palette className="w-4 h-4 mr-2" />
                Back to Interactive Features
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-sage-green text-sage-green rounded-lg hover:bg-sage-green/5 transition-colors"
              >
                Return to Home
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
