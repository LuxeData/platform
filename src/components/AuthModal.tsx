'use client';
import React, { useState } from 'react';
import { Logo } from './Logo';
import { registerDealerLead } from '../lib/supabaseClient';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  UserCheck
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (userData: { name: string; email: string; dealership: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated
}) => {
  const [email, setEmail] = useState('');
  const [dealership, setDealership] = useState('');
  const [role, setRole] = useState<'dealer' | 'collector'>('dealer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await registerDealerLead({
        email,
        dealership,
        role
      });
    } catch (err) {
      console.warn('Supabase lead capture warning:', err);
    }
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      onAuthenticated({
        name: dealership || 'Verified Member',
        email: email || 'dealer@luxedata.io',
        dealership: dealership || 'Independent Horology Desk'
      });
      onClose();
      setSubmitted(false);
    }, 1200);
  };

  const handleInstantGuestAccess = () => {
    onAuthenticated({
      name: 'Guest Dealer',
      email: 'demo@luxedata.io',
      dealership: 'Private Client Desk'
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(6, 8, 13, 0.85)',
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
          maxWidth: '460px',
          padding: '32px',
          border: '1px solid var(--border-gold)',
          background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.1) 0%, #0A0E17 80%)',
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
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <Logo size={48} />
          </div>
          <h3 className="serif-heading" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFF', letterSpacing: '0.04em' }}>
            Institutional Dealer Portal
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Access real-time Chrono24 consensus feeds, save custom client appraisals, and unlock 31 live arbitrage lots.
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <CheckCircle2 size={42} style={{ color: 'var(--emerald-gain)', margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF' }}>
              Welcome to LuxeData
            </h4>
            <p style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Opening institutional workspace...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
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
                  placeholder="dealer@dealership.com"
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.88rem', marginTop: '4px' }}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In / Request Dealer Credentials'} <ArrowRight size={15} />
            </button>

            {/* Fast Guest Mode Button */}
            <div style={{ textAlign: 'center', marginTop: '6px' }}>
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
                Or continue in Guest Terminal Mode →
              </button>
            </div>

            {/* Provenance Footer Note */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              borderTop: '1px solid var(--border-hairline)',
              paddingTop: '14px',
              fontSize: '0.68rem',
              color: 'var(--text-faint)'
            }}>
              <ShieldCheck size={13} style={{ color: 'var(--gold-primary)' }} />
              <span>Certified 20% Dealer Buy-In &amp; 10% Trimmed Mean Feeds</span>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

