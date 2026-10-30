'use client';
import React, { useState } from 'react';
import { Logo } from './Logo';
import { verifyOrRegisterDealer } from '../lib/supabaseClient';
import { UserSession } from '../types/watch';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  UserCheck,
  Crown,
  LogOut,
  Zap,
  Check
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession | null;
  onAuthenticated: (userData: UserSession) => void;
  onSignOut: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onAuthenticated,
  onSignOut
}) => {
  const [email, setEmail] = useState('');
  const [dealership, setDealership] = useState('');
  const [role, setRole] = useState<'dealer' | 'collector'>('dealer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [copiedInvoice, setCopiedInvoice] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const result = await verifyOrRegisterDealer({
        email,
        dealership,
        role
      });

      setIsSubmitting(false);

      if (result.user.tier === 'pro') {
        setSubmittedMessage('👑 Pro Partner Verified! Full terminal order books unlocked.');
      } else {
        setSubmittedMessage('✓ Verified Dealer Session initialized (Free Submariner Tier).');
      }

      setTimeout(() => {
        onAuthenticated(result.user);
        onClose();
        setSubmittedMessage(null);
      }, 1200);
    } catch (err) {
      console.warn('Supabase auth notice:', err);
      setIsSubmitting(false);
      onAuthenticated({
        name: dealership || 'Independent Horology Desk',
        email: email || 'dealer@luxedata.io',
        dealership: dealership || 'Independent Horology Desk',
        role: 'dealer',
        tier: 'free'
      });
      onClose();
    }
  };

  const handleInstantGuestAccess = () => {
    onAuthenticated({
      name: 'Guest Dealer',
      email: 'guest@luxedata.io',
      dealership: 'Private Client Desk',
      role: 'dealer',
      tier: 'free'
    });
    onClose();
  };

  const handleDemoProAccess = () => {
    onAuthenticated({
      name: 'Bayam Luxury & Timepieces',
      email: 'vip.partner@luxedata.io',
      dealership: 'Bayam Luxury Desk (Partner)',
      role: 'pro',
      tier: 'pro'
    });
    onClose();
  };

  const handleCopyInvoiceInstructions = () => {
    navigator.clipboard.writeText(
      'LuxeData Pro Terminal Invoice Request — $99/mo (Direct Wire / ACH / Zelle). Dealership: ' + (user?.dealership || 'Horology Desk') + ' — Email: ' + (user?.email || 'dealer@luxedata.io')
    );
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 2500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(6, 8, 13, 0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div 
        className="glass-card" 
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '32px',
          border: '1px solid var(--border-gold)',
          background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.12) 0%, #0A0E17 80%)',
          position: 'relative',
          borderRadius: '16px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8), 0 0 32px rgba(212, 175, 55, 0.15)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <Logo size={46} />
          </div>
          <h3 className="serif-heading" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFF', letterSpacing: '0.04em' }}>
            Institutional Dealer Portal
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Verified consensus terminal, 20% buy-in appraisal ledger, and Holy Trinity order books.
          </p>
        </div>

        {/* ACTIVE LOGGED-IN STATE */}
        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '16px 18px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Active Workspace Desk
                </span>
                {user.tier === 'pro' ? (
                  <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                    <Crown size={12} /> PRO PARTNER
                  </span>
                ) : (
                  <span className="badge badge-subtle" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    FREE TIER
                  </span>
                )}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF', marginBottom: '2px' }}>
                {user.dealership}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {user.email}
              </div>
            </div>

            {/* If User is Free: Upsell to Pro with Direct Invoice */}
            {user.tier !== 'pro' ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(14, 19, 29, 0.9) 100%)',
                border: '1px solid var(--border-gold-subtle)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Crown size={14} style={{ color: 'var(--gold-light)' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                    Unlock Full Pro Terminal ($99/mo)
                  </span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '12px' }}>
                  Access Audemars Piguet &amp; Patek Philippe order books, all 31 live arbitrage signals, and automated PDF buy-in certificates. Pay via direct dealer invoice (Wire / ACH / Zelle).
                </p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleCopyInvoiceInstructions}
                    className="btn-primary"
                    style={{ flex: 1, padding: '9px 12px', fontSize: '0.76rem' }}
                  >
                    {copiedInvoice ? (
                      <>
                        <Check size={13} /> Invoice Details Copied!
                      </>
                    ) : (
                      <>
                        <Mail size={13} /> Request Direct Invoice
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDemoProAccess}
                    className="btn-ghost"
                    style={{ padding: '9px 12px', fontSize: '0.76rem' }}
                    title="Instantly test the Pro features without waiting for database invoice approval"
                  >
                    <Zap size={13} style={{ color: 'var(--gold-light)' }} /> Test Pro Mode
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--emerald-gain)', fontSize: '0.82rem', fontWeight: 700 }}>
                  <CheckCircle2 size={16} /> All 5 Holy Trinity Order Books &amp; 31 Arbitrage Deals Active
                </div>
              </div>
            )}

            {/* Sign Out Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
              <button
                onClick={onSignOut}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--crimson-drop)',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={13} /> Sign Out / Switch Desk
              </button>

              <button
                onClick={onClose}
                className="btn-ghost"
                style={{ fontSize: '0.76rem', padding: '6px 14px' }}
              >
                Return to Terminal
              </button>
            </div>
          </div>
        ) : (
          /* NOT LOGGED IN - LOGIN / REGISTER FORM */
          <>
            {submittedMessage ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <CheckCircle2 size={42} style={{ color: 'var(--emerald-gain)', margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF' }}>
                  {submittedMessage}
                </h4>
                <p style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Opening verified terminal desk...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Account Type Selector */}
                <div style={{
                  display: 'flex',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '3px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-hairline)'
                }}>
                  <button
                    type="button"
                    onClick={() => setRole('dealer')}
                    style={{
                      flex: 1,
                      padding: '7px 0',
                      fontSize: '0.75rem',
                      fontWeight: role === 'dealer' ? 700 : 500,
                      background: role === 'dealer' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                      color: role === 'dealer' ? 'var(--gold-light)' : 'var(--text-secondary)',
                      border: role === 'dealer' ? '1px solid var(--border-gold-subtle)' : 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Watch Dealer / Desk
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('collector')}
                    style={{
                      flex: 1,
                      padding: '7px 0',
                      fontSize: '0.75rem',
                      fontWeight: role === 'collector' ? 700 : 500,
                      background: role === 'collector' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                      color: role === 'collector' ? 'var(--gold-light)' : 'var(--text-secondary)',
                      border: role === 'collector' ? '1px solid var(--border-gold-subtle)' : 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Private Collector / Fund
                  </button>
                </div>

                {/* Work Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>
                    Professional Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      placeholder="e.g. dealer@dealership.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        padding: '10px 14px 10px 36px',
                        color: '#FFF',
                        fontSize: '0.84rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-faint)', marginTop: '4px' }}>
                    If you were granted Pro access in Supabase, enter that email to instantly unlock Pro mode.
                  </div>
                </div>

                {/* Dealership Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>
                    {role === 'dealer' ? 'Dealership or Boutique Name' : 'Collector or Organization'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder={role === 'dealer' ? 'e.g. Bayam Jewelry & Timepieces' : 'e.g. Private Collection'}
                      value={dealership}
                      onChange={(e) => setDealership(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        padding: '10px 14px 10px 36px',
                        color: '#FFF',
                        fontSize: '0.84rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.88rem', marginTop: '4px' }}
                >
                  {isSubmitting ? 'Verifying with Supabase...' : 'Sign In / Register Dealer Desk'} <ArrowRight size={15} />
                </button>

                {/* Quick Access Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '8px',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-hairline)'
                }}>
                  <button
                    type="button"
                    onClick={handleInstantGuestAccess}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.74rem',
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}
                  >
                    Continue in Free Guest Mode →
                  </button>

                  <button
                    type="button"
                    onClick={handleDemoProAccess}
                    style={{
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid var(--border-gold-subtle)',
                      color: 'var(--gold-light)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Crown size={12} /> Test Pro Desk Demo
                  </button>
                </div>

                {/* Certified Protocol Footer */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  paddingTop: '8px',
                  fontSize: '0.68rem',
                  color: 'var(--text-faint)'
                }}>
                  <ShieldCheck size={13} style={{ color: 'var(--gold-primary)' }} />
                  <span>Direct Supabase ledger verification &amp; 20% margin protection</span>
                </div>

              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
