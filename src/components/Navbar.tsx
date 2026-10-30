'use client';
import React from 'react';
import { Search, ArrowUpRight, TrendingUp, Shield, Sparkles, UserCheck, LogIn, Crown } from 'lucide-react';
import { Logo } from './Logo';
import { WATCH_MODELS } from '../lib/marketEngine';
import { formatUSD } from '../lib/format';
import { UserSession } from '../types/watch';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  activeTab: 'overview' | 'terminal' | 'appraisal' | 'arbitrage';
  setActiveTab: (tab: 'overview' | 'terminal' | 'appraisal' | 'arbitrage') => void;
  user: UserSession | null;
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
        padding: '6px 20px',
        fontSize: '0.72rem',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          {/* Provenance Tag (Pinned Left) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
            paddingRight: '14px',
            borderRight: '1px solid var(--border-hairline)',
            zIndex: 2
          }}>
            <span className="pulse-indicator"></span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-gold)',
              fontWeight: 700,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              fontSize: '0.68rem'
            }}>
              TRI-VENUE FEED
            </span>
            <span style={{ color: 'var(--text-faint)' }}>•</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.66rem', fontFamily: 'var(--font-mono)' }}>CHRONO24 + EBAY + WCI</span>
          </div>

          {/* Continuous Horizontally Scrolling Watch Marquee */}
          <div style={{
            flex: 1,
            overflow: 'hidden',
            position: 'relative',
            maskImage: 'linear-gradient(to right, transparent 0%, black 20px, black calc(100% - 20px), transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20px, black calc(100% - 20px), transparent 100%)'
          }}>
            <div className="ticker-marquee-track">
              {/* Set 1 */}
              {WATCH_MODELS.map((w) => (
                <div key={`ticker-1-${w.reference}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', margin: '0 16px', fontSize: '0.72rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {w.brand} <strong style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-mono)' }}>{w.reference}</strong>:
                  </span>
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
                  <span style={{ color: 'rgba(212, 175, 55, 0.35)', marginLeft: '12px' }}>◆</span>
                </div>
              ))}

              {/* Set 2 (Duplicates for endless smooth 60fps loop) */}
              {WATCH_MODELS.map((w) => (
                <div key={`ticker-2-${w.reference}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', margin: '0 16px', fontSize: '0.72rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {w.brand} <strong style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-mono)' }}>{w.reference}</strong>:
                  </span>
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
                  <span style={{ color: 'rgba(212, 175, 55, 0.35)', marginLeft: '12px' }}>◆</span>
                </div>
              ))}
            </div>
          </div>

          {/* Engine Latency Badge (Pinned Right - Hidden on Mobile) */}
          <div className="mobile-hide" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
            paddingLeft: '14px',
            borderLeft: '1px solid var(--border-hairline)',
            zIndex: 2,
            color: 'var(--text-muted)'
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)' }}>
              10% TRIMMED MEAN
            </span>
            <span style={{ color: 'var(--text-faint)' }}>•</span>
            <span style={{ color: 'var(--emerald-gain)', fontSize: '0.66rem', fontFamily: 'var(--font-mono)' }}>24MS</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '10px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {/* Tier 1: Brand Emblem & Profile / Login */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Brand Emblem */}
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} 
            onClick={() => setActiveTab('overview')}
          >
            <Logo size={36} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="serif-heading" style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#FFF'
                }}>
                  LUXE<span className="gold-gradient-text">DATA</span>
                </span>
                <span className="badge badge-gold" style={{ fontSize: '0.58rem', padding: '1px 6px' }}>
                  INSTITUTIONAL
                </span>
              </div>
              <div style={{
                fontSize: '0.62rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)'
              }}>
                Luxury Asset Intelligence
              </div>
            </div>
          </div>

          {/* Desktop Search Bar (Hidden on Mobile, shown in Tier 2) */}
          <div className="mobile-hide" style={{ flex: 1, maxWidth: '360px', position: 'relative' }}>
            <Search size={14} style={{
              position: 'absolute',
              left: '12px',
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
                borderRadius: '8px',
                padding: '8px 36px 8px 34px',
                color: 'var(--text-main)',
                fontSize: '0.80rem',
                outline: 'none'
              }}
              onFocus={() => {
                if (activeTab === 'overview') setActiveTab('terminal');
              }}
            />
            <kbd style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.60rem',
              fontFamily: 'var(--font-mono)',
              padding: '2px 5px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-hairline)',
              color: 'var(--text-muted)'
            }}>
              ⌘K
            </kbd>
          </div>

          {/* User Auth / Dealer Access Button */}
          {user ? (
            <div 
              onClick={onOpenAuth}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: user.tier === 'pro'
                  ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.18) 0%, rgba(14, 19, 29, 0.95) 100%)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: user.tier === 'pro' ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                padding: '6px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: user.tier === 'pro' ? '0 0 16px rgba(212, 175, 55, 0.2)' : 'none'
              }}
            >
              {user.tier === 'pro' ? (
                <Crown size={14} style={{ color: 'var(--gold-light)' }} />
              ) : (
                <UserCheck size={14} style={{ color: 'var(--text-secondary)' }} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{
                  fontSize: '0.60rem',
                  color: user.tier === 'pro' ? 'var(--gold-light)' : 'var(--text-muted)',
                  textTransform: 'uppercase',
                  fontWeight: user.tier === 'pro' ? 700 : 500,
                  letterSpacing: '0.04em'
                }}>
                  {user.tier === 'pro' ? '👑 PRO DESK' : 'FREE DESK'}
                </span>
                <span style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#FFF',
                  maxWidth: '130px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {user.dealership}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-primary"
              style={{ fontSize: '0.74rem', padding: '7px 14px', borderRadius: '8px' }}
            >
              <Shield size={13} />
              <span>Dealer Access</span>
            </button>
          )}
        </div>

        {/* Tier 2: Mobile Search + Segmented Tabs (Horizontal Touch Scroller) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {/* Mobile-only full width search bar */}
          <div style={{ width: '100%', position: 'relative' }} className="mobile-search-bar">
            <style>{`
              @media (min-width: 901px) {
                .mobile-search-bar { display: none !important; }
              }
            `}</style>
            <Search size={14} style={{
              position: 'absolute',
              left: '12px',
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
                borderRadius: '8px',
                padding: '8px 14px 8px 34px',
                color: 'var(--text-main)',
                fontSize: '0.80rem',
                outline: 'none'
              }}
              onFocus={() => {
                if (activeTab === 'overview') setActiveTab('terminal');
              }}
            />
          </div>

          {/* Segmented Tab Switcher (Touch scrollable) */}
          <div className="mobile-tabs-container" style={{
            width: '100%',
            background: 'rgba(14, 19, 29, 0.8)',
            borderRadius: '10px',
            padding: '3px',
            border: '1px solid var(--border-subtle)',
            justifyContent: 'flex-start'
          }}>
            <button
              onClick={() => setActiveTab('overview')}
              className={`btn-ghost ${activeTab === 'overview' ? 'active' : ''}`}
              style={{
                flex: '1 0 auto',
                fontSize: '0.74rem',
                padding: '6px 14px',
                border: 'none',
                borderRadius: '7px',
                fontWeight: activeTab === 'overview' ? 700 : 500,
                textAlign: 'center'
              }}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab('terminal')}
              className={`btn-ghost ${activeTab === 'terminal' ? 'active' : ''}`}
              style={{
                flex: '1 0 auto',
                fontSize: '0.74rem',
                padding: '6px 14px',
                border: 'none',
                borderRadius: '7px',
                fontWeight: activeTab === 'terminal' ? 700 : 500,
                textAlign: 'center'
              }}
            >
              Market Terminal
            </button>
            
            <button
              onClick={() => setActiveTab('appraisal')}
              className={`btn-ghost ${activeTab === 'appraisal' ? 'active' : ''}`}
              style={{
                flex: '1 0 auto',
                fontSize: '0.74rem',
                padding: '6px 14px',
                border: 'none',
                borderRadius: '7px',
                fontWeight: activeTab === 'appraisal' ? 700 : 500,
                textAlign: 'center'
              }}
            >
              Appraisal Desk
            </button>

            <button
              onClick={() => setActiveTab('arbitrage')}
              className={`btn-ghost ${activeTab === 'arbitrage' ? 'active' : ''}`}
              style={{
                flex: '1 0 auto',
                fontSize: '0.74rem',
                padding: '6px 14px',
                border: 'none',
                borderRadius: '7px',
                fontWeight: activeTab === 'arbitrage' ? 700 : 500,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>Arbitrage</span>
              <span style={{
                background: 'var(--emerald-gain)',
                color: '#000',
                fontWeight: 800,
                fontSize: '0.58rem',
                padding: '1px 5px',
                borderRadius: '9999px'
              }}>
                31
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
