'use client';
import React from 'react';
import { MultiVenueConsensus } from '../types/watch';
import { formatUSD } from '../lib/format';
import { 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight, 
  Scale, 
  Info,
  DollarSign,
  Activity,
  Zap
} from 'lucide-react';

interface MultiVenueConsensusCardProps {
  multiVenue: MultiVenueConsensus;
  watchModel: string;
  reference: string;
}

export const MultiVenueConsensusCard: React.FC<MultiVenueConsensusCardProps> = ({
  multiVenue,
  watchModel,
  reference
}) => {
  if (!multiVenue) return null;

  const { chrono24, ebay, watchcharts, consolidatedPrice, askingVsRealizedGapPct, venueSpreadPct } = multiVenue;

  return (
    <div className="glass-card" style={{
      padding: '24px 26px',
      border: '1px solid var(--border-gold-subtle)',
      background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.05) 0%, rgba(14, 19, 29, 0.95) 100%)',
      position: 'relative'
    }}>
      {/* Header Strip */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '20px',
        borderBottom: '1px solid var(--border-hairline)',
        paddingBottom: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
              <Layers size={11} /> TRI-VENUE LIQUIDITY ENGINE
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              CROSS-PLATFORM RECONCILIATION
            </span>
          </div>
          <h3 className="serif-heading" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF' }}>
            Multi-Venue Market Consensus
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Reconciling asking prices vs. actual realized cash sales to eliminate seller listing bias.
          </p>
        </div>

        {/* Consolidated Value Metric */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Weighted Consolidated CMV
          </div>
          <div className="tabular-nums" style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--gold-light)' }}>
            ${formatUSD(consolidatedPrice)}
          </div>
          <div style={{ fontSize: '0.70rem', color: 'var(--emerald-gain)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
            <CheckCircle2 size={12} /> {multiVenue.confidenceScore}% Data Convergence
          </div>
        </div>
      </div>

      {/* 3 Venue Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        marginBottom: '18px'
      }}>
        
        {/* Venue 1: Chrono24 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#FFF' }}>
                Chrono24
              </span>
              <span className="badge badge-gold" style={{ fontSize: '0.60rem' }}>
                {chrono24.weightPct}% WEIGHT
              </span>
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {chrono24.venueType}
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFF', margin: '4px 0' }}>
              ${formatUSD(chrono24.price)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {chrono24.sampleCount} active listings tracked
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '10px', marginTop: '12px', fontSize: '0.68rem', color: 'var(--text-faint)' }}>
            Status: <span style={{ color: 'var(--gold-light)' }}>{chrono24.lastUpdated}</span>
          </div>
        </div>

        {/* Venue 2: eBay Sold Listings */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#FFF' }}>
                eBay Sold / Realized
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.60rem' }}>
                {ebay.weightPct}% WEIGHT
              </span>
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {ebay.venueType}
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--emerald-gain)', margin: '4px 0' }}>
              ${formatUSD(ebay.price)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {ebay.sampleCount} completed cash sales (30D)
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '10px', marginTop: '12px', fontSize: '0.68rem', color: 'var(--text-faint)' }}>
            Realized Gap: <strong style={{ color: 'var(--emerald-gain)' }}>-{askingVsRealizedGapPct}% vs asking</strong>
          </div>
        </div>

        {/* Venue 3: WatchCharts Secondary Index */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#FFF' }}>
                WatchCharts
              </span>
              <span className="badge badge-subtle" style={{ fontSize: '0.60rem' }}>
                {watchcharts.weightPct}% WEIGHT
              </span>
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {watchcharts.venueType}
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFF', margin: '4px 0' }}>
              ${formatUSD(watchcharts.price)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {watchcharts.sampleCount} composite dealer points
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '10px', marginTop: '12px', fontSize: '0.68rem', color: 'var(--text-faint)' }}>
            Volatility Band: <span style={{ color: 'var(--text-main)' }}>±{venueSpreadPct}% spread</span>
          </div>
        </div>

      </div>

      {/* Formula & Explanation Banner */}
      <div style={{
        background: 'rgba(212, 175, 55, 0.06)',
        border: '1px solid var(--border-gold-subtle)',
        borderRadius: '10px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
          <Info size={14} style={{ color: 'var(--gold-light)', flexShrink: 0 }} />
          <span>
            <strong>Formula</strong>: (0.50 × Chrono24 Ask) + (0.30 × eBay Realized Sold) + (0.20 × WatchCharts Index)
          </span>
        </div>

        <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          3-VENUE SPREAD: {venueSpreadPct}%
        </span>
      </div>

    </div>
  );
};

