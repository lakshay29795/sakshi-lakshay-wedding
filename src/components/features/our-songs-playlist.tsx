'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Heart, Music, Volume2, VolumeX, ExternalLink, Plus, RefreshCw, SkipBack, SkipForward } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { demoSongs } from '@/lib/audio/demo-audio';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  previewUrl?: string;
  musicUrl: string; // YouTube Music, Spotify, Apple Music, etc.
  albumArt: string;
  significance: string;
  addedBy: 'couple' | 'guest';
  dateAdded: Date;
}

interface PlaybackState {
  isPlaying: boolean;
  currentSong: string | null;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
}

// 🎵 UPDATE YOUR WEDDING SONGS HERE 🎵
// Add your downloaded songs to public/audio/songs/ folder
const ourSongs: Song[] = [
  {
    id: '1',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 263, // Real duration in seconds (4:23)
    previewUrl: '/audio/songs/perfect-ed-sheeran.mp3', // Your downloaded file
    musicUrl: 'https://music.youtube.com/watch?v=hgIvwR0eSno',
    albumArt: '/images/songs/perfect-album.jpg',
    significance: 'Our first dance song - the moment we knew we were perfect for each other',
    addedBy: 'couple',
    dateAdded: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'All of Me',
    artist: 'John Legend',
    album: 'Love in the Future',
    duration: 269, // Real duration in seconds (4:29)
    previewUrl: '/audio/songs/all-of-me-john-legend.mp3', // Your downloaded file
    musicUrl: 'https://open.spotify.com/track/3U4isOIWM3VvDubwSI3y7a',
    albumArt: '/images/songs/all-of-me-album.jpg',
    significance: 'The song that played during our first kiss',
    addedBy: 'couple',
    dateAdded: new Date('2024-01-15'),
  },
  {
    id: '3',
    title: 'Thinking Out Loud',
    artist: 'Ed Sheeran',
    album: 'x (Multiply)',
    duration: 281, // Real duration in seconds (4:41)
    previewUrl: '/audio/songs/thinking-out-loud-ed-sheeran.mp3', // Your downloaded file
    musicUrl: 'https://open.spotify.com/track/lp9eB5Kxc5BlHZwJcHa6EX',
    albumArt: '/images/songs/thinking-out-loud-album.jpg',
    significance: 'We danced to this in our kitchen on a random Tuesday',
    addedBy: 'couple',
    dateAdded: new Date('2024-01-15'),
  },
  {
    id: '4',
    title: 'Can\'t Help Myself',
    artist: 'Four Tops',
    album: 'Four Tops Second Album',
    duration: 164, // Real duration in seconds (2:44)
    previewUrl: '/audio/songs/cant-help-myself-four-tops.mp3', // Your downloaded file
    musicUrl: 'https://open.spotify.com/track/3qiyyUfYe7CRYLucrPmulD',
    albumArt: '/images/songs/cant-help-myself-album.jpg',
    significance: 'Suggested by Sakshi M. - reminds her of young love',
    addedBy: 'guest',
    dateAdded: new Date('2024-02-20'),
  },
  {
    id: '5',
    title: 'Pal Pal',
    artist: 'Bollywood Romance',
    album: 'Hindi Love Songs',
    duration: 285, // Estimated 4:45 - you can update with exact duration
    previewUrl: '/audio/songs/Pal Pal(KoshalWorld.Com).mp3', // Your uploaded file
    musicUrl: 'https://music.youtube.com/search?q=pal+pal+bollywood+romantic+song', // Search link
    albumArt: '/images/songs/pal-pal-album.jpg',
    significance: 'A beautiful Hindi romantic song that speaks to our hearts ❤️',
    addedBy: 'couple',
    dateAdded: new Date('2024-11-12'),
  },
  // 🎵 ADD MORE SONGS HERE:
  // {
  //   id: '5',
  //   title: 'Your Song Title',
  //   artist: 'Artist Name',
  //   album: 'Album Name',
  //   duration: 10,
  //   previewUrl: '/audio/songs/your-song-file.mp3', // Your downloaded file
  //   musicUrl: 'https://music.youtube.com/watch?v=YOUR_VIDEO_ID',
  //   albumArt: '/images/songs/your-album.jpg',
  //   significance: 'Why this song is special to you',
  //   addedBy: 'couple',
  //   dateAdded: new Date('2024-03-01'),
  // },
];

// Fallback album art SVG
const fallbackAlbumArt = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="albumGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#F8E8E8"/>
      <stop offset="100%" style="stop-color:#A8B5A0"/>
    </radialGradient>
  </defs>
  <rect width="200" height="200" fill="url(#albumGradient)"/>
  <circle cx="100" cy="100" r="80" fill="none" stroke="#6B7280" stroke-width="2"/>
  <circle cx="100" cy="100" r="60" fill="none" stroke="#6B7280" stroke-width="1"/>
  <circle cx="100" cy="100" r="40" fill="none" stroke="#6B7280" stroke-width="1"/>
  <circle cx="100" cy="100" r="20" fill="none" stroke="#6B7280" stroke-width="1"/>
  <circle cx="100" cy="100" r="8" fill="#6B7280"/>
  <path d="M80 80 L120 120 M120 80 L80 120" stroke="#6B7280" stroke-width="1" opacity="0.5"/>
</svg>
`;

export function OurSongsPlaylist({ className }: { className?: string }) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentSong: null,
    currentTime: 0,
    volume: 0.7,
    isMuted: false,
    isLoading: false,
    error: null,
  });
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [showAddSong, setShowAddSong] = useState(false);
  const [demoAudioUrls, setDemoAudioUrls] = useState<Record<string, string>>({});

  // Generate demo audio URLs on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDemoAudioUrls({
        '1': demoSongs.romantic(),
        '2': demoSongs.upbeat(),
        '3': demoSongs.mellow(),
        '4': demoSongs.classic(),
        '5': demoSongs.romantic(), // Fallback for Pal Pal if file doesn't load
      });
    }
  }, []);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = playbackState.volume;
    setAudioElement(audio);

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Update audio time
  useEffect(() => {
    if (!audioElement) return;

    const updateTime = () => {
      setPlaybackState(prev => ({
        ...prev,
        currentTime: audioElement.currentTime,
      }));
    };

    const handleEnded = () => {
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: false,
        currentSong: null,
        currentTime: 0,
      }));
    };

    audioElement.addEventListener('timeupdate', updateTime);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('timeupdate', updateTime);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [audioElement]);

  const playSong = useCallback(async (song: Song) => {
    if (!audioElement) return;

    if (playbackState.currentSong === song.id && playbackState.isPlaying) {
      // Pause current song
      audioElement.pause();
      setPlaybackState(prev => ({ ...prev, isPlaying: false }));
    } else {
      // Play new song or resume
      try {
        setPlaybackState(prev => ({ 
          ...prev, 
          isLoading: true, 
          error: null 
        }));

        if (playbackState.currentSong !== song.id) {
          let audioUrl = song.previewUrl;
          
          // Try to get real Spotify preview if it's a Spotify URL
          if (!audioUrl && song.musicUrl.includes('spotify.com')) {
            try {
              const response = await fetch(`/api/music/preview?url=${encodeURIComponent(song.musicUrl)}`);
              const data = await response.json();
              if (data.success) {
                audioUrl = data.previewUrl;
              }
            } catch (error) {
              console.log('Could not fetch Spotify preview, using demo audio');
            }
          }
          
          // Fallback to generated demo audio
          if (!audioUrl) {
            audioUrl = demoAudioUrls[song.id];
          }
          
          if (!audioUrl) {
            throw new Error('No preview available for this song');
          }
          
          audioElement.src = audioUrl;
          audioElement.currentTime = 0;
          
          // Wait for the audio to be ready
          await new Promise((resolve, reject) => {
            const handleCanPlay = () => {
              audioElement.removeEventListener('canplay', handleCanPlay);
              audioElement.removeEventListener('error', handleError);
              resolve(true);
            };
            
            const handleError = () => {
              audioElement.removeEventListener('canplay', handleCanPlay);
              audioElement.removeEventListener('error', handleError);
              reject(new Error('Failed to load audio'));
            };
            
            audioElement.addEventListener('canplay', handleCanPlay);
            audioElement.addEventListener('error', handleError);
            
            // Trigger loading
            audioElement.load();
          });
        }
        
        await audioElement.play();
        
        setPlaybackState(prev => ({
          ...prev,
          isPlaying: true,
          currentSong: song.id,
          isLoading: false,
          error: null,
        }));
        
      } catch (error) {
        console.error('Error playing song:', error);
        setPlaybackState(prev => ({
          ...prev,
          isPlaying: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to play song',
        }));
      }
    }
  }, [audioElement, playbackState]);

  const toggleMute = useCallback(() => {
    if (!audioElement) return;

    const newMuted = !playbackState.isMuted;
    audioElement.muted = newMuted;
    setPlaybackState(prev => ({ ...prev, isMuted: newMuted }));
  }, [audioElement, playbackState.isMuted]);

  const changeVolume = useCallback((volume: number) => {
    if (!audioElement) return;

    audioElement.volume = volume;
    setPlaybackState(prev => ({ ...prev, volume }));
  }, [audioElement]);

  const seekToTime = useCallback((time: number) => {
    if (!audioElement) return;

    audioElement.currentTime = time;
    setPlaybackState(prev => ({ ...prev, currentTime: time }));
  }, [audioElement]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioElement || !currentSong) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    const newTime = percentage * currentSong.duration;
    
    seekToTime(newTime);
  }, [audioElement, currentSong, seekToTime]);

  // Simple click-to-seek functionality (drag will be added later)
  const [isDragging, setIsDragging] = useState(false);

  const skipBackward = useCallback(() => {
    if (!audioElement) return;
    const newTime = Math.max(0, audioElement.currentTime - 10);
    seekToTime(newTime);
  }, [audioElement, seekToTime]);

  const skipForward = useCallback(() => {
    if (!audioElement || !currentSong) return;
    const newTime = Math.min(currentSong.duration, audioElement.currentTime + 10);
    seekToTime(newTime);
  }, [audioElement, currentSong, seekToTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentSong = () => {
    return ourSongs.find(song => song.id === playbackState.currentSong);
  };

  const currentSong = getCurrentSong();

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-2 mb-4"
        >
          <Music className="w-6 h-6 text-sage-green" />
          <h2 className="text-3xl font-serif text-charcoal">Our Songs</h2>
          <Music className="w-6 h-6 text-sage-green" />
        </motion.div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          The soundtrack to our love story. Each song holds a special memory and meaning in our journey together.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Now Playing */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Music className="w-5 h-5" />
                <span>Now Playing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentSong ? (
                <>
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={`data:image/svg+xml;base64,${btoa(fallbackAlbumArt)}`}
                      alt={`${currentSong.album} album art`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-semibold text-charcoal">{currentSong.title}</h3>
                    <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
                  </div>

                  <div className="space-y-2">
                    {/* Clickable & Draggable Progress Bar */}
                    <div 
                      className="progress-bar relative h-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-colors"
                      onClick={handleProgressClick}
                    >
                      <div 
                        className="absolute top-0 left-0 h-full bg-sage-green rounded-full transition-all duration-100"
                        style={{ 
                          width: `${Math.min(100, (playbackState.currentTime / currentSong.duration) * 100)}%` 
                        }}
                      />
                      {/* Progress thumb */}
                      <div 
                        className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-sage-green rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer"
                        style={{ 
                          left: `${Math.min(100, (playbackState.currentTime / currentSong.duration) * 100)}%`,
                          marginLeft: '-8px'
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatTime(playbackState.currentTime)}</span>
                      <span>{formatTime(currentSong.duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                    >
                      {playbackState.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={skipBackward}
                      title="Skip back 10 seconds"
                    >
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      onClick={() => playSong(currentSong)}
                      size="lg"
                      className="rounded-full w-12 h-12 p-0"
                      disabled={playbackState.isLoading}
                    >
                      {playbackState.isLoading ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : playbackState.isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={skipForward}
                      title="Skip forward 10 seconds"
                    >
                      <SkipForward className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(currentSong.musicUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center space-x-2 px-4">
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={playbackState.volume}
                        onChange={(e) => changeVolume(parseFloat(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">
                      {Math.round(playbackState.volume * 100)}%
                    </span>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground italic">
                      "{currentSong.significance}"
                    </p>
                  </div>

                  {/* Error Display */}
                  {playbackState.error && (
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                      <p className="text-xs text-red-600">
                        {playbackState.error}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a song to play</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Playlist */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-serif text-charcoal">Playlist</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddSong(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Suggest Song
            </Button>
          </div>

          <div className="space-y-3">
            {ourSongs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={cn(
                    'cursor-pointer transition-all duration-200 hover:shadow-md',
                    playbackState.currentSong === song.id && 'ring-2 ring-sage-green'
                  )}
                  onClick={() => playSong(song)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {/* Album Art */}
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={`data:image/svg+xml;base64,${btoa(fallbackAlbumArt)}`}
                          alt={`${song.album} album art`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Song Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-charcoal truncate">{song.title}</h4>
                          {song.addedBy === 'guest' && (
                            <Badge variant="secondary" className="text-xs">Guest</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {song.significance}
                        </p>
                      </div>

                      {/* Play Button */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(song.duration)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full w-10 h-10 p-0"
                          disabled={playbackState.isLoading && playbackState.currentSong === song.id}
                        >
                          {playbackState.currentSong === song.id && playbackState.isLoading ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : playbackState.currentSong === song.id && playbackState.isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Spotify Integration Info */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Music className="w-5 h-5 text-sage-green mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm text-charcoal mb-1">
                    Multi-Platform Music
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Our wedding playlist supports multiple music platforms including YouTube Music, Spotify, 
                    Apple Music, and more. Guests can suggest songs that will be added to our special collection. 
                    <br /><br />
                    <strong>Full Songs:</strong> Plays complete songs when audio files are provided, 
                    otherwise falls back to Spotify previews or demo audio. Click the external link to 
                    listen on your preferred music platform.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Song Modal (placeholder) */}
      <AnimatePresence>
        {showAddSong && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddSong(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-serif text-charcoal mb-4">Suggest a Song</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Feature coming soon! Guests will be able to search Spotify and suggest songs 
                for our wedding playlist.
              </p>
              <Button onClick={() => setShowAddSong(false)} className="w-full">
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
