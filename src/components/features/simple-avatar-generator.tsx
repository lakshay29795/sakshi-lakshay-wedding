'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const styles = [
  { id: 'romantic', name: 'Romantic', filter: 'brightness(1.2) contrast(1.1) saturate(1.3) hue-rotate(10deg)' },
  { id: 'minimalist', name: 'Minimalist', filter: 'grayscale(0.7) contrast(1.2) brightness(1.1)' },
  { id: 'watercolor', name: 'Watercolor', filter: 'saturate(1.4) contrast(0.9) brightness(1.1) blur(0.5px)' },
  { id: 'vintage', name: 'Vintage', filter: 'sepia(0.8) contrast(1.1) brightness(0.9) saturate(0.8)' }
];

export function SimpleAvatarGenerator() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(styles[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('File uploaded, data URL length:', result.length);
        setOriginalImage(result);
        setGeneratedAvatar(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const generateAvatar = useCallback(async () => {
    if (!originalImage || !canvasRef.current) {
      console.log('Missing image or canvas');
      return;
    }

    console.log('Starting simple avatar generation...');
    setIsGenerating(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('No canvas context');
        return;
      }

      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = originalImage;
      });

      console.log('Image loaded:', img.width, 'x', img.height);

      // Set canvas size
      canvas.width = 400;
      canvas.height = 400;

      // Clear canvas
      ctx.clearRect(0, 0, 400, 400);

      // Draw image (centered and cropped to square)
      const size = Math.min(img.width, img.height);
      const x = (img.width - size) / 2;
      const y = (img.height - size) / 2;
      
      ctx.drawImage(img, x, y, size, size, 0, 0, 400, 400);

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png', 0.9);
      console.log('Avatar generated, data URL length:', dataUrl.length);
      
      setGeneratedAvatar(dataUrl);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [originalImage]);

  const downloadAvatar = useCallback(() => {
    if (!generatedAvatar) return;

    const link = document.createElement('a');
    link.href = generatedAvatar;
    link.download = `avatar-${selectedStyle.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedAvatar, selectedStyle.id]);

  // Auto-generate when image is uploaded
  React.useEffect(() => {
    if (originalImage) {
      generateAvatar();
    }
  }, [originalImage, generateAvatar]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Simple Avatar Generator</h2>
        <p className="text-gray-600">Upload a photo to test basic functionality</p>
      </div>

      {/* Upload Area */}
      {!originalImage ? (
        <Card 
          className="border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-12 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Photo</h3>
            <p className="text-gray-600">Click to select an image file</p>
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
        <div className="grid md:grid-cols-2 gap-6">
          {/* Original */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Original</h3>
              <img
                src={originalImage}
                alt="Original"
                className="w-full aspect-square object-cover rounded"
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => {
                  setOriginalImage(null);
                  setGeneratedAvatar(null);
                }}
              >
                Change Photo
              </Button>
            </CardContent>
          </Card>

          {/* Generated */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Generated Avatar</h3>
              <div className="w-full aspect-square bg-gray-100 rounded flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Processing...</p>
                  </div>
                ) : generatedAvatar ? (
                  <img
                    src={generatedAvatar}
                    alt="Generated avatar"
                    className="w-full h-full object-cover rounded"
                    style={{ filter: selectedStyle.filter }}
                  />
                ) : (
                  <p className="text-gray-500">No avatar generated</p>
                )}
              </div>
              <div className="flex space-x-2 mt-4">
                <Button
                  onClick={generateAvatar}
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <RefreshCw className={cn('w-4 h-4 mr-2', isGenerating && 'animate-spin')} />
                  Regenerate
                </Button>
                <Button
                  onClick={downloadAvatar}
                  disabled={!generatedAvatar}
                  size="sm"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Style Selector */}
      {originalImage && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Style</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {styles.map((style) => (
                <Button
                  key={style.id}
                  variant={selectedStyle.id === style.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStyle(style)}
                >
                  {style.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Debug Info */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Debug Info</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Original Image: {originalImage ? 'Loaded' : 'None'}</p>
            <p>Generated Avatar: {generatedAvatar ? 'Ready' : 'None'}</p>
            <p>Selected Style: {selectedStyle.name}</p>
            <p>Is Generating: {isGenerating ? 'Yes' : 'No'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
