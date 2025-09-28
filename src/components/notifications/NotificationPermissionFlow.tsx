'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, Heart, Check, X, Settings, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  subscribeToPushNotifications, 
  unsubscribeFromPushNotifications,
  getCurrentSubscription,
  sendTestNotification,
  type NotificationPreferences,
  defaultNotificationPreferences
} from '@/lib/firebase/messaging';
import { toast } from 'sonner';

interface NotificationPermissionFlowProps {
  onPermissionChange?: (granted: boolean) => void;
  showPreferences?: boolean;
  className?: string;
}

export function NotificationPermissionFlow({ 
  onPermissionChange, 
  showPreferences = true,
  className 
}: NotificationPermissionFlowProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultNotificationPreferences);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check current permission status
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Check if already subscribed
      const subscription = getCurrentSubscription();
      if (subscription) {
        setIsSubscribed(true);
        setPreferences(subscription.preferences);
      }
    }
  }, []);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      const subscription = await subscribeToPushNotifications(preferences);
      
      if (subscription) {
        setIsSubscribed(true);
        setPermission('granted');
        toast.success('🔔 Notifications enabled! You\'ll receive updates about our wedding.');
        onPermissionChange?.(true);
      } else {
        toast.error('Failed to enable notifications. Please try again.');
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error);
      toast.error('Failed to enable notifications. Please check your browser settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setIsLoading(true);
    try {
      const success = await unsubscribeFromPushNotifications();
      
      if (success) {
        setIsSubscribed(false);
        toast.success('Notifications disabled successfully.');
        onPermissionChange?.(false);
      } else {
        toast.error('Failed to disable notifications. Please try again.');
      }
    } catch (error) {
      console.error('Failed to disable notifications:', error);
      toast.error('Failed to disable notifications.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      const success = await sendTestNotification();
      if (success) {
        toast.success('Test notification sent! Check your notifications.');
      } else {
        toast.error('Failed to send test notification.');
      }
    } catch (error) {
      console.error('Failed to send test notification:', error);
      toast.error('Failed to send test notification.');
    }
  };

  const getPermissionStatus = () => {
    if (permission === 'granted' && isSubscribed) {
      return { status: 'enabled', color: 'text-green-600', bg: 'bg-green-100' };
    } else if (permission === 'granted' && !isSubscribed) {
      return { status: 'available', color: 'text-blue-600', bg: 'bg-blue-100' };
    } else if (permission === 'denied') {
      return { status: 'blocked', color: 'text-red-600', bg: 'bg-red-100' };
    } else {
      return { status: 'default', color: 'text-amber-600', bg: 'bg-amber-100' };
    }
  };

  const statusInfo = getPermissionStatus();

  if (permission === 'denied') {
    return (
      <Card className={`wedding-card border-red-200 ${className}`}>
        <CardContent className="p-6 text-center">
          <BellOff className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            Notifications Blocked
          </h3>
          <p className="text-sm text-red-600 mb-4">
            Notifications are blocked in your browser. To enable them:
          </p>
          <div className="text-xs text-red-600 space-y-1 mb-4">
            <p>1. Click the lock icon in your address bar</p>
            <p>2. Set notifications to "Allow"</p>
            <p>3. Refresh this page</p>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="sm"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            Refresh Page
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card className="wedding-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-sage-green" />
              <span>Push Notifications</span>
            </div>
            <Badge variant="outline" className={`${statusInfo.bg} ${statusInfo.color} border-current`}>
              {statusInfo.status}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Main Action */}
          {!isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="mb-4">
                <Heart className="w-16 h-16 mx-auto text-blush-pink mb-3" />
                <h3 className="text-lg font-semibold text-sage-green mb-2">
                  Stay Connected to Our Love Story
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get daily love messages, wedding reminders, and special updates right on your device.
                </p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Daily romantic messages</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Wedding countdown reminders</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>RSVP and guest book updates</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Respect your quiet hours</span>
                </div>
              </div>

              <Button
                onClick={handleEnableNotifications}
                disabled={isLoading}
                className="w-full wedding-button"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Bell className="w-4 h-4" />
                    </motion.div>
                    Enabling Notifications...
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Enable Notifications
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="mb-4">
                <div className="relative">
                  <Bell className="w-16 h-16 mx-auto text-green-500 mb-3" />
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Check className="w-6 h-6 text-green-500 bg-white rounded-full" />
                  </motion.div>
                </div>
                <h3 className="text-lg font-semibold text-green-700 mb-2">
                  Notifications Enabled!
                </h3>
                <p className="text-sm text-muted-foreground">
                  You're all set to receive updates about our wedding journey.
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleTestNotification}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Test
                </Button>
                <Button
                  onClick={() => setShowDetails(!showDetails)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button
                  onClick={handleDisableNotifications}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <BellOff className="w-4 h-4 mr-2" />
                  Disable
                </Button>
              </div>
            </motion.div>
          )}

          {/* Preferences Details */}
          <AnimatePresence>
            {showDetails && isSubscribed && showPreferences && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-sage-green/20 pt-6"
              >
                <h4 className="font-medium text-sage-green mb-4">Notification Preferences</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Daily Love Messages</span>
                      <p className="text-xs text-muted-foreground">Romantic messages every day</p>
                    </div>
                    <Badge variant={preferences.dailyLoveMessages ? "default" : "secondary"}>
                      {preferences.dailyLoveMessages ? "On" : "Off"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Wedding Reminders</span>
                      <p className="text-xs text-muted-foreground">Countdown and important dates</p>
                    </div>
                    <Badge variant={preferences.weddingReminders ? "default" : "secondary"}>
                      {preferences.weddingReminders ? "On" : "Off"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">RSVP Reminders</span>
                      <p className="text-xs text-muted-foreground">Gentle reminders to RSVP</p>
                    </div>
                    <Badge variant={preferences.rsvpReminders ? "default" : "secondary"}>
                      {preferences.rsvpReminders ? "On" : "Off"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Quiet Hours</span>
                      <p className="text-xs text-muted-foreground">
                        {preferences.quietHours.enabled 
                          ? `${preferences.quietHours.start} - ${preferences.quietHours.end}`
                          : "No quiet hours set"
                        }
                      </p>
                    </div>
                    <Badge variant={preferences.quietHours.enabled ? "default" : "secondary"}>
                      {preferences.quietHours.enabled ? "On" : "Off"}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-sage-green/10">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      // TODO: Open detailed preferences modal
                      toast.info('Detailed preferences coming soon!');
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Customize Preferences
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
