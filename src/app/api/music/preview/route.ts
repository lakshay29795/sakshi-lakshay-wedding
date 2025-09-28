import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyTrackPreview, searchSpotifyTrack } from '@/lib/spotify/api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const spotifyUrl = searchParams.get('url');
  const searchQuery = searchParams.get('search');

  try {
    let previewUrl: string | null = null;

    if (spotifyUrl) {
      // Get preview from Spotify URL
      previewUrl = await getSpotifyTrackPreview(spotifyUrl);
    } else if (searchQuery) {
      // Search for track and get preview
      const track = await searchSpotifyTrack(searchQuery);
      previewUrl = track?.preview_url || null;
    }

    if (previewUrl) {
      return NextResponse.json({ 
        success: true, 
        previewUrl,
        duration: 30 // Spotify previews are 30 seconds
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'No preview available for this song' 
      });
    }
  } catch (error) {
    console.error('Error fetching music preview:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch preview' 
    }, { status: 500 });
  }
}
