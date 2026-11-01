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
      padding: '26px 30px',
      border: '1.5px solid var(--border-gold-subtle)',
      background: '#FFFFFF',
      position: 'relative'
    }}>
      {/* Header Strip */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '22px',
        borderBottom: '1px solid var(--border-hairline)',
        paddingBottom: '18px'
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
          <h3 className="serif-heading" style={{ fontSize: '1.30rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Multi-Venue Market Consensus
          </h3>
          <p style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Reconciling asking prices vs. actual realized cash sales to eliminate seller listing bias.
          </p>
        </div>

        {/* Consolidated Value Metric */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
            Weighted Consolidated CMV
          </div>
          <div className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            ${formatUSD(consolidatedPrice)}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--emerald-gain)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontWeight: 600 }}>
            <CheckCircle2 size={13} /> {multiVenue.confidenceScore}% Data Convergence
          </div>
        </div>
      </div>

      {/* 3 Venue Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        
        {/* Venue 1: Chrono24 */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.90rem', color: 'var(--text-main)' }}>
                Chrono24
              </span>
              <span className="badge badge-gold" style={{ fontSize: '0.60rem' }}>
                {chrono24.weightPct}% WEIGHT
              </span>
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              {chrono24.venueType}
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.50rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>
              ${formatUSD(chrono24.price)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {chrono24.sampleCount} active listings tracked
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '10px', marginTop: '14px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            Status: <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>{chrono24.lastUpdated}</span>
          </div>
        </div>

        {/* Venue 2: eBay Sold Listings */}
        <div style={{
          background: '#F8FAFC',
          border: '1.5px solid var(--emerald-border)',
          borderRadius: '12px',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.90rem', color: 'var(--text-main)' }}>
                eBay Sold / Realized
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.60rem' }}>
                {ebay.weightPct}% WEIGHT
              </span>
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              {ebay.venueType}
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.50rem', fontWeight: 800, color: 'var(--emerald-gain)', margin: '4px 0' }}>
              ${formatUSD(ebay.price)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {ebay.sampleCount} completed cash sales (30D)
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '10px', marginTop: '14px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            Realized Gap: <strong style={{ color: 'var(--emerald-gain)' }}>-{askingVsRealizedGapPct}% vs asking</strong>
          </div>
        </div>

        {/* Venue 3: WatchCharts Secondary Index */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.90rem', color: 'var(--text-main)' }}>
                WatchCharts
              </span>
              <span className="badge badge-subtle" style={{ fontSize: '0.60rem' }}>
                {watchcharts.weightPct}% WEIGHT
              </span>
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              {watchcharts.venueType}
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.50rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>
              ${formatUSD(watchcharts.price)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {watchcharts.sampleCount} composite dealer points
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '10px', marginTop: '14px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            Volatility Band: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>±{venueSpreadPct}% spread</span>
          </div>
        </div>

      </div>

      {/* Formula & Explanation Banner */}
      <div style={{
        background: 'rgba(161, 116, 36, 0.05)',
        border: '1px solid var(--border-gold-subtle)',
        borderRadius: '10px',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
          <Info size={15} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
          <span>
            <strong>Formula</strong>: (0.50 × Chrono24 Ask) + (0.30 × eBay Realized Sold) + (0.20 × WatchCharts Index)
          </span>
        </div>

        <span style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
          3-VENUE SPREAD: {venueSpreadPct}%
        </span>
      </div>

    </div>
  );
};
