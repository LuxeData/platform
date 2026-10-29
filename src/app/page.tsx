'use client';
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { WatchCard } from '../components/WatchCard';
import { WatchDetailView } from '../components/WatchDetailView';
import { WATCH_MODELS } from '../data/mockWatches';
import { WatchModel } from '../types/watch';
import { 
  TrendingUp, 
  Layers, 
  Zap, 
  BarChart3, 
  ShieldAlert, 
  Filter, 
  ArrowRight,
  Database,
  Cpu
} from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBrandFilter, setActiveBrandFilter] = useState('ALL');
  const [selectedWatch, setSelectedWatch] = useState<WatchModel>(WATCH_MODELS[0]);

  // Filter watches
  const filteredWatches = WATCH_MODELS.filter((watch) => {
    const matchesSearch = 
      watch.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      watch.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      watch.reference.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeBrandFilter === 'ALL') return matchesSearch;
    if (activeBrandFilter === 'ARBITRAGE') {
      return matchesSearch && watch.aiAnalysis.currentSpread >= 6.0;
    }
    return matchesSearch && watch.brand.toUpperCase() === activeBrandFilter;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header & Search Navigation */}
      <Navbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeBrandFilter}
        setActiveFilter={setActiveBrandFilter}
      />

      {/* Main Content Area */}
      <main style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '24px 24px 60px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Macro Intelligence Strip */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          
          <div className="glass-card" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                LUXE 50 WATCH INDEX
              </span>
              <span className="badge badge-emerald">+1.8% 30D</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)' }}>
              $134,850
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Secondary market basket across Rolex, Patek, AP
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AGGREGATED 24H VOLUME
              </span>
              <span className="badge badge-gold">LIVE FEED</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--gold-light)' }}>
              $4.82M
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              418 confirmed sales across eBay, Sotheby's, Chrono24
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AVG DEALER-AUCTION SPREAD
              </span>
              <span className="badge badge-subtle">PRO SPREAD</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)' }}>
              7.4%
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Asking price vs. realized hammer pricing
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px 22px', border: '1px solid var(--border-gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-gold)', textTransform: 'uppercase', fontWeight: 600 }}>
                TOP ARBITRAGE SIGNAL
              </span>
              <span className="badge badge-emerald">SCORE 8.9</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF' }}>
              Rolex Daytona 116500LN
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              $1,700 pricing spread between private & auction
            </div>
          </div>
        </section>

        {/* Selected Watch Terminal Intelligence Engine */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={20} style={{ color: 'var(--gold-primary)' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                Asset Intelligence Terminal
              </h2>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Viewing Reference: <strong style={{ color: 'var(--gold-light)' }}>{selectedWatch.brand} {selectedWatch.reference}</strong>
            </span>
          </div>

          <WatchDetailView watch={selectedWatch} />
        </section>

        {/* Reference Models Explorer Section */}
        <section style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={20} style={{ color: 'var(--gold-primary)' }} />
                Reference Models Explorer
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Select any reference model to load comprehensive valuation curves and AI opportunity analysis
              </p>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { label: 'All References', val: 'ALL' },
                { label: 'Rolex', val: 'ROLEX' },
                { label: 'Patek Philippe', val: 'PATEK PHILIPPE' },
                { label: 'Omega', val: 'OMEGA' },
                { label: '⚡ Top Arbitrage Spreads', val: 'ARBITRAGE' }
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setActiveBrandFilter(item.val)}
                  className={`btn-ghost ${activeBrandFilter === item.val ? 'active' : ''}`}
                  style={{ fontSize: '0.8rem' }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredWatches.map((watch) => (
              <WatchCard
                key={watch.id}
                watch={watch}
                isSelected={selectedWatch.id === watch.id}
                onSelect={(w) => {
                  setSelectedWatch(w);
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
              />
            ))}
          </div>

          {filteredWatches.length === 0 && (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No reference models match "{searchQuery}". Try searching for 126610LN, Daytona, or Rolex.
            </div>
          )}
        </section>

        {/* Phase 2 Marketplace Preview Banner */}
        <section className="glass-card" style={{ padding: '28px 36px', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(15, 20, 31, 0.8) 100%)', border: '1px solid rgba(212, 175, 55, 0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ maxWidth: '720px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span className="badge badge-gold">PHASE 2 ROADMAP</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ZERO-INVENTORY MIDDLEMAN MARKETPLACE</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '6px' }}>
                P2P Luxury Asset Escrow & Direct Transaction Infrastructure
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Once verified collector liquidity reaches benchmark thresholds, LuxeData unlocks zero-inventory peer-to-peer auction middleman infrastructure with 5–10% low-take-rate fees, mandatory KYC verification, and certified physical authentication escrow.
              </p>
            </div>

            <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>
              Request Private Dealer Beta Access <ArrowRight size={16} />
            </button>
          </div>
        </section>

      </main>

      {/* Institutional Legal Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', background: '#05070B', padding: '32px 24px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '0.95rem', color: '#FFF', marginBottom: '4px' }}>
              LUXE<span className="gold-text">DATA</span> INTELLIGENCE PLATFORM
            </div>
            <div>
              Institutional Market Data • Cross-Market Realized Auctions • Algorithmic Spread Tracking
            </div>
          </div>

          <div style={{ maxWidth: '600px', textAlign: 'right' }}>
            <p>
              Note: AI opportunity ratings, fair-market valuation scores, and market outlooks are strictly informational research toolsets and do not constitute financial advice. All brand trademarks (Rolex, Patek Philippe, Omega) belong to their respective copyright holders.
            </p>
            <div style={{ marginTop: '6px', color: 'var(--text-secondary)' }}>
              © 2026 LuxeData Systems. Built for secondary luxury asset liquidity.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
