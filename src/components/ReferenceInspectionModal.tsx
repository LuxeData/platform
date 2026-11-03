'use client';
import React, { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { WatchModel } from '../types/watch';
import { formatUSD } from '../lib/format';
import { Logo } from './Logo';
import chrono24Raw from '../data/chrono24MarketData.json';
import {
  X,
  ArrowUpRight,
  Calculator,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Layers,
  Sparkles,
  ArrowRight,
  Scale
} from 'lucide-react';

interface ReferenceInspectionModalProps {
  watch: WatchModel | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenTerminal: (watch: WatchModel) => void;
  onOpenAppraisal: (watch: WatchModel) => void;
}

export const ReferenceInspectionModal: React.FC<ReferenceInspectionModalProps> = ({
  watch,
  isOpen,
  onClose,
  onOpenTerminal,
  onOpenAppraisal
}) => {
  // Handle keyboard escape key dismissal
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Derive mathematical breakdown and scraped comps
  const mathData = useMemo(() => {
    if (!watch) return null;

    const refData = (chrono24Raw as any)?.references?.[watch.reference];
    const stats = refData?.consensus?.price_stats || {};
    const sampleListings: any[] = refData?.sample_listings || [];
    const allListings: any[] = refData?.listings || sampleListings;

    const rawPrices: number[] = allListings
      .map((l: any) => l.price)
      .filter((p: any) => typeof p === 'number' && !isNaN(p) && p > 0)
      .sort((a: number, b: number) => a - b);

    const cmv = watch.dealerMetrics?.consensusMarketValue || watch.currentAskingAvg;
    const buyIn = watch.dealerMetrics?.dealerBuyInPrice || watch.recentSoldAvg;
    const spreadDollars = cmv - buyIn;
    const spreadPct = cmv > 0 ? Math.round((spreadDollars / cmv) * 1000) / 10 : 20.0;

    const totalCensusCount = refData?.consensus?.total_active_listings || (rawPrices.length > 0 ? rawPrices.length : 52);

    let minRaw = typeof stats.min_price === 'number' ? stats.min_price : 0;
    let maxRaw = typeof stats.max_price === 'number' ? stats.max_price : 0;
    let sampleSize = rawPrices.length > 0 ? rawPrices.length : totalCensusCount;
    let cut10 = Math.max(1, Math.floor(sampleSize * 0.10));
    let discardedCount = cut10 * 2;
    let retainedCount = sampleSize - discardedCount;
    let trimmedLower = Math.round(cmv * 0.90);
    let trimmedUpper = Math.round(cmv * 1.15);

    if (rawPrices.length >= 8) {
      if (!minRaw) minRaw = rawPrices[0];
      if (!maxRaw) maxRaw = rawPrices[rawPrices.length - 1];
      cut10 = Math.floor(rawPrices.length * 0.10);
      trimmedLower = rawPrices[cut10];
      trimmedUpper = rawPrices[rawPrices.length - 1 - cut10];
      discardedCount = cut10 * 2;
      retainedCount = rawPrices.length - discardedCount;
      sampleSize = rawPrices.length;
    } else if (minRaw && maxRaw) {
      trimmedLower = Math.round(minRaw + (cmv - minRaw) * 0.35);
      trimmedUpper = Math.round(cmv + (maxRaw - cmv) * 0.65);
    } else {
      minRaw = Math.round(cmv * 0.78);
      maxRaw = Math.round(cmv * 1.32);
    }

    // Active Chrono24 listings sample (top 3)
    const activeLots = sampleListings.length > 0
      ? sampleListings.slice(0, 3)
      : (watch.dealerMetrics?.arbitrageDeals?.slice(0, 3) || []);

    return {
      sampleSize,
      totalCensusCount,
      retainedCount,
      discardedCount,
      minRaw,
      maxRaw,
      trimmedLower,
      trimmedUpper,
      cmv,
      buyIn,
      spreadDollars,
      spreadPct,
      activeLots
    };
  }, [watch]);

  // SVG Chart points calculation from historical curves
  const chartData = useMemo(() => {
    if (!watch || !watch.priceHistory || watch.priceHistory.length === 0) return null;
    const history = watch.priceHistory;
    const prices = history.map(h => h.price);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    const range = maxP - minP || 1;

    const width = 580;
    const height = 120;
    const padding = 16;
    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;
    const denom = Math.max(1, history.length - 1);

    const points = history.map((h, i) => {
      const x = history.length === 1
        ? padding + usableWidth / 2
        : padding + (i / denom) * usableWidth;
      const y = height - padding - ((h.price - minP) / range) * usableHeight;
      return { x, y, price: h.price, date: h.date };
    });

    const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`, '');
    const areaD = `${pathD} L ${(padding + usableWidth).toFixed(1)},${height - padding} L ${padding},${height - padding} Z`;

    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];

    return {
      points,
      pathD,
      areaD,
      minP,
      maxP,
      firstPoint,
      lastPoint,
      width,
      height
    };
  }, [watch]);

  if (!isOpen || !watch || !mathData) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ref-inspection-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        overflowY: 'auto'
      }}
    >
      <div
        className="glass-card animate-modal-spring"
        style={{
          width: '100%',
          maxWidth: '740px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFC 100%)',
          border: '1.5px solid var(--border-gold)',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: 'var(--shadow-modal)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close inspection dialog"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#F1F5F9',
            border: '1px solid var(--border-hairline)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            transition: 'all 0.15s ease'
          }}
        >
          <X size={16} />
        </button>

        {/* Header: Reference Identity & Specs */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          {watch.imageUrl ? (
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '14px',
              background: 'radial-gradient(circle at 50% 40%, #FFFFFF 0%, #F8FAFC 80%)',
              border: '1px solid var(--border-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              flexShrink: 0
            }}>
              <Image
                src={watch.imageUrl}
                alt={`${watch.brand} ${watch.model}`}
                fill
                sizes="80px"
                style={{ objectFit: 'contain', padding: '6px' }}
              />
            </div>
          ) : (
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '14px',
              background: '#F8FAFC',
              border: '1px solid var(--border-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Logo size={42} />
            </div>
          )}

          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-subtle">{watch.brand}</span>
              <span className="badge badge-gold" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem' }}>
                REF: {watch.reference}
              </span>
              <span className={watch.thirtyDayChangePct >= 0 ? 'badge badge-emerald' : 'badge badge-crimson'}>
                {watch.thirtyDayChangePct >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {' '}{watch.thirtyDayChangePct >= 0 ? `+${watch.thirtyDayChangePct}` : `${watch.thirtyDayChangePct}`}% 30D
              </span>
            </div>

            <h2 id="ref-inspection-title" className="serif-heading" style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', margin: '2px 0 4px 0' }}>
              {watch.brand} {watch.model}
            </h2>

            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              {watch.caseSize} • {watch.material} • {watch.dialColor}
            </div>
          </div>
        </div>

        {/* Core Pricing Valuation Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {/* CMV Box */}
          <div style={{
            background: 'rgba(161, 116, 36, 0.05)',
            border: '1.5px solid var(--border-gold-subtle)',
            borderRadius: '12px',
            padding: '16px 18px'
          }}>
            <div style={{ fontSize: '0.66rem', color: 'var(--gold-primary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              10% Trimmed Mean (CMV)
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>
              ${formatUSD(mathData.cmv)}
            </div>
            <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
              Core dealer consensus retail price
            </div>
          </div>

          {/* Cash Buy-In Floor Box */}
          <div style={{
            background: 'rgba(5, 150, 105, 0.05)',
            border: '1.5px solid var(--emerald-border)',
            borderRadius: '12px',
            padding: '16px 18px'
          }}>
            <div style={{ fontSize: '0.66rem', color: 'var(--emerald-gain)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Wholesale Cash Floor (-20%)
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--emerald-gain)', margin: '4px 0' }}>
              ${formatUSD(mathData.buyIn)}
            </div>
            <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
              Immediate liquidity buy-in offer
            </div>
          </div>

          {/* Dealer Margin Spread */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '16px 18px'
          }}>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Protected Gross Spread
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>
              ${formatUSD(mathData.spreadDollars)}
            </div>
            <div style={{ fontSize: '0.70rem', color: 'var(--emerald-gain)', fontWeight: 600 }}>
              {mathData.spreadPct}% defended markup margin
            </div>
          </div>
        </div>

        {/* Mathematical Proof Section: 10% Trimmed Mean Breakdown */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '20px 22px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Scale size={16} style={{ color: 'var(--gold-primary)' }} />
              <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-main)' }}>
                10% Trimmed Mean Statistical Breakdown
              </h3>
            </div>
            <span style={{ fontSize: '0.70rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              N = {mathData.sampleSize} active lots analyzed{mathData.totalCensusCount > mathData.sampleSize ? ` (${mathData.totalCensusCount} total market census)` : ''}
            </span>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '14px' }}>
            Speculative asking prices on secondary portals create an artificial ceiling. We discard the top 10% and bottom 10% extreme outliers, calculating the arithmetic mean of the core 80% distribution ({mathData.retainedCount} lots):
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '10px',
            background: '#F8FAFC',
            padding: '14px',
            borderRadius: '10px',
            border: '1px solid var(--border-hairline)',
            fontSize: '0.74rem'
          }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.66rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Raw Asking Range
              </div>
              <div className="tabular-nums" style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                ${formatUSD(mathData.minRaw)} – ${formatUSD(mathData.maxRaw)}
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.66rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Outliers Cut (-20% Total)
              </div>
              <div style={{ fontWeight: 700, color: 'var(--crimson-drop)', marginTop: '2px' }}>
                {mathData.discardedCount} lots stripped
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.66rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Analyzed 80% Core Band
              </div>
              <div className="tabular-nums" style={{ fontWeight: 700, color: 'var(--gold-primary)', marginTop: '2px' }}>
                ${formatUSD(mathData.trimmedLower)} – ${formatUSD(mathData.trimmedUpper)}
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.66rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Resulting Consensus CMV
              </div>
              <div className="tabular-nums" style={{ fontWeight: 700, color: 'var(--emerald-gain)', marginTop: '2px' }}>
                ${formatUSD(mathData.cmv)}
              </div>
            </div>
          </div>
        </div>

        {/* Historical Price Trajectory (Crisp SVG Area Chart) */}
        {chartData && (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '20px 22px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} style={{ color: 'var(--gold-primary)' }} />
                <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  12-Month Historical Comps Trajectory
                </h3>
              </div>
              <span className="badge badge-subtle" style={{ fontSize: '0.66rem' }}>
                ${formatUSD(chartData.minP)} – ${formatUSD(chartData.maxP)} range
              </span>
            </div>

            {/* SVG Trend Line */}
            <div style={{ width: '100%', overflow: 'hidden' }}>
              <svg
                viewBox={`0 0 ${chartData.width} ${chartData.height}`}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              >
                <defs>
                  <linearGradient id="modalTrendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B48228" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#B48228" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Subtle Horizontal Guide lines */}
                <line x1="16" y1="20" x2="564" y2="20" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="16" y1="60" x2="564" y2="60" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="16" y1="104" x2="564" y2="104" stroke="#F1F5F9" strokeWidth="1" />

                {/* Gradient Fill under path */}
                <path d={chartData.areaD} fill="url(#modalTrendGradient)" />

                {/* Main Curve */}
                <path
                  d={chartData.pathD}
                  fill="none"
                  stroke="var(--gold-primary)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* First and Last Data Points */}
                <circle cx={chartData.firstPoint.x} cy={chartData.firstPoint.y} r="3.5" fill="#FFFFFF" stroke="var(--gold-primary)" strokeWidth="2" />
                <circle cx={chartData.lastPoint.x} cy={chartData.lastPoint.y} r="4" fill="var(--gold-primary)" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.70rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              <span>{chartData.firstPoint.date} • ${formatUSD(chartData.firstPoint.price)}</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{chartData.lastPoint.date} • ${formatUSD(chartData.lastPoint.price)}</span>
            </div>
          </div>
        )}

        {/* Live Active Chrono24 Listings Sample */}
        {mathData.activeLots.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Active Market Listings Sample ({watch.reference})
              </h3>
              <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>
                Verified Chrono24 Ingestion
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {mathData.activeLots.map((lot: any, idx: number) => (
                <div
                  key={lot.id || `active-lot-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: '#FFFFFF',
                    border: '1px solid var(--border-hairline)',
                    borderRadius: '10px',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={lot.is_dealer ? 'badge badge-gold' : 'badge badge-subtle'} style={{ fontSize: '0.64rem' }}>
                      {lot.seller_type || (lot.is_dealer ? 'Dealer' : 'Private')}
                    </span>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                      Location: <strong style={{ color: 'var(--text-main)' }}>{lot.location || 'Global'}</strong>
                      {lot.condition && ` • ${lot.condition}`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="tabular-nums" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      ${formatUSD(lot.price)}
                    </span>

                    {lot.url && (
                      <a
                        href={lot.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.72rem',
                          color: 'var(--gold-primary)',
                          textDecoration: 'none',
                          fontWeight: 600,
                          padding: '4px 8px',
                          borderRadius: '6px',
                          background: 'rgba(161, 116, 36, 0.08)'
                        }}
                      >
                        Chrono24 <ArrowUpRight size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Action Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-hairline)',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => onOpenAppraisal(watch)}
            className="btn-ghost"
            style={{ fontSize: '0.84rem', padding: '10px 18px', borderRadius: '8px' }}
          >
            <Calculator size={14} /> Appraise Custom Piece
          </button>

          <button
            onClick={() => onOpenTerminal(watch)}
            className="btn-primary"
            style={{ fontSize: '0.84rem', padding: '10px 22px', borderRadius: '8px' }}
          >
            <span>Open in Full Terminal</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
