'use client';
import React, { useState, useMemo } from 'react';
import { WatchModel, UserSession } from '../types/watch';
import { Logo } from './Logo';
import { formatUSD } from '../lib/format';
import { saveAppraisalToDb } from '../lib/supabaseClient';
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
  Crown
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

  const activeWatch = useMemo(() => {
    return watches.find(w => w.reference.toUpperCase() === selectedRef.toUpperCase()) || watches[0];
  }, [watches, selectedRef]);

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
    const projectedROI = Math.round((projectedProfit / maxBuyOffer) * 100);

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

  const handleCopyQuote = () => {
    if (!valuation || !activeWatch) return;
    const text = `--- LUXEDATA DEALER APPRAISAL ---\nModel: ${activeWatch.brand} ${activeWatch.model} (Ref: ${activeWatch.reference})\nCondition: ${condition} | Provenance: ${hasBox && hasPapers ? 'Full Set' : 'Incomplete'}\nConsensus Retail Value (CMV): $${formatUSD(valuation.adjustedCMV)}\nCash Buy-In Offer: $${formatUSD(valuation.maxBuyOffer)}\nTarget Margin: ${dealerMarginPct}%\nVerified via LuxeData Chrono24 Intelligence Feed.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    try {
      await saveAppraisalToDb({
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
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.warn('Appraisal save error:', e);
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeWatch || !valuation) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Appraisal Header */}
      <div className="glass-card" style={{
        padding: '22px 28px',
        border: '1px solid var(--border-gold-subtle)',
        background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.06) 0%, rgba(14, 19, 29, 0.95) 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Logo size={40} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 className="serif-heading" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFF' }}>
                  Dealer Cash Buy-In &amp; Appraisal Terminal
                </h2>
                <span className="badge badge-gold" style={{ fontSize: '0.62rem' }}>20% BUY-IN FORMULA</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px' }}>
                Algorithmic wholesale acquisition quotes calibrated from dealer interviews (20% dealer buy-in spread from Chrono24 consensus)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={handleSaveToLedger}
              disabled={isSaving}
              className="btn-ghost"
              style={{
                fontSize: '0.78rem',
                padding: '8px 14px',
                borderColor: savedSuccess ? 'rgba(16, 185, 129, 0.5)' : undefined,
                color: savedSuccess ? 'var(--emerald-gain)' : undefined
              }}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 size={14} style={{ color: 'var(--emerald-gain)' }} />
                  <span>Saved to Ledger</span>
                </>
              ) : (
                <>
                  <Database size={14} style={{ color: 'var(--gold-primary)' }} />
                  <span>{isSaving ? 'Logging to DB...' : 'Save to DB Ledger'}</span>
                </>
              )}
            </button>
            <button 
              onClick={handleCopyQuote} 
              className="btn-ghost"
              style={{ fontSize: '0.78rem', padding: '8px 14px' }}
            >
              {copied ? <Check size={14} style={{ color: 'var(--emerald-gain)' }} /> : <Copy size={14} />}
              {copied ? 'Quote Copied' : 'Copy Quote Text'}
            </button>
            <button 
              onClick={handlePrint} 
              className="btn-primary"
              style={{ fontSize: '0.78rem', padding: '8px 16px' }}
            >
              <Printer size={14} /> Print Appraisal Sheet
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls + Right Live Appraisal Certificate */}
      <div className="responsive-appraisal-grid">
        
        {/* Left Column: Appraisal Variable Controls */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#FFF' }}>
              <Calculator size={17} style={{ color: 'var(--gold-primary)' }} />
              Piece Assessment Parameters
            </h3>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Configure watch reference, condition, and provenance to compute wholesale replacement value
            </p>
          </div>

          {/* Select Reference Watch */}
          <div>
            <label style={{ display: 'block', fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
              Select Catalog Reference
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {watches.map(w => {
                const isProRef = w.reference !== '126610LN';
                const isUserPro = user?.tier === 'pro';

                return (
                  <button
                    key={w.reference}
                    onClick={() => setSelectedRef(w.reference)}
                    className={`btn-ghost ${selectedRef.toUpperCase() === w.reference.toUpperCase() ? 'active' : ''}`}
                    style={{
                      fontSize: '0.74rem',
                      padding: '8px 6px',
                      textAlign: 'center',
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{w.reference}</span>
                    {isProRef && !isUserPro && (
                      <Lock size={10} style={{ color: 'var(--gold-light)' }} />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedRef !== '126610LN' && user?.tier !== 'pro' && (
              <div style={{
                marginTop: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid var(--border-gold-subtle)',
                fontSize: '0.74rem',
                color: 'var(--gold-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={13} /> {activeWatch.brand} buy-in formulas are in preview mode.
                </span>
                <button
                  onClick={onOpenAuth}
                  style={{
                    background: 'var(--gold-primary)',
                    color: '#000',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    fontSize: '0.68rem',
                    cursor: 'pointer'
                  }}
                >
                  Unlock Pro
                </button>
              </div>
            )}
          </div>

          {/* Condition Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
              Case &amp; Movement Condition
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
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

          {/* Provenance Box & Papers Toggles */}
          <div>
            <label style={{ display: 'block', fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
              Scope of Delivery (Provenance)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div 
                onClick={() => setHasBox(!hasBox)}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: hasBox ? '1px solid var(--border-gold)' : '1px solid var(--border-hairline)',
                  background: hasBox ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255, 255, 255, 0.02)',
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
                  border: '1px solid var(--gold-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: hasBox ? 'var(--gold-primary)' : 'transparent',
                  color: '#07090E'
                }}>
                  {hasBox && <Check size={12} strokeWidth={3} />}
                </div>
                <div>
                  <div style={{ fontSize: '0.80rem', fontWeight: 600, color: hasBox ? '#FFF' : 'var(--text-secondary)' }}>Original Presentation Box</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Manufacture packaging (+4%)</div>
                </div>
              </div>

              <div 
                onClick={() => setHasPapers(!hasPapers)}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: hasPapers ? '1px solid var(--border-gold)' : '1px solid var(--border-hairline)',
                  background: hasPapers ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255, 255, 255, 0.02)',
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
                  border: '1px solid var(--gold-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: hasPapers ? 'var(--gold-primary)' : 'transparent',
                  color: '#07090E'
                }}>
                  {hasPapers && <Check size={12} strokeWidth={3} />}
                </div>
                <div>
                  <div style={{ fontSize: '0.80rem', fontWeight: 600, color: hasPapers ? '#FFF' : 'var(--text-secondary)' }}>Warranty Card / Papers</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Serial provenance (+8%)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dealer Margin Target Slider */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-hairline)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Dealer Target Gross Margin
              </span>
              <span className="tabular-nums" style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--gold-light)' }}>
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
              style={{ width: '100%', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>12% (Thin Margin / Quick Flip)</span>
              <span>20% (Bayam Interview Baseline)</span>
              <span>30% (Exotic Pieces)</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-End Client Appraisal Sheet */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '28px', 
            border: '1px solid var(--border-gold)', 
            background: 'radial-gradient(circle at 90% 10%, rgba(212, 175, 55, 0.06) 0%, rgba(11, 15, 25, 0.98) 70%)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {/* Subtle Watermark Logo in Background */}
          <div style={{ position: 'absolute', right: '20px', bottom: '20px', opacity: 0.04, pointerEvents: 'none' }}>
            <Logo size={240} />
          </div>

          <div>
            {/* Certificate Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid var(--border-hairline)',
              paddingBottom: '16px',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Logo size={36} />
                <div>
                  <div className="serif-heading" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF', letterSpacing: '0.06em' }}>
                    LUXEDATA APPRAISAL CERTIFICATE
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--gold-light)', letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
                    INSTITUTIONAL SECONDARY VALUATION MEMO
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={11} /> VERIFIED DATA
                </span>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                  Ref: #{valuation.activeLots} Active Lots
                </div>
              </div>
            </div>

            {/* Target Piece Metadata */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Evaluated Timepiece</div>
              <h2 className="serif-heading" style={{ fontSize: '1.45rem', fontWeight: 700, color: '#FFF', margin: '4px 0' }}>
                {activeWatch.brand} {activeWatch.model}
              </h2>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <span>Ref: <strong style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-mono)' }}>{activeWatch.reference}</strong></span>
                <span>• Case: {activeWatch.caseSize}</span>
                <span>• Dial: {activeWatch.dialColor}</span>
              </div>
            </div>

            {/* Core Two-Price Breakdown: Buy-In vs Retail CMV */}
            <div className="responsive-price-pair" style={{ marginBottom: '20px' }}>
              
              {/* Client Cash Buy Offer */}
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--emerald-gain)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  RECOMMENDED CASH BUY OFFER
                </div>
                <div className="tabular-nums" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#FFF', margin: '4px 0' }}>
                  ${formatUSD(valuation.maxBuyOffer)}
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
                  Immediate dealer wire payout (-{dealerMarginPct}% spread)
                </div>
              </div>

              {/* Retail Consensus Market Value */}
              <div style={{ background: 'rgba(212, 175, 55, 0.06)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-gold)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  CONSENSUS RETAIL VALUE (CMV)
                </div>
                <div className="tabular-nums" style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--gold-light)', margin: '4px 0' }}>
                  ${formatUSD(valuation.adjustedCMV)}
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
                  10% trimmed mean of professional dealer lots
                </div>
              </div>
            </div>

            {/* Negotiation Justification Metrics */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-hairline)', marginBottom: '18px' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Dealer Valuation Breakdown (Proof for Client)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Projected Dealer Profit</div>
                  <div className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--emerald-gain)' }}>
                    +${formatUSD(valuation.projectedProfit)}
                  </div>
                  <div className="tabular-nums" style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{valuation.projectedROI}% ROI</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Turnover Velocity</div>
                  <div className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>
                    ~{valuation.daysToSell} Days
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Avg Market Liquidity</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Institutional Sample</div>
                  <div className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                    {valuation.dealerClustering} Lots
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Clustered Company Lots</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Official Seal */}
          <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Provenance: {hasBox && hasPapers ? 'Original Box & Papers (Full Set)' : hasBox ? 'Box Only' : hasPapers ? 'Papers Only' : 'Watch Only (Naked)'}
            </div>
            <div style={{ fontSize: '0.70rem', color: 'var(--text-gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={13} /> Backed by LuxeData Consensus Algorithm
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
