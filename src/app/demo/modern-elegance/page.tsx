'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Calendar, Camera, Map, Coffee, Sparkles, Video, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { modernEleganceTheme } from '@/config/themes/modern-elegance.config';

export default function ModernElegancePage() {
  const { demoContent, colors } = modernEleganceTheme;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Demo Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Badge className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 border-pink-300">
            <Sparkles className="h-3 w-3 mr-1" />
            Demo Mode - Modern Elegance Theme
          </Badge>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="border-pink-300" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Selection
              </Link>
            </Button>
            <Button 
              size="sm" 
              style={{ background: colors.gradient }}
              className="text-white hover:opacity-90"
              asChild
            >
              <Link href="/pricing?theme=modern">
                Choose This Theme
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section - Full Screen */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden" 
        style={{ background: colors.gradient }}
      >
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <p className="text-2xl mb-4 font-light tracking-wide opacity-90">
              {demoContent.hero.greeting}
            </p>
            
            <h1 className="text-7xl md:text-9xl font-bold mb-8"
              style={{ fontFamily: modernEleganceTheme.typography.heading }}
            >
              {demoContent.couple.name1}
              <span className="mx-6 text-white/80">&</span>
              {demoContent.couple.name2}
            </h1>
            
            <p className="text-2xl md:text-3xl mb-12 font-light"
              style={{ fontFamily: modernEleganceTheme.typography.accent }}
            >
              {demoContent.couple.tagline}
            </p>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                <Heart className="h-5 w-5 fill-white" />
                <span>Scroll to explore our story</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold mb-4"
              style={{ fontFamily: modernEleganceTheme.typography.heading }}
            >
              Our Love in Numbers
            </h2>
            <p className="text-xl text-gray-600">Every moment counted, every memory cherished</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {demoContent.stats.map((stat, index) => {
              const Icon = { calendar: Calendar, camera: Camera, map: Map, coffee: Coffee }[stat.icon as keyof typeof icons] || Heart;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0"
                    style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)` }}
                  >
                    <CardContent className="p-8">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
                        style={{ background: colors.gradient }}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline - Horizontal Scroll */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4"
              style={{ fontFamily: modernEleganceTheme.typography.heading }}
            >
              Our Journey Together
            </h2>
            <p className="text-xl text-gray-600">Swipe to explore our story</p>
          </motion.div>

          <div className="overflow-x-auto pb-8 hide-scrollbar">
            <div className="flex gap-6 min-w-max px-4">
              {demoContent.timeline.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="w-80 flex-shrink-0"
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    {/* Card Header with Gradient */}
                    <div className="h-32 relative overflow-hidden"
                      style={{ background: colors.gradient }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Heart className="h-16 w-16 text-white/30 fill-white/30" />
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold mb-3"
                        style={{ fontFamily: modernEleganceTheme.typography.heading }}
                      >
                        {event.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Message Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className="h-2" style={{ background: colors.gradient }} />
              <CardContent className="p-12">
                <div className="text-center mb-8">
                  <Heart className="h-12 w-12 mx-auto mb-4" style={{ color: colors.primary }} />
                  <h2 className="text-4xl font-bold mb-4"
                    style={{ fontFamily: modernEleganceTheme.typography.heading }}
                  >
                    A Message for You
                  </h2>
                </div>

                <div className="prose prose-lg max-w-none">
                  {demoContent.message.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-6 text-lg leading-relaxed text-gray-700"
                      style={{ 
                        fontFamily: modernEleganceTheme.typography.body,
                        textAlign: paragraph.includes('Ryan') || paragraph.includes('Sophia') ? 'right' : 'left',
                        fontWeight: paragraph.includes('Ryan') || paragraph.includes('Sophia') ? '500' : '400'
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

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4"
              style={{ fontFamily: modernEleganceTheme.typography.heading }}
            >
              Packed with Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for a modern love story
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {modernEleganceTheme.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full border-0 hover:shadow-lg transition-all duration-300 group"
                  style={{ background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ background: colors.gradient }}
                    >
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {feature}
                    </h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6"
              style={{ fontFamily: modernEleganceTheme.typography.heading }}
            >
              Ready to Go Modern?
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Create your own modern elegance website with clean design and smooth animations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg text-white hover:opacity-90"
                style={{ background: colors.gradient }}
                asChild
              >
                <Link href="/pricing?theme=modern">
                  Get Started with Modern Elegance
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg border-pink-300"
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

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

const icons = { calendar: Calendar, camera: Camera, map: Map, coffee: Coffee };

