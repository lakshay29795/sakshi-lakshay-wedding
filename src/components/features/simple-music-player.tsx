'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, ExternalLink, Heart, Music } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/music-player.css';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  musicUrl: string;
  significance: string;
}

const songs: Song[] = [
  {
    id: '1',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    duration: 263,
    audioUrl: '/audio/songs/perfect-ed-sheeran.mp3',
    musicUrl: 'https://music.youtube.com/watch?v=hgIvwR0eSno',
    significance: 'Our first dance song',
  },
  {
    id: '2',
    title: 'All of Me',
    artist: 'John Legend', 
    duration: 269,
    audioUrl: '/audio/songs/all-of-me-john-legend.mp3',
    musicUrl: 'https://open.spotify.com/track/3U4isOIWM3VvDubwSI3y7a',
    significance: 'The song that played during our first kiss',
  },
  {
    id: '3',
    title: 'Pal Pal',
    artist: 'Bollywood Romance',
    duration: 285,
    audioUrl: '/audio/songs/Pal Pal(KoshalWorld.Com).mp3',
    musicUrl: 'https://music.youtube.com/search?q=pal+pal+bollywood',
    significance: 'A beautiful Hindi romantic song that speaks to our hearts ❤️',
  },
];

export function SimpleMusicPlayer() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playSong = useCallback((song: Song) => {
    if (!audioRef.current) return;

    if (currentSong?.id === song.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (currentSong?.id !== song.id) {
        audioRef.current.src = song.audioUrl;
        setCurrentSong(song);
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSong, isPlaying]);

  const seekTo = (percentage: number) => {
    if (!audioRef.current || !currentSong) return;
    const newTime = (percentage / 100) * currentSong.duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skip = (seconds: number) => {
    if (!audioRef.current || !currentSong) return;
    const newTime = Math.max(0, Math.min(currentSong.duration, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.volume = volume;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume]);

  return (
    <div className="max-w-6xl mx-auto">
      <audio ref={audioRef} />
      
      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column - Now Playing (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <AnimatePresence>
              {currentSong ? (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Card className="overflow-hidden bg-gradient-to-br from-white via-sage-green/5 to-gray-50/30 border-0 shadow-2xl backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="relative">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-sage-green/5 via-transparent to-gray-100/10" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,181,160,0.08),transparent_50%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(156,163,175,0.05),transparent_50%)]" />
                        
                        <div className="relative p-6">
                          {/* Header with floating hearts */}
                          <div className="text-center mb-6 relative">
                            <motion.div
                              animate={{ 
                                y: [0, -8, 0],
                                rotate: [0, 5, -5, 0]
                              }}
                              transition={{ 
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="absolute -top-1 -left-1"
                            >
                              <Heart className="w-3 h-3 text-sage-green/60 fill-current opacity-60" />
                            </motion.div>
                            
                            <motion.div
                              animate={{ 
                                y: [0, -6, 0],
                                rotate: [0, -3, 3, 0]
                              }}
                              transition={{ 
                                duration: 3.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1
                              }}
                              className="absolute -top-0.5 -right-2"
                            >
                              <Heart className="w-2.5 h-2.5 text-sage-green/40 fill-current opacity-50" />
                            </motion.div>

                            <Badge variant="secondary" className="mb-3 bg-white/60 backdrop-blur-sm border-sage-green/20">
                              <Music className="w-3 h-3 mr-1" />
                              Now Playing
                            </Badge>
                            
                            <motion.h3 
                              className="text-xl font-serif text-charcoal mb-1"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              {currentSong.title}
                            </motion.h3>
                            <motion.p 
                              className="text-sage-green font-medium text-sm"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              {currentSong.artist}
                            </motion.p>
                          </div>

                          {/* Album Art Placeholder */}
                          <div className="aspect-square bg-gradient-to-br from-sage-green/10 to-gray-100/50 rounded-2xl mb-6 overflow-hidden shadow-inner">
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sage-green/5 to-gray-50/30">
                              <motion.div
                                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                                transition={{ duration: 20, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                                className="w-20 h-20 rounded-full bg-gradient-to-br from-sage-green/80 to-sage-green flex items-center justify-center shadow-lg"
                              >
                                <Music className="w-8 h-8 text-white" />
                              </motion.div>
                            </div>
                          </div>

                          {/* Premium Progress Bar */}
                          <div className="space-y-2 mb-6">
                            <div 
                              className="relative h-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full cursor-pointer shadow-inner group"
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const percentage = ((e.clientX - rect.left) / rect.width) * 100;
                                seekTo(percentage);
                              }}
                            >
                              <motion.div 
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-sage-green/70 via-sage-green to-sage-green/90 rounded-full shadow-lg"
                                style={{ width: `${(currentTime / currentSong.duration) * 100}%` }}
                                initial={{ width: 0 }}
                                animate={{ width: `${(currentTime / currentSong.duration) * 100}%` }}
                                transition={{ duration: 0.1 }}
                              />
                              
                              {/* Animated thumb */}
                              <motion.div 
                                className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-sage-green opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ 
                                  left: `${(currentTime / currentSong.duration) * 100}%`,
                                  marginLeft: '-8px'
                                }}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              />
                            </div>
                            
                            <div className="flex justify-between text-xs text-muted-foreground font-mono">
                              <span className="bg-white/50 px-2 py-1 rounded-full">{formatTime(currentTime)}</span>
                              <span className="bg-white/50 px-2 py-1 rounded-full">{formatTime(currentSong.duration)}</span>
                            </div>
                          </div>

                          {/* Premium Controls */}
                          <div className="flex items-center justify-center space-x-4 mb-6">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => skip(-10)}
                                className="rounded-full w-10 h-10 bg-white/50 backdrop-blur-sm hover:bg-white/70 border border-white/20 shadow-lg"
                              >
                                <SkipBack className="w-4 h-4 text-charcoal" />
                              </Button>
                            </motion.div>
                            
                            <motion.div 
                              whileHover={{ scale: 1.05 }} 
                              whileTap={{ scale: 0.95 }}
                              animate={isPlaying ? { 
                                boxShadow: [
                                  "0 0 0 0 rgba(168, 181, 160, 0.3)",
                                  "0 0 0 8px rgba(168, 181, 160, 0)",
                                  "0 0 0 0 rgba(168, 181, 160, 0)"
                                ]
                              } : {}}
                              transition={{ duration: 1.5, repeat: isPlaying ? Infinity : 0 }}
                            >
                              <Button 
                                onClick={() => playSong(currentSong)}
                                size="lg"
                                className="rounded-full w-16 h-16 bg-gradient-to-br from-sage-green/80 to-sage-green hover:from-sage-green hover:to-sage-green/90 border-0 shadow-2xl text-white"
                              >
                                <motion.div
                                  animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                                  transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                                >
                                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                                </motion.div>
                              </Button>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => skip(10)}
                                className="rounded-full w-10 h-10 bg-white/50 backdrop-blur-sm hover:bg-white/70 border border-white/20 shadow-lg"
                              >
                                <SkipForward className="w-4 h-4 text-charcoal" />
                              </Button>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => window.open(currentSong.musicUrl, '_blank')}
                                className="rounded-full w-10 h-10 bg-white/50 backdrop-blur-sm hover:bg-white/70 border border-white/20 shadow-lg"
                              >
                                <ExternalLink className="w-4 h-4 text-charcoal" />
                              </Button>
                            </motion.div>
                          </div>

                          {/* Premium Volume Control */}
                          <div className="flex items-center space-x-3 mb-6 bg-white/30 backdrop-blur-sm rounded-full p-3 border border-white/20">
                            <Volume2 className="w-4 h-4 text-charcoal" />
                            <div className="flex-1 relative">
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full appearance-none cursor-pointer slider-thumb"
                                style={{
                                  background: `linear-gradient(to right, #a8b5a0 0%, #a8b5a0 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
                                }}
                              />
                            </div>
                            <span className="text-xs font-mono text-charcoal bg-white/50 px-2 py-1 rounded-full min-w-[2.5rem] text-center">
                              {Math.round(volume * 100)}%
                            </span>
                          </div>

                          {/* Song Significance */}
                          <motion.div 
                            className="text-center bg-gradient-to-r from-white/40 to-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <Heart className="w-3 h-3 text-sage-green/60 fill-current mx-auto mb-2" />
                            <p className="text-xs text-charcoal/80 italic font-medium leading-relaxed">
                              "{currentSong.significance}"
                            </p>
                          </motion.div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Card className="bg-gradient-to-br from-white via-sage-green/5 to-gray-50/30 border-0 shadow-xl">
                    <CardContent className="p-8">
                      <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Select a song to play</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column - Song List */}
        <div className="lg:col-span-2">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, staggerChildren: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <Badge variant="secondary" className="bg-white/60 backdrop-blur-sm border-sage-green/20">
                <Heart className="w-3 h-3 mr-1 text-sage-green fill-current" />
                Our Love Songs
              </Badge>
            </div>

            {songs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 overflow-hidden group ${
                    currentSong?.id === song.id 
                      ? 'ring-2 ring-sage-green/60 shadow-xl bg-gradient-to-r from-sage-green/10 to-gray-50/30' 
                      : 'hover:shadow-lg bg-white/70 backdrop-blur-sm border-white/50'
                  }`}
                  onClick={() => playSong(song)}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      {/* Animated background for current song */}
                      {currentSong?.id === song.id && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-sage-green/15 via-transparent to-gray-100/20"
                          animate={{
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                      
                      <div className="relative p-4">
                        <div className="flex items-center space-x-4">
                          {/* Song Number/Play Button */}
                          <div className="flex-shrink-0">
                            <motion.div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                currentSong?.id === song.id
                                  ? 'bg-gradient-to-br from-sage-green/80 to-sage-green text-white shadow-lg'
                                  : 'bg-white/50 backdrop-blur-sm border border-white/30 text-charcoal group-hover:bg-sage-green/80 group-hover:text-white'
                              }`}
                              whileHover={{ rotate: 5 }}
                              whileTap={{ rotate: -5 }}
                            >
                              {currentSong?.id === song.id && isPlaying ? (
                                <motion.div
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 0.5, repeat: Infinity }}
                                >
                                  <Pause className="w-4 h-4" />
                                </motion.div>
                              ) : (
                                <Play className="w-4 h-4 ml-0.5" />
                              )}
                            </motion.div>
                          </div>

                          {/* Song Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-serif text-base text-charcoal truncate mb-1">
                                  {song.title}
                                </h4>
                                <p className="text-sage-green font-medium text-sm mb-1">
                                  {song.artist}
                                </p>
                                <p className="text-xs text-charcoal/60 italic leading-relaxed line-clamp-1">
                                  {song.significance}
                                </p>
                              </div>
                              
                              {/* Duration and Status */}
                              <div className="flex flex-col items-end space-y-1 ml-4">
                                <span className="text-xs font-mono text-muted-foreground bg-white/50 px-2 py-1 rounded-full">
                                  {formatTime(song.duration)}
                                </span>
                                
                                {currentSong?.id === song.id && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center space-x-0.5"
                                  >
                                    <motion.div
                                      animate={isPlaying ? {
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 1, 0.5]
                                      } : {}}
                                      transition={{ duration: 1, repeat: Infinity }}
                                      className="w-1.5 h-1.5 bg-sage-green rounded-full"
                                    />
                                    <motion.div
                                      animate={isPlaying ? {
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 1, 0.5]
                                      } : {}}
                                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                      className="w-1.5 h-1.5 bg-sage-green/80 rounded-full"
                                    />
                                    <motion.div
                                      animate={isPlaying ? {
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 1, 0.5]
                                      } : {}}
                                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                      className="w-1.5 h-1.5 bg-sage-green/60 rounded-full"
                                    />
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
