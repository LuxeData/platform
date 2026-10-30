'use client';
import React, { useState } from 'react';
import { Logo } from './Logo';
import { WatchModel } from '../types/watch';
import { MacroMetrics } from '../lib/marketEngine';
import { formatUSD } from '../lib/format';
import { MechanicalBackground } from './MechanicalBackground';
import { 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  Calculator, 
  Target, 
  Building2, 
  Scale, 
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Sliders,
  CheckCircle2,
  Lock,
  Layers,
  Store,
  ChevronRight,
  Zap,
  BarChart3
} from 'lucide-react';

interface LandingViewProps {
  watches: WatchModel[];
  macro: MacroMetrics;
  onEnterTerminal: (watch?: WatchModel) => void;
  onOpenAuth: () => void;
  onNavigateTab: (tab: 'terminal' | 'appraisal' | 'arbitrage') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  watches,
  macro,
  onEnterTerminal,
  onOpenAuth,
  onNavigateTab
}) => {
  const [activeBenchmarkRef, setActiveBenchmarkRef] = useState<string>(watches[0]?.reference || '126610LN');

  const spotlightWatch = watches.find(w => w.reference === activeBenchmarkRef) || watches[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '60px', position: 'relative' }}>
      
      {/* 1. HERO SECTION: Cinematic Horological Movement Stage */}
      <section style={{
        position: 'relative',
        textAlign: 'center',
        padding: '56px 20px 40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        minHeight: '520px',
        justifyContent: 'center'
      }}>
        {/* Dynamic Background: Rotating Swiss Movement Rings & Fluid Light Orbs */}
        <MechanicalBackground />

        {/* Master Logo Mark with Gold Glow */}
        <div style={{
          zIndex: 1,
          position: 'relative',
          filter: 'drop-shadow(0 0 32px rgba(212, 175, 55, 0.35))'
        }}>
          <Logo size={70} />
        </div>

        {/* Status Pill Badge */}
        <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span className="badge badge-gold" style={{ padding: '5px 14px', fontSize: '0.72rem' }}>
            <span className="pulse-indicator"></span>
            TRI-VENUE CONSENSUS • CHRONO24 + EBAY + WATCHCHARTS
          </span>
          <span className="badge badge-subtle" style={{ padding: '5px 14px', fontSize: '0.70rem', fontFamily: 'var(--font-mono)' }}>
            INSTITUTIONAL B2B SUITE
          </span>
        </div>

        {/* Main Headline with Gold Sheen Animation */}
        <div style={{ zIndex: 1, maxWidth: '920px' }}>
          <h1 className="serif-heading" style={{
            fontSize: 'clamp(2.0rem, 3.8vw, 3.3rem)',
            fontWeight: 800,
            lineHeight: '1.18',
            color: '#FFF',
            letterSpacing: '0.02em',
            marginBottom: '16px'
          }}>
            Institutional Intelligence for the <br />
            <span className="gold-sheen-text">Secondary Luxury Timepiece</span> Market
          </h1>

          <p style={{
            fontSize: 'clamp(0.92rem, 1.25vw, 1.10rem)',
            lineHeight: '1.65',
            color: 'var(--text-secondary)',
            maxWidth: '780px',
            margin: '0 auto'
          }}>
            LuxeData replaces speculative asking price guesswork with a multi-venue <strong>Consensus Market Value (CMV)</strong> calibrated across Chrono24 dealer asks, eBay realized cash sales, and WatchCharts index data. It equips dealers with a defensible <strong>20% cash buy-in formula</strong> and scans live secondary listings for sub-wholesale arbitrage.
          </p>
        </div>

        {/* Primary Call-to-Action Buttons */}
        <div style={{ zIndex: 1, display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
          <button
            onClick={() => onEnterTerminal()}
            className="btn-primary"
            style={{
              padding: '14px 30px',
              fontSize: '0.96rem',
              borderRadius: '10px',
              boxShadow: '0 8px 30px rgba(212, 175, 55, 0.35)'
            }}
          >
            Launch Market Terminal <ArrowRight size={17} />
          </button>

          <button
            onClick={onOpenAuth}
            className="btn-ghost"
            style={{
              padding: '14px 26px',
              fontSize: '0.96rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-gold-subtle)',
              color: 'var(--gold-light)'
            }}
          >
            <ShieldCheck size={18} /> Dealer Client Portal
          </button>
        </div>

        {/* Micro Provenance Assurance */}
        <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: '18px', color: 'var(--text-muted)', fontSize: '0.74rem', marginTop: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={13} style={{ color: 'var(--gold-primary)' }} /> Real Chrono24 Ingestion
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={13} style={{ color: 'var(--emerald-gain)' }} /> 20% Wholesale Dealer Spread
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={13} style={{ color: 'var(--gold-primary)' }} /> 10% Trimmed Mean Consensus
          </span>
        </div>
      </section>

      {/* 2. FLOATING INSTITUTIONAL COMMAND DOCK (De-Meshed Macro Strip) */}
      <section style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '0 20px' }}>
        <div 
          className="border-beam-card responsive-command-dock" 
          style={{
            padding: '24px 28px',
            background: 'linear-gradient(180deg, rgba(14, 19, 29, 0.88) 0%, rgba(8, 12, 19, 0.96) 100%)'
          }}
        >
          {/* Metric 1: Luxe 5 Secondary Index */}
          <div className="responsive-dock-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                LUXE 5 BENCHMARK INDEX
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>
                <TrendingUp size={10} /> +{macro.luxeIndexChangePct}% 30D
              </span>
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#FFF' }}>
              ${formatUSD(macro.luxeIndexValue)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Secondary basket: Rolex, AP &amp; Patek
            </div>
          </div>

          {/* Metric 2: Monitored Capital */}
          <div className="responsive-dock-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                MONITORED SECONDARY CAPITAL
              </span>
              <span className="badge badge-gold" style={{ fontSize: '0.62rem' }}>LIVE SYNC</span>
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--gold-light)' }}>
              ${(macro.totalCatalogValue / 1000000).toFixed(1)}M+
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {macro.totalTrackedListings} active Chrono24 listings
            </div>
          </div>

          {/* Metric 3: Institutional Buy-In Spread */}
          <div className="responsive-dock-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                DEALER BUY-IN SPREAD
              </span>
              <span className="badge badge-subtle" style={{ fontSize: '0.62rem' }}>BENCHMARK</span>
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--emerald-gain)' }}>
              {macro.averageDealerSpreadPct.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Standard wholesale buy-in margin
            </div>
          </div>

          {/* Metric 4: Verified Arbitrage Deals */}
          <div className="responsive-dock-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-gold)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
                ARBITRAGE SIGNALS
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>SUB-WHOLESALE</span>
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#FFF' }}>
              {macro.arbitrageCount} Active
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--emerald-gain)', marginTop: '4px' }}>
              Priced &lt; Dealer Buy-In Floor
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE BENCHMARK SPOTLIGHT (High-Impact Timepiece Stage) */}
      <section style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Section Title & Intro */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 32px auto' }}>
          <span className="badge badge-gold" style={{ marginBottom: '10px' }}>CORE LIQUIDITY BENCHMARKS</span>
          <h2 className="serif-heading" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.4rem)', fontWeight: 700, color: '#FFF' }}>
            The 5 Benchmark Secondary Curves
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.5' }}>
            Explore real-time order clustering, trimmed mean consensus, and defensible cash buy-in floors across the secondary luxury market&apos;s most traded steel references.
          </p>
        </div>

        {/* Interactive Reference Tabs Selector (Touch Scrollable on Mobile) */}
        <div className="mobile-tabs-container" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '28px',
          padding: '4px 0'
        }}>
          {watches.map((w) => {
            const isSelected = w.reference === activeBenchmarkRef;
            return (
              <button
                key={w.reference}
                onClick={() => setActiveBenchmarkRef(w.reference)}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.18) 0%, rgba(14, 19, 29, 0.95) 100%)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '1px solid var(--gold-primary)' : '1px solid var(--border-hairline)',
                  color: isSelected ? 'var(--gold-light)' : 'var(--text-secondary)',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontSize: '0.80rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 20px rgba(212, 175, 55, 0.2)' : 'none'
                }}
              >
                <span>{w.brand}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', opacity: 0.8 }}>{w.reference}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Benchmark Stage: Responsive Split Showcase (Stacks cleanly on Mobile) */}
        {spotlightWatch && (
          <div 
            className="border-beam-card responsive-split-showcase" 
            style={{
              padding: '36px',
              background: 'radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.08) 0%, rgba(10, 14, 23, 0.98) 70%)'
            }}
          >
            {/* Left: Timepiece Dossier & Terminal Jump */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span className="badge badge-gold" style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
                  REF: {spotlightWatch.reference}
                </span>
                <span className="badge badge-subtle" style={{ fontSize: '0.68rem' }}>
                  {spotlightWatch.category}
                </span>
                <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                  <TrendingUp size={11} /> +{spotlightWatch.thirtyDayChangePct}% 30D
                </span>
              </div>

              <h3 className="serif-heading" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.0rem)', fontWeight: 800, color: '#FFF', marginBottom: '8px', lineHeight: '1.25' }}>
                {spotlightWatch.brand} {spotlightWatch.model}
              </h3>

              <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '18px', flexWrap: 'wrap' }}>
                <span>Case: <strong style={{ color: 'var(--text-secondary)' }}>{spotlightWatch.caseSize}</strong></span>
                <span>•</span>
                <span>Dial: <strong style={{ color: 'var(--text-secondary)' }}>{spotlightWatch.dialColor}</strong></span>
                <span>•</span>
                <span>Liquidity: <strong style={{ color: 'var(--gold-light)' }}>{spotlightWatch.dealerMetrics?.totalActiveListings || 60} Active Lots</strong></span>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
                {spotlightWatch.aiAnalysis.summary}
              </p>

              <button
                onClick={() => onEnterTerminal(spotlightWatch)}
                className="btn-primary mobile-full-width"
                style={{ padding: '13px 24px', fontSize: '0.88rem' }}
              >
                Inspect Full Order Book &amp; Listings <ArrowRight size={15} />
              </button>
            </div>

            {/* Right: Live Market Consensus & 20% Buy-In Metrics */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-hairline)',
              borderRadius: '14px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Multi-Venue Consensus Valuation Matrix
              </div>

              {/* Price Pair (Stacks on mobile, side-by-side on desktop) */}
              <div className="responsive-price-pair">
                <div style={{
                  background: 'rgba(212, 175, 55, 0.06)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: '10px',
                  padding: '14px'
                }}>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-gold)', textTransform: 'uppercase', fontWeight: 700 }}>
                    CONSENSUS RETAIL (CMV)
                  </div>
                  <div className="tabular-nums" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)', fontWeight: 800, color: 'var(--gold-light)', margin: '4px 0' }}>
                    ${formatUSD(spotlightWatch.currentAskingAvg)}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
                    10% trimmed mean of {spotlightWatch.dealerMetrics?.dealerListingsCount || 50} dealer lots
                  </div>
                </div>

                <div style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: '10px',
                  padding: '14px'
                }}>
                  <div style={{ fontSize: '0.64rem', color: 'var(--emerald-gain)', textTransform: 'uppercase', fontWeight: 700 }}>
                    DEALER CASH BUY-IN FLOOR
                  </div>
                  <div className="tabular-nums" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)', fontWeight: 800, color: '#FFF', margin: '4px 0' }}>
                    ${formatUSD(spotlightWatch.recentSoldAvg)}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
                    Immediate wholesale payout (-20% margin)
                  </div>
                </div>
              </div>

              {/* Spread & Arbitrage Info Bar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                borderTop: '1px solid var(--border-hairline)',
                paddingTop: '14px',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>Wholesale Spread</div>
                  <div className="tabular-nums" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', fontWeight: 700, color: 'var(--emerald-gain)', marginTop: '2px' }}>
                    +${formatUSD(spotlightWatch.currentAskingAvg - spotlightWatch.recentSoldAvg)}
                  </div>
                  <div style={{ fontSize: '0.60rem', color: 'var(--text-faint)' }}>20% Margin</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>Institutional Sample</div>
                  <div className="tabular-nums" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', fontWeight: 700, color: '#FFF', marginTop: '2px' }}>
                    {spotlightWatch.dealerMetrics?.dealerListingsCount || 50} Lots
                  </div>
                  <div style={{ fontSize: '0.60rem', color: 'var(--text-faint)' }}>Verified Desks</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>Sub-Wholesale Arb</div>
                  <div className="tabular-nums" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', fontWeight: 700, color: 'var(--gold-light)', marginTop: '2px' }}>
                    {spotlightWatch.dealerMetrics?.arbitrageCount || 0} Lots
                  </div>
                  <div style={{ fontSize: '0.60rem', color: 'var(--text-faint)' }}>Priced &lt; Floor</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. THREE DEALER VALUE PILLARS (Why Desks Rely on LuxeData) */}
      <section style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px auto' }}>
          <span className="badge badge-gold" style={{ marginBottom: '10px' }}>BUILT FOR SECONDARY SPECIALISTS</span>
          <h2 className="serif-heading" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.4rem)', fontWeight: 700, color: '#FFF' }}>
            Three Critical Advantages for Watch Desks
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Engineered directly from dealer interviews in the New York Diamond District and European trade desks.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {/* Pillar 1 */}
          <div className="border-beam-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid var(--border-gold-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-light)'
            }}>
              <Scale size={24} />
            </div>
            <h3 className="serif-heading" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF' }}>
              10% Trimmed Mean Consensus
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              Chrono24 asking prices are notoriously skewed by speculative dreamers. Our algorithm isolates verified company listings, eliminates top/bottom 10% outlier asks, and delivers the true <strong>Consensus Market Value (CMV)</strong>.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '12px', fontSize: '0.76rem', color: 'var(--emerald-gain)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} /> Eliminates high &amp; low market distortion
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="border-beam-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid var(--border-gold)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--emerald-gain)'
            }}>
              <Calculator size={24} />
            </div>
            <h3 className="serif-heading" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF' }}>
              Scientific 20% Buy-In Defense
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              When walk-in clients overvalue their pre-owned piece based on raw Chrono24 listings, print a <strong>LuxeData Appraisal Certificate</strong> showing condition multipliers, turnover days, and mathematical justification for your 20% wholesale offer.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '12px', fontSize: '0.76rem', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} /> Defends dealer gross margins in negotiations
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="border-beam-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38BDF8'
            }}>
              <Target size={24} />
            </div>
            <h3 className="serif-heading" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF' }}>
              Sub-Wholesale Arbitrage Scanner
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              Our automated engine monitors global dealer &amp; private lots 24/7, instantly surfacing opportunities trading <strong>below the dealer buy-in floor</strong> with direct Chrono24 links for rapid capital deployment.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '12px', fontSize: '0.76rem', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} /> 31 live opportunities active now
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIVE ARBITRAGE SHOWCASE: Direct Link Proof */}
      <section style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>LIVE RADAR SAMPLES</span>
            <h2 className="serif-heading" style={{ fontSize: 'clamp(1.6rem, 2.3vw, 2.2rem)', fontWeight: 700, color: '#FFF' }}>
              Real Arbitrage Lots Currently Active on Chrono24
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Actual secondary market lots priced below our institutional buy-in baseline.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('arbitrage')}
            className="btn-ghost"
            style={{ fontSize: '0.82rem', padding: '10px 18px', color: 'var(--gold-light)' }}
          >
            View All 31 Arbitrage Deals <ArrowRight size={15} />
          </button>
        </div>

        {/* 3 Real Lots Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {watches.slice(0, 3).map((w) => {
            const topDeal = w.dealerMetrics?.arbitrageDeals?.[0];
            if (!topDeal) return null;

            return (
              <div
                key={topDeal.id}
                className="border-beam-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="badge badge-subtle">{w.brand}</span>
                    <span className="badge badge-emerald tabular-nums" style={{ fontWeight: 700 }}>
                      Save ${formatUSD(topDeal.estimated_profit_dollars)} (-{topDeal.discount_from_cmv_pct}%)
                    </span>
                  </div>

                  <h3 className="serif-heading" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>
                    {w.model}
                  </h3>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Ref: <strong style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-mono)' }}>{w.reference}</strong> • {topDeal.condition} • {topDeal.location}
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-hairline)',
                    marginBottom: '14px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>Asking Price:</span>
                      <span className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>
                        ${formatUSD(topDeal.price)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                      <span>CMV: ${formatUSD(w.currentAskingAvg)}</span>
                      <span style={{ color: 'var(--emerald-gain)' }}>Buy-In Floor: ${formatUSD(w.recentSoldAvg)}</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border-hairline)',
                  paddingTop: '12px'
                }}>
                  <span className={topDeal.is_private ? 'badge badge-subtle' : 'badge badge-gold'} style={{ fontSize: '0.66rem' }}>
                    {topDeal.seller_type}
                  </span>

                  {topDeal.url && (
                    <a
                      href={topDeal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ fontSize: '0.76rem', padding: '7px 16px' }}
                    >
                      Inspect on Chrono24 <ArrowUpRight size={13} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION: Get Started */}
      <section style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '0 20px' }}>
        <div 
          className="border-beam-card" 
          style={{
            padding: '56px 36px',
            textAlign: 'center',
            background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.15) 0%, rgba(10, 14, 23, 0.98) 75%)',
            border: '1px solid var(--border-gold)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '22px'
          }}
        >
          <div style={{ filter: 'drop-shadow(0 0 24px rgba(212, 175, 55, 0.3))' }}>
            <Logo size={56} />
          </div>
          <h2 className="serif-heading" style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.5rem)', fontWeight: 800, color: '#FFF', maxWidth: '720px' }}>
            Equip Your Dealership with Institutional Certainty
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '640px', lineHeight: '1.65' }}>
            Stop negotiating on unverified consumer asking prices. Join boutique watch dealers defending their buy-in margins with certified 10% trimmed mean intelligence.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px' }}>
            <button
              onClick={() => onEnterTerminal()}
              className="btn-primary"
              style={{ padding: '14px 32px', fontSize: '0.96rem', borderRadius: '10px' }}
            >
              Open Market Terminal <ArrowRight size={16} />
            </button>
            <button
              onClick={onOpenAuth}
              className="btn-ghost"
              style={{ padding: '14px 28px', fontSize: '0.96rem', color: 'var(--gold-light)', borderRadius: '10px' }}
            >
              Create Dealer Account
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
