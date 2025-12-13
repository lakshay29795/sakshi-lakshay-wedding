'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Calendar, MapPin, Music, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { classicRomanceTheme } from '@/config/themes/classic-romance.config';

export default function ClassicRomancePage() {
  const { demoContent, colors } = classicRomanceTheme;

  return (
    <div className="min-h-screen" style={{ 
      background: `linear-gradient(to bottom, ${colors.background}, ${colors.backgroundAlt})`,
      color: colors.text,
    }}>
      {/* Demo Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b-2 border-rose-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Badge className="bg-rose-100 text-rose-700 border-rose-300">
            <Sparkles className="h-3 w-3 mr-1" />
            Demo Mode - Classic Romance Theme
          </Badge>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="border-rose-300" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Selection
              </Link>
            </Button>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600"
              asChild
            >
              <Link href="/pricing?theme=classic">
                Choose This Theme
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-rose-200 opacity-30 animate-pulse">
          <Heart className="h-32 w-32 fill-current" />
        </div>
        <div className="absolute bottom-10 right-10 text-red-200 opacity-30 animate-pulse delay-100">
          <Heart className="h-40 w-40 fill-current" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 
              className="text-7xl md:text-9xl mb-6 font-serif"
              style={{ fontFamily: classicRomanceTheme.typography.accent, color: colors.primary }}
            >
              {demoContent.hero.greeting}
            </h1>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <h2 className="text-4xl md:text-5xl font-serif" style={{ fontFamily: classicRomanceTheme.typography.heading }}>
                {demoContent.couple.name1}
              </h2>
              <Heart className="h-8 w-8 fill-rose-500 text-rose-500" />
              <h2 className="text-4xl md:text-5xl font-serif" style={{ fontFamily: classicRomanceTheme.typography.heading }}>
                {demoContent.couple.name2}
              </h2>
            </div>

            <p className="text-2xl mb-12" style={{ fontFamily: classicRomanceTheme.typography.accent, color: colors.accent }}>
              {demoContent.couple.tagline}
            </p>

            <p className="text-xl mb-8 italic" style={{ color: colors.textLight }}>
              {demoContent.hero.message}
            </p>

            {/* Countdown */}
            <div className="inline-block px-8 py-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-xl border-2" style={{ borderColor: colors.accent }}>
              <div className="text-sm uppercase tracking-widest mb-2" style={{ color: colors.textLight }}>
                Counting down to
              </div>
              <div className="text-4xl font-bold" style={{ color: colors.primary }}>
                Valentine's Day 2025
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-serif mb-4" style={{ fontFamily: classicRomanceTheme.typography.heading, color: colors.primary }}>
              Our Love Story
            </h2>
            <p className="text-xl" style={{ color: colors.textLight }}>
              Every moment, a cherished memory
            </p>
          </motion.div>

          <div className="space-y-12">
            {demoContent.timeline.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-2 hover:shadow-2xl transition-all duration-300 overflow-hidden" style={{ borderColor: colors.accent }}>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center shadow-lg" 
                        style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                      >
                        <Heart className="h-8 w-8 text-white fill-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Calendar className="h-5 w-5" style={{ color: colors.accent }} />
                          <span className="text-sm font-medium" style={{ color: colors.textLight }}>
                            {new Date(event.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        <h3 className="text-2xl font-serif mb-3" style={{ fontFamily: classicRomanceTheme.typography.heading, color: colors.text }}>
                          {event.title}
                        </h3>
                        <p className="text-lg" style={{ color: colors.textLight }}>
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Love Letter Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-4 shadow-2xl relative overflow-hidden" style={{ borderColor: colors.accent }}>
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 rounded-tl-lg" style={{ borderColor: colors.primary, opacity: 0.3 }} />
              <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 rounded-tr-lg" style={{ borderColor: colors.primary, opacity: 0.3 }} />
              <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 rounded-bl-lg" style={{ borderColor: colors.primary, opacity: 0.3 }} />
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 rounded-br-lg" style={{ borderColor: colors.primary, opacity: 0.3 }} />

              <CardContent className="p-12 bg-gradient-to-br from-white/90 to-rose-50/90">
                <div className="text-center mb-8">
                  <h2 className="text-5xl mb-4" style={{ fontFamily: classicRomanceTheme.typography.accent, color: colors.primary }}>
                    A Love Letter
                  </h2>
                  <Heart className="h-8 w-8 mx-auto fill-rose-500 text-rose-500" />
                </div>

                <div className="prose prose-lg max-w-none">
                  {demoContent.loveLetter.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-6 text-lg leading-relaxed" 
                      style={{ 
                        fontFamily: classicRomanceTheme.typography.body,
                        color: colors.text,
                        textAlign: paragraph.includes('Alexander') || paragraph.includes('Isabella') ? 'right' : 'left',
                        fontStyle: paragraph.includes('Alexander') || paragraph.includes('Isabella') ? 'italic' : 'normal'
                      }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif mb-4" style={{ fontFamily: classicRomanceTheme.typography.heading, color: colors.primary }}>
              Additional Features
            </h2>
            <p className="text-xl" style={{ color: colors.textLight }}>
              Everything you need for the perfect romantic gift
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classicRomanceTheme.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ borderColor: colors.secondary }}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                    >
                      <Heart className="h-8 w-8 text-white fill-white" />
                    </div>
                    <h3 className="font-serif text-lg mb-2" style={{ fontFamily: classicRomanceTheme.typography.heading, color: colors.text }}>
                      {feature}
                    </h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-serif mb-6" style={{ fontFamily: classicRomanceTheme.typography.heading, color: colors.primary }}>
              Love This Theme?
            </h2>
            <p className="text-xl mb-10" style={{ color: colors.textLight }}>
              Create your own classic romance website and make this Valentine's Day unforgettable
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
                asChild
              >
                <Link href="/pricing?theme=classic">
                  Get Started with Classic Romance
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg"
                style={{ borderColor: colors.primary, color: colors.primary }}
                asChild
              >
                <Link href="/">
                  View Other Themes
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

