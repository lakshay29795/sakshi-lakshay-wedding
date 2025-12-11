/**
 * Utility functions for gift reveal video
 * 
 * NOTE: Gift video now plays on EVERY page load.
 * No localStorage tracking - always shows on refresh.
 */

/**
 * Gift video always shows on page load
 */
export function shouldShowGiftVideo(): boolean {
  // Always return true - video shows every time
  return true;
}

