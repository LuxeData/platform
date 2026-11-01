'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { WatchModel } from '../types/watch';
import { TrendingUp, TrendingDown, ChevronRight, Sparkles } from 'lucide-react';
import { formatUSD } from '../lib/format';
import { Logo } from './Logo';
import { InteractiveTiltCard } from './InteractiveTiltCard';
import { AnimatedCounter } from './AnimatedCounter';

interface WatchCardProps {
  watch: WatchModel;
  isSelected?: boolean;
  onSelect: (watch: WatchModel) => void;
}

export const WatchCard: React.FC<WatchCardProps> = ({ watch, isSelected = false, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isGain = watch.thirtyDayChangePct >= 0;

  return (
    <InteractiveTiltCard
      maxTilt={4}
      glareOpacity={0.18}
      onClick={() => onSelect(watch)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      active={isSelected}
      className={`glass-card-interactive ${isSelected ? 'glass-card-active' : ''}`}
      style={{
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        borderRadius: '16px',
        background: '#FFFFFF',
        border: isSelected 
          ? '2px solid var(--gold-primary)' 
          : isHovered 
            ? '1.5px solid var(--border-gold)' 
            : '1px solid var(--border-subtle)',
        boxShadow: isSelected 
          ? '0 0 0 1px var(--border-gold), 0 18px 42px -6px rgba(15, 23, 42, 0.12), 0 6px 18px rgba(161, 116, 36, 0.14)'
          : isHovered 
            ? 'var(--shadow-card-hover)' 
            : 'var(--shadow-card)',
        cursor: 'pointer'
      }}
    >
      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span className="badge badge-subtle">{watch.brand}</span>
          <span className="badge badge-gold badge-glimmer" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>
            REF: {watch.reference}
          </span>
        </div>

        {/* Studio Product Photograph (Physical Watch with 3D Depth) */}
        <div style={{
          background: 'radial-gradient(circle at 50% 40%, #FFFFFF 0%, #F8FAFC 80%)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          height: '190px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--border-hairline)',
          transformStyle: 'preserve-3d'
        }}>
          {watch.imageUrl ? (
            <div style={{
              position: 'relative',
              width: '100%',
              height: '160px',
              transform: isHovered ? 'translateY(-6px) scale(1.06) translateZ(32px)' : 'translateY(0) scale(1) translateZ(0)',
              transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              transformStyle: 'preserve-3d'
            }}>
              <Image
                src={watch.imageUrl}
                alt={`${watch.brand} ${watch.model}`}
                fill
                sizes="(max-width: 768px) 100vw, 240px"
                style={{
                  objectFit: 'contain',
                  filter: isHovered 
                    ? 'drop-shadow(0 14px 22px rgba(15, 23, 42, 0.18))' 
                    : 'drop-shadow(0 6px 14px rgba(15, 23, 42, 0.10))',
                  transition: 'filter 0.35s ease'
                }}
              />
            </div>
          ) : (
            <Logo size={48} />
          )}
        </div>

        {/* Model Title */}
        <h3 className="serif-heading" style={{
          fontSize: '1.08rem',
          fontWeight: 700,
          marginBottom: '4px',
          color: 'var(--text-main)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {watch.model}
        </h3>
        <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          {watch.caseSize} • {watch.material}
        </p>

        {/* Radical Data Minimalism: 1 or 2 Core Stats Only (Cash Floor & CMV) */}
        <div style={{
          background: '#F8FAFC',
          padding: '12px 14px',
          borderRadius: '10px',
          border: '1px solid var(--border-hairline)',
          marginBottom: '10px',
          boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.66rem', color: 'var(--emerald-gain)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              CASH BUY-IN (-20%)
            </span>
            <div style={{ fontSize: '1.30rem', fontWeight: 800, color: 'var(--emerald-gain)' }}>
              <AnimatedCounter value={watch.recentSoldAvg} prefix="$" />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Consensus:</span>
            <div style={{ color: 'var(--text-main)', fontWeight: 700 }}>
              <AnimatedCounter value={watch.currentAskingAvg} prefix="$" />
            </div>
          </div>
        </div>
      </div>

      {/* Progressive Disclosure on Hover / Interaction */}
      <div>
        {/* Deep Analytics Revealed on Hover */}
        <div style={{
          overflow: 'hidden',
          maxHeight: isHovered ? '40px' : '0px',
          opacity: isHovered ? 1 : 0,
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: isHovered ? '6px' : '0px',
          marginBottom: isHovered ? '6px' : '0px',
          borderTop: isHovered ? '1px dashed var(--border-hairline)' : 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={12} style={{ color: 'var(--gold-primary)' }} />
            <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
              Score: <strong style={{ color: 'var(--gold-primary)' }}>{watch.aiAnalysis.opportunityScore}</strong>/10
            </span>
          </div>

          <div className="tabular-nums" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '0.70rem',
            color: isGain ? 'var(--emerald-gain)' : 'var(--crimson-drop)',
            fontWeight: 700
          }}>
            {isGain ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {isGain ? `+${watch.thirtyDayChangePct}` : `${watch.thirtyDayChangePct}`}% 30D
          </div>
        </div>

        {/* Action Prompt */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border-hairline)',
          paddingTop: '10px',
          marginTop: '4px',
          color: isHovered || isSelected ? 'var(--gold-primary)' : 'var(--text-muted)',
          fontSize: '0.70rem',
          fontWeight: 600,
          transition: 'color 0.2s ease'
        }}>
          <span>{isSelected ? 'Active Terminal View' : isHovered ? 'Inspect Full Order Book' : 'Inspect Details'}</span>
          <ChevronRight size={13} style={{ transform: isHovered ? 'translateX(3px)' : 'none', transition: 'transform 0.2s ease' }} />
        </div>
      </div>
    </InteractiveTiltCard>
  );
};
