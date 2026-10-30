'use client';
import React from 'react';
import { Logo } from './Logo';
import { WatchModel } from '../types/watch';
import { MacroMetrics } from '../lib/marketEngine';
import { formatUSD } from '../lib/format';
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
  Store
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px', paddingBottom: '40px' }}>
      
      {/* 1. HERO SECTION: Prestigious Executive Gateway */}
      <section style={{
        position: 'relative',
        textAlign: 'center',
        padding: '24px 20px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '18px'
      }}>
        {/* Ambient Gold Aura */}
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '420px',
          height: '220px',
          background: 'radial-gradient(ellipse, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* Master Emblem */}
        <div style={{ zIndex: 1, position: 'relative' }}>
          <Logo size={62} />
        </div>

        {/* Status Pill */}
        <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-gold" style={{ padding: '3px 10px', fontSize: '0.68rem' }}>
            <span className="pulse-indicator"></span>
            CHRONO24 CONSENSUS ENGINE • 281 ACTIVE LOTS
          </span>
          <span className="badge badge-subtle" style={{ padding: '3px 10px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
            PRO VENUE FEED
          </span>
        </div>

        {/* Main Title */}
        <div style={{ zIndex: 1, maxWidth: '860px' }}>
          <h1 className="serif-heading" style={{
            fontSize: 'clamp(1.75rem, 2.8vw, 2.45rem)',
            fontWeight: 800,
            lineHeight: '1.2',
            color: '#FFF',
            letterSpacing: '-0.01em',
            marginBottom: '12px'
          }}>
            Institutional Intelligence for the <br />
            <span className="gold-gradient-text">Secondary Luxury Timepiece</span> Market
          </h1>

          <p style={{
            fontSize: 'clamp(0.88rem, 1.1vw, 1.02rem)',
            lineHeight: '1.55',
            color: 'var(--text-secondary)',
            maxWidth: '740px',
            margin: '0 auto'
          }}>
            LuxeData replaces retail asking price guesswork with an outlier-trimmed <strong>Consensus Market Value (CMV)</strong>, arms watch dealers with a defensible <strong>20% cash buy-in formula</strong>, and scans thousands of live listings for sub-wholesale arbitrage.
          </p>
        </div>

        {/* Dual Primary CTAs */}
        <div style={{ zIndex: 1, display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
          <button
            onClick={() => onEnterTerminal()}
            className="btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '0.90rem',
              borderRadius: '8px'
            }}
          >
            Launch Market Terminal <ArrowRight size={16} />
          </button>

          <button
            onClick={onOpenAuth}
            className="btn-ghost"
            style={{
              padding: '12px 20px',
              fontSize: '0.90rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-gold-subtle)',
              color: 'var(--gold-light)'
            }}
          >
            <ShieldCheck size={16} /> Dealer Client Portal
          </button>
        </div>

        {/* Live Macro Metrics Strip */}
        <div style={{
          zIndex: 1,
          width: '100%',
          maxWidth: '1120px',
          marginTop: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              LUXE 5 BENCHMARK INDEX
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFF', margin: '4px 0' }}>
              ${formatUSD(macro.luxeIndexValue)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--emerald-gain)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={13} /> +{macro.luxeIndexChangePct}% 30D Secondary Basket
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              MONITORED SECONDARY CAPITAL
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gold-light)', margin: '4px 0' }}>
              ${(macro.totalCatalogValue / 1000000).toFixed(1)}M+
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {macro.totalTrackedListings} active Chrono24 listings tracked
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              DEALER BUY-IN SPREAD
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--emerald-gain)', margin: '4px 0' }}>
              {macro.averageDealerSpreadPct.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Standard wholesale buy-in margin
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', textAlign: 'left', border: '1px solid var(--border-gold-subtle)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-gold)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              VERIFIED ARBITRAGE SIGNALS
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFF', margin: '4px 0' }}>
              {macro.arbitrageCount} Active
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--emerald-gain)' }}>
              Priced &lt; Dealer Buy-In Floor
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE BENCHMARK ASSET PREVIEW: "Interactive Terminal Preview" */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
          <span className="badge badge-gold" style={{ marginBottom: '8px' }}>CORE LIQUIDITY BENCHMARKS</span>
          <h2 className="serif-heading" style={{ fontSize: '1.85rem', fontWeight: 700, color: '#FFF' }}>
            The 5 Benchmark Secondary Reference Curves
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Click any timepiece below to inspect live order book clustering, trimmed mean curves, and private seller spreads.
          </p>
        </div>

        {/* 5-Card Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px'
        }}>
          {watches.map((w) => (
            <div
              key={w.reference}
              onClick={() => onEnterTerminal(w)}
              className="glass-card-interactive"
              style={{
                padding: '20px',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {w.brand.toUpperCase()}
                  </span>
                  <span className="badge badge-gold" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>
                    {w.reference}
                  </span>
                </div>

                <h3 className="serif-heading" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>
                  {w.model}
                </h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  {w.caseSize} • {w.dialColor}
                </p>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-hairline)',
                  marginBottom: '12px'
                }}>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Consensus Value (CMV)</div>
                  <div className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                    ${formatUSD(w.currentAskingAvg)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.70rem', marginTop: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Buy-In (-20%):</span>
                    <strong className="tabular-nums" style={{ color: 'var(--emerald-gain)' }}>${formatUSD(w.recentSoldAvg)}</strong>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--border-hairline)',
                paddingTop: '10px'
              }}>
                <span className="badge badge-emerald" style={{ fontSize: '0.60rem' }}>
                  {w.dealerMetrics?.arbitrageCount || 0} Arb Lots
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--gold-light)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  Inspect Terminal <ArrowUpRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. THREE CORE CAPABILITIES: Why Watch Dealers Rely on LuxeData */}
      <section style={{
        background: 'rgba(14, 19, 29, 0.6)',
        border: '1px solid var(--border-hairline)',
        borderRadius: '20px',
        padding: '48px 36px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px auto' }}>
          <span className="badge badge-gold" style={{ marginBottom: '8px' }}>BUILT FOR SECONDARY SPECIALISTS</span>
          <h2 className="serif-heading" style={{ fontSize: '1.95rem', fontWeight: 700, color: '#FFF' }}>
            Three Critical Advantages for Watch Desks
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Engineered directly from dealer interviews in the New York Diamond District and European trade desks.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {/* Pillar 1 */}
          <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid var(--border-gold-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-light)'
            }}>
              <Scale size={22} />
            </div>
            <h3 className="serif-heading" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF' }}>
              10% Trimmed Mean Consensus
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Chrono24 asking prices are notoriously skewed by speculative dreamers. Our algorithm isolates verified company listings, eliminates top/bottom 10% outlier asks, and delivers the true <strong>Consensus Market Value (CMV)</strong>.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '10px', fontSize: '0.74rem', color: 'var(--emerald-gain)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} /> Eliminates high &amp; low market distortion
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px', border: '1px solid var(--border-gold-subtle)' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--emerald-gain)'
            }}>
              <Calculator size={22} />
            </div>
            <h3 className="serif-heading" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF' }}>
              Scientific 20% Buy-In Defense
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              When walk-in clients overvalue their pre-owned piece based on raw Chrono24 listings, print a <strong>LuxeData Appraisal Certificate</strong> showing condition multipliers, turnover days, and mathematical justification for your 20% wholesale offer.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '10px', fontSize: '0.74rem', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} /> Defends dealer gross margins in negotiations
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38BDF8'
            }}>
              <Target size={22} />
            </div>
            <h3 className="serif-heading" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF' }}>
              Sub-Wholesale Arbitrage Scanner
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Our automated engine monitors global dealer &amp; private lots 24/7, instantly surfacing opportunities trading <strong>below the dealer buy-in floor</strong> with direct Chrono24 links for rapid capital deployment.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '10px', fontSize: '0.74rem', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} /> 31 live opportunities active now
            </div>
          </div>
        </div>
      </section>

      {/* 4. LIVE ARBITRAGE SHOWCASE: Direct Link Proof */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: '6px' }}>LIVE RADAR SAMPLES</span>
            <h2 className="serif-heading" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#FFF' }}>
              Real Arbitrage Lots Currently Active on Chrono24
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Actual secondary market lots priced below our institutional buy-in baseline.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('arbitrage')}
            className="btn-ghost"
            style={{ fontSize: '0.80rem', padding: '8px 16px', color: 'var(--gold-light)' }}
          >
            View All 31 Arbitrage Deals <ArrowRight size={14} />
          </button>
        </div>

        {/* 3 Real Lots Preview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px'
        }}>
          {watches.slice(0, 3).map((w) => {
            const topDeal = w.dealerMetrics?.arbitrageDeals?.[0];
            if (!topDeal) return null;

            return (
              <div
                key={topDeal.id}
                className="glass-card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(16, 185, 129, 0.25)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-subtle">{w.brand}</span>
                    <span className="badge badge-emerald tabular-nums" style={{ fontWeight: 700 }}>
                      Save ${formatUSD(topDeal.estimated_profit_dollars)} (-{topDeal.discount_from_cmv_pct}%)
                    </span>
                  </div>

                  <h3 className="serif-heading" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>
                    {w.model}
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Ref: <strong style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-mono)' }}>{w.reference}</strong> • {topDeal.condition} • {topDeal.location}
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-hairline)',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Asking Price:</span>
                      <span className="tabular-nums" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF' }}>
                        ${formatUSD(topDeal.price)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.70rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <span>CMV: ${formatUSD(w.currentAskingAvg)}</span>
                      <span style={{ color: 'var(--emerald-gain)' }}>Buy-In: ${formatUSD(w.recentSoldAvg)}</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border-hairline)',
                  paddingTop: '10px'
                }}>
                  <span className={topDeal.is_private ? 'badge badge-subtle' : 'badge badge-gold'} style={{ fontSize: '0.64rem' }}>
                    {topDeal.seller_type}
                  </span>

                  {topDeal.url && (
                    <a
                      href={topDeal.url}
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
            );
          })}
        </div>
      </section>

      {/* 5. BOTTOM CALL TO ACTION: Get Started */}
      <section className="glass-card" style={{
        padding: '48px 36px',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.1) 0%, rgba(14, 19, 29, 0.95) 80%)',
        border: '1px solid var(--border-gold-subtle)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        <Logo size={52} />
        <h2 className="serif-heading" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', fontWeight: 800, color: '#FFF', maxWidth: '700px' }}>
          Equip Your Dealership with Institutional Certainty
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '620px', lineHeight: '1.6' }}>
          Stop negotiating on unverified consumer asking prices. Join boutique watch dealers defending their buy-in margins with certified 10% trimmed mean intelligence.
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px' }}>
          <button
            onClick={() => onEnterTerminal()}
            className="btn-primary"
            style={{ padding: '12px 28px', fontSize: '0.94rem' }}
          >
            Open Market Terminal <ArrowRight size={16} />
          </button>
          <button
            onClick={onOpenAuth}
            className="btn-ghost"
            style={{ padding: '12px 24px', fontSize: '0.94rem', color: 'var(--gold-light)' }}
          >
            Create Dealer Account
          </button>
        </div>
      </section>

    </div>
  );
};
