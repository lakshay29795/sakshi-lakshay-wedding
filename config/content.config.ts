/**
 * CONTENT CONFIGURATION
 * 
 * This file contains all text content, messages, and story elements for your wedding website.
 * Customize all the messages, descriptions, and story content here.
 */

import { TimelineEvent } from '@/types';
import { assetsConfig } from './assets.config';

export const contentConfig = {
  // ====================
  // HOME PAGE
  // ====================
  hero: {
    title: 'We\'re Getting Married!',
    subtitle: 'Join us for the celebration of a lifetime',
    welcomeMessage: 'Welcome to our wedding website. We\'re so excited to share our special day with you!',
  },

  // ====================
  // RELATIONSHIP TIMELINE
  // ====================
  timeline: [
    {
      id: '1',
      date: new Date('2020-03-14'),
      title: 'First Meeting',
      description: `We met for the first time at a cozy coffee shop downtown. From the moment we started talking, it felt like we'd known each other forever. Little did we know, this was the beginning of our beautiful journey together. ❤️`,
      image: assetsConfig.timeline['first-meeting'],
      location: {
        name: 'Coffee Shop Downtown',
        coordinates: {
          lat: 40.7580,
          lng: -73.9855,
        },
      },
    },
    {
      id: '2',
      date: new Date('2020-09-15'),
      title: 'First Birthday Together',
      description: `Our first birthday celebration together was unforgettable. We spent the day doing all our favorite things, making memories that we'll treasure forever. It was the perfect day! ❤️`,
      image: assetsConfig.timeline['birthday'],
      location: {
        name: 'Birthday Celebration',
        coordinates: {
          lat: 40.7589,
          lng: -73.9851,
        },
      },
    },
    {
      id: '3',
      date: new Date('2021-06-20'),
      title: 'Our First Trip Together',
      description: `Our first vacation together was magical. We explored new places, tried new foods, and created countless memories. Every moment was perfect because we were together. ❤️`,
      image: assetsConfig.timeline['nanital-3'],
      location: {
        name: 'Beach Resort',
        coordinates: {
          lat: 36.7783,
          lng: -119.4179,
        },
      },
    },
    {
      id: '4',
      date: new Date('2023-12-24'),
      title: 'The Proposal',
      description: `On a beautiful winter evening, surrounded by twinkling lights and falling snow, I got down on one knee and asked the most important question of my life. When you said yes, it was the happiest moment ever! ❤️`,
      image: assetsConfig.timeline['proposal-1'],
      location: {
        name: 'Central Park',
        coordinates: {
          lat: 40.7829,
          lng: -73.9654,
        },
      },
    },
    {
      id: '5',
      date: new Date('2025-06-15'),
      title: 'Our Wedding Day',
      description: `And now, the most beautiful chapter of our story begins. Today we celebrate our love surrounded by family and friends, as we promise to spend forever together. Here's to our happily ever after! ❤️`,
      image: assetsConfig.timeline['lavi-wedding'],
      location: {
        name: 'Grand Ballroom Hotel',
        coordinates: {
          lat: 40.7128,
          lng: -74.0060,
        },
      },
    },
  ] as TimelineEvent[],

  // ====================
  // VIDEO MESSAGES
  // ====================
  videoMessages: [
    {
      id: '1',
      name: 'Mummy ji',
      relationship: 'Mother',
      thumbnail: 'https://images.pexels.com/photos/18223032/pexels-photo-18223032.jpeg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      message: 'A special message filled with love and blessings for your wedding day',
      isLocked: false,
    },
    {
      id: '2',
      name: 'Di',
      relationship: 'Sister',
      thumbnail: 'https://images.pexels.com/photos/14037486/pexels-photo-14037486.png',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      message: 'Your sister shares cherished memories and heartfelt wishes',
      isLocked: false,
    },
    {
      id: '3',
      name: 'Bhaiya',
      relationship: 'Brother',
      thumbnail: 'https://images.pexels.com/photos/938639/pexels-photo-938639.jpeg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      message: 'A heartfelt message from your brother about growing up together',
      isLocked: false,
    },
    {
      id: '4',
      name: 'Riya',
      relationship: 'Best Friend',
      thumbnail: 'https://images.pexels.com/photos/2747267/pexels-photo-2747267.jpeg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      message: 'A message from your closest friend celebrating your love story',
      isLocked: false,
    },
  ],

  // ====================
  // FEATURES SECTION
  // ====================
  features: {
    title: 'Explore Our Wedding',
    subtitle: 'Everything you need to know about our special day',
    items: [
      {
        title: 'Our Story',
        description: 'Read about our journey together',
        icon: 'heart',
      },
      {
        title: 'Photo Gallery',
        description: 'View our favorite moments',
        icon: 'image',
      },
      {
        title: 'RSVP',
        description: 'Let us know if you can make it',
        icon: 'calendar',
      },
      {
        title: 'Guest Book',
        description: 'Leave us a message',
        icon: 'book',
      },
    ],
  },

  // ====================
  // RSVP PAGE
  // ====================
  rsvp: {
    title: 'Will You Join Us?',
    subtitle: 'Please let us know if you can attend',
    confirmationMessage: 'Thank you for your RSVP! We\'re so excited to celebrate with you!',
    fields: {
      name: 'Full Name',
      email: 'Email Address',
      guests: 'Number of Guests',
      attending: 'Will you be attending?',
      dietaryRestrictions: 'Dietary Restrictions',
      message: 'Special Message (Optional)',
    },
  },

  // ====================
  // GUESTBOOK PAGE
  // ====================
  guestbook: {
    title: 'Guest Book',
    subtitle: 'Leave us a message and share your wishes',
    placeholders: {
      name: 'Your Name',
      message: 'Your message...',
    },
    submitButton: 'Sign Guest Book',
    successMessage: 'Thank you for your lovely message!',
  },

  // ====================
  // GALLERY PAGE
  // ====================
  gallery: {
    title: 'Our Gallery',
    subtitle: 'A collection of our favorite memories together',
    categories: ['All', 'Couple', 'Family', 'Friends', 'Travel'],
    defaultCaption: 'Beautiful moment together',
  },

  // ====================
  // FOOTER
  // ====================
  footer: {
    copyright: '2025 Wedding Website. Made with ❤️',
    privacyText: 'All photos and content are private and for invited guests only.',
  },
} as const;

// Export types for TypeScript support
export type TimelineConfig = typeof contentConfig.timeline;
export type VideoMessagesConfig = typeof contentConfig.videoMessages;

