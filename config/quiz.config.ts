/**
 * QUIZ CONFIGURATION
 * 
 * This file contains all quiz questions, answers, and results.
 * You can customize the Love Language Quiz or create your own custom quizzes.
 */

export type LoveLanguage = 'words' | 'acts' | 'gifts' | 'time' | 'touch';

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    loveLanguage: LoveLanguage;
    rating: number; // 1 = perfect match (highest), 5 = least match
  }[];
}

export interface LoveLanguageResult {
  type: LoveLanguage;
  name: string;
  description: string;
  color: string;
  tips: string[];
  compatibility: {
    [key in LoveLanguage]: number;
  };
}

export const quizConfig = {
  // ====================
  // QUIZ SETTINGS
  // ====================
  settings: {
    title: 'Love Language Quiz',
    subtitle: 'Discover your love language',
    description: 'Take this quiz to find out how you prefer to give and receive love.',
    showResults: true,
    allowRetake: true,
  },

  // ====================
  // QUIZ QUESTIONS
  // ====================
  // Customize these questions based on your preferences
  questions: [
    {
      id: 1,
      question: "What makes you feel most appreciated in a relationship?",
      options: [
        { 
          id: 'a', 
          text: "When my partner tells me they love me", 
          loveLanguage: 'words' as const, 
          rating: 2 
        },
        { 
          id: 'b', 
          text: "When my partner helps me with tasks", 
          loveLanguage: 'acts' as const, 
          rating: 4 
        },
        { 
          id: 'c', 
          text: "When my partner surprises me with gifts", 
          loveLanguage: 'gifts' as const, 
          rating: 3 
        },
        { 
          id: 'd', 
          text: "When my partner spends uninterrupted time with me", 
          loveLanguage: 'time' as const, 
          rating: 5 
        },
        { 
          id: 'e', 
          text: "When my partner gives me physical affection", 
          loveLanguage: 'touch' as const, 
          rating: 1 
        }
      ]
    },
    {
      id: 2,
      question: "How do you prefer to show love to your partner?",
      options: [
        { 
          id: 'a', 
          text: "By telling them how much they mean to me", 
          loveLanguage: 'words' as const, 
          rating: 1 
        },
        { 
          id: 'b', 
          text: "By doing things to make their life easier", 
          loveLanguage: 'acts' as const, 
          rating: 5 
        },
        { 
          id: 'c', 
          text: "By giving them thoughtful presents", 
          loveLanguage: 'gifts' as const, 
          rating: 4 
        },
        { 
          id: 'd', 
          text: "By planning special activities together", 
          loveLanguage: 'time' as const, 
          rating: 3 
        },
        { 
          id: 'e', 
          text: "By being physically affectionate", 
          loveLanguage: 'touch' as const, 
          rating: 2 
        }
      ]
    },
    {
      id: 3,
      question: "What would hurt your feelings the most?",
      options: [
        { 
          id: 'a', 
          text: "If my partner rarely said loving things to me", 
          loveLanguage: 'words' as const, 
          rating: 3 
        },
        { 
          id: 'b', 
          text: "If my partner never helped me when I needed it", 
          loveLanguage: 'acts' as const, 
          rating: 5 
        },
        { 
          id: 'c', 
          text: "If my partner forgot important occasions", 
          loveLanguage: 'gifts' as const, 
          rating: 4 
        },
        { 
          id: 'd', 
          text: "If my partner was always too busy for me", 
          loveLanguage: 'time' as const, 
          rating: 1 
        },
        { 
          id: 'e', 
          text: "If my partner avoided physical closeness", 
          loveLanguage: 'touch' as const, 
          rating: 2 
        }
      ]
    },
    {
      id: 4,
      question: "What's your ideal way to spend a romantic evening?",
      options: [
        { 
          id: 'a', 
          text: "Having deep, meaningful conversations", 
          loveLanguage: 'words' as const, 
          rating: 3 
        },
        { 
          id: 'b', 
          text: "Cooking dinner together", 
          loveLanguage: 'acts' as const, 
          rating: 1 
        },
        { 
          id: 'c', 
          text: "Exchanging small, meaningful gifts", 
          loveLanguage: 'gifts' as const, 
          rating: 4 
        },
        { 
          id: 'd', 
          text: "Doing an activity we both enjoy", 
          loveLanguage: 'time' as const, 
          rating: 5 
        },
        { 
          id: 'e', 
          text: "Cuddling while watching a movie", 
          loveLanguage: 'touch' as const, 
          rating: 2 
        }
      ]
    },
    {
      id: 5,
      question: "What makes you feel most connected to your partner?",
      options: [
        { 
          id: 'a', 
          text: "When they express their feelings openly", 
          loveLanguage: 'words' as const, 
          rating: 2 
        },
        { 
          id: 'b', 
          text: "When they anticipate my needs", 
          loveLanguage: 'acts' as const, 
          rating: 3 
        },
        { 
          id: 'c', 
          text: "When they remember what I like", 
          loveLanguage: 'gifts' as const, 
          rating: 4 
        },
        { 
          id: 'd', 
          text: "When we share experiences together", 
          loveLanguage: 'time' as const, 
          rating: 5 
        },
        { 
          id: 'e', 
          text: "When we're physically close", 
          loveLanguage: 'touch' as const, 
          rating: 1 
        }
      ]
    }
  ] as QuizQuestion[],

  // ====================
  // QUIZ RESULTS
  // ====================
  // These are the possible results based on the love language types
  results: {
    words: {
      type: 'words' as const,
      name: 'Words of Affirmation',
      description: 'You feel most loved when your partner expresses their feelings through spoken or written words.',
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
      type: 'acts' as const,
      name: 'Acts of Service',
      description: 'You feel most loved when your partner does thoughtful things to help and support you.',
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
      type: 'gifts' as const,
      name: 'Receiving Gifts',
      description: 'You feel most loved when your partner gives you thoughtful gifts that show they were thinking of you.',
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
      type: 'time' as const,
      name: 'Quality Time',
      description: 'You feel most loved when your partner gives you their undivided attention and spends meaningful time together.',
      color: 'bg-amber-100 border-amber-300 text-amber-700',
      tips: [
        'Schedule regular date nights',
        'Put away distractions when together',
        'Plan activities you both enjoy',
        'Create rituals and traditions together'
      ],
      compatibility: {
        words: 90,
        acts: 95,
        time: 100,
        gifts: 80,
        touch: 85
      }
    },
    touch: {
      type: 'touch' as const,
      name: 'Physical Touch',
      description: 'You feel most loved through physical affection, closeness, and touch from your partner.',
      color: 'bg-rose-100 border-rose-300 text-rose-700',
      tips: [
        'Hold hands when walking together',
        'Give spontaneous hugs and kisses',
        'Cuddle while watching movies',
        'Be physically affectionate in public'
      ],
      compatibility: {
        words: 80,
        acts: 75,
        time: 85,
        gifts: 85,
        touch: 100
      }
    }
  } as Record<LoveLanguage, LoveLanguageResult>,
} as const;

// Export types
export type QuizConfig = typeof quizConfig;
export type QuizQuestions = typeof quizConfig.questions;
export type QuizResults = typeof quizConfig.results;

