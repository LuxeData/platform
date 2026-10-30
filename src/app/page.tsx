'use client';
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ReferenceSelector } from '../components/ReferenceSelector';
import { WatchDetailView } from '../components/WatchDetailView';
import { DealerAppraisalTerminal } from '../components/DealerAppraisalTerminal';
import { ArbitrageScanner } from '../components/ArbitrageScanner';
import { Logo } from '../components/Logo';
import { WATCH_MODELS, MACRO_METRICS } from '../lib/marketEngine';
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
  Cpu,
  ShieldCheck,
  Target,
  ArrowUpRight,
  Clock,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'appraisal' | 'arbitrage'>('terminal');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBrandFilter, setActiveBrandFilter] = useState('ALL');
  const [selectedWatch, setSelectedWatch] = useState<WatchModel>(WATCH_MODELS[0]);

  // Filter watches based on search query
  const filteredWatches = WATCH_MODELS.filter((watch) => {
    const matchesSearch = 
      watch.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      watch.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      watch.reference.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeBrandFilter === 'ALL') return matchesSearch;
    if (activeBrandFilter === 'ARBITRAGE') {
      return matchesSearch && (watch.dealerMetrics?.arbitrageCount || 0) > 0;
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
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main style={{
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        padding: '24px 24px 60px 24px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        
        {/* VIEW 1: DEALER APPRAISAL TERMINAL */}
        {activeTab === 'appraisal' && (
          <DealerAppraisalTerminal watches={WATCH_MODELS} onSelectWatch={setSelectedWatch} />
        )}

        {/* VIEW 2: ARBITRAGE RADAR */}
        {activeTab === 'arbitrage' && (
          <ArbitrageScanner 
            watches={WATCH_MODELS} 
            onSelectWatch={(w) => { 
              setSelectedWatch(w); 
              setActiveTab('terminal'); 
            }} 
          />
        )}

        {/* VIEW 3: MARKET TERMINAL */}
        {activeTab === 'terminal' && (
          <>
            {/* Real Macro Intelligence Strip (Derived from Scraped Chrono24 Ingestion) */}
            <section style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '14px'
            }}>
              
              {/* Metric 1: Luxe 5 Secondary Basket Index */}
              <div className="glass-card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    LUXE 5 BENCHMARK INDEX
                  </span>
                  <span className="badge badge-emerald">
                    <TrendingUp size={11} /> +{MACRO_METRICS.luxeIndexChangePct}% 30D
                  </span>
                </div>
                <div className="tabular-nums" style={{ fontSize: '1.65rem', fontWeight: 700, color: '#FFF' }}>
                  ${MACRO_METRICS.luxeIndexValue.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Secondary basket: Rolex (3), Patek 5711, AP 15500
                </div>
              </div>

              {/* Metric 2: Monitored Secondary Liquidity */}
              <div className="glass-card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    MONITORED SECONDARY CAPITAL
                  </span>
                  <span className="badge badge-gold">
                    <span className="pulse-indicator"></span> LIVE FEED
                  </span>
                </div>
                <div className="tabular-nums" style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                  ${(MACRO_METRICS.totalCatalogValue / 1000000).toFixed(1)}M+
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {MACRO_METRICS.totalTrackedListings} active lots across professional dealers & private sellers
                </div>
              </div>

              {/* Metric 3: Institutional Dealer Spread */}
              <div className="glass-card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    DEALER CONSENSUS SPREAD
                  </span>
                  <span className="badge badge-subtle">PRO STANDARD</span>
                </div>
                <div className="tabular-nums" style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--emerald-gain)' }}>
                  {MACRO_METRICS.averageDealerSpreadPct.toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Consensus retail asking vs. dealer cash buy-in floor
                </div>
              </div>

              {/* Metric 4: Top Arbitrage Signal */}
              <div 
                onClick={() => {
                  const targetWatch = WATCH_MODELS.find(w => w.reference === MACRO_METRICS.topArbitrageDeal.reference);
                  if (targetWatch) setSelectedWatch(targetWatch);
                }}
                className="glass-card-interactive" 
                style={{
                  padding: '18px 20px',
                  border: '1px solid var(--border-gold-subtle)',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(14, 19, 29, 0.95) 100%)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-gold)', textTransform: 'uppercase', fontWeight: 600 }}>
                    TOP ARBITRAGE SIGNAL
                  </span>
                  <span className="badge badge-emerald">
                    SAVE ${MACRO_METRICS.topArbitrageDeal.profitDollars.toLocaleString()}
                  </span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {MACRO_METRICS.topArbitrageDeal.model}
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{MACRO_METRICS.topArbitrageDeal.discountPct}% below dealer consensus</span>
                  <ArrowUpRight size={12} style={{ color: 'var(--gold-light)' }} />
                </div>
              </div>
            </section>

            {/* Benchmark Reference Quick Selector (Pinned at Top for Zero-Friction Switching) */}
            <ReferenceSelector 
              watches={filteredWatches.length > 0 ? filteredWatches : WATCH_MODELS}
              selectedWatch={selectedWatch}
              onSelectWatch={setSelectedWatch}
            />

            {/* Selected Watch Terminal Intelligence Engine */}
            <section style={{ marginTop: '6px' }}>
              <WatchDetailView watch={selectedWatch} />
            </section>

            {/* Institutional Private Inquiries Strip */}
            <section className="glass-card" style={{
              padding: '24px 30px',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.06) 0%, rgba(14, 19, 29, 0.85) 100%)',
              border: '1px solid var(--border-gold-subtle)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px'
              }}>
                <div style={{ maxWidth: '780px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-gold">B2B DEALER INTEGRATION</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>REST API &amp; INVENTORY FEEDS</span>
                  </div>
                  <h3 className="serif-heading" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px', color: '#FFF' }}>
                    Institutional Watch Dealer &amp; Private Portfolio Intelligence
                  </h3>
                  <p style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    LuxeData provides luxury watch dealers, pawnbrokers, and alternative asset funds with real-time Chrono24 consensus valuation feeds, instant cash buy-in appraisals, and automated secondary arbitrage scanners.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button 
                    onClick={() => setActiveTab('appraisal')}
                    className="btn-primary" 
                    style={{ fontSize: '0.82rem', padding: '10px 20px' }}
                  >
                    Open Dealer Terminal <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

      </main>

      {/* Institutional Legal Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-hairline)',
        background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.04) 0%, #05070B 80%)',
        padding: '36px 24px',
        fontSize: '0.74rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Logo size={36} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="serif-heading" style={{ fontWeight: 700, fontSize: '1.0rem', color: '#FFF', letterSpacing: '0.06em' }}>
                  LUXE<span className="gold-gradient-text">DATA</span> SYSTEMS
                </span>
                <span className="badge badge-gold" style={{ fontSize: '0.60rem' }}>CHRONO24 INGESTION</span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.70rem', marginTop: '2px' }}>
                Institutional Luxury Timepiece Terminal • 10% Trimmed Mean Consensus • 20% Buy-In Margin Engine
              </div>
            </div>
          </div>

          <div style={{ maxWidth: '580px', textAlign: 'right', fontSize: '0.70rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>
              Data provenance: Chrono24 live active market listings across verified professional dealers and private collectors. Consensus market value is calculated via 10% trimmed mean algorithm. Buy-in floor reflects 20% dealer margin spread standard.
            </p>
            <div style={{ marginTop: '8px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <span style={{ color: 'var(--emerald-gain)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <span className="pulse-indicator"></span> CONSENSUS ENGINE ONLINE • 24MS LATENCY
              </span>
              <span>© 2026 LuxeData Systems. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
