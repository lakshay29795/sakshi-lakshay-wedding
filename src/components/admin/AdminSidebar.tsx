'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  Image,
  Bell,
  Settings,
  BarChart3,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Heart,
  UserCheck,
  FileText,
  Download,
  Eye,
  Edit,
} from 'lucide-react';
import { useAdmin } from './AdminProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  badge?: string | number;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    permission: 'view_analytics',
  },
  {
    name: 'RSVP Management',
    href: '/admin/rsvp',
    icon: UserCheck,
    permission: 'manage_rsvp',
    children: [
      {
        name: 'All RSVPs',
        href: '/admin/rsvp',
        icon: Eye,
        permission: 'manage_rsvp',
      },
      {
        name: 'Export Data',
        href: '/admin/rsvp/export',
        icon: Download,
        permission: 'export_data',
      },
    ],
  },
  {
    name: 'Guest Book',
    href: '/admin/guestbook',
    icon: MessageSquare,
    permission: 'manage_guestbook',
    children: [
      {
        name: 'All Messages',
        href: '/admin/guestbook',
        icon: Eye,
        permission: 'manage_guestbook',
      },
      {
        name: 'Moderate',
        href: '/admin/guestbook/moderate',
        icon: Shield,
        permission: 'moderate_content',
        badge: 'New',
      },
    ],
  },
  {
    name: 'Content Management',
    href: '/admin/content',
    icon: Edit,
    permission: 'manage_content',
    children: [
      {
        name: 'Timeline Events',
        href: '/admin/content/timeline',
        icon: Calendar,
        permission: 'manage_content',
      },
      {
        name: 'Photo Gallery',
        href: '/admin/content/gallery',
        icon: Image,
        permission: 'manage_gallery',
      },
    ],
  },
  {
    name: 'Notifications',
    href: '/admin/notifications',
    icon: Bell,
    permission: 'manage_notifications',
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    permission: 'view_analytics',
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: Users,
    permission: 'manage_users',
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    permission: 'manage_settings',
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout, hasPermission } = useAdmin();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isItemActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const filteredNavigation = navigation.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 80 },
  };

  const contentVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 },
  };

  return (
    <motion.div
      className="fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 shadow-lg"
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                key="expanded-header"
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="flex items-center space-x-2"
              >
                <Heart className="w-8 h-8 text-blush-pink" />
                <div>
                  <h1 className="text-lg font-serif text-sage-green">Wedding Admin</h1>
                  <p className="text-xs text-gray-500">Management Panel</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredNavigation.map((item) => (
            <div key={item.name}>
              {/* Main Navigation Item */}
              <div className="relative">
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isItemActive(item.href)
                      ? 'bg-sage-green text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                  onClick={() => {
                    if (item.children && !isCollapsed) {
                      toggleExpanded(item.name);
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          variants={contentVariants}
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.div
                        variants={contentVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="flex items-center space-x-2"
                      >
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        {item.children && (
                          <ChevronRight
                            className={cn(
                              'w-4 h-4 transition-transform',
                              expandedItems.includes(item.name) && 'rotate-90'
                            )}
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              </div>

              {/* Sub Navigation */}
              <AnimatePresence>
                {item.children && 
                 !isCollapsed && 
                 expandedItems.includes(item.name) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-8 mt-2 space-y-1 overflow-hidden"
                  >
                    {item.children
                      .filter(child => !child.permission || hasPermission(child.permission))
                      .map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            'flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors',
                            isItemActive(child.href)
                              ? 'bg-sage-green/10 text-sage-green font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <child.icon className="w-4 h-4" />
                            <span>{child.name}</span>
                          </div>
                          {child.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {child.badge}
                            </Badge>
                          )}
                        </Link>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-200 p-4">
          <AnimatePresence mode="wait">
            {!isCollapsed && user && (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="mb-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-sage-green rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.displayName?.[0] || user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.displayName || user.email}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              'w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-700',
              isCollapsed && 'justify-center px-2'
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="ml-3"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
