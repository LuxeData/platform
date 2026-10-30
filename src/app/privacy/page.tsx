import React from 'react';
import { Metadata } from 'next';
import { LegalView } from '../../components/LegalView';

export const metadata: Metadata = {
  title: 'Privacy Policy & Data Governance | LuxeData Technologies Inc.',
  description: 'Global Enterprise Privacy Policy, GDPR & CCPA Compliance, and Data Security Framework for LuxeData Technologies Inc.',
};

export default function PrivacyPage() {
  return <LegalView initialDoc="privacy" isStandalonePage={true} />;
}

