'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Check, MessageSquare, Palette, Eye, Rocket, Clock, Upload, Settings, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                LoveStory Sites
              </span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              How It Works
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              From idea to launch in just a few simple steps. We handle all the technical work so you can focus on creating something special.
            </p>

            <div className="inline-flex items-center gap-4 px-6 py-3 bg-rose-50 border-2 border-rose-200 rounded-lg">
              <Clock className="h-5 w-5 text-rose-600" />
              <span className="text-rose-800 font-medium">
                Average turnaround: 3-5 days • Rush available: 48 hours
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Process Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
              >
                {/* Step Number & Icon */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-2xl">
                      <step.icon className="h-16 w-16 text-white" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white border-4 border-rose-500 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-rose-600">{step.number}</span>
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <Badge className="mb-4 bg-rose-100 text-rose-700 border-rose-200">
                    {step.duration}
                  </Badge>
                  <h2 className="text-4xl font-bold mb-4 text-gray-900">
                    {step.title}
                  </h2>
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <Card className="border-2 border-rose-200 bg-white/50">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-4 text-gray-900">What you need to do:</h3>
                      <ul className="space-y-3">
                        {step.actions.map((action, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Visual */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Your Timeline to Launch
            </h2>
            <p className="text-xl text-gray-600">
              See exactly what happens when from start to finish
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-rose-400 to-pink-400 hidden md:block" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <Card className="border-2 border-pink-200 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="text-sm font-bold text-rose-600 mb-2">{item.time}</div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg z-10 border-4 border-white">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Handle */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              What We Handle For You
            </h2>
            <p className="text-xl text-gray-600">
              Sit back and relax while we take care of everything technical
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {weHandle.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-pink-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Quick Hits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Quick Questions
            </h2>
            <p className="text-xl text-gray-600">
              Common questions about our process
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {quickFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-pink-100">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-3 text-gray-900">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">Have more questions?</p>
            <Button variant="outline" size="lg" asChild>
              <Link href="/pricing#contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Choose your theme and let's create something unforgettable
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg" asChild>
                <Link href="/#themes">
                  Explore Themes
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg border-2 border-white text-white hover:bg-white/10" asChild>
                <Link href="/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const steps = [
  {
    number: '1',
    title: 'Choose Your Theme',
    icon: Palette,
    duration: '5-10 minutes',
    description: 'Browse our three beautiful themes and pick the one that resonates with your relationship style. Each theme can be fully customized to match your preferences.',
    actions: [
      'Explore all three demo websites',
      'Consider your partner\'s personality and style',
      'Select your favorite theme',
      'Choose your package (Basic, Premium, or Ultimate)',
    ],
  },
  {
    number: '2',
    title: 'Share Your Story',
    icon: Upload,
    duration: '1-2 hours',
    description: 'Fill out our simple questionnaire and upload your photos. We\'ll guide you through what we need to create your perfect website.',
    actions: [
      'Complete our content questionnaire',
      'Upload your favorite couple photos (20-50 depending on package)',
      'Write your love story milestones and dates',
      'Share any special messages or love letters',
      'Provide your favorite songs (if using music feature)',
    ],
  },
  {
    number: '3',
    title: 'We Build Your Site',
    icon: Settings,
    duration: '2-7 days',
    description: 'Our team customizes your chosen theme with your content, ensuring every detail is perfect. We\'ll send you preview links to review.',
    actions: [
      'Wait for our team to build your site (we do all the work!)',
      'Check your email for preview link',
      'Review the website on mobile and desktop',
      'Request any changes or adjustments',
    ],
  },
  {
    number: '4',
    title: 'Launch & Celebrate',
    icon: Rocket,
    duration: 'Instant',
    description: 'Once you approve everything, your site goes live! We\'ll provide you with a beautiful link to share with your valentine.',
    actions: [
      'Final approval of your website',
      'Receive your website link',
      'Share with your valentine on the special day',
      'Watch their reaction and enjoy! 🎉',
    ],
  },
];

const timeline = [
  {
    time: 'Day 0',
    title: 'Order Placed',
    description: 'You choose your theme and package, complete payment',
    icon: Check,
  },
  {
    time: 'Day 1',
    title: 'Content Collection',
    description: 'We send you the questionnaire and you upload your content',
    icon: Upload,
  },
  {
    time: 'Day 2-3',
    title: 'Design & Development',
    description: 'Our team builds your custom website',
    icon: Settings,
  },
  {
    time: 'Day 4',
    title: 'Preview Ready',
    description: 'You receive preview link for review',
    icon: Eye,
  },
  {
    time: 'Day 5',
    title: 'Revisions',
    description: 'We make any requested changes',
    icon: Star,
  },
  {
    time: 'Day 6',
    title: 'Launch!',
    description: 'Your website goes live and you receive the link',
    icon: Rocket,
  },
];

const weHandle = [
  {
    icon: Settings,
    title: 'Technical Setup',
    description: 'All the coding, hosting, and technical configuration',
  },
  {
    icon: Palette,
    title: 'Design Customization',
    description: 'Adapting the theme to your style and preferences',
  },
  {
    icon: Upload,
    title: 'Content Integration',
    description: 'Uploading and organizing all your photos and text',
  },
  {
    icon: Eye,
    title: 'Quality Assurance',
    description: 'Testing on all devices and browsers',
  },
  {
    icon: Settings,
    title: 'Performance Optimization',
    description: 'Ensuring fast load times and smooth animations',
  },
  {
    icon: Star,
    title: 'Final Polish',
    description: 'Adding those special touches that make it perfect',
  },
];

const quickFaqs = [
  {
    question: 'Do I need any technical skills?',
    answer: 'Not at all! Just provide your content and we handle everything else.',
  },
  {
    question: 'Can I make changes after launch?',
    answer: 'Yes! Premium and Ultimate packages include revision rounds.',
  },
  {
    question: 'What if I need it faster?',
    answer: 'We offer 48-hour rush delivery for an additional $50.',
  },
  {
    question: 'Can I see examples first?',
    answer: 'Yes! Click on any theme to see a full interactive demo.',
  },
  {
    question: 'What if my partner doesn\'t like it?',
    answer: 'We offer revisions! Premium and Ultimate packages include multiple rounds.',
  },
  {
    question: 'How do I share the website?',
    answer: 'We provide you with a link you can share via text, email, or social media.',
  },
];

