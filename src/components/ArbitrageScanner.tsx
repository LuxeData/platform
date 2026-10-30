'use client';
import React, { useState } from 'react';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{
        padding: '22px 28px',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, rgba(14, 19, 29, 0.95) 100%)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Logo size={38} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 className="serif-heading" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFF' }}>
                  Live Secondary Arbitrage Radar
                </h2>
                <span className="badge badge-emerald" style={{ fontFamily: 'var(--font-mono)' }}>
                  {filteredDeals.length} LIVE SIGNALS
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px' }}>
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
                style={{ fontSize: '0.72rem', padding: '6px 12px' }}
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {freeDeals.map(deal => (
                <div 
                  key={deal.id}
                  className="glass-card" 
                  style={{ 
                    padding: '20px', 
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span className="badge badge-subtle">{deal.brand}</span>
                      <span className="badge badge-emerald tabular-nums" style={{ fontWeight: 700 }}>
                        Save ${formatUSD(deal.estimated_profit_dollars)} (-{deal.discount_from_cmv_pct}%)
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>
                      {deal.model}
                    </h3>
                    <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      Ref: <strong style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-mono)' }}>{deal.reference}</strong> • {deal.condition} • {deal.location}
                    </p>

                    {/* Price Comparison Block */}
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-hairline)',
                      marginBottom: '12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>Asking Price:</span>
                        <span className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFF' }}>
                          ${formatUSD(deal.price)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <span>Retail CMV: <strong className="tabular-nums" style={{ color: 'var(--text-main)' }}>${formatUSD(deal.cmv)}</strong></span>
                        <span>Buy-In Floor: <strong className="tabular-nums" style={{ color: 'var(--emerald-gain)' }}>${formatUSD(deal.buyIn)}</strong></span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '14px', lineHeight: '1.4' }}>
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
                        style={{ fontSize: '0.74rem', padding: '6px 14px' }}
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
              <div style={{ position: 'relative', marginTop: '20px' }}>
                <div className="glass-card" style={{
                  padding: '36px 24px',
                  border: '1px solid var(--border-gold)',
                  background: 'radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.14) 0%, rgba(10, 14, 23, 0.98) 75%)',
                  borderRadius: '16px',
                  textAlign: 'center',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 24px rgba(212, 175, 55, 0.12)',
                  marginBottom: '18px'
                }}>
                  <div style={{
                    display: 'inline-flex',
                    padding: '14px',
                    borderRadius: '50%',
                    background: 'rgba(212, 175, 55, 0.12)',
                    border: '1px solid var(--border-gold)',
                    marginBottom: '14px'
                  }}>
                    <Lock size={28} style={{ color: 'var(--gold-light)' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge badge-gold" style={{ fontWeight: 700 }}>PRO PARTNER RADAR</span>
                    <span className="badge badge-emerald">{lockedDeals.length} SUB-WHOLESALE SIGNALS LOCKED</span>
                  </div>

                  <h3 className="serif-heading" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>
                    Unlock All {filteredDeals.length} Sub-Wholesale Arbitrage Deals
                  </h3>

                  <p style={{ maxWidth: '540px', margin: '0 auto 20px auto', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Active Chrono24 private listings trading up to <strong>$20,000+ below dealer consensus</strong> across Daytona, Royal Oak, and Nautilus are exclusively available to verified Pro desks.
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={onOpenAuth}
                      className="btn-primary"
                      style={{ padding: '10px 24px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <ShieldCheck size={16} /> Sign In with Registered Desk
                    </button>

                    <button
                      onClick={onOpenAuth}
                      className="btn-ghost"
                      style={{ padding: '10px 20px', fontSize: '0.86rem', border: '1px solid var(--border-gold-subtle)', color: 'var(--gold-light)' }}
                    >
                      <Crown size={14} /> Request Pro Invoice ($99/mo)
                    </button>
                  </div>
                </div>

                {/* Blurred Preview Grid of Locked Deals */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '16px',
                  filter: 'blur(7px)',
                  opacity: 0.25,
                  pointerEvents: 'none',
                  userSelect: 'none',
                  maxHeight: '340px',
                  overflow: 'hidden'
                }}>
                  {lockedDeals.slice(0, 3).map(deal => (
                    <div key={`locked-${deal.id}`} className="glass-card" style={{ padding: '20px', height: '220px' }} />
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
