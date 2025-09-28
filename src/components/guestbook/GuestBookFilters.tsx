'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc, Heart, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { GuestBookFilters } from '@/types/guestbook';

interface GuestBookFiltersProps {
  filters: GuestBookFilters;
  onFiltersChange: (filters: GuestBookFilters) => void;
  messageCount?: number;
  className?: string;
}

export function GuestBookFilters({
  filters,
  onFiltersChange,
  messageCount = 0,
  className,
}: GuestBookFiltersProps) {
  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ 
      ...filters, 
      status: status as GuestBookFilters['status'] 
    });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ 
      ...filters, 
      sortBy: sortBy as GuestBookFilters['sortBy'] 
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: 'approved',
      sortBy: 'newest',
      search: '',
    });
  };

  const hasActiveFilters = filters.search || filters.status !== 'approved' || filters.sortBy !== 'newest';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('w-full', className)}
    >
      <Card className="wedding-card">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={filters.search || ''}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 wedding-input"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-sage-green" />
                <Select value={filters.status || 'approved'} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-32 wedding-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="wedding-card">
                    <SelectItem value="all">All Messages</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {filters.sortBy === 'oldest' ? (
                    <SortAsc className="w-4 h-4 text-sage-green" />
                  ) : (
                    <SortDesc className="w-4 h-4 text-sage-green" />
                  )}
                </div>
                <Select value={filters.sortBy || 'newest'} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-36 wedding-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="wedding-card">
                    <SelectItem value="newest">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Newest First</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="oldest">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Oldest First</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="mostLiked">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Most Liked</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="wedding-button-secondary"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {messageCount === 0 ? (
                  'No messages found'
                ) : messageCount === 1 ? (
                  '1 message'
                ) : (
                  `${messageCount} messages`
                )}
                {filters.search && (
                  <span> matching "{filters.search}"</span>
                )}
              </span>
              
              {hasActiveFilters && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-sage-green"></div>
                  <span>Filters active</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
