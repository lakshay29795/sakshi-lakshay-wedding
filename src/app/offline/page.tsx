'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { WifiOff, Heart, RefreshCw, Home, MessageCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import Link from 'next/link';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get last cache update time from localStorage
    const lastCacheUpdate = localStorage.getItem('lastCacheUpdate');
    if (lastCacheUpdate) {
      setLastUpdate(new Date(lastCacheUpdate));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    if (isOnline) {
      window.location.reload();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Container className="min-h-screen flex items-center justify-center py-12">
      <motion.div
        className="max-w-2xl mx-auto text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Offline Icon */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative">
            <WifiOff className="w-24 h-24 mx-auto text-sage-green/60" />
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-8 h-8 text-blush-pink fill-current" />
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants}>
          <Card className="wedding-card">
            <CardHeader>
              <CardTitle className="text-3xl font-serif text-sage-green mb-4">
                {isOnline ? 'Connection Restored!' : 'You\'re Offline'}
              </CardTitle>
              <p className="text-lg text-muted-foreground">
                {isOnline
                  ? 'Great! Your connection is back. You can now access all features.'
                  : 'Don\'t worry, you can still browse our cached content and prepare your messages.'
                }
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Connection Status */}
              <div className={`p-4 rounded-lg border ${
                isOnline 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    isOnline ? 'bg-green-500' : 'bg-amber-500'
                  }`} />
                  <span className="font-medium">
                    {isOnline ? 'Connected' : 'Offline Mode'}
                  </span>
                </div>
                {lastUpdate && (
                  <p className="text-sm mt-2 text-center">
                    Last updated: {lastUpdate.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Available Actions */}
              <div className="grid gap-4 md:grid-cols-2">
                <motion.div variants={itemVariants}>
                  <Link href="/">
                    <Button variant="outline" className="w-full h-auto p-4 wedding-button">
                      <div className="flex flex-col items-center space-y-2">
                        <Home className="w-6 h-6" />
                        <span>Return Home</span>
                        <span className="text-xs text-muted-foreground">
                          View cached content
                        </span>
                      </div>
                    </Button>
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Link href="/gallery">
                    <Button variant="outline" className="w-full h-auto p-4 wedding-button">
                      <div className="flex flex-col items-center space-y-2">
                        <Calendar className="w-6 h-6" />
                        <span>Photo Gallery</span>
                        <span className="text-xs text-muted-foreground">
                          Browse saved photos
                        </span>
                      </div>
                    </Button>
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Link href="/story">
                    <Button variant="outline" className="w-full h-auto p-4 wedding-button">
                      <div className="flex flex-col items-center space-y-2">
                        <Heart className="w-6 h-6" />
                        <span>Our Story</span>
                        <span className="text-xs text-muted-foreground">
                          Read our timeline
                        </span>
                      </div>
                    </Button>
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Link href="/guestbook">
                    <Button variant="outline" className="w-full h-auto p-4 wedding-button">
                      <div className="flex flex-col items-center space-y-2">
                        <MessageCircle className="w-6 h-6" />
                        <span>Guest Book</span>
                        <span className="text-xs text-muted-foreground">
                          {isOnline ? 'Leave a message' : 'Draft messages'}
                        </span>
                      </div>
                    </Button>
                  </Link>
                </motion.div>
              </div>

              {/* Refresh Button */}
              <motion.div variants={itemVariants}>
                <Button
                  onClick={handleRefresh}
                  disabled={!isOnline}
                  className="w-full wedding-button"
                  size="lg"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${!isOnline ? 'animate-spin' : ''}`} />
                  {isOnline ? 'Refresh Page' : 'Waiting for Connection...'}
                </Button>
              </motion.div>

              {/* Offline Features */}
              {!isOnline && (
                <motion.div variants={itemVariants}>
                  <div className="p-4 bg-sage-green/5 border border-sage-green/20 rounded-lg">
                    <h4 className="font-medium text-sage-green mb-2">
                      What you can do offline:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Browse cached photos and content</li>
                      <li>• Read our love story timeline</li>
                      <li>• Draft messages for the guest book</li>
                      <li>• View wedding details and information</li>
                      <li>• Prepare your RSVP (will sync when online)</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Romantic Quote */}
        <motion.div variants={itemVariants} className="mt-8">
          <blockquote className="text-lg italic text-sage-green/80 font-serif">
            "Love doesn't need wifi to connect two hearts"
          </blockquote>
          <p className="text-sm text-muted-foreground mt-2">
            - Sakshi & Lakshay
          </p>
        </motion.div>
      </motion.div>
    </Container>
  );
}
