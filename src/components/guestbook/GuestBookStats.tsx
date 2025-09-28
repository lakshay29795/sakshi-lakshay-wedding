'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, Clock, CheckCircle, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { GuestBookStats } from '@/types/guestbook';

interface GuestBookStatsProps {
  stats: GuestBookStats;
  className?: string;
}

export function GuestBookStatsComponent({ stats, className }: GuestBookStatsProps) {
  const statItems = [
    {
      label: 'Total Messages',
      value: stats.totalMessages,
      icon: MessageCircle,
      color: 'text-sage-green',
      bgColor: 'bg-sage-green/10',
      borderColor: 'border-sage-green/20',
    },
    {
      label: 'Approved',
      value: stats.approvedMessages,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    {
      label: 'Total Likes',
      value: stats.totalLikes,
      icon: Heart,
      color: 'text-rose-gold',
      bgColor: 'bg-rose-gold/10',
      borderColor: 'border-rose-gold/20',
    },
    {
      label: 'Pending Review',
      value: stats.pendingMessages,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('w-full', className)}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className={cn(
              'wedding-card border-2 transition-all duration-300',
              item.borderColor,
              item.bgColor
            )}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'p-2 rounded-full',
                    item.bgColor,
                    'ring-2 ring-white'
                  )}>
                    <item.icon className={cn('w-5 h-5', item.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-charcoal">
                      {item.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Stats */}
      {stats.totalMessages > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4"
        >
          <Card className="wedding-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>
                    {((stats.approvedMessages / stats.totalMessages) * 100).toFixed(1)}% 
                    approval rate
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>
                    {stats.approvedMessages > 0 
                      ? (stats.totalLikes / stats.approvedMessages).toFixed(1)
                      : '0'
                    } average likes per message
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
