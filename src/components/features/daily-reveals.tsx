'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Heart, Star, Gift, Sparkles, Lock, Unlock, Music, Video, HelpCircle, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { getWeddingDate, getDailyRevealUnlockDate } from '@/lib/wedding-date';
import { dailyRevealsConfig, type DailyRevealConfig, type RevealType } from '@/config/daily-reveals.config';

interface DailyReveal extends DailyRevealConfig {
  id: string;
  unlockDate: Date;
}

// Generate daily reveals from config
const generateDailyReveals = (): DailyReveal[] => {
  const reveals: DailyReveal[] = [];
  
  // Use reveals from config
  for (const reveal of dailyRevealsConfig.reveals) {
    const unlockDate = getDailyRevealUnlockDate(reveal.day);
    
    reveals.push({
      ...reveal,
      id: `reveal-${reveal.day}`,
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
  friends: Sparkles,
  question: HelpCircle,
  shayri: FileText,
  song: Music,
};

const categoryColors = {
  memory: 'from-rose-500 to-pink-500',
  preparation: 'from-blue-500 to-indigo-500',
  'love-note': 'from-yellow-500 to-orange-500',
  surprise: 'from-purple-500 to-violet-500',
  family: 'from-green-500 to-emerald-500',
  friends: 'from-cyan-500 to-teal-500',
  question: 'from-pink-500 to-rose-500',
  shayri: 'from-amber-500 to-orange-500',
  song: 'from-violet-500 to-purple-500',
};

const typeIcons: Record<RevealType, typeof Heart> = {
  photo: Heart,
  video: Video,
  song: Music,
  message: FileText,
  question: HelpCircle,
  shayri: FileText,
};

// Beautiful gradient backgrounds for different reveal types
const thumbnailGradients: Record<RevealType, string> = {
  photo: 'from-rose-100 via-pink-50 to-rose-100',
  video: 'from-blue-100 via-indigo-50 to-blue-100',
  song: 'from-purple-100 via-pink-50 to-purple-100',
  message: 'from-amber-100 via-yellow-50 to-amber-100',
  question: 'from-pink-100 via-rose-50 to-pink-100',
  shayri: 'from-orange-100 via-amber-50 to-orange-100',
};

// Romantic patterns/decorations for each type
const getThumbnailDecoration = (type: RevealType) => {
  const decorations = {
    message: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <Heart className="w-20 h-20 text-rose-300" fill="currentColor" />
          <Sparkles className="w-8 h-8 text-amber-400 absolute -top-2 -right-2" />
        </div>
      </div>
    ),
    question: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <HelpCircle className="w-20 h-20 text-pink-300" />
          <Heart className="w-6 h-6 text-rose-400 absolute -bottom-1 -right-1" fill="currentColor" />
        </div>
      </div>
    ),
    shayri: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <FileText className="w-20 h-20 text-amber-300" />
          <Sparkles className="w-8 h-8 text-orange-400 absolute top-0 right-0" />
          <Sparkles className="w-6 h-6 text-yellow-400 absolute bottom-2 left-2" />
        </div>
      </div>
    ),
    song: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <Music className="w-20 h-20 text-purple-300" />
          <Heart className="w-8 h-8 text-pink-400 absolute -top-2 -right-2 animate-pulse" fill="currentColor" />
        </div>
      </div>
    ),
    photo: null, // Photos have their own image
    video: null, // Videos have their own thumbnail
  };
  return decorations[type];
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
        <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full">
          <Calendar className="w-6 h-6 text-rose-500" />
          <span className="text-lg font-semibold text-rose-700">
            Daily Countdown Reveals
          </span>
        </div>
        
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Unlock a special message, memory, or surprise each day as we countdown to our wedding! 💕
        </p>

        {/* Progress */}
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-sage-green">
              {unlockedCount}
            </div>
            <div className="text-sm text-muted-foreground">Unlocked</div>
          </div>
          <div className="text-2xl text-muted-foreground">/</div>
          <div className="text-center">
            <div className="text-3xl font-bold text-muted-foreground">
              {totalCount}
            </div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </div>
      </div>

      {/* Reveals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reveals.map((reveal, index) => {
          const unlocked = isUnlocked(reveal);
          const daysUntil = getDaysUntilUnlock(reveal);
          const CategoryIcon = categoryIcons[reveal.category];
          const TypeIcon = typeIcons[reveal.type];

          return (
            <motion.div
              key={reveal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: unlocked ? 1.02 : 1 }}
              whileTap={{ scale: unlocked ? 0.98 : 1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 overflow-hidden h-full ${
                  unlocked 
                    ? 'hover:shadow-xl bg-white border-sage-green/20' 
                    : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                } ${reveal.isSpecial ? 'ring-2 ring-yellow-400/50' : ''}`}
                onClick={() => unlocked && setSelectedReveal(reveal)}
              >
                <CardContent className="p-0">
                  {/* Image/Thumbnail */}
                  <div className={`relative h-48 ${
                    unlocked && !reveal.image && !reveal.video 
                      ? `bg-gradient-to-br ${thumbnailGradients[reveal.type]}` 
                      : 'bg-gradient-to-br from-gray-100 to-gray-200'
                  }`}>
                    {unlocked ? (
                      // Has image or video
                      (reveal.image || reveal.video) ? (
                        <Image
                          src={reveal.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600'}
                          alt={reveal.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        // No image/video - show beautiful themed decoration
                        <>
                          {getThumbnailDecoration(reveal.type)}
                          {/* Floating elements */}
                          <div className="absolute top-4 left-4 opacity-20">
                            <Heart className="w-6 h-6 text-rose-400" fill="currentColor" />
                          </div>
                          <div className="absolute bottom-4 right-4 opacity-20">
                            <Heart className="w-8 h-8 text-pink-400" fill="currentColor" />
                          </div>
                          <div className="absolute top-1/3 right-8 opacity-10">
                            <Sparkles className="w-10 h-10 text-amber-400" />
                          </div>
                        </>
                      )
                    ) : (
                      // Locked state
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Type Badge */}
                    {unlocked && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                          <TypeIcon className="w-3 h-3 mr-1" />
                          {reveal.type}
                        </Badge>
                      </div>
                    )}
                    
                    {/* Day Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className={`bg-gradient-to-r ${categoryColors[reveal.category]} text-white`}>
                        Day {reveal.day}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-lg ${unlocked ? 'text-charcoal' : 'text-gray-400'}`}>
                          {unlocked ? reveal.title : '???'}
                        </h3>
                        <p className={`text-sm ${unlocked ? 'text-muted-foreground' : 'text-gray-400'}`}>
                          {unlocked ? reveal.description : 'Locked until unlock date'}
                        </p>
                      </div>
                      <CategoryIcon className={`w-5 h-5 flex-shrink-0 ml-2 ${unlocked ? 'text-sage-green' : 'text-gray-400'}`} />
                    </div>

                    {/* Unlock Status */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      {unlocked ? (
                        <>
                          <span className="text-sm text-sage-green flex items-center">
                            <Unlock className="w-4 h-4 mr-1" />
                            Unlocked
                          </span>
                          <Button size="sm" variant="outline" className="text-xs">
                            View
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Lock className="w-4 h-4 mr-1" />
                            {daysUntil === 0 ? 'Unlocks today' : `${daysUntil} days`}
                          </span>
                          <span className="text-xs text-gray-400">
                            {reveal.unlockDate.toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Modal for viewing reveal */}
      <AnimatePresence>
        {selectedReveal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedReveal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {/* Close button */}
                <button
                  onClick={() => setSelectedReveal(null)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Media Content */}
                {selectedReveal.type === 'photo' && selectedReveal.image && (
                  <div className="relative h-64 sm:h-96">
                    <Image
                      src={selectedReveal.image}
                      alt={selectedReveal.title}
                      fill
                      className="object-cover rounded-t-2xl"
                    />
                  </div>
                )}

                {selectedReveal.type === 'video' && selectedReveal.video && (
                  <div className="relative h-64 sm:h-96 bg-black rounded-t-2xl">
                    <video
                      src={selectedReveal.video}
                      controls
                      className="w-full h-full object-contain"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {selectedReveal.type === 'song' && selectedReveal.song && (
                  <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 p-8 rounded-t-2xl relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 opacity-10">
                      <Music className="w-32 h-32 text-purple-400" />
                    </div>
                    <div className="absolute bottom-4 left-4 opacity-10">
                      <Heart className="w-24 h-24 text-pink-400" fill="currentColor" />
                    </div>
                    
                    <div className="text-center space-y-4 relative z-10">
                      <div className="relative inline-block">
                        <Music className="w-16 h-16 text-purple-500 mx-auto" />
                        <Sparkles className="w-6 h-6 text-pink-400 absolute -top-1 -right-1 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-purple-900">{selectedReveal.song.title}</h3>
                        <p className="text-purple-600">by {selectedReveal.song.artist}</p>
                      </div>
                      {selectedReveal.song.reason && (
                        <p className="text-sm text-purple-700 italic max-w-md mx-auto">
                          "{selectedReveal.song.reason}"
                        </p>
                      )}
                      <a
                        href={selectedReveal.song.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
                      >
                        <Music className="w-5 h-5 mr-2" />
                        Listen Now
                      </a>
                    </div>
                  </div>
                )}

                {/* Beautiful header for message/question/shayri types */}
                {selectedReveal.type === 'message' && (
                  <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 p-12 rounded-t-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <Heart className="w-32 h-32 text-rose-400 absolute top-4 right-4" fill="currentColor" />
                      <Heart className="w-24 h-24 text-pink-400 absolute bottom-8 left-8" fill="currentColor" />
                      <Sparkles className="w-20 h-20 text-amber-400 absolute top-1/2 left-1/4" />
                    </div>
                    <div className="text-center relative z-10">
                      <div className="relative inline-block mb-4">
                        <Heart className="w-20 h-20 text-rose-400 mx-auto" fill="currentColor" />
                        <Sparkles className="w-8 h-8 text-amber-400 absolute -top-2 -right-2 animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}

                {selectedReveal.type === 'question' && (
                  <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 p-12 rounded-t-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <HelpCircle className="w-32 h-32 text-pink-400 absolute top-4 right-4" />
                      <Heart className="w-24 h-24 text-rose-400 absolute bottom-8 left-8" fill="currentColor" />
                    </div>
                    <div className="text-center relative z-10">
                      <div className="relative inline-block mb-4">
                        <HelpCircle className="w-20 h-20 text-pink-400 mx-auto" />
                        <Heart className="w-8 h-8 text-rose-400 absolute -bottom-1 -right-1 animate-pulse" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                )}

                {selectedReveal.type === 'shayri' && (
                  <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 p-12 rounded-t-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <FileText className="w-32 h-32 text-amber-400 absolute top-4 left-4" />
                      <Sparkles className="w-28 h-28 text-orange-400 absolute bottom-4 right-4" />
                      <Heart className="w-20 h-20 text-rose-400 absolute top-1/2 right-1/4" fill="currentColor" />
                    </div>
                    <div className="text-center relative z-10">
                      <div className="relative inline-block mb-4">
                        <FileText className="w-20 h-20 text-amber-400 mx-auto" />
                        <Sparkles className="w-8 h-8 text-orange-400 absolute top-0 right-0 animate-pulse" />
                        <Sparkles className="w-6 h-6 text-yellow-400 absolute bottom-2 left-2" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Text Content */}
                <div className="p-8 space-y-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={`bg-gradient-to-r ${categoryColors[selectedReveal.category]} text-white`}>
                        Day {selectedReveal.day}
                      </Badge>
                      <Badge variant="secondary">
                        {selectedReveal.type}
                      </Badge>
                    </div>
                    <h2 className="text-3xl font-bold text-charcoal mb-2">
                      {selectedReveal.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {selectedReveal.description}
                    </p>
                  </div>

                  {/* Question */}
                  {selectedReveal.type === 'question' && selectedReveal.question && (
                    <div className="bg-pink-50 border-l-4 border-pink-500 p-6 rounded-r-lg">
                      <div className="flex items-start space-x-3">
                        <HelpCircle className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-pink-900 mb-2">Question for You:</h4>
                          <p className="text-pink-800 text-lg italic">"{selectedReveal.question}"</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div className={`prose prose-lg max-w-none ${selectedReveal.type === 'shayri' ? 'text-center' : ''}`}>
                    <p className={`text-gray-700 leading-relaxed whitespace-pre-line ${selectedReveal.type === 'shayri' ? 'font-serif text-xl' : ''}`}>
                      {selectedReveal.message}
                    </p>
                  </div>

                  {/* Unlock Date */}
                  <div className="pt-4 border-t border-border text-center text-sm text-muted-foreground">
                    Unlocked on {selectedReveal.unlockDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
