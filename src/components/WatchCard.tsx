'use client';
import React from 'react';
import { WatchModel } from '../types/watch';
import { TrendingUp, TrendingDown, ChevronRight, Sparkles, Activity } from 'lucide-react';

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
      className="glass-card" 
      style={{
        padding: '20px',
        cursor: 'pointer',
        border: isSelected ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
        background: isSelected ? 'linear-gradient(180deg, rgba(212, 175, 55, 0.08) 0%, rgba(15, 20, 31, 0.9) 100%)' : 'var(--bg-card)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}
    >
      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span className="badge badge-subtle">{watch.brand}</span>
          <span className="badge badge-gold">REF: {watch.reference}</span>
        </div>

        {/* Model Title */}
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px', color: '#FFF' }}>
          {watch.model}
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          {watch.caseSize} • {watch.material} • {watch.dialColor}
        </p>

        {/* Price & Value Stats */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fair Market Value</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gold-light)' }}>
              ${watch.aiAnalysis.fairMarketValue.toLocaleString()}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Asking Avg: ${watch.currentAskingAvg.toLocaleString()}</span>
            <span style={{ color: 'var(--text-gold)', fontWeight: 600 }}>
              Spread: +${watch.aiAnalysis.spreadDollars.toLocaleString()} ({watch.aiAnalysis.currentSpread}%)
            </span>
          </div>

          {watch.dealerMetrics && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed rgba(255, 255, 255, 0.08)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Dealer Buy-In (-20%):</span>
              <strong style={{ color: 'var(--emerald-gain)' }}>${watch.dealerMetrics.dealerBuyInPrice.toLocaleString()}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Footer Metrics */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '4px' }}>
          {/* AI Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} style={{ color: 'var(--gold-primary)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
              AI Score: <strong style={{ color: 'var(--gold-light)' }}>{watch.aiAnalysis.opportunityScore}</strong>/10
            </span>
          </div>

          {/* 30D Trend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: isGain ? 'var(--emerald-gain)' : 'var(--crimson-drop)' }}>
            {isGain ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {isGain ? `+${watch.thirtyDayChangePct}%` : `${watch.thirtyDayChangePct}%`}
          </div>
        </div>

        {/* Select Action prompt */}
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: isSelected ? 'var(--gold-light)' : 'var(--text-muted)', fontSize: '0.72rem', gap: '4px' }}>
          <span>{isSelected ? 'Viewing Analytics' : 'Inspect Terminal'}</span>
          <ChevronRight size={12} />
        </div>
      </div>
    </div>
  );
};
