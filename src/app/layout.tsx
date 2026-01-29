import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";
import "@/styles/romantic-theme.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { PWAInstallPrompt, PWAInstallButton } from "@/components/pwa/PWAInstallPrompt";
import { FirstVisitWrapper } from "@/components/features/first-visit-wrapper";
import { websiteConfig } from "@/config/website.config";
import { getWeddingDate } from "@/lib/wedding-date";

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

const siteTitle = `${websiteConfig.couple.bride.name} & ${websiteConfig.couple.groom.name}'s Wedding`;
const coupleNames = `${websiteConfig.couple.bride.name} & ${websiteConfig.couple.groom.name}`;
const weddingDate = getWeddingDate();
const formattedDate = weddingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: `Join us as we celebrate our love story and begin our journey as husband and wife on ${formattedDate} at ${websiteConfig.wedding.venue.name}.`,
  keywords: [
    "wedding",
    `${websiteConfig.couple.bride.fullName}`,
    `${websiteConfig.couple.groom.fullName}`,
    weddingDate.getFullYear().toString(),
    websiteConfig.wedding.venue.name,
    "wedding invitation",
    "RSVP",
    "love story",
  ],
  authors: [{ name: coupleNames }],
  creator: coupleNames,
  publisher: coupleNames,
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
    title: siteTitle,
    description: `Join us as we celebrate our love story and begin our journey as husband and wife on ${formattedDate}.`,
    siteName: siteTitle,
    images: [
      {
        url: "/images/couple/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: coupleNames,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
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
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/demo-content/images/gift-logo.jpg", sizes: "192x192", type: "image/jpeg" },
    ],
    apple: [
      { url: "/demo-content/images/gift-logo.jpg", sizes: "192x192", type: "image/jpeg" },
    ],
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
        <link rel="icon" href="/demo-content/images/gift-logo.jpg" sizes="any" />
        <link rel="icon" href="/demo-content/images/gift-logo.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/demo-content/images/gift-logo.jpg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={coupleNames} />
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
        <FirstVisitWrapper>
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
        </FirstVisitWrapper>
      </body>
    </html>
  );
}
