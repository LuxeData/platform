'use client';
import React from 'react';
import { Search, ArrowUpRight, TrendingUp, Shield, Sparkles, UserCheck, LogIn } from 'lucide-react';
import { Logo } from './Logo';
import { WATCH_MODELS } from '../lib/marketEngine';
import { formatUSD } from '../lib/format';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  activeTab: 'overview' | 'terminal' | 'appraisal' | 'arbitrage';
  setActiveTab: (tab: 'overview' | 'terminal' | 'appraisal' | 'arbitrage') => void;
  user: { name: string; email: string; dealership: string } | null;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  activeTab,
  setActiveTab,
  user,
  onOpenAuth
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(6, 8, 13, 0.94)',
      backdropFilter: 'blur(18px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Institutional Real-Time Ticker Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #070A10 0%, #0C121D 50%, #070A10 100%)',
        borderBottom: '1px solid var(--border-hairline)',
        padding: '6px 24px',
        fontSize: '0.72rem',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          {/* Provenance Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span className="pulse-indicator"></span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-gold)',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              LIVE CHRONO24 FEED
            </span>
            <span style={{ color: 'var(--text-faint)' }}>•</span>
            <span style={{ color: 'var(--text-muted)' }}>281 Active Lots</span>
          </div>

          {/* Scrolling Watch Feeds */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none' }}>
            {WATCH_MODELS.map((w) => (
              <div key={w.reference} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{w.brand} {w.reference}:</span>
                <span className="tabular-nums" style={{ color: '#FFF', fontWeight: 600 }}>
                  ${formatUSD(w.currentAskingAvg)}
                </span>
                <span className="tabular-nums" style={{
                  color: w.thirtyDayChangePct >= 0 ? 'var(--emerald-gain)' : 'var(--crimson-drop)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontWeight: 600
                }}>
                  <ArrowUpRight size={11} />
                  +{w.thirtyDayChangePct}%
                </span>
              </div>
            ))}
          </div>

          {/* Engine Latency Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, color: 'var(--text-muted)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              10% TRIMMED MEAN CONSENSUS
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Brand Emblem */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} 
          onClick={() => setActiveTab('overview')}
        >
          <Logo size={40} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="serif-heading" style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#FFF'
              }}>
                LUXE<span className="gold-gradient-text">DATA</span>
              </span>
              <span className="badge badge-gold" style={{ fontSize: '0.62rem', padding: '2px 7px' }}>
                INSTITUTIONAL
              </span>
            </div>
            <div style={{
              fontSize: '0.66rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)'
            }}>
              Luxury Asset Intelligence Terminal
            </div>
          </div>
        </div>

        {/* Global Reference Search Bar */}
        <div style={{ flex: 1, maxWidth: '380px', position: 'relative' }}>
          <Search size={15} style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input
            type="text"
            placeholder="Search reference (126610LN, 116500LN)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(14, 19, 29, 0.75)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9px',
              padding: '9px 38px 9px 36px',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onFocus={() => {
              if (activeTab === 'overview') setActiveTab('terminal');
            }}
          />
          <kbd style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '0.65rem',
            fontFamily: 'var(--font-mono)',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-hairline)',
            color: 'var(--text-muted)'
          }}>
            ⌘K
          </kbd>
        </div>

        {/* Segmented Tab Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(14, 19, 29, 0.8)',
          borderRadius: '10px',
          padding: '3px',
          border: '1px solid var(--border-subtle)',
          gap: '3px'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`btn-ghost ${activeTab === 'overview' ? 'active' : ''}`}
            style={{
              fontSize: '0.76rem',
              padding: '7px 13px',
              border: 'none',
              borderRadius: '7px',
              fontWeight: activeTab === 'overview' ? 700 : 500
            }}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`btn-ghost ${activeTab === 'terminal' ? 'active' : ''}`}
            style={{
              fontSize: '0.76rem',
              padding: '7px 13px',
              border: 'none',
              borderRadius: '7px',
              fontWeight: activeTab === 'terminal' ? 700 : 500
            }}
          >
            Market Terminal
          </button>
          
          <button
            onClick={() => setActiveTab('appraisal')}
            className={`btn-ghost ${activeTab === 'appraisal' ? 'active' : ''}`}
            style={{
              fontSize: '0.76rem',
              padding: '7px 13px',
              border: 'none',
              borderRadius: '7px',
              fontWeight: activeTab === 'appraisal' ? 700 : 500
            }}
          >
            Appraisal Desk
          </button>

          <button
            onClick={() => setActiveTab('arbitrage')}
            className={`btn-ghost ${activeTab === 'arbitrage' ? 'active' : ''}`}
            style={{
              fontSize: '0.76rem',
              padding: '7px 13px',
              border: 'none',
              borderRadius: '7px',
              fontWeight: activeTab === 'arbitrage' ? 700 : 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Arbitrage Radar</span>
            <span style={{
              background: 'var(--emerald-gain)',
              color: '#000',
              fontWeight: 800,
              fontSize: '0.60rem',
              padding: '1px 5px',
              borderRadius: '9999px'
            }}>
              31
            </span>
          </button>
        </div>

        {/* User Auth / Dealer Access Button */}
        {user ? (
          <div 
            onClick={onOpenAuth}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid var(--border-gold)',
              padding: '6px 14px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <UserCheck size={14} style={{ color: 'var(--gold-primary)' }} />
            <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#FFF' }}>
              {user.dealership}
            </span>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="btn-primary"
            style={{ fontSize: '0.76rem', padding: '8px 16px', borderRadius: '8px' }}
          >
            <Shield size={14} />
            <span>Dealer Access</span>
          </button>
        )}
      </div>
    </header>
  );
};
