'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { WatchModel, ArbitrageListing, UserSession } from '../types/watch';
import { Logo } from './Logo';
import { formatUSD } from '../lib/format';
import { 
  Target, 
  ExternalLink, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  Filter, 
  ShieldCheck, 
  AlertCircle,
  Building2,
  DollarSign,
  Lock,
  Crown
} from 'lucide-react';

interface ArbitrageScannerProps {
  watches: WatchModel[];
  onSelectWatch?: (watch: WatchModel) => void;
  user?: UserSession | null;
  onOpenAuth?: () => void;
}

export const ArbitrageScanner: React.FC<ArbitrageScannerProps> = ({ watches, onSelectWatch, user, onOpenAuth }) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [minDiscount, setMinDiscount] = useState<number>(10);

  // Collect all arbitrage deals from all watches
  const allDeals = React.useMemo(() => {
    const list: (ArbitrageListing & { watchModelObj: WatchModel; cmv: number; buyIn: number })[] = [];
    for (const w of watches) {
      if (w.dealerMetrics && w.dealerMetrics.arbitrageDeals) {
        for (const deal of w.dealerMetrics.arbitrageDeals) {
          list.push({
            ...deal,
            watchModelObj: w,
            cmv: w.dealerMetrics.consensusMarketValue,
            buyIn: w.dealerMetrics.dealerBuyInPrice
          });
        }
      }
    }
    // Sort by largest dollar profit descending
    return list.sort((a, b) => (b.estimated_profit_dollars || 0) - (a.estimated_profit_dollars || 0));
  }, [watches]);

  // Filter deals
  const filteredDeals = allDeals.filter(d => {
    const matchesBrand = selectedBrand === 'ALL' || d.brand.toUpperCase() === selectedBrand.toUpperCase();
    const matchesDiscount = (d.discount_from_cmv_pct || 0) >= minDiscount;
    return matchesBrand && matchesDiscount;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{
        padding: '24px 28px',
        border: '1.5px solid var(--emerald-border)',
        background: '#FFFFFF'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Logo size={40} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 className="serif-heading" style={{ fontSize: '1.40rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Live Secondary Arbitrage Radar
                </h2>
                <span className="badge badge-emerald" style={{ fontFamily: 'var(--font-mono)' }}>
                  {filteredDeals.length} LIVE SIGNALS
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.80rem', marginTop: '2px' }}>
                Active Chrono24 listings trading below institutional dealer buy-in (-20% CMV baseline)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {['ALL', 'ROLEX', 'PATEK PHILIPPE', 'AUDEMARS PIGUET'].map(b => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`btn-ghost ${selectedBrand === b ? 'active' : ''}`}
                style={{ fontSize: '0.74rem', padding: '7px 14px' }}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Deal Grid with Pro Gating */}
      {(() => {
        const isPro = user?.tier === 'pro';
        const freeDeals = isPro ? filteredDeals : filteredDeals.slice(0, 2);
        const lockedDeals = isPro ? [] : filteredDeals.slice(2);

        return (
          <>
            {/* Unlocked / Free Deals */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px' }}>
              {freeDeals.map(deal => (
                <div 
                  key={deal.id}
                  className="glass-card-interactive" 
                  style={{ 
                    padding: '22px', 
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    background: '#FFFFFF',
                    borderRadius: '16px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="badge badge-subtle">{deal.brand}</span>
                      <span className="badge badge-emerald tabular-nums" style={{ fontWeight: 700 }}>
                        Save ${formatUSD(deal.estimated_profit_dollars)} (-{deal.discount_from_cmv_pct}%)
                      </span>
                    </div>

                    {/* Product Photo & Title */}
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                      {deal.watchModelObj?.imageUrl && (
                        <div style={{
                          width: '64px',
                          height: '64px',
                          background: '#F8FAFC',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          border: '1px solid var(--border-hairline)',
                          position: 'relative'
                        }}>
                          <Image
                            src={deal.watchModelObj.imageUrl}
                            alt={deal.model}
                            fill
                            sizes="64px"
                            style={{ objectFit: 'contain', padding: '4px' }}
                          />
                        </div>
                      )}

                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>
                          {deal.model}
                        </h3>
                        <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                          Ref: <strong style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)' }}>{deal.reference}</strong> • {deal.location}
                        </p>
                      </div>
                    </div>

                    {/* Price Comparison Block */}
                    <div style={{
                      background: '#F8FAFC',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-hairline)',
                      marginBottom: '12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>Asking Price:</span>
                        <span className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          ${formatUSD(deal.price)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <span>CMV: <strong className="tabular-nums" style={{ color: 'var(--text-main)' }}>${formatUSD(deal.cmv)}</strong></span>
                        <span>Floor: <strong className="tabular-nums" style={{ color: 'var(--emerald-gain)' }}>${formatUSD(deal.buyIn)}</strong></span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '14px', lineHeight: '1.45' }}>
                      &ldquo;{deal.snippet}&rdquo;
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-hairline)',
                    paddingTop: '12px'
                  }}>
                    <span className={deal.is_private ? "badge badge-subtle" : "badge badge-gold"} style={{ fontSize: '0.65rem' }}>
                      {deal.seller_type}
                    </span>

                    {deal.url && (
                      <a 
                        href={deal.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{ fontSize: '0.74rem', padding: '7px 14px', borderRadius: '8px' }}
                      >
                        Inspect on Chrono24 <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pro Gate Lock Card (Shown to Free / Guest users) */}
            {!isPro && lockedDeals.length > 0 && (
              <div style={{ position: 'relative', marginTop: '24px' }}>
                <div className="glass-card" style={{
                  padding: '40px 24px',
                  border: '1.5px solid var(--border-gold)',
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  textAlign: 'center',
                  boxShadow: '0 16px 40px rgba(161, 116, 36, 0.1)',
                  marginBottom: '18px'
                }}>
                  <div style={{
                    display: 'inline-flex',
                    padding: '16px',
                    borderRadius: '50%',
                    background: 'rgba(161, 116, 36, 0.08)',
                    border: '1.5px solid var(--border-gold)',
                    marginBottom: '16px'
                  }}>
                    <Lock size={28} style={{ color: 'var(--gold-primary)' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge badge-gold" style={{ fontWeight: 700 }}>PRO PARTNER RADAR</span>
                    <span className="badge badge-emerald">{lockedDeals.length} SUB-WHOLESALE SIGNALS LOCKED</span>
                  </div>

                  <h3 className="serif-heading" style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                    Unlock All {filteredDeals.length} Sub-Wholesale Arbitrage Deals
                  </h3>

                  <p style={{ maxWidth: '540px', margin: '0 auto 20px auto', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Active Chrono24 private listings trading up to <strong>$20,000+ below dealer consensus</strong> across Daytona, Royal Oak, and Nautilus are exclusively available to verified Pro desks.
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={onOpenAuth}
                      className="btn-primary"
                      style={{ padding: '12px 26px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <ShieldCheck size={16} /> Sign In with Registered Desk
                    </button>

                    <button
                      onClick={onOpenAuth}
                      className="btn-ghost"
                      style={{ padding: '12px 22px', fontSize: '0.88rem', border: '1px solid var(--border-medium)', color: 'var(--text-main)' }}
                    >
                      <Crown size={14} style={{ color: 'var(--gold-primary)' }} /> Request Pro Invoice ($99/mo)
                    </button>
                  </div>
                </div>

                {/* Blurred Preview Grid of Locked Deals */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                  gap: '20px',
                  filter: 'blur(7px)',
                  opacity: 0.25,
                  pointerEvents: 'none',
                  userSelect: 'none',
                  maxHeight: '340px',
                  overflow: 'hidden'
                }}>
                  {lockedDeals.slice(0, 3).map(deal => (
                    <div key={`locked-${deal.id}`} className="glass-card" style={{ padding: '22px', height: '220px', background: '#FFFFFF' }} />
                  ))}
                </div>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
};
