'use client';
import React, { useState } from 'react';
import { WatchModel } from '../types/watch';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  DollarSign, 
  Layers, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Sliders,
  Scale
} from 'lucide-react';

interface WatchDetailViewProps {
  watch: WatchModel;
  onBack?: () => void;
}

export const WatchDetailView: React.FC<WatchDetailViewProps> = ({ watch }) => {
  const [timeframe, setTimeframe] = useState<'30D' | '90D' | '1Y' | 'ALL'>('1Y');
  
  // Interactive valuation calculator toggles
  const [hasBoxPapers, setHasBoxPapers] = useState<boolean>(true);
  const [conditionGrade, setConditionGrade] = useState<'Unworn' | 'Mint' | 'Pre-owned'>('Mint');
  const [selectedYear, setSelectedYear] = useState<number>(2023);

  // Dynamic Valuation adjustment
  const calculateAdjustedValue = () => {
    let multiplier = 1.0;
    if (hasBoxPapers) multiplier += 0.12;
    else multiplier -= 0.08;

    if (conditionGrade === 'Unworn') multiplier += 0.08;
    else if (conditionGrade === 'Pre-owned') multiplier -= 0.08;

    return Math.round(watch.aiAnalysis.fairMarketValue * (multiplier / 1.12)); // normalize against baseline
  };

  const adjustedValue = calculateAdjustedValue();
  const adjustedSpread = Math.round(watch.currentAskingAvg - adjustedValue);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header Card */}
      <div className="glass-card" style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-subtle">{watch.brand}</span>
              <span className="badge badge-gold">REF: {watch.reference}</span>
              <span className="badge badge-subtle">{watch.category}</span>
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              {watch.brand} {watch.model}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Case: <strong style={{ color: 'var(--text-main)' }}>{watch.caseSize}</strong> • Material: <strong style={{ color: 'var(--text-main)' }}>{watch.material}</strong> • Dial: <strong style={{ color: 'var(--text-main)' }}>{watch.dialColor}</strong>
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Fair Market Value
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                ${adjustedValue.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: watch.thirtyDayChangePct >= 0 ? 'var(--emerald-gain)' : 'var(--crimson-drop)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                {watch.thirtyDayChangePct >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {watch.thirtyDayChangePct >= 0 ? `+${watch.thirtyDayChangePct}%` : `${watch.thirtyDayChangePct}%`} (30D)
              </div>
            </div>

            <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '24px', textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Dealer Avg Asking
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                ${watch.currentAskingAvg.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Spread: <strong style={{ color: 'var(--text-gold)' }}>+${adjustedSpread.toLocaleString()}</strong> ({((adjustedSpread / adjustedValue) * 100).toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Chart + Right AI Valuation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.25fr)', gap: '24px' }}>
        
        {/* Left Column: Price History Chart & Calculator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Interactive Chart Container */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} style={{ color: 'var(--gold-primary)' }} />
                  Historical Sales Timeline vs Market Baseline
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Aggregated completed sales across auctions, verified dealers, and private trades
                </p>
              </div>

              {/* Timeframe selector */}
              <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                {(['30D', '90D', '1Y', 'ALL'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`btn-ghost ${timeframe === tf ? 'active' : ''}`}
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div style={{ height: '320px', width: '100%', marginTop: '10px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={watch.priceHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="#475569" 
                    tick={{ fill: '#64748B', fontSize: 12 }} 
                    axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }} 
                  />
                  <YAxis 
                    domain={['dataMin - 1000', 'dataMax + 1000']} 
                    stroke="#475569" 
                    tick={{ fill: '#64748B', fontSize: 12 }} 
                    tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} 
                    axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0F141F', 
                      borderColor: 'rgba(212, 175, 55, 0.4)', 
                      borderRadius: '10px', 
                      color: '#FFF',
                      fontSize: '0.85rem'
                    }}
                    formatter={(val: number) => [`$${val.toLocaleString()}`, 'Realized Price']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#D4AF37" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#goldGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Provenance & Condition Matrix Calculator */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sliders size={18} style={{ color: 'var(--gold-primary)' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                Dynamic Provenance & Condition Multipliers
              </h3>
            </div>
            
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Dealers price watches using strict condition and provenance variables. Adjust the toggles below to see instant fair-value impact:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {/* Box & Papers Toggle */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>BOX & PAPERS PROVENANCE</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => setHasBoxPapers(true)}
                    className={`btn-ghost ${hasBoxPapers ? 'active' : ''}`}
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}
                  >
                    Full Set (+12%)
                  </button>
                  <button 
                    onClick={() => setHasBoxPapers(false)}
                    className={`btn-ghost ${!hasBoxPapers ? 'active' : ''}`}
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}
                  >
                    Naked Watch (-8%)
                  </button>
                </div>
              </div>

              {/* Condition Grade */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>CONDITION GRADE</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['Unworn', 'Mint', 'Pre-owned'] as const).map((grade) => (
                    <button
                      key={grade}
                      onClick={() => setConditionGrade(grade)}
                      className={`btn-ghost ${conditionGrade === grade ? 'active' : ''}`}
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem', padding: '6px 4px' }}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Realized Adjusted Impact */}
              <div style={{ background: 'rgba(212, 175, 55, 0.06)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-gold)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-gold)', fontWeight: 600, marginBottom: '4px' }}>
                  CALCULATED FAIR VALUE
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFF' }}>
                  ${adjustedValue.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {hasBoxPapers ? 'Includes Original Warranty & Box' : 'Watch only (unverified papers)'}
                </div>
              </div>
            </div>
          </div>

          {/* Cross-Market Realized Sales Table */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Scale size={18} style={{ color: 'var(--gold-primary)' }} />
                  Cross-Market Realized Sales History
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Public auction hammer prices and verified dealer transaction feeds
                </p>
              </div>
              <span className="badge badge-emerald">VERIFIED LOTS ONLY</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 12px' }}>VENUE / SOURCE</th>
                    <th style={{ padding: '10px 12px' }}>SOLD DATE</th>
                    <th style={{ padding: '10px 12px' }}>CONDITION</th>
                    <th style={{ padding: '10px 12px' }}>PROVENANCE</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>HAMMER / SOLD</th>
                  </tr>
                </thead>
                <tbody>
                  {watch.recentSales.map((sale) => (
                    <tr key={sale.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '14px 12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold-primary)' }}></span>
                        {sale.source}
                      </td>
                      <td style={{ padding: '14px 12px', color: 'var(--text-secondary)' }}>{sale.date}</td>
                      <td style={{ padding: '14px 12px' }}>
                        <span className="badge badge-subtle" style={{ fontSize: '0.7rem' }}>{sale.condition}</span>
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        {sale.boxAndPapers ? (
                          <span style={{ color: 'var(--emerald-gain)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
                            <CheckCircle2 size={13} /> Box & Papers
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Watch Only</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--gold-light)' }}>
                        ${sale.soldPrice.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: AI Investment Intelligence Engine */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Main AI Score Card */}
          <div className="glass-card" style={{ padding: '26px', border: '1px solid var(--border-gold)', background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.08) 0%, rgba(15, 20, 31, 0.9) 100%)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} style={{ color: 'var(--gold-primary)' }} />
                <span style={{ fontWeight: 700, letterSpacing: '0.04em', fontSize: '0.85rem' }}>AI INVESTMENT ENGINE</span>
              </div>
              <span className="badge badge-gold">{watch.aiAnalysis.confidence}% CONFIDENCE</span>
            </div>

            {/* Circular Opportunity Rating Display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '20px 0' }}>
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, rgba(7, 9, 14, 0.95) 75%)',
                border: '3px solid var(--gold-primary)',
                boxShadow: '0 0 25px rgba(212, 175, 55, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF', lineHeight: 1 }}>
                  {watch.aiAnalysis.opportunityScore}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--gold-light)', letterSpacing: '0.05em' }}>/ 10</span>
              </div>

              <div>
                <span className="badge badge-emerald" style={{ marginBottom: '6px' }}>
                  {watch.aiAnalysis.recommendation}
                </span>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Liquidity Score: <strong style={{ color: 'var(--text-main)' }}>{watch.aiAnalysis.liquidityScore}/100</strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Price Stability: <strong style={{ color: 'var(--text-gold)' }}>{watch.aiAnalysis.stabilityRating}</strong>
                </div>
              </div>
            </div>

            {/* AI Summary Breakdown */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '16px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                EXECUTIVE INTELLIGENCE SYNTHESIS
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: '1.55', color: 'var(--text-main)' }}>
                {watch.aiAnalysis.summary}
              </p>
            </div>

            {/* Catalysts */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--emerald-gain)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <TrendingUp size={14} /> VALUE DRIVERS & CATALYSTS
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {watch.aiAnalysis.catalysts.map((cat, idx) => (
                  <li key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: 'var(--gold-primary)', marginTop: '2px' }}>▸</span>
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Factors */}
            <div style={{ marginTop: '18px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--crimson-drop)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <AlertCircle size={14} /> RISK & VOLATILITY FACTORS
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {watch.aiAnalysis.riskFactors.map((risk, idx) => (
                  <li key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: 'var(--crimson-drop)', marginTop: '2px' }}>▸</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Action Button */}
            <div style={{ marginTop: '24px' }}>
              <button className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}>
                Set Arbitrage Price Alert (&lt; ${Math.round(watch.recentSoldAvg * 0.96).toLocaleString()})
              </button>
            </div>
          </div>

          {/* MSRP vs Secondary Premium Card */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.05em' }}>
              MSRP Retail Benchmark vs Secondary Spread
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Official Boutiques (MSRP):</span>
              <strong style={{ color: 'var(--text-main)' }}>${watch.aiAnalysis.retailMSRP.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fair Market Secondary:</span>
              <strong style={{ color: 'var(--gold-light)' }}>${adjustedValue.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-gold)', fontWeight: 600 }}>Market Premium Over MSRP:</span>
              <span className="badge badge-gold">
                +{(((adjustedValue - watch.aiAnalysis.retailMSRP) / watch.aiAnalysis.retailMSRP) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
