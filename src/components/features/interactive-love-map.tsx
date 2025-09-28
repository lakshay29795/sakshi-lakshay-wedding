'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Heart, Calendar, Camera, Music, Star, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { relationshipTimeline } from '@/data/wedding-info';
import { cn } from '@/lib/utils';

interface MapLocation {
  id: string;
  title: string;
  description: string;
  date: Date;
  coordinates: {
    lat: number;
    lng: number;
  };
  image?: string;
  audioMessage?: string;
  category: 'meeting' | 'date' | 'milestone' | 'proposal' | 'wedding';
  icon: React.ReactNode;
  color: string;
}

const categoryIcons = {
  meeting: <Heart className="w-4 h-4" />,
  date: <Calendar className="w-4 h-4" />,
  milestone: <Star className="w-4 h-4" />,
  proposal: <Heart className="w-4 h-4 text-rose-500" />,
  wedding: <MapPin className="w-4 h-4" />,
};

const categoryColors = {
  meeting: 'bg-blush-pink border-blush-pink text-blush-pink',
  date: 'bg-sage-green border-sage-green text-sage-green',
  milestone: 'bg-amber-100 border-amber-300 text-amber-700',
  proposal: 'bg-rose-100 border-rose-300 text-rose-700',
  wedding: 'bg-purple-100 border-purple-300 text-purple-700',
};

export function InteractiveLoveMap({ className }: { className?: string }) {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  // Convert timeline events to map locations
  const mapLocations: MapLocation[] = useMemo(() => {
    return relationshipTimeline
      .filter(event => event.location?.coordinates)
      .map(event => {
        let category: MapLocation['category'] = 'milestone';
        
        if (event.title.toLowerCase().includes('meeting')) category = 'meeting';
        else if (event.title.toLowerCase().includes('date')) category = 'date';
        else if (event.title.toLowerCase().includes('proposal')) category = 'proposal';
        else if (event.title.toLowerCase().includes('wedding')) category = 'wedding';

        return {
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          coordinates: event.location!.coordinates,
          image: event.image,
          audioMessage: event.audioMessage,
          category,
          icon: categoryIcons[category],
          color: categoryColors[category],
        };
      });
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const openInMaps = (location: MapLocation) => {
    const { lat, lng } = location.coordinates;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Map Placeholder with Location Cards */}
      <div className="relative bg-gradient-to-br from-sage-green/10 to-blush-pink/10 rounded-lg p-8 mb-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sage-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-sage-green" />
          </div>
          <h3 className="text-xl font-serif text-charcoal mb-2">Our Love Story Locations</h3>
          <p className="text-muted-foreground">
            Explore the special places that shaped our journey together
          </p>
        </div>

        {/* Location Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mapLocations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                onClick={() => setSelectedLocation(location)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className={cn(
                      'w-10 h-10 rounded-full border-2 bg-white shadow-sm flex items-center justify-center flex-shrink-0',
                      location.color
                    )}>
                      {location.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-lg text-charcoal mb-1">
                        {location.title}
                      </h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(location.date)}
                        </span>
                        <Badge variant="secondary" className={cn('text-xs', location.color)}>
                          {location.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">
                    {location.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openInMaps(location);
                      }}
                      className="text-xs"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View on Maps
                    </Button>
                    
                    {location.audioMessage && (
                      <div className="flex items-center space-x-1 text-sage-green">
                        <Music className="w-3 h-3" />
                        <span className="text-xs font-medium">Audio</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {Object.entries(categoryIcons).map(([category, icon]) => (
            <div key={category} className="flex items-center space-x-2">
              <div className={cn(
                'w-6 h-6 rounded-full border flex items-center justify-center',
                categoryColors[category as keyof typeof categoryColors]
              )}>
                {React.cloneElement(icon as React.ReactElement, { className: 'w-3 h-3' })}
              </div>
              <span className="text-sm capitalize text-muted-foreground">
                {category === 'meeting' ? 'First Meeting' : category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Location Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedLocation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto"
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">
                        {selectedLocation.title}
                      </h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(selectedLocation.date)}
                        </span>
                        <Badge variant="secondary" className={cn('text-sm', selectedLocation.color)}>
                          {selectedLocation.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  {selectedLocation.image && (
                    <div className="relative h-48 w-full rounded-md overflow-hidden">
                      <img
                        src={selectedLocation.image}
                        alt={selectedLocation.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedLocation.description}
                  </p>

                  {/* Audio Message */}
                  {selectedLocation.audioMessage && (
                    <div className="flex items-center space-x-2 p-3 bg-sage-green/5 rounded-md">
                      <Music className="w-5 h-5 text-sage-green" />
                      <span className="text-sm text-sage-green font-medium">
                        Audio message available
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={() => openInMaps(selectedLocation)}
                      variant="outline"
                      className="flex-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Maps
                    </Button>
                    <Button
                      onClick={() => setSelectedLocation(null)}
                      className="flex-1"
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
