'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Sparkles, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useGuestBook } from '@/hooks/useGuestBook';
import { GuestMessageForm } from '@/components/guestbook/GuestMessageForm';
import { GuestMessageCard } from '@/components/guestbook/GuestMessageCard';
import { GuestBookFilters } from '@/components/guestbook/GuestBookFilters';
import { GuestBookStatsComponent } from '@/components/guestbook/GuestBookStats';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function GuestBookPage() {
  const [showForm, setShowForm] = useState(false);
  const {
    form,
    isSubmitting,
    submitMessage,
    messages,
    isLoading,
    error,
    refreshMessages,
    filters,
    setFilters,
    filteredMessages,
    stats,
    isConnected,
    likeMessage,
    unlikeMessage,
  } = useGuestBook();

  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());

  const handleLike = async (messageId: string) => {
    try {
      await likeMessage(messageId);
      setLikedMessages(prev => new Set([...prev, messageId]));
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleUnlike = async (messageId: string) => {
    try {
      await unlikeMessage(messageId);
      setLikedMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-sage-green/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-subtle-dots opacity-30" />

      {/* Content */}
      <div className="relative">
        <Container className="py-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Heart className="w-8 h-8 text-blush-pink" />
                <h1 className="text-4xl md:text-5xl font-serif text-sage-green">
                  Guest Book
                </h1>
                <Heart className="w-8 h-8 text-blush-pink" />
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Share your love, wishes, and memories with us. Your words mean the world to us 
                as we begin this beautiful journey together.
              </p>
              
              {/* Connection Status */}
              <div className="flex items-center justify-center space-x-2 text-sm">
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600">Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-rose-gold" />
                    <span className="text-rose-gold">Offline</span>
                  </>
                )}
              </div>
            </motion.div>

            {/* Stats */}
            {stats && (
              <motion.div variants={itemVariants}>
                <GuestBookStatsComponent stats={stats} />
              </motion.div>
            )}

            {/* Write Message Button */}
            <motion.div variants={itemVariants} className="text-center">
              <Button
                onClick={() => setShowForm(!showForm)}
                className={cn(
                  'wedding-button-secondary text-lg px-8 py-3',
                  showForm && 'wedding-button'
                )}
                size="lg"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                {showForm ? 'Hide Form' : 'Write a Message'}
              </Button>
            </motion.div>

            {/* Message Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <GuestMessageForm
                    onSubmit={async (data) => {
                      await submitMessage(data);
                      setShowForm(false);
                    }}
                    isSubmitting={isSubmitting}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filters */}
            <motion.div variants={itemVariants}>
              <GuestBookFilters
                filters={filters}
                onFiltersChange={setFilters}
                messageCount={filteredMessages.length}
              />
            </motion.div>

            {/* Refresh Button */}
            <motion.div variants={itemVariants} className="flex justify-center">
              <Button
                onClick={refreshMessages}
                disabled={isLoading}
                variant="outline"
                className="wedding-button-secondary"
              >
                <RefreshCw className={cn('mr-2 w-4 h-4', isLoading && 'animate-spin')} />
                Refresh Messages
              </Button>
            </motion.div>

            {/* Messages */}
            <motion.div variants={itemVariants}>
              {error && (
                <Card className="wedding-card border-rose-gold/20 bg-rose-gold/5">
                  <CardContent className="p-6 text-center">
                    <p className="text-rose-gold">{error}</p>
                    <Button
                      onClick={refreshMessages}
                      className="mt-4 wedding-button-secondary"
                    >
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              )}

              {isLoading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="wedding-card">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-20 w-full" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredMessages.length === 0 ? (
                <Card className="wedding-card">
                  <CardContent className="p-12 text-center">
                    <Sparkles className="w-12 h-12 text-sage-green mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-charcoal mb-2">
                      No messages yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Be the first to share your love and wishes!
                    </p>
                    <Button
                      onClick={() => setShowForm(true)}
                      className="wedding-button"
                    >
                      Write the First Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence>
                    {filteredMessages.map((message) => (
                      <GuestMessageCard
                        key={message.id}
                        message={message}
                        onLike={handleLike}
                        onUnlike={handleUnlike}
                        isLiked={likedMessages.has(message.id)}
                        showActions={message.status === 'approved'}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>

            {/* Footer Message */}
            <motion.div
              variants={itemVariants}
              className="text-center pt-12 border-t border-border"
            >
              <div className="flex items-center justify-center space-x-2 text-sage-green mb-4">
                <Heart className="w-5 h-5" />
                <span className="font-serif text-lg">Sakshi & Lakshay</span>
                <Heart className="w-5 h-5" />
              </div>
              <p className="text-muted-foreground italic">
                "Every message in this book is a treasure we'll cherish forever. 
                Thank you for being part of our love story."
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </div>
    </div>
  );
}
