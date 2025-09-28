# Avatar Images Directory

This directory contains avatar images for the Custom Couple Avatars feature.

## Directory Structure

```
public/images/avatars/
├── romantic-cartoon/
│   ├── bride.png
│   ├── groom.png
│   └── couple.png
├── minimalist/
│   ├── bride.png
│   ├── groom.png
│   └── couple.png
├── watercolor/
│   ├── bride.png
│   ├── groom.png
│   └── couple.png
├── vintage/
│   ├── bride.png
│   ├── groom.png
│   └── couple.png
└── previews/
    ├── romantic-cartoon.jpg
    ├── minimalist.jpg
    ├── watercolor.jpg
    └── vintage.jpg
```

## Image Specifications

### Avatar Images
- **Format**: PNG with transparent background
- **Size**: 400x400px for individual avatars, 800x400px for couple avatars
- **Style**: Match the artistic style (romantic, minimalist, watercolor, vintage)

### Preview Images
- **Format**: JPG
- **Size**: 200x200px
- **Content**: Small preview showing the style characteristics

## How to Add Your Own Images

1. **Create or commission avatars** in the 4 different styles
2. **Save them** in the appropriate directories with the correct names
3. **Update the avatar component** to use these images instead of SVG generation
4. **Test** that all images load correctly

## AI Generation Services

You can use these services to create custom avatars:
- **Midjourney**: For artistic watercolor and romantic styles
- **DALL-E**: For minimalist and cartoon styles
- **Stable Diffusion**: For vintage and custom styles
- **Canva**: For simple cartoon-style avatars

## Example Prompts

### Romantic Cartoon Style
"Cute cartoon wedding couple, bride with long brown hair in wedding dress, groom in black suit, soft pink and sage green colors, heart decorations, romantic style, transparent background"

### Minimalist Style
"Simple line art wedding couple, clean minimal design, bride and groom silhouettes, black and white with sage green accents, modern geometric style"

### Watercolor Style
"Watercolor painting of wedding couple, artistic brush strokes, soft flowing colors, romantic and dreamy, warm color palette with pink and green tones"

### Vintage Style
"Vintage illustration wedding couple, classic 1920s style, elegant formal wear, sepia tones with brown and gold colors, art deco elements"
