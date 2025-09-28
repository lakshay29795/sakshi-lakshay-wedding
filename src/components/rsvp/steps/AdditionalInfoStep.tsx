'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Music, Bed, Car, Heart, Send } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import type { RSVPFormInput } from '@/lib/validations/rsvp';

interface AdditionalInfoStepProps {
  form: UseFormReturn<RSVPFormInput>;
  rsvpForm: any;
  isAttending?: boolean;
  className?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function AdditionalInfoStep({ form, isAttending, className }: AdditionalInfoStepProps) {
  const { control, watch } = form;
  const watchedValues = watch();

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h3 className="text-2xl font-serif text-sage-green mb-2">
            {isAttending ? "Almost done!" : "One last thing..."}
          </h3>
          <p className="text-muted-foreground">
            {isAttending 
              ? "Help us make your experience perfect with these final details."
              : "Even though you can't make it, we'd love to hear from you."
            }
          </p>
        </motion.div>

        {/* Message Field */}
        <motion.div variants={itemVariants}>
          <FormField
            control={control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-sage-green" />
                  <span>
                    {isAttending 
                      ? "Special Message or Notes" 
                      : "Message for the Happy Couple"
                    }
                  </span>
                  <span className="text-muted-foreground">(Optional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      isAttending
                        ? "Any special requests, congratulations, or notes you'd like to share..."
                        : "We'd love to hear your well wishes and congratulations..."
                    }
                    className="wedding-input min-h-[100px]"
                    maxLength={500}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-muted-foreground">
                  {(field.value?.length || 0)}/500 characters
                </p>
              </FormItem>
            )}
          />
        </motion.div>

        {/* Attending-specific fields */}
        {isAttending && (
          <>
            {/* Song Request */}
            <motion.div variants={itemVariants}>
            <FormField
              control={control}
              name="songRequest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <Music className="w-4 h-4 text-sage-green" />
                      <span>Song Request</span>
                      <span className="text-muted-foreground">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Any song you'd love to hear at the reception?"
                        className="wedding-input"
                        maxLength={100}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Help us create the perfect playlist for our celebration!
                    </p>
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Additional Services */}
            <motion.div variants={itemVariants}>
              <Card className="wedding-card">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-sage-green mb-4 flex items-center">
                    <Car className="w-4 h-4 mr-2" />
                    Additional Services
                  </h4>
                  <div className="space-y-4">
                    {/* Accommodation */}
                    <FormField
                      control={control}
                      name="accommodationNeeded"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="flex items-center space-x-2">
                              <Bed className="w-4 h-4" />
                              <span>I need accommodation recommendations</span>
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              We'll send you a list of nearby hotels with special rates
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Transportation */}
                    <FormField
                      control={control}
                      name="transportationNeeded"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="flex items-center space-x-2">
                              <Car className="w-4 h-4" />
                              <span>I need transportation information</span>
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Details about parking, shuttle services, and directions
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {/* RSVP Summary */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-sage-green/5 to-blush-pink/5 border-sage-green/20">
            <CardContent className="p-6">
              <h4 className="font-semibold text-sage-green mb-4 flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                RSVP Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{watchedValues.primaryGuestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{watchedValues.primaryGuestEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Attending:</span>
                  <span className={`font-medium ${isAttending ? 'text-sage-green' : 'text-rose-gold'}`}>
                    {isAttending ? "Yes, I'll be there!" : "Sorry, can't make it"}
                  </span>
                </div>
                {isAttending && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Guests:</span>
                    <span className="font-medium">{watchedValues.guests?.length || 0}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Final Message */}
        <motion.div
          variants={itemVariants}
          className="text-center p-6 bg-gradient-to-r from-sage-green/10 to-blush-pink/10 rounded-lg border border-sage-green/20"
        >
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-sage-green/20 flex items-center justify-center">
              <Send className="w-6 h-6 text-sage-green" />
            </div>
          </div>
          <h4 className="font-serif text-lg text-sage-green mb-2">
            {isAttending ? "Ready to celebrate!" : "Thank you for responding"}
          </h4>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {isAttending 
              ? "Click 'Send RSVP' to confirm your attendance. We'll send you a confirmation email with all the details."
              : "Click 'Confirm Response' to let us know. We appreciate you taking the time to respond."
            }
          </p>
        </motion.div>

        {/* Visual Enhancement */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center"
        >
          <div className="flex items-center space-x-2 text-sage-green/60">
            <div className="w-1 h-1 rounded-full bg-current" />
            <div className="w-2 h-2 rounded-full bg-current" />
            <div className="w-1 h-1 rounded-full bg-current" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
