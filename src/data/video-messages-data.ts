/**
 * Video Messages Data
 * 
 * This file contains all the video messages from family members.
 * Each message includes a thumbnail image and video URL.
 */

export interface VideoMessage {
  id: string;
  name: string;
  relationship: string;
  thumbnail: string; // Path to thumbnail image (photo together)
  videoUrl: string; // Path to video message
  message: string; // Short description
  isLocked?: boolean; // Optional: lock until a specific date/condition
}

export const videoMessagesData: VideoMessage[] = [
  {
    id: '1',
    name: 'Mom',
    relationship: 'Mother',
    thumbnail: '/images/messages/mom-thumbnail.jpg',
    videoUrl: '/videos/messages/mom-message.mp4',
    message: 'A special message filled with love and blessings from your mother',
    isLocked: false,
  },
  {
    id: '2',
    name: 'Sister',
    relationship: 'Sibling',
    thumbnail: '/images/messages/sister-thumbnail.jpg',
    videoUrl: '/videos/messages/sister-message.mp4',
    message: 'Your sister shares cherished memories and wishes',
    isLocked: false,
  },
  {
    id: '3',
    name: 'Brother',
    relationship: 'Sibling',
    thumbnail: '/images/messages/brother-thumbnail.jpg',
    videoUrl: '/videos/messages/brother-message.mp4',
    message: 'A heartfelt message from your brother',
    isLocked: false,
  },
  {
    id: '4',
    name: 'Best Friend',
    relationship: 'Friend',
    thumbnail: '/images/messages/bestfriend-thumbnail.jpg',
    videoUrl: '/videos/messages/bestfriend-message.mp4',
    message: 'A message from your closest friend',
    isLocked: false,
  },
  {
    id: '5',
    name: 'Shivam',
    relationship: 'Brother',
    thumbnail: '/images/messages/shivam-thumbnail.jpg',
    videoUrl: '/videos/messages/shivam-message.mp4',
    message: 'A message from your closest friend',
    isLocked: false,
  },
  {
    id: '6',
    name: 'Chachi',
    relationship: 'Chachi',
    thumbnail: '/images/messages/chachi-thumbnail.jpg',
    videoUrl: '/videos/messages/chachi-message.mp4',
    message: 'A message from your closest friend',
    isLocked: false,
  }
  // Add more video messages as needed
];

