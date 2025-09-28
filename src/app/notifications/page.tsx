'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Heart, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { NotificationPermissionFlow } from '@/components/notifications/NotificationPermissionFlow';
import { NotificationPreferences } from '@/components/notifications/NotificationPreferences';
import { onForegroundMessage } from '@/lib/firebase/messaging';
import { toast } from 'sonner';

export default function NotificationsPage() {
  useEffect(() => {
    // Listen for foreground messages
    const unsubscribe = onForegroundMessage((payload) => {
      // Show toast for foreground messages
      if (payload.notification) {
        toast.success(payload.notification.title || 'New notification', {
          description: payload.notification.body,
        });
      }
    });

    return unsubscribe;
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-blush-pink/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-subtle-dots opacity-30" />
      
      {/* Content */}
      <div className="relative">
        <Container className="py-24">
          <motion.div
            className="max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-12">
              <div className="relative mb-6">
                <Bell className="w-16 h-16 mx-auto text-sage-green" />
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-6 h-6 text-blush-pink fill-current" />
                </motion.div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-serif text-sage-green mb-4">
                Stay Connected
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Never miss a moment of our love story. Get personalized notifications about our wedding journey, 
                daily love messages, and important updates.
              </p>
            </motion.div>

            {/* Features Overview */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-white/50 rounded-lg border border-sage-green/20">
                <Heart className="w-8 h-8 mx-auto text-blush-pink mb-3" />
                <h3 className="font-semibold text-sage-green mb-2">Daily Love Messages</h3>
                <p className="text-sm text-muted-foreground">
                  Romantic quotes and messages to brighten your day
                </p>
              </div>
              
              <div className="text-center p-6 bg-white/50 rounded-lg border border-sage-green/20">
                <Sparkles className="w-8 h-8 mx-auto text-amber-500 mb-3" />
                <h3 className="font-semibold text-sage-green mb-2">Wedding Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Countdown reminders and important wedding information
                </p>
              </div>
              
              <div className="text-center p-6 bg-white/50 rounded-lg border border-sage-green/20">
                <Bell className="w-8 h-8 mx-auto text-sage-green mb-3" />
                <h3 className="font-semibold text-sage-green mb-2">Smart Timing</h3>
                <p className="text-sm text-muted-foreground">
                  Respects your quiet hours and timezone preferences
                </p>
              </div>
            </motion.div>

            {/* Permission Flow */}
            <motion.div variants={itemVariants} className="mb-8">
              <NotificationPermissionFlow
                showPreferences={false}
                onPermissionChange={(granted) => {
                  if (granted) {
                    toast.success('🎉 Welcome to our notification family!');
                  }
                }}
              />
            </motion.div>

            {/* Detailed Preferences */}
            <motion.div variants={itemVariants}>
              <NotificationPreferences />
            </motion.div>

            {/* Information Section */}
            <motion.div variants={itemVariants} className="mt-12 text-center">
              <div className="bg-sage-green/5 border border-sage-green/20 rounded-lg p-6">
                <h3 className="font-semibold text-sage-green mb-3">
                  Privacy & Control
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    • Your notification preferences are stored securely and can be changed anytime
                  </p>
                  <p>
                    • We respect your quiet hours and will never send notifications during your sleep time
                  </p>
                  <p>
                    • You can unsubscribe from all notifications at any time
                  </p>
                  <p>
                    • Notifications work even when the website is closed (PWA magic! ✨)
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Romantic Quote */}
            <motion.div variants={itemVariants} className="mt-12 text-center">
              <blockquote className="text-xl italic text-sage-green/80 font-serif">
                "Love is not just looking at each other, it's looking in the same direction"
              </blockquote>
              <p className="text-sm text-muted-foreground mt-2">
                - Antoine de Saint-Exupéry
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </div>
    </div>
  );
}
