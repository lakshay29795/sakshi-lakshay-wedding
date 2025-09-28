'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Bell,
  BellOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePWA } from '@/hooks/usePWA';

interface PWAStatusProps {
  className?: string;
  showDetails?: boolean;
}

export function PWAStatus({ className, showDetails = false }: PWAStatusProps) {
  const { 
    isOnline, 
    isInstalled, 
    serviceWorker, 
    cacheInfo,
    getCacheInfo,
    updateServiceWorker,
    requestNotificationPermission
  } = usePWA();
  
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [showStatusDetails, setShowStatusDetails] = useState(false);

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Listen for service worker messages
    const handleMessage = (event: MessageEvent) => {
      const { type } = event.data;
      
      switch (type) {
        case 'RSVP_SYNCED':
        case 'GUESTBOOK_SYNCED':
          setSyncStatus('success');
          setTimeout(() => setSyncStatus('idle'), 3000);
          break;
        case 'SYNC_ERROR':
          setSyncStatus('error');
          setTimeout(() => setSyncStatus('idle'), 5000);
          break;
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      };
    }
  }, []);

  const handleRefresh = async () => {
    setSyncStatus('syncing');
    try {
      await updateServiceWorker();
      window.location.reload();
    } catch (error) {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const handleNotificationToggle = async () => {
    if (notificationPermission === 'granted') {
      // Can't revoke permission programmatically, show instructions
      alert('To disable notifications, please use your browser settings.');
      return;
    }
    
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationPermission('granted');
    }
  };

  const getConnectionIcon = () => {
    if (syncStatus === 'syncing') {
      return <RefreshCw className="w-4 h-4 animate-spin" />;
    }
    if (syncStatus === 'success') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (syncStatus === 'error') {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    return isOnline ? (
      <Wifi className="w-4 h-4 text-green-500" />
    ) : (
      <WifiOff className="w-4 h-4 text-amber-500" />
    );
  };

  const getConnectionText = () => {
    if (syncStatus === 'syncing') return 'Syncing...';
    if (syncStatus === 'success') return 'Synced';
    if (syncStatus === 'error') return 'Sync Failed';
    return isOnline ? 'Online' : 'Offline';
  };

  const getConnectionColor = () => {
    if (syncStatus === 'syncing') return 'bg-blue-100 text-blue-800';
    if (syncStatus === 'success') return 'bg-green-100 text-green-800';
    if (syncStatus === 'error') return 'bg-red-100 text-red-800';
    return isOnline ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800';
  };

  return (
    <div className={className}>
      {/* Main Status Badge */}
      <motion.div
        className="flex items-center space-x-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Badge
          variant="outline"
          className={`${getConnectionColor()} border-current cursor-pointer`}
          onClick={() => setShowStatusDetails(!showStatusDetails)}
        >
          {getConnectionIcon()}
          <span className="ml-1 text-xs">{getConnectionText()}</span>
        </Badge>

        {/* PWA Installed Indicator */}
        {isInstalled && (
          <Badge variant="outline" className="bg-sage-green/10 text-sage-green border-sage-green/20">
            <Download className="w-3 h-3 mr-1" />
            <span className="text-xs">App</span>
          </Badge>
        )}

        {/* Notification Status */}
        {showDetails && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNotificationToggle}
            className="h-6 px-2"
          >
            {notificationPermission === 'granted' ? (
              <Bell className="w-3 h-3 text-green-500" />
            ) : (
              <BellOff className="w-3 h-3 text-muted-foreground" />
            )}
          </Button>
        )}
      </motion.div>

      {/* Detailed Status Panel */}
      <AnimatePresence>
        {showStatusDetails && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full mt-2 right-0 bg-white border border-sage-green/20 rounded-lg shadow-lg p-4 min-w-64 z-50"
          >
            <div className="space-y-3">
              {/* Connection Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Connection</span>
                <div className="flex items-center space-x-1">
                  {getConnectionIcon()}
                  <span className="text-sm">{getConnectionText()}</span>
                </div>
              </div>

              {/* Service Worker Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Service Worker</span>
                <Badge variant={serviceWorker ? 'default' : 'secondary'} className="text-xs">
                  {serviceWorker ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Notifications</span>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={notificationPermission === 'granted' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {notificationPermission === 'granted' ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNotificationToggle}
                    className="h-6 px-2"
                  >
                    {notificationPermission === 'granted' ? (
                      <Bell className="w-3 h-3" />
                    ) : (
                      <BellOff className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Cache Info */}
              {Object.keys(cacheInfo).length > 0 && (
                <div>
                  <span className="text-sm font-medium">Cache</span>
                  <div className="mt-1 space-y-1">
                    {Object.entries(cacheInfo).map(([cacheName, count]) => (
                      <div key={cacheName} className="flex justify-between text-xs text-muted-foreground">
                        <span className="truncate">{cacheName.replace('wedding-website-', '')}</span>
                        <span>{count} items</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 border-t border-sage-green/10 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={syncStatus === 'syncing'}
                  className="w-full text-xs"
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                  Update App
                </Button>

                {!isOnline && (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    You're offline. Some features may be limited.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Compact version for mobile
export function PWAStatusCompact() {
  const { isOnline, isInstalled } = usePWA();
  
  return (
    <div className="flex items-center space-x-1">
      {isInstalled && (
        <Badge variant="outline" className="bg-sage-green/10 text-sage-green border-sage-green/20 text-xs">
          PWA
        </Badge>
      )}
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-amber-500'}`} />
    </div>
  );
}
