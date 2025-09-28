'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, Sparkles, Wand2, RefreshCw, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AvatarStyle {
  id: string;
  name: string;
  description: string;
  filters: string;
  overlay?: string;
  borderRadius?: string;
  transform?: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void;
}

const avatarStyles: AvatarStyle[] = [
  {
    id: 'romantic-cartoon',
    name: 'Romantic Cartoon',
    description: 'Soft, dreamy cartoon style with warm colors',
    filters: 'brightness(1.2) contrast(1.1) saturate(1.3) hue-rotate(10deg)',
    overlay: 'linear-gradient(45deg, rgba(248, 232, 232, 0.3), rgba(168, 181, 160, 0.2))',
    borderRadius: '50%',
    transform: (canvas, ctx) => {
      // Add soft glow effect
      ctx.shadowColor = '#F8E8E8';
      ctx.shadowBlur = 20;
      ctx.filter = 'blur(0.5px)';
    }
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, simple style with reduced colors',
    filters: 'grayscale(0.7) contrast(1.2) brightness(1.1)',
    overlay: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(55, 65, 81, 0.05))',
    borderRadius: '10%',
    transform: (canvas, ctx) => {
      try {
        // Reduce color palette
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          // Quantize colors to create minimalist effect
          data[i] = Math.round(data[i] / 64) * 64;     // Red
          data[i + 1] = Math.round(data[i + 1] / 64) * 64; // Green
          data[i + 2] = Math.round(data[i + 2] / 64) * 64; // Blue
        }
        
        ctx.putImageData(imageData, 0, 0);
      } catch (error) {
        console.error('Minimalist transform error:', error);
      }
    }
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Artistic watercolor painting effect',
    filters: 'saturate(1.4) contrast(0.9) brightness(1.1) blur(0.5px)',
    overlay: 'radial-gradient(circle, rgba(254, 243, 226, 0.3), rgba(245, 158, 11, 0.2))',
    borderRadius: '30%',
    transform: (canvas, ctx) => {
      try {
        // Create watercolor texture effect
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          // Add deterministic variations for watercolor effect
          const variation = (Math.sin(i * 0.01) * 0.5) * 30;
          data[i] = Math.max(0, Math.min(255, data[i] + variation));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + variation));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + variation));
        }
        
        ctx.putImageData(imageData, 0, 0);
      } catch (error) {
        console.error('Watercolor transform error:', error);
      }
    }
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Classic sepia-toned vintage style',
    filters: 'sepia(0.8) contrast(1.1) brightness(0.9) saturate(0.8)',
    overlay: 'radial-gradient(circle, rgba(146, 64, 14, 0.2), rgba(124, 45, 18, 0.3))',
    borderRadius: '15%',
    transform: (canvas, ctx) => {
      try {
        // Add vintage vignette effect
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(0.7, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(92, 64, 14, 0.4)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } catch (error) {
        console.error('Vintage transform error:', error);
      }
    }
  }
];

interface AIAvatarGeneratorProps {
  onAvatarGenerated?: (avatarUrl: string, style: string) => void;
  className?: string;
}

export function AIAvatarGenerator({ onAvatarGenerated, className }: AIAvatarGeneratorProps) {
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>(avatarStyles[0]);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setOriginalImage(result);
        setGeneratedAvatar(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const generateAvatar = useCallback(async () => {
    if (!originalImage || !canvasRef.current) {
      console.log('Missing originalImage or canvas ref');
      return;
    }

    console.log('Starting avatar generation...', selectedStyle.name);
    setIsGenerating(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Could not get canvas context');
        return;
      }

      // Create image element
      const img = new Image();
      
      // Handle image loading
      const imageLoaded = new Promise((resolve, reject) => {
        img.onload = () => {
          console.log('Image loaded successfully', img.width, img.height);
          resolve(img);
        };
        img.onerror = (error) => {
          console.error('Image failed to load:', error);
          reject(error);
        };
        img.src = originalImage;
      });

      await imageLoaded;

      // Set canvas size
      const size = 400;
      canvas.width = size;
      canvas.height = size;

      // Clear canvas with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, size, size);

      // Calculate crop dimensions for square aspect ratio
      const minDim = Math.min(img.width, img.height);
      const cropX = (img.width - minDim) / 2;
      const cropY = (img.height - minDim) / 2;

      console.log('Drawing image with dimensions:', { minDim, cropX, cropY });

      // Draw image
      ctx.drawImage(img, cropX, cropY, minDim, minDim, 0, 0, size, size);

      // Apply basic style transformations first
      console.log('Applying style transformations for:', selectedStyle.name);
      
      // Apply style-specific transformations
      if (selectedStyle.transform) {
        try {
          selectedStyle.transform(canvas, ctx);
        } catch (transformError) {
          console.error('Transform error:', transformError);
          // Continue without transform if it fails
        }
      }

      // Fallback: Apply basic filter effects if transform fails
      if (selectedStyle.id === 'romantic-cartoon') {
        // Add a subtle pink tint
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(248, 232, 232, 0.1)';
        ctx.fillRect(0, 0, size, size);
        ctx.globalCompositeOperation = 'source-over';
      }

      // Convert to data URL
      const avatarUrl = canvas.toDataURL('image/png', 0.9);
      console.log('Avatar generated successfully, data URL length:', avatarUrl.length);
      
      setGeneratedAvatar(avatarUrl);
      
      if (onAvatarGenerated) {
        onAvatarGenerated(avatarUrl, selectedStyle.id);
      }

      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error('Error generating avatar:', error);
      // Set a fallback error state
      setGeneratedAvatar(null);
    } finally {
      setIsGenerating(false);
    }
  }, [originalImage, selectedStyle, onAvatarGenerated]);

  const downloadAvatar = useCallback(() => {
    if (!generatedAvatar) return;

    const link = document.createElement('a');
    link.href = generatedAvatar;
    link.download = `avatar-${selectedStyle.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedAvatar, selectedStyle.id]);

  // Auto-generate when style changes
  useEffect(() => {
    if (originalImage && !isGenerating) {
      generateAvatar();
    }
  }, [selectedStyle, originalImage, generateAvatar, isGenerating]);

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-2 mb-4"
        >
          <Wand2 className="w-6 h-6 text-sage-green" />
          <h2 className="text-3xl font-serif text-charcoal">AI Avatar Generator</h2>
          <Sparkles className="w-6 h-6 text-sage-green" />
        </motion.div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload a photo and watch it transform into beautiful artistic styles using AI-powered filters and effects.
          Perfect for creating unique wedding avatars!
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload & Preview */}
        <div className="space-y-6">
          {/* Upload Area */}
          {!originalImage ? (
            <Card 
              className={cn(
                'border-2 border-dashed transition-all duration-200 cursor-pointer',
                dragOver ? 'border-sage-green bg-sage-green/5' : 'border-gray-300 hover:border-sage-green'
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <CardContent className="p-12 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-charcoal mb-2">
                  Upload Your Photo
                </h3>
                <p className="text-muted-foreground mb-4">
                  Drag & drop or click to select a photo of yourself
                </p>
                <Button variant="outline">
                  Choose Photo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-charcoal">Original Photo</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setOriginalImage(null);
                      setGeneratedAvatar(null);
                    }}
                  >
                    Change Photo
                  </Button>
                </div>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generated Avatar */}
          {originalImage && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-charcoal">
                    {selectedStyle.name} Style
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    AI Generated
                  </Badge>
                </div>
                
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                  {isGenerating ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <RefreshCw className="w-8 h-8 text-sage-green animate-spin mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Generating {selectedStyle.name} style...
                        </p>
                      </div>
                    </div>
                  ) : generatedAvatar ? (
                    <div
                      className="w-full h-full relative"
                      style={{
                        filter: selectedStyle.filters,
                        borderRadius: selectedStyle.borderRadius,
                        background: selectedStyle.overlay,
                      }}
                    >
                      <img
                        src={generatedAvatar}
                        alt={`${selectedStyle.name} avatar`}
                        className="w-full h-full object-cover"
                        style={{ borderRadius: selectedStyle.borderRadius }}
                      />
                      {selectedStyle.overlay && (
                        <div
                          className="absolute inset-0"
                          style={{
                            background: selectedStyle.overlay,
                            borderRadius: selectedStyle.borderRadius,
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-muted-foreground">Processing...</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={generateAvatar}
                    disabled={isGenerating}
                    variant="outline"
                    className="flex-1"
                  >
                    <RefreshCw className={cn('w-4 h-4 mr-2', isGenerating && 'animate-spin')} />
                    Regenerate
                  </Button>
                  <Button
                    onClick={downloadAvatar}
                    disabled={!generatedAvatar}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Style Selection */}
        <div className="space-y-6">
          <h3 className="text-xl font-serif text-charcoal">Choose Your Style</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {avatarStyles.map((style) => (
              <motion.div
                key={style.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={cn(
                    'cursor-pointer transition-all duration-200 hover:shadow-md',
                    selectedStyle.id === style.id && 'ring-2 ring-sage-green bg-sage-green/5'
                  )}
                  onClick={() => setSelectedStyle(style)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div 
                        className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl"
                        style={{ background: style.overlay || '#f3f4f6' }}
                      >
                        {style.id === 'romantic-cartoon' && '💕'}
                        {style.id === 'minimalist' && '⚪'}
                        {style.id === 'watercolor' && '🎨'}
                        {style.id === 'vintage' && '📸'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-charcoal mb-1">
                          {style.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {style.description}
                        </p>
                        {selectedStyle.id === style.id && (
                          <Badge variant="secondary" className="mt-2 text-xs">
                            <Heart className="w-3 h-3 mr-1" />
                            Selected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* How it Works */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-charcoal mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-sage-green" />
                How It Works
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <span className="w-4 h-4 bg-sage-green/20 rounded-full flex items-center justify-center text-sage-green font-bold text-xs mt-0.5">1</span>
                  <span>Upload your photo using drag & drop or file picker</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-4 h-4 bg-sage-green/20 rounded-full flex items-center justify-center text-sage-green font-bold text-xs mt-0.5">2</span>
                  <span>Choose from 4 artistic styles (Romantic, Minimalist, Watercolor, Vintage)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-4 h-4 bg-sage-green/20 rounded-full flex items-center justify-center text-sage-green font-bold text-xs mt-0.5">3</span>
                  <span>AI applies filters, effects, and transformations automatically</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-4 h-4 bg-sage-green/20 rounded-full flex items-center justify-center text-sage-green font-bold text-xs mt-0.5">4</span>
                  <span>Download your personalized avatar for wedding use</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
