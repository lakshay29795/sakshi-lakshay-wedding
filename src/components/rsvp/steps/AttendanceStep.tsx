'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, HeartHandshake, Calendar, MapPin } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import type { RSVPFormInput } from '@/lib/validations/rsvp';

interface AttendanceStepProps {
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

export function AttendanceStep({ form, isAttending, className }: AttendanceStepProps) {
  const { control, setValue, watch } = form;
  const watchedAttendance = watch('isAttending');

  const handleAttendanceChange = (attending: boolean) => {
    setValue('isAttending', attending, { shouldValidate: true });
  };

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
      <div className="space-y-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h3 className="text-2xl font-serif text-sage-green mb-2">
            Will you be joining us?
          </h3>
          <p className="text-muted-foreground">
            We're so excited to celebrate with you! Please let us know if you can make it.
          </p>
        </motion.div>

        {/* Wedding Details */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-sage-green/5 to-blush-pink/5 border border-sage-green/20 rounded-lg p-6"
        >
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sage-green">
              <Heart className="w-5 h-5" />
              <h4 className="font-serif text-lg">Sakshi & Lakshay's Wedding</h4>
              <Heart className="w-5 h-5" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>November 12, 2025 at 4:00 PM</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Rosewood Manor, Evergreen</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Attendance Options */}
        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="isAttending"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Yes, I'll be there */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAttendanceChange(true)}
                        className={cn(
                          "w-full h-auto p-6 flex flex-col items-center space-y-3 border-2 transition-all duration-300",
                          watchedAttendance === true
                            ? "border-sage-green bg-sage-green/10 text-sage-green"
                            : "border-border hover:border-sage-green/50"
                        )}
                      >
                        <motion.div
                          animate={{ 
                            scale: watchedAttendance === true ? 1.1 : 1,
                            rotate: watchedAttendance === true ? [0, -10, 10, 0] : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <HeartHandshake className="w-8 h-8" />
                        </motion.div>
                        <div className="text-center">
                          <h4 className="font-semibold text-base mb-1">
                            Yes, I'll be there!
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Can't wait to celebrate with you
                          </p>
                        </div>
                        
                        {watchedAttendance === true && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-sage-green flex items-center justify-center"
                          >
                            <Heart className="w-3 h-3 text-white fill-current" />
                          </motion.div>
                        )}
                      </Button>
                    </motion.div>

                    {/* Sorry, can't make it */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAttendanceChange(false)}
                        className={cn(
                          "w-full h-auto p-6 flex flex-col items-center space-y-3 border-2 transition-all duration-300",
                          watchedAttendance === false
                            ? "border-rose-gold bg-rose-gold/10 text-rose-gold"
                            : "border-border hover:border-rose-gold/50"
                        )}
                      >
                        <motion.div
                          animate={{ 
                            scale: watchedAttendance === false ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart className="w-8 h-8" />
                        </motion.div>
                        <div className="text-center">
                          <h4 className="font-semibold text-base mb-1">
                            Sorry, can't make it
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            We'll miss you on our special day
                          </p>
                        </div>
                        
                        {watchedAttendance === false && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-rose-gold flex items-center justify-center"
                          >
                            <Heart className="w-3 h-3 text-white fill-current" />
                          </motion.div>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </motion.div>

        {/* Response Message */}
        {watchedAttendance !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "text-center p-4 rounded-lg border",
              watchedAttendance
                ? "bg-sage-green/10 border-sage-green/20 text-sage-green"
                : "bg-rose-gold/10 border-rose-gold/20 text-rose-gold"
            )}
          >
            {watchedAttendance ? (
              <div>
                <h4 className="font-semibold mb-1">Wonderful! 🎉</h4>
                <p className="text-sm">
                  We're so excited to celebrate with you. Next, we'll need some details about your party.
                </p>
              </div>
            ) : (
              <div>
                <h4 className="font-semibold mb-1">We understand 💕</h4>
                <p className="text-sm">
                  We're sad you can't make it, but we appreciate you letting us know. 
                  You can still leave us a message in the final step.
                </p>
              </div>
            )}
          </motion.div>
        )}

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
