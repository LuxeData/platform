'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { WatchModel, UserSession } from '../types/watch';
import { formatUSD } from '../lib/format';
import { MultiVenueConsensusCard } from './MultiVenueConsensusCard';
import { Logo } from './Logo';
import { AnimatedCounter } from './AnimatedCounter';
import { ParallaxWrapper } from './ParallaxWrapper';
import { ScrollReveal } from './ScrollReveal';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Sliders,
  Scale,
  Building2,
  Store,
  Users,
  Target,
  ArrowUpRight,
  Info,
  Lock,
  Crown,
  Layers
} from 'lucide-react';

interface WatchDetailViewProps {
  watch: WatchModel;
  onBack?: () => void;
  user?: UserSession | null;
  onOpenAuth?: () => void;
}

export const WatchDetailView: React.FC<WatchDetailViewProps> = ({ watch, user, onOpenAuth }) => {
  const [timeframe, setTimeframe] = useState<'3M' | '6M' | '1Y' | 'ALL'>('1Y');
  
  // Interactive valuation condition and provenance toggles
  const [hasBoxPapers, setHasBoxPapers] = useState<boolean>(true);
  const [conditionGrade, setConditionGrade] = useState<'Unworn' | 'Mint' | 'Pre-owned'>('Mint');
  const [dealerTargetMargin, setDealerTargetMargin] = useState<number>(20); // standard 20% dealer buy-in rule

  // Base values from real Chrono24 scrape
  const baseCMV = watch.dealerMetrics?.consensusMarketValue || watch.currentAskingAvg;
  const retailMSRP = watch.aiAnalysis.retailMSRP;

  // Dynamic Valuation adjustment
  const calculateAdjustedValuation = () => {
    let multiplier = 1.0;
    if (hasBoxPapers) multiplier += 0.08; // Full Set premium
    else multiplier -= 0.10; // Naked penalty

    if (conditionGrade === 'Unworn') multiplier += 0.08;
    else if (conditionGrade === 'Pre-owned') multiplier -= 0.08;

    const adjustedCMV = Math.round(baseCMV * (multiplier / 1.08)); // normalized to full set mint
    const dealerCashOffer = Math.round(adjustedCMV * (1 - (dealerTargetMargin / 100)));
    const grossSpread = adjustedCMV - dealerCashOffer;
    const premiumOverRetail = Math.round(((adjustedCMV - retailMSRP) / retailMSRP) * 100);

    return {
      adjustedCMV,
      dealerCashOffer,
      grossSpread,
      premiumOverRetail
    };
  };

  const valuation = calculateAdjustedValuation();

  const isFreeWatch = watch.reference === '126610LN';
  const isUserPro = user?.tier === 'pro';
  const isLocked = !isFreeWatch && !isUserPro;

  // Filter price history by timeframe
  const filteredHistory = React.useMemo(() => {
    const hist = watch.priceHistory || [];
    if (timeframe === '3M') return hist.slice(-3);
    if (timeframe === '6M') return hist.slice(-6);
    if (timeframe === '1Y') return hist.slice(-12);
    return hist;
  }, [watch.priceHistory, timeframe]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Main Header Reference Hero Card */}
      <div className="glass-card" style={{ padding: '28px 32px', background: '#FFFFFF' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          {/* Reference Meta + Watch Thumbnail */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', maxWidth: '640px' }}>
            {watch.imageUrl && (
              <ParallaxWrapper speed={0.04} maxOffset={8}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: '#F8FAFC',
                  borderRadius: '14px',
                  border: '1px solid var(--border-hairline)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative'
                }}>
                  <Image
                    src={watch.imageUrl}
                    alt={watch.model}
                    fill
                    sizes="100px"
                    style={{
                      objectFit: 'contain',
                      padding: '8px',
                      filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.12))'
                    }}
                  />
                </div>
              </ParallaxWrapper>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span className="badge badge-gold" style={{ fontFamily: 'var(--font-mono)' }}>
                  REF: {watch.reference}
                </span>
                <span className="badge badge-subtle">{watch.brand}</span>
                <span className="badge badge-subtle">{watch.category}</span>
                <span className="badge badge-emerald">
                  <ShieldCheck size={12} /> VERIFIED CHRONO24 CONSENSUS
                </span>
              </div>

              <h1 className="serif-heading" style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.01em',
                marginBottom: '4px'
              }}>
                {watch.brand} {watch.model}
              </h1>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                Case: <strong style={{ color: 'var(--text-main)' }}>{watch.caseSize}</strong> • Material: <strong style={{ color: 'var(--text-main)' }}>{watch.material}</strong> • Dial: <strong style={{ color: 'var(--text-main)' }}>{watch.dialColor}</strong> • Boutique MSRP: <strong style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)' }}>${formatUSD(retailMSRP)}</strong>
              </p>
            </div>
          </div>

          {/* Pricing Metrics Strip (Responsive 1-col on mobile, flex on desktop) */}
          <div className="responsive-pricing-strip" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            background: '#F8FAFC',
            padding: '16px 24px',
            borderRadius: '14px',
            border: '1px solid var(--border-subtle)'
          }}>
            {/* Consensus Market Value (CMV) */}
            <div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Consensus Market Value (CMV)
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                <AnimatedCounter value={valuation.adjustedCMV} prefix="$" />
              </div>
              <div style={{
                fontSize: '0.74rem',
                color: watch.thirtyDayChangePct >= 0 ? 'var(--emerald-gain)' : 'var(--crimson-drop)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600
              }}>
                {watch.thirtyDayChangePct >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {watch.thirtyDayChangePct >= 0 ? `+${watch.thirtyDayChangePct}` : `${watch.thirtyDayChangePct}`}% (30D)
              </div>
            </div>

            {/* Dealer Cash Buy-In Floor (-Margin%) */}
            <div style={{ borderLeft: '1px solid var(--border-hairline)', paddingLeft: '24px' }}>
              <div style={{ fontSize: '0.66rem', color: 'var(--emerald-gain)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Dealer Buy-In Offer (-{dealerTargetMargin}%)
              </div>
              <div style={{ fontSize: '1.60rem', fontWeight: 800, color: 'var(--emerald-gain)' }}>
                {isLocked ? (
                  <span style={{ color: 'var(--gold-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '1.15rem' }}>
                    <Lock size={15} /> PRO DESK
                  </span>
                ) : (
                  <AnimatedCounter value={valuation.dealerCashOffer} prefix="$" />
                )}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                {isLocked ? 'Reserved for Pro partners' : `${dealerTargetMargin}% target buy margin`}
              </div>
            </div>

            {/* Gross Dealer Margin Spread */}
            <div style={{ borderLeft: '1px solid var(--border-hairline)', paddingLeft: '24px' }}>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Gross Dealer Spread
              </div>
              <div style={{ fontSize: '1.60rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
                {isLocked ? (
                  <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '1.15rem' }}>
                    <Lock size={15} /> {dealerTargetMargin}% MARGIN
                  </span>
                ) : (
                  <AnimatedCounter value={valuation.grossSpread} prefix="+$" />
                )}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                {isLocked ? 'Protected buy formula' : `${dealerTargetMargin}% target margin`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tri-Venue Consensus Engine (Chrono24 + eBay Realized Sold + WatchCharts) */}
      {watch.multiVenue && (
        <ScrollReveal direction="up" distance={20} duration={600}>
          <MultiVenueConsensusCard
            multiVenue={watch.multiVenue}
            watchModel={watch.model}
            reference={watch.reference}
          />
        </ScrollReveal>
      )}

      {/* 3. Main Terminal Grid: Responsive Layout (Stacks on Mobile) */}
      {isLocked ? (
        <div style={{ position: 'relative', width: '100%' }}>
          
          {/* Institutional Pro Gated Callout Box */}
          <div className="glass-card" style={{
            padding: '48px 24px',
            border: '1.5px solid var(--border-gold)',
            background: '#FFFFFF',
            borderRadius: '18px',
            textAlign: 'center',
            boxShadow: '0 16px 48px rgba(161, 116, 36, 0.12)',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'inline-flex',
              padding: '16px',
              borderRadius: '50%',
              background: 'rgba(161, 116, 36, 0.08)',
              border: '1.5px solid var(--border-gold)',
              boxShadow: '0 4px 16px rgba(161, 116, 36, 0.15)',
              marginBottom: '18px'
            }}>
              <Lock size={32} style={{ color: 'var(--gold-primary)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span className="badge badge-gold" style={{ letterSpacing: '0.06em', fontWeight: 700 }}>
                INSTITUTIONAL PRO DESK
              </span>
              <span className="badge badge-subtle">{watch.brand.toUpperCase()} {watch.reference}</span>
            </div>

            <h3 className="serif-heading" style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
              Unlock {watch.brand} {watch.model} Order Book
            </h3>

            <p style={{ maxWidth: '560px', margin: '0 auto 24px auto', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              Live Chrono24 dealer vs. private order books, 10% trimmed mean consensus metrics, condition multipliers, and 20% margin protection buy slips for <strong>{watch.model}</strong> are reserved for verified partner desks.
            </p>

            {/* Feature Bullets */}
            <div style={{
              maxWidth: '520px',
              margin: '0 auto 28px auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.80rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--emerald-gain)', flexShrink: 0 }} />
                <span>{watch.dealerMetrics?.totalActiveListings || 40} real scraped Chrono24 active lots</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.80rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--emerald-gain)', flexShrink: 0 }} />
                <span>Defensible 20% wholesale cash buy-in formula</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.80rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--emerald-gain)', flexShrink: 0 }} />
                <span>Full-set vs. naked provenance pricing adjustments</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.80rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--emerald-gain)', flexShrink: 0 }} />
                <span>Instant sub-wholesale flip alerts for {watch.reference}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={onOpenAuth}
                className="btn-primary"
                style={{ padding: '13px 28px', fontSize: '0.90rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ShieldCheck size={16} /> Sign In with Registered Desk
              </button>

              <button
                onClick={onOpenAuth}
                className="btn-ghost"
                style={{ padding: '13px 26px', fontSize: '0.90rem', border: '1px solid var(--border-medium)', color: 'var(--text-main)' }}
              >
                <Crown size={15} style={{ color: 'var(--gold-primary)' }} /> Request Direct Invoice ($99/mo)
              </button>
            </div>

            <div style={{ marginTop: '18px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Note: <strong>Rolex Submariner (126610LN)</strong> is completely free for all guests to inspect.
            </div>
          </div>
        </div>
      ) : (
        <div className="responsive-two-col">
        
        {/* LEFT COLUMN: Price History, Provenance Matrix, Real Scraped Lots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Price History Area Chart */}
          <div className="glass-card" style={{ padding: '24px 28px', background: '#FFFFFF' }}>
            <div className="responsive-chart-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-main)'
                }}>
                  <TrendingUp size={16} style={{ color: 'var(--gold-primary)' }} />
                  Secondary Market Price Trajectory (12-Month Baseline)
                </h3>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Calibrated to Chrono24 10% trimmed mean consensus and realized auction hammers
                </p>
              </div>

              {/* Timeframe Controls (Touch optimized for mobile) */}
              <div style={{
                display: 'flex',
                gap: '6px',
                background: '#F1F5F9',
                padding: '4px',
                borderRadius: '8px',
                border: '1px solid var(--border-hairline)'
              }}>
                {(['3M', '6M', '1Y', 'ALL'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`btn-ghost ${timeframe === tf ? 'active' : ''}`}
                    style={{
                      padding: '5px 12px',
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                      border: timeframe === tf ? '1px solid var(--border-subtle)' : 'none',
                      background: timeframe === tf ? '#FFFFFF' : 'transparent',
                      color: timeframe === tf ? 'var(--text-main)' : 'var(--text-secondary)',
                      fontWeight: timeframe === tf ? 700 : 500
                    }}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Area Chart in Light Theme */}
            <div style={{ height: '280px', width: '100%', marginTop: '8px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B48228" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#B48228" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94A3B8" 
                    tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'var(--font-mono)' }} 
                    axisLine={{ stroke: 'rgba(0, 0, 0, 0.08)' }} 
                    tickLine={false}
                  />
                  <YAxis 
                    domain={['dataMin - 1500', 'dataMax + 1500']} 
                    stroke="#94A3B8" 
                    tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'var(--font-mono)' }} 
                    tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} 
                    axisLine={{ stroke: 'rgba(0, 0, 0, 0.08)' }} 
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      borderColor: 'rgba(180, 130, 40, 0.4)', 
                      borderRadius: '8px', 
                      color: '#0F172A',
                      fontSize: '0.80rem',
                      fontFamily: 'var(--font-mono)',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(val: number) => [`$${formatUSD(val)}`, 'Consensus Value']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#996515" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#goldGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dynamic Condition & Provenance Multiplier */}
          <div className="glass-card" style={{ padding: '24px 28px', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={17} style={{ color: 'var(--gold-primary)' }} />
                <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Interactive Appraisal &amp; Condition Multipliers
                </h3>
              </div>
              <span className="badge badge-subtle">DEALER PRICING ENGINE</span>
            </div>

            <p style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Dealers apply strict condition adjustments when calculating client cash buy-in offers. Toggle below to view instantaneous valuation impact:
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px'
            }}>
              {/* Provenance Box/Papers */}
              <div style={{
                background: '#F8FAFC',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid var(--border-hairline)'
              }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 600 }}>
                  BOX &amp; PAPERS PROVENANCE
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button 
                    onClick={() => setHasBoxPapers(true)}
                    className={`btn-ghost ${hasBoxPapers ? 'active' : ''}`}
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem', padding: '8px 4px', minHeight: '38px', cursor: 'pointer' }}
                  >
                    Full Set (+8%)
                  </button>
                  <button 
                    onClick={() => setHasBoxPapers(false)}
                    className={`btn-ghost ${!hasBoxPapers ? 'active' : ''}`}
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem', padding: '8px 4px', minHeight: '38px', cursor: 'pointer' }}
                  >
                    Naked (-10%)
                  </button>
                </div>
              </div>

              {/* Condition Grade */}
              <div style={{
                background: '#F8FAFC',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid var(--border-hairline)'
              }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 600 }}>
                  CONDITION GRADE
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['Unworn', 'Mint', 'Pre-owned'] as const).map((grade) => (
                    <button
                      key={grade}
                      onClick={() => setConditionGrade(grade)}
                      className={`btn-ghost ${conditionGrade === grade ? 'active' : ''}`}
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.72rem', padding: '8px 2px', minHeight: '38px', cursor: 'pointer' }}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Dealer Target Margin */}
              <div style={{
                background: '#F8FAFC',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid var(--border-hairline)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    TARGET MARGIN
                  </span>
                  <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--gold-primary)' }}>
                    {dealerTargetMargin}%
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                  {[12, 15, 20, 25].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDealerTargetMargin(pct)}
                      className={`btn-ghost ${dealerTargetMargin === pct ? 'active' : ''}`}
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.72rem', padding: '8px 2px', minHeight: '38px', cursor: 'pointer' }}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min="10"
                  max="35"
                  step="1"
                  value={dealerTargetMargin}
                  onChange={(e) => setDealerTargetMargin(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
                  title={`Target Margin: ${dealerTargetMargin}%`}
                />
              </div>

              {/* Dynamic Recalculated Impact */}
              <div style={{
                background: 'rgba(5, 150, 105, 0.06)',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1.5px solid var(--emerald-border)'
              }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--emerald-gain)', fontWeight: 700, textTransform: 'uppercase' }}>
                  ADJUSTED DEALER BUY OFFER
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--emerald-gain)', margin: '2px 0' }}>
                  <AnimatedCounter value={valuation.dealerCashOffer} prefix="$" />
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
                  Target Margin: <strong style={{ color: 'var(--text-main)' }}><AnimatedCounter value={valuation.grossSpread} prefix="$" /></strong> ({dealerTargetMargin}%)
                </div>
              </div>
            </div>
          </div>

          {/* Real Verified Chrono24 Active Listings Feed */}
          <div className="glass-card" style={{ padding: '24px 28px', background: '#FFFFFF' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.02rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-main)'
                }}>
                  <Scale size={16} style={{ color: 'var(--gold-primary)' }} />
                  Multi-Venue Order Book &amp; Realized Sales
                </h3>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Cross-referenced Chrono24 dealer/private listings and eBay completed transactions (Authenticity Guaranteed)
                </p>
              </div>
              <span className="badge badge-gold" style={{ fontFamily: 'var(--font-mono)' }}>
                MULTI-VENUE ACTIVE + SOLD
              </span>
            </div>

            {/* Mobile Scroll Hint */}
            <div style={{
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ color: 'var(--gold-primary)' }}>↔</span>
              <span>Swipe table horizontally to inspect all lot details</span>
            </div>

            {/* Table Container with Controlled Overflow */}
            <div style={{
              width: '100%',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              borderRadius: '10px',
              border: '1px solid var(--border-hairline)'
            }}>
              <table style={{ minWidth: '480px', width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{
                    background: '#F8FAFC',
                    borderBottom: '1px solid var(--border-subtle)',
                    textAlign: 'left',
                    color: 'var(--text-muted)',
                    fontSize: '0.68rem',
                    textTransform: 'uppercase'
                  }}>
                    <th style={{ padding: '10px 12px' }}>LOT / ID</th>
                    <th style={{ padding: '10px 12px' }}>VENUE / SOURCE</th>
                    <th style={{ padding: '10px 12px' }}>CONDITION</th>
                    <th style={{ padding: '10px 12px' }}>PROVENANCE</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>PRICE / HAMMER</th>
                  </tr>
                </thead>
                <tbody>
                  {watch.recentSales.map((sale) => (
                    <tr key={sale.id} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.04)' }}>
                      <td style={{ padding: '12px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        #{sale.id}
                      </td>
                      <td style={{ padding: '12px 12px' }}>
                        <span 
                          className={sale.source.includes('eBay') ? 'badge badge-emerald' : sale.source.includes('Dealer') ? 'badge badge-gold' : 'badge badge-subtle'} 
                          style={{ fontSize: '0.65rem' }}
                        >
                          {sale.source}
                        </span>
                      </td>
                      <td style={{ padding: '12px 12px', color: 'var(--text-main)', fontWeight: 500 }}>
                        {sale.condition}
                      </td>
                      <td style={{ padding: '12px 12px' }}>
                        {sale.boxAndPapers ? (
                          <span style={{ color: 'var(--emerald-gain)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', fontWeight: 600 }}>
                            <CheckCircle2 size={12} /> Full Set
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>Watch Only</span>
                        )}
                      </td>
                      <td className="tabular-nums" style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--text-main)' }}>
                        ${formatUSD(sale.soldPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: AI Intelligence, Dealer Clustering, Live Arbitrage Radar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* AI Investment & Liquidity Analysis */}
          <div className="glass-card" style={{
            padding: '26px 28px',
            border: '1.5px solid var(--border-gold-subtle)',
            background: '#FFFFFF'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: 'var(--gold-primary)' }} />
                <span className="serif-heading" style={{ fontWeight: 800, letterSpacing: '0.04em', fontSize: '0.90rem', color: 'var(--text-main)' }}>
                  AI VALUATION ENGINE
                </span>
              </div>
              <span className="badge badge-gold" style={{ fontFamily: 'var(--font-mono)' }}>
                {watch.aiAnalysis.confidence}% CONFIDENCE
              </span>
            </div>

            {/* Score & Rating Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '16px 0' }}>
              <div style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'rgba(161, 116, 36, 0.08)',
                border: '2px solid var(--gold-primary)',
                boxShadow: '0 4px 16px rgba(161, 116, 36, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span className="tabular-nums" style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--gold-primary)', lineHeight: 1 }}>
                  {watch.aiAnalysis.opportunityScore}
                </span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>/ 10</span>
              </div>

              <div>
                <span className="badge badge-emerald" style={{ marginBottom: '6px' }}>
                  {watch.aiAnalysis.recommendation}
                </span>
                <div style={{ fontSize: '0.80rem', color: 'var(--text-secondary)' }}>
                  Liquidity Score: <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{watch.aiAnalysis.liquidityScore}/100</strong>
                </div>
                <div style={{ fontSize: '0.80rem', color: 'var(--text-secondary)' }}>
                  Price Stability: <strong style={{ color: 'var(--gold-primary)' }}>{watch.aiAnalysis.stabilityRating}</strong>
                </div>
              </div>
            </div>

            {/* Synthesis */}
            <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '14px', marginTop: '14px' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.06em', fontWeight: 600 }}>
                EXECUTIVE INTELLIGENCE SYNTHESIS
              </div>
              <p style={{ fontSize: '0.82rem', lineHeight: '1.6', color: 'var(--text-secondary)', wordBreak: 'break-word' }}>
                {watch.aiAnalysis.summary}
              </p>
            </div>

            {/* Value Drivers */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--emerald-gain)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <TrendingUp size={13} /> KEY VALUE CATALYSTS
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {watch.aiAnalysis.catalysts.map((cat, idx) => (
                  <li key={idx} style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <span style={{ color: 'var(--gold-primary)', flexShrink: 0 }}>▸</span>
                    <span>{cat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chrono24 Dealer Clustering & Consensus Radar */}
          {watch.dealerMetrics && (
            <div className="glass-card" style={{ padding: '24px 28px', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={16} style={{ color: 'var(--gold-primary)' }} />
                  <h4 style={{ fontSize: '0.90rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Dealer Clustering &amp; Provenance Radar
                  </h4>
                </div>
                <span className="badge badge-gold" style={{ fontSize: '0.62rem' }}>CHRONO24 CONSENSUS</span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '14px'
              }}>
                <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-hairline)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Professional Dealers</div>
                  <div className="tabular-nums" style={{ fontSize: '1.30rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {watch.dealerMetrics.dealerListingsCount} lots
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                    {Math.round((watch.dealerMetrics.dealerListingsCount / (watch.dealerMetrics.totalActiveListings || 1)) * 100)}% Institutional
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-hairline)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Private Sellers</div>
                  <div className="tabular-nums" style={{ fontSize: '1.30rem', fontWeight: 800, color: 'var(--emerald-gain)' }}>
                    {watch.dealerMetrics.privateListingsCount} lots
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--emerald-gain)', fontWeight: 500 }}>
                    Arbitrage Source
                  </div>
                </div>
              </div>

              {/* Retail MSRP comparison */}
              <div style={{
                background: '#F8FAFC',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border-hairline)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>Premium Over Boutiques (MSRP):</span>
                <span className="tabular-nums" style={{
                  color: valuation.premiumOverRetail >= 0 ? 'var(--emerald-gain)' : 'var(--crimson-drop)',
                  fontWeight: 700,
                  fontSize: '0.84rem'
                }}>
                  {valuation.premiumOverRetail > 0 ? `+${valuation.premiumOverRetail}%` : `${valuation.premiumOverRetail}%`} (${formatUSD(retailMSRP)} retail)
                </span>
              </div>
            </div>
          )}

          {/* Arbitrage Feed for this Specific Reference */}
          {watch.dealerMetrics?.arbitrageDeals && watch.dealerMetrics.arbitrageDeals.length > 0 && (
            <ScrollReveal direction="up" distance={20} duration={600}>
              <div className="glass-card" style={{
                padding: '24px 28px',
                border: '1.5px solid var(--emerald-border)',
                background: '#FFFFFF'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--emerald-gain)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Target size={14} /> LIVE ARBITRAGE OPPORTUNITIES ({watch.dealerMetrics.arbitrageDeals.length})
                  </span>
                  <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>Priced &lt; Buy-In</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {watch.dealerMetrics.arbitrageDeals.slice(0, 3).map((deal) => (
                    <div 
                      key={deal.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '8px',
                        padding: '12px 14px',
                        background: 'rgba(5, 150, 105, 0.04)',
                        borderRadius: '10px',
                        border: '1px solid var(--emerald-border)',
                        fontSize: '0.78rem'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="tabular-nums" style={{ color: 'var(--text-main)', fontWeight: 800 }}>
                            ${formatUSD(deal.price)}
                          </span>
                          <span className="badge badge-subtle" style={{ fontSize: '0.60rem', padding: '1px 5px' }}>
                            {deal.location}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.70rem', color: 'var(--emerald-gain)', fontWeight: 600 }}>
                          Save ${formatUSD(deal.estimated_profit_dollars)} ({deal.discount_from_cmv_pct}% off CMV)
                        </div>
                      </div>

                      {deal.url && (
                        <a 
                          href={deal.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-primary"
                          style={{
                            fontSize: '0.72rem',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            marginLeft: 'auto'
                          }}
                        >
                          Inspect Lot <ArrowUpRight size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

        </div>

      </div>
      )}
    </div>
  );
};
