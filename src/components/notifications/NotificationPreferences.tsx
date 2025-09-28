'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Heart, 
  Calendar, 
  MessageCircle, 
  Users, 
  Moon, 
  Clock,
  Save,
  TestTube,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  getCurrentSubscription,
  updateNotificationPreferences,
  sendTestNotification,
  type NotificationPreferences,
  defaultNotificationPreferences
} from '@/lib/firebase/messaging';
import { toast } from 'sonner';

interface NotificationPreferencesProps {
  className?: string;
}

export function NotificationPreferences({ className }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultNotificationPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Load current preferences
    const subscription = getCurrentSubscription();
    if (subscription) {
      setIsSubscribed(true);
      setPreferences(subscription.preferences);
    }
  }, []);

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleQuietHoursChange = (key: 'enabled' | 'start' | 'end', value: any) => {
    setPreferences(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      const success = await updateNotificationPreferences(preferences);
      
      if (success) {
        setHasChanges(false);
        toast.success('Notification preferences saved successfully!');
      } else {
        toast.error('Failed to save preferences. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error('Failed to save preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async (type: 'connection' | 'daily-love' | 'wedding-reminder') => {
    try {
      const success = await sendTestNotification();
      if (success) {
        toast.success(`Test notification sent! Check your notifications.`);
      } else {
        toast.error('Failed to send test notification.');
      }
    } catch (error) {
      console.error('Failed to send test notification:', error);
      toast.error('Failed to send test notification.');
    }
  };

  const getTimezoneOptions = () => {
    const timezones = [
      'America/New_York',
      'America/Chicago', 
      'America/Denver',
      'America/Los_Angeles',
      'America/Anchorage',
      'Pacific/Honolulu',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Australia/Sydney',
    ];
    
    return timezones.map(tz => ({
      value: tz,
      label: tz.replace('_', ' ').replace('/', ' / ')
    }));
  };

  if (!isSubscribed) {
    return (
      <Card className={`wedding-card ${className}`}>
        <CardContent className="p-6 text-center">
          <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Notifications Not Enabled
          </h3>
          <p className="text-sm text-muted-foreground">
            Enable push notifications first to customize your preferences.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card className="wedding-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-sage-green" />
            <span>Notification Preferences</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Customize when and how you receive updates about our wedding.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Notification Types */}
          <div className="space-y-4">
            <h4 className="font-medium text-sage-green">Notification Types</h4>
            
            {/* Daily Love Messages */}
            <div className="flex items-center justify-between p-4 bg-blush-pink/5 rounded-lg border border-blush-pink/20">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-blush-pink" />
                <div>
                  <Label className="font-medium">Daily Love Messages</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive romantic messages and quotes every day
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTestNotification('daily-love')}
                  className="text-xs"
                >
                  <TestTube className="w-3 h-3" />
                </Button>
                <Switch
                  checked={preferences.dailyLoveMessages}
                  onCheckedChange={(checked) => handlePreferenceChange('dailyLoveMessages', checked)}
                />
              </div>
            </div>

            {/* Wedding Reminders */}
            <div className="flex items-center justify-between p-4 bg-sage-green/5 rounded-lg border border-sage-green/20">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-sage-green" />
                <div>
                  <Label className="font-medium">Wedding Reminders</Label>
                  <p className="text-xs text-muted-foreground">
                    Countdown updates and important wedding dates
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTestNotification('wedding-reminder')}
                  className="text-xs"
                >
                  <TestTube className="w-3 h-3" />
                </Button>
                <Switch
                  checked={preferences.weddingReminders}
                  onCheckedChange={(checked) => handlePreferenceChange('weddingReminders', checked)}
                />
              </div>
            </div>

            {/* RSVP Reminders */}
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-amber-600" />
                <div>
                  <Label className="font-medium">RSVP Reminders</Label>
                  <p className="text-xs text-muted-foreground">
                    Gentle reminders to respond to our invitation
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.rsvpReminders}
                onCheckedChange={(checked) => handlePreferenceChange('rsvpReminders', checked)}
              />
            </div>

            {/* Guest Book Updates */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <Label className="font-medium">Guest Book Updates</Label>
                  <p className="text-xs text-muted-foreground">
                    New messages and interactions in the guest book
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.guestBookUpdates}
                onCheckedChange={(checked) => handlePreferenceChange('guestBookUpdates', checked)}
              />
            </div>

            {/* General Updates */}
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-purple-600" />
                <div>
                  <Label className="font-medium">General Updates</Label>
                  <p className="text-xs text-muted-foreground">
                    Website updates, photo additions, and announcements
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.generalUpdates}
                onCheckedChange={(checked) => handlePreferenceChange('generalUpdates', checked)}
              />
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="space-y-4">
            <h4 className="font-medium text-sage-green">Quiet Hours</h4>
            
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Moon className="w-5 h-5 text-slate-600" />
                  <div>
                    <Label className="font-medium">Enable Quiet Hours</Label>
                    <p className="text-xs text-muted-foreground">
                      Pause notifications during your sleep hours
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.quietHours.enabled}
                  onCheckedChange={(checked) => handleQuietHoursChange('enabled', checked)}
                />
              </div>

              {preferences.quietHours.enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Start Time</Label>
                    <Input
                      type="time"
                      value={preferences.quietHours.start}
                      onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">End Time</Label>
                    <Input
                      type="time"
                      value={preferences.quietHours.end}
                      onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Timezone */}
          <div className="space-y-4">
            <h4 className="font-medium text-sage-green">Timezone</h4>
            
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-3 mb-3">
                <Clock className="w-5 h-5 text-slate-600" />
                <div>
                  <Label className="font-medium">Your Timezone</Label>
                  <p className="text-xs text-muted-foreground">
                    Used for scheduling notifications at appropriate times
                  </p>
                </div>
              </div>
              
              <Select
                value={preferences.timezone}
                onValueChange={(value) => handlePreferenceChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your timezone" />
                </SelectTrigger>
                <SelectContent>
                  {getTimezoneOptions().map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Test Notifications */}
          <div className="space-y-4">
            <h4 className="font-medium text-sage-green">Test Notifications</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestNotification('connection')}
                className="flex items-center justify-center space-x-2"
              >
                <TestTube className="w-4 h-4" />
                <span>Connection</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestNotification('daily-love')}
                className="flex items-center justify-center space-x-2"
                disabled={!preferences.dailyLoveMessages}
              >
                <Heart className="w-4 h-4" />
                <span>Love Message</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestNotification('wedding-reminder')}
                className="flex items-center justify-center space-x-2"
                disabled={!preferences.weddingReminders}
              >
                <Calendar className="w-4 h-4" />
                <span>Reminder</span>
              </Button>
            </div>
          </div>

          {/* Save Button */}
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4 border-t border-sage-green/20"
            >
              <Button
                onClick={handleSavePreferences}
                disabled={isSaving}
                className="w-full wedding-button"
                size="lg"
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Save className="w-4 h-4" />
                    </motion.div>
                    Saving Preferences...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
