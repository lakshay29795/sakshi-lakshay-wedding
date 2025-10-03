import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Heading, Text } from '@/components/ui/typography';
import { PhotoGallery } from '@/components/gallery/PhotoGallery';
import { galleryPhotos } from '@/data/gallery-data';

export const metadata: Metadata = {
  title: 'Photo Gallery | Sakshi & Lakshay\'s Wedding',
  description: 'Browse through our favorite moments and memories leading up to our special day.',
  openGraph: {
    title: 'Photo Gallery | Sakshi & Lakshay\'s Wedding',
    description: 'Browse through our favorite moments and memories leading up to our special day.',
    images: [
      {
        url: '/images/gallery/engagement-1.jpg',
        width: 800,
        height: 600,
        alt: 'Sakshi and Lakshay engagement photo',
      },
    ],
  },
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-romantic-pattern" style={{ padding: '10px' }}>
        <Container size="lg" className="text-center">
          <Heading size="hero" align="center" className="mb-6">
            Our Photo Gallery
          </Heading>
          <Text size="lg" variant="muted" align="center" className="max-w-2xl mx-auto mb-8">
            Browse through our favorite moments and memories as we journey toward our special day.
            Each photo tells a part of our love story.
          </Text>
          
          {/* Gallery Stats */}
          {/* <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-serif text-sage-green">{galleryPhotos.length}</div>
              <div className="text-sm text-muted-foreground">Photos</div>
            </div>
            <div>
              <div className="text-2xl font-serif text-sage-green">
                {new Set(galleryPhotos.map(p => p.category)).size}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-serif text-sage-green">
                {Math.ceil((Date.now() - Math.min(...galleryPhotos.map(p => p.date.getTime()))) / (1000 * 60 * 60 * 24 * 30))}
              </div>
              <div className="text-sm text-muted-foreground">Months of Memories</div>
            </div>
          </div> */}
        </Container>
      </section>

      {/* Gallery Section */}
      <section className="section-padding">
        <Container size="xl">
          <PhotoGallery photos={galleryPhotos} itemsPerPage={16} />
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-sage-green/5">
        <Container size="md" className="text-center">
          <Heading size="lg" align="center" className="mb-4">
            Share Your Photos
          </Heading>
          <Text variant="muted" align="center" className="mb-8">
            Have photos of us that you'd like to share? We'd love to see them and add them to our collection!
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:sarah.michael.wedding@example.com?subject=Photo Submission"
              className="wedding-button"
            >
              Email Us Photos
            </a>
            <a
              href="https://www.instagram.com/sarah_michael_wedding"
              target="_blank"
              rel="noopener noreferrer"
              className="wedding-button-secondary"
            >
              Tag Us on Instagram
            </a>
          </div>
        </Container>
      </section>
    </main>
  );
}
