import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kebaya Kini - Penyewaan Kebaya Modern & Premium",
  description: "Persewaan kebaya premium modern untuk acara spesial Anda. Koleksi eksklusif dengan kualitas terbaik dan pelayanan profesional.",
  keywords: "sewa kebaya, rental kebaya, kebaya mewah, kebaya pernikahan, kebaya wisuda, kebaya modern, kebaya kini",
  authors: [{ name: "Kebaya Kini" }],
  metadataBase: new URL('https://kebayakini.web.id'),
  icons: {
    icon: [
      { url: '/logo.ico', sizes: 'any' },
      { url: '/logo.png', type: 'image/png', sizes: '1024x1025' },
    ],
    apple: [
      { url: '/logo.png', sizes: '1024x1025', type: 'image/png' },
    ],
    shortcut: ['/logo.ico'],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://kebayakini.web.id",
    siteName: "Kebaya Kini",
    title: "Kebaya Kini - Penyewaan Kebaya Modern & Premium",
    description: "Persewaan kebaya premium modern untuk acara spesial Anda",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Kebaya Kini",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kebaya Kini - Penyewaan Kebaya Modern & Premium",
    description: "Persewaan kebaya premium modern untuk acara spesial Anda",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
