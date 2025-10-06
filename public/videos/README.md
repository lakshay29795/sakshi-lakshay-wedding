# Gift Reveal Video

This folder contains the gift reveal video that plays when users first visit your wedding website.

## Video Requirements

### File Location
Place your video file(s) in this directory:
- `public/videos/gift-reveal.mp4` (recommended)
- `public/videos/gift-reveal.webm` (optional, for better browser compatibility)

### Video Specifications

**Recommended Format:**
- Format: MP4 (H.264 codec)
- Resolution: 1920x1080 (1080p) or 1280x720 (720p)
- Orientation: Landscape (horizontal) or Portrait (vertical) - both work
- Duration: 3-10 seconds recommended
- Frame Rate: 30fps or 60fps
- File Size: Keep under 10MB for fast loading

**For Best Quality:**
- Use high-quality source footage
- Good lighting and contrast
- Clear, cinematic visuals
- Consider adding subtle music/sound effects

### Video Content Ideas

Perfect for this gift reveal:
- 🎀 Ribbon untying animation
- 🎁 Gift box opening sequence
- ✨ Elegant transition animation
- 💫 Abstract golden particles/lights
- 🌟 Luxury brand-style reveal
- 🎬 Cinematic fade/bloom effects

### Converting Your Video

If you need to convert your video to the right format:

**Using FFmpeg (Command Line):**
```bash
# Convert to MP4 (H.264)
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k gift-reveal.mp4

# Convert to WebM (VP9)
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus gift-reveal.webm

# Compress existing video
ffmpeg -i gift-reveal.mp4 -c:v libx264 -crf 28 -preset slow gift-reveal-compressed.mp4
```

**Using HandBrake (GUI):**
1. Download HandBrake (free)
2. Import your video
3. Choose "Fast 1080p30" preset
4. Adjust quality slider (lower = smaller file)
5. Click "Start Encode"

**Online Tools:**
- CloudConvert (https://cloudconvert.com)
- Online-Convert (https://www.online-convert.com)
- Zamzar (https://www.zamzar.com)

## How It Works

1. **User arrives** at your website
2. **Black screen** with video in background
3. **Elegant prompt** appears: "A GIFT FOR YOU - Click anywhere to unwrap"
4. **User clicks** anywhere on screen
5. **Video plays** full screen
6. **When video ends**, smooth white gradient fade
7. **Main website** appears

## Testing

To test the video:
1. Place your video file as `public/videos/gift-reveal.mp4`
2. Visit `http://localhost:3000`
3. Click to start the video
4. Video should play and transition to website

## Fallback Behavior

If the video fails to load or play:
- The component will automatically skip to the website
- No error shown to user
- Graceful degradation

## Tips

✅ **DO:**
- Keep video under 10MB
- Use high quality but compressed
- Test on mobile devices
- Add subtle audio if desired
- Make it elegant and mysterious

❌ **DON'T:**
- Don't reveal website theme in video
- Don't make it too long (>10 seconds)
- Don't use huge file sizes
- Don't include jarring cuts

## Current Setup

The component looks for:
- Primary: `/videos/gift-reveal.mp4`
- Fallback: `/videos/gift-reveal.webm`

Both formats provide maximum browser compatibility.

