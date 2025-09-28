# 🔧 Wedding Website Configuration Guide

## Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

### Firebase Configuration (Client-side)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Firebase Admin Configuration (Server-side)
```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

### Email Configuration
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM="Sarah & Michael <noreply@sarahandmichael.com>"
EMAIL_REPLY_TO=sarah.michael.wedding@example.com
ADMIN_EMAIL=admin@sarahandmichael.com
```

### Application Configuration
```env
NEXT_PUBLIC_DOMAIN=sarahandmichael.com
NODE_ENV=development
```

## Firebase Setup Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "sarah-michael-wedding")
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll configure security rules later)
4. Select a location close to your users

### 3. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon to add a web app
4. Register app with nickname
5. Copy the configuration object values to your `.env.local`

### 4. Generate Service Account Key
1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the values for `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`

### 5. Configure Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // RSVPs - Allow read/write for authenticated users, read for all
    match /rsvps/{document} {
      allow read: if true;
      allow write: if request.auth != null || resource == null;
    }
    
    // Guests - Same as RSVPs
    match /guests/{document} {
      allow read: if true;
      allow write: if request.auth != null || resource == null;
    }
    
    // Guest Book - Allow read for all, write for authenticated
    match /guestBook/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Admin only collections
    match /adminSettings/{document} {
      allow read, write: if request.auth != null && 
        request.auth.token.email in ['admin@sarahandmichael.com'];
    }
  }
}
```

## Email Service Setup (Resend)

### 1. Create Resend Account
1. Go to [Resend](https://resend.com/)
2. Sign up for an account
3. Verify your email address

### 2. Add Domain (Optional but Recommended)
1. Go to Domains in Resend dashboard
2. Add your domain (e.g., sarahandmichael.com)
3. Configure DNS records as instructed
4. Verify domain

### 3. Get API Key
1. Go to API Keys in Resend dashboard
2. Click "Create API Key"
3. Give it a name (e.g., "Wedding Website")
4. Copy the API key to your `.env.local`

## Database Collections Structure

### RSVPs Collection (`rsvps`)
```typescript
{
  id: string;
  primaryGuestName: string;
  primaryGuestEmail: string;
  phone?: string;
  isAttending: boolean;
  guests: Guest[];
  totalGuests: number;
  message?: string;
  songRequest?: string;
  accommodationNeeded?: boolean;
  transportationNeeded?: boolean;
  status: 'pending' | 'confirmed' | 'declined';
  submittedAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Guests Collection (`guests`)
```typescript
{
  id: string;
  rsvpId: string;
  name: string;
  email?: string;
  mealPreference: 'vegetarian' | 'vegan' | 'gluten-free' | 'regular';
  dietaryRestrictions?: string;
  isChild?: boolean;
  age?: number;
  submittedAt: Timestamp;
}
```

### Guest Book Collection (`guestBook`)
```typescript
{
  id: string;
  name: string;
  email?: string;
  message: string;
  photo?: string;
  isApproved: boolean;
  submittedAt: Timestamp;
  likes: number;
}
```

## Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create `.env.local` with the variables listed above.

### 3. Run Development Server
```bash
npm run dev
```

### 4. Test RSVP Functionality
1. Go to `http://localhost:3000/rsvp`
2. Fill out the form
3. Check Firebase Console to see the data
4. Check your email for confirmation (if configured)

## Production Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
Make sure to set all environment variables in your hosting platform:
- All Firebase configuration variables
- Email service configuration
- Domain configuration

## Security Considerations

### 1. Firestore Security Rules
- Implement proper security rules before going live
- Restrict write access to authenticated users only
- Consider rate limiting for public endpoints

### 2. API Rate Limiting
- The current implementation uses in-memory rate limiting
- For production, consider using Redis or similar for distributed rate limiting

### 3. Input Validation
- All API endpoints validate input using Zod schemas
- Client-side validation is also implemented

### 4. Email Security
- Use environment variables for all sensitive configuration
- Implement proper error handling to avoid information leakage
- Consider implementing email verification for RSVPs

## Monitoring and Analytics

### Error Tracking
Consider adding Sentry for error tracking:
```env
SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@sentry.io/xxxxxxx
```

### Analytics
Google Analytics is already configured. Add your measurement ID:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Backup and Recovery

### Database Backups
1. Enable automatic backups in Firebase Console
2. Consider exporting data periodically for additional backup
3. Test restore procedures before going live

### Code Backups
- Use Git for version control
- Keep production environment variables secure and backed up separately
- Document any manual configuration steps

## Support and Maintenance

### Regular Tasks
- Monitor RSVP submissions
- Check email delivery status
- Review Firebase usage and costs
- Update dependencies regularly

### Troubleshooting
- Check Firebase Console for errors
- Monitor API endpoint logs
- Verify email service status
- Test form submissions regularly