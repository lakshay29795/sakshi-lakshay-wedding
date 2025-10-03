import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";
import "@/styles/romantic-theme.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { PWAInstallPrompt, PWAInstallButton } from "@/components/pwa/PWAInstallPrompt";

// Font configurations
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sakshi & Lakshay's Wedding",
    template: "%s | Sakshi & Lakshay's Wedding",
  },
  description: "Join us as we celebrate our love story and begin our journey as husband and wife on November 12, 2025 at Rosewood Manor.",
  keywords: [
    "wedding",
    "Sakshi Johnson",
    "Lakshay Smith",
    "November 2025",
    "Rosewood Manor",
    "wedding invitation",
    "RSVP",
    "love story",
  ],
  authors: [{ name: "Sakshi & Lakshay" }],
  creator: "Sakshi & Lakshay",
  publisher: "Sakshi & Lakshay",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Sakshi & Lakshay's Wedding",
    description: "Join us as we celebrate our love story and begin our journey as husband and wife on November 12, 2025.",
    siteName: "Sakshi & Lakshay's Wedding",
    images: [
      {
        url: "/images/couple/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sakshi & Lakshay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sakshi & Lakshay's Wedding",
    description: "Join us as we celebrate our love story and begin our journey as husband and wife.",
    images: ["/images/couple/hero-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#A8B5A0" },
    { media: "(prefers-color-scheme: dark)", color: "#A8B5A0" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/icon-192x192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sakshi & Lakshay" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#A8B5A0" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/firebase-messaging-sw.js')
                  .then((registration) => {
                    console.log('Firebase Messaging SW registered:', registration);
                  })
                  .catch((error) => {
                    console.log('Firebase Messaging SW registration failed:', error);
                  });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${dancing.variable} font-sans antialiased bg-background text-foreground`}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pt-16 md:pt-20">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
        <PWAInstallPrompt />
        <PWAInstallButton />
      </body>
    </html>
  );
}
