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
    date: new Date('2018-09-15'),
    title: 'Birthdays',
    description: 'Our first birthday celebration together! We surprised each other with thoughtful gifts and spent the day making new memories. This was when we knew our connection was truly special.',
    image: '/images/timeline/birthday.jpg',
    audioMessage: '/audio/timeline/birthday.mp3',
    location: {
      name: 'Birthday Celebration',
      coordinates: {
        lat: 34.0522,
        lng: -118.2437,
      },
    },
  },
  {
    id: '3',
    date: new Date('2019-06-20'),
    title: 'Trips',
    description: 'A fun-filled pool party with friends! We laughed, played games, and enjoyed the sunshine. These carefree moments with our favorite people made summer unforgettable.',
    image: '/images/timeline/nanital-3.jpg',
    audioMessage: '/audio/timeline/trips.mp3',
    location: {
      name: 'Summer Getaway',
      coordinates: {
        lat: 34.0522,
        lng: -118.2437,
      },
    },
  },
  {
    id: '4',
    date: new Date('2019-12-31'),
    title: 'Parties',
    description: 'Ringing in the new year surrounded by friends and love. We danced the night away and made promises for the future. Little did we know how many adventures awaited us!',
    image: '/images/timeline/party.jpg',
    audioMessage: '/audio/timeline/parties.mp3',
    location: {
      name: 'New Year Celebration',
      coordinates: {
        lat: 34.0522,
        lng: -118.2437,
      },
    },
  },
  {
    id: '5',
    date: new Date('2020-08-10'),
    title: 'Our Home',
    description: 'We found our first apartment together. It was small, but it was ours. We spent the weekend painting walls and building furniture from IKEA.',
    image: '/images/timeline/our-flat.jpg',
    audioMessage: '/audio/timeline/our-home.mp3',
    location: {
      name: 'Our First Home',
      coordinates: {
        lat: 34.0722,
        lng: -118.2637,
      },
    },
  },
  {
    id: '6',
    date: new Date('2021-10-15'),
    title: 'Weekend Getaway',
    description: 'Our magical escape to the hills! We explored the beautiful lake town, took romantic boat rides, and enjoyed the serene mountain views. The cool breeze and quiet moments together recharged our souls.',
    image: '/images/timeline/pool-party.jpg',
    audioMessage: '/audio/timeline/weekend-getaway.mp3',
    location: {
      name: 'Nainital, Uttarakhand',
      coordinates: {
        lat: 29.3803,
        lng: 79.4636,
      },
    },
  },
  {
    id: '7',
    date: new Date('2022-03-20'),
    title: 'International Trip',
    description: 'Our dream adventure abroad! Exploring new cultures, trying exotic foods, and creating memories in a foreign land. This trip showed us that together, we can go anywhere.',
    image: '/images/timeline/first-international-trip.jpg',
    audioMessage: '/audio/timeline/international-trip.mp3',
    location: {
      name: 'International Adventure',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060,
      },
    },
  },
  {
    id: '8',
    date: new Date('2022-12-24'),
    title: 'The Proposal',
    description: 'On Christmas Eve, under the same oak tree where we had our first date, Lakshay got down on one knee. Sakshi said yes before he could even finish the question!',
    image: '/images/timeline/proposal-1.jpg',
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
    id: '9',
    date: new Date('2025-11-12'),
    title: 'Our Wedding Day',
    description: 'The day we\'ve been dreaming of is finally here! Surrounded by our loved ones, we\'ll promise to love each other for the rest of our lives.',
    image: '/images/timeline/lavi-wedding.jpg',
    audioMessage: '/audio/timeline/wedding-day.mp3',
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
