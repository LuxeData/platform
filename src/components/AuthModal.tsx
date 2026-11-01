'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { copyToClipboard } from '../lib/clipboard';
import { 
  signInWithSupabase, 
  signUpWithSupabase, 
  signOutFromSupabase, 
  requestPasswordReset 
} from '../lib/supabaseClient';
import { UserSession } from '../types/watch';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Crown, 
  LogOut, 
  Check, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2,
  KeyRound,
  Shield,
  HelpCircle
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
  // Auth Modes: 'signin' | 'register' | 'forgot'
  const [authMode, setAuthMode] = useState<'signin' | 'register' | 'forgot'>('signin');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dealership, setDealership] = useState('');
  const [role, setRole] = useState<'dealer' | 'collector'>('dealer');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedInvoice, setCopiedInvoice] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resetFormState = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('Please provide both your work email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signInWithSupabase({ email, password });
      setIsLoading(false);

      if (!res.success || !res.user) {
        setErrorMessage(res.error || 'Invalid email or password. Please verify your credentials.');
        return;
      }

      setSuccessMessage(`Welcome back, ${res.user.dealership}. Authenticating terminal...`);
      setTimeout(() => {
        onAuthenticated(res.user!);
        onClose();
        resetFormState();
      }, 1000);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Authentication service error. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password || !dealership) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signUpWithSupabase({
        email,
        password,
        dealership,
        role
      });
      setIsLoading(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to initialize dealer account. Please try again.');
        return;
      }

      if (res.requiresEmailConfirmation) {
        setSuccessMessage(
          'Verification email dispatched! Please check your inbox to confirm your email, then sign in.'
        );
        setTimeout(() => {
          setAuthMode('signin');
          resetFormState();
        }, 3500);
        return;
      }

      if (res.user) {
        setSuccessMessage('Dealer account initialized. Opening institutional desk...');
        setTimeout(() => {
          onAuthenticated(res.user!);
          onClose();
          resetFormState();
        }, 1200);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Registration service error. Please try again.');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email) {
      setErrorMessage('Please enter your registered professional email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestPasswordReset(email);
      setIsLoading(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Unable to dispatch reset link. Please verify the email address.');
        return;
      }

      setSuccessMessage('Password reset instructions sent. Please check your inbox.');
      setTimeout(() => {
        setAuthMode('signin');
        resetFormState();
      }, 3000);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Password reset request failed.');
    }
  };

  const handleSignOutClick = async () => {
    await signOutFromSupabase();
    onSignOut();
    onClose();
  };

  const handleCopyInvoiceInstructions = async () => {
    const success = await copyToClipboard(
      `LuxeData Pro Terminal Invoice Request — $1,188/yr (Direct Wire / ACH). Dealership: ${user?.dealership || 'Horology Desk'} — Email: ${user?.email || 'dealer@luxedata.io'}`
    );
    if (success) {
      setCopiedInvoice(true);
      setTimeout(() => setCopiedInvoice(false), 2500);
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <div 
        className="glass-card animate-modal-spring" 
        style={{
          width: '100%',
          maxWidth: '490px',
          padding: '36px',
          border: '1.5px solid var(--border-gold)',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFC 100%)',
          position: 'relative',
          borderRadius: '18px',
          boxShadow: 'var(--shadow-modal)'
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
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}
          title="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <Logo size={46} />
          </div>
          <h3 className="serif-heading" style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em' }}>
            {user ? 'Active Desk Profile' : 'Institutional Authentication'}
          </h3>
          <p style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {user 
              ? 'Cryptographically isolated session on Supabase PostgreSQL' 
              : 'Sign in to access your authorized dealer terminal and appraisal desk.'}
          </p>
        </div>

        {/* ============================================================== */}
        {/* LOGGED-IN VIEW: EXECUTIVE DESK OVERVIEW */}
        {/* ============================================================== */}
        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{
              background: '#F8FAFC',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '18px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Authenticated Entity
                </span>
                {user.tier === 'pro' ? (
                  <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                    <Crown size={12} /> PRO PARTNER
                  </span>
                ) : (
                  <span className="badge badge-subtle" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    VERIFIED DESK (FREE)
                  </span>
                )}
              </div>

              <div style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                {user.dealership}
              </div>
              <div style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {user.email}
              </div>

              {user.id && (
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
                  UUID: {user.id}
                </div>
              )}
            </div>

            {/* If Free: Upgrade to Pro via Direct Invoice */}
            {user.tier !== 'pro' ? (
              <div style={{
                background: 'rgba(161, 116, 36, 0.06)',
                border: '1.5px solid var(--border-gold-subtle)',
                borderRadius: '12px',
                padding: '18px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Crown size={15} style={{ color: 'var(--gold-primary)' }} />
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--gold-primary)' }}>
                    Upgrade to Enterprise Pro Desk ($1,188/yr)
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.55', marginBottom: '14px' }}>
                  Unlocks all Holy Trinity order books (AP Royal Oak, Patek Nautilus, Rolex Daytona), all live arbitrage signals, and unlimited certified PDF appraisal slips.
                </p>

                <button
                  onClick={handleCopyInvoiceInstructions}
                  className="btn-primary"
                  style={{ width: '100%', padding: '10px 14px', fontSize: '0.82rem' }}
                >
                  {copiedInvoice ? (
                    <>
                      <Check size={14} /> Wire Instructions Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Mail size={14} /> Request Direct Wire Invoice ($1,188/yr)
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div style={{
                background: 'rgba(5, 150, 105, 0.06)',
                border: '1px solid var(--emerald-border)',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--emerald-gain)', fontSize: '0.82rem', fontWeight: 700 }}>
                  <CheckCircle2 size={16} /> All Holy Trinity Order Books &amp; Arbitrage Feeds Active
                </div>
              </div>
            )}

            {/* Actions: Sign Out */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
              <button
                onClick={handleSignOutClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--crimson-drop)',
                  fontSize: '0.76rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                <LogOut size={14} /> Terminate Session / Sign Out
              </button>

              <button
                onClick={onClose}
                className="btn-ghost"
                style={{ fontSize: '0.78rem', padding: '7px 16px' }}
              >
                Return to Terminal
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* AUTHENTICATION FORMS: SIGN IN / REGISTER / FORGOT */
          /* ============================================================== */
          <>
            {/* Mode Switcher Tabs */}
            {authMode !== 'forgot' && (
              <div style={{
                display: 'flex',
                background: '#F1F5F9',
                padding: '4px',
                borderRadius: '10px',
                border: '1px solid var(--border-hairline)',
                marginBottom: '20px'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    resetFormState();
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    fontSize: '0.78rem',
                    fontWeight: authMode === 'signin' ? 700 : 500,
                    background: authMode === 'signin' ? '#FFFFFF' : 'transparent',
                    color: authMode === 'signin' ? 'var(--text-main)' : 'var(--text-secondary)',
                    boxShadow: authMode === 'signin' ? '0 1px 4px rgba(15, 23, 42, 0.08)' : 'none',
                    border: 'none',
                    borderRadius: '7px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    resetFormState();
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    fontSize: '0.78rem',
                    fontWeight: authMode === 'register' ? 700 : 500,
                    background: authMode === 'register' ? '#FFFFFF' : 'transparent',
                    color: authMode === 'register' ? 'var(--text-main)' : 'var(--text-secondary)',
                    boxShadow: authMode === 'register' ? '0 1px 4px rgba(15, 23, 42, 0.08)' : 'none',
                    border: 'none',
                    borderRadius: '7px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Register Desk
                </button>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'rgba(225, 29, 72, 0.08)',
                border: '1px solid rgba(225, 29, 72, 0.25)',
                borderRadius: '8px',
                color: 'var(--crimson-drop)',
                fontSize: '0.76rem',
                marginBottom: '16px'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Banner */}
            {successMessage && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'rgba(5, 150, 105, 0.08)',
                border: '1px solid var(--emerald-border)',
                borderRadius: '8px',
                color: 'var(--emerald-gain)',
                fontSize: '0.76rem',
                marginBottom: '16px'
              }}>
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <span>{successMessage}</span>
              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* 1. SIGN IN FORM */}
            {/* -------------------------------------------------------- */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em', fontWeight: 600 }}>
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
                        background: '#F8FAFC',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        padding: '10px 14px 10px 36px',
                        color: 'var(--text-main)',
                        fontSize: '0.84rem',
                        outline: 'none',
                        fontWeight: 500
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                      Master Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        resetFormState();
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--gold-primary)',
                        fontSize: '0.70rem',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontWeight: 600
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        background: '#F8FAFC',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        padding: '10px 40px 10px 36px',
                        color: 'var(--text-main)',
                        fontSize: '0.84rem',
                        outline: 'none',
                        fontWeight: 500
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.88rem', marginTop: '6px' }}
                >
                  {isLoading ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Loader2 size={16} className="spinner" /> Authenticating...
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      Sign In to Terminal <ArrowRight size={15} />
                    </span>
                  )}
                </button>
              </form>
            )}

            {/* -------------------------------------------------------- */}
            {/* 2. REGISTER DESK FORM */}
            {/* -------------------------------------------------------- */}
            {authMode === 'register' && (
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Account Type Selector */}
                <div style={{
                  display: 'flex',
                  background: '#F1F5F9',
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
                      fontSize: '0.74rem',
                      fontWeight: role === 'dealer' ? 700 : 500,
                      background: role === 'dealer' ? '#FFFFFF' : 'transparent',
                      color: role === 'dealer' ? 'var(--text-main)' : 'var(--text-secondary)',
                      boxShadow: role === 'dealer' ? '0 1px 4px rgba(15, 23, 42, 0.08)' : 'none',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Watch Dealer / Boutique
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('collector')}
                    style={{
                      flex: 1,
                      padding: '7px 0',
                      fontSize: '0.74rem',
                      fontWeight: role === 'collector' ? 700 : 500,
                      background: role === 'collector' ? '#FFFFFF' : 'transparent',
                      color: role === 'collector' ? 'var(--text-main)' : 'var(--text-secondary)',
                      boxShadow: role === 'collector' ? '0 1px 4px rgba(15, 23, 42, 0.08)' : 'none',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Asset Fund / Collector
                  </button>
                </div>

                {/* Dealership Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '0.04em', fontWeight: 600 }}>
                    {role === 'dealer' ? 'Dealership or Boutique Name' : 'Fund or Organization'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="e.g. Geneva Horology Desk"
                      value={dealership}
                      onChange={(e) => setDealership(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        background: '#F8FAFC',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        padding: '10px 14px 10px 36px',
                        color: 'var(--text-main)',
                        fontSize: '0.84rem',
                        outline: 'none',
                        fontWeight: 500
                      }}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '0.04em', fontWeight: 600 }}>
                    Professional Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      placeholder="desk@dealership.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        background: '#F8FAFC',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        padding: '10px 14px 10px 36px',
                        color: 'var(--text-main)',
                        fontSize: '0.84rem',
                        outline: 'none',
                        fontWeight: 500
                      }}
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '0.04em', fontWeight: 600 }}>
                      Password (min 6)
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        background: '#F8FAFC',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        color: 'var(--text-main)',
                        fontSize: '0.84rem',
                        outline: 'none',
                        fontWeight: 500
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '0.04em', fontWeight: 600 }}>
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        background: '#F8FAFC',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        color: 'var(--text-main)',
                        fontSize: '0.84rem',
                        outline: 'none',
                        fontWeight: 500
                      }}
                    />
                  </div>
                </div>

                {/* Legal acknowledgment */}
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', lineHeight: '1.45', marginTop: '2px' }}>
                  By initializing an account, you agree to the LuxeData{' '}
                  <Link href="/terms" target="_blank" style={{ color: 'var(--gold-primary)', textDecoration: 'underline' }}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" target="_blank" style={{ color: 'var(--gold-primary)', textDecoration: 'underline' }}>
                    Privacy Policy
                  </Link>.
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.88rem', marginTop: '4px' }}
                >
                  {isLoading ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Loader2 size={16} className="spinner" /> Provisioning Desk...
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      Initialize Dealer Account <ArrowRight size={15} />
                    </span>
                  )}
                </button>
              </form>
            )}

            {/* -------------------------------------------------------- */}
            {/* 3. FORGOT PASSWORD VIEW */}
            {/* -------------------------------------------------------- */}
            {authMode === 'forgot' && (
              <form onSubmit={handlePasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{
                  padding: '12px 14px',
                  background: 'rgba(161, 116, 36, 0.06)',
                  border: '1px solid var(--border-gold-subtle)',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5'
                }}>
                  Enter your registered professional email. Supabase Auth will dispatch a secure password reset link.
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em', fontWeight: 600 }}>
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
                        background: '#F8FAFC',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        padding: '10px 14px 10px 36px',
                        color: 'var(--text-main)',
                        fontSize: '0.84rem',
                        outline: 'none',
                        fontWeight: 500
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      resetFormState();
                    }}
                    className="btn-ghost"
                    style={{ flex: 1, padding: '10px', fontSize: '0.78rem' }}
                  >
                    Back to Sign In
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary"
                    style={{ flex: 1, padding: '10px', fontSize: '0.78rem' }}
                  >
                    {isLoading ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Loader2 size={14} className="spinner" /> Dispatching...
                      </span>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Certified Security Footnote */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-hairline)',
              marginTop: '16px',
              fontSize: '0.70rem',
              color: 'var(--text-muted)'
            }}>
              <ShieldCheck size={14} style={{ color: 'var(--gold-primary)' }} />
              <span>Supabase Auth • TLS 1.3 Encryption • SOC 2 Type II Aligned</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
