# 🏗️ Admin Configuration System - Architecture

## 📐 System Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    WEDDING WEBSITE                            │
│                  Configuration System                         │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐         ┌──────────────────────┐
│   CONFIGURATION     │         │    ADMIN PANEL       │
│       FILES         │         │        UI            │
│                     │         │                      │
│ /config/            │         │ /admin/config        │
│ ├── website.config  │◄────────┤                      │
│ ├── content.config  │ Fallback│ ┌──────────────────┐ │
│ ├── assets.config   │         │ │  Couple Info Tab │ │
│ ├── quiz.config     │         │ │  Wedding Details │ │
│ └── daily-reveals   │         │ │  Site Settings   │ │
└─────────────────────┘         │ │  Theme & Style   │ │
                                │ └──────────────────┘ │
                                │                      │
                                │ [Save Changes]       │
                                └──────────┬───────────┘
                                           │
                                           │ POST /api/admin/config
                                           ↓
                                ┌──────────────────────┐
                                │   FIREBASE           │
                                │   FIRESTORE          │
                                │                      │
                                │ /settings/           │
                                │   website-config     │
                                │                      │
                                │ {                    │
                                │   couple: {...}      │
                                │   wedding: {...}     │
                                │   site: {...}        │
                                │   theme: {...}       │
                                │ }                    │
                                └──────────┬───────────┘
                                           │
                                           │ GET (with cache)
                                           ↓
                                ┌──────────────────────┐
                                │  DYNAMIC CONFIG      │
                                │     LOADER           │
                                │                      │
                                │ loadDynamicConfig()  │
                                │                      │
                                │ Cache: 1 minute      │
                                └──────────┬───────────┘
                                           │
                                           │ Provides config to
                                           ↓
┌──────────────────────────────────────────────────────────────┐
│                    WEBSITE COMPONENTS                         │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Header  │  │   Hero   │  │  Footer  │  │ Metadata │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  All components use config through:                          │
│  - websiteConfig (static or dynamic)                         │
│  - useConfig() hook (client-side)                            │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### Configuration Priority Order

```
┌─────────────────────────────────────────┐
│  1. Check Firebase                       │
│     ↓ Available?                         │
│     YES → Use Firebase config            │ ← Admin edits
│     NO  → Go to step 2                   │
└─────────────────────────────────────────┘
                    ↓ (if Firebase unavailable)
┌─────────────────────────────────────────┐
│  2. Check Static Config Files           │
│     Use /config/*.ts files               │ ← Developer edits
└─────────────────────────────────────────┘
                    ↓ (if config missing)
┌─────────────────────────────────────────┐
│  3. Use Hardcoded Defaults              │
│     Fallback values in code              │
└─────────────────────────────────────────┘
```

### Admin Panel Workflow

```
User Opens /admin/config
        ↓
┌──────────────────────┐
│ Load Current Config  │ ← GET /api/admin/config
│                      │   (reads from Firebase)
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  Display in Forms    │
│  - Couple Info       │
│  - Wedding Details   │
│  - Site Settings     │
│  - Theme & Style     │
└──────────┬───────────┘
           ↓
    User Makes Edits
           ↓
┌──────────────────────┐
│  Validate Form       │
│  Show Errors if any  │
└──────────┬───────────┘
           ↓
    User Clicks Save
           ↓
┌──────────────────────┐
│  POST to API         │ → /api/admin/config
│  Save to Firebase    │   (saves to Firestore)
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  Trigger Revalidate  │ → POST /api/revalidate
│  Clear Caches        │   (clears Next.js cache)
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  Show Success Toast  │
│  "Changes Saved!"    │
└──────────────────────┘
           ↓
    User Refreshes Website
           ↓
┌──────────────────────┐
│  Website Loads       │
│  New Config Applied  │
└──────────────────────┘
```

---

## 🗂️ File Structure & Responsibilities

### Admin UI Layer
```
src/app/admin/config/page.tsx
├── Responsibilities:
│   ├── Render tabbed interface
│   ├── Load current config from API
│   ├── Handle form state management
│   ├── Validate user input
│   ├── Save changes to API
│   ├── Import/Export functionality
│   └── Show success/error messages
│
└── Uses:
    ├── React useState (form state)
    ├── React useEffect (load config)
    ├── Tabs component (UI organization)
    ├── Form components (input, textarea, etc.)
    └── Sonner (toast notifications)
```

### API Layer
```
src/app/api/admin/config/route.ts
├── GET Endpoint:
│   ├── Reads from Firebase Firestore
│   ├── Returns current config
│   └── Fallback to default if none exists
│
└── POST Endpoint:
    ├── Validates incoming data
    ├── Saves to Firebase Firestore
    ├── Returns success/error
    └── Logs timestamp

src/app/api/revalidate/route.ts
├── POST Endpoint:
│   ├── Calls Next.js revalidatePath()
│   ├── Clears cache for all pages
│   └── Returns success confirmation
```

### Dynamic Config Layer
```
src/lib/dynamic-config.ts
├── loadDynamicConfig():
│   ├── Checks cache (1-min TTL)
│   ├── Loads from Firebase if expired
│   ├── Falls back to static config
│   └── Returns merged config object
│
├── useDynamicConfig():
│   ├── React hook for client-side
│   ├── Returns config and loading state
│   └── Auto-refreshes on mount
│
├── clearConfigCache():
│   ├── Clears in-memory cache
│   └── Forces reload on next access
│
└── syncStaticToFirebase():
    ├── One-time sync utility
    └── Uploads static config to Firebase
```

### Provider Layer
```
src/components/providers/ConfigProvider.tsx
├── ConfigProvider Component:
│   ├── Wraps app with React Context
│   ├── Loads config on mount
│   ├── Provides config to all children
│   └── Handles refresh functionality
│
└── useConfig() Hook:
    ├── Access config from any component
    ├── Returns { config, loading, refresh }
    └── Type-safe config access
```

---

## 📊 Component Hierarchy

```
┌─────────────────────────────────────────────┐
│         App Layout (layout.tsx)              │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │     ConfigProvider (optional)        │  │
│  │                                      │  │
│  │  ┌────────────────────────────────┐ │  │
│  │  │      Page Components           │ │  │
│  │  │                                │ │  │
│  │  │  ┌──────────────────────────┐ │ │  │
│  │  │  │  Header                  │ │ │  │
│  │  │  │  ├── useConfig()        │ │ │  │
│  │  │  │  └── Shows couple names │ │ │  │
│  │  │  └──────────────────────────┘ │ │  │
│  │  │                                │ │  │
│  │  │  ┌──────────────────────────┐ │ │  │
│  │  │  │  Hero Section            │ │ │  │
│  │  │  │  ├── useConfig()        │ │ │  │
│  │  │  │  └── Shows date/names   │ │ │  │
│  │  │  └──────────────────────────┘ │ │  │
│  │  │                                │ │  │
│  │  │  ┌──────────────────────────┐ │ │  │
│  │  │  │  Countdown Timer         │ │ │  │
│  │  │  │  ├── getWeddingDate()   │ │ │  │
│  │  │  │  └── Dynamic date       │ │ │  │
│  │  │  └──────────────────────────┘ │ │  │
│  │  │                                │ │  │
│  │  │  ┌──────────────────────────┐ │ │  │
│  │  │  │  Footer                  │ │ │  │
│  │  │  │  ├── useConfig()        │ │ │  │
│  │  │  │  └── Shows venue/date   │ │ │  │
│  │  │  └──────────────────────────┘ │ │  │
│  │  └────────────────────────────────┘ │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 🔐 Security Architecture

```
┌────────────────────────────────────────┐
│       Client Browser                    │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   /admin/config                  │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│        Request with Auth Token         │
└─────────────────┼────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│       Next.js Server                     │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Middleware (middleware.ts)      │   │
│  │  ├── Check authentication       │   │
│  │  ├── Verify admin role          │   │
│  │  └── Allow/Deny access          │   │
│  └──────────────┬───────────────────┘   │
│                 ↓                        │
│  ┌──────────────────────────────────┐   │
│  │  API Route (/api/admin/config)  │   │
│  │  ├── Validate request           │   │
│  │  ├── Sanitize input             │   │
│  │  └── Process request            │   │
│  └──────────────┬───────────────────┘   │
└─────────────────┼────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│           Firebase                       │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Firestore Security Rules       │   │
│  │  ├── Require authentication     │   │
│  │  ├── Check admin role           │   │
│  │  └── Validate data structure    │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Security Layers

1. **Route Protection** (middleware.ts)
   - Checks if user is authenticated
   - Verifies admin role
   - Redirects if unauthorized

2. **API Validation** (route.ts)
   - Validates request format
   - Sanitizes input data
   - Checks data structure

3. **Firebase Rules** (firestore.rules)
   - Server-side validation
   - Role-based access
   - Data integrity checks

---

## ⚡ Performance Architecture

### Caching Strategy

```
┌────────────────────────────────────────────┐
│          Request for Config                 │
└────────────────┬───────────────────────────┘
                 ↓
         Check In-Memory Cache
                 ↓
        ┌─────────────────┐
        │ Cache Valid?    │
        │ (< 1 minute old)│
        └────┬───────┬────┘
             │       │
            YES      NO
             │       │
             ↓       ↓
    ┌────────────┐  ┌────────────────────┐
    │ Return     │  │ Fetch from Firebase │
    │ Cached     │  │ Update Cache       │
    │ Config     │  │ Reset Timer        │
    └────────────┘  └──────────┬─────────┘
                               ↓
                    ┌─────────────────────┐
                    │ Return Fresh Config │
                    └─────────────────────┘
```

### Cache Invalidation

```
Admin Saves Changes
         ↓
┌──────────────────────┐
│  POST /api/admin/    │
│       config         │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  Save to Firebase    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  POST /api/          │
│    revalidate        │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  Clear Next.js Cache │
│  - revalidatePath()  │
│  - All pages         │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  Clear Memory Cache  │
│  - clearConfigCache()│
└──────────────────────┘
           ↓
    Next Request Gets
     Fresh Config
```

### Optimization Techniques

1. **Client-Side Caching**
   - 1-minute in-memory cache
   - Reduces Firebase reads
   - Improves response time

2. **Static Generation**
   - Pages built at build time
   - Uses static config as baseline
   - Fast initial load

3. **Incremental Regeneration**
   - Pages regenerate on demand
   - revalidatePath() triggers
   - No full rebuild needed

4. **Lazy Loading**
   - Admin panel loads on demand
   - Not bundled with main app
   - Smaller initial bundle

---

## 🔄 State Management

### Admin Panel State

```typescript
┌─────────────────────────────────────┐
│  Admin Config Component              │
│                                      │
│  State:                              │
│  ├── config: ConfigState | null     │
│  ├── loading: boolean               │
│  ├── saving: boolean                │
│  └── hasChanges: boolean            │
│                                      │
│  Effects:                            │
│  ├── useEffect(() => loadConfig())  │
│  └── [on mount]                     │
│                                      │
│  Handlers:                           │
│  ├── updateConfig(path, value)      │
│  ├── handleSave()                   │
│  ├── exportConfig()                 │
│  └── importConfig(file)             │
└─────────────────────────────────────┘
```

### Global Config State (Optional)

```typescript
┌────────────────────────────────────┐
│  ConfigProvider (Context)          │
│                                     │
│  State:                             │
│  ├── config: DynamicConfig | null  │
│  ├── loading: boolean              │
│  └── refresh: () => Promise<void> │
│                                     │
│  Provider:                          │
│  ├── Wraps app                     │
│  ├── Loads on mount                │
│  └── Provides to children          │
│                                     │
│  Consumer (useConfig):              │
│  ├── Access from any component     │
│  ├── const { config } = useConfig()│
│  └── Type-safe access              │
└────────────────────────────────────┘
```

---

## 🧪 Testing Strategy

### Unit Tests

```
✓ Config validation
✓ Form state management
✓ Import/Export functions
✓ Cache logic
✓ Date utilities
```

### Integration Tests

```
✓ Admin panel loads config
✓ Save triggers API call
✓ API saves to Firebase
✓ Revalidation clears cache
✓ Website loads new config
```

### E2E Tests

```
✓ User logs in as admin
✓ Navigates to /admin/config
✓ Edits couple names
✓ Saves changes
✓ Refreshes website
✓ Verifies names updated
```

---

## 📈 Monitoring & Logging

### What to Monitor

```
1. API Response Times
   - GET /api/admin/config
   - POST /api/admin/config
   - POST /api/revalidate

2. Firebase Operations
   - Read latency
   - Write latency
   - Connection errors

3. Cache Performance
   - Hit rate
   - Miss rate
   - Invalidation frequency

4. User Actions
   - Save attempts
   - Failed saves
   - Import/Export usage
```

### Logging Points

```
src/app/api/admin/config/route.ts
├── Log config loads
├── Log config saves
├── Log validation errors
└── Log Firebase errors

src/lib/dynamic-config.ts
├── Log cache hits
├── Log cache misses
├── Log fallback usage
└── Log sync operations
```

---

## 🚀 Deployment Architecture

### Development

```
Local Machine
├── npm run dev
├── Next.js Dev Server (localhost:3000)
├── Hot Module Replacement
└── Real-time updates
```

### Production

```
┌────────────────────────────────────┐
│          CDN (Vercel)               │
│  ├── Static assets                 │
│  └── Cached pages                  │
└────────────────┬───────────────────┘
                 ↓
┌────────────────────────────────────┐
│     Serverless Functions            │
│  ├── API routes                    │
│  ├── Server components             │
│  └── Revalidation                  │
└────────────────┬───────────────────┘
                 ↓
┌────────────────────────────────────┐
│         Firebase                    │
│  ├── Firestore (config)           │
│  ├── Authentication                │
│  └── Hosting (optional)            │
└────────────────────────────────────┘
```

---

## 📚 Key Takeaways

### Architecture Principles

1. **Separation of Concerns**
   - UI layer (admin panel)
   - API layer (routes)
   - Data layer (Firebase)
   - Logic layer (utilities)

2. **Progressive Enhancement**
   - Works with static config
   - Enhanced with Firebase
   - Graceful fallback

3. **Performance First**
   - Caching at multiple levels
   - Lazy loading
   - Incremental regeneration

4. **Security by Design**
   - Authentication required
   - Role-based access
   - Input validation

5. **Developer Experience**
   - Type-safe
   - Well documented
   - Easy to extend

---

**This architecture provides a scalable, maintainable, and user-friendly configuration system for your wedding website!**

*Last Updated: December 9, 2025*


