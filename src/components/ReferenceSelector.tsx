'use client';
import React from 'react';
import Image from 'next/image';
import { WatchModel, UserSession } from '../types/watch';
import { TrendingUp, ArrowUpRight, Target, Lock, Crown } from 'lucide-react';
import { formatUSD } from '../lib/format';
import { Logo } from './Logo';
import { InteractiveTiltCard } from './InteractiveTiltCard';
import { AnimatedCounter } from './AnimatedCounter';

interface ReferenceSelectorProps {
  watches: WatchModel[];
  selectedWatch: WatchModel;
  onSelectWatch: (watch: WatchModel) => void;
  user?: UserSession | null;
}

export const ReferenceSelector: React.FC<ReferenceSelectorProps> = ({
  watches,
  selectedWatch,
  onSelectWatch,
  user
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontWeight: 600
          }}>
            Benchmark Reference Index (5 Core Models)
          </span>
        </div>
        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          Select reference to inspect terminal order book
        </span>
      </div>

      {/* 5-Column Clean Desktop Grid with Mobile Adaptive Wrapping */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        width: '100%'
      }}>
        {watches.map((w) => {
          const isSelected = selectedWatch.reference === w.reference;
          const arbCount = w.dealerMetrics?.arbitrageCount || 0;

          return (
            <InteractiveTiltCard
              key={w.reference}
              maxTilt={3.5}
              glareOpacity={0.15}
              onClick={() => onSelectWatch(w)}
              className={`glass-card-interactive ${isSelected ? 'glass-card-active' : ''}`}
              style={{
                padding: '16px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '14px',
                background: '#FFFFFF',
                border: isSelected ? '2px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                boxShadow: isSelected ? '0 0 0 1px var(--border-gold), 0 12px 28px rgba(161, 116, 36, 0.16)' : 'var(--shadow-card)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer'
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'var(--gold-primary)'
                }} />
              )}

              {/* Watch Thumbnail (Physical Product Focus) */}
              <div style={{
                background: 'radial-gradient(circle at 50% 40%, #FFFFFF 0%, #F8FAFC 80%)',
                borderRadius: '10px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
                height: '75px',
                position: 'relative',
                boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.02)'
              }}>
                {w.imageUrl ? (
                  <div style={{ position: 'relative', width: '100%', height: '65px' }}>
                    <Image
                      src={w.imageUrl}
                      alt={w.model}
                      fill
                      sizes="120px"
                      style={{
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12))'
                      }}
                    />
                  </div>
                ) : (
                  <Logo size={28} />
                )}
              </div>

              {/* Brand & Reference Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '0.66rem',
                  fontWeight: 600,
                  color: isSelected ? 'var(--gold-primary)' : 'var(--text-muted)',
                  letterSpacing: '0.04em'
                }}>
                  {w.brand.toUpperCase()}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="badge badge-gold badge-glimmer" style={{ fontSize: '0.60rem', padding: '1px 6px', fontFamily: 'var(--font-mono)' }}>
                    {w.reference}
                  </span>
                  {w.reference === '126610LN' ? (
                    <span className="badge badge-emerald" style={{ fontSize: '0.55rem', padding: '1px 5px', fontWeight: 700 }}>
                      FREE
                    </span>
                  ) : user?.tier === 'pro' ? (
                    <span className="badge badge-gold" style={{ fontSize: '0.55rem', padding: '1px 5px', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}>
                      <Crown size={8} /> PRO
                    </span>
                  ) : (
                    <span className="badge badge-subtle" style={{ fontSize: '0.55rem', padding: '1px 5px', color: 'var(--gold-primary)', border: '1px solid var(--border-gold-subtle)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      <Lock size={8} /> PRO
                    </span>
                  )}
                </div>
              </div>

              {/* Model Name */}
              <div style={{
                fontSize: '0.88rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '8px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {w.model}
              </div>

              {/* Radical Data Minimalism: 1 Core Stat (Cash Floor) + Consensus */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderTop: '1px solid var(--border-hairline)',
                paddingTop: '8px'
              }}>
                <div>
                  <div style={{ fontSize: '0.60rem', color: 'var(--emerald-gain)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Buy-In (-20%)
                  </div>
                  <div style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: 'var(--emerald-gain)'
                  }}>
                    <AnimatedCounter value={w.recentSoldAvg} prefix="$" />
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.60rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Consensus
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--text-main)'
                  }}>
                    <AnimatedCounter value={w.currentAskingAvg} prefix="$" />
                  </div>
                </div>
              </div>

              {/* Arbitrage Deals Indicator */}
              <div style={{
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.66rem'
              }}>
                <span className="badge badge-emerald" style={{ fontSize: '0.58rem', padding: '1px 6px' }}>
                  <Target size={9} /> {arbCount} Arb Lots
                </span>
                <span className="tabular-nums" style={{
                  color: w.thirtyDayChangePct >= 0 ? 'var(--emerald-gain)' : 'var(--crimson-drop)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontWeight: 700
                }}>
                  {w.thirtyDayChangePct >= 0 ? `+${w.thirtyDayChangePct}` : `${w.thirtyDayChangePct}`}%
                </span>
              </div>
            </InteractiveTiltCard>
          );
        })}
      </div>
    </div>
  );
};
