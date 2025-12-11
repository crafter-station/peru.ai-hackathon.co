import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ChatBubble } from "@/components/chat/chat-bubble";
import { GithubBadge } from "@/components/github-badge";
import { PostHogProvider } from "@/providers/posthog";
import { PromoBanner } from "@/components/promo-banner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Custom font implementation - Adelle Mono
const adelleMonoFont = localFont({
  src: [
    {
      path: './fonts/Adelle Mono/AdelleMono-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Adelle Mono/AdelleMono-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './fonts/Adelle Mono/AdelleMono-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Adelle Mono/AdelleMono-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/Adelle Mono/AdelleMono-Semibold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Adelle Mono/AdelleMono-SemiboldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: './fonts/Adelle Mono/AdelleMono-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Adelle Mono/AdelleMono-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: './fonts/Adelle Mono/AdelleMono-Extrabold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/Adelle Mono/AdelleMono-ExtraboldItalic.ttf',
      weight: '800',
      style: 'italic',
    },
  ],
  variable: '--font-adelle-mono',
  display: 'swap',
});

// Optional: Adelle Mono Flex variant (more condensed/flexible spacing)
const adelleMonoFlexFont = localFont({
  src: [
    {
      path: './fonts/Adelle Mono/AdelleMonoFlex-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Adelle Mono/AdelleMonoFlex-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-adelle-mono-flex',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://peru.ai-hackathon.co"),
  title: "IA Hackathon Peru 2025 | 29-30 Noviembre",
  description: "Únete al evento de inteligencia artificial más importante del Perú. Innovación, tecnología y futuro. 29-30 de noviembre 2025.",
  openGraph: {
    title: "IA Hackathon Peru 2025 | 29-30 Noviembre",
    description: "Únete al evento de inteligencia artificial más importante del Perú. Innovación, tecnología y futuro. 29-30 de noviembre 2025.",
    url: "https://peru.ai-hackathon.co",
    siteName: "IA Hackathon Peru",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "IA Hackathon Peru 2025",
      },
    ],
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IA Hackathon Peru 2025 | 29-30 Noviembre",
    description: "Únete al evento de inteligencia artificial más importante del Perú. Innovación, tecnología y futuro. 29-30 de noviembre 2025.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "IA Hackathon Peru 2025",
    description: "Únete al evento de inteligencia artificial más importante del Perú. Innovación, tecnología y futuro.",
    startDate: "2025-11-29T00:00:00-05:00",
    endDate: "2025-11-30T23:59:59-05:00",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Peru",
      addressCountry: "PE",
    },
    organizer: {
      "@type": "Organization",
      name: "IA Hackathon Peru",
      url: "https://peru.ai-hackathon.co",
    },
    image: "https://peru.ai-hackathon.co/og-image.jpg",
    url: "https://peru.ai-hackathon.co",
  };

  return (
    <ClerkProvider>
      <html lang="es-PE" suppressHydrationWarning>
        <head>
          <link rel="stylesheet" href="https://use.typekit.net/kre7aao.css" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${adelleMonoFont.variable} ${adelleMonoFlexFont.variable} antialiased`}
        >
          <PostHogProvider>
            <Providers>
              <PromoBanner
                id="hack0-dev"
                text="Descubre más hackathons en Perú en"
                linkText="hack0.dev"
                linkUrl="https://hack0.dev/"
              />
              {children}
              <ChatBubble />
              <GithubBadge />
              <Analytics />
            </Providers>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}