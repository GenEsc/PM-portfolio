import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/data/site";
import { ThemeProvider, themeInitScript } from "@/components/theme/ThemeProvider";
import Loader, { loaderInitScript } from "@/components/layout/Loader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollPath from "@/components/animation/ScrollPath";
import SmoothScroll from "@/components/animation/SmoothScroll";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.role}`,
    template: `%s — ${SITE.shortName}`,
  },
  description: SITE.tagline,
  keywords: [
    "desarrollador web freelance",
    "desarrollo web",
    "e-commerce",
    "modernización web",
    "React",
    "Next.js",
    "Pedro Escacena",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE.url,
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.tagline,
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.tagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Set the initial theme before paint to avoid a flash (FOUC). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Hide the loader before paint on repeat visits (same session). */}
        <script dangerouslySetInnerHTML={{ __html: loaderInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <Loader />
          <SmoothScroll />
          <ScrollPath />
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
