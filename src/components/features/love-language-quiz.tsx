'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gift, MessageCircle, Users, HandHeart, RotateCcw, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    loveLanguage: LoveLanguage;
  }[];
}

type LoveLanguage = 'words' | 'acts' | 'gifts' | 'time' | 'touch';

interface LoveLanguageResult {
  type: LoveLanguage;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  tips: string[];
  compatibility: {
    [key in LoveLanguage]: number;
  };
}

const loveLanguageData: Record<LoveLanguage, LoveLanguageResult> = {
  words: {
    type: 'words',
    name: 'Words of Affirmation',
    description: 'You feel most loved when your partner expresses their feelings through spoken or written words.',
    icon: <MessageCircle className="w-6 h-6" />,
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    tips: [
      'Leave sweet notes for your partner',
      'Express appreciation verbally',
      'Send loving text messages',
      'Give genuine compliments daily'
    ],
    compatibility: {
      words: 100,
      acts: 85,
      time: 90,
      gifts: 75,
      touch: 80
    }
  },
  acts: {
    type: 'acts',
    name: 'Acts of Service',
    description: 'You feel most loved when your partner does thoughtful things to help and support you.',
    icon: <HandHeart className="w-6 h-6" />,
    color: 'bg-green-100 border-green-300 text-green-700',
    tips: [
      'Help with daily tasks',
      'Surprise them by doing their chores',
      'Cook their favorite meal',
      'Take care of things they dislike doing'
    ],
    compatibility: {
      words: 85,
      acts: 100,
      time: 95,
      gifts: 70,
      touch: 75
    }
  },
  gifts: {
    type: 'gifts',
    name: 'Receiving Gifts',
    description: 'You feel most loved when your partner gives you thoughtful gifts that show they were thinking of you.',
    icon: <Gift className="w-6 h-6" />,
    color: 'bg-purple-100 border-purple-300 text-purple-700',
    tips: [
      'Give meaningful, thoughtful gifts',
      'Remember special occasions',
      'Surprise with small tokens of love',
      'Focus on the thought behind the gift'
    ],
    compatibility: {
      words: 75,
      acts: 70,
      time: 80,
      gifts: 100,
      touch: 85
    }
  },
  time: {
    type: 'time',
    name: 'Quality Time',
    description: 'You feel most loved when your partner gives you their undivided attention and presence.',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    tips: [
      'Plan regular date nights',
      'Put away devices during conversations',
      'Create shared experiences',
      'Be fully present when together'
    ],
    compatibility: {
      words: 90,
      acts: 95,
      time: 100,
      gifts: 80,
      touch: 90
    }
  },
  touch: {
    type: 'touch',
    name: 'Physical Touch',
    description: 'You feel most loved through physical affection like hugs, kisses, and gentle touches.',
    icon: <Heart className="w-6 h-6" />,
    color: 'bg-rose-100 border-rose-300 text-rose-700',
    tips: [
      'Hold hands frequently',
      'Give warm hugs and kisses',
      'Offer gentle touches throughout the day',
      'Cuddle while watching movies'
    ],
    compatibility: {
      words: 80,
      acts: 75,
      time: 90,
      gifts: 85,
      touch: 100
    }
  }
};

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What makes you feel most appreciated in a relationship?",
    options: [
      { id: 'a', text: "When my partner tells me they love me", loveLanguage: 'words' },
      { id: 'b', text: "When my partner helps me with tasks", loveLanguage: 'acts' },
      { id: 'c', text: "When my partner surprises me with gifts", loveLanguage: 'gifts' },
      { id: 'd', text: "When my partner spends uninterrupted time with me", loveLanguage: 'time' },
      { id: 'e', text: "When my partner gives me physical affection", loveLanguage: 'touch' }
    ]
  },
  {
    id: 2,
    question: "How do you prefer to show love to your partner?",
    options: [
      { id: 'a', text: "By telling them how much they mean to me", loveLanguage: 'words' },
      { id: 'b', text: "By doing things to make their life easier", loveLanguage: 'acts' },
      { id: 'c', text: "By giving them thoughtful presents", loveLanguage: 'gifts' },
      { id: 'd', text: "By planning special activities together", loveLanguage: 'time' },
      { id: 'e', text: "By being physically affectionate", loveLanguage: 'touch' }
    ]
  },
  {
    id: 3,
    question: "What would hurt your feelings the most?",
    options: [
      { id: 'a', text: "If my partner rarely said loving things to me", loveLanguage: 'words' },
      { id: 'b', text: "If my partner never helped me when I needed it", loveLanguage: 'acts' },
      { id: 'c', text: "If my partner forgot important occasions", loveLanguage: 'gifts' },
      { id: 'd', text: "If my partner was always too busy for me", loveLanguage: 'time' },
      { id: 'e', text: "If my partner avoided physical closeness", loveLanguage: 'touch' }
    ]
  },
  {
    id: 4,
    question: "What's your ideal way to spend a romantic evening?",
    options: [
      { id: 'a', text: "Having deep, meaningful conversations", loveLanguage: 'words' },
      { id: 'b', text: "Cooking dinner together", loveLanguage: 'acts' },
      { id: 'c', text: "Exchanging small, meaningful gifts", loveLanguage: 'gifts' },
      { id: 'd', text: "Doing an activity we both enjoy", loveLanguage: 'time' },
      { id: 'e', text: "Cuddling while watching a movie", loveLanguage: 'touch' }
    ]
  },
  {
    id: 5,
    question: "What makes you feel most connected to your partner?",
    options: [
      { id: 'a', text: "When they express their feelings openly", loveLanguage: 'words' },
      { id: 'b', text: "When they anticipate my needs", loveLanguage: 'acts' },
      { id: 'c', text: "When they remember what I like", loveLanguage: 'gifts' },
      { id: 'd', text: "When we share experiences together", loveLanguage: 'time' },
      { id: 'e', text: "When we're physically close", loveLanguage: 'touch' }
    ]
  }
];

export function LoveLanguageQuiz({ className }: { className?: string }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, LoveLanguage>>({});
  const [result, setResult] = useState<LoveLanguageResult | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswer = useCallback((questionId: number, loveLanguage: LoveLanguage) => {
    const newAnswers = { ...answers, [questionId]: loveLanguage };
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate result
      const languageCounts: Record<LoveLanguage, number> = {
        words: 0,
        acts: 0,
        gifts: 0,
        time: 0,
        touch: 0
      };

      Object.values(newAnswers).forEach(language => {
        languageCounts[language]++;
      });

      const dominantLanguage = Object.entries(languageCounts).reduce((a, b) => 
        languageCounts[a[0] as LoveLanguage] > languageCounts[b[0] as LoveLanguage] ? a : b
      )[0] as LoveLanguage;

      setResult(loveLanguageData[dominantLanguage]);
      setIsCompleted(true);
    }
  }, [currentQuestion, answers]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setIsCompleted(false);
  }, []);

  const shareResult = useCallback(() => {
    if (result) {
      const text = `I just discovered my love language is ${result.name}! 💕 Take the quiz on Sakshi & Lakshay's wedding website.`;
      if (navigator.share) {
        navigator.share({
          title: 'My Love Language Result',
          text,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(text);
      }
    }
  }, [result]);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (isCompleted && result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('max-w-2xl mx-auto', className)}
      >
        <Card className="overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-blush-pink/20 to-sage-green/20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-4"
            >
              <div className={cn('w-16 h-16 rounded-full flex items-center justify-center', result.color)}>
                {result.icon}
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-serif text-charcoal">
              Your Love Language
            </CardTitle>
            <Badge variant="secondary" className={cn('text-lg px-4 py-2', result.color)}>
              {result.name}
            </Badge>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <p className="text-muted-foreground leading-relaxed">
                {result.description}
              </p>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="font-semibold text-charcoal mb-3">Tips for your partner:</h3>
              <ul className="space-y-2">
                {result.tips.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-start space-x-2"
                  >
                    <Heart className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Compatibility */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <h3 className="font-semibold text-charcoal mb-3">Compatibility with other love languages:</h3>
              <div className="space-y-2">
                {Object.entries(result.compatibility).map(([language, compatibility]) => (
                  <div key={language} className="flex items-center space-x-3">
                    <div className="w-20 text-xs text-muted-foreground capitalize">
                      {loveLanguageData[language as LoveLanguage].name.split(' ')[0]}
                    </div>
                    <div className="flex-1">
                      <Progress value={compatibility} className="h-2" />
                    </div>
                    <div className="w-8 text-xs text-muted-foreground">
                      {compatibility}%
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-3 pt-4"
            >
              <Button
                onClick={shareResult}
                variant="outline"
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Result
              </Button>
              <Button
                onClick={resetQuiz}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Take Again
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className={cn('max-w-2xl mx-auto', className)}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl font-serif text-charcoal">
              Love Language Quiz
            </CardTitle>
            <Badge variant="secondary">
              {currentQuestion + 1} of {quizQuestions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium text-charcoal mb-6">
                {quizQuestions[currentQuestion].question}
              </h3>

              <div className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleAnswer(quizQuestions[currentQuestion].id, option.loveLanguage)}
                    className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-sage-green hover:bg-sage-green/5 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-sage-green opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-muted-foreground">{option.text}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
