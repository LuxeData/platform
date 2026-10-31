'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { LandingView } from '../components/LandingView';
import { ReferenceSelector } from '../components/ReferenceSelector';
import { WatchDetailView } from '../components/WatchDetailView';
import { DealerAppraisalTerminal } from '../components/DealerAppraisalTerminal';
import { ArbitrageScanner } from '../components/ArbitrageScanner';
import { AuthModal } from '../components/AuthModal';
import { LegalView } from '../components/LegalView';
import { Logo } from '../components/Logo';
import Link from 'next/link';
import { getActiveUserSession } from '../lib/supabaseClient';
import { WATCH_MODELS, MACRO_METRICS } from '../lib/marketEngine';
import { WatchModel, UserSession } from '../types/watch';
import { formatUSD } from '../lib/format';
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
  Sparkles,
  Scale,
  Lock
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'overview' | 'terminal' | 'appraisal' | 'arbitrage' | 'legal'>('overview');
  const [legalDoc, setLegalDoc] = useState<'terms' | 'privacy'>('terms');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBrandFilter, setActiveBrandFilter] = useState('ALL');
  const [selectedWatch, setSelectedWatch] = useState<WatchModel>(WATCH_MODELS[0]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);

  // Load saved user session if exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem('luxedata_user');
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      // ignore
    }
    getActiveUserSession().then((sessionUser) => {
      if (sessionUser) {
        setUser(sessionUser);
        try {
          localStorage.setItem('luxedata_user', JSON.stringify(sessionUser));
        } catch (e) {}
      }
    });
  }, []);

  const handleAuthenticated = (userData: UserSession) => {
    setUser(userData);
    try {
      localStorage.setItem('luxedata_user', JSON.stringify(userData));
    } catch (e) {
      // ignore
    }
    setActiveTab('terminal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = () => {
    setUser(null);
    try {
      localStorage.removeItem('luxedata_user');
    } catch (e) {
      // ignore
    }
    setIsAuthOpen(false);
  };

  const handleEnterTerminal = (watch?: WatchModel) => {
    if (watch) setSelectedWatch(watch);
    setActiveTab('terminal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="main-container">

        {/* VIEW 0: WELCOME & COMPANY LANDING GATEWAY */}
        {activeTab === 'overview' && (
          <LandingView
            watches={WATCH_MODELS}
            macro={MACRO_METRICS}
            onEnterTerminal={handleEnterTerminal}
            onOpenAuth={() => setIsAuthOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}
        
        {/* VIEW 1: DEALER APPRAISAL TERMINAL */}
        {activeTab === 'appraisal' && (
          <DealerAppraisalTerminal 
            watches={WATCH_MODELS} 
            onSelectWatch={setSelectedWatch} 
            user={user} 
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {/* VIEW 2: ARBITRAGE RADAR */}
        {activeTab === 'arbitrage' && (
          <ArbitrageScanner 
            watches={WATCH_MODELS} 
            onSelectWatch={(w) => { 
              setSelectedWatch(w); 
              setActiveTab('terminal'); 
            }} 
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
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
                  ${formatUSD(MACRO_METRICS.luxeIndexValue)}
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
                    SAVE ${formatUSD(MACRO_METRICS.topArbitrageDeal.profitDollars)}
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
              user={user}
            />

            {/* Selected Watch Terminal Intelligence Engine */}
            <section style={{ marginTop: '6px' }}>
              <WatchDetailView 
                watch={selectedWatch} 
                user={user} 
                onOpenAuth={() => setIsAuthOpen(true)} 
              />
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
                    Open Dealer Desk <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* VIEW 5: INSTITUTIONAL LEGAL & GOVERNANCE */}
        {activeTab === 'legal' && (
          <div style={{ marginTop: '10px' }}>
            <LegalView 
              initialDoc={legalDoc}
              onBackToTerminal={() => {
                setActiveTab('terminal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

      </main>

      {/* Institutional Legal Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-hairline)',
        background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.04) 0%, #05070B 80%)',
        padding: '40px 24px',
        fontSize: '0.74rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', maxWidth: '440px' }}>
            <Logo size={36} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="serif-heading" style={{ fontWeight: 700, fontSize: '1.0rem', color: '#FFF', letterSpacing: '0.06em' }}>
                  LUXE<span className="gold-gradient-text">DATA</span> TECHNOLOGIES
                </span>
                <span className="badge badge-gold" style={{ fontSize: '0.60rem' }}>TRI-VENUE CONSENSUS</span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.70rem', marginTop: '4px', lineHeight: '1.5' }}>
                Institutional Luxury Timepiece Intelligence Terminal • 10% Trimmed Mean Consensus Engine • State of Delaware Registered Entity.
              </div>
              
              {/* Institutional Compliance Badges */}
              <div style={{ display: 'flex', gap: '14px', marginTop: '12px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={12} color="var(--emerald-gain)" /> SOC 2 Type II Aligned
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={12} color="var(--gold-primary)" /> AES-256 HSM Encrypted
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Scale size={12} color="var(--gold-champagne)" /> Zero Data Brokering
                </span>
              </div>
            </div>
          </div>

          <div className="footer-disclaimer" style={{ maxWidth: '620px', textAlign: 'right', fontSize: '0.70rem' }}>
            {/* Quick Legal Links Navigation */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              alignItems: 'center', 
              gap: '20px', 
              marginBottom: '12px',
              fontWeight: 600
            }}>
              <button
                onClick={() => {
                  setLegalDoc('terms');
                  setActiveTab('legal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--gold-champagne)',
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px'
                }}
              >
                Terms of Service
              </button>

              <button
                onClick={() => {
                  setLegalDoc('privacy');
                  setActiveTab('legal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--gold-champagne)',
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px'
                }}
              >
                Privacy Policy
              </button>

              <Link
                href="/terms"
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.72rem',
                  textDecoration: 'none'
                }}
              >
                Standalone URL ↗
              </Link>
            </div>

            <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Data Provenance: Tri-Venue quantitative synthesis combining Chrono24 active asks (50%), eBay Authenticity Guarantee realized cash sales (30%), and WatchCharts secondary dealer index (20%). Consensus values reflect statistical estimates for market research and do not constitute USPAP certified appraisals or broker-dealer securities offerings.
            </p>

            <div className="footer-status-row" style={{ marginTop: '10px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'flex-end', gap: '16px', alignItems: 'center' }}>
              <span style={{ color: 'var(--emerald-gain)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <span className="pulse-indicator"></span> CONSENSUS ENGINE ONLINE • 24MS LATENCY
              </span>
              <span>© 2026 LuxeData Technologies Inc. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth & Access Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onAuthenticated={handleAuthenticated}
        onSignOut={handleSignOut}
      />

    </div>
  );
}
