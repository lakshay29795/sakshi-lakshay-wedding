import { WeddingCouple, TimelineEvent } from '@/types';

export const weddingInfo: WeddingCouple = {
  bride: {
    name: 'Sakshi',
    fullName: 'Sakshi Elizabeth Johnson',
    photo: '/images/couple/bride.jpg',
  },
  groom: {
    name: 'Lakshay',
    fullName: 'Lakshay David Smith',
    photo: '/images/couple/groom.jpg',
  },
  weddingDate: new Date('2025-11-12T16:00:00'),
  venue: {
    name: 'Rosewood Manor',
    address: '123 Garden Lane, Romantic Valley, CA 90210',
    coordinates: {
      lat: 34.0522,
      lng: -118.2437,
    },
  },
};

export const relationshipTimeline: TimelineEvent[] = [
  {
    id: '1',
    date: new Date('2018-03-14'),
    title: 'First Meeting',
    description: 'We met at a coffee shop on a rainy Tuesday morning. Sakshi was reading her favorite book, and Lakshay couldn\'t help but strike up a conversation about it.',
    image: '/images/timeline/first-meeting.jpg',
    audioMessage: '/audio/timeline/first-meeting.mp3',
    location: {
      name: 'Central Perk Coffee',
      coordinates: {
        lat: 34.0522,
        lng: -118.2437,
      },
    },
  },
  {
    id: '2',
    date: new Date('2018-05-20'),
    title: 'First Date',
    description: 'Our first official date was a picnic in the park. Lakshay brought homemade sandwiches, and Sakshi brought her guitar. We spent hours talking and laughing under the oak tree.',
    image: '/images/timeline/first-date.jpg',
    audioMessage: '/audio/timeline/first-date.mp3',
    location: {
      name: 'Sunset Park',
      coordinates: {
        lat: 34.0622,
        lng: -118.2537,
      },
    },
  },
  {
    id: '3',
    date: new Date('2019-02-14'),
    title: 'First Valentine\'s Day',
    description: 'Lakshay surprised Sakshi with a handwritten letter and her favorite flowers. Sakshi cooked Lakshay\'s favorite meal. It was simple, but perfect.',
    image: '/images/timeline/first-valentine.jpg',
    audioMessage: '/audio/timeline/first-valentine.mp3',
  },
  {
    id: '4',
    date: new Date('2020-08-10'),
    title: 'Moving In Together',
    description: 'We found our first apartment together. It was small, but it was ours. We spent the weekend painting walls and building furniture from IKEA.',
    image: '/images/timeline/moving-in.jpg',
    audioMessage: '/audio/timeline/moving-in.mp3',
    location: {
      name: 'Our First Home',
      coordinates: {
        lat: 34.0722,
        lng: -118.2637,
      },
    },
  },
  {
    id: '5',
    date: new Date('2022-12-24'),
    title: 'The Proposal',
    description: 'On Christmas Eve, under the same oak tree where we had our first date, Lakshay got down on one knee. Sakshi said yes before he could even finish the question!',
    image: '/images/timeline/proposal.jpg',
    audioMessage: '/audio/timeline/proposal.mp3',
    location: {
      name: 'Sunset Park - Our Oak Tree',
      coordinates: {
        lat: 34.0622,
        lng: -118.2537,
      },
    },
  },
  {
    id: '6',
    date: new Date('2025-11-12'),
    title: 'Our Wedding Day',
    description: 'The day we\'ve been dreaming of is finally here! Surrounded by our loved ones, we\'ll promise to love each other for the rest of our lives.',
    image: '/images/timeline/wedding-day.jpg',
    location: {
      name: 'Rosewood Manor',
      coordinates: {
        lat: 34.0522,
        lng: -118.2437,
      },
    },
  },
];

export const weddingSchedule = [
  {
    time: '3:00 PM',
    event: 'Guest Arrival & Cocktail Hour',
    description: 'Welcome drinks and light appetizers in the garden',
  },
  {
    time: '4:00 PM',
    event: 'Wedding Ceremony',
    description: 'Exchange of vows in the rose garden',
  },
  {
    time: '4:30 PM',
    event: 'Cocktail Hour Continues',
    description: 'Photos with the wedding party, more mingling',
  },
  {
    time: '6:00 PM',
    event: 'Reception Dinner',
    description: 'Three-course dinner in the main hall',
  },
  {
    time: '8:00 PM',
    event: 'First Dance & Speeches',
    description: 'Our first dance followed by toasts from family',
  },
  {
    time: '9:00 PM',
    event: 'Dancing & Celebration',
    description: 'Dance the night away with our favorite songs',
  },
  {
    time: '11:00 PM',
    event: 'Send-off',
    description: 'Sparkler send-off under the stars',
  },
];
