import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Daniel Meduoye // Social Media Manager & Video Editor',
  description: 'Official portfolio of Daniel Meduoye — Social Media Manager & Video Editor specializing in viral Instagram Reels, video editing, and high-ROAS Meta Ads for Hexavia & Tdotwheels.',
  keywords: ['Daniel Meduoye', 'Social Media Manager', 'Video Editor', 'Hexavia', 'Tdotwheels', 'Instagram Reels', 'Meta Ads Specialist', 'F1 Speed'],
  authors: [{ name: 'Daniel Meduoye' }],
  openGraph: {
    title: 'Daniel Meduoye // Social Media Manager & Video Editor',
    description: 'High-performance video editing and social media management for Hexavia & Tdotwheels.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased selection:bg-sky-200 selection:text-sky-900">
        {children}
      </body>
    </html>
  );
}
