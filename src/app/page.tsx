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
import { InteractiveTiltCard } from '../components/InteractiveTiltCard';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { ScrollToTopButton } from '../components/ScrollToTopButton';
import Link from 'next/link';
import { getActiveUserSession } from '../lib/supabaseClient';
import { WATCH_MODELS, MACRO_METRICS } from '../lib/marketEngine';
import { WatchModel, UserSession } from '../types/watch';
import { formatUSD } from '../lib/format';
import { 
  TrendingUp, 
  TrendingDown,
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
          <div key="overview" className="view-transition-container">
            <LandingView
              watches={filteredWatches.length > 0 ? filteredWatches : WATCH_MODELS}
              macro={MACRO_METRICS}
              onEnterTerminal={handleEnterTerminal}
              onOpenAuth={() => setIsAuthOpen(true)}
              onNavigateTab={setActiveTab}
            />
          </div>
        )}
        
        {/* VIEW 1: DEALER APPRAISAL TERMINAL */}
        {activeTab === 'appraisal' && (
          <div key="appraisal" className="view-transition-container">
            <DealerAppraisalTerminal 
              watches={WATCH_MODELS} 
              onSelectWatch={setSelectedWatch} 
              user={user} 
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          </div>
        )}

        {/* VIEW 2: ARBITRAGE RADAR */}
        {activeTab === 'arbitrage' && (
          <div key="arbitrage" className="view-transition-container">
            <ArbitrageScanner 
              watches={WATCH_MODELS} 
              onSelectWatch={(w) => { 
                setSelectedWatch(w); 
                setActiveTab('terminal'); 
              }} 
              user={user}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          </div>
        )}

        {/* VIEW 3: MARKET TERMINAL */}
        {activeTab === 'terminal' && (
          <div key="terminal" className="view-transition-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Real Macro Intelligence Strip with S-Tier Elevation & Animated Counters */}
            <section style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '14px'
            }}>
              
              {/* Metric 1: Luxe 5 Secondary Basket Index */}
              <InteractiveTiltCard maxTilt={3} glareOpacity={0.12} className="glass-card" style={{ padding: '18px 20px', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    LUXE 5 BENCHMARK INDEX
                  </span>
                  <span className={MACRO_METRICS.luxeIndexChangePct >= 0 ? 'badge badge-emerald' : 'badge badge-crimson'}>
                    {MACRO_METRICS.luxeIndexChangePct >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {MACRO_METRICS.luxeIndexChangePct >= 0 ? `+${MACRO_METRICS.luxeIndexChangePct}` : `${MACRO_METRICS.luxeIndexChangePct}`}% 30D
                  </span>
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  <AnimatedCounter value={MACRO_METRICS.luxeIndexValue} prefix="$" />
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Secondary basket: Rolex (3), Patek 5711, AP 15500
                </div>
              </InteractiveTiltCard>

              {/* Metric 2: Monitored Secondary Liquidity */}
              <InteractiveTiltCard maxTilt={3} glareOpacity={0.12} className="glass-card" style={{ padding: '18px 20px', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    MONITORED SECONDARY CAPITAL
                  </span>
                  <span
                    className="badge badge-gold badge-glimmer"
                    title={`Data Ingestion Timestamp: ${MACRO_METRICS.lastScrapedAt}`}
                    style={{ cursor: 'help' }}
                  >
                    <span className="pulse-indicator-gold" style={{ width: '5px', height: '5px', marginRight: '4px' }}></span> SYNTHESIS BENCHMARK ACTIVE
                  </span>
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--gold-dark)' }}>
                  <AnimatedCounter value={MACRO_METRICS.totalCatalogValue / 1000000} prefix="$" suffix="M+" decimals={1} />
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {MACRO_METRICS.totalTrackedListings} active lots across professional dealers & private sellers
                </div>
              </InteractiveTiltCard>

              {/* Metric 3: Institutional Dealer Spread */}
              <InteractiveTiltCard maxTilt={3} glareOpacity={0.12} className="glass-card" style={{ padding: '18px 20px', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    DEALER CONSENSUS SPREAD
                  </span>
                  <span className="badge badge-subtle">PRO STANDARD</span>
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--emerald-gain)' }}>
                  <AnimatedCounter value={MACRO_METRICS.averageDealerSpreadPct} suffix="%" decimals={1} />
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Consensus retail asking vs. dealer cash buy-in floor
                </div>
              </InteractiveTiltCard>

              {/* Metric 4: Top Arbitrage Signal */}
              <InteractiveTiltCard 
                maxTilt={3} 
                glareOpacity={0.15}
                onClick={() => {
                  const targetWatch = WATCH_MODELS.find(w => w.reference === MACRO_METRICS.topArbitrageDeal.reference);
                  if (targetWatch) setSelectedWatch(targetWatch);
                }}
                className="glass-card-interactive" 
                style={{
                  padding: '18px 20px',
                  border: '1px solid var(--border-gold-subtle)',
                  background: 'linear-gradient(135deg, rgba(180, 130, 40, 0.06) 0%, #FFFFFF 100%)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--gold-dark)', textTransform: 'uppercase', fontWeight: 600 }}>
                    TOP ARBITRAGE SIGNAL
                  </span>
                  <span className="badge badge-emerald">
                    SAVE <AnimatedCounter value={MACRO_METRICS.topArbitrageDeal.profitDollars} prefix="$" />
                  </span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {MACRO_METRICS.topArbitrageDeal.model}
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{MACRO_METRICS.topArbitrageDeal.discountPct}% below dealer consensus</span>
                  <ArrowUpRight size={12} style={{ color: 'var(--gold-dark)' }} />
                </div>
              </InteractiveTiltCard>
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
              padding: '28px 32px',
              background: 'linear-gradient(135deg, rgba(180, 130, 40, 0.05) 0%, #FFFFFF 100%)',
              border: '1px solid var(--border-gold-subtle)',
              boxShadow: 'var(--shadow-card)'
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
                    <span className="badge badge-gold badge-glimmer">B2B DEALER INTEGRATION</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>REST API &amp; INVENTORY FEEDS</span>
                  </div>
                  <h3 className="serif-heading" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
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
          </div>
        )}

        {/* VIEW 5: INSTITUTIONAL LEGAL & GOVERNANCE */}
        {activeTab === 'legal' && (
          <div key="legal" className="view-transition-container" style={{ marginTop: '10px' }}>
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
        background: '#FFFFFF',
        padding: '48px 24px',
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
                <span className="serif-heading" style={{ fontWeight: 700, fontSize: '1.0rem', color: 'var(--text-main)', letterSpacing: '0.06em' }}>
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
                  <Scale size={12} color="var(--gold-primary)" /> Zero Data Brokering
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
                  color: 'var(--gold-dark)',
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
                  color: 'var(--gold-dark)',
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
                <span className="pulse-indicator"></span> CONSENSUS ENGINE ACTIVE • 281 LOTS INGESTED
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

      {/* Swiss Luxury Floating Scroll To Top Control */}
      <ScrollToTopButton />

    </div>
  );
}
