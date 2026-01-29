'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles, Gift, Calendar, Check, X, Music, Camera, Zap, XCircle, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { playfulLoveTheme } from '@/config/themes/playful-love.config';
import { useState, useEffect, useRef } from 'react';

export default function PlayfulLovePage() {
  const { demoContent, colors } = playfulLoveTheme;
  const [fortuneResult, setFortuneResult] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isPipMode, setIsPipMode] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const pipVideoRef = useRef<HTMLVideoElement>(null);

  const getRandomFortune = () => {
    const fortunes = demoContent.games.fortuneTeller.options;
    const random = fortunes[Math.floor(Math.random() * fortunes.length)];
    setFortuneResult(random);
  };

  // Lock body scroll when timeline modal is open
  useEffect(() => {
    if (selectedTimelineEvent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedTimelineEvent]);

  // Lock body scroll when feature modal is open
  useEffect(() => {
    if (selectedFeature) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedFeature]);

  // Lock body scroll when video modal is open
  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsVideoPlaying(false);
      setIsPipMode(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedVideo]);

  // Handle video play/pause
  const toggleVideoPlay = () => {
    if (modalVideoRef.current) {
      if (isVideoPlaying) {
        modalVideoRef.current.pause();
      } else {
        modalVideoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  // Handle video mute/unmute
  const toggleVideoMute = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !isVideoMuted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  // Handle closing video modal
  const handleCloseVideo = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setSelectedVideo(null);
    setIsVideoPlaying(false);
    setIsPipMode(false);
  };

  // Handle video click on card
  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
    setIsVideoPlaying(true);
  };

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
            🎉 Demo Mode - {playfulLoveTheme.name} 🎈
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
        {demoContent.hero.confettiEnabled && (
          <div className="absolute inset-0 overflow-hidden">
            {colors.rainbow.map((color, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
                animate={{
                  y: [-100, typeof window !== 'undefined' ? window.innerHeight + 100 : 1000],
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
        )}

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
              className="text-3xl mb-8 font-bold"
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

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 
              className="text-5xl mb-4 font-black"
              style={{ fontFamily: playfulLoveTheme.typography.heading, color: colors.primary }}
            >
              Our Love in Numbers! 📊
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {demoContent.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: Math.random() * 10 - 5 }}
              >
                <Card className="border-4 shadow-xl" style={{ borderColor: stat.color }}>
                  <CardContent className="p-6 text-center bg-white">
                    <div className="text-5xl mb-3">{stat.emoji}</div>
                    <div className="text-4xl font-black mb-2" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="text-sm font-bold text-gray-700">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
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
            {demoContent.timeline.map((event, index) => {
              const hasExpandedStory = event.expandedStory && event.expandedStory.length > 0;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, rotate: index % 2 === 0 ? -5 : 5 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                  onClick={() => hasExpandedStory && setSelectedTimelineEvent(event)}
                  className={hasExpandedStory ? "cursor-pointer" : ""}
                >
                  <Card 
                    className="border-4 shadow-2xl h-full overflow-hidden relative"
                    style={{ 
                      borderColor: colors.rainbow[index % colors.rainbow.length],
                      transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)`
                    }}
                  >
                    {event.image && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2 text-5xl">
                          {event.emoji}
                        </div>
                        {hasExpandedStory && (
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              whileHover={{ scale: 1, opacity: 1 }}
                              className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-sm"
                              style={{ color: colors.rainbow[index % colors.rainbow.length] }}
                            >
                              📖 Click to Read Full Story
                            </motion.div>
                          </div>
                        )}
                      </div>
                    )}
                    <CardContent className="p-6 bg-white">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-4 w-4" />
                        <div className="text-sm font-bold inline-block px-3 py-1 rounded-full bg-yellow-200 border-2 border-yellow-400">
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </div>
                      </div>
                      <h3 
                        className="text-3xl mb-3 font-black"
                        style={{ fontFamily: playfulLoveTheme.typography.heading }}
                      >
                        {event.title}
                      </h3>
                      <p className="text-lg leading-relaxed mb-3">
                        {event.description}
                      </p>

                      {event.funFact && (
                        <p className="text-sm italic text-gray-600 border-l-4 border-orange-400 pl-3">
                          💡 {event.funFact}
                        </p>
                      )}

                      {/* Click indicator */}
                      {hasExpandedStory && (
                        <div className="mt-4 text-center text-sm font-bold" style={{ color: colors.rainbow[index % colors.rainbow.length] }}>
                          👆 Click card to read more
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
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
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-black" style={{ fontFamily: playfulLoveTheme.typography.heading }}>
                            {joke.joke}
                          </h3>
                          <Badge className="bg-yellow-200 text-yellow-800 border-yellow-400">
                            {joke.date}
                          </Badge>
                        </div>
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
                    <div className="flex-1">
                      <span className={`text-lg font-bold ${item.completed ? 'line-through text-gray-500' : ''}`}>
                        {item.item}
                      </span>
                      {item.completed && item.completedDate && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ Completed: {new Date(item.completedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fortune Teller Game */}
      {demoContent.games.fortuneTeller.enabled && (
        <section className="py-20 px-4 bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl font-black mb-8" style={{ fontFamily: playfulLoveTheme.typography.heading }}>
              Love Fortune Teller 🔮
            </h2>
            <p className="text-xl mb-8">Click the crystal ball to see what's in store for you two!</p>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={getRandomFortune}
              className="text-9xl mb-8 cursor-pointer"
            >
              🔮
            </motion.button>

            {fortuneResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-purple-400"
              >
                <p className="text-2xl font-bold">
                  {fortuneResult}
                </p>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Message Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring" }}
          >
            <Card className="border-8 shadow-2xl overflow-hidden transform rotate-1"
              style={{ borderColor: colors.primary }}
            >
              <div className="h-4 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400" />
              <CardContent className="p-12 bg-white">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">{demoContent.message.emoji}</div>
                  <h2 
                    className="text-5xl mb-4 font-black"
                    style={{ fontFamily: playfulLoveTheme.typography.heading, color: colors.primary }}
                  >
                    {demoContent.message.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {demoContent.message.paragraphs.map((paragraph, index) => (
                    <p key={index} className={`text-lg leading-relaxed ${paragraph.startsWith('•') ? 'ml-6' : ''}`}
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
            <p className="text-xl font-bold text-gray-600">
              Click any card to see what's inside! 👇
            </p>
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
                onClick={() => {
                  console.log('Feature clicked:', feature);
                  setSelectedFeature(feature);
                }}
                className="cursor-pointer"
              >
                <Card 
                  className="border-4 shadow-lg hover:shadow-2xl transition-shadow"
                  style={{ borderColor: colors.rainbow[index % colors.rainbow.length] }}
                >
                  <CardContent className="p-6 text-center bg-white">
                    <div className="text-4xl mb-3">
                      {feature.emoji}
                    </div>
                    <h3 className="font-black text-lg mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.shortDescription}
                    </p>
                    <p className="text-xs text-blue-600 mt-2 font-semibold">
                      Click to explore →
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Memories Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="text-6xl mb-4 font-black"
              style={{ fontFamily: playfulLoveTheme.typography.heading, color: colors.primary }}
            >
              {demoContent.videos.title}
            </motion.h2>
            <p className="text-xl font-bold text-gray-600">
              {demoContent.videos.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoContent.videos.items.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => handleVideoClick({ ...video, index })}
                className="cursor-pointer"
              >
                <Card 
                  className="border-4 shadow-xl overflow-hidden h-full hover:shadow-2xl transition-all duration-300"
                  style={{ borderColor: colors.rainbow[index % colors.rainbow.length] }}
                >
                  {/* Video Thumbnail */}
                  <div className="relative h-56 bg-black group overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl"
                      >
                        <Play className="h-10 w-10 ml-1" style={{ color: colors.rainbow[index % colors.rainbow.length] }} fill="currentColor" />
                      </motion.div>
                    </div>
                    {/* Category Badge */}
                    <div 
                      className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                      style={{ backgroundColor: colors.rainbow[index % colors.rainbow.length] }}
                    >
                      {video.category}
                    </div>
                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-bold">
                      {video.duration}
                    </div>
                    {/* Click to Play Indicator */}
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Play className="h-3 w-3" /> Click to Play
                    </div>
                  </div>

                  {/* Card Content */}
                  <CardContent className="p-6 bg-white">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500 font-semibold">
                        {new Date(video.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    <h3 
                      className="text-2xl font-black mb-3"
                      style={{ 
                        fontFamily: playfulLoveTheme.typography.heading,
                        color: colors.rainbow[index % colors.rainbow.length]
                      }}
                    >
                      {video.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {video.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Fun Note */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-block bg-white border-4 border-dashed border-purple-400 rounded-2xl p-6 shadow-lg">
              <p className="text-lg font-bold text-gray-700">
                🎬 <span className="text-purple-600">Pro Tip:</span> Click play and watch our shenanigans! 
                <span className="text-2xl ml-2">😎</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Story Modal */}
      <AnimatePresence>
        {selectedTimelineEvent && selectedTimelineEvent.expandedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedTimelineEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-4xl w-full my-8 shadow-2xl flex flex-col"
              style={{ 
                borderWidth: '8px', 
                borderColor: colors.primary,
                borderStyle: 'solid',
                maxHeight: 'calc(100vh - 4rem)',
              }}
            >
              {/* Modal Header with Image/Video */}
              {(selectedTimelineEvent.image || selectedTimelineEvent.video) && (
                <div className="relative h-64 overflow-hidden flex-shrink-0 rounded-t-2xl">
                  {/* Video (if provided, takes priority) */}
                  {selectedTimelineEvent.video ? (
                    <video
                      key={selectedTimelineEvent.video}
                      src={selectedTimelineEvent.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Video failed to load:', selectedTimelineEvent.video);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    /* Image (fallback) */
                    <Image
                      src={selectedTimelineEvent.image}
                      alt={selectedTimelineEvent.title}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                    <div className="text-7xl mb-3">{selectedTimelineEvent.emoji}</div>
                    <h2 
                      className="text-5xl font-black mb-2"
                      style={{ fontFamily: playfulLoveTheme.typography.heading }}
                    >
                      {selectedTimelineEvent.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <span className="text-lg font-semibold">
                        {new Date(selectedTimelineEvent.date).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTimelineEvent(null)}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-3 transition-all shadow-lg z-20"
                  >
                    <XCircle className="h-8 w-8 text-gray-700" />
                  </button>
                </div>
              )}

              {/* Modal Content - Scrollable */}
              <div className="overflow-y-auto flex-1 p-8">
                {/* Short Description */}
                <div className="bg-gradient-to-r from-yellow-100 to-pink-100 p-6 rounded-2xl mb-6 border-4 border-dashed border-orange-300">
                  <p className="text-xl leading-relaxed text-gray-800 font-semibold text-center">
                    {selectedTimelineEvent.description}
                  </p>
                </div>

                {/* Full Story */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Heart className="h-8 w-8 text-red-500 fill-red-500" />
                    <h3 
                      className="text-4xl font-black"
                      style={{ 
                        fontFamily: playfulLoveTheme.typography.accent,
                        color: colors.primary 
                      }}
                    >
                      The Full Story...
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {selectedTimelineEvent.expandedStory.split('\n\n').map((paragraph: string, pIndex: number) => (
                      <motion.p
                        key={pIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: pIndex * 0.1 }}
                        className="text-lg leading-relaxed text-gray-700"
                        style={{ fontFamily: playfulLoveTheme.typography.body }}
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </div>
                </div>

                {/* Fun Fact */}
                {selectedTimelineEvent.funFact && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border-4 border-blue-200">
                    <div className="flex items-start gap-3">
                      <span className="text-4xl">💡</span>
                      <div>
                        <h4 className="font-bold text-xl mb-2 text-blue-900">Fun Fact:</h4>
                        <p className="text-lg text-gray-700 italic">{selectedTimelineEvent.funFact}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mood Badge */}
                {selectedTimelineEvent.mood && (
                  <div className="mt-6 text-center">
                    <Badge className="text-lg py-2 px-6 bg-gradient-to-r from-pink-200 to-purple-200 text-purple-800 border-2 border-purple-400">
                      Mood: {selectedTimelineEvent.mood} ✨
                    </Badge>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feature Detail Modal */}
      <AnimatePresence>
        {selectedFeature && selectedFeature.detailedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedFeature(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-4xl w-full my-8 shadow-2xl flex flex-col"
              style={{ 
                borderWidth: '6px', 
                borderColor: colors.primary,
                maxHeight: 'calc(100vh - 4rem)',
              }}
            >
              <div className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 p-6 rounded-t-3xl flex justify-between items-center flex-shrink-0">
                <div>
                  <div className="text-6xl mb-2">{selectedFeature.emoji}</div>
                  <h2 className="text-4xl font-black" style={{ fontFamily: playfulLoveTheme.typography.heading }}>
                    {selectedFeature.detailedContent.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="text-gray-700 hover:text-gray-900 transition bg-white/50 hover:bg-white/80 rounded-full p-2"
                >
                  <XCircle className="h-10 w-10" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex-1">
                {/* Description */}
                <p className="text-xl leading-relaxed mb-8 text-gray-700">
                  {selectedFeature.detailedContent.description}
                </p>

                {/* Benefits */}
                {selectedFeature.detailedContent.benefits && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-yellow-500" />
                      What You Get:
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {selectedFeature.detailedContent.benefits.map((benefit: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 bg-green-50 p-3 rounded-lg border-2 border-green-200">
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Samples */}
                {selectedFeature.detailedContent.samples && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                      <Camera className="h-6 w-6 text-pink-500" />
                      Sample Styles:
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {selectedFeature.detailedContent.samples.map((sample: any, idx: number) => (
                        <Card key={idx} className="border-4 border-purple-300 overflow-hidden">
                          <div className="relative h-48">
                            {sample.video ? (
                              <video
                                src={sample.video}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            ) : (
                              <Image
                                src={sample.preview}
                                alt={sample.style}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-bold text-lg mb-2">{sample.style}</h4>
                            <p className="text-sm text-gray-600">{sample.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filters */}
                {selectedFeature.detailedContent.filters && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-black mb-4">Available Filters:</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedFeature.detailedContent.filters.map((filter: any, idx: number) => (
                        <Badge key={idx} className="text-lg py-2 px-4 bg-gradient-to-r from-pink-200 to-purple-200 text-purple-800 border-2 border-purple-400">
                          {filter.emoji} {filter.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Games */}
                {selectedFeature.detailedContent.games && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-black mb-4">Games Included:</h3>
                    <div className="space-y-4">
                      {selectedFeature.detailedContent.games.map((game: any, idx: number) => (
                        <Card key={idx} className="border-4" style={{ borderColor: colors.rainbow[idx % colors.rainbow.length] }}>
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="text-5xl">{game.emoji}</div>
                              <div className="flex-1">
                                <h4 className="text-xl font-bold mb-2">{game.name}</h4>
                                <p className="text-gray-600 mb-2">{game.description}</p>
                                <Badge className="bg-blue-100 text-blue-700">
                                  {game.questions} Questions
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meme Categories */}
                {selectedFeature.detailedContent.memeCategories && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-black mb-4">Meme Categories:</h3>
                    <div className="space-y-3">
                      {selectedFeature.detailedContent.memeCategories.map((cat: any, idx: number) => (
                        <div key={idx} className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
                          <div className="flex items-start gap-3">
                            <span className="text-3xl">{cat.emoji}</span>
                            <div>
                              <h4 className="font-bold text-lg">{cat.category}</h4>
                              <p className="text-gray-600 italic">{cat.example}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features List */}
                {selectedFeature.detailedContent.features && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-black mb-4">Special Features:</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedFeature.detailedContent.features.map((feat: any, idx: number) => (
                        <div key={idx} className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{feat.icon}</span>
                            <div>
                              <h4 className="font-bold">{feat.feature}</h4>
                              <p className="text-sm text-gray-600">{feat.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                {selectedFeature.detailedContent.categories && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-black mb-4">Categories:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedFeature.detailedContent.categories.map((cat: any, idx: number) => (
                        <Card key={idx} className="border-4" style={{ borderColor: colors.rainbow[idx % colors.rainbow.length] }}>
                          <CardContent className="p-4 text-center">
                            <div className="text-4xl mb-2">{cat.emoji}</div>
                            <h4 className="font-bold text-sm mb-1">{cat.name}</h4>
                            <Badge className="text-xs">{cat.count} items</Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card Types */}
                {selectedFeature.detailedContent.cardTypes && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-black mb-4">Card Types:</h3>
                    <div className="space-y-4">
                      {selectedFeature.detailedContent.cardTypes.map((type: any, idx: number) => (
                        <Card key={idx} className="border-4 border-pink-300">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <span className="text-5xl">{type.emoji}</span>
                              <div>
                                <h4 className="text-xl font-bold mb-2">{type.type}</h4>
                                <div className="flex flex-wrap gap-2">
                                  {type.examples.map((ex: string, i: number) => (
                                    <Badge key={i} className="bg-purple-100 text-purple-700">
                                      {ex}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fortunes */}
                {selectedFeature.detailedContent.fortunes && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-black mb-4">Fortune Categories:</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedFeature.detailedContent.fortunes.map((fortune: any, idx: number) => (
                        <div key={idx} className="bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
                          <div className="flex items-start gap-3">
                            <span className="text-3xl">{fortune.emoji}</span>
                            <div>
                              <h4 className="font-bold text-lg">{fortune.category}</h4>
                              <p className="text-sm text-gray-600 italic">"{fortune.example}"</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* How It Works */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border-4 border-blue-300">
                  <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                    <Zap className="h-6 w-6 text-yellow-500" />
                    How It Works:
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {selectedFeature.detailedContent.howItWorks}
                  </p>
                </div>

                {/* CTA */}
                <div className="mt-8 text-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-xl font-black px-8 py-6"
                    asChild
                  >
                    <Link href="/pricing?theme=playful">
                      Get This Feature! 🎯
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[70] flex flex-col"
            onClick={handleCloseVideo}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={handleCloseVideo}
              className="absolute top-4 right-4 z-[80] bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all"
            >
              <XCircle className="h-8 w-8 text-white" />
            </motion.button>

            {/* Video Title Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-4 z-[80] flex items-center gap-4"
            >
              <div 
                className="px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg"
                style={{ backgroundColor: colors.rainbow[selectedVideo.index % colors.rainbow.length] }}
              >
                {selectedVideo.category}
              </div>
              <h2 
                className="text-2xl md:text-3xl font-black text-white drop-shadow-lg"
                style={{ fontFamily: playfulLoveTheme.typography.heading }}
              >
                {selectedVideo.title}
              </h2>
            </motion.div>

            {/* Main Video Container */}
            <div 
              className="flex-1 flex items-center justify-center p-4 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`relative w-full ${isPipMode ? 'max-w-4xl' : 'max-w-6xl'} aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl`}
                style={{ 
                  borderWidth: '4px',
                  borderColor: colors.rainbow[selectedVideo.index % colors.rainbow.length],
                }}
              >
                <video
                  ref={modalVideoRef}
                  src={selectedVideo.url}
                  poster={selectedVideo.thumbnail}
                  className="w-full h-full object-contain"
                  autoPlay
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                  onEnded={() => setIsVideoPlaying(false)}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVideoPlay();
                  }}
                />

                {/* Custom Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6">
                  <div className="flex items-center justify-between gap-4">
                    {/* Play/Pause Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVideoPlay();
                      }}
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
                    >
                      {isVideoPlaying ? (
                        <Pause className="h-6 w-6 md:h-7 md:w-7 text-white" />
                      ) : (
                        <Play className="h-6 w-6 md:h-7 md:w-7 text-white ml-1" />
                      )}
                    </motion.button>

                    {/* Video Info */}
                    <div className="flex-1 text-white">
                      <p className="text-sm md:text-base font-semibold truncate">
                        {selectedVideo.description}
                      </p>
                      <p className="text-xs md:text-sm text-white/70">
                        {new Date(selectedVideo.date).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric' 
                        })} • {selectedVideo.duration}
                      </p>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-2">
                      {/* Mute/Unmute Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVideoMute();
                        }}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
                      >
                        {isVideoMuted ? (
                          <VolumeX className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        ) : (
                          <Volume2 className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        )}
                      </motion.button>

                      {/* PiP Toggle Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPipMode(!isPipMode);
                        }}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
                        title={isPipMode ? "Exit mini view" : "Switch to mini view"}
                      >
                        {isPipMode ? (
                          <Maximize2 className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        ) : (
                          <Minimize2 className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Play Button Overlay (when paused) */}
                {!isVideoPlaying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVideoPlay();
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl"
                    >
                      <Play 
                        className="h-12 w-12 md:h-16 md:w-16 ml-2" 
                        style={{ color: colors.rainbow[selectedVideo.index % colors.rainbow.length] }} 
                        fill="currentColor" 
                      />
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Video List Thumbnails at Bottom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/80 backdrop-blur-sm p-4 border-t border-white/10"
            >
              <div className="max-w-6xl mx-auto">
                <p className="text-white/70 text-sm font-semibold mb-3">More Videos</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {demoContent.videos.items.map((video, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVideo({ ...video, index });
                        setIsVideoPlaying(true);
                      }}
                      className={`relative flex-shrink-0 w-32 md:w-40 aspect-video rounded-lg overflow-hidden cursor-pointer ${
                        selectedVideo.index === index ? 'ring-4' : 'ring-2 ring-white/20 hover:ring-white/40'
                      }`}
                      style={{ 
                        ringColor: selectedVideo.index === index ? colors.rainbow[index % colors.rainbow.length] : undefined 
                      }}
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      {selectedVideo.index === index && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                            {isVideoPlaying ? (
                              <Pause className="h-4 w-4" style={{ color: colors.rainbow[index % colors.rainbow.length] }} />
                            ) : (
                              <Play className="h-4 w-4 ml-0.5" style={{ color: colors.rainbow[index % colors.rainbow.length] }} fill="currentColor" />
                            )}
                          </div>
                        </div>
                      )}
                      {selectedVideo.index !== index && (
                        <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                          <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                            <Play className="h-4 w-4 ml-0.5" style={{ color: colors.rainbow[index % colors.rainbow.length] }} fill="currentColor" />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                        {video.duration}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl mb-4" style={{ fontFamily: playfulLoveTheme.typography.accent }}>
            {demoContent.footer.tagline}
          </p>
          <div className="flex justify-center gap-6 mb-6">
            {demoContent.footer.links.map((link, index) => (
              <a key={index} href={link.url} className="hover:text-yellow-400 transition">
                {link.label}
              </a>
            ))}
          </div>
          {demoContent.footer.socialMedia && (
            <div className="text-sm text-gray-400">
              {demoContent.footer.socialMedia.instagram} • {demoContent.footer.socialMedia.tiktok}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
