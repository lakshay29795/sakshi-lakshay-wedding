/**
 * SINGLE SOURCE OF TRUTH FOR WEDDING DATE
 * 
 * This file provides a centralized way to get the wedding date.
 * - If a wedding date is configured in website.config.ts, that date is used
 * - Otherwise, it falls back to 15 days from the current date
 * All components should use these utilities instead of directly accessing the date.
 */

import { websiteConfig } from '@/config/website.config';

/**
 * Get the wedding date from config, or fallback to 15 days from now
 * This is the ONLY place the wedding date should be retrieved from
 */
export function getWeddingDate(): Date {
  const configDate = websiteConfig.wedding.date;
  
  // If config has a valid date, use it
  if (configDate && configDate.trim() !== '') {
    const parsedDate = new Date(configDate);
    // Check if the parsed date is valid
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }
  
  // Fallback: 15 days from now at 4:00 PM
  const now = new Date();
  const weddingDate = new Date(now);
  weddingDate.setDate(weddingDate.getDate() + 15);
  weddingDate.setHours(16, 0, 0, 0); // Set to 4:00 PM
  return weddingDate;
}

/**
 * Get days until the wedding
 */
export function getDaysUntilWedding(): number {
  const now = new Date();
  const wedding = getWeddingDate();
  const diffTime = wedding.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Calculate time remaining until wedding
 */
export function getTimeUntilWedding() {
  const now = new Date().getTime();
  const wedding = getWeddingDate().getTime();
  const difference = wedding - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

/**
 * Check if the wedding has passed
 */
export function hasWeddingPassed(): boolean {
  return new Date() > getWeddingDate();
}

/**
 * Format the wedding date
 */
export function formatWeddingDate(format: 'short' | 'long' | 'full' = 'long'): string {
  const date = getWeddingDate();
  
  const options: Intl.DateTimeFormatOptions = 
    format === 'short' 
      ? { month: 'short', day: 'numeric', year: 'numeric' }
      : format === 'full'
      ? { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }
      : { month: 'long', day: 'numeric', year: 'numeric' };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Get unlock date for daily reveals
 * @param daysBeforeWedding - Number of days before wedding (e.g., 30 for "30 days before")
 */
export function getDailyRevealUnlockDate(daysBeforeWedding: number): Date {
  const weddingDate = getWeddingDate();
  const unlockDate = new Date(weddingDate);
  unlockDate.setDate(unlockDate.getDate() - daysBeforeWedding);
  unlockDate.setHours(0, 0, 0, 0);
  return unlockDate;
}

/**
 * Check if a daily reveal should be unlocked
 * @param daysBeforeWedding - Number of days before wedding
 */
export function isDailyRevealUnlocked(daysBeforeWedding: number): boolean {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const unlockDate = getDailyRevealUnlockDate(daysBeforeWedding);
  return now >= unlockDate;
}


