/**
 * PLAYFUL LOVE THEME CONFIGURATION
 * Fun, energetic design with quirky and colorful elements
 */

export const playfulLoveTheme = {
  name: 'Playful Love',
  slug: 'playful-love',
  description: 'Fun, energetic design with quirky and colorful romantic elements',
  
  colors: {
    primary: '#FF1744',       // Bright Red
    secondary: '#FF4081',     // Hot Pink
    accent: '#FFD54F',        // Yellow
    background: '#FFF9C4',    // Light Yellow
    backgroundAlt: '#FFF3E0', // Light Orange
    text: '#5D4037',          // Brown
    textLight: '#8D6E63',     // Light Brown
    rainbow: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#A594F9', '#FF6AC1'],
  },
  
  typography: {
    heading: '"Fredoka One", cursive',
    body: '"Nunito", sans-serif',
    accent: '"Caveat", cursive',
  },
  
  features: [
    'Animated Character Avatars',
    'Comic-Style Love Story',
    'Fun Photo Booth with Filters',
    'Relationship Games & Quizzes',
    'Meme Gallery',
    'Inside Jokes Section',
    'Bucket List Together',
    'Virtual Scratch Cards',
    'Love Fortune Teller',
  ],
  
  demoContent: {
    couple: {
      name1: 'Jake',
      name2: 'Emma',
      tagline: 'Two Goofballs in Love 🤪❤️',
    },
    hero: {
      greeting: 'Hey Babe! 💕',
      message: 'This is our totally awesome, super fun, absolutely epic love story!',
      date: '2025-02-14T00:00:00',
    },
    timeline: [
      {
        date: '2023-04-01',
        title: 'We Met! 🎉',
        description: 'You laughed at my terrible joke. I knew you were the one.',
        emoji: '😂',
      },
      {
        date: '2023-04-15',
        title: 'First Date Disaster 🍝',
        description: 'I spilled pasta all over myself. You stayed anyway. True love!',
        emoji: '🤦‍♂️',
      },
      {
        date: '2023-06-20',
        title: 'Officially Together! 💑',
        description: 'I asked "Wanna be my girlfriend?" You said "Took you long enough!"',
        emoji: '🥰',
      },
      {
        date: '2023-08-10',
        title: 'First Fight (and Makeup) 🥊➡️💏',
        description: 'Argued about pizza toppings. Made up with pizza. Logic!',
        emoji: '🍕',
      },
      {
        date: '2023-12-01',
        title: 'Got Matching Onesies 🐻',
        description: 'Peak relationship achievement unlocked',
        emoji: '🎯',
      },
    ],
    insideJokes: [
      {
        joke: 'The Chicken Incident',
        explanation: 'We don\'t talk about what happened at the petting zoo... 🐔',
      },
      {
        joke: '"It\'s Fine"',
        explanation: 'Translation: It\'s definitely not fine, but I love you anyway',
      },
      {
        joke: 'Tuesday Tradition',
        explanation: 'Taco Tuesday turned into "Try to Finish This Massive Burrito" Tuesday',
      },
    ],
    bucketList: [
      { item: 'Visit all the Disney parks 🏰', completed: false },
      { item: 'Learn to cook together without burning stuff 🔥', completed: false },
      { item: 'Have a water balloon fight 💧', completed: true },
      { item: 'Build a blanket fort 🏕️', completed: true },
      { item: 'Stay up all night talking 🌙', completed: true },
      { item: 'Take a spontaneous road trip 🚗', completed: false },
    ],
    message: `Yo Emma! 👋

Remember when we first met and you thought I was weird? Well, joke's on you because now you're stuck with me! 😝

Thanks for:
• Laughing at my dumb jokes (even the really bad ones)
• Being my partner in crime (and pizza)
• Putting up with my terrible singing in the car
• Being as weird as I am
• Making every day feel like an adventure

You're my best friend, my favorite weirdo, and the peanut butter to my jelly.

Love you to the moon and back! 🚀🌙

Your Forever Goofball,
Jake

P.S. - I'm STILL not sorry about the karaoke incident 🎤😎`,
  },
} as const;

export type PlayfulLoveTheme = typeof playfulLoveTheme;

