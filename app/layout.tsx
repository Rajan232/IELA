import type { Metadata, Viewport } from "next";
import { Newsreader, Manrope } from "next/font/google";
import Navbar from "./components/Navbar";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#228B22",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://india-ela.org"),
  title: {
    default: "India Energy Law Association | Navigating the Future of Energy Law",
    template: "%s | India Energy Law Association",
  },
  description:
    "The India Energy Law Association (IELA) is an international non-profit platform dedicated to advancing energy law, regulatory policy, electricity market reforms, climate change frameworks, and energy transition in India through non-partisan research, neutral dialogue, and professional capacity building.",
  keywords: [
    "India Energy Law Association",
    "IELA",
    "Energy Law India",
    "Electricity Law India",
    "Renewable Energy Regulation",
    "Energy Policy India",
    "Climate Change Law",
    "Carbon Market Regulation",
    "Energy Dispute Resolution",
    "Energy Arbitration India",
    "india-ela.org",
  ],
  authors: [{ name: "India Energy Law Association", url: "https://india-ela.org" }],
  creator: "India Energy Law Association",
  publisher: "India Energy Law Association",
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://india-ela.org",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "India Energy Law Association | Navigating the Future of Energy Law",
    description:
      "Empowering India's energy transition through legal excellence, high-quality research, neutral dialogue, and evidence-based policy.",
    url: "https://india-ela.org",
    siteName: "India Energy Law Association",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://india-ela.org/logo/logo.png",
        width: 1200,
        height: 630,
        alt: "India Energy Law Association Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "India Energy Law Association | Navigating the Future of Energy Law",
    description:
      "Empowering India's energy transition through legal excellence, high-quality research, neutral dialogue, and evidence-based policy.",
    images: ["https://india-ela.org/logo/logo.png"],
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
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://india-ela.org/#organization",
      "name": "India Energy Law Association",
      "alternateName": ["IELA", "India ELA"],
      "url": "https://india-ela.org",
      "logo": "https://india-ela.org/logo/logo.png",
      "description":
        "Empowering India's energy transition through legal excellence, high-quality research, neutral dialogue, and evidence-based policy.",
    },
    {
      "@type": "WebSite",
      "@id": "https://india-ela.org/#website",
      "url": "https://india-ela.org",
      "name": "India Energy Law Association",
      "description": "Navigating the Future of Energy Law in India",
      "publisher": {
        "@id": "https://india-ela.org/#organization",
      },
      "inLanguage": "en-IN",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${manrope.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
