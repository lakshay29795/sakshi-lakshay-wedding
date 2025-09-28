'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Users, Utensils, AlertCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { RSVPFormInput } from '@/lib/validations/rsvp';
import type { Guest, MealPreference } from '@/types/rsvp';

interface GuestDetailsStepProps {
  form: UseFormReturn<RSVPFormInput>;
  rsvpForm: any;
  isAttending?: boolean;
  className?: string;
}

const mealOptions: { value: MealPreference; label: string; description: string }[] = [
  { value: 'regular', label: 'Regular', description: 'Includes meat and all ingredients' },
  { value: 'vegetarian', label: 'Vegetarian', description: 'No meat, but includes dairy and eggs' },
  { value: 'vegan', label: 'Vegan', description: 'No animal products' },
  { value: 'gluten-free', label: 'Gluten-Free', description: 'No wheat, barley, or rye' },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const guestCardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -20,
    transition: { duration: 0.2 },
  },
};

export function GuestDetailsStep({ form, rsvpForm, isAttending, className }: GuestDetailsStepProps) {
  const { control, watch, setValue, getValues } = form;
  const { addGuest, removeGuest, updateGuest } = rsvpForm;
  
  const guests = watch('guests') || [];
  const totalGuests = watch('totalGuests') || 1;

  if (!isAttending) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
      >
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-gold/20 flex items-center justify-center">
            <Users className="w-8 h-8 text-rose-gold" />
          </div>
          <h3 className="text-xl font-serif text-rose-gold mb-2">
            This step is not needed
          </h3>
          <p className="text-muted-foreground">
            Since you won't be attending, we'll skip the guest details and move to the final step.
          </p>
        </div>
      </motion.div>
    );
  }

  const handleGuestUpdate = (guestId: string, field: keyof Guest, value: any) => {
    updateGuest(guestId, { [field]: value });
  };

  const canAddGuest = guests.length < 10;
  const canRemoveGuest = guests.length > 1;

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
            Tell us about your party
          </h3>
          <p className="text-muted-foreground">
            We need details about each guest for seating and catering arrangements.
          </p>
        </motion.div>

        {/* Guest Count Summary */}
        <motion.div
          variants={itemVariants}
          className="bg-sage-green/5 border border-sage-green/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-sage-green" />
              <span className="font-medium text-sage-green">
                Total Guests: {guests.length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeGuest(guests[guests.length - 1]?.id)}
                disabled={!canRemoveGuest}
                className="h-8 w-8 p-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addGuest}
                disabled={!canAddGuest}
                className="h-8 w-8 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {guests.length >= 8 && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              Maximum 10 guests allowed per RSVP
            </p>
          )}
        </motion.div>

        {/* Guest Cards */}
        <motion.div variants={itemVariants} className="space-y-4">
          <AnimatePresence>
            {guests.map((guest, index) => (
              <motion.div
                key={guest.id}
                variants={guestCardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <Card className="wedding-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-sage-green">
                        {index === 0 ? 'Primary Guest (You)' : `Guest ${index + 1}`}
                      </h4>
                      {index > 0 && canRemoveGuest && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGuest(guest.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Guest Name */}
                      <div>
                        <Label htmlFor={`guest-${guest.id}-name`}>
                          Full Name *
                        </Label>
                        <Input
                          id={`guest-${guest.id}-name`}
                          value={guest.name}
                          onChange={(e) => handleGuestUpdate(guest.id, 'name', e.target.value)}
                          placeholder="Enter full name"
                          className="wedding-input mt-1"
                          disabled={index === 0} // Primary guest name comes from step 1
                        />
                      </div>

                      {/* Email (optional for additional guests) */}
                      {index > 0 && (
                        <div>
                          <Label htmlFor={`guest-${guest.id}-email`}>
                            Email <span className="text-muted-foreground">(Optional)</span>
                          </Label>
                          <Input
                            id={`guest-${guest.id}-email`}
                            type="email"
                            value={guest.email || ''}
                            onChange={(e) => handleGuestUpdate(guest.id, 'email', e.target.value)}
                            placeholder="Enter email address"
                            className="wedding-input mt-1"
                          />
                        </div>
                      )}

                      {/* Meal Preference */}
                      <div className={index === 0 ? "md:col-span-2" : ""}>
                        <Label htmlFor={`guest-${guest.id}-meal`}>
                          <Utensils className="w-4 h-4 inline mr-1" />
                          Meal Preference *
                        </Label>
                        <Select
                          value={guest.mealPreference}
                          onValueChange={(value: MealPreference) => 
                            handleGuestUpdate(guest.id, 'mealPreference', value)
                          }
                        >
                          <SelectTrigger className="wedding-input mt-1">
                            <SelectValue placeholder="Select meal preference" />
                          </SelectTrigger>
                          <SelectContent>
                            {mealOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {option.description}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Dietary Restrictions */}
                      <div className="md:col-span-2">
                        <Label htmlFor={`guest-${guest.id}-dietary`}>
                          Dietary Restrictions or Allergies
                          <span className="text-muted-foreground ml-1">(Optional)</span>
                        </Label>
                        <Textarea
                          id={`guest-${guest.id}-dietary`}
                          value={guest.dietaryRestrictions || ''}
                          onChange={(e) => handleGuestUpdate(guest.id, 'dietaryRestrictions', e.target.value)}
                          placeholder="Please list any allergies or special dietary needs..."
                          className="wedding-input mt-1 min-h-[80px]"
                          maxLength={200}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {(guest.dietaryRestrictions?.length || 0)}/200 characters
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Add Guest Button */}
        {canAddGuest && (
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <Button
              type="button"
              variant="outline"
              onClick={addGuest}
              className="wedding-button-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Guest
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              You can add up to {10 - guests.length} more guest{10 - guests.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        )}

        {/* Info Box */}
        <motion.div
          variants={itemVariants}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                Important Information
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Please ensure all names are spelled correctly for place cards</li>
                <li>• Meal preferences help us plan the perfect menu for everyone</li>
                <li>• Let us know about any allergies so we can keep everyone safe</li>
                <li>• Children under 12 will receive special kid-friendly meals</li>
              </ul>
            </div>
          </div>
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
