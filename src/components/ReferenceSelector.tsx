'use client';
import React from 'react';
import { WatchModel } from '../types/watch';
import { TrendingUp, ArrowUpRight, Target } from 'lucide-react';

interface ReferenceSelectorProps {
  watches: WatchModel[];
  selectedWatch: WatchModel;
  onSelectWatch: (watch: WatchModel) => void;
}

export const ReferenceSelector: React.FC<ReferenceSelectorProps> = ({
  watches,
  selectedWatch,
  onSelectWatch
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            Benchmark Reference Index (5 Core Models)
          </span>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Click reference to load terminal analytics
        </span>
      </div>

      {/* 5-Column Clean Desktop Grid with Mobile Horizontal Scroll */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '12px',
        width: '100%'
      }}>
        {watches.map((w) => {
          const isSelected = selectedWatch.reference === w.reference;
          const arbCount = w.dealerMetrics?.arbitrageCount || 0;

          return (
            <div
              key={w.reference}
              onClick={() => onSelectWatch(w)}
              className={`glass-card-interactive ${isSelected ? 'glass-card-active' : ''}`}
              style={{
                padding: '14px 16px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '12px'
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'var(--gold-gradient)'
                }} />
              )}

              {/* Brand & Reference Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  color: isSelected ? 'var(--gold-light)' : 'var(--text-secondary)',
                  letterSpacing: '0.04em'
                }}>
                  {w.brand.toUpperCase()}
                </span>
                <span className="badge badge-gold" style={{ fontSize: '0.62rem', padding: '1px 6px', fontFamily: 'var(--font-mono)' }}>
                  {w.reference}
                </span>
              </div>

              {/* Model Name */}
              <div style={{
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#FFF',
                marginBottom: '8px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {w.model}
              </div>

              {/* Price & Spread Line */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderTop: '1px solid var(--border-hairline)',
                paddingTop: '8px'
              }}>
                <div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Consensus Value
                  </div>
                  <div className="tabular-nums" style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: isSelected ? 'var(--gold-light)' : '#FFF'
                  }}>
                    ${w.currentAskingAvg.toLocaleString()}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Buy-In (-20%)
                  </div>
                  <div className="tabular-nums" style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--emerald-gain)'
                  }}>
                    ${w.recentSoldAvg.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Arbitrage Deals Indicator */}
              <div style={{
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.68rem'
              }}>
                <span className="badge badge-emerald" style={{ fontSize: '0.60rem', padding: '1px 6px' }}>
                  <Target size={10} /> {arbCount} Arb Lots
                </span>
                <span className="tabular-nums" style={{
                  color: w.thirtyDayChangePct >= 0 ? 'var(--emerald-gain)' : 'var(--crimson-drop)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontWeight: 600
                }}>
                  +{w.thirtyDayChangePct}% (30D)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
