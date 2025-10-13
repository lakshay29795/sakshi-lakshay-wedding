/**
 * Utility functions for managing first-visit gift reveal
 */

const STORAGE_KEY = 'sakshi-lakshay-wedding-visited';

/**
 * Check if user has visited before
 */
export function hasUserVisited(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

/**
 * Mark user as visited
 */
export function markAsVisited(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, 'false');
}

/**
 * Reset visit status (for testing or allowing users to see the reveal again)
 * You can call this from browser console: window.resetFirstVisit()
 */
export function resetFirstVisit(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  console.log('✅ First visit status reset! Reload the page to see the gift reveal again.');
}

// Make it accessible from browser console for testing
if (typeof window !== 'undefined') {
  (window as any).resetFirstVisit = resetFirstVisit;
}

