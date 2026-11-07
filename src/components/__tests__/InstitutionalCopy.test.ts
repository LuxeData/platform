import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LandingView } from '../LandingView';
import { DealerAppraisalTerminal } from '../DealerAppraisalTerminal';
import { ArbitrageScanner } from '../ArbitrageScanner';
import { AuthModal } from '../AuthModal';
import { WATCH_MODELS, MACRO_METRICS } from '../../lib/marketEngine';

import Home from '../../app/page';

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill, priority, ...rest }: any) => React.createElement('img', rest)
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: any) => React.createElement('a', { href, ...rest }, children)
}));

describe('Institutional Copy Verification across Platform Components', () => {
  describe('LandingView.tsx copy changes', () => {
    const html = renderToStaticMarkup(
      React.createElement(LandingView, {
        watches: WATCH_MODELS,
        macro: MACRO_METRICS,
        onEnterTerminal: vi.fn(),
        onOpenAuth: vi.fn(),
        onNavigateTab: vi.fn(),
        onInspectWatch: vi.fn()
      })
    );

    it('renders hero subhead without tech/crypto jargon', () => {
      expect(html).toContain('Verified secondary market consensus and actual dealer buy-in math for high-liquidity references.');
      expect(html).not.toContain('Defensible buy-in valuations and 10% trimmed mean pricing');
    });

    it('renders benchmark section subhead with wholesale cash floors', () => {
      expect(html).toContain('Live dealer consensus and wholesale cash floors across the most actively traded stainless steel references.');
      expect(html).not.toContain('Direct consensus market pricing and defensible cash buy-in floors');
    });

    it('renders spotlight CMV metric label as "MARKET CONSENSUS"', () => {
      expect(html).toContain('MARKET CONSENSUS');
      expect(html).toContain('Dealer asking consensus');
      expect(html).not.toContain('CONSENSUS MARKET VALUE');
      expect(html).not.toContain('10% trimmed mean of dealer asks');
    });

    it('renders Pillar 1 & 2 titles with institutional terminology', () => {
      expect(html).toContain('Dealer Consensus Pricing');
      expect(html).not.toContain('10% Trimmed Mean Consensus');

      expect(html).toContain('Wholesale Cash Buy-In Math');
      expect(html).not.toContain('Defensible 20% Buy-In Margin');
    });

    it('renders final CTA copy with real wholesale comps', () => {
      expect(html).toContain('Stop negotiating against unverified retail asking prices. Buy inventory backed by real wholesale comps.');
      expect(html).not.toContain('Deploy capital and buy inventory with defensible wholesale data.');
    });
  });

  describe('DealerAppraisalTerminal.tsx copy changes', () => {
    it('renders "MARKET CONSENSUS (CMV)" label in retail consensus card', () => {
      const html = renderToStaticMarkup(
        React.createElement(DealerAppraisalTerminal, {
          watches: WATCH_MODELS
        })
      );

      expect(html).toContain('MARKET CONSENSUS (CMV)');
      expect(html).not.toContain('TRI-VENUE RETAIL VALUE (CMV)');
    });
  });

  describe('ArbitrageScanner.tsx copy changes', () => {
    it('renders institutional subtitle for active listings', () => {
      const html = renderToStaticMarkup(
        React.createElement(ArbitrageScanner, {
          watches: WATCH_MODELS,
          onSelectWatch: vi.fn(),
          user: null,
          onOpenAuth: vi.fn()
        })
      );

      expect(html).toContain('Active Chrono24 listings trading below dealer buy-in floor (-20% from consensus)');
      expect(html).not.toContain('Active Chrono24 listings trading below institutional dealer buy-in (-20% CMV baseline)');
    });
  });

  describe('AuthModal.tsx copy changes', () => {
    it('renders "Secure session active" for authenticated user', () => {
      const html = renderToStaticMarkup(
        React.createElement(AuthModal, {
          isOpen: true,
          onClose: vi.fn(),
          onAuthenticated: vi.fn(),
          user: {
            id: 'usr_test',
            name: 'Dealer User',
            email: 'dealer@trade.com',
            dealership: 'Manhattan Vault',
            role: 'dealer',
            tier: 'pro'
          },
          onSignOut: vi.fn()
        })
      );

      expect(html).toContain('Secure session active');
      expect(html).not.toContain('Cryptographically isolated session');
    });
  });

  describe('page.tsx copy changes', () => {
    it('contains clean institutional B2B dealer integration paragraph', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const pageContent = fs.readFileSync(path.resolve(__dirname, '../../app/page.tsx'), 'utf-8');

      expect(pageContent).toContain('Real-time Chrono24 consensus feeds, instant cash buy-in appraisals, and live arbitrage scanners for watch dealers, pawnbrokers, and alternative asset funds.');
      expect(pageContent).not.toContain('LuxeData provides luxury watch dealers');
    });
  });
});
