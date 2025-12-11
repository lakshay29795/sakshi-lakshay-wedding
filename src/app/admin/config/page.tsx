'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, RefreshCw, Upload, Download, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface ConfigState {
  couple: {
    bride: { name: string; fullName: string; photo: string };
    groom: { name: string; fullName: string; photo: string };
  };
  wedding: {
    date: string;
    venue: {
      name: string;
      address: string;
      coordinates: { lat: number; lng: number };
    };
  };
  site: {
    title: string;
    description: string;
    url: string;
  };
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    style: string;
  };
}

export default function AdminConfigPage() {
  const [config, setConfig] = useState<ConfigState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load current config
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/admin/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Error loading config:', error);
      toast.error('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        toast.success('Configuration saved successfully! Changes will reflect after page refresh.');
        setHasChanges(false);
        
        // Trigger a revalidation
        await fetch('/api/revalidate', { method: 'POST' });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (path: string[], value: any) => {
    if (!config) return;
    
    setConfig(prevConfig => {
      const newConfig = JSON.parse(JSON.stringify(prevConfig));
      let current: any = newConfig;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      return newConfig;
    });
    
    setHasChanges(true);
  };

  const exportConfig = () => {
    if (!config) return;
    
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wedding-config.json';
    link.click();
    
    toast.success('Configuration exported successfully!');
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setConfig(imported);
        setHasChanges(true);
        toast.success('Configuration imported successfully!');
      } catch (error) {
        toast.error('Invalid configuration file');
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-red-500">Failed to load configuration</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Website Configuration</h1>
          <p className="text-gray-600 mt-1">Manage all your wedding website settings</p>
        </div>
        
        <div className="flex gap-2">
          <input
            type="file"
            id="import-config"
            accept=".json"
            className="hidden"
            onChange={importConfig}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('import-config')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          
          <Button variant="outline" onClick={exportConfig}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Changes indicator */}
      {hasChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-sm text-orange-800">
                You have unsaved changes
              </span>
            </div>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              Save Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Configuration Tabs */}
      <Tabs defaultValue="couple" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="couple">Couple Info</TabsTrigger>
          <TabsTrigger value="wedding">Wedding Details</TabsTrigger>
          <TabsTrigger value="site">Site Settings</TabsTrigger>
          <TabsTrigger value="theme">Theme & Style</TabsTrigger>
        </TabsList>

        {/* Couple Information Tab */}
        <TabsContent value="couple" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bride Information</CardTitle>
              <CardDescription>Update the bride's details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bride-name">First Name</Label>
                  <Input
                    id="bride-name"
                    value={config.couple.bride.name}
                    onChange={(e) => updateConfig(['couple', 'bride', 'name'], e.target.value)}
                    placeholder="Jane"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bride-fullname">Full Name</Label>
                  <Input
                    id="bride-fullname"
                    value={config.couple.bride.fullName}
                    onChange={(e) => updateConfig(['couple', 'bride', 'fullName'], e.target.value)}
                    placeholder="Jane Marie Smith"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bride-photo">Photo Path</Label>
                <Input
                  id="bride-photo"
                  value={config.couple.bride.photo}
                  onChange={(e) => updateConfig(['couple', 'bride', 'photo'], e.target.value)}
                  placeholder="/images/couple/bride.jpg"
                />
                <p className="text-xs text-gray-500">
                  Path relative to /public folder
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Groom Information</CardTitle>
              <CardDescription>Update the groom's details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="groom-name">First Name</Label>
                  <Input
                    id="groom-name"
                    value={config.couple.groom.name}
                    onChange={(e) => updateConfig(['couple', 'groom', 'name'], e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groom-fullname">Full Name</Label>
                  <Input
                    id="groom-fullname"
                    value={config.couple.groom.fullName}
                    onChange={(e) => updateConfig(['couple', 'groom', 'fullName'], e.target.value)}
                    placeholder="John Michael Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="groom-photo">Photo Path</Label>
                <Input
                  id="groom-photo"
                  value={config.couple.groom.photo}
                  onChange={(e) => updateConfig(['couple', 'groom', 'photo'], e.target.value)}
                  placeholder="/images/couple/groom.jpg"
                />
                <p className="text-xs text-gray-500">
                  Path relative to /public folder
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wedding Details Tab */}
        <TabsContent value="wedding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wedding Date & Time</CardTitle>
              <CardDescription>Set your wedding date and time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wedding-date">Wedding Date & Time</Label>
                <Input
                  id="wedding-date"
                  type="datetime-local"
                  value={config.wedding.date.slice(0, 16)}
                  onChange={(e) => updateConfig(['wedding', 'date'], e.target.value + ':00')}
                />
                <p className="text-xs text-gray-500">
                  This will update the countdown timer and daily reveals
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Venue Information</CardTitle>
              <CardDescription>Update venue details and location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="venue-name">Venue Name</Label>
                <Input
                  id="venue-name"
                  value={config.wedding.venue.name}
                  onChange={(e) => updateConfig(['wedding', 'venue', 'name'], e.target.value)}
                  placeholder="Grand Ballroom Hotel"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="venue-address">Full Address</Label>
                <Textarea
                  id="venue-address"
                  value={config.wedding.venue.address}
                  onChange={(e) => updateConfig(['wedding', 'venue', 'address'], e.target.value)}
                  placeholder="123 Main Street, City, State 12345"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="venue-lat">Latitude</Label>
                  <Input
                    id="venue-lat"
                    type="number"
                    step="0.000001"
                    value={config.wedding.venue.coordinates.lat}
                    onChange={(e) => updateConfig(['wedding', 'venue', 'coordinates', 'lat'], parseFloat(e.target.value))}
                    placeholder="40.7128"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venue-lng">Longitude</Label>
                  <Input
                    id="venue-lng"
                    type="number"
                    step="0.000001"
                    value={config.wedding.venue.coordinates.lng}
                    onChange={(e) => updateConfig(['wedding', 'venue', 'coordinates', 'lng'], parseFloat(e.target.value))}
                    placeholder="-74.0060"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Right-click on Google Maps and select coordinates to copy
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Site Settings Tab */}
        <TabsContent value="site" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Website Information</CardTitle>
              <CardDescription>General website settings and metadata</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-title">Site Title</Label>
                <Input
                  id="site-title"
                  value={config.site.title}
                  onChange={(e) => updateConfig(['site', 'title'], e.target.value)}
                  placeholder="Jane & John's Wedding"
                />
                <p className="text-xs text-gray-500">
                  Appears in browser tab and search results
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  value={config.site.description}
                  onChange={(e) => updateConfig(['site', 'description'], e.target.value)}
                  placeholder="Join us in celebrating our special day"
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Used for SEO and social media sharing
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site-url">Website URL</Label>
                <Input
                  id="site-url"
                  value={config.site.url}
                  onChange={(e) => updateConfig(['site', 'url'], e.target.value)}
                  placeholder="https://yourwedding.com"
                />
                <p className="text-xs text-gray-500">
                  Your website's public URL
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Settings Tab */}
        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>Customize your website colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color-primary">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color-primary"
                      type="color"
                      value={config.theme.colors.primary}
                      onChange={(e) => updateConfig(['theme', 'colors', 'primary'], e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={config.theme.colors.primary}
                      onChange={(e) => updateConfig(['theme', 'colors', 'primary'], e.target.value)}
                      placeholder="#FF69B4"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color-secondary">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color-secondary"
                      type="color"
                      value={config.theme.colors.secondary}
                      onChange={(e) => updateConfig(['theme', 'colors', 'secondary'], e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={config.theme.colors.secondary}
                      onChange={(e) => updateConfig(['theme', 'colors', 'secondary'], e.target.value)}
                      placeholder="#FFB6C1"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color-accent">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color-accent"
                      type="color"
                      value={config.theme.colors.accent}
                      onChange={(e) => updateConfig(['theme', 'colors', 'accent'], e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={config.theme.colors.accent}
                      onChange={(e) => updateConfig(['theme', 'colors', 'accent'], e.target.value)}
                      placeholder="#C71585"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme Style</CardTitle>
              <CardDescription>Choose your website theme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['romantic', 'celestial', 'modern', 'classic'].map((style) => (
                  <button
                    key={style}
                    onClick={() => updateConfig(['theme', 'style'], style)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      config.theme.style === style
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{style}</span>
                      {config.theme.style === style && (
                        <Check className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {style === 'romantic' && 'Soft pinks, elegant'}
                      {style === 'celestial' && 'Blues, starry night'}
                      {style === 'modern' && 'Clean, minimalist'}
                      {style === 'classic' && 'Traditional, timeless'}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Button */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Preview Changes</p>
            <p className="text-sm text-gray-500">
              Open your website in a new tab to see the changes
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => window.open('/', '_blank')}
          >
            Open Website
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

