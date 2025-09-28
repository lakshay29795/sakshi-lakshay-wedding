# Wedding Songs Audio Files

Place your downloaded wedding songs in this folder.

## File Naming Convention

Use descriptive names with artist information:
- `perfect-ed-sheeran.mp3`
- `all-of-me-john-legend.mp3` 
- `thinking-out-loud-ed-sheeran.mp3`
- `cant-help-myself-four-tops.mp3`

## Supported Formats

- **MP3** (recommended) - Best compatibility
- **WAV** - High quality, larger files
- **OGG** - Good compression, modern browsers
- **M4A** - Apple format, good quality

## File Size Recommendations

- **Standard Quality:** 128-192 kbps MP3 (3-5 MB per song)
- **High Quality:** 256-320 kbps MP3 (6-10 MB per song)
- **Maximum:** Keep under 15 MB per song for web performance

## How to Add Songs

1. **Download your songs** (legally purchased)
2. **Convert to MP3** if needed (use tools like Audacity, VLC, or online converters)
3. **Rename files** using the convention above
4. **Copy files** to this folder
5. **Update** `src/components/features/our-songs-playlist.tsx` with the file paths

## Example Song Entry

```typescript
{
  id: '5',
  title: 'Your Song Title',
  artist: 'Artist Name',
  album: 'Album Name',
  duration: 245, // Duration in seconds
  previewUrl: '/audio/songs/your-song-artist.mp3', // Path to your file
  musicUrl: 'https://music.youtube.com/watch?v=VIDEO_ID',
  albumArt: '/images/songs/album-art.jpg',
  significance: 'Why this song is special to you both',
  addedBy: 'couple',
  dateAdded: new Date('2024-11-12'),
}
```

## Legal Note

Only use songs that you have legally purchased or have the rights to use on your website.
