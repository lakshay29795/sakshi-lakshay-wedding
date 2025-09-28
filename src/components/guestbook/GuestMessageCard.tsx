'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, HeartHandshake, Star, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { GuestMessage } from '@/types/guestbook';

interface GuestMessageCardProps {
  message: GuestMessage;
  onLike?: (messageId: string) => void;
  onUnlike?: (messageId: string) => void;
  isLiked?: boolean;
  showActions?: boolean;
  className?: string;
}

export function GuestMessageCard({
  message,
  onLike,
  onUnlike,
  isLiked = false,
  showActions = true,
  className,
}: GuestMessageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      if (isLiked && onUnlike) {
        await onUnlike(message.id);
      } else if (!isLiked && onLike) {
        await onLike(message.id);
      }
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn('group', className)}
    >
      <Card className={cn(
        'wedding-card transition-all duration-300',
        message.isHighlighted && 'ring-2 ring-rose-gold/50 bg-gradient-to-br from-rose-gold/5 to-blush-pink/5',
        isHovered && 'shadow-lg'
      )}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold',
                message.isHighlighted 
                  ? 'bg-gradient-to-br from-rose-gold to-blush-pink' 
                  : 'bg-gradient-to-br from-sage-green to-sage-green/80'
              )}>
                {message.isHighlighted ? (
                  <Star className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              
              {/* Name and Date */}
              <div>
                <h4 className={cn(
                  'font-semibold',
                  message.isHighlighted ? 'text-rose-gold' : 'text-charcoal'
                )}>
                  {message.guestName}
                  {message.isHighlighted && (
                    <Star className="inline w-4 h-4 ml-1 text-rose-gold" />
                  )}
                </h4>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(message.submittedAt)}</span>
                </div>
              </div>
            </div>

            {/* Like Button */}
            {showActions && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-2"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    disabled={isLiking}
                    className={cn(
                      'transition-all duration-200 hover:scale-110',
                      isLiked 
                        ? 'text-rose-gold hover:text-rose-gold/80' 
                        : 'text-muted-foreground hover:text-rose-gold'
                    )}
                  >
                    <motion.div
                      animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {isLiked ? (
                        <HeartHandshake className="w-4 h-4 fill-current" />
                      ) : (
                        <Heart className="w-4 h-4" />
                      )}
                    </motion.div>
                    {(message.likes || 0) > 0 && (
                      <span className="ml-1 text-xs">
                        {message.likes}
                      </span>
                    )}
                  </Button>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Message Content */}
          <div className={cn(
            'prose prose-sm max-w-none',
            message.isHighlighted && 'prose-rose-gold'
          )}>
            <p className="text-charcoal leading-relaxed whitespace-pre-wrap">
              {message.message}
            </p>
          </div>

          {/* Highlighted Badge */}
          {message.isHighlighted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 inline-flex items-center space-x-1 px-3 py-1 bg-rose-gold/10 text-rose-gold text-xs font-medium rounded-full border border-rose-gold/20"
            >
              <Star className="w-3 h-3 fill-current" />
              <span>Highlighted by the couple</span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
