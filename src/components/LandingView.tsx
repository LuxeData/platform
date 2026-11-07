'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Logo } from './Logo';
import { WatchModel } from '../types/watch';
import { MacroMetrics } from '../lib/marketEngine';
import { formatUSD } from '../lib/format';
import { MechanicalBackground } from './MechanicalBackground';
import { InteractiveTiltCard } from './InteractiveTiltCard';
import { AnimatedCounter } from './AnimatedCounter';
import { ScrollReveal } from './ScrollReveal';
import { ParallaxWrapper } from './ParallaxWrapper';
import { 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Calculator, 
  Target, 
  Building2, 
  Scale, 
  ArrowUpRight, 
  Sliders, 
  CheckCircle2, 
  Lock, 
  Layers, 
  Store, 
  ChevronRight, 
  Zap, 
  BarChart3, 
  Info 
} from 'lucide-react';
import { WatchCard } from './WatchCard';

interface LandingViewProps {
  watches: WatchModel[];
  macro: MacroMetrics;
  onEnterTerminal: (watch?: WatchModel) => void;
  onOpenAuth: () => void;
  onNavigateTab: (tab: 'terminal' | 'appraisal' | 'arbitrage') => void;
  onInspectWatch?: (watch: WatchModel) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  watches,
  macro,
  onEnterTerminal,
  onOpenAuth,
  onNavigateTab,
  onInspectWatch
}) => {
  const [activeBenchmarkRef, setActiveBenchmarkRef] = useState<string>(watches[0]?.reference || '126610LN');

  const spotlightWatch = watches.find(w => w.reference === activeBenchmarkRef) || watches[0];

  return (
    <div className="landing-view-container">
      
      {/* 1. HERO SECTION: Clean, Serene, Generously Spaced Light Mode Stage */}
      <section style={{
        position: 'relative',
        textAlign: 'center',
        padding: '76px 20px 48px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '26px',
        minHeight: '480px',
        justifyContent: 'center'
      }}>
        {/* Dynamic Background: Rotating Swiss Movement Rings Watermark */}
        <MechanicalBackground />

        {/* Master Logo Mark */}
        <div 
          className="animate-fade-scale stagger-1"
          style={{
            zIndex: 1,
            position: 'relative',
            filter: 'drop-shadow(0 6px 20px rgba(161, 116, 36, 0.25))'
          }}
        >
          <Logo size={70} />
        </div>

        {/* Main Headline */}
        <div 
          className="animate-reveal-up stagger-2"
          style={{ zIndex: 1, maxWidth: '920px' }}
        >
          <h1 className="serif-heading" style={{
            fontSize: 'clamp(2.2rem, 4.0vw, 3.4rem)',
            fontWeight: 800,
            lineHeight: '1.18',
            color: 'var(--text-main)',
            letterSpacing: '0.01em',
            marginBottom: '16px'
          }}>
            Real-Time Watch Pricing &amp; <br />
            <span className="gold-sheen-text">Wholesale Cash Floors</span>
          </h1>

          <p style={{
            fontSize: 'clamp(0.98rem, 1.25vw, 1.12rem)',
            lineHeight: '1.65',
            color: 'var(--text-secondary)',
            maxWidth: '640px',
            margin: '0 auto',
            fontWeight: 400
          }}>
            Verified secondary market consensus and actual dealer buy-in math for high-liquidity references.
          </p>
        </div>

        {/* Primary Call-to-Action Buttons */}
        <div 
          className="animate-reveal-up stagger-3"
          style={{ zIndex: 1, display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}
        >
          <button
            onClick={() => onEnterTerminal()}
            className="btn-primary"
            style={{
              padding: '14px 34px',
              fontSize: '0.96rem',
              borderRadius: '10px',
              boxShadow: '0 6px 20px rgba(15, 23, 42, 0.18)'
            }}
          >
            Open Pricing Terminal <ArrowRight size={17} />
          </button>

          <button
            onClick={onOpenAuth}
            className="btn-ghost"
            style={{
              padding: '14px 28px',
              fontSize: '0.96rem',
              borderRadius: '10px',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-main)'
            }}
          >
            <ShieldCheck size={18} style={{ color: 'var(--gold-primary)' }} /> Dealer Access
          </button>
        </div>
      </section>

      {/* 2. FLOATING INSTITUTIONAL COMMAND DOCK: Crisp Light Theme Strip with S-Tier Elevation */}
      <section style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '0 20px' }}>
        <ScrollReveal direction="up" distance={24} duration={700}>
          <div 
            className="border-beam-card responsive-command-dock" 
            style={{
              padding: '28px 32px',
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 10px 32px -4px rgba(15, 23, 42, 0.08), inset 0 1px 0 #FFFFFF'
            }}
          >
            {/* Metric 1: Luxe 5 Secondary Index */}
            <div className="responsive-dock-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
                  LUXE 5 BENCHMARK INDEX
                </span>
                <span className={macro.luxeIndexChangePct >= 0 ? 'badge badge-emerald' : 'badge badge-crimson'} style={{ fontSize: '0.62rem' }}>
                  {macro.luxeIndexChangePct >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {macro.luxeIndexChangePct >= 0 ? `+${macro.luxeIndexChangePct}` : `${macro.luxeIndexChangePct}`}% 30D
                </span>
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                <AnimatedCounter value={macro.luxeIndexValue} prefix="$" />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Secondary basket: Rolex, AP &amp; Patek
              </div>
            </div>

            {/* Metric 2: Monitored Capital */}
            <div className="responsive-dock-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
                  MONITORED SECONDARY CAPITAL
                </span>
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
                <AnimatedCounter value={macro.totalCatalogValue / 1000000} prefix="$" suffix="M+" decimals={1} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {macro.totalTrackedListings} active Chrono24 listings
              </div>
            </div>

            {/* Metric 3: Institutional Buy-In Spread */}
            <div className="responsive-dock-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
                  DEALER BUY-IN SPREAD
                </span>
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--emerald-gain)' }}>
                <AnimatedCounter value={macro.averageDealerSpreadPct} suffix="%" decimals={1} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Standard wholesale buy-in margin
              </div>
            </div>

            {/* Metric 4: Verified Arbitrage Deals */}
            <div className="responsive-dock-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>
                  ARBITRAGE SIGNALS
                </span>
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                <AnimatedCounter value={macro.arbitrageCount} suffix=" Active" />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--emerald-gain)', marginTop: '4px', fontWeight: 500 }}>
                Priced &lt; Dealer Buy-In Floor
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. PRODUCT-FIRST BENCHMARK SPOTLIGHT: Physical Watch Takes Center Stage with Interactive 3D Tilt */}
      <section style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Section Header */}
        <ScrollReveal direction="up" distance={20} duration={600}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px auto' }}>
            <h2 className="serif-heading" style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)', fontWeight: 800, color: 'var(--text-main)' }}>
              The 5 Benchmark Secondary References
            </h2>
            <p style={{ fontSize: '0.90rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.6' }}>
              Live dealer consensus and wholesale cash floors across the most actively traded stainless steel references.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Reference Switcher */}
        <ScrollReveal direction="up" delay={70} distance={16} duration={550}>
          <div className="mobile-tabs-container" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '32px',
            padding: '4px 0'
          }}>
            {watches.map((w) => {
              const isSelected = w.reference === activeBenchmarkRef;
              return (
                <button
                  key={w.reference}
                  onClick={() => setActiveBenchmarkRef(w.reference)}
                  style={{
                    background: isSelected ? '#FFFFFF' : '#F1F5F9',
                    border: isSelected ? '2px solid var(--gold-primary)' : '1px solid var(--border-hairline)',
                    color: isSelected ? 'var(--text-main)' : 'var(--text-secondary)',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isSelected 
                      ? '0 4px 14px rgba(161, 116, 36, 0.18), inset 0 1px 0 #FFFFFF' 
                      : 'inset 0 1px 0 rgba(255, 255, 255, 0.7)',
                    transform: isSelected ? 'translateY(-1px)' : 'none'
                  }}
                >
                  <span>{w.brand}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', opacity: 0.85 }}>{w.reference}</span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Featured Benchmark Stage: Interactive 3D Perspective Tilt Showcase with Parallax */}
        {spotlightWatch && (
          <ScrollReveal direction="scale" delay={130} duration={650}>
            <InteractiveTiltCard
              maxTilt={2.8}
              glareOpacity={0.14}
              className="border-beam-card responsive-split-showcase" 
              style={{
                padding: '44px 40px',
                background: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-spotlight)',
                borderRadius: '20px'
              }}
            >
              {/* Left: High-Resolution Product Photograph (Studio Showcase with Parallax Depth) */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at 50% 35%, #FFFFFF 0%, #F8FAFC 85%)',
                borderRadius: '18px',
                padding: '24px',
                border: '1px solid var(--border-hairline)',
                position: 'relative',
                boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.03)',
                transformStyle: 'preserve-3d'
              }}>
                {spotlightWatch.imageUrl ? (
                  <ParallaxWrapper speed={0.05} maxOffset={18}>
                    <div style={{
                      position: 'relative',
                      width: '280px',
                      height: '320px',
                      maxWidth: '100%',
                      transform: 'translateZ(26px)',
                      transformStyle: 'preserve-3d'
                    }}>
                      <Image
                        src={spotlightWatch.imageUrl}
                        alt={`${spotlightWatch.brand} ${spotlightWatch.model}`}
                        fill
                        priority
                        sizes="(max-width: 768px) 280px, 320px"
                        style={{
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 16px 32px rgba(15, 23, 42, 0.16))',
                          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      />
                    </div>
                  </ParallaxWrapper>
                ) : (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Logo size={80} />
                </div>
              )}

              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="badge badge-gold" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>
                  REF: {spotlightWatch.reference}
                </span>
                <span className="badge badge-subtle" style={{ fontSize: '0.68rem' }}>
                  {spotlightWatch.caseSize} • {spotlightWatch.material}
                </span>
              </div>
            </div>

            {/* Right: Watch Title & Radical Data Minimalism (1 or 2 Core Stats Only) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="badge badge-subtle">{spotlightWatch.brand}</span>
                  <span className={spotlightWatch.thirtyDayChangePct >= 0 ? 'badge badge-emerald' : 'badge badge-crimson'}>
                    {spotlightWatch.thirtyDayChangePct >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {' '}{spotlightWatch.thirtyDayChangePct >= 0 ? `+${spotlightWatch.thirtyDayChangePct}` : `${spotlightWatch.thirtyDayChangePct}`}% 30D
                  </span>
                </div>

                <h3 className="serif-heading" style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                  {spotlightWatch.brand} {spotlightWatch.model}
                </h3>

                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                  {spotlightWatch.aiAnalysis.summary}
                </p>
              </div>

              {/* 2 CORE METRICS MAXIMUM PER VIEW */}
              <div className="responsive-price-pair">
                {/* Metric 1: Cash Buy-In Floor (Dealer Offer) */}
                <div style={{
                  background: 'rgba(5, 150, 105, 0.05)',
                  border: '1.5px solid var(--emerald-border)',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.06), inset 0 1px 0 #FFFFFF'
                }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--emerald-gain)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                    CASH BUY-IN FLOOR (-20%)
                  </div>
                  <div style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.0rem)', fontWeight: 800, color: 'var(--emerald-gain)', margin: '4px 0' }}>
                    <AnimatedCounter value={spotlightWatch.recentSoldAvg} prefix="$" />
                  </div>
                  <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
                    Immediate wholesale liquidity floor
                  </div>
                </div>

                {/* Metric 2: Consensus Market Value (CMV) */}
                <div style={{
                  background: 'rgba(161, 116, 36, 0.05)',
                  border: '1.5px solid var(--border-gold-subtle)',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  boxShadow: '0 4px 14px rgba(161, 116, 36, 0.06), inset 0 1px 0 #FFFFFF'
                }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--gold-primary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                    MARKET CONSENSUS
                  </div>
                  <div style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.0rem)', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>
                    <AnimatedCounter value={spotlightWatch.currentAskingAvg} prefix="$" />
                  </div>
                  <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
                    Dealer asking consensus
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onInspectWatch ? onInspectWatch(spotlightWatch) : onEnterTerminal(spotlightWatch)}
                  className="btn-primary mobile-full-width"
                  style={{ padding: '14px 28px', fontSize: '0.90rem', borderRadius: '10px' }}
                >
                  <span>Inspect Comps &amp; Math</span> <ArrowUpRight size={16} />
                </button>
                <button
                  onClick={() => onEnterTerminal(spotlightWatch)}
                  className="btn-ghost mobile-full-width"
                  style={{ padding: '14px 24px', fontSize: '0.90rem', borderRadius: '10px' }}
                >
                  Open Full Terminal <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </InteractiveTiltCard>
        </ScrollReveal>
      )}
      </section>

      {/* 4. RADICAL MINIMALISM WATCH GALLERY: 5 Cards with Physical Product First */}
      <section style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '0 20px' }}>
        <ScrollReveal direction="up" distance={18} duration={600}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            <div>
              <h2 className="serif-heading" style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.2rem)', fontWeight: 800, color: 'var(--text-main)' }}>
                Core Secondary Watch Catalog
              </h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Photo and model take center stage. Hover or click to disclose deep analytics.
              </p>
            </div>

            <button
              onClick={() => onEnterTerminal()}
              className="btn-ghost"
              style={{ fontSize: '0.82rem', padding: '10px 18px', color: 'var(--gold-primary)', fontWeight: 600 }}
            >
              Open Market Terminal <ArrowRight size={15} />
            </button>
          </div>
        </ScrollReveal>

        {/* 5 Minimalist Watch Cards with Choreographed Stagger Reveal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {watches.map((w, index) => (
            <ScrollReveal
              key={w.reference}
              direction="up"
              delay={index * 80}
              distance={26}
              duration={650}
            >
              <WatchCard
                watch={w}
                isSelected={spotlightWatch.reference === w.reference}
                onSelect={(selected) => onInspectWatch ? onInspectWatch(selected) : onEnterTerminal(selected)}
              />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 5. THREE DEALER VALUE PILLARS (Clean, Authoritative White Cards) */}
      <section style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '0 20px' }}>
        <ScrollReveal direction="up" distance={20} duration={600}>
          <div style={{ textAlign: 'center', maxWidth: '740px', margin: '0 auto 40px auto' }}>
            <h2 className="serif-heading" style={{ fontSize: 'clamp(1.8rem, 2.6vw, 2.4rem)', fontWeight: 800, color: 'var(--text-main)' }}>
              Three Critical Advantages for Watch Desks
            </h2>
            <p style={{ fontSize: '0.90rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Engineered directly from dealer interviews in the New York Diamond District and European trade desks.
            </p>
          </div>
        </ScrollReveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px'
        }}>
          {/* Pillar 1 */}
          <ScrollReveal direction="up" delay={0} distance={24} duration={650}>
            <InteractiveTiltCard maxTilt={3} glareOpacity={0.12} className="border-beam-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#FFFFFF', height: '100%' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(161, 116, 36, 0.08)',
                border: '1px solid var(--border-gold-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-primary)'
              }}>
                <Scale size={24} />
              </div>
              <h3 className="serif-heading" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Dealer Consensus Pricing
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                Raw asking prices are inflated by speculative retail dreamers. We strip the top and bottom 10% outliers to establish true transaction-weighted market value.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '12px', fontSize: '0.78rem', color: 'var(--emerald-gain)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <CheckCircle2 size={15} /> Eliminates high &amp; low market distortion
              </div>
            </InteractiveTiltCard>
          </ScrollReveal>

          {/* Pillar 2 */}
          <ScrollReveal direction="up" delay={110} distance={24} duration={650}>
            <InteractiveTiltCard maxTilt={3} glareOpacity={0.12} className="border-beam-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#FFFFFF', border: '1.5px solid var(--border-gold)', height: '100%' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(5, 150, 105, 0.08)',
                border: '1px solid var(--emerald-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--emerald-gain)'
              }}>
                <Calculator size={24} />
              </div>
              <h3 className="serif-heading" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Wholesale Cash Buy-In Math
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                Back your counter-offers with math. Justify wholesale buy-in discounts against live secondary liquidity, condition tiers, and box/papers provenance.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '12px', fontSize: '0.78rem', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <CheckCircle2 size={15} /> Defends dealer gross margins in negotiations
              </div>
            </InteractiveTiltCard>
          </ScrollReveal>

          {/* Pillar 3 */}
          <ScrollReveal direction="up" delay={220} distance={24} duration={650}>
            <InteractiveTiltCard maxTilt={3} glareOpacity={0.12} className="border-beam-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#FFFFFF', height: '100%' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(2, 132, 199, 0.08)',
                border: '1px solid rgba(2, 132, 199, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284C7'
              }}>
                <Target size={24} />
              </div>
              <h3 className="serif-heading" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Below-Wholesale Sourcing
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                Automated screens flag listings priced below current dealer buy-in floors across global dealer and private lots.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '12px', fontSize: '0.78rem', color: '#0284C7', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <CheckCircle2 size={15} /> {macro.arbitrageCount} live opportunities active now
              </div>
            </InteractiveTiltCard>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. LIVE ARBITRAGE SHOWCASE: Physical Product First with Direct Link Proof */}
      <section style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '0 20px' }}>
        <ScrollReveal direction="up" distance={20} duration={600}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
            <div>
              <h2 className="serif-heading" style={{ fontSize: 'clamp(1.6rem, 2.3vw, 2.2rem)', fontWeight: 800, color: 'var(--text-main)' }}>
                Real Arbitrage Lots Currently Active on Chrono24
              </h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Actual secondary market lots priced below our institutional buy-in baseline.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('arbitrage')}
              className="btn-ghost"
              style={{ fontSize: '0.82rem', padding: '10px 18px', color: 'var(--gold-primary)', fontWeight: 600 }}
            >
              View All {macro.arbitrageCount} Arbitrage Deals <ArrowRight size={15} />
            </button>
          </div>
        </ScrollReveal>

        {/* 3 Real Lots Cards with Staggered Scroll Reveal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {watches.slice(0, 3).map((w, index) => {
            const topDeal = w.dealerMetrics?.arbitrageDeals?.[0];
            if (!topDeal) return null;

            return (
              <ScrollReveal
                key={topDeal.id}
                direction="up"
                delay={index * 100}
                distance={24}
                duration={650}
              >
                <InteractiveTiltCard
                  maxTilt={3.5}
                  glareOpacity={0.15}
                  className="border-beam-card"
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: '#FFFFFF',
                    border: '1.5px solid var(--emerald-border)',
                    height: '100%'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="badge badge-subtle">{w.brand}</span>
                      <span className="badge badge-emerald" style={{ fontWeight: 700 }}>
                        Save <AnimatedCounter value={topDeal.estimated_profit_dollars || 0} prefix="$" /> (-{topDeal.discount_from_cmv_pct}%)
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '14px' }}>
                      {w.imageUrl && (
                        <div style={{
                          width: '70px',
                          height: '70px',
                          background: '#F8FAFC',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          position: 'relative'
                        }}>
                          <Image
                            src={w.imageUrl}
                            alt={w.model}
                            fill
                            sizes="70px"
                            style={{ objectFit: 'contain', padding: '5px' }}
                          />
                        </div>
                      )}

                      <div>
                        <h4 className="serif-heading" style={{ fontSize: '1.10rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>
                          {w.model}
                        </h4>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                          Ref: <strong style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)' }}>{w.reference}</strong> • {topDeal.location}
                        </div>
                      </div>
                    </div>

                    {/* Pricing Box */}
                    <div style={{
                      background: '#F8FAFC',
                      padding: '14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-hairline)',
                      marginBottom: '14px',
                      boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.02)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>Asking Price:</span>
                        <span className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          ${formatUSD(topDeal.price)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <span>Consensus: ${formatUSD(w.currentAskingAvg)}</span>
                        <span style={{ color: 'var(--emerald-gain)', fontWeight: 600 }}>Floor: ${formatUSD(w.recentSoldAvg)}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-hairline)',
                    paddingTop: '12px',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span className={topDeal.is_private ? 'badge badge-subtle' : 'badge badge-gold'} style={{ fontSize: '0.66rem' }}>
                        {topDeal.seller_type}
                      </span>
                      <span className="badge badge-subtle" style={{ fontSize: '0.62rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={11} style={{ color: 'var(--emerald-gain)' }} /> Insured Escrow Available
                      </span>
                    </div>

                    {topDeal.url && (
                      <a
                        href={topDeal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{ fontSize: '0.76rem', padding: '8px 16px' }}
                      >
                        Inspect on Chrono24 <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                </InteractiveTiltCard>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION: Get Started with Elevated Presence */}
      <section style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '0 20px' }}>
        <ScrollReveal direction="scale" distance={16} duration={700}>
          <InteractiveTiltCard 
            maxTilt={2}
            glareOpacity={0.12}
            className="border-beam-card" 
            style={{
              padding: '56px 36px',
              textAlign: 'center',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFC 100%)',
              border: '1.5px solid var(--border-gold)',
              boxShadow: 'var(--shadow-spotlight)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              borderRadius: '24px'
            }}
          >
            <div style={{ filter: 'drop-shadow(0 6px 20px rgba(161, 116, 36, 0.3))' }}>
              <Logo size={60} />
            </div>
            <h2 className="serif-heading" style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', fontWeight: 800, color: 'var(--text-main)', maxWidth: '720px' }}>
              Trade on Real Comps, Not Speculation
            </h2>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', maxWidth: '640px', lineHeight: '1.65' }}>
              Stop negotiating against unverified retail asking prices. Buy inventory backed by real wholesale comps.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
              <button
                onClick={() => onEnterTerminal()}
                className="btn-primary"
                style={{ padding: '14px 34px', fontSize: '0.96rem', borderRadius: '10px' }}
              >
                Launch Terminal <ArrowRight size={16} />
              </button>
              <button
                onClick={onOpenAuth}
                className="btn-ghost"
                style={{ padding: '14px 28px', fontSize: '0.96rem', color: 'var(--text-main)', borderRadius: '10px' }}
              >
                Dealer Sign In
              </button>
            </div>
          </InteractiveTiltCard>
        </ScrollReveal>
      </section>

    </div>
  );
};
