'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  FileText, 
  Lock, 
  ArrowLeft, 
  Scale, 
  CheckCircle2, 
  Building2, 
  Printer, 
  Download,
  AlertTriangle,
  Globe2,
  Calendar,
  Layers
} from 'lucide-react';
import { Logo } from './Logo';
import { TERMS_OF_SERVICE, PRIVACY_POLICY, LegalDocument } from '../lib/legalContent';

interface LegalViewProps {
  initialDoc?: 'terms' | 'privacy';
  onBackToTerminal?: () => void;
  isStandalonePage?: boolean;
}

export function LegalView({ 
  initialDoc = 'terms', 
  onBackToTerminal,
  isStandalonePage = false 
}: LegalViewProps) {
  const [activeDoc, setActiveDoc] = useState<'terms' | 'privacy'>(initialDoc);
  const currentDoc: LegalDocument = activeDoc === 'terms' ? TERMS_OF_SERVICE : PRIVACY_POLICY;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8F9FA',
      color: 'var(--text-main)',
      fontFamily: 'var(--font-sans)',
      paddingBottom: '80px'
    }}>
      
      {/* Top Compliance Navigation Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '16px 24px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Brand & Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isStandalonePage ? (
              <Link 
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--gold-primary)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  padding: '6px 14px',
                  background: 'rgba(161, 116, 36, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-gold-subtle)'
                }}
              >
                <ArrowLeft size={16} /> Back to Terminal
              </Link>
            ) : onBackToTerminal ? (
              <button
                onClick={onBackToTerminal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--gold-primary)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '6px 14px',
                  background: 'rgba(161, 116, 36, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-gold-subtle)'
                }}
              >
                <ArrowLeft size={16} /> Back to Terminal
              </button>
            ) : null}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Logo size={28} />
              <div>
                <span className="serif-heading" style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-main)' }}>
                  LUXE<span className="gold-gradient-text">DATA</span>
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '8px' }}>
                  / Legal &amp; Compliance
                </span>
              </div>
            </div>
          </div>

          {/* Document Switcher Tabs */}
          <div style={{
            display: 'flex',
            background: '#F1F5F9',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-hairline)',
            gap: '4px'
          }}>
            <button
              onClick={() => setActiveDoc('terms')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                background: activeDoc === 'terms' ? '#0F172A' : 'transparent',
                color: activeDoc === 'terms' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              <FileText size={15} /> Terms of Service
            </button>

            <button
              onClick={() => setActiveDoc('privacy')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                background: activeDoc === 'privacy' ? '#0F172A' : 'transparent',
                color: activeDoc === 'privacy' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              <Lock size={15} /> Privacy Policy
            </button>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                fontSize: '0.76rem',
                cursor: 'pointer',
                fontWeight: 500
              }}
              title="Print legal documentation"
            >
              <Printer size={14} /> Print Audit Copy
            </button>
          </div>
        </div>
      </header>

      {/* Main Document Content Area */}
      <main style={{ maxWidth: '1280px', margin: '40px auto 0', padding: '0 24px' }}>
        
        {/* Document Hero & Metadata Banner */}
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid var(--border-gold-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 40px',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Scale size={12} /> SILICON VALLEY ENTERPRISE GRADE
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              Version {currentDoc.version}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>•</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={12} /> Effective {currentDoc.effectiveDate}
            </span>
          </div>

          <h1 className="serif-heading" style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px', letterSpacing: '0.01em' }}>
            {currentDoc.title}
          </h1>

          <p style={{ color: 'var(--gold-primary)', fontSize: '1.0rem', marginBottom: '16px', fontWeight: 600 }}>
            {currentDoc.subtitle}
          </p>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.65', maxWidth: '960px', marginBottom: '24px' }}>
            {currentDoc.summary}
          </p>

          {/* Institutional Compliance Badges */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-hairline)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: '#F8FAFC',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-hairline)',
              fontSize: '0.74rem',
              color: 'var(--text-secondary)'
            }}>
              <Building2 size={14} color="var(--gold-primary)" />
              <span>Delaware C-Corp Jurisdiction</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(5, 150, 105, 0.06)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--emerald-border)',
              fontSize: '0.74rem',
              color: 'var(--emerald-gain)',
              fontWeight: 600
            }}>
              <ShieldCheck size={14} />
              <span>AES-256 HSM Encryption at Rest</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: '#F8FAFC',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-hairline)',
              fontSize: '0.74rem',
              color: 'var(--text-secondary)'
            }}>
              <Globe2 size={14} color="var(--gold-primary)" />
              <span>GDPR (EU) &amp; CCPA/CPRA Compliant</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: '#F8FAFC',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-hairline)',
              fontSize: '0.74rem',
              color: 'var(--text-secondary)'
            }}>
              <Lock size={14} color="var(--gold-primary)" />
              <span>Zero Data Brokering / No-Sale Guarantee</span>
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Table of Contents + Document Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'flex-start' }}>
          
          {/* Sticky Left Table of Contents */}
          <aside style={{
            position: 'sticky',
            top: '84px',
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.76rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--gold-primary)',
              marginBottom: '16px'
            }}>
              <Layers size={14} /> Section Index
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {currentDoc.sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleScrollToSection(section.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F1F5F9';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-primary)', fontSize: '0.72rem', minWidth: '28px', fontWeight: 600 }}>
                    {section.number}
                  </span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {section.title}
                  </span>
                </button>
              ))}
            </nav>

            <div style={{
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-hairline)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)'
            }}>
              Direct inquiries to{' '}
              <a href="mailto:legal@luxedata.io" style={{ color: 'var(--gold-primary)', textDecoration: 'none', fontWeight: 600 }}>
                legal@luxedata.io
              </a>
            </div>
          </aside>

          {/* Right Document Body */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {currentDoc.sections.map((section) => {
              const isDisclaimer = section.id === 'financial-disclaimer' || section.id === 'limitation-liability';
              const isNoSale = section.id === 'no-sale-pledge';

              return (
                <section
                  key={section.id}
                  id={section.id}
                  style={{
                    background: isDisclaimer 
                      ? 'rgba(225, 29, 72, 0.04)' 
                      : isNoSale 
                        ? 'rgba(5, 150, 105, 0.04)'
                        : '#FFFFFF',
                    border: isDisclaimer 
                      ? '1px solid rgba(225, 29, 72, 0.25)' 
                      : isNoSale 
                        ? '1px solid var(--emerald-border)'
                        : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '28px 32px',
                    boxShadow: 'var(--shadow-card)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.80rem',
                      fontWeight: 700,
                      color: isDisclaimer ? 'var(--crimson-drop)' : isNoSale ? 'var(--emerald-gain)' : 'var(--gold-primary)',
                      padding: '4px 8px',
                      background: '#F1F5F9',
                      borderRadius: '4px',
                      border: '1px solid var(--border-hairline)'
                    }}>
                      {section.number}
                    </span>

                    <h2 className="serif-heading" style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      letterSpacing: '0.02em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {section.title}
                      {isDisclaimer && <AlertTriangle size={18} color="var(--crimson-drop)" />}
                      {isNoSale && <ShieldCheck size={18} color="var(--emerald-gain)" />}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {section.content.map((paragraph, idx) => (
                      <p
                        key={idx}
                        style={{
                          color: isDisclaimer ? '#9F1239' : 'var(--text-secondary)',
                          fontSize: '0.88rem',
                          lineHeight: '1.75',
                          letterSpacing: '0.01em'
                        }}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

        </div>

      </main>

    </div>
  );
}
