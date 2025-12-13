'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles, Gift, SmileIcon as Smile, Pizza, Star, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { playfulLoveTheme } from '@/config/themes/playful-love.config';

export default function PlayfulLovePage() {
  const { demoContent, colors } = playfulLoveTheme;

  return (
    <div className="min-h-screen" 
      style={{ 
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.backgroundAlt} 100%)`,
        color: colors.text 
      }}
    >
      {/* Demo Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b-4 border-yellow-300 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Badge className="bg-gradient-to-r from-yellow-200 to-orange-200 text-orange-700 border-yellow-400 text-sm font-bold">
            <Sparkles className="h-3 w-3 mr-1" />
            🎉 Demo Mode - Playful Love Theme 🎈
          </Badge>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="border-orange-300 border-2" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Selection
              </Link>
            </Button>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 hover:from-yellow-500 hover:via-orange-500 hover:to-pink-500 text-white font-bold"
              asChild
            >
              <Link href="/pricing?theme=playful">
                Pick This One! 🎯
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Confetti background */}
        <div className="absolute inset-0 overflow-hidden">
          {colors.rainbow.map((color, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
              animate={{
                y: [-100, window.innerHeight + 100],
                x: [Math.random() * 100, Math.random() * 100],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 3 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              initial={{
                left: `${Math.random() * 100}%`,
                top: -20,
              }}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: "spring", duration: 1 }}
          >
            <div className="text-6xl mb-6">💕</div>
            
            <h1 
              className="text-7xl md:text-9xl mb-6 font-black"
              style={{ 
                fontFamily: playfulLoveTheme.typography.heading,
                color: colors.primary,
                textShadow: `4px 4px 0 ${colors.secondary}`
              }}
            >
              {demoContent.hero.greeting}
            </h1>
            
            <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="text-5xl font-bold bg-white px-8 py-4 rounded-2xl shadow-lg border-4 border-orange-400 transform -rotate-2"
              >
                {demoContent.couple.name1}
              </motion.div>
              
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="h-12 w-12 fill-red-500 text-red-500" />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="text-5xl font-bold bg-white px-8 py-4 rounded-2xl shadow-lg border-4 border-pink-400 transform rotate-2"
              >
                {demoContent.couple.name2}
              </motion.div>
            </div>

            <motion.p 
              className="text-3xl mb-12 font-bold"
              style={{ fontFamily: playfulLoveTheme.typography.accent }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {demoContent.couple.tagline}
            </motion.p>

            <p className="text-2xl mb-8 leading-relaxed">
              {demoContent.hero.message}
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="inline-block px-8 py-6 rounded-3xl bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 text-white text-3xl font-bold shadow-2xl border-4 border-white transform rotate-1">
                Valentine's Day 2025! 🎉
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section - Comic Style */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 
              className="text-6xl mb-6 font-black"
              style={{ 
                fontFamily: playfulLoveTheme.typography.heading,
                color: colors.primary 
              }}
            >
              Our Super Fun Love Story! 📖✨
            </h2>
            <p className="text-2xl font-bold" style={{ color: colors.secondary }}>
              The epic tale of two goofballs falling in love!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {demoContent.timeline.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, rotate: index % 2 === 0 ? -5 : 5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
              >
                <Card 
                  className="border-4 shadow-2xl h-full overflow-hidden"
                  style={{ 
                    borderColor: colors.rainbow[index % colors.rainbow.length],
                    transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)`
                  }}
                >
                  <div 
                    className="h-20 flex items-center justify-center text-6xl"
                    style={{ backgroundColor: `${colors.rainbow[index % colors.rainbow.length]}30` }}
                  >
                    {event.emoji}
                  </div>
                  <CardContent className="p-6 bg-white">
                    <div className="text-sm font-bold mb-2 inline-block px-3 py-1 rounded-full bg-yellow-200 border-2 border-yellow-400">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                    <h3 
                      className="text-3xl mb-4 font-black"
                      style={{ fontFamily: playfulLoveTheme.typography.heading }}
                    >
                      {event.title}
                    </h3>
                    <p className="text-lg leading-relaxed">
                      {event.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inside Jokes */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 
              className="text-6xl mb-4 font-black"
              style={{ fontFamily: playfulLoveTheme.typography.heading }}
            >
              Our Inside Jokes 😂🤣
            </h2>
            <p className="text-xl font-bold">
              You had to be there... or did you? 🤔
            </p>
          </motion.div>

          <div className="space-y-6">
            {demoContent.insideJokes.map((joke, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-4 border-purple-400 bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0">🤪</div>
                      <div>
                        <h3 className="text-2xl font-black mb-2" style={{ fontFamily: playfulLoveTheme.typography.heading }}>
                          {joke.joke}
                        </h3>
                        <p className="text-lg">
                          {joke.explanation}
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

      {/* Bucket List */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 
              className="text-6xl mb-4 font-black"
              style={{ 
                fontFamily: playfulLoveTheme.typography.heading,
                color: colors.primary 
              }}
            >
              Our Bucket List 🪣✨
            </h2>
            <p className="text-xl font-bold" style={{ color: colors.secondary }}>
              Things we wanna do together!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {demoContent.bucketList.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className={`border-3 shadow-lg ${item.completed ? 'bg-green-50 border-green-400' : 'bg-white border-gray-300'}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.completed ? 'bg-green-400' : 'bg-gray-200'
                    }`}>
                      {item.completed ? (
                        <Check className="h-6 w-6 text-white" />
                      ) : (
                        <X className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <span className={`text-lg font-bold ${item.completed ? 'line-through text-gray-500' : ''}`}>
                      {item.item}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Message Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring" }}
          >
            <Card className="border-8 border-rainbow shadow-2xl overflow-hidden transform rotate-1"
              style={{ borderColor: colors.primary }}
            >
              <div className="h-4 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400" />
              <CardContent className="p-12 bg-white">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">💌</div>
                  <h2 
                    className="text-5xl mb-4 font-black"
                    style={{ fontFamily: playfulLoveTheme.typography.heading, color: colors.primary }}
                  >
                    A Message for My Favorite Weirdo
                  </h2>
                </div>

                <div className="space-y-6">
                  {demoContent.message.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-lg leading-relaxed"
                      style={{ 
                        fontFamily: playfulLoveTheme.typography.body,
                        textAlign: paragraph.includes('Jake') || paragraph.includes('P.S.') ? 'right' : 'left',
                        fontWeight: paragraph.includes('Jake') || paragraph.includes('P.S.') ? 'bold' : 'normal'
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

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="text-6xl mb-4 font-black"
              style={{ fontFamily: playfulLoveTheme.typography.heading, color: colors.primary }}
            >
              Cool Stuff Included! 🎪
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {playfulLoveTheme.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, rotate: index % 2 === 0 ? -10 : 10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: index * 0.05 }}
                whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? 5 : -5 }}
              >
                <Card 
                  className="border-4 shadow-lg"
                  style={{ borderColor: colors.rainbow[index % colors.rainbow.length] }}
                >
                  <CardContent className="p-6 text-center bg-white">
                    <div className="text-4xl mb-3">
                      {['🎨', '📸', '🎮', '🎵', '😂', '🎯', '🎪', '🎁', '🎲'][index % 9]}
                    </div>
                    <h3 className="font-black text-lg">
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
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-6xl mb-6">🎉🎊🎈</div>
            <h2 
              className="text-6xl mb-6 font-black"
              style={{ fontFamily: playfulLoveTheme.typography.heading }}
            >
              Ready to Get Playful?!
            </h2>
            <p className="text-2xl mb-10 font-bold">
              Let's make a fun, colorful website that's totally YOU!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="text-xl font-black bg-gradient-to-r from-red-400 via-yellow-400 to-pink-400 hover:from-red-500 hover:via-yellow-500 hover:to-pink-500 text-white border-4 border-white shadow-2xl px-8 py-6"
                  asChild
                >
                  <Link href="/pricing?theme=playful">
                    YES! I Want This One! 🎯
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-xl font-black border-4 border-white bg-white hover:bg-gray-50 px-8 py-6"
                  asChild
                >
                  <Link href="/">
                    Show Me Other Themes
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

