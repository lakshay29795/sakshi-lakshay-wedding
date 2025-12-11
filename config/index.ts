/**
 * CONFIGURATION INDEX
 * 
 * This file exports all configuration modules for easy importing throughout the app.
 * 
 * Usage:
 * import { websiteConfig, contentConfig, assetsConfig } from '@/config';
 */

export * from './website.config';
export * from './content.config';
export * from './assets.config';
export * from './quiz.config';
export * from './daily-reveals.config';

// Re-export commonly used types
export type { 
  TimelineEvent 
} from '@/types';

