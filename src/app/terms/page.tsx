import React from 'react';
import { Metadata } from 'next';
import { LegalView } from '../../components/LegalView';

export const metadata: Metadata = {
  title: 'Terms of Service | LuxeData Technologies Inc.',
  description: 'Institutional Terms of Service and Quantitative Asset Intelligence Software Agreement for LuxeData Technologies Inc.',
};

export default function TermsPage() {
  return <LegalView initialDoc="terms" isStandalonePage={true} />;
}

