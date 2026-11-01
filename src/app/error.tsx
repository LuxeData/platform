'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home, RefreshCw, ShieldAlert } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log platform error cleanly for telemetry
    console.error('LuxeData Platform Unhandled Exception:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        background: 'var(--bg-deep)'
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '40px 36px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-gold-subtle)',
          boxShadow: 'var(--shadow-spotlight)',
          background: '#FFFFFF',
          textAlign: 'center'
        }}
      >
        {/* Institutional Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(180, 130, 40, 0.08)',
            border: '1px solid rgba(180, 130, 40, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: 'var(--gold-primary)'
          }}
        >
          <ShieldAlert size={32} />
        </div>

        {/* Header */}
        <span
          className="badge badge-gold"
          style={{ marginBottom: '14px', letterSpacing: '0.08em' }}
        >
          TERMINAL SESSION INTERRUPTED
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.65rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            letterSpacing: '-0.01em',
            marginBottom: '12px',
            lineHeight: 1.25
          }}
        >
          Execution Fault Detected
        </h1>

        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '24px'
          }}
        >
          An unexpected runtime condition halted quantitative pricing calculations.
          The state has been isolated to prevent corruption of dealer appraisal ledgers.
        </p>

        {/* Monospace Error Detail Box */}
        <div
          style={{
            background: '#F8FAFC',
            border: '1px solid var(--border-hairline)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            textAlign: 'left',
            marginBottom: '28px'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              marginBottom: '6px',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <AlertTriangle size={13} color="#E11D48" />
            <span>DIAGNOSTIC TRACE</span>
            {error?.digest && (
              <span style={{ marginLeft: 'auto', color: 'var(--text-faint)' }}>
                DIGEST: {error.digest}
              </span>
            )}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.76rem',
              color: 'var(--text-main)',
              wordBreak: 'break-word',
              maxHeight: '100px',
              overflowY: 'auto'
            }}
          >
            {error?.message || 'Unknown runtime error occurred within application client tree.'}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'center'
          }}
        >
          <button
            onClick={() => reset()}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: 'var(--gold-gradient)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-gold)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
          >
            <RotateCcw size={16} />
            <span>Reset Terminal Session</span>
          </button>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              width: '100%'
            }}
          >
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.reload();
                }
              }}
              style={{
                flex: 1,
                padding: '10px 16px',
                background: '#FFFFFF',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.80rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={14} />
              <span>Hard Reload</span>
            </button>

            <Link
              href="/"
              style={{
                flex: 1,
                padding: '10px 16px',
                background: '#FFFFFF',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.80rem',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Home size={14} />
              <span>Main Terminal</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
