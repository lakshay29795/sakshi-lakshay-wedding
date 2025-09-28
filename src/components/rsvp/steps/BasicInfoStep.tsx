'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import type { RSVPFormInput } from '@/lib/validations/rsvp';
// import type { UseRSVPFormReturn } from '@/hooks/useRSVPForm';

interface BasicInfoStepProps {
  form: UseFormReturn<RSVPFormInput>;
  rsvpForm: any; // UseRSVPFormReturn type
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

export function BasicInfoStep({ form, className }: BasicInfoStepProps) {
  const { control } = form;

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
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h3 className="text-2xl font-serif text-sage-green mb-2">
            Let's start with your details
          </h3>
          <p className="text-muted-foreground">
            We need your contact information to send you updates about the wedding.
          </p>
        </motion.div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Full Name */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="primaryGuestName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-sage-green" />
                    <span>Full Name *</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your full name"
                      className="wedding-input"
                      autoComplete="name"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="primaryGuestEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-sage-green" />
                    <span>Email Address *</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email address"
                      className="wedding-input"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll use this to send you wedding updates and confirmation.
                  </p>
                </FormItem>
              )}
            />
          </motion.div>

          {/* Phone (Optional) */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-sage-green" />
                    <span>Phone Number</span>
                    <span className="text-xs text-muted-foreground">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="Enter your phone number"
                      className="wedding-input"
                      autoComplete="tel"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-1">
                    We may use this for last-minute updates or emergencies.
                  </p>
                </FormItem>
              )}
            />
          </motion.div>
        </div>

        {/* Privacy Notice */}
        <motion.div
          variants={itemVariants}
          className="mt-8 p-4 bg-sage-green/5 border border-sage-green/20 rounded-lg"
        >
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 rounded-full bg-sage-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-sage-green" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-sage-green mb-1">
                Privacy & Communication
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your information will only be used for wedding-related communications. 
                We won't share your details with third parties or use them for marketing purposes.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Visual Enhancement */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mt-8"
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
