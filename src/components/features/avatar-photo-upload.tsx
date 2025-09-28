'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, X, Check, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PhotoUploadProps {
  onPhotosUploaded: (bridePhoto: string | null, groomPhoto: string | null) => void;
  className?: string;
}

export function AvatarPhotoUpload({ onPhotosUploaded, className }: PhotoUploadProps) {
  const [bridePhoto, setBridePhoto] = useState<string | null>(null);
  const [groomPhoto, setGroomPhoto] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<'bride' | 'groom' | null>(null);

  const handleFileUpload = useCallback((file: File, type: 'bride' | 'groom') => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'bride') {
          setBridePhoto(result);
        } else {
          setGroomPhoto(result);
        }
        onPhotosUploaded(
          type === 'bride' ? result : bridePhoto,
          type === 'groom' ? result : groomPhoto
        );
      };
      reader.readAsDataURL(file);
    }
  }, [bridePhoto, groomPhoto, onPhotosUploaded]);

  const handleDrop = useCallback((e: React.DragEvent, type: 'bride' | 'groom') => {
    e.preventDefault();
    setDragOver(null);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0], type);
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: 'bride' | 'groom') => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0], type);
    }
  }, [handleFileUpload]);

  const removePhoto = useCallback((type: 'bride' | 'groom') => {
    if (type === 'bride') {
      setBridePhoto(null);
      onPhotosUploaded(null, groomPhoto);
    } else {
      setGroomPhoto(null);
      onPhotosUploaded(bridePhoto, null);
    }
  }, [bridePhoto, groomPhoto, onPhotosUploaded]);

  const PhotoUploadCard = ({ 
    type, 
    photo, 
    name 
  }: { 
    type: 'bride' | 'groom'; 
    photo: string | null; 
    name: string;
  }) => (
    <Card 
      className={cn(
        'relative transition-all duration-200 cursor-pointer',
        dragOver === type && 'ring-2 ring-sage-green bg-sage-green/5',
        photo && 'ring-1 ring-sage-green/30'
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(type);
      }}
      onDragLeave={() => setDragOver(null)}
      onDrop={(e) => handleDrop(e, type)}
    >
      <CardContent className="p-6">
        <div className="text-center">
          <h3 className="font-serif text-lg text-charcoal mb-4">{name}'s Photo</h3>
          
          {photo ? (
            <div className="relative">
              <img
                src={photo}
                alt={`${name}'s photo`}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-sage-green/20"
              />
              <button
                onClick={() => removePhoto(type)}
                className="absolute top-0 right-1/2 translate-x-16 -translate-y-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="flex items-center justify-center space-x-2 text-sage-green">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Photo uploaded</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Drop photo here or click to upload
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, type)}
                  className="hidden"
                  id={`${type}-upload`}
                />
                <label
                  htmlFor={`${type}-upload`}
                  className="inline-flex items-center justify-center px-4 py-2 bg-sage-green text-white rounded-lg hover:bg-sage-green/90 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Photo
                </label>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={cn('space-y-6', className)}>
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-sage-green" />
          <h3 className="text-xl font-serif text-charcoal">Upload Reference Photos</h3>
          <Sparkles className="w-5 h-5 text-sage-green" />
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload photos of Sakshi & Lakshay to create more personalized AI avatars. 
          The AI will use these as reference to generate custom illustrations in different artistic styles.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <PhotoUploadCard type="bride" photo={bridePhoto} name="Sakshi" />
        <PhotoUploadCard type="groom" photo={groomPhoto} name="Lakshay" />
      </div>

      {(bridePhoto || groomPhoto) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="bg-sage-green/5 border-sage-green/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-2 text-sage-green">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {bridePhoto && groomPhoto 
                    ? "Both photos uploaded! AI avatars will now be more personalized." 
                    : "One photo uploaded. Upload both for best results."}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="text-center text-xs text-muted-foreground">
        <p>
          <strong>Privacy Note:</strong> Photos are processed locally in your browser and not stored on any server.
        </p>
      </div>
    </div>
  );
}
