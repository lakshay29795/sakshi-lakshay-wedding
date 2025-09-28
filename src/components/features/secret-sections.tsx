'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Eye, EyeOff, Heart, Star, Camera, MapPin, Clock, Gift } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { useEasterEgg } from './easter-eggs';

interface SecretSection {
  id: string;
  title: string;
  description: string;
  password: string;
  hint: string;
  category: 'proposal' | 'memories' | 'family' | 'surprise';
  content: {
    story: string;
    images: string[];
    timeline?: {
      time: string;
      event: string;
      details: string;
    }[];
    specialMessage?: string;
  };
  unlocked: boolean;
}

const secretSections: SecretSection[] = [
  {
    id: 'proposal-story',
    title: 'The Proposal Story',
    description: 'The complete, unfiltered story of how Lakshay proposed to Sakshi',
    password: 'forever',
    hint: 'What we promised to love each other for...',
    category: 'proposal',
    content: {
      story: `It was a crisp autumn evening in October, and I had been planning this moment for months. I told Sakshi we were going to our favorite restaurant for dinner, but little did she know, I had something much more special planned.

I had secretly coordinated with her best friend Maya to get her to the park where we had our first official date. The same bench where we sat and talked for hours, where I first knew I was falling in love with her.

I was so nervous that I almost forgot the ring at home! Thank goodness for my best man who reminded me to check my pocket one more time. My hands were shaking so much that I could barely hold the ring box.

When Sakshi arrived and saw the setup - fairy lights strung between the trees, rose petals scattered around our bench, and our song playing softly from a hidden speaker - she immediately started crying. She knew what was happening before I even got down on one knee.

I had practiced my speech a hundred times, but when I looked into her eyes, all those rehearsed words flew out of my head. Instead, I just spoke from my heart about how she makes every day brighter, how she's my best friend and my greatest love, and how I want to spend the rest of my life making her as happy as she makes me.

When I finally asked "Will you marry me?", she was crying so hard she could barely speak. But her "YES!" was the most beautiful sound I've ever heard. We both cried, we laughed, we kissed, and in that moment, everything was perfect.

The ring fit perfectly (thanks to Maya for secretly finding out her size), and as we sat on our bench holding each other, I knew that this was just the beginning of our greatest adventure together.`,
      images: [
        '/images/secret/proposal-setup.jpg',
        '/images/secret/the-moment.jpg',
        '/images/secret/ring-closeup.jpg',
        '/images/secret/celebration.jpg'
      ],
      timeline: [
        {
          time: '6:00 PM',
          event: 'Final preparations',
          details: 'Setting up fairy lights and rose petals with help from friends'
        },
        {
          time: '6:30 PM',
          event: 'Sakshi arrives',
          details: 'Maya brings Sakshi to the park under the pretense of meeting for coffee'
        },
        {
          time: '6:45 PM',
          event: 'The proposal',
          details: 'Down on one knee, heart pounding, asking the most important question of my life'
        },
        {
          time: '7:00 PM',
          event: 'She said YES!',
          details: 'Tears, laughter, and the most perfect kiss'
        },
        {
          time: '7:30 PM',
          event: 'Celebration',
          details: 'Friends and family surprise us with champagne and congratulations'
        }
      ],
      specialMessage: 'This moment changed our lives forever. From that day forward, we weren\'t just boyfriend and girlfriend - we were partners, teammates, and best friends planning a lifetime together. Every day since has been a step toward our wedding day, and I fall in love with you more with each passing moment. 💕'
    },
    unlocked: false
  },
  {
    id: 'family-secrets',
    title: 'Family Blessing Stories',
    description: 'How we got our families\' blessings and their reactions',
    password: 'blessing',
    hint: 'What we asked our families for...',
    category: 'family',
    content: {
      story: `Getting our families' blessings was almost as nerve-wracking as the proposal itself! 

**Asking Sakshi's Parents:**
I was terrified to ask Sakshi's dad for his blessing. I had planned this whole formal speech, but when I sat down with him, he just smiled and said, "I've been waiting for you to ask. You make our daughter so happy, and that's all we could ever want for her." Her mom immediately started crying happy tears and hugged me so tight I could barely breathe!

**Telling My Parents:**
My parents had been dropping hints about marriage for months, so when I told them I was going to propose, my mom literally jumped up and down. Dad just nodded approvingly and said, "About time, son. She's perfect for you." Then mom immediately started planning the engagement party!

**The Grandparents:**
Sakshi's grandmother pulled me aside at a family dinner and whispered, "When are you going to make an honest woman out of my granddaughter?" I nearly choked on my food! Turns out, the whole family had been waiting for this moment.

**The Siblings:**
Sakshi's sister Maya was my secret accomplice in the proposal planning. My brother kept asking if he could be the best man before I had even proposed! The siblings were definitely the most excited of everyone.`,
      images: [
        '/images/secret/family-blessing.jpg',
        '/images/secret/parents-reaction.jpg',
        '/images/secret/grandparents.jpg',
        '/images/secret/siblings-celebration.jpg'
      ],
      specialMessage: 'Having our families\' love and support means everything to us. We\'re not just marrying each other - we\'re joining two wonderful families into one big, loving unit. 👨‍👩‍👧‍👦💕'
    },
    unlocked: false
  },
  {
    id: 'surprise-moments',
    title: 'Surprise Planning Secrets',
    description: 'All the secret surprises we\'ve planned for each other',
    password: 'surprise',
    hint: 'What we love to give each other...',
    category: 'surprise',
    content: {
      story: `We love surprising each other! Here are some of our favorite secret moments:

**Lakshay's Surprises for Sakshi:**
- Secretly learned to cook her favorite Indian dish (and burned it three times before getting it right!)
- Planned a surprise weekend trip to the mountains for her birthday
- Arranged for her college friends to fly in for her bachelorette party
- Had a custom star map made of the night we first said "I love you"
- Secretly took dance lessons so I wouldn't embarrass her at our wedding

**Sakshi's Surprises for Lakshay:**
- Learned to play his favorite song on the guitar (still working on it!)
- Organized a surprise bachelor party with all his childhood friends
- Had his grandmother's wedding ring restored as a surprise wedding gift
- Planned a surprise proposal photoshoot recreation for our anniversary
- Secretly invited his best friend from college who lives overseas to the wedding

**Our Joint Surprises:**
- We're planning to surprise our wedding guests with a choreographed dance
- We've been secretly taking cooking classes together
- We're planning to announce our honeymoon destination as a surprise at the reception
- We've written secret vows that no one else has seen`,
      images: [
        '/images/secret/cooking-disaster.jpg',
        '/images/secret/dance-lessons.jpg',
        '/images/secret/surprise-trip.jpg',
        '/images/secret/secret-planning.jpg'
      ],
      specialMessage: 'The best part about surprises is seeing the joy on each other\'s faces. We promise to keep surprising each other for the rest of our lives! 🎁✨'
    },
    unlocked: false
  }
];

const categoryIcons = {
  proposal: Heart,
  memories: Camera,
  family: Star,
  surprise: Gift
};

const categoryColors = {
  proposal: 'from-rose-500 to-pink-500',
  memories: 'from-blue-500 to-indigo-500',
  family: 'from-green-500 to-emerald-500',
  surprise: 'from-purple-500 to-violet-500'
};

export function SecretSections({ className }: { className?: string }) {
  const [sections, setSections] = useState<SecretSection[]>(secretSections);
  const [selectedSection, setSelectedSection] = useState<SecretSection | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);
  const { triggerCustomEgg } = useEasterEgg();

  // Load unlocked sections from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wedding-secret-sections');
    if (saved) {
      const unlockedIds = JSON.parse(saved);
      setSections(prev => prev.map(section => ({
        ...section,
        unlocked: unlockedIds.includes(section.id)
      })));
    }
  }, []);

  // Save unlocked sections to localStorage
  const saveUnlockedSections = (unlockedIds: string[]) => {
    localStorage.setItem('wedding-secret-sections', JSON.stringify(unlockedIds));
  };

  const handlePasswordSubmit = (section: SecretSection) => {
    if (password.toLowerCase() === section.password.toLowerCase()) {
      // Unlock the section
      const updatedSections = sections.map(s => 
        s.id === section.id ? { ...s, unlocked: true } : s
      );
      setSections(updatedSections);
      
      // Save to localStorage
      const unlockedIds = updatedSections.filter(s => s.unlocked).map(s => s.id);
      saveUnlockedSections(unlockedIds);
      
      // Clear form
      setPassword('');
      setError('');
      setShowHint(false);
      
      // Show success and open section
      setSelectedSection({ ...section, unlocked: true });
      
      // Trigger Easter egg
      triggerCustomEgg(`🔓 Secret unlocked: ${section.title}!`, 'stars');
    } else {
      setError('Incorrect password. Try again!');
      setShowHint(true);
      
      // Clear error after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const unlockedCount = sections.filter(s => s.unlocked).length;
  const totalCount = sections.length;

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-200">
            <Lock className="w-4 h-4 mr-2" />
            Secret Sections
          </Badge>
          <h2 className="text-3xl font-serif text-charcoal">
            Hidden Love Stories
          </h2>
          <p className="text-sage-green max-w-2xl mx-auto">
            Some stories are too special to share with everyone. Enter the right password to unlock 
            our most intimate and personal moments. 🔐💕
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
              className="h-full bg-gradient-to-r from-purple-500 to-violet-500"
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

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => {
          const CategoryIcon = categoryIcons[section.category];

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer transition-all duration-300 overflow-hidden hover:shadow-xl bg-white border-purple-200/50"
                onClick={() => setSelectedSection(section)}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <Badge className={`bg-gradient-to-r ${categoryColors[section.category]} text-white border-0`}>
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        {section.category}
                      </Badge>
                      
                      <div className={`p-2 rounded-full ${section.unlocked ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {section.unlocked ? (
                          <Unlock className="w-4 h-4 text-green-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-serif text-charcoal">
                        {section.title}
                      </h3>
                      <p className="text-sage-green text-sm">
                        {section.description}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="pt-2 border-t border-gray-100">
                      {section.unlocked ? (
                        <div className="flex items-center text-green-600 text-sm">
                          <Unlock className="w-4 h-4 mr-2" />
                          Unlocked - Click to read
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Lock className="w-4 h-4 mr-2" />
                          Password required
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Section Modal */}
      <AnimatePresence>
        {selectedSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setSelectedSection(null)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedSection.unlocked ? (
                // Unlocked Content
                <div className="overflow-y-auto max-h-[90vh]">
                  {/* Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge className={`bg-gradient-to-r ${categoryColors[selectedSection.category]} text-white border-0`}>
                        {React.createElement(categoryIcons[selectedSection.category], { className: "w-3 h-3 mr-1" })}
                        {selectedSection.category}
                      </Badge>
                      <h2 className="text-2xl font-serif text-charcoal">
                        {selectedSection.title}
                      </h2>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedSection(null)}
                    >
                      ✕
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-8">
                    {/* Story */}
                    <div className="prose prose-lg max-w-none">
                      <div className="whitespace-pre-line text-charcoal leading-relaxed">
                        {selectedSection.content.story}
                      </div>
                    </div>

                    {/* Timeline */}
                    {selectedSection.content.timeline && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-serif text-charcoal">Timeline</h3>
                        <div className="space-y-3">
                          {selectedSection.content.timeline.map((item, index) => (
                            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                              <div className="flex-shrink-0">
                                <Clock className="w-5 h-5 text-purple-500" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-semibold text-charcoal">{item.time}</span>
                                  <span className="text-purple-600 font-medium">{item.event}</span>
                                </div>
                                <p className="text-sage-green text-sm">{item.details}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Special Message */}
                    {selectedSection.content.specialMessage && (
                      <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-xl border border-rose-200">
                        <div className="flex items-center mb-3">
                          <Heart className="w-5 h-5 text-rose-500 mr-2" />
                          <span className="font-semibold text-rose-700">Special Message</span>
                        </div>
                        <p className="text-charcoal italic leading-relaxed">
                          {selectedSection.content.specialMessage}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Password Form
                <div className="p-8 text-center space-y-6">
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <Lock className="w-8 h-8 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-serif text-charcoal">
                      {selectedSection.title}
                    </h2>
                    <p className="text-sage-green">
                      {selectedSection.description}
                    </p>
                  </div>

                  <div className="max-w-md mx-auto space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter password..."
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit(selectedSection)}
                          className="pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm"
                        >
                          {error}
                        </motion.p>
                      )}
                    </div>

                    <Button
                      onClick={() => handlePasswordSubmit(selectedSection)}
                      className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
                      disabled={!password.trim()}
                    >
                      <Unlock className="w-4 h-4 mr-2" />
                      Unlock Secret
                    </Button>

                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                      >
                        <p className="text-yellow-800 text-sm">
                          <strong>Hint:</strong> {selectedSection.hint}
                        </p>
                      </motion.div>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHint(!showHint)}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      {showHint ? 'Hide Hint' : 'Need a Hint?'}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
