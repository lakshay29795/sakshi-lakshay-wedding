# Video Messages

This folder contains video messages from family members for the special messages page.

## Video Requirements

### Format and Specifications
- **Format**: MP4 (H.264 codec recommended for best compatibility)
- **Resolution**: 1920x1080 (1080p) or 1280x720 (720p)
- **Orientation**: Landscape (horizontal) preferred
- **Duration**: 1-5 minutes recommended
- **File Size**: Try to keep under 50MB per video for faster loading

### Naming Convention
Use descriptive names that match your data:
- `mom-message.mp4` - Mother's video message
- `dad-message.mp4` - Father's video message
- `sister-message.mp4` - Sister's video message
- `brother-message.mp4` - Brother's video message
- `grandma-message.mp4` - Grandmother's video message
- `grandpa-message.mp4` - Grandfather's video message
- `bestfriend-message.mp4` - Best friend's video message
- etc.

## How to Add Videos

1. Record or collect video messages from family members
2. Convert to MP4 format if needed (use tools like HandBrake, FFmpeg, or online converters)
3. Place videos in this directory (`public/videos/messages/`)
4. Update `src/data/video-messages-data.ts` with correct video paths
5. Ensure thumbnail images are also added to `public/images/messages/`

## Video Compression Tips

If your videos are too large:

### Using FFmpeg (Command Line)
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -c:a aac -b:a 128k output.mp4
```

### Using HandBrake (GUI)
1. Download HandBrake (free)
2. Import your video
3. Choose "Fast 1080p30" or "Fast 720p30" preset
4. Click "Start Encode"

### Online Tools
- CloudConvert
- Online-Convert
- Zamzar

## Recording Tips for Family Members

Share these tips with family members recording messages:
- Use good lighting (natural light or well-lit room)
- Hold phone/camera steady (use a tripod or prop it up)
- Record in a quiet environment
- Speak clearly and look at the camera
- Keep messages heartfelt and personal
- 2-3 minutes is ideal
- Record horizontally (landscape mode)

## Privacy Note
These videos are personal and should not be shared publicly. They're only accessible through your wedding website.

