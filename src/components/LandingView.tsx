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

        {/* HERO VALUE PROP: Crystal-clear single-sentence explanation right at the very top. No fluff. */}
        <div 
          className="animate-reveal-up stagger-1 badge-glimmer"
          style={{
            zIndex: 1,
            position: 'relative',
            overflow: 'hidden',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(161, 116, 36, 0.08)',
            border: '1px solid var(--border-gold-subtle)',
            borderRadius: '999px',
            padding: '8px 20px',
            maxWidth: '820px',
            boxShadow: '0 4px 14px rgba(161, 116, 36, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
          }}
        >
          <Sparkles size={14} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
          <span style={{
            fontSize: 'clamp(0.78rem, 1.2vw, 0.86rem)',
            fontWeight: 600,
            color: 'var(--gold-dark)',
            letterSpacing: '0.015em',
            textAlign: 'center'
          }}>
            The institutional benchmark for secondary luxury watch valuation, cash buy-in floors, and cross-venue arbitrage.
          </span>
        </div>

        {/* Master Logo Mark */}
        <div 
          className="animate-fade-scale stagger-2"
          style={{
            zIndex: 1,
            position: 'relative',
            filter: 'drop-shadow(0 6px 20px rgba(161, 116, 36, 0.25))'
          }}
        >
          <Logo size={70} />
        </div>

        {/* Status Pill Badge */}
        <div 
          className="animate-reveal-up stagger-3"
          style={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <span className="badge badge-gold badge-glimmer" style={{ padding: '6px 16px', fontSize: '0.72rem', boxShadow: '0 2px 8px rgba(161, 116, 36, 0.12)' }}>
            <span className="pulse-indicator"></span>
            TRI-VENUE CONSENSUS • CHRONO24 + EBAY + WATCHCHARTS
          </span>
          <span className="badge badge-subtle" style={{ padding: '6px 16px', fontSize: '0.70rem', fontFamily: 'var(--font-mono)' }}>
            INSTITUTIONAL B2B SUITE
          </span>
        </div>

        {/* Main Headline */}
        <div 
          className="animate-reveal-up stagger-4"
          style={{ zIndex: 1, maxWidth: '920px' }}
        >
          <h1 className="serif-heading" style={{
            fontSize: 'clamp(2.2rem, 4.0vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: '1.18',
            color: 'var(--text-main)',
            letterSpacing: '0.01em',
            marginBottom: '16px'
          }}>
            Institutional Intelligence for <br />
            <span className="gold-sheen-text">Fine Luxury Timepieces</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.0rem, 1.35vw, 1.15rem)',
            lineHeight: '1.65',
            color: 'var(--text-secondary)',
            maxWidth: '740px',
            margin: '0 auto',
            fontWeight: 400
          }}>
            LuxeData delivers real-time secondary market consensus pricing and defensible cash buy-in valuations across the world&apos;s most traded investment-grade watches.
          </p>
        </div>

        {/* Primary Call-to-Action Buttons */}
        <div 
          className="animate-reveal-up stagger-5"
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
            Launch Market Terminal <ArrowRight size={17} />
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
            <ShieldCheck size={18} style={{ color: 'var(--gold-primary)' }} /> Dealer Client Portal
          </button>
        </div>

        {/* Micro Provenance Assurance */}
        <div 
          className="animate-reveal-up stagger-6"
          style={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: '18px', color: 'var(--text-muted)', fontSize: '0.76rem', marginTop: '14px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--gold-primary)' }} /> Live Chrono24 Ingestion
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--emerald-gain)' }} /> Defensible 20% Dealer Margin
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--gold-primary)' }} /> 10% Trimmed Mean Consensus
          </span>
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
                <span className="badge badge-gold" style={{ fontSize: '0.62rem' }}>
                  <span className="pulse-indicator-gold" style={{ width: '5px', height: '5px', marginRight: '4px' }}></span> LIVE SYNC
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
                <span className="badge badge-subtle" style={{ fontSize: '0.62rem' }}>BENCHMARK</span>
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
                <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>SUB-WHOLESALE</span>
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
            <span className="badge badge-gold badge-glimmer" style={{ marginBottom: '10px' }}>PHYSICAL ASSET BENCHMARKS</span>
            <h2 className="serif-heading" style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)', fontWeight: 800, color: 'var(--text-main)' }}>
              The 5 Benchmark Secondary References
            </h2>
            <p style={{ fontSize: '0.90rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.6' }}>
              Direct consensus market pricing and defensible cash buy-in floors across the most actively traded stainless steel references.
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
                <span className="badge badge-gold badge-glimmer" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>
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
                    CONSENSUS MARKET VALUE
                  </div>
                  <div style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.0rem)', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>
                    <AnimatedCounter value={spotlightWatch.currentAskingAvg} prefix="$" />
                  </div>
                  <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
                    10% trimmed mean of dealer asks
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginTop: '6px' }}>
                <button
                  onClick={() => onEnterTerminal(spotlightWatch)}
                  className="btn-primary mobile-full-width"
                  style={{ padding: '14px 28px', fontSize: '0.90rem', borderRadius: '10px' }}
                >
                  Inspect Order Book &amp; Listings <ArrowRight size={16} />
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
              <span className="badge badge-gold badge-glimmer" style={{ marginBottom: '8px' }}>CURATED HOROLOGICAL INDEX</span>
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
                onSelect={(selected) => onEnterTerminal(selected)}
              />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 5. THREE DEALER VALUE PILLARS (Clean, Authoritative White Cards) */}
      <section style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '0 20px' }}>
        <ScrollReveal direction="up" distance={20} duration={600}>
          <div style={{ textAlign: 'center', maxWidth: '740px', margin: '0 auto 40px auto' }}>
            <span className="badge badge-gold" style={{ marginBottom: '10px' }}>BUILT FOR SECONDARY SPECIALISTS</span>
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
                10% Trimmed Mean Consensus
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                Chrono24 asking prices are notoriously skewed by speculative dreamers. Our algorithm isolates verified company listings, eliminates top/bottom 10% outlier asks, and delivers the true <strong>Consensus Market Value (CMV)</strong>.
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
                Scientific 20% Buy-In Defense
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                When walk-in clients overvalue their pre-owned piece based on raw retail asks, generate a <strong>LuxeData Appraisal Certificate</strong> showing condition multipliers, turnover days, and mathematical justification for your 20% wholesale offer.
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
                Sub-Wholesale Arbitrage Scanner
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                Our automated engine monitors global dealer &amp; private lots 24/7, instantly surfacing opportunities trading <strong>below the dealer buy-in floor</strong> with direct Chrono24 links for rapid capital deployment.
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
              <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>LIVE RADAR SAMPLES</span>
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
                        <span>CMV: ${formatUSD(w.currentAskingAvg)}</span>
                        <span style={{ color: 'var(--emerald-gain)', fontWeight: 600 }}>Floor: ${formatUSD(w.recentSoldAvg)}</span>
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
              Equip Your Dealership with Institutional Certainty
            </h2>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', maxWidth: '640px', lineHeight: '1.65' }}>
              Stop negotiating on speculative consumer asking prices. Join boutique watch dealers defending their buy-in margins with certified 10% trimmed mean intelligence.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
              <button
                onClick={() => onEnterTerminal()}
                className="btn-primary"
                style={{ padding: '14px 34px', fontSize: '0.96rem', borderRadius: '10px' }}
              >
                Open Market Terminal <ArrowRight size={16} />
              </button>
              <button
                onClick={onOpenAuth}
                className="btn-ghost"
                style={{ padding: '14px 28px', fontSize: '0.96rem', color: 'var(--text-main)', borderRadius: '10px' }}
              >
                Create Dealer Account
              </button>
            </div>
          </InteractiveTiltCard>
        </ScrollReveal>
      </section>

    </div>
  );
};
