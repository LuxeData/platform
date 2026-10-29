import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LuxeData — Luxury Asset & Watch Intelligence Terminal',
  description: 'Institutional-grade pricing intelligence, consensus market valuation, and real-time dealer buy-in spread analysis for luxury timepieces.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
