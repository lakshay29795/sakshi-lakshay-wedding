'use client';

import React from 'react';
import { RSVPForm } from '@/components/rsvp/RSVPForm';
import { usePWA } from '@/hooks/usePWA';
import type { RSVPFormData } from '@/types/rsvp';
import { toast } from 'sonner';

export default function RSVPPage() {
  const { isOnline, storeForSync } = usePWA();

  // Enhanced API submission handler with offline support
  const handleRSVPSubmission = async (data: RSVPFormData): Promise<void> => {
    // If offline, store for background sync
    if (!isOnline) {
      storeForSync('RSVP', data);
      toast.success('RSVP saved! It will be submitted when you\'re back online.');
      return;
    }

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit RSVP. Please try again.');
      }

      // Success - the API handles database storage and email confirmation
      console.log('RSVP submitted successfully:', result);
      toast.success('RSVP submitted successfully! Check your email for confirmation.');
    } catch (error) {
      // If network error, store for background sync
      if (error instanceof TypeError && error.message.includes('fetch')) {
        storeForSync('RSVP', data);
        toast.success('RSVP saved! It will be submitted when you\'re back online.');
      } else {
        throw error;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-sage-green/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-subtle-dots opacity-30" />
      
      {/* Content */}
      <div className="relative">
        <div className="pt-24 pb-16">
          <RSVPForm 
            onSubmit={handleRSVPSubmission}
            className="relative z-10"
          />
        </div>
      </div>
    </div>
  );
}
