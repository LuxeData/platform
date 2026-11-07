import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { WatchDetailView } from '../WatchDetailView';
import { WATCH_MODELS } from '../../lib/marketEngine';
import { WatchModel, UserSession } from '../../types/watch';

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill, priority, ...rest }: any) => React.createElement('img', rest)
}));

describe('WatchDetailView — Institutional Copy & Volume Tiering', () => {
  const sampleWatch = WATCH_MODELS[0]; // Rolex Submariner Date 126610LN

  const proUser: UserSession = {
    id: 'usr_test_pro',
    name: 'Master Dealer',
    email: 'dealer@trade.com',
    dealership: 'Swiss Comps Desk',
    role: 'pro',
    tier: 'pro'
  };

  it('renders "Market Consensus (CMV)" metric label', () => {
    const html = renderToStaticMarkup(
      React.createElement(WatchDetailView, {
        watch: sampleWatch,
        user: proUser,
        onOpenAuth: vi.fn()
      })
    );

    expect(html).toContain('Market Consensus (CMV)');
    expect(html).not.toContain('Consensus Market Value (CMV)');
  });

  it('renders "Calibrated to Chrono24 dealer consensus and realized auction hammers" in trajectory subtitle', () => {
    const html = renderToStaticMarkup(
      React.createElement(WatchDetailView, {
        watch: sampleWatch,
        user: proUser,
        onOpenAuth: vi.fn()
      })
    );

    expect(html).toContain('Calibrated to Chrono24 dealer consensus and realized auction hammers');
    expect(html).not.toContain('10% trimmed mean consensus and realized auction hammers');
  });

  it('renders updated institutional copy in locked order book view for non-pro users', () => {
    const lockedWatch = WATCH_MODELS[1]; // Rolex Daytona 116500LN is pro-gated
    const html = renderToStaticMarkup(
      React.createElement(WatchDetailView, {
        watch: lockedWatch,
        user: null, // free/guest user triggers locked state
        onOpenAuth: vi.fn()
      })
    );

    // Gated paragraph
    expect(html).toContain('consensus pricing');
    expect(html).not.toContain('10% trimmed mean consensus metrics');

    // Gated bullet
    expect(html).toContain('20% wholesale cash buy-in formula');
    expect(html).not.toContain('Defensible 20% wholesale cash buy-in formula');
  });

  describe('Volume tiering logic for watch.aiAnalysis.liquidityScore', () => {
    it('renders "Volume: High" when liquidityScore is above 75 (e.g. 98)', () => {
      const watchWithHighVolume: WatchModel = {
        ...sampleWatch,
        aiAnalysis: {
          ...sampleWatch.aiAnalysis,
          liquidityScore: 98
        }
      };

      const html = renderToStaticMarkup(
        React.createElement(WatchDetailView, {
          watch: watchWithHighVolume,
          user: proUser,
          onOpenAuth: vi.fn()
        })
      );

      expect(html).toContain('Volume: <strong style="color:var(--text-main);font-family:var(--font-mono)">High</strong>');
      expect(html).not.toContain('Liquidity Score:');
    });

    it('renders "Volume: High" at boundary value 75', () => {
      const watchAt75: WatchModel = {
        ...sampleWatch,
        aiAnalysis: {
          ...sampleWatch.aiAnalysis,
          liquidityScore: 75
        }
      };

      const html = renderToStaticMarkup(
        React.createElement(WatchDetailView, {
          watch: watchAt75,
          user: proUser,
          onOpenAuth: vi.fn()
        })
      );

      expect(html).toContain('Volume: <strong style="color:var(--text-main);font-family:var(--font-mono)">High</strong>');
    });

    it('renders "Volume: Med" for mid-tier values (e.g. 61)', () => {
      const watchAt61: WatchModel = {
        ...sampleWatch,
        aiAnalysis: {
          ...sampleWatch.aiAnalysis,
          liquidityScore: 61
        }
      };

      const html = renderToStaticMarkup(
        React.createElement(WatchDetailView, {
          watch: watchAt61,
          user: proUser,
          onOpenAuth: vi.fn()
        })
      );

      expect(html).toContain('Volume: <strong style="color:var(--text-main);font-family:var(--font-mono)">Med</strong>');
    });

    it('renders "Volume: Med" at boundary value 40', () => {
      const watchAt40: WatchModel = {
        ...sampleWatch,
        aiAnalysis: {
          ...sampleWatch.aiAnalysis,
          liquidityScore: 40
        }
      };

      const html = renderToStaticMarkup(
        React.createElement(WatchDetailView, {
          watch: watchAt40,
          user: proUser,
          onOpenAuth: vi.fn()
        })
      );

      expect(html).toContain('Volume: <strong style="color:var(--text-main);font-family:var(--font-mono)">Med</strong>');
    });

    it('renders "Volume: Low" for values below 40 (e.g. 39 and 15)', () => {
      const watchLow: WatchModel = {
        ...sampleWatch,
        aiAnalysis: {
          ...sampleWatch.aiAnalysis,
          liquidityScore: 39
        }
      };

      const html = renderToStaticMarkup(
        React.createElement(WatchDetailView, {
          watch: watchLow,
          user: proUser,
          onOpenAuth: vi.fn()
        })
      );

      expect(html).toContain('Volume: <strong style="color:var(--text-main);font-family:var(--font-mono)">Low</strong>');
    });

    it('handles missing/undefined liquidityScore gracefully and defaults to "Volume: Low"', () => {
      const watchFallback: WatchModel = {
        ...sampleWatch,
        aiAnalysis: {
          ...sampleWatch.aiAnalysis,
          liquidityScore: undefined as any
        }
      };

      const html = renderToStaticMarkup(
        React.createElement(WatchDetailView, {
          watch: watchFallback,
          user: proUser,
          onOpenAuth: vi.fn()
        })
      );

      expect(html).toContain('Volume: <strong style="color:var(--text-main);font-family:var(--font-mono)">Low</strong>');
    });
  });
});
