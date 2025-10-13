'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Heart, Star, Gift, Sparkles, Lock, Unlock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { weddingInfo } from '@/data/wedding-info';

interface DailyReveal {
  id: string;
  day: number; // Days before wedding (30, 29, 28, etc.)
  title: string;
  description: string;
  image: string;
  message: string;
  unlockDate: Date;
  category: 'memory' | 'preparation' | 'love-note' | 'surprise' | 'family' | 'friends';
  isSpecial?: boolean; // For milestone days
}

// Generate daily reveals leading up to the wedding
const generateDailyReveals = (): DailyReveal[] => {
  const weddingDate = new Date(weddingInfo.weddingDate);
  const reveals: DailyReveal[] = [];
  
  const revealData = [
    // 30 days before
    {
      title: "Our Temple visit",
      description: "place which gives you peace",
      image: "/images/daily-reveals/first.jpg",
      message: "I may not believe in God, but I truly believe in us. You are my faith, my reason, and my calm. I promise to do everything I can to make you happy — not out of expectation, but out of love. And I know you’ll do the same. With time, we’ll grow together, finding joy in the little things and creating our own beautiful world filled with love and understanding.",
      category: 'memory' as const,
      isSpecial: true
    },
    // 29 days before
    {
      title: "Engagement Ring Shopping",
      description: "The secret mission",
      image: "/images/daily-reveals/ring-shopping.jpg",
      message: "I spent weeks researching the perfect ring. Your sister was my secret accomplice! 💍",
      category: 'preparation' as const
    },
    // 28 days before
    {
      title: "Love Note #1",
      description: "A message from the heart",
      image: "/images/daily-reveals/love-note-1.jpg",
      message: "Every morning I wake up grateful that I get to love you for the rest of my life. ❤️",
      category: 'love-note' as const
    },
    // 27 days before
    {
      title: "Venue Visit",
      description: "Finding our perfect place",
      image: "/images/daily-reveals/venue-visit.jpg",
      message: "The moment we walked into our venue in Pitampura, we both knew. This is where we'll say 'I do'! 🏰",
      category: 'preparation' as const
    },
    // 26 days before
    {
      title: "Family Dinner",
      description: "When families become one",
      image: "/images/daily-reveals/family-dinner.jpg",
      message: "Our families meeting for the first time was magical. So much laughter and love! 👨‍👩‍👧‍👦",
      category: 'family' as const
    },
    // 25 days before
    {
      title: "Surprise Weekend",
      description: "Unexpected adventure",
      image: "/images/daily-reveals/surprise-weekend.jpg",
      message: "Remember when I blindfolded you for that surprise weekend getaway? Your reaction was priceless! 🎁",
      category: 'surprise' as const,
      isSpecial: true
    },
    // Continue with more reveals...
    {
      title: "Dance Lessons",
      description: "Learning to move together",
      image: "/images/daily-reveals/dance-lessons.jpg",
      message: "Our first dance lesson was... interesting! But look how far we've come! 💃🕺",
      category: 'preparation' as const
    },
    {
      title: "Love Note #2",
      description: "Another message from the heart",
      image: "/images/daily-reveals/love-note-2.jpg",
      message: "You make ordinary moments feel like fairy tales. I can't wait to write our next chapter. ✨",
      category: 'love-note' as const
    },
    {
      title: "Best Friends' Approval",
      description: "When friends become family",
      image: "/images/daily-reveals/friends-approval.jpg",
      message: "The night our friend groups merged into one big, crazy, loving family! 👫👬👭",
      category: 'friends' as const
    },
    {
      title: "Cake Tasting",
      description: "The sweetest decision",
      image: "/images/daily-reveals/cake-tasting.jpg",
      message: "We tried 12 different cakes. You insisted on 'research' for each one! 🍰",
      category: 'preparation' as const
    },
    // Add more reveals to reach 30 days
    {
      title: "Our Song",
      description: "The melody of our love",
      image: "/images/daily-reveals/our-song.jpg",
      message: "The first time we danced to 'Perfect' in your kitchen at 2 AM. Pure magic. 🎵",
      category: 'memory' as const,
      isSpecial: true
    },
    {
      title: "Proposal Planning",
      description: "The most important question",
      image: "/images/daily-reveals/proposal-planning.jpg",
      message: "I practiced that proposal speech 100 times. Still forgot half of it when I saw your face! 💍",
      category: 'memory' as const,
      isSpecial: true
    },
    // 18 days before
    {
      title: "First 'I Love You'",
      description: "Three words that changed everything",
      image: "/images/daily-reveals/first-i-love-you.jpg",
      message: "You said it first, and my heart hasn't stopped racing since that moment. 💗",
      category: 'memory' as const,
      isSpecial: true
    },
    // 17 days before
    {
      title: "Wedding Dress Shopping",
      description: "Finding the perfect dress",
      image: "/images/daily-reveals/dress-shopping.jpg",
      message: "When you stepped out in THAT dress, everyone cried. You looked like a dream! 👰",
      category: 'preparation' as const
    },
    // 16 days before
    {
      title: "Love Note #3",
      description: "Words from the heart",
      image: "/images/daily-reveals/love-note-3.jpg",
      message: "Loving you is the easiest thing I've ever done. Marrying you will be the best. 💕",
      category: 'love-note' as const
    },
    // 15 days before
    {
      title: "Bachelor/Bachelorette Parties",
      description: "One last celebration",
      image: "/images/daily-reveals/bachelor-party.jpg",
      message: "What happens in Vegas... well, you'll hear ALL about it! 🎉",
      category: 'friends' as const
    },
    // 14 days before
    {
      title: "Meeting Your Parents",
      description: "The nerve-wracking dinner",
      image: "/images/daily-reveals/meeting-parents.jpg",
      message: "I was terrified, but they welcomed me like their own. Your mom even shared baby photos! 👨‍👩‍👧",
      category: 'family' as const
    },
    // 13 days before
    {
      title: "Anniversary Surprise",
      description: "Celebrating our love",
      image: "/images/daily-reveals/anniversary.jpg",
      message: "Every day with you feels like a celebration, but our anniversaries are extra special! 🎊",
      category: 'surprise' as const
    },
    // 12 days before
    {
      title: "Honeymoon Planning",
      description: "Dreaming of paradise",
      image: "/images/daily-reveals/honeymoon.jpg",
      message: "Two weeks of sun, sand, and just us. I can't wait to start our forever! 🏝️",
      category: 'preparation' as const
    },
    // 11 days before
    {
      title: "Love Note #4",
      description: "Counting down the days",
      image: "/images/daily-reveals/love-note-4.jpg",
      message: "11 more days until I get to call you my wife/husband forever. My heart is so full! 💖",
      category: 'love-note' as const
    },
    // 10 days before
    {
      title: "Rainy Day Adventure",
      description: "Making memories in the rain",
      image: "/images/daily-reveals/rainy-day.jpg",
      message: "Dancing in the rain with you - one of my favorite memories. You make every moment magical! ☔💃",
      category: 'memory' as const,
      isSpecial: true
    },
    // 9 days before
    {
      title: "Rehearsal Dinner Plans",
      description: "Preparing for the big day",
      image: "/images/daily-reveals/rehearsal.jpg",
      message: "Almost there! Can't wait to see all our loved ones together! 🥂",
      category: 'preparation' as const
    },
    // 8 days before
    {
      title: "Your Smile",
      description: "What I fell in love with",
      image: "/images/daily-reveals/smile.jpg",
      message: "Your smile lights up my world. 8 more days until I see it as you walk down the aisle! 😊",
      category: 'love-note' as const
    },
    // 7 days before
    {
      title: "One Week To Go!",
      description: "The final countdown",
      image: "/images/daily-reveals/one-week.jpg",
      message: "7 days! This time next week, we'll be married! I'm the luckiest person alive! 💫",
      category: 'surprise' as const,
      isSpecial: true
    },
    // 6 days before
    {
      title: "Final Fittings",
      description: "Making sure everything is perfect",
      image: "/images/daily-reveals/final-fitting.jpg",
      message: "Last-minute adjustments and suddenly it's all so real. We're really doing this! 👔👗",
      category: 'preparation' as const
    },
    // 5 days before
    {
      title: "Lazy Sunday Morning",
      description: "Our favorite tradition",
      image: "/images/daily-reveals/lazy-sunday.jpg",
      message: "Coffee in bed, your head on my shoulder. Can't wait for a lifetime of Sunday mornings! ☕",
      category: 'memory' as const
    },
    // 4 days before
    {
      title: "Love Note #5",
      description: "Almost there",
      image: "/images/daily-reveals/love-note-5.jpg",
      message: "4 more days until forever starts. You are my greatest adventure! 🗺️",
      category: 'love-note' as const
    },
    // 3 days before
    {
      title: "Wedding Favors",
      description: "Little gifts of love",
      image: "/images/daily-reveals/favors.jpg",
      message: "Handmade with love! Can't wait to share our happiness with everyone! 🎁",
      category: 'preparation' as const
    },
    // 2 days before
    {
      title: "Tomorrow We Marry",
      description: "The eve of forever",
      image: "/images/daily-reveals/tomorrow.jpg",
      message: "Tomorrow, I marry my best friend. Tomorrow, my dreams come true. Tomorrow, forever begins! 💍",
      category: 'surprise' as const,
      isSpecial: true
    },
    // 1 day before
    {
      title: "The Final Day",
      description: "One more sleep",
      image: "/images/daily-reveals/final-day.jpg",
      message: "This is it! Tomorrow I get to marry you! I love you more than words can say. See you at the altar! 💒❤️",
      category: 'love-note' as const,
      isSpecial: true
    }
  ];

  // Generate reveals for the last 30 days before wedding
  // Day 30 unlocks 30 days before wedding, Day 29 unlocks 29 days before, etc.
  // Day 1 unlocks 1 day before wedding
  for (let i = 0; i < Math.min(30, revealData.length); i++) {
    const dayNumber = 30 - i; // 30, 29, 28, ... 1
    const unlockDate = new Date(weddingDate);
    
    // Set unlock date to exactly N days before wedding
    // For day 30: wedding date - 30 days
    // For day 1: wedding date - 1 day
    unlockDate.setDate(unlockDate.getDate() - dayNumber);
    unlockDate.setHours(0, 0, 0, 0); // Set to start of day for consistent comparison
    
    reveals.push({
      id: `reveal-${dayNumber}`,
      day: dayNumber,
      ...revealData[i],
      unlockDate
    });
  }

  return reveals.sort((a, b) => b.day - a.day); // Sort by days remaining (descending)
};

const categoryIcons = {
  memory: Heart,
  preparation: Calendar,
  'love-note': Star,
  surprise: Gift,
  family: Heart,
  friends: Sparkles
};

const categoryColors = {
  memory: 'from-rose-500 to-pink-500',
  preparation: 'from-blue-500 to-indigo-500',
  'love-note': 'from-yellow-500 to-orange-500',
  surprise: 'from-purple-500 to-violet-500',
  family: 'from-green-500 to-emerald-500',
  friends: 'from-cyan-500 to-teal-500'
};

export function DailyReveals({ className }: { className?: string }) {
  const [reveals] = useState<DailyReveal[]>(generateDailyReveals());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedReveal, setSelectedReveal] = useState<DailyReveal | null>(null);

  // Update current date every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Check if a reveal is unlocked
  // A reveal unlocks when the current date is >= the unlock date (at start of day)
  const isUnlocked = (reveal: DailyReveal) => {
    const todayStart = new Date(currentDate);
    todayStart.setHours(0, 0, 0, 0);
    return todayStart >= reveal.unlockDate;
  };

  // Get days until unlock
  const getDaysUntilUnlock = (reveal: DailyReveal) => {
    const todayStart = new Date(currentDate);
    todayStart.setHours(0, 0, 0, 0);
    const diffTime = reveal.unlockDate.getTime() - todayStart.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Get unlocked reveals count
  const unlockedCount = reveals.filter(isUnlocked).length;
  const totalCount = reveals.length;

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <Badge variant="secondary" className="bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 border-rose-200">
            <Calendar className="w-4 h-4 mr-2" />
            Daily Love Reveals
          </Badge>
          <h2 className="text-3xl font-serif text-charcoal">
            Countdown to Forever
          </h2>
          <p className="text-sage-green max-w-2xl mx-auto">
            Every day leading up to our wedding, we're sharing a special memory, moment, or message. 
            Discover our love story one day at a time! 💕
          </p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-charcoal">{unlockedCount}</div>
            <div className="text-xs text-muted-foreground">Unlocked</div>
          </div>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-charcoal">{totalCount}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>
      </div>

      {/* Reveals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reveals.map((reveal, index) => {
          const unlocked = isUnlocked(reveal);
          const daysUntil = getDaysUntilUnlock(reveal);
          const CategoryIcon = categoryIcons[reveal.category];

          return (
            <motion.div
              key={reveal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: unlocked ? 1.02 : 1 }}
              whileTap={{ scale: unlocked ? 0.98 : 1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 overflow-hidden ${
                  unlocked 
                    ? 'hover:shadow-xl bg-white border-sage-green/20' 
                    : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                } ${reveal.isSpecial ? 'ring-2 ring-yellow-400/50' : ''}`}
                onClick={() => unlocked && setSelectedReveal(reveal)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    {/* Image */}
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      {unlocked ? (
                        <Image
                          src={reveal.image}
                          alt={reveal.title}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                          <Lock className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className={`bg-gradient-to-r ${categoryColors[reveal.category]} text-white border-0`}>
                          <CategoryIcon className="w-3 h-3 mr-1" />
                          {reveal.category.replace('-', ' ')}
                        </Badge>
                      </div>

                      {/* Special Badge */}
                      {reveal.isSpecial && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                            <Star className="w-3 h-3 mr-1" />
                            Special
                          </Badge>
                        </div>
                      )}

                      {/* Lock/Unlock Status */}
                      <div className="absolute bottom-3 right-3">
                        {unlocked ? (
                          <div className="bg-green-500 text-white p-2 rounded-full">
                            <Unlock className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="bg-gray-500 text-white p-2 rounded-full">
                            <Lock className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-muted-foreground">
                          Day {reveal.day} • {reveal.unlockDate.toLocaleDateString()}
                        </div>
                        {!unlocked && (
                          <div className="text-xs text-orange-600 font-medium">
                            {daysUntil === 0 ? 'Unlocks today!' : `${daysUntil} days to go`}
                          </div>
                        )}
                      </div>
                      
                      <h3 className={`font-serif text-lg mb-2 ${unlocked ? 'text-charcoal' : 'text-gray-500'}`}>
                        {unlocked ? reveal.title : '???'}
                      </h3>
                      
                      <p className={`text-sm ${unlocked ? 'text-sage-green' : 'text-gray-400'}`}>
                        {unlocked ? reveal.description : 'Unlock to reveal this special moment...'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Reveal Modal */}
      <AnimatePresence>
        {selectedReveal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setSelectedReveal(null)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="aspect-video relative">
                <Image
                  src={selectedReveal.image}
                  alt={selectedReveal.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 768px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                  onClick={() => setSelectedReveal(null)}
                >
                  ✕
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={`bg-gradient-to-r ${categoryColors[selectedReveal.category]} text-white border-0`}>
                    {React.createElement(categoryIcons[selectedReveal.category], { className: "w-3 h-3 mr-1" })}
                    {selectedReveal.category.replace('-', ' ')}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    Day {selectedReveal.day} • {selectedReveal.unlockDate.toLocaleDateString()}
                  </div>
                </div>

                <h2 className="text-2xl font-serif text-charcoal">
                  {selectedReveal.title}
                </h2>

                <p className="text-sage-green">
                  {selectedReveal.description}
                </p>

                <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-xl border border-rose-200">
                  <p className="text-charcoal italic leading-relaxed">
                    {selectedReveal.message}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
