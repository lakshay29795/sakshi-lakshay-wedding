/**
 * DYNAMIC CONFIGURATION LOADER
 * 
 * This module loads configuration from Firebase instead of static files.
 * When admin updates config through UI, changes reflect immediately.
 */

import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { websiteConfig as staticConfig } from '@/config/website.config';
import { getWeddingDate } from '@/lib/wedding-date';

let cachedConfig: any = null;
let lastFetch: number = 0;
const CACHE_DURATION = 60000; // 1 minute cache

export interface DynamicConfig {
  couple: {
    bride: { name: string; fullName: string; photo: string };
    groom: { name: string; fullName: string; photo: string };
  };
  wedding: {
    date: string;
    venue: {
      name: string;
      address: string;
      coordinates: { lat: number; lng: number };
    };
  };
  site: {
    title: string;
    description: string;
    url: string;
  };
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    style: string;
  };
}

/**
 * Load configuration from Firebase or use static fallback
 */
export async function loadDynamicConfig(): Promise<DynamicConfig> {
  // Return cached config if still valid
  const now = Date.now();
  if (cachedConfig && (now - lastFetch) < CACHE_DURATION) {
    return cachedConfig;
  }

  try {
    // Try to load from Firebase
    const configDoc = await getDoc(doc(db, 'settings', 'website-config'));
    
    if (configDoc.exists()) {
      cachedConfig = configDoc.data() as DynamicConfig;
      lastFetch = now;
      return cachedConfig;
    }
  } catch (error) {
    console.warn('Failed to load dynamic config, using static:', error);
  }

  // Fallback to static config
  // Use getWeddingDate() which returns config date if set, otherwise 15 days from now
  const weddingDate = getWeddingDate();
  const formattedDate = weddingDate.toISOString().slice(0, 19); // Format: 'YYYY-MM-DDTHH:mm:ss'
  
  const fallbackConfig: DynamicConfig = {
    couple: {
      bride: {
        name: staticConfig.couple.bride.name,
        fullName: staticConfig.couple.bride.fullName,
        photo: staticConfig.couple.bride.photo,
      },
      groom: {
        name: staticConfig.couple.groom.name,
        fullName: staticConfig.couple.groom.fullName,
        photo: staticConfig.couple.groom.photo,
      },
    },
    wedding: {
      date: formattedDate,
      venue: {
        name: staticConfig.wedding.venue.name,
        address: staticConfig.wedding.venue.address,
        coordinates: staticConfig.wedding.venue.coordinates,
      },
    },
    site: {
      title: staticConfig.site.title,
      description: staticConfig.site.description,
      url: staticConfig.site.url,
    },
    theme: {
      colors: staticConfig.theme.colors,
      style: staticConfig.theme.style,
    },
  };

  cachedConfig = fallbackConfig;
  lastFetch = now;
  return fallbackConfig;
}

/**
 * Client-side hook to use dynamic config
 */
export function useDynamicConfig() {
  const [config, setConfig] = React.useState<DynamicConfig | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadDynamicConfig()
      .then(setConfig)
      .finally(() => setLoading(false));
  }, []);

  return { config, loading };
}

// For client-side usage
import React from 'react';

/**
 * Clear the cache to force reload
 */
export function clearConfigCache() {
  cachedConfig = null;
  lastFetch = 0;
}

/**
 * Sync static config to Firebase (run once on initial setup)
 */
export async function syncStaticToFirebase() {
  try {
    const dynamicDate = getWeddingDate().toISOString().slice(0, 19);
    const configData = {
      couple: staticConfig.couple,
      wedding: {
        date: dynamicDate,
        venue: staticConfig.wedding.venue,
      },
      site: {
        title: staticConfig.site.title,
        description: staticConfig.site.description,
        url: staticConfig.site.url,
      },
      theme: staticConfig.theme,
      updatedAt: new Date().toISOString(),
    };

    await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configData),
    });

    console.log('Static config synced to Firebase');
  } catch (error) {
    console.error('Failed to sync static config:', error);
  }
}


