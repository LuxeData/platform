'use client';
import React, { useState } from 'react';
import { WatchModel, ArbitrageListing } from '../types/watch';
import { Logo } from './Logo';
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
  DollarSign
} from 'lucide-react';

interface ArbitrageScannerProps {
  watches: WatchModel[];
  onSelectWatch?: (watch: WatchModel) => void;
}

export const ArbitrageScanner: React.FC<ArbitrageScannerProps> = ({ watches, onSelectWatch }) => {
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
      <div className="glass-card" style={{ padding: '24px 28px', border: '1px solid rgba(16, 185, 129, 0.4)', background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.06) 0%, rgba(15, 20, 31, 0.95) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Logo size={40} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFF' }}>
                  Live Secondary Arbitrage Radar
                </h2>
                <span className="badge badge-emerald">31 LIVE SIGNALS</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '2px' }}>
                Actively scanning Chrono24 for lots trading below the institutional dealer buy-in floor
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* Brand Filter Buttons */}
            {['ALL', 'ROLEX', 'PATEK PHILIPPE', 'AUDEMARS PIGUET'].map(b => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`btn-ghost ${selectedBrand === b ? 'active' : ''}`}
                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Deals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
        {filteredDeals.map(deal => (
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
                <span className="badge badge-emerald" style={{ fontWeight: 700 }}>
                  Save ${deal.estimated_profit_dollars?.toLocaleString()} (-{deal.discount_from_cmv_pct}%)
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>
                {deal.model}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                Ref: <strong style={{ color: 'var(--gold-light)' }}>{deal.reference}</strong> • {deal.condition} • {deal.location}
              </p>

              {/* Price Comparison Block */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Asking Price:</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF' }}>
                    ${deal.price.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Consensus Retail (CMV): ${deal.cmv.toLocaleString()}</span>
                  <span style={{ color: 'var(--text-gold)' }}>Buy-In Floor: ${deal.buyIn.toLocaleString()}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '14px' }}>
                &ldquo;{deal.snippet}&rdquo;
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
              <span className={deal.is_private ? "badge badge-subtle" : "badge badge-gold"} style={{ fontSize: '0.68rem' }}>
                {deal.seller_type}
              </span>

              {deal.url && (
                <a 
                  href={deal.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                >
                  Inspect on Chrono24 <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
