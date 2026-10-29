'use strict';
import React from 'react';
import { Search, ShieldCheck, Zap, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  activeTab: 'terminal' | 'appraisal' | 'arbitrage';
  setActiveTab: (tab: 'terminal' | 'appraisal' | 'arbitrage') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  activeTab,
  setActiveTab
}) => {
  return (
    <header style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(7, 9, 14, 0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
      {/* Real-time Ticker Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #0A0E17 0%, #0F1626 50%, #0A0E17 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '6px 24px',
        fontSize: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-gold)', fontWeight: 600 }}>
            <span className="pulse-indicator"></span> LIVE AUCTION FEED
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            Rolex Submariner 126610LN: <strong style={{ color: 'var(--text-main)' }}>$13,400</strong> 
            <span style={{ color: 'var(--emerald-gain)', display: 'inline-flex', alignItems: 'center' }}><ArrowUpRight size={12} />+2.1%</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            Daytona Panda 116500LN: <strong style={{ color: 'var(--text-main)' }}>$28,100</strong> 
            <span style={{ color: 'var(--emerald-gain)', display: 'inline-flex', alignItems: 'center' }}><ArrowUpRight size={12} />+3.4%</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            Patek 5711/1A: <strong style={{ color: 'var(--text-main)' }}>$98,000</strong> 
            <span style={{ color: 'var(--crimson-drop)' }}>-1.2%</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            Omega Moonwatch 310.30: <strong style={{ color: 'var(--text-main)' }}>$6,250</strong> 
            <span style={{ color: 'var(--emerald-gain)', display: 'inline-flex', alignItems: 'center' }}><ArrowUpRight size={12} />+1.5%</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.72rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Aggregating: Sotheby's • Christie's • eBay • Chrono24</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Logo size={42} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.08em', color: '#FFF' }}>
                LUXE<span className="gold-text">DATA</span>
              </span>
              <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>PRO INTELLIGENCE</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              ALTERNATIVE ASSET PRICING & ARBITRAGE TERMINAL
            </div>
          </div>
        </div>

        {/* Global Search Input */}
        <div style={{ flex: 1, maxWidth: '520px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search reference (e.g. 126610LN, 116500LN), model, or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(19, 26, 41, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '10px 16px 10px 42px',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
          />
        </div>

        {/* Navigation Mode Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', padding: '4px', border: '1px solid var(--border-subtle)', gap: '4px' }}>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`btn-ghost ${activeTab === 'terminal' ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '6px 14px', border: 'none', fontWeight: activeTab === 'terminal' ? 700 : 500 }}
          >
            Market Terminal
          </button>
          <button
            onClick={() => setActiveTab('appraisal')}
            className={`btn-ghost ${activeTab === 'appraisal' ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '6px 14px', border: 'none', fontWeight: activeTab === 'appraisal' ? 700 : 500 }}
          >
            Dealer Appraisal
          </button>
          <button
            onClick={() => setActiveTab('arbitrage')}
            className={`btn-ghost ${activeTab === 'arbitrage' ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '6px 14px', border: 'none', fontWeight: activeTab === 'arbitrage' ? 700 : 500, display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            Arbitrage Radar
            <span style={{ background: 'var(--emerald-gain)', color: '#07090E', padding: '1px 6px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 800 }}>31</span>
          </button>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn-primary" style={{ fontSize: '0.82rem' }}>
            <Zap size={14} />
            Institutional Access
          </button>
        </div>
      </div>
    </header>
  );
};
