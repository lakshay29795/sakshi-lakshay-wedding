'use client';

import React from 'react';
import { AIAvatarGenerator } from '@/components/features/ai-avatar-generator';
import { SimpleAvatarGenerator } from '@/components/features/simple-avatar-generator';

export default function TestAIPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">AI Avatar Generator Test</h1>
        <p className="text-center text-gray-600 mb-8">
          This is a test page to debug the AI avatar generation. Check the browser console for logs.
        </p>
        
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Simple Version (Basic Test)</h2>
            <SimpleAvatarGenerator />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Full Version (Advanced)</h2>
            <AIAvatarGenerator 
              onAvatarGenerated={(url, style) => {
                console.log('Avatar generated callback:', { style, urlLength: url.length });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
