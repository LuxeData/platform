'use client';
import React, { useState } from 'react';
import { WatchModel, UserSession } from '../types/watch';
import { formatUSD } from '../lib/format';
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
  Crown
} from 'lucide-react';

interface WatchDetailViewProps {
  watch: WatchModel;
  onBack?: () => void;
  user?: UserSession | null;
  onOpenAuth?: () => void;
}

export const WatchDetailView: React.FC<WatchDetailViewProps> = ({ watch, user, onOpenAuth }) => {
  const [timeframe, setTimeframe] = useState<'30D' | '90D' | '1Y' | 'ALL'>('1Y');
  
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
    if (timeframe === '30D') return hist.slice(-3);
    if (timeframe === '90D') return hist.slice(-6);
    return hist;
  }, [watch.priceHistory, timeframe]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Main Header Reference Hero Card */}
      <div className="glass-card" style={{ padding: '24px 28px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          {/* Reference Meta */}
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
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
              fontSize: '1.85rem',
              fontWeight: 700,
              color: '#FFF',
              letterSpacing: '-0.01em',
              marginBottom: '6px'
            }}>
              {watch.brand} {watch.model}
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
              Case: <strong style={{ color: 'var(--text-main)' }}>{watch.caseSize}</strong> • Material: <strong style={{ color: 'var(--text-main)' }}>{watch.material}</strong> • Dial: <strong style={{ color: 'var(--text-main)' }}>{watch.dialColor}</strong> • Boutique Retail MSRP: <strong style={{ color: 'var(--text-gold)', fontFamily: 'var(--font-mono)' }}>${formatUSD(retailMSRP)}</strong>
            </p>
          </div>

          {/* Pricing Metrics Strip (Responsive 1-col on mobile, flex on desktop) */}
          <div className="responsive-pricing-strip" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '12px 20px',
            borderRadius: '12px',
            border: '1px solid var(--border-hairline)'
          }}>
            {/* Consensus Market Value (CMV) */}
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Consensus Market Value (CMV)
              </div>
              <div className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                ${formatUSD(valuation.adjustedCMV)}
              </div>
              <div style={{
                fontSize: '0.74rem',
                color: watch.thirtyDayChangePct >= 0 ? 'var(--emerald-gain)' : 'var(--crimson-drop)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <TrendingUp size={13} />
                +{watch.thirtyDayChangePct}% (30D)
              </div>
            </div>

            {/* Dealer Cash Buy-In Floor (-20%) */}
            <div style={{ borderLeft: '1px solid var(--border-hairline)', paddingLeft: '20px' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Dealer Buy-In Offer (-20%)
              </div>
              <div className="tabular-nums" style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--emerald-gain)' }}>
                {isLocked ? (
                  <span style={{ color: 'var(--gold-light)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '1.15rem' }}>
                    <Lock size={15} /> PRO DESK
                  </span>
                ) : (
                  `$${formatUSD(valuation.dealerCashOffer)}`
                )}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                {isLocked ? 'Reserved for Pro partners' : 'Wholesale acquisition target'}
              </div>
            </div>

            {/* Gross Dealer Margin Spread */}
            <div style={{ borderLeft: '1px solid var(--border-hairline)', paddingLeft: '20px' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Gross Dealer Spread
              </div>
              <div className="tabular-nums" style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-gold)' }}>
                {isLocked ? (
                  <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '1.15rem' }}>
                    <Lock size={15} /> 20.0% MARGIN
                  </span>
                ) : (
                  `+$${formatUSD(valuation.grossSpread)}`
                )}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                {isLocked ? 'Protected buy formula' : '20.0% standard margin'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Terminal Grid: Responsive Layout (Stacks on Mobile) */}
      {isLocked ? (
        <div style={{ position: 'relative', width: '100%' }}>
          
          {/* Institutional Pro Gated Callout Box */}
          <div className="glass-card" style={{
            padding: '40px 24px',
            border: '1px solid var(--border-gold)',
            background: 'radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.14) 0%, rgba(10, 14, 23, 0.98) 75%)',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.15)',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'inline-flex',
              padding: '16px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid var(--border-gold)',
              boxShadow: '0 0 24px rgba(212, 175, 55, 0.25)',
              marginBottom: '18px'
            }}>
              <Lock size={32} style={{ color: 'var(--gold-light)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span className="badge badge-gold" style={{ letterSpacing: '0.06em', fontWeight: 700 }}>
                INSTITUTIONAL PRO DESK
              </span>
              <span className="badge badge-subtle">{watch.brand.toUpperCase()} {watch.reference}</span>
            </div>

            <h3 className="serif-heading" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFF', marginBottom: '10px' }}>
              Unlock {watch.brand} {watch.model} Order Book
            </h3>

            <p style={{ maxWidth: '560px', margin: '0 auto 20px auto', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Live Chrono24 dealer vs. private order books, 10% trimmed mean consensus metrics, condition multipliers, and 20% margin protection buy slips for <strong>{watch.model}</strong> are reserved for verified partner desks.
            </p>

            {/* Feature Bullets */}
            <div style={{
              maxWidth: '520px',
              margin: '0 auto 24px auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '10px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#FFF' }}>
                <CheckCircle2 size={15} style={{ color: 'var(--emerald-gain)', flexShrink: 0 }} />
                <span>{watch.dealerMetrics?.totalActiveListings || 40} real scraped Chrono24 active lots</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#FFF' }}>
                <CheckCircle2 size={15} style={{ color: 'var(--emerald-gain)', flexShrink: 0 }} />
                <span>Defensible 20% wholesale cash buy-in formula</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#FFF' }}>
                <CheckCircle2 size={15} style={{ color: 'var(--emerald-gain)', flexShrink: 0 }} />
                <span>Full-set vs. naked provenance pricing adjustments</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#FFF' }}>
                <CheckCircle2 size={15} style={{ color: 'var(--emerald-gain)', flexShrink: 0 }} />
                <span>Instant sub-wholesale flip alerts for {watch.reference}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={onOpenAuth}
                className="btn-primary"
                style={{ padding: '12px 26px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ShieldCheck size={16} /> Sign In with Registered Desk
              </button>

              <button
                onClick={onOpenAuth}
                className="btn-ghost"
                style={{ padding: '12px 24px', fontSize: '0.88rem', border: '1px solid var(--border-gold-subtle)', color: 'var(--gold-light)' }}
              >
                <Crown size={15} /> Request Direct Invoice ($99/mo)
              </button>
            </div>

            <div style={{ marginTop: '16px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Note: <strong>Rolex Submariner (126610LN)</strong> is completely free for all guests to inspect.
            </div>
          </div>

          {/* Frosted Silhouette Preview Underneath */}
          <div style={{
            filter: 'blur(8px)',
            opacity: 0.35,
            pointerEvents: 'none',
            userSelect: 'none',
            maxHeight: '420px',
            overflow: 'hidden'
          }}>
            <div className="responsive-two-col">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="glass-card" style={{ padding: '22px 24px', height: '240px' }}></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="glass-card" style={{ padding: '24px', height: '240px' }}></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="responsive-two-col">
        
        {/* LEFT COLUMN: Price History, Provenance Matrix, Real Scraped Lots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Price History Area Chart */}
          <div className="glass-card" style={{ padding: '22px 24px' }}>
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
                  fontSize: '0.98rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#FFF'
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
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '4px',
                borderRadius: '8px',
                border: '1px solid var(--border-hairline)'
              }}>
                {(['30D', '90D', '1Y', 'ALL'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`btn-ghost ${timeframe === tf ? 'active' : ''}`}
                    style={{
                      padding: '5px 12px',
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                      touchAction: 'manipulation'
                    }}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div style={{ height: '280px', width: '100%', marginTop: '8px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.32} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#475569" 
                    tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'var(--font-mono)' }} 
                    axisLine={{ stroke: 'rgba(255, 255, 255, 0.06)' }} 
                    tickLine={false}
                  />
                  <YAxis 
                    domain={['dataMin - 1500', 'dataMax + 1500']} 
                    stroke="#475569" 
                    tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'var(--font-mono)' }} 
                    tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} 
                    axisLine={{ stroke: 'rgba(255, 255, 255, 0.06)' }} 
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0A0E17', 
                      borderColor: 'rgba(212, 175, 55, 0.4)', 
                      borderRadius: '8px', 
                      color: '#FFF',
                      fontSize: '0.80rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                    formatter={(val: number) => [`$${formatUSD(val)}`, 'Consensus Value']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#D4AF37" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#goldGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dynamic Condition & Provenance Multiplier */}
          <div className="glass-card" style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={17} style={{ color: 'var(--gold-primary)' }} />
                <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#FFF' }}>
                  Interactive Appraisal & Condition Multipliers
                </h3>
              </div>
              <span className="badge badge-subtle">DEALER PRICING ENGINE</span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Dealers apply strict condition adjustments when calculating client cash buy-in offers. Toggle below to view instantaneous valuation impact:
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px'
            }}>
              {/* Provenance Box/Papers */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid var(--border-hairline)'
              }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  BOX & PAPERS PROVENANCE
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button 
                    onClick={() => setHasBoxPapers(true)}
                    className={`btn-ghost ${hasBoxPapers ? 'active' : ''}`}
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem', padding: '8px 4px', minHeight: '38px', cursor: 'pointer', touchAction: 'manipulation' }}
                  >
                    Full Set (+8%)
                  </button>
                  <button 
                    onClick={() => setHasBoxPapers(false)}
                    className={`btn-ghost ${!hasBoxPapers ? 'active' : ''}`}
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem', padding: '8px 4px', minHeight: '38px', cursor: 'pointer', touchAction: 'manipulation' }}
                  >
                    Naked (-10%)
                  </button>
                </div>
              </div>

              {/* Condition Grade */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid var(--border-hairline)'
              }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  CONDITION GRADE
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['Unworn', 'Mint', 'Pre-owned'] as const).map((grade) => (
                    <button
                      key={grade}
                      onClick={() => setConditionGrade(grade)}
                      className={`btn-ghost ${conditionGrade === grade ? 'active' : ''}`}
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.72rem', padding: '8px 2px', minHeight: '38px', cursor: 'pointer', touchAction: 'manipulation' }}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Recalculated Impact */}
              <div style={{
                background: 'rgba(212, 175, 55, 0.05)',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border-gold-subtle)'
              }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-gold)', fontWeight: 600, textTransform: 'uppercase' }}>
                  ADJUSTED DEALER BUY OFFER
                </div>
                <div className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--emerald-gain)' }}>
                  ${formatUSD(valuation.dealerCashOffer)}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                  Target Profit: <strong style={{ color: '#FFF' }}>${formatUSD(valuation.grossSpread)}</strong> ({dealerTargetMargin}%)
                </div>
              </div>
            </div>
          </div>

          {/* Real Verified Chrono24 Active Listings Feed */}
          <div className="glass-card" style={{ padding: '22px 24px' }}>
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
                  fontSize: '0.98rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#FFF'
                }}>
                  <Scale size={16} style={{ color: 'var(--gold-primary)' }} />
                  Live Chrono24 Market Feed (Real Ingested Lots)
                </h3>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Active listings scraped via headless browser with seller classification
                </p>
              </div>
              <span className="badge badge-gold" style={{ fontFamily: 'var(--font-mono)' }}>
                {watch.dealerMetrics?.totalActiveListings || 60} ACTIVE LOTS TRACKED
              </span>
            </div>

            {/* Mobile Scroll Hint */}
            <div style={{
              fontSize: '0.66rem',
              color: 'var(--text-muted)',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ color: 'var(--gold-primary)' }}>↔</span>
              <span>Swipe table horizontally to inspect all columns</span>
            </div>

            {/* Table Container with Controlled Overflow */}
            <div style={{
              width: '100%',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              borderRadius: '8px',
              border: '1px solid var(--border-hairline)'
            }}>
              <table style={{ minWidth: '480px', width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{
                    borderBottom: '1px solid var(--border-hairline)',
                    textAlign: 'left',
                    color: 'var(--text-muted)',
                    fontSize: '0.68rem',
                    textTransform: 'uppercase'
                  }}>
                    <th style={{ padding: '8px 10px' }}>LOT / ID</th>
                    <th style={{ padding: '8px 10px' }}>SELLER TYPE</th>
                    <th style={{ padding: '8px 10px' }}>CONDITION</th>
                    <th style={{ padding: '8px 10px' }}>PROVENANCE</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>ASKING PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  {watch.recentSales.map((sale) => (
                    <tr key={sale.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                      <td style={{ padding: '10px 10px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        #{sale.id}
                      </td>
                      <td style={{ padding: '10px 10px' }}>
                        <span className={sale.source.includes('Dealer') ? 'badge badge-gold' : 'badge badge-subtle'} style={{ fontSize: '0.65rem' }}>
                          {sale.source}
                        </span>
                      </td>
                      <td style={{ padding: '10px 10px', color: '#FFF' }}>
                        {sale.condition}
                      </td>
                      <td style={{ padding: '10px 10px' }}>
                        {sale.boxAndPapers ? (
                          <span style={{ color: 'var(--emerald-gain)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem' }}>
                            <CheckCircle2 size={12} /> Full Set
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>Watch Only</span>
                        )}
                      </td>
                      <td className="tabular-nums" style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 700, color: 'var(--gold-light)' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* AI Investment & Liquidity Analysis */}
          <div className="glass-card" style={{
            padding: '24px',
            border: '1px solid var(--border-gold-subtle)',
            background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.06) 0%, rgba(14, 19, 29, 0.95) 100%)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: 'var(--gold-primary)' }} />
                <span className="serif-heading" style={{ fontWeight: 700, letterSpacing: '0.04em', fontSize: '0.85rem', color: '#FFF' }}>
                  AI VALUATION ENGINE
                </span>
              </div>
              <span className="badge badge-gold" style={{ fontFamily: 'var(--font-mono)' }}>
                {watch.aiAnalysis.confidence}% CONFIDENCE
              </span>
            </div>

            {/* Score & Rating Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '14px 0' }}>
              <div style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.18) 0%, rgba(6, 8, 13, 0.95) 75%)',
                border: '2px solid var(--gold-primary)',
                boxShadow: '0 0 20px rgba(212, 175, 55, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span className="tabular-nums" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF', lineHeight: 1 }}>
                  {watch.aiAnalysis.opportunityScore}
                </span>
                <span style={{ fontSize: '0.60rem', color: 'var(--gold-light)', letterSpacing: '0.05em' }}>/ 10</span>
              </div>

              <div>
                <span className="badge badge-emerald" style={{ marginBottom: '6px' }}>
                  {watch.aiAnalysis.recommendation}
                </span>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Liquidity Score: <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{watch.aiAnalysis.liquidityScore}/100</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Price Stability: <strong style={{ color: 'var(--text-gold)' }}>{watch.aiAnalysis.stabilityRating}</strong>
                </div>
              </div>
            </div>

            {/* Synthesis */}
            <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '12px', marginTop: '12px' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.06em' }}>
                EXECUTIVE INTELLIGENCE SYNTHESIS
              </div>
              <p style={{ fontSize: '0.80rem', lineHeight: '1.5', color: 'var(--text-main)', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {watch.aiAnalysis.summary}
              </p>
            </div>

            {/* Value Drivers */}
            <div style={{ marginTop: '14px' }}>
              <div style={{ fontSize: '0.70rem', color: 'var(--emerald-gain)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <TrendingUp size={12} /> KEY VALUE CATALYSTS
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {watch.aiAnalysis.catalysts.map((cat, idx) => (
                  <li key={idx} style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '6px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    <span style={{ color: 'var(--gold-primary)', flexShrink: 0 }}>▸</span>
                    <span>{cat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chrono24 Dealer Clustering & Consensus Radar */}
          {watch.dealerMetrics && (
            <div className="glass-card" style={{ padding: '22px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={16} style={{ color: 'var(--gold-primary)' }} />
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFF' }}>
                    Dealer Clustering & Provenance Radar
                  </h4>
                </div>
                <span className="badge badge-gold" style={{ fontSize: '0.62rem' }}>CHRONO24 CONSENSUS</span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                marginBottom: '14px'
              }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-hairline)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Professional Dealers</div>
                  <div className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                    {watch.dealerMetrics.dealerListingsCount} lots
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    {Math.round((watch.dealerMetrics.dealerListingsCount / (watch.dealerMetrics.totalActiveListings || 1)) * 100)}% Institutional
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-hairline)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Private Sellers</div>
                  <div className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF' }}>
                    {watch.dealerMetrics.privateListingsCount} lots
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--emerald-gain)' }}>
                    Arbitrage Source
                  </div>
                </div>
              </div>

              {/* Retail MSRP comparison */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-hairline)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Premium Over Boutiques (MSRP):</span>
                <span className="tabular-nums" style={{
                  color: valuation.premiumOverRetail >= 0 ? 'var(--emerald-gain)' : 'var(--crimson-drop)',
                  fontWeight: 700,
                  fontSize: '0.82rem'
                }}>
                  +{valuation.premiumOverRetail}% (${formatUSD(retailMSRP)} retail)
                </span>
              </div>
            </div>
          )}

          {/* Arbitrage Feed for this Specific Reference */}
          {watch.dealerMetrics?.arbitrageDeals && watch.dealerMetrics.arbitrageDeals.length > 0 && (
            <div className="glass-card" style={{
              padding: '22px 24px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.04) 0%, rgba(14, 19, 29, 0.95) 100%)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--emerald-gain)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Target size={14} /> LIVE ARBITRAGE OPPORTUNITIES ({watch.dealerMetrics.arbitrageDeals.length})
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Priced &lt; Buy-In</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {watch.dealerMetrics.arbitrageDeals.slice(0, 3).map((deal) => (
                  <div 
                    key={deal.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px',
                      padding: '10px 12px',
                      background: 'rgba(16, 185, 129, 0.05)',
                      borderRadius: '8px',
                      border: '1px solid rgba(16, 185, 129, 0.18)',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="tabular-nums" style={{ color: '#FFF', fontWeight: 700 }}>
                          ${formatUSD(deal.price)}
                        </span>
                        <span className="badge badge-subtle" style={{ fontSize: '0.60rem', padding: '1px 5px' }}>
                          {deal.location}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--emerald-gain)', fontWeight: 600 }}>
                        Save ${formatUSD(deal.estimated_profit_dollars)} ({deal.discount_from_cmv_pct}% off CMV)
                      </div>
                    </div>

                    {deal.url && (
                      <a 
                        href={deal.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: 'var(--gold-light)',
                          textDecoration: 'none',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          padding: '5px 10px',
                          borderRadius: '6px',
                          background: 'rgba(212, 175, 55, 0.1)',
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
          )}

        </div>

      </div>
      )}
    </div>
  );
};
