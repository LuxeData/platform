import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LuxeData — Luxury Asset Intelligence & Valuation Platform',
  description: 'Institutional-grade pricing intelligence, cross-market historical data, and AI-powered valuation for secondary luxury watches and alternative assets.',
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
