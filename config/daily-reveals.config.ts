/**
 * DAILY REVEALS CONFIGURATION
 * 
 * This file contains all daily reveal messages that unlock as the wedding approaches.
 * Each reveal unlocks on a specific day before the wedding (30 days, 29 days, etc.)
 * 
 * 🗓️ HOW IT WORKS:
 * - Day 30: Unlocks 30 days before wedding
 * - Day 29: Unlocks 29 days before wedding
 * - ...
 * - Day 1: Unlocks 1 day before wedding
 */

export type RevealCategory = 'memory' | 'preparation' | 'love-note' | 'surprise' | 'family' | 'friends' | 'question' | 'shayri' | 'song';

export type RevealType = 'photo' | 'video' | 'song' | 'message' | 'question' | 'shayri';

export interface DailyRevealConfig {
  day: number; // Days before wedding (30, 29, 28, etc.)
  type: RevealType; // Type of reveal
  title: string;
  description: string;
  image?: string; // Path to image (optional, for photo/video types)
  video?: string; // Video URL (for video type)
  song?: {
    title: string;
    artist: string;
    url: string; // YouTube/Spotify URL
    reason?: string; // Why this song is special
  };
  message: string; // Full message content
  question?: string; // Question to answer (for question type)
  category: RevealCategory;
  isSpecial?: boolean; // Highlight special milestone days
}

export const dailyRevealsConfig = {
  // ====================
  // SETTINGS
  // ====================
  settings: {
    enabled: true,
    totalDays: 30, // Number of days to show (30, 60, 90, etc.)
    unlockTime: '00:00', // Time of day to unlock (HH:mm format)
  },

  // ====================
  // CATEGORY SETTINGS
  // ====================
  categories: {
    memory: {
      name: 'Memory',
      color: 'from-rose-500 to-pink-500',
      description: 'A cherished memory from our relationship',
    },
    preparation: {
      name: 'Preparation',
      color: 'from-blue-500 to-indigo-500',
      description: 'Behind the scenes of our wedding planning',
    },
    'love-note': {
      name: 'Love Note',
      color: 'from-yellow-500 to-orange-500',
      description: 'A special message from the heart',
    },
    surprise: {
      name: 'Surprise',
      color: 'from-purple-500 to-violet-500',
      description: 'An unexpected moment or gift',
    },
    family: {
      name: 'Family',
      color: 'from-green-500 to-emerald-500',
      description: 'Special moments with family',
    },
    friends: {
      name: 'Friends',
      color: 'from-cyan-500 to-teal-500',
      description: 'Celebrating with our closest friends',
    },
    question: {
      name: 'Question',
      color: 'from-pink-500 to-rose-500',
      description: 'A question to ponder',
    },
    shayri: {
      name: 'Shayri',
      color: 'from-amber-500 to-orange-500',
      description: 'Poetry from the heart',
    },
    song: {
      name: 'Song',
      color: 'from-violet-500 to-purple-500',
      description: 'A special song for us',
    },
  },

  // ====================
  // DAILY REVEALS
  // ====================
  reveals: [
    // Day 30 - Photo with romantic message
    {
      day: 30,
      type: 'photo' as const,
      title: "Our First Date",
      description: "Where it all began",
      image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600",
      message: "30 days until we say 'I do'! Remember our first date at that cozy café? I was so nervous, but the moment you smiled, everything felt right. I knew from that day that you were someone special. ❤️",
      category: 'memory' as const,
      isSpecial: true
    },
    
    // Day 29 - Shayri
    {
      day: 29,
      type: 'shayri' as const,
      title: "Mohabbat Ki Shayri",
      description: "Words from the heart",
      message: "तेरे साथ बिताया हर लम्हा,\nएक खूबसूरत ख्वाब सा लगता है।\nतेरी मुस्कान में मिलती है मुझे खुशी,\nतू मेरी ज़िन्दगी का सबसे हसीन बाब सा लगता है। 💕\n\n(Every moment spent with you feels like a beautiful dream. I find happiness in your smile, you are the most beautiful chapter of my life.)",
      category: 'shayri' as const,
    },
    
    // Day 28 - Song
    {
      day: 28,
      type: 'song' as const,
      title: "Our Song",
      description: "The melody of our love",
      song: {
        title: "Perfect",
        artist: "Ed Sheeran",
        url: "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
        reason: "This song was playing during our first dance practice. Every time I hear it, I'm reminded of how perfect we are together."
      },
      message: "This song perfectly captures how I feel about you. Every lyric resonates with our love story. 🎵",
      category: 'song' as const,
    },
    
    // Day 27 - Video message
    {
      day: 27,
      type: 'video' as const,
      title: "Proposal Moment",
      description: "The day I asked forever",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600",
      message: "Relive the magical moment when I got down on one knee. Your 'Yes' changed my life forever! 💍",
      category: 'memory' as const,
      isSpecial: true
    },
    
    // Day 26 - Question
    {
      day: 26,
      type: 'question' as const,
      title: "A Question for You",
      description: "Something to think about",
      question: "What's your favorite memory of us? The one that always makes you smile no matter what?",
      message: "I'd love to hear which moment from our journey together holds the most special place in your heart. 💭",
      category: 'question' as const,
    },
    
    // Day 25 - Photo with message
    {
      day: 25,
      type: 'photo' as const,
      title: "Beach Sunset",
      description: "Our peaceful moment",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600",
      message: "Remember that evening at the beach? Just us, the sunset, and the sound of waves. That's when I realized I wanted every sunset of my life to be with you. 🌅",
      category: 'memory' as const,
    },
    
    // Day 24 - Plain message
    {
      day: 24,
      type: 'message' as const,
      title: "Love Note #1",
      description: "A message from the heart",
      message: "You've taught me what it means to love unconditionally. Every day with you is a blessing, and I can't wait to spend the rest of my life making you as happy as you make me. You are my home, my peace, and my forever. I love you more than words can ever express. ❤️",
      category: 'love-note' as const,
    },
    
    // Day 23 - Shayri
    {
      day: 23,
      type: 'shayri' as const,
      title: "Dil Ki Baat",
      description: "Feelings in poetry",
      message: "तुझसे मिलने के बाद, ज़िन्दगी में नया रंग आया,\nतेरी हंसी में खो जाता हूं, तू मेरा प्यारा सहारा बन के आया।\nहर सुबह तेरे नाम की, हर शाम तेरे साथ की,\nतू है मेरी मंज़िल, तू है मेरी दुआ। 🌹\n\n(After meeting you, life got new colors. I get lost in your laughter, you came as my beloved support. Every morning is in your name, every evening with you, you are my destination, you are my prayer.)",
      category: 'shayri' as const,
    },
    
    // Day 22 - Photo
    {
      day: 22,
      type: 'photo' as const,
      title: "Family Gathering",
      description: "When families became one",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600",
      message: "The day our families met for the first time. So much laughter, love, and acceptance. I'm so grateful our families get along so well! 👨‍👩‍👧‍👦",
      category: 'family' as const,
    },
    
    // Day 21 - Song
    {
      day: 21,
      type: 'song' as const,
      title: "Romantic Melody",
      description: "A song that reminds me of you",
      song: {
        title: "Tum Hi Ho",
        artist: "Arijit Singh",
        url: "https://www.youtube.com/watch?v=Umqb9KENgmk",
        reason: "This song speaks exactly what my heart feels for you. You are my everything."
      },
      message: "Tum Hi Ho - Because you truly are my everything. This song perfectly captures how incomplete I am without you. 🎶",
      category: 'song' as const,
    },
    
    // Day 20 - Question
    {
      day: 20,
      type: 'question' as const,
      title: "Dream Together",
      description: "Let's imagine our future",
      question: "What's one dream you have for us after we're married? Where do you see us in 5 years?",
      message: "I love thinking about our future together. Can't wait to make all our dreams come true! 💫",
      category: 'question' as const,
      isSpecial: true
    },
    
    // Day 19 - Video
    {
      day: 19,
      type: 'video' as const,
      title: "Our Adventures",
      description: "Montage of memories",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600",
      message: "A compilation of all our adventures together. From road trips to quiet evenings, every moment with you is an adventure! 🗺️",
      category: 'memory' as const,
    },
    
    // Day 18 - Plain message
    {
      day: 18,
      type: 'message' as const,
      title: "Why I Love You",
      description: "Reasons endless",
      message: "I love the way you laugh at my silly jokes, how you always know when I need a hug, your kindness towards everyone, the way you light up a room, how you challenge me to be better, your unwavering support, and most of all, I love how you love me. Here's to loving each other forever! 💕",
      category: 'love-note' as const,
    },
    
    // Day 17 - Shayri
    {
      day: 17,
      type: 'shayri' as const,
      title: "Ishq Wala Love",
      description: "True love poetry",
      message: "तेरे बिना अधूरी सी लगती है ये ज़िन्दगी,\nतू है तो हर मुश्किल आसान लगती है ये राहगी।\nतेरी मोहब्बत में मिली है मुझे जन्नत,\nतू मेरा साथ निभा, यही है मेरी एक ख्वाहिश। ✨\n\n(Life feels incomplete without you, every difficulty seems easy when you're there. I found heaven in your love, all I wish is for you to be with me always.)",
      category: 'shayri' as const,
    },
    
    // Day 16 - Photo
    {
      day: 16,
      type: 'photo' as const,
      title: "Coffee Date",
      description: "Our favorite spot",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600",
      message: "Our Sunday morning ritual - coffee, conversations, and you. Nothing beats starting the day with your smile. ☕💕",
      category: 'memory' as const,
    },
    
    // Day 15 - Song
    {
      day: 15,
      type: 'song' as const,
      title: "Dance Together",
      description: "Our dance floor anthem",
      song: {
        title: "Thinking Out Loud",
        artist: "Ed Sheeran",
        url: "https://www.youtube.com/watch?v=lp-EO5I60KA",
        reason: "The song we chose for our first dance. It represents our commitment to love each other through every phase of life."
      },
      message: "Can't wait to dance to this with you as husband and wife! 💃🕺",
      category: 'song' as const,
      isSpecial: true
    },
    
    // Day 14 - Question
    {
      day: 14,
      type: 'question' as const,
      title: "Love Language",
      description: "Understanding each other",
      question: "What's one thing I do that makes you feel most loved? I want to keep doing it forever!",
      message: "Understanding how you feel loved helps me love you better. Can't wait to hear your answer! 💝",
      category: 'question' as const,
    },
    
    // Day 13 - Photo
    {
      day: 13,
      type: 'photo' as const,
      title: "With Friends",
      description: "Celebrating together",
      image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&h=600",
      message: "The night our friend groups officially became one big family. So grateful for all the love and support! 👫👬👭",
      category: 'friends' as const,
    },
    
    // Day 12 - Plain message
    {
      day: 12,
      type: 'message' as const,
      title: "Promise",
      description: "My vow to you",
      message: "I promise to love you in sunshine and rain, in good times and challenging ones. I promise to laugh with you, dream with you, and grow old with you. I promise to be your partner, your best friend, and your forever love. Just 12 more days until I get to make these promises official! 💍",
      category: 'love-note' as const,
    },
    
    // Day 11 - Video
    {
      day: 11,
      type: 'video' as const,
      title: "Behind the Scenes",
      description: "Wedding preparations",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600",
      message: "A peek into all the crazy, fun, and sometimes chaotic moments of planning our perfect day! 🎬",
      category: 'preparation' as const,
    },
    
    // Day 10 - Shayri
    {
      day: 10,
      type: 'shayri' as const,
      title: "Countdown Shayri",
      description: "10 days to go",
      message: "दस दिन रह गए हैं, और फिर तू होगी मेरी,\nहर खुशी, हर गम, हर पल की साथी होगी तेरी।\nतेरे साथ ज़िन्दगी का नया सफर शुरू होगा,\nप्यार और खुशियों से भरा, हमारा घर नया होगा। 🏡\n\n(10 days left, and then you'll be mine. You'll be the companion of every happiness, every sorrow, every moment. A new journey of life will begin with you, filled with love and happiness, our new home.)",
      category: 'shayri' as const,
      isSpecial: true
    },
    
    // Day 9 - Song
    {
      day: 9,
      type: 'song' as const,
      title: "Romantic Melody",
      description: "A love song",
      song: {
        title: "All of Me",
        artist: "John Legend",
        url: "https://www.youtube.com/watch?v=450p7goxZqg",
        reason: "This song represents complete and unconditional love - loving all the perfect and imperfect pieces."
      },
      message: "All of me loves all of you. Perfect in every way, even your imperfections. 💞",
      category: 'song' as const,
    },
    
    // Day 8 - Question
    {
      day: 8,
      type: 'question' as const,
      title: "Wedding Day",
      description: "What excites you most?",
      question: "What are you most excited about on our wedding day? (Besides marrying me, obviously! 😄)",
      message: "Only 8 days to go! I'm curious to know what you're looking forward to the most! 🎊",
      category: 'question' as const,
    },
    
    // Day 7 - Photo
    {
      day: 7,
      type: 'photo' as const,
      title: "One Week Away!",
      description: "The final countdown",
      image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600",
      message: "Just ONE WEEK until we say 'I do'! My heart is overflowing with love and excitement! Can you believe we're almost there? 💖",
      category: 'surprise' as const,
      isSpecial: true
    },
    
    // Day 6 - Plain message
    {
      day: 6,
      type: 'message' as const,
      title: "Gratitude",
      description: "Thankful for you",
      message: "Thank you for choosing me every single day. Thank you for your patience, your love, your laughter, and your light. Thank you for being you. I can't wait to spend forever showing you how grateful I am to have you in my life. 6 more days! 🙏❤️",
      category: 'love-note' as const,
    },
    
    // Day 5 - Shayri
    {
      day: 5,
      type: 'shayri' as const,
      title: "Final Days",
      description: "Almost there",
      message: "पांच दिन और बस, फिर तू होगी मेरे नाम की,\nहर सुबह तेरी, हर शाम की।\nतेरी मुस्कान देखकर जागूंगा मैं हर रोज,\nतू होगी मेरे हर ख्वाब की, हर बात की। 🌟\n\n(Just 5 more days, then you'll be mine. Every morning yours, every evening. I'll wake up seeing your smile every day, you'll be part of my every dream, every conversation.)",
      category: 'shayri' as const,
    },
    
    // Day 4 - Video
    {
      day: 4,
      type: 'video' as const,
      title: "Love Story",
      description: "Our journey",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&h=600",
      message: "From strangers to best friends to soulmates. Our love story in moving pictures. 4 more days until the next chapter begins! 📖💕",
      category: 'memory' as const,
      isSpecial: true
    },
    
    // Day 3 - Question
    {
      day: 3,
      type: 'question' as const,
      title: "First Thought",
      description: "Wedding morning",
      question: "What do you think will be the first thing that crosses your mind when you wake up on our wedding day?",
      message: "I already know mine - it'll be 'Today I marry my best friend!' 3 days to go! 😊",
      category: 'question' as const,
    },
    
    // Day 2 - Photo
    {
      day: 2,
      type: 'photo' as const,
      title: "Tomorrow We Marry",
      description: "The eve of forever",
      image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600",
      message: "Tomorrow, I marry my best friend. Tomorrow, my dreams come true. Tomorrow, forever begins! I love you more than words can say. See you at the altar! 💍✨",
      category: 'surprise' as const,
      isSpecial: true
    },
    
    // Day 1 - Plain message
    {
      day: 1,
      type: 'message' as const,
      title: "The Final Day",
      description: "One more sleep",
      message: "This is it! Tomorrow I get to marry you! One more sleep and then we begin our forever. I promise to love you fiercely, support you endlessly, and make you laugh daily. Thank you for saying yes. Thank you for choosing me. I can't wait to be your spouse! All my love, always and forever. 💒❤️",
      category: 'love-note' as const,
      isSpecial: true
    },
  ] as DailyRevealConfig[],
} as const;

// Export types
export type DailyRevealsConfigType = typeof dailyRevealsConfig;
export type DailyRevealsList = typeof dailyRevealsConfig.reveals;
