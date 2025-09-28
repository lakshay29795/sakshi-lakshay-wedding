# 🔥 Firebase Setup Guide

## 🚨 Current Issue: Firebase Authentication Error

You're seeing this error because Firebase is not properly configured:
```
Firebase: Error (auth/invalid-api-key)
```

## 🛠️ Quick Fix Options

### **Option 1: Disable Firebase Features (Fastest)**

If you don't need Firebase features right now, you can disable them:

1. **Create `.env.local` file** in your project root:
```bash
# Disable Firebase-dependent features
NEXT_PUBLIC_NOTIFICATIONS_ENABLED=false
NEXT_PUBLIC_PUSH_NOTIFICATIONS_ENABLED=false
```

2. **Restart your development server**:
```bash
npm run dev
```

### **Option 2: Set Up Firebase (Full Features)**

To enable all features, set up Firebase:

#### **Step 1: Get Firebase Configuration**

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project**: `wedding-project-3525f`
3. **Go to Project Settings** (gear icon)
4. **Scroll to "Your apps"** section
5. **Copy the configuration object**

#### **Step 2: Create Environment File**

Create `.env.local` in your project root:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDkSlFn8Ya1H1I42oQFggLBvRcHX8hiWDk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=wedding-project-3525f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=wedding-project-3525f
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=133500127923
NEXT_PUBLIC_FIREBASE_APP_ID=1:133500127923:web:59c9618046fd74a9d7fec6
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-VQYMXP7FJC

# App Configuration
NEXT_PUBLIC_APP_NAME="Sakshi & Lakshay's Wedding"
NEXT_PUBLIC_COUPLE_NAMES="Sakshi & Lakshay"
NEXT_PUBLIC_WEDDING_DATE=2025-11-12

# Enable Features
NEXT_PUBLIC_PWA_ENABLED=true
NEXT_PUBLIC_GUESTBOOK_ENABLED=true
NEXT_PUBLIC_RSVP_ENABLED=true
NEXT_PUBLIC_NOTIFICATIONS_ENABLED=true
```

#### **Step 3: Restart Development Server**

```bash
npm run dev
```

## 🖼️ Avatar Images Fix

The 404 errors for avatar images are normal - they're looking for PNG files that don't exist yet.

### **Current Status:**
- ✅ **SVG avatars work** (generated dynamically)
- ✅ **Photo upload works** (upload your own photos)
- ❌ **PNG images missing** (need to be created)

### **To Add Real Avatar Images:**

1. **Generate AI avatars** using Midjourney/DALL-E
2. **Save as PNG files** in this structure:
```
public/images/avatars/
├── romantic-cartoon/
│   ├── bride.png
│   ├── groom.png
│   └── couple.png
├── minimalist/
├── watercolor/
└── vintage/
```

3. **Click "Use Images"** in the avatar component

## 🎯 What Works Right Now

Even without Firebase, these features work perfectly:

- ✅ **Interactive Love Map** - Location stories
- ✅ **Love Language Quiz** - Personality quiz
- ✅ **Custom Avatars** - SVG generation + photo upload
- ✅ **Music Playlist** - Song previews
- ✅ **Photo Gallery** - Image viewing
- ✅ **RSVP Form** - Basic form (no database)
- ✅ **Guest Book** - Sample data mode

## 🔥 What Needs Firebase

These features require Firebase configuration:

- 🔥 **Real-time guest book** - Live message updates
- 🔥 **RSVP database** - Storing responses
- 🔥 **Push notifications** - Wedding reminders
- 🔥 **Admin dashboard** - Managing content

## 🚀 Recommended Approach

1. **Start with Option 1** (disable Firebase) to test everything else
2. **Set up Firebase later** when you need database features
3. **Focus on content first** - add your photos, customize text
4. **Add Firebase when ready** for production deployment

## 📞 Need Help?

The website works great without Firebase! You can:
- **Test all interactive features**
- **Upload photos to avatars**
- **Customize content**
- **Deploy to Vercel**

Firebase is only needed for real-time database features.
