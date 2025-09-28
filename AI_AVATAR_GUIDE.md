# 🎨 AI Avatar Images Guide

## 🌟 Overview

Your Custom Couple Avatars feature now supports **multiple ways to add images**:

1. **📤 Photo Upload** - Upload real photos of Sakshi & Lakshay
2. **🖼️ Pre-made Images** - Use AI-generated avatar images
3. **🎨 SVG Generation** - Dynamic SVG avatars (current default)

## 🚀 How to Use the New Features

### **Method 1: Upload Real Photos**

1. **Go to Interactive page** → Custom Couple Avatars section
2. **Click "Upload Photos"** button
3. **Drag & drop or click** to upload photos of Sakshi and Lakshay
4. **Photos are processed locally** - no server storage
5. **Switch between views** to see individual or combined photos

### **Method 2: Add AI-Generated Images**

#### **Step 1: Generate AI Avatars**

Use these AI services to create custom avatars:

**🎨 Midjourney Prompts:**
```
Romantic Cartoon Style:
"Cute cartoon wedding couple, Indian bride with long black hair in red lehenga, Indian groom in cream sherwani, soft pink and sage green colors, heart decorations, romantic style, transparent background --ar 1:1"

Minimalist Style:
"Simple line art Indian wedding couple, clean minimal design, bride and groom silhouettes, black and white with sage green accents, modern geometric style --ar 1:1"

Watercolor Style:
"Watercolor painting of Indian wedding couple, artistic brush strokes, soft flowing colors, romantic and dreamy, warm color palette with pink and green tones --ar 1:1"

Vintage Style:
"Vintage illustration Indian wedding couple, classic elegant style, formal traditional wear, sepia tones with brown and gold colors, art deco elements --ar 1:1"
```

**🤖 DALL-E Prompts:**
```
"Create a romantic cartoon-style avatar of an Indian wedding couple. The bride should have long black hair and wear a red lehenga, the groom should wear a cream sherwani. Use soft pink and sage green colors with heart decorations. Style should be cute and romantic with transparent background."
```

#### **Step 2: Organize Your Images**

Save your generated images in this structure:
```
public/images/avatars/
├── romantic-cartoon/
│   ├── bride.png (400x400px)
│   ├── groom.png (400x400px)
│   └── couple.png (800x400px)
├── minimalist/
│   ├── bride.png
│   ├── groom.png
│   └── couple.png
├── watercolor/
│   ├── bride.png
│   ├── groom.png
│   └── couple.png
└── vintage/
    ├── bride.png
    ├── groom.png
    └── couple.png
```

#### **Step 3: Enable Image Mode**

1. **Click "Use Images"** button in the avatar component
2. **Component will automatically load** your PNG files
3. **Fallback to SVG** if images don't exist

## 📁 Current File Structure

```
wedding-website/
├── public/images/avatars/
│   ├── romantic-cartoon/
│   │   ├── bride.svg (sample)
│   │   ├── groom.svg (sample)
│   │   └── couple.svg (sample)
│   ├── minimalist/ (sample SVGs)
│   ├── watercolor/ (sample SVGs)
│   ├── vintage/ (sample SVGs)
│   └── previews/ (style previews)
├── src/components/features/
│   ├── couple-avatars.tsx (main component)
│   └── avatar-photo-upload.tsx (upload component)
└── scripts/
    └── generate-sample-avatars.js (sample generator)
```

## 🎯 Image Specifications

### **Individual Avatars (bride.png, groom.png)**
- **Size**: 400x400 pixels
- **Format**: PNG with transparent background
- **Content**: Individual portrait of bride or groom
- **Style**: Match the artistic theme (romantic, minimalist, etc.)

### **Couple Avatars (couple.png)**
- **Size**: 800x400 pixels (landscape)
- **Format**: PNG with transparent background
- **Content**: Both bride and groom side by side
- **Style**: Include connecting elements (hearts, decorative lines)

### **Preview Images (optional)**
- **Size**: 200x200 pixels
- **Format**: JPG or PNG
- **Content**: Small preview showing style characteristics

## 🛠️ Technical Features

### **Smart Image Loading**
```typescript
// Component checks for images in this order:
1. Real uploaded photos (if available)
2. Pre-made PNG images (if "Use Images" is enabled)
3. Generated SVG avatars (fallback)
```

### **Photo Upload Features**
- **Drag & drop** support
- **Local processing** (no server upload)
- **Automatic cropping** to circular format
- **Real-time preview**
- **Privacy-focused** (images stay in browser)

### **Download Functionality**
- **SVG files** for vector graphics
- **High quality** at any size
- **Perfect for printing** invitations, cards, etc.

## 🎨 Style Characteristics

### **Romantic Cartoon**
- Soft pink and sage green colors
- Heart decorations and flourishes
- Cute, friendly cartoon style
- Wedding dress and formal wear

### **Minimalist**
- Clean lines and simple shapes
- Gray and sage green palette
- Modern, geometric design
- Elegant simplicity

### **Watercolor**
- Artistic brush stroke effects
- Warm orange and yellow tones
- Flowing, organic shapes
- Painterly texture

### **Vintage**
- Classic brown and gold colors
- Art deco elements
- Formal, elegant styling
- Timeless design with initials

## 🚀 Quick Start Guide

### **Option A: Use Current SVG System**
1. **No setup needed** - works immediately
2. **Dynamic generation** with style variations
3. **Perfect for testing** and immediate use

### **Option B: Add Real Photos**
1. **Click "Upload Photos"** in the component
2. **Upload photos** of Sakshi and Lakshay
3. **See personalized avatars** instantly

### **Option C: Commission AI Avatars**
1. **Use AI services** (Midjourney, DALL-E, etc.)
2. **Generate 4 styles** × 3 views = 12 images
3. **Replace sample SVGs** with your PNG files
4. **Enable "Use Images"** mode

## 💡 Pro Tips

### **For Best Results:**
- **Use high-quality photos** for uploads (clear, well-lit)
- **Maintain consistent style** across all 4 artistic themes
- **Include traditional elements** (lehenga, sherwani) for authenticity
- **Test on mobile** to ensure images look good at small sizes

### **AI Generation Tips:**
- **Be specific** about clothing and cultural elements
- **Request transparent backgrounds** for clean integration
- **Generate multiple variations** and pick the best ones
- **Consider hiring an artist** for truly custom results

## 🎉 Demo & Testing

**Try the demo page:** `/demo-avatars`

This page shows exactly how all features work with step-by-step instructions.

## 📞 Need Help?

The avatar system is now fully functional with:
- ✅ **Photo upload** capability
- ✅ **Image file** support
- ✅ **SVG generation** fallback
- ✅ **Download** functionality
- ✅ **Style switching**
- ✅ **Mobile responsive**

Your guests will love creating and downloading personalized avatars! 🎨💕
