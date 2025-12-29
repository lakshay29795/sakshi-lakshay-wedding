'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { DynamicConfig, loadDynamicConfig } from '@/lib/dynamic-config';

interface ConfigContextType {
  config: DynamicConfig | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<DynamicConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const loadConfig = async () => {
    try {
      const dynamicConfig = await loadDynamicConfig();
      setConfig(dynamicConfig);
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const refresh = async () => {
    setLoading(true);
    await loadConfig();
  };

  return (
    <ConfigContext.Provider value={{ config, loading, refresh }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}


