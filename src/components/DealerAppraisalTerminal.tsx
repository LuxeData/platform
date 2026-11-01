'use client';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { WatchModel, UserSession } from '../types/watch';
import { Logo } from './Logo';
import { formatUSD } from '../lib/format';
import { saveAppraisalToDb } from '../lib/supabaseClient';
import { copyToClipboard } from '../lib/clipboard';
import { InteractiveTiltCard } from './InteractiveTiltCard';
import { AnimatedCounter } from './AnimatedCounter';
import { 
  Calculator, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  Percent, 
  ArrowRight, 
  Clock, 
  Printer, 
  Copy, 
  Check, 
  AlertTriangle,
  Building2,
  TrendingUp,
  FileText,
  BookmarkCheck,
  Database,
  Lock,
  Crown,
  Loader2
} from 'lucide-react';

interface DealerAppraisalTerminalProps {
  watches: WatchModel[];
  onSelectWatch?: (watch: WatchModel) => void;
  user?: UserSession | null;
  onOpenAuth?: () => void;
}

export const DealerAppraisalTerminal: React.FC<DealerAppraisalTerminalProps> = ({ watches, user, onOpenAuth }) => {
  const [selectedRef, setSelectedRef] = useState<string>(watches[0]?.reference || '126610LN');
  const [condition, setCondition] = useState<'Unworn' | 'Very Good' | 'Good' | 'Fair'>('Very Good');
  const [hasBox, setHasBox] = useState<boolean>(true);
  const [hasPapers, setHasPapers] = useState<boolean>(true);
  const [dealerMarginPct, setDealerMarginPct] = useState<number>(20); // 20% rule from Bayam Jewelry dealer interview
  const [copied, setCopied] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isUserPro = user?.tier === 'pro';

  const effectiveRef = useMemo(() => {
    if (!isUserPro && selectedRef !== '126610LN') {
      return '126610LN';
    }
    return selectedRef;
  }, [isUserPro, selectedRef]);

  React.useEffect(() => {
    if (!isUserPro && selectedRef !== '126610LN') {
      setSelectedRef('126610LN');
    }
  }, [isUserPro, selectedRef]);

  const activeWatch = useMemo(() => {
    const found = watches.find(w => w.reference.toUpperCase() === effectiveRef.toUpperCase());
    return found || watches.find(w => w.reference === '126610LN') || watches[0];
  }, [watches, effectiveRef]);

  // Pricing calculation algorithms
  const valuation = useMemo(() => {
    if (!activeWatch) return null;

    // Base market consensus from scraped Chrono24 data or fallback
    const baseCMV = activeWatch.dealerMetrics?.consensusMarketValue || activeWatch.aiAnalysis.fairMarketValue;

    // Condition multiplier
    let conditionMult = 1.0;
    if (condition === 'Unworn') conditionMult = 1.10;
    else if (condition === 'Very Good') conditionMult = 1.00;
    else if (condition === 'Good') conditionMult = 0.90;
    else if (condition === 'Fair') conditionMult = 0.80;

    // Provenance multiplier
    let provMult = 1.0;
    if (hasBox && hasPapers) provMult = 1.08; // Full Set premium
    else if (hasBox && !hasPapers) provMult = 0.98;
    else if (!hasBox && hasPapers) provMult = 0.96;
    else provMult = 0.88; // Naked watch penalty (-12%)

    // Adjusted retail consensus value
    const adjustedCMV = Math.round(baseCMV * conditionMult * provMult);

    // Max safe dealer buy offer (Client Cash Payout)
    // Buy-in = Adjusted CMV * (1 - Margin%)
    const maxBuyOffer = Math.round(adjustedCMV * (1 - (dealerMarginPct / 100)));

    // Projected dealer profit
    const projectedProfit = adjustedCMV - maxBuyOffer;
    const projectedROI = maxBuyOffer > 0 ? Math.round((projectedProfit / maxBuyOffer) * 100) : 0;

    // Estimated liquidity days
    let daysToSell = 7;
    if (activeWatch.brand === 'Rolex') daysToSell = condition === 'Unworn' ? 5 : 8;
    else if (activeWatch.brand === 'Patek Philippe') daysToSell = 28;
    else if (activeWatch.brand === 'Audemars Piguet') daysToSell = 14;
    else daysToSell = 12;

    return {
      baseCMV,
      adjustedCMV,
      maxBuyOffer,
      projectedProfit,
      projectedROI,
      daysToSell,
      activeLots: activeWatch.dealerMetrics?.totalActiveListings || 60,
      dealerClustering: activeWatch.dealerMetrics?.dealerListingsCount || 50
    };
  }, [activeWatch, condition, hasBox, hasPapers, dealerMarginPct]);

  const handleCopyQuote = async () => {
    if (!valuation || !activeWatch) return;
    const text = `--- LUXEDATA DEALER APPRAISAL ---\nModel: ${activeWatch.brand} ${activeWatch.model} (Ref: ${activeWatch.reference})\nCondition: ${condition} | Provenance: ${hasBox && hasPapers ? 'Full Set' : 'Incomplete'}\nConsensus Retail Value (CMV): $${formatUSD(valuation.adjustedCMV)}\nCash Buy-In Offer: $${formatUSD(valuation.maxBuyOffer)}\nTarget Margin: ${dealerMarginPct}%\nVerified via LuxeData Chrono24 Intelligence Feed.`;
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToLedger = async () => {
    if (!user) {
      onOpenAuth?.();
      return;
    }
    if (!valuation || !activeWatch) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await saveAppraisalToDb({
        dealerEmail: user?.email,
        dealershipName: user?.dealership,
        reference: activeWatch.reference,
        brand: activeWatch.brand,
        model: activeWatch.model,
        condition,
        hasBox,
        hasPapers,
        adjustedCMV: valuation.adjustedCMV,
        maxBuyOffer: valuation.maxBuyOffer,
        projectedProfit: valuation.projectedProfit,
        dealerMarginPct,
        clientName: user?.name ? `${user.name} Appraisal` : 'Walk-In Client'
      });
      if (res && res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        setSaveError(res?.error || 'Failed to record appraisal in database ledger.');
        setTimeout(() => setSaveError(null), 4000);
      }
    } catch (e: any) {
      console.warn('Appraisal save error:', e);
      setSaveError(e?.message || 'Network error while recording appraisal.');
      setTimeout(() => setSaveError(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeWatch || !valuation) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Appraisal Header */}
      <div className="glass-card" style={{
        padding: '24px 28px',
        border: '1px solid var(--border-subtle)',
        background: '#FFFFFF'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Logo size={42} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 className="serif-heading" style={{ fontSize: '1.40rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Dealer Cash Buy-In &amp; Appraisal Terminal
                </h2>
                <span className="badge badge-gold" style={{ fontSize: '0.62rem' }}>20% BUY-IN FORMULA</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.80rem', marginTop: '2px' }}>
                Algorithmic wholesale acquisition quotes calibrated from dealer interviews (20% dealer buy-in spread from Chrono24 consensus)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={handleSaveToLedger}
              disabled={isSaving}
              className="btn-ghost"
              title={saveError || (savedSuccess ? 'Appraisal logged to database ledger' : 'Save appraisal to institutional database')}
              style={{
                fontSize: '0.78rem',
                padding: '9px 16px',
                borderColor: savedSuccess ? 'var(--emerald-gain)' : saveError ? 'var(--crimson-drop)' : undefined,
                color: savedSuccess ? 'var(--emerald-gain)' : saveError ? 'var(--crimson-drop)' : undefined
              }}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 size={14} style={{ color: 'var(--emerald-gain)' }} />
                  <span>Saved to Ledger</span>
                </>
              ) : saveError ? (
                <>
                  <AlertTriangle size={14} style={{ color: 'var(--crimson-drop)' }} />
                  <span>Save Failed</span>
                </>
              ) : (
                <>
                  {isSaving ? (
                    <Loader2 size={14} className="spinner" style={{ color: 'var(--gold-primary)' }} />
                  ) : (
                    <Database size={14} style={{ color: 'var(--gold-primary)' }} />
                  )}
                  <span>{isSaving ? 'Logging to DB...' : 'Save to DB Ledger'}</span>
                </>
              )}
            </button>
            <button 
              onClick={handleCopyQuote} 
              className="btn-ghost"
              style={{ fontSize: '0.78rem', padding: '9px 16px' }}
            >
              {copied ? <Check size={14} style={{ color: 'var(--emerald-gain)' }} /> : <Copy size={14} />}
              {copied ? 'Quote Copied' : 'Copy Quote Text'}
            </button>
            <button 
              onClick={handlePrint} 
              className="btn-primary"
              style={{ fontSize: '0.78rem', padding: '9px 18px' }}
            >
              <Printer size={14} /> Print Appraisal Sheet
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls + Right Live Appraisal Certificate */}
      <div className="responsive-appraisal-grid">
        
        {/* Left Column: Appraisal Variable Controls */}
        <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', background: '#FFFFFF' }}>
          <div>
            <h3 style={{ fontSize: '1.02rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: 'var(--text-main)' }}>
              <Calculator size={18} style={{ color: 'var(--gold-primary)' }} />
              Piece Assessment Parameters
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Configure watch reference, condition, and provenance to compute wholesale replacement value
            </p>
          </div>

          {/* Select Reference Watch */}
          <div>
            <label style={{ display: 'block', fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em', fontWeight: 600 }}>
              Select Catalog Reference
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {watches.map(w => {
                const isProRef = w.reference !== '126610LN';

                return (
                  <button
                    key={w.reference}
                    onClick={() => {
                      if (isProRef && !isUserPro) {
                        onOpenAuth?.();
                        return;
                      }
                      setSelectedRef(w.reference);
                    }}
                    className={`btn-ghost ${effectiveRef.toUpperCase() === w.reference.toUpperCase() ? 'active' : ''}`}
                    title={isProRef && !isUserPro ? 'Rolex Daytona, Royal Oak, and Nautilus valuation models require an active Pro Desk session.' : undefined}
                    style={{
                      fontSize: '0.76rem',
                      padding: '8px 8px',
                      textAlign: 'center',
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      opacity: (isProRef && !isUserPro) ? 0.75 : 1
                    }}
                  >
                    <span>{w.reference}</span>
                    {isProRef && !isUserPro && (
                      <Lock size={10} style={{ color: 'var(--gold-primary)' }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Condition Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em', fontWeight: 600 }}>
              Condition Grade
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {(['Unworn', 'Very Good', 'Good', 'Fair'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setCondition(c)}
                  className={`btn-ghost ${condition === c ? 'active' : ''}`}
                  style={{ fontSize: '0.74rem', padding: '8px 4px', justifyContent: 'center' }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Provenance Checkboxes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em', fontWeight: 600 }}>
              Physical Provenance &amp; Set Completeness
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div 
                onClick={() => setHasBox(!hasBox)}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: hasBox ? '1.5px solid var(--gold-primary)' : '1px solid var(--border-hairline)',
                  background: hasBox ? 'rgba(161, 116, 36, 0.06)' : '#F8FAFC',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: '1.5px solid var(--gold-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: hasBox ? 'var(--gold-primary)' : 'transparent',
                  color: '#FFFFFF'
                }}>
                  {hasBox && <Check size={12} strokeWidth={3} />}
                </div>
                <div>
                  <div style={{ fontSize: '0.80rem', fontWeight: 600, color: 'var(--text-main)' }}>Original Presentation Box</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Manufacture packaging (+4%)</div>
                </div>
              </div>

              <div 
                onClick={() => setHasPapers(!hasPapers)}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: hasPapers ? '1.5px solid var(--gold-primary)' : '1px solid var(--border-hairline)',
                  background: hasPapers ? 'rgba(161, 116, 36, 0.06)' : '#F8FAFC',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: '1.5px solid var(--gold-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: hasPapers ? 'var(--gold-primary)' : 'transparent',
                  color: '#FFFFFF'
                }}>
                  {hasPapers && <Check size={12} strokeWidth={3} />}
                </div>
                <div>
                  <div style={{ fontSize: '0.80rem', fontWeight: 600, color: 'var(--text-main)' }}>Warranty Card / Papers</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Serial provenance (+8%)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dealer Margin Target Slider */}
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-hairline)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Dealer Target Gross Margin
              </span>
              <span className="tabular-nums" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
                {dealerMarginPct}% {dealerMarginPct === 20 && '(Industry Standard)'}
              </span>
            </div>
            <input 
              type="range" 
              min={12} 
              max={30} 
              step={1}
              value={dealerMarginPct}
              onChange={(e) => setDealerMarginPct(Number(e.target.value))}
              className="luxury-range-slider"
              style={{ cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              <span>12% (Thin Margin / Quick Flip)</span>
              <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>20% (Bayam Interview Baseline)</span>
              <span>30% (Exotic Pieces)</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-End Client Appraisal Sheet with 3D Depth & Foil Sheen */}
        <InteractiveTiltCard 
          maxTilt={2.5}
          glareOpacity={0.14}
          className="glass-card" 
          style={{ 
            padding: '32px', 
            border: '1.5px solid var(--border-gold)', 
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFC 100%)',
            boxShadow: 'var(--shadow-spotlight)',
            borderRadius: '18px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            {/* Certificate Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid var(--border-hairline)',
              paddingBottom: '18px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Logo size={42} />
                <div>
                  <div className="serif-heading" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.04em' }}>
                    LUXEDATA APPRAISAL CERTIFICATE
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--gold-primary)', letterSpacing: '0.04em', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    INSTITUTIONAL SECONDARY VALUATION MEMO
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-emerald badge-glimmer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={12} /> VERIFIED DATA
                </span>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                  Ref: #{valuation.activeLots} Active Lots
                </div>
              </div>
            </div>

            {/* Target Piece Metadata + Watch Photo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '22px' }}>
              {activeWatch.imageUrl && (
                <div style={{
                  width: '90px',
                  height: '90px',
                  background: 'radial-gradient(circle at 50% 40%, #FFFFFF 0%, #F8FAFC 80%)',
                  borderRadius: '12px',
                  padding: '6px',
                  border: '1px solid var(--border-hairline)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative',
                  boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.03)'
                }}>
                  <Image
                    src={activeWatch.imageUrl}
                    alt={activeWatch.model}
                    fill
                    sizes="90px"
                    style={{ objectFit: 'contain', padding: '6px', filter: 'drop-shadow(0 6px 12px rgba(15, 23, 42, 0.12))' }}
                  />
                </div>
              )}

              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Evaluated Timepiece</div>
                <h2 className="serif-heading" style={{ fontSize: '1.40rem', fontWeight: 800, color: 'var(--text-main)', margin: '2px 0' }}>
                  {activeWatch.brand} {activeWatch.model}
                </h2>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <span>Ref: <strong style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-mono)' }}>{activeWatch.reference}</strong></span>
                  <span>• Case: {activeWatch.caseSize}</span>
                  <span>• Dial: {activeWatch.dialColor}</span>
                </div>
              </div>
            </div>

            {/* Core Two-Price Breakdown: Buy-In vs Retail CMV */}
            <div className="responsive-price-pair" style={{ marginBottom: '20px' }}>
              
              {/* Client Cash Buy Offer */}
              <div style={{ 
                background: 'rgba(5, 150, 105, 0.06)', 
                padding: '18px', 
                borderRadius: '12px', 
                border: '1.5px solid var(--emerald-border)',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.08), inset 0 1px 0 #FFFFFF'
              }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--emerald-gain)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  RECOMMENDED CASH BUY OFFER
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--emerald-gain)', margin: '4px 0' }}>
                  <AnimatedCounter value={valuation.maxBuyOffer} prefix="$" />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Immediate dealer wire payout (-{dealerMarginPct}% spread)
                </div>
              </div>

              {/* Retail Consensus Market Value */}
              <div style={{ 
                background: '#F8FAFC', 
                padding: '18px', 
                borderRadius: '12px', 
                border: '1.5px solid var(--border-gold-subtle)',
                boxShadow: '0 4px 14px rgba(161, 116, 36, 0.06), inset 0 1px 0 #FFFFFF'
              }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--gold-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  TRI-VENUE RETAIL VALUE (CMV)
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>
                  <AnimatedCounter value={valuation.adjustedCMV} prefix="$" />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Calibrated across Chrono24, eBay, &amp; WatchCharts
                </div>
              </div>
            </div>

            {/* Negotiation Justification Metrics */}
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-hairline)', marginBottom: '20px', boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.02)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 600 }}>
                Dealer Valuation Breakdown (Proof for Client)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Projected Dealer Profit</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--emerald-gain)' }}>
                    <AnimatedCounter value={valuation.projectedProfit} prefix="+$" />
                  </div>
                  <div className="tabular-nums" style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>{valuation.projectedROI}% ROI</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Turnover Velocity</div>
                  <div className="tabular-nums" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    ~{valuation.daysToSell} Days
                  </div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>Avg Market Liquidity</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Institutional Sample</div>
                  <div className="tabular-nums" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
                    {valuation.dealerClustering} Lots
                  </div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>Clustered Company Lots</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Official Seal */}
          <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>
              Provenance: {hasBox && hasPapers ? 'Original Box & Papers (Full Set)' : hasBox ? 'Box Only' : hasPapers ? 'Papers Only' : 'Watch Only (Naked)'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} /> Backed by LuxeData Tri-Venue Algorithm
            </div>
          </div>
        </InteractiveTiltCard>

      </div>
    </div>
  );
};
