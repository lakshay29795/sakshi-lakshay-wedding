# 💕 Sakshi & Lakshay's Wedding Website

A beautiful, modern wedding website built with Next.js, featuring real-time guest book, RSVP management, and PWA capabilities.

## 🌟 Features

- **📱 Progressive Web App (PWA)** - Installable on mobile devices
- **💌 RSVP Management** - Complete RSVP system with guest details
- **📖 Guest Book** - Real-time guest messages with Firebase
- **📸 Photo Gallery** - Beautiful image gallery with lightbox
- **💕 Love Story Timeline** - Interactive timeline of your relationship
- **🔔 Push Notifications** - Wedding updates and reminders
- **📱 Mobile Responsive** - Perfect on all screen sizes
- **🎨 Beautiful Design** - Romantic and elegant UI/UX

## 🚀 Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Storage:** Vercel Blob Storage
- **Deployment:** Vercel
- **PWA:** Next-PWA
- **Forms:** React Hook Form + Zod validation

## 📅 Wedding Details

- **Couple:** Sakshi & Lakshay
- **Date:** November 12, 2025
- **Time:** 4:00 PM
- **Venue:** Rosewood Manor

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project
- Vercel account

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wedding-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set environment variables** in Vercel dashboard

3. **Deploy**
   ```bash
   vercel --prod
   ```

## 📱 PWA Installation

### Android
1. Open the website in Chrome
2. Tap menu (⋮) → "Add to Home Screen"
3. App appears on home screen

### iOS
1. Open the website in Safari
2. Tap Share (□↗) → "Add to Home Screen"
3. App appears on home screen

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Set up security rules
5. Generate service account key for admin functions

### Vercel Blob Storage
1. Enable Vercel Blob in your project
2. Configure image upload endpoints
3. Set up proper CORS policies

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/            # React components
│   ├── features/         # Feature-specific components
│   ├── layout/          # Layout components
│   ├── ui/              # Reusable UI components
│   └── ...
├── lib/                  # Utility libraries
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── data/                # Static data and configurations
└── styles/              # Global styles
```

## 🎨 Customization

### Colors & Theme
Edit `tailwind.config.js` to customize the color scheme:
```js
colors: {
  'sage-green': '#A8B5A0',
  'blush-pink': '#F8E8E8',
  'cream': '#FFF8F0',
  // ... more colors
}
```

### Wedding Information
Update `src/data/wedding-info.ts` with your details:
- Couple names
- Wedding date and time
- Venue information
- Timeline events

## 📊 Analytics & Monitoring

- **Vercel Analytics** - Built-in performance monitoring
- **Firebase Analytics** - User engagement tracking
- **Error Tracking** - Automatic error reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💝 Acknowledgments

- Built with love for Sakshi & Lakshay's special day
- Inspired by modern web design principles
- Thanks to the open-source community

## 📞 Support

For questions or support, please contact:
- Email: sakshi.lakshay.wedding@example.com
- Website: [Your Wedding Website URL]

---

**Made with 💕 for our special day - November 12, 2025**