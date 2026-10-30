'use client';
import React from 'react';
import { WatchModel } from '../types/watch';
import { TrendingUp, TrendingDown, ChevronRight, Sparkles, Activity } from 'lucide-react';
import { formatUSD } from '../lib/format';

interface WatchCardProps {
  watch: WatchModel;
  isSelected: boolean;
  onSelect: (watch: WatchModel) => void;
}

export const WatchCard: React.FC<WatchCardProps> = ({ watch, isSelected, onSelect }) => {
  const isGain = watch.thirtyDayChangePct >= 0;

  return (
    <div 
      onClick={() => onSelect(watch)}
      className={`glass-card-interactive ${isSelected ? 'glass-card-active' : ''}`}
      style={{
        padding: '20px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        borderRadius: '14px'
      }}
    >
      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span className="badge badge-subtle">{watch.brand}</span>
          <span className="badge badge-gold" style={{ fontFamily: 'var(--font-mono)' }}>REF: {watch.reference}</span>
        </div>

        {/* Model Title */}
        <h3 className="serif-heading" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px', color: '#FFF' }}>
          {watch.model}
        </h3>
        <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          {watch.caseSize} • {watch.material} • {watch.dialColor}
        </p>

        {/* Price & Value Stats */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '12px 14px',
          borderRadius: '10px',
          border: '1px solid var(--border-hairline)',
          marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Consensus Market Value</span>
            <span className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gold-light)' }}>
              ${formatUSD(watch.currentAskingAvg)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>MSRP: ${formatUSD(watch.aiAnalysis.retailMSRP)}</span>
            <span className="tabular-nums" style={{ color: 'var(--text-gold)', fontWeight: 600 }}>
              Spread: +${formatUSD(watch.aiAnalysis.spreadDollars)} ({watch.aiAnalysis.currentSpread}%)
            </span>
          </div>

          {watch.dealerMetrics && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.72rem',
              marginTop: '6px',
              paddingTop: '6px',
              borderTop: '1px dashed rgba(255, 255, 255, 0.06)'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>Dealer Buy-In (-20%):</span>
              <strong className="tabular-nums" style={{ color: 'var(--emerald-gain)' }}>${formatUSD(watch.dealerMetrics.dealerBuyInPrice)}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Footer Metrics */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border-hairline)',
          paddingTop: '10px',
          marginTop: '4px'
        }}>
          {/* AI Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} style={{ color: 'var(--gold-primary)' }} />
            <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Score: <strong className="tabular-nums" style={{ color: 'var(--gold-light)' }}>{watch.aiAnalysis.opportunityScore}</strong>/10
            </span>
          </div>

          {/* 30D Trend */}
          <div className="tabular-nums" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.76rem',
            color: isGain ? 'var(--emerald-gain)' : 'var(--crimson-drop)',
            fontWeight: 600
          }}>
            {isGain ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            +{watch.thirtyDayChangePct}%
          </div>
        </div>

        {/* Select Action prompt */}
        <div style={{
          marginTop: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          color: isSelected ? 'var(--gold-light)' : 'var(--text-muted)',
          fontSize: '0.70rem',
          gap: '3px'
        }}>
          <span>{isSelected ? 'Viewing Analytics' : 'Inspect Terminal'}</span>
          <ChevronRight size={12} />
        </div>
      </div>
    </div>
  );
};
