'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Download, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AvatarPhotoUpload } from './avatar-photo-upload';
import { AIAvatarGenerator } from './ai-avatar-generator';
import { cn } from '@/lib/utils';

interface AvatarStyle {
  id: string;
  name: string;
  description: string;
  preview: string;
  brideAvatar: string;
  groomAvatar: string;
  coupleAvatar: string;
}

const avatarStyles: AvatarStyle[] = [
  {
    id: 'romantic-cartoon',
    name: 'Romantic Cartoon',
    description: 'Cute cartoon-style avatars with soft colors',
    preview: '/images/avatars/romantic-cartoon-preview.jpg',
    brideAvatar: '/images/avatars/romantic-cartoon-bride.svg',
    groomAvatar: '/images/avatars/romantic-cartoon-groom.svg',
    coupleAvatar: '/images/avatars/romantic-cartoon-couple.svg',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, simple line art style',
    preview: '/images/avatars/minimalist-preview.jpg',
    brideAvatar: '/images/avatars/minimalist-bride.svg',
    groomAvatar: '/images/avatars/minimalist-groom.svg',
    coupleAvatar: '/images/avatars/minimalist-couple.svg',
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Artistic watercolor painting style',
    preview: '/images/avatars/watercolor-preview.jpg',
    brideAvatar: '/images/avatars/watercolor-bride.svg',
    groomAvatar: '/images/avatars/watercolor-groom.svg',
    coupleAvatar: '/images/avatars/watercolor-couple.svg',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Classic vintage illustration style',
    preview: '/images/avatars/vintage-preview.jpg',
    brideAvatar: '/images/avatars/vintage-bride.svg',
    groomAvatar: '/images/avatars/vintage-groom.svg',
    coupleAvatar: '/images/avatars/vintage-couple.svg',
  },
];

// Fallback SVG avatars (inline for demo purposes)
const fallbackBrideAvatar = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="brideGradient" cx="50%" cy="30%" r="70%">
      <stop offset="0%" style="stop-color:#FFF8F0"/>
      <stop offset="100%" style="stop-color:#F8E8E8"/>
    </radialGradient>
  </defs>
  
  <!-- Face -->
  <circle cx="100" cy="100" r="80" fill="url(#brideGradient)" stroke="#E5D5D5" stroke-width="2"/>
  
  <!-- Hair -->
  <path d="M30 80 Q50 20 100 30 Q150 20 170 80 Q160 60 140 50 Q120 40 100 45 Q80 40 60 50 Q40 60 30 80" fill="#8B4513"/>
  
  <!-- Eyes -->
  <circle cx="75" cy="85" r="8" fill="white"/>
  <circle cx="125" cy="85" r="8" fill="white"/>
  <circle cx="75" cy="85" r="5" fill="#4A5568"/>
  <circle cx="125" cy="85" r="5" fill="#4A5568"/>
  <circle cx="77" cy="83" r="2" fill="white"/>
  <circle cx="127" cy="83" r="2" fill="white"/>
  
  <!-- Nose -->
  <ellipse cx="100" cy="100" rx="3" ry="5" fill="#E5D5D5"/>
  
  <!-- Mouth -->
  <path d="M90 115 Q100 125 110 115" stroke="#D53F8C" stroke-width="3" fill="none" stroke-linecap="round"/>
  
  <!-- Blush -->
  <circle cx="65" cy="105" r="8" fill="#F8E8E8" opacity="0.7"/>
  <circle cx="135" cy="105" r="8" fill="#F8E8E8" opacity="0.7"/>
  
  <!-- Hair accessories -->
  <circle cx="70" cy="60" r="4" fill="#D53F8C"/>
  <circle cx="130" cy="60" r="4" fill="#D53F8C"/>
  
  <!-- Heart decoration -->
  <path d="M100 45 L95 40 Q90 35 95 40 Q100 35 105 40 Q110 35 105 40 L100 45" fill="#D53F8C"/>
</svg>
`;

const fallbackGroomAvatar = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="groomGradient" cx="50%" cy="30%" r="70%">
      <stop offset="0%" style="stop-color:#FFF8F0"/>
      <stop offset="100%" style="stop-color:#E8F4F8"/>
    </radialGradient>
  </defs>
  
  <!-- Face -->
  <circle cx="100" cy="100" r="80" fill="url(#groomGradient)" stroke="#D5E5E8" stroke-width="2"/>
  
  <!-- Hair -->
  <path d="M35 75 Q45 25 100 30 Q155 25 165 75 Q150 50 125 45 Q100 40 75 45 Q50 50 35 75" fill="#2D3748"/>
  
  <!-- Eyes -->
  <circle cx="75" cy="85" r="8" fill="white"/>
  <circle cx="125" cy="85" r="8" fill="white"/>
  <circle cx="75" cy="85" r="5" fill="#2D3748"/>
  <circle cx="125" cy="85" r="5" fill="#2D3748"/>
  <circle cx="77" cy="83" r="2" fill="white"/>
  <circle cx="127" cy="83" r="2" fill="white"/>
  
  <!-- Eyebrows -->
  <path d="M65 75 Q75 70 85 75" stroke="#2D3748" stroke-width="3" stroke-linecap="round"/>
  <path d="M115 75 Q125 70 135 75" stroke="#2D3748" stroke-width="3" stroke-linecap="round"/>
  
  <!-- Nose -->
  <ellipse cx="100" cy="100" rx="4" ry="6" fill="#D5E5E8"/>
  
  <!-- Mouth -->
  <path d="M88 115 Q100 125 112 115" stroke="#4A5568" stroke-width="3" fill="none" stroke-linecap="round"/>
  
  <!-- Beard -->
  <path d="M75 130 Q100 145 125 130 Q115 140 100 142 Q85 140 75 130" fill="#2D3748"/>
  
  <!-- Tie -->
  <rect x="95" y="160" width="10" height="30" fill="#4A5568"/>
  <polygon points="90,160 110,160 105,150 95,150" fill="#4A5568"/>
</svg>
`;

export function CoupleAvatars({ className }: { className?: string }) {
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>(avatarStyles[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentView, setCurrentView] = useState<'couple' | 'bride' | 'groom'>('couple');
  const [useRealImages, setUseRealImages] = useState(false);
  const [bridePhoto, setBridePhoto] = useState<string | null>(null);
  const [groomPhoto, setGroomPhoto] = useState<string | null>(null);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiGeneratedAvatars, setAiGeneratedAvatars] = useState<Record<string, string>>({});
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side only rendering for animations with random values
  useEffect(() => {
    setIsClient(true);
  }, []);

  const generateNewStyle = async () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Cycle through styles instead of random selection
    const currentIndex = avatarStyles.findIndex(style => style.id === selectedStyle.id);
    const nextIndex = (currentIndex + 1) % avatarStyles.length;
    setSelectedStyle(avatarStyles[nextIndex]);
    setIsGenerating(false);
  };

  const downloadAvatar = () => {
    const avatarData = getCurrentAvatar();
    
    const link = document.createElement('a');
    link.href = avatarData;
    link.download = `${currentView}-avatar-${selectedStyle.id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCurrentAvatar = () => {
    // Check if we should use real images first
    if (useRealImages) {
      // Try PNG first, then SVG fallback
      const viewName = currentView === 'couple' ? 'couple' : currentView === 'bride' ? 'bride' : 'groom';
      const pngPath = `/images/avatars/${selectedStyle.id}/${viewName}.png`;
      const svgPath = `/images/avatars/${selectedStyle.id}/${viewName}.svg`;
      
      // For now, use SVG path since we generated SVG samples
      // In production, you would check if PNG exists first
      return svgPath;
    }

    // Use AI-generated avatars if available
    if (aiGeneratedAvatars[selectedStyle.id]) {
      return aiGeneratedAvatars[selectedStyle.id];
    }

    // Use uploaded photos if available
    if (bridePhoto && currentView === 'bride') {
      return bridePhoto;
    }
    if (groomPhoto && currentView === 'groom') {
      return groomPhoto;
    }
    if (bridePhoto && groomPhoto && currentView === 'couple') {
      // Create a combined image canvas
      return createCombinedPhoto(bridePhoto, groomPhoto);
    }

    // Fallback to generated SVG avatars
    const styleColors = {
      'romantic-cartoon': { primary: '#F8E8E8', secondary: '#D53F8C', accent: '#A8B5A0' },
      'minimalist': { primary: '#F5F5F5', secondary: '#6B7280', accent: '#374151' },
      'watercolor': { primary: '#FEF3E2', secondary: '#F59E0B', accent: '#DC2626' },
      'vintage': { primary: '#F3F4F6', secondary: '#92400E', accent: '#7C2D12' },
    };

    const colors = styleColors[selectedStyle.id as keyof typeof styleColors] || styleColors['romantic-cartoon'];

    if (currentView === 'bride') {
      return `data:image/svg+xml;base64,${btoa(generateBrideAvatar(colors, selectedStyle.id))}`;
    } else if (currentView === 'groom') {
      return `data:image/svg+xml;base64,${btoa(generateGroomAvatar(colors, selectedStyle.id))}`;
    } else {
      return `data:image/svg+xml;base64,${btoa(generateCoupleAvatar(colors, selectedStyle.id))}`;
    }
  };

  const createCombinedPhoto = (bride: string, groom: string) => {
    // This would create a canvas combining both photos
    // For now, return the bride photo as placeholder
    return bride;
  };

  const handlePhotosUploaded = (bride: string | null, groom: string | null) => {
    setBridePhoto(bride);
    setGroomPhoto(groom);
  };

  const handleAvatarGenerated = (avatarUrl: string, style: string) => {
    setAiGeneratedAvatars(prev => ({
      ...prev,
      [style]: avatarUrl
    }));
  };

  const generateBrideAvatar = (colors: any, style: string) => {
    const isMinimalist = style === 'minimalist';
    const isWatercolor = style === 'watercolor';
    const isVintage = style === 'vintage';

    return `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="brideGradient-${style}" cx="50%" cy="30%" r="70%">
      <stop offset="0%" style="stop-color:${colors.primary}"/>
      <stop offset="100%" style="stop-color:${colors.secondary}"/>
    </radialGradient>
    ${isWatercolor ? `
    <filter id="watercolor">
      <feTurbulence baseFrequency="0.04" numOctaves="3" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/>
    </filter>` : ''}
  </defs>
  
  <!-- Face -->
  <circle cx="100" cy="100" r="80" fill="url(#brideGradient-${style})" 
    stroke="${colors.accent}" stroke-width="${isMinimalist ? '1' : '2'}"
    ${isWatercolor ? 'filter="url(#watercolor)"' : ''}/>
  
  <!-- Hair -->
  <path d="M30 80 Q50 20 100 30 Q150 20 170 80 Q160 60 140 50 Q120 40 100 45 Q80 40 60 50 Q40 60 30 80" 
    fill="${isVintage ? '#8B4513' : '#D4A574'}" 
    ${isWatercolor ? 'filter="url(#watercolor)"' : ''}/>
  
  <!-- Eyes -->
  <circle cx="75" cy="85" r="${isMinimalist ? '6' : '8'}" fill="white"/>
  <circle cx="125" cy="85" r="${isMinimalist ? '6' : '8'}" fill="white"/>
  <circle cx="75" cy="85" r="${isMinimalist ? '3' : '5'}" fill="${colors.accent}"/>
  <circle cx="125" cy="85" r="${isMinimalist ? '3' : '5'}" fill="${colors.accent}"/>
  ${!isMinimalist ? `
  <circle cx="77" cy="83" r="2" fill="white"/>
  <circle cx="127" cy="83" r="2" fill="white"/>` : ''}
  
  <!-- Nose -->
  <ellipse cx="100" cy="100" rx="3" ry="5" fill="${colors.secondary}" opacity="0.6"/>
  
  <!-- Mouth -->
  <path d="M90 115 Q100 125 110 115" stroke="${colors.secondary}" 
    stroke-width="${isMinimalist ? '2' : '3'}" fill="none" stroke-linecap="round"/>
  
  ${!isMinimalist ? `
  <!-- Blush -->
  <circle cx="65" cy="105" r="8" fill="${colors.secondary}" opacity="0.3"/>
  <circle cx="135" cy="105" r="8" fill="${colors.secondary}" opacity="0.3"/>` : ''}
  
  <!-- Hair accessories -->
  <circle cx="70" cy="60" r="4" fill="${colors.secondary}"/>
  <circle cx="130" cy="60" r="4" fill="${colors.secondary}"/>
  
  <!-- Heart decoration -->
  <path d="M100 45 L95 40 Q90 35 95 40 Q100 35 105 40 Q110 35 105 40 L100 45" fill="${colors.secondary}"/>
  
  <!-- Style-specific elements -->
  ${isVintage ? `
  <rect x="85" y="170" width="30" height="20" fill="${colors.accent}" opacity="0.8"/>
  <text x="100" y="185" text-anchor="middle" font-family="serif" font-size="8" fill="white">S</text>` : ''}
  
  ${style === 'romantic-cartoon' ? `
  <path d="M50 50 Q60 45 70 50" stroke="${colors.secondary}" stroke-width="2" fill="none"/>
  <path d="M130 50 Q140 45 150 50" stroke="${colors.secondary}" stroke-width="2" fill="none"/>` : ''}
</svg>`;
  };

  const generateGroomAvatar = (colors: any, style: string) => {
    const isMinimalist = style === 'minimalist';
    const isWatercolor = style === 'watercolor';
    const isVintage = style === 'vintage';

    return `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="groomGradient-${style}" cx="50%" cy="30%" r="70%">
      <stop offset="0%" style="stop-color:${colors.primary}"/>
      <stop offset="100%" style="stop-color:${colors.accent}"/>
    </radialGradient>
    ${isWatercolor ? `
    <filter id="watercolor-groom">
      <feTurbulence baseFrequency="0.04" numOctaves="3" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/>
    </filter>` : ''}
  </defs>
  
  <!-- Face -->
  <circle cx="100" cy="100" r="80" fill="url(#groomGradient-${style})" 
    stroke="${colors.accent}" stroke-width="${isMinimalist ? '1' : '2'}"
    ${isWatercolor ? 'filter="url(#watercolor-groom)"' : ''}/>
  
  <!-- Hair -->
  <path d="M35 75 Q45 25 100 30 Q155 25 165 75 Q150 50 125 45 Q100 40 75 45 Q50 50 35 75" 
    fill="${isVintage ? '#2D3748' : '#4A5568'}"
    ${isWatercolor ? 'filter="url(#watercolor-groom)"' : ''}/>
  
  <!-- Eyes -->
  <circle cx="75" cy="85" r="${isMinimalist ? '6' : '8'}" fill="white"/>
  <circle cx="125" cy="85" r="${isMinimalist ? '6' : '8'}" fill="white"/>
  <circle cx="75" cy="85" r="${isMinimalist ? '3' : '5'}" fill="${colors.accent}"/>
  <circle cx="125" cy="85" r="${isMinimalist ? '3' : '5'}" fill="${colors.accent}"/>
  ${!isMinimalist ? `
  <circle cx="77" cy="83" r="2" fill="white"/>
  <circle cx="127" cy="83" r="2" fill="white"/>` : ''}
  
  <!-- Eyebrows -->
  <path d="M65 75 Q75 70 85 75" stroke="${colors.accent}" stroke-width="3" stroke-linecap="round"/>
  <path d="M115 75 Q125 70 135 75" stroke="${colors.accent}" stroke-width="3" stroke-linecap="round"/>
  
  <!-- Nose -->
  <ellipse cx="100" cy="100" rx="4" ry="6" fill="${colors.secondary}" opacity="0.6"/>
  
  <!-- Mouth -->
  <path d="M88 115 Q100 125 112 115" stroke="${colors.accent}" 
    stroke-width="${isMinimalist ? '2' : '3'}" fill="none" stroke-linecap="round"/>
  
  ${!isMinimalist ? `
  <!-- Beard -->
  <path d="M75 130 Q100 145 125 130 Q115 140 100 142 Q85 140 75 130" fill="${colors.accent}"/>` : ''}
  
  <!-- Tie/Collar -->
  <rect x="95" y="160" width="10" height="30" fill="${colors.accent}"/>
  <polygon points="90,160 110,160 105,150 95,150" fill="${colors.accent}"/>
  
  <!-- Style-specific elements -->
  ${isVintage ? `
  <rect x="85" y="170" width="30" height="20" fill="${colors.secondary}" opacity="0.8"/>
  <text x="100" y="185" text-anchor="middle" font-family="serif" font-size="8" fill="white">L</text>` : ''}
  
  ${style === 'romantic-cartoon' ? `
  <circle cx="180" cy="60" r="3" fill="${colors.secondary}"/>
  <circle cx="175" cy="65" r="2" fill="${colors.secondary}" opacity="0.7"/>` : ''}
</svg>`;
  };

  const generateCoupleAvatar = (colors: any, style: string) => {
    return `
<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(0,0)">${generateBrideAvatar(colors, style).replace('<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">', '').replace('</svg>', '')}</g>
  <g transform="translate(200,0)">${generateGroomAvatar(colors, style).replace('<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">', '').replace('</svg>', '')}</g>
  
  <!-- Connection heart -->
  <path d="M180 100 L220 100" stroke="${colors.secondary}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="200" cy="100" r="8" fill="${colors.secondary}"/>
  <path d="M200 92 L195 87 Q190 82 195 87 Q200 77 205 87 Q210 82 205 87 L200 92" fill="${colors.secondary}"/>
  
  <!-- Floating hearts -->
  <path d="M200 60 L195 55 Q190 50 195 55 Q200 45 205 55 Q210 50 205 55 L200 60" fill="${colors.secondary}" opacity="0.6"/>
  <path d="M200 140 L195 135 Q190 130 195 135 Q200 125 205 135 Q210 130 205 135 L200 140" fill="${colors.secondary}" opacity="0.4"/>
  
  <!-- Style name -->
  <text x="200" y="190" text-anchor="middle" font-family="serif" font-size="12" fill="${colors.accent}">
    ${selectedStyle.name}
  </text>
</svg>`;
  };

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-2 mb-4"
        >
          <Sparkles className="w-6 h-6 text-sage-green" />
          <h2 className="text-3xl font-serif text-charcoal">Custom Couple Avatars</h2>
          <Sparkles className="w-6 h-6 text-sage-green" />
        </motion.div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AI-generated custom illustrations of Sakshi & Lakshay in various artistic styles. 
          Perfect for wedding invitations, social media, and keepsakes.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Avatar Display */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Badge variant="secondary" className="mb-4">
                {selectedStyle.name} Style
              </Badge>
              <p className="text-sm text-muted-foreground">
                {selectedStyle.description}
              </p>
            </div>

            {/* View Selector */}
            <div className="flex justify-center space-x-2 mb-6">
              {(['couple', 'bride', 'groom'] as const).map((view) => (
                <Button
                  key={view}
                  variant={currentView === view ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentView(view)}
                  className="capitalize"
                >
                  {view === 'couple' ? 'Together' : view === 'bride' ? 'Sakshi' : 'Lakshay'}
                </Button>
              ))}
            </div>

            {/* Avatar Display */}
            <motion.div
              key={`${selectedStyle.id}-${currentView}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative bg-gradient-to-br from-blush-pink/10 to-sage-green/10 rounded-lg p-8 mb-6"
            >
              <div className="flex justify-center">
                <img
                  src={getCurrentAvatar()}
                  alt={`${currentView} avatar in ${selectedStyle.name} style`}
                  className="max-w-full h-48 object-contain"
                />
              </div>
              
              {/* Floating hearts animation - client-side only */}
              <AnimatePresence>
                {currentView === 'couple' && isClient && (
                  <>
                    {[25, 75, 50].map((xPos, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20, x: xPos }}
                        animate={{ 
                          opacity: [0, 1, 0], 
                          y: -50, 
                          x: xPos + (i % 2 === 0 ? 10 : -10)
                        }}
                        transition={{ 
                          duration: 3, 
                          delay: i * 0.5, 
                          repeat: Infinity,
                          repeatDelay: 2 
                        }}
                        className="absolute top-4"
                      >
                        <Heart className="w-4 h-4 text-rose-400 fill-current" />
                      </motion.div>
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <Button
                  onClick={generateNewStyle}
                  disabled={isGenerating}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className={cn('w-4 h-4 mr-2', isGenerating && 'animate-spin')} />
                  {isGenerating ? 'Generating...' : 'New Style'}
                </Button>
                <Button
                  onClick={downloadAvatar}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setShowAIGenerator(!showAIGenerator)}
                  variant={showAIGenerator ? 'default' : 'outline'}
                  className="flex-1"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {showAIGenerator ? 'Hide AI' : 'AI Generator'}
                </Button>
                <Button
                  onClick={() => setShowPhotoUpload(!showPhotoUpload)}
                  variant="outline"
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {showPhotoUpload ? 'Hide Upload' : 'Upload Photos'}
                </Button>
                <Button
                  onClick={() => setUseRealImages(!useRealImages)}
                  variant={useRealImages ? 'default' : 'outline'}
                  className="flex-1"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {useRealImages ? 'Using Images' : 'Use Images'}
                </Button>
                <Button
                  onClick={() => {
                    setShowAIGenerator(false);
                    setShowPhotoUpload(false);
                    setUseRealImages(false);
                  }}
                  variant="ghost"
                  className="flex-1"
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Style Gallery */}
        <div className="space-y-4">
          <h3 className="text-xl font-serif text-charcoal mb-4">Available Styles</h3>
          <div className="grid grid-cols-2 gap-4">
            {avatarStyles.map((style) => (
              <motion.div
                key={style.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={cn(
                    'cursor-pointer transition-all duration-200 hover:shadow-md',
                    selectedStyle.id === style.id && 'ring-2 ring-sage-green'
                  )}
                  onClick={() => setSelectedStyle(style)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <div className="text-4xl">🎨</div>
                    </div>
                    <h4 className="font-medium text-sm text-charcoal mb-1">
                      {style.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {style.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* How to Use */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-sage-green mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm text-charcoal mb-2">
                    How to Use Custom Avatars
                  </h4>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 bg-sage-green/20 rounded-full flex items-center justify-center text-sage-green font-bold text-xs">1</span>
                      <span>Click different style cards to see various artistic interpretations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 bg-sage-green/20 rounded-full flex items-center justify-center text-sage-green font-bold text-xs">2</span>
                      <span>Use "Sakshi", "Lakshay", or "Together" buttons to switch views</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 bg-sage-green/20 rounded-full flex items-center justify-center text-sage-green font-bold text-xs">3</span>
                      <span>Click "New Style" to generate a random style variation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 bg-sage-green/20 rounded-full flex items-center justify-center text-sage-green font-bold text-xs">4</span>
                      <span>Download your favorite avatars as SVG files for printing or sharing</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Generation Info */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-rose-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm text-charcoal mb-1">
                    Style Variations
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Each style has unique characteristics: <strong>Romantic Cartoon</strong> features soft colors and hearts, 
                    <strong>Minimalist</strong> uses clean lines, <strong>Watercolor</strong> adds artistic texture effects, 
                    and <strong>Vintage</strong> includes classic elements with initials.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Avatar Generator Section */}
      <AnimatePresence>
        {showAIGenerator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <AIAvatarGenerator onAvatarGenerated={handleAvatarGenerated} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Upload Section */}
      <AnimatePresence>
        {showPhotoUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <AvatarPhotoUpload onPhotosUploaded={handlePhotosUploaded} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
