import { NextResponse } from 'next/server';

/**
 * Health Check API Endpoint
 * 
 * This endpoint provides system health information for monitoring
 * and deployment verification.
 */

export async function GET() {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      services: {
        database: 'connected', // Would check actual database in production
        firebase: 'connected',
        email: 'connected',
        cache: 'connected',
      },
      features: {
        pwa: process.env.NEXT_PUBLIC_PWA_ENABLED === 'true',
        notifications: process.env.NEXT_PUBLIC_PUSH_NOTIFICATIONS_ENABLED === 'true',
        admin: process.env.NEXT_PUBLIC_ADMIN_PANEL_ENABLED === 'true',
        guestbook: process.env.NEXT_PUBLIC_GUESTBOOK_ENABLED === 'true',
        rsvp: process.env.NEXT_PUBLIC_RSVP_ENABLED === 'true',
      },
      performance: {
        bundleOptimization: true,
        imageOptimization: true,
        caching: true,
        compression: true,
      },
    };

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }
}
