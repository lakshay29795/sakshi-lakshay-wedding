import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// GET - Load current configuration
export async function GET(request: NextRequest) {
  try {
    // Try to get config from Firebase
    const configDoc = await getDoc(doc(db, 'settings', 'website-config'));
    
    if (configDoc.exists()) {
      return NextResponse.json(configDoc.data());
    }
    
    // If no config exists, return default from static config
    const defaultConfig = {
      couple: {
        bride: {
          name: 'Surbhi',
          fullName: 'Sakshi Elizabeth Johnson',
          photo: '/images/couple/bride.jpg',
        },
        groom: {
          name: 'Dangar',
          fullName: 'Lakshay David Smith',
          photo: '/images/couple/groom.jpg',
        },
      },
      wedding: {
        date: '2025-12-12T16:00:00',
        venue: {
          name: 'Pitampura, Delhi',
          address: 'Pitampura, New Delhi, India',
          coordinates: {
            lat: 28.7041,
            lng: 77.1025,
          },
        },
      },
      site: {
        title: 'Surbhi & Dangar\'s Wedding',
        description: 'Join us in celebrating our special day',
        url: 'https://yourwedding.com',
      },
      theme: {
        colors: {
          primary: '#FF69B4',
          secondary: '#FFB6C1',
          accent: '#C71585',
        },
        style: 'romantic',
      },
    };
    
    return NextResponse.json(defaultConfig);
  } catch (error) {
    console.error('Error loading config:', error);
    return NextResponse.json(
      { error: 'Failed to load configuration' },
      { status: 500 }
    );
  }
}

// POST - Save configuration
export async function POST(request: NextRequest) {
  try {
    const config = await request.json();
    
    // Validate required fields
    if (!config.couple || !config.wedding || !config.site || !config.theme) {
      return NextResponse.json(
        { error: 'Invalid configuration structure' },
        { status: 400 }
      );
    }
    
    // Save to Firebase
    await setDoc(doc(db, 'settings', 'website-config'), {
      ...config,
      updatedAt: new Date().toISOString(),
    });
    
    return NextResponse.json({
      success: true,
      message: 'Configuration saved successfully',
    });
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    );
  }
}

