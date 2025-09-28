// Spotify Web API integration for song previews
const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

// Get Spotify access token (client credentials flow)
async function getSpotifyToken(): Promise<string | null> {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    console.warn('Spotify credentials not configured');
    return null;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
      },
      body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    return null;
  }
}

// Extract track ID from Spotify URL
function extractSpotifyTrackId(url: string): string | null {
  const match = url.match(/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

// Get track details including preview URL
export async function getSpotifyTrackPreview(spotifyUrl: string): Promise<string | null> {
  const trackId = extractSpotifyTrackId(spotifyUrl);
  if (!trackId) return null;

  const token = await getSpotifyToken();
  if (!token) return null;

  try {
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const track: SpotifyTrack = await response.json();
    return track.preview_url;
  } catch (error) {
    console.error('Error fetching Spotify track:', error);
    return null;
  }
}

// Search for a song and get preview URL
export async function searchSpotifyTrack(query: string): Promise<SpotifyTrack | null> {
  const token = await getSpotifyToken();
  if (!token) return null;

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data = await response.json();
    return data.tracks.items[0] || null;
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return null;
  }
}
