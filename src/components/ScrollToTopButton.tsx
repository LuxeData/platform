'use client';
import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * ScrollToTopButton — Swiss Luxury Floating Navigation Control
 * 
 * Subtly fades into view after 350px of scroll.
 * Provides a tactile, smooth return to the top of the terminal.
 * Fully declarative state, safe-area mobile compliant.
 */
export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        setIsVisible(window.scrollY > 350);
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const getTransform = () => {
    if (!isVisible) return 'translate3d(0, 16px, 0) scale(0.85)';
    if (isHovered) return 'translate3d(0, -3px, 0) scale(1.08)';
    return 'translate3d(0, 0, 0) scale(1)';
  };

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Scroll to top of market"
      title="Scroll to Top"
      style={{
        position: 'fixed',
        bottom: 'max(28px, env(safe-area-inset-bottom, 28px))',
        right: 'max(28px, env(safe-area-inset-right, 28px))',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: isHovered ? '1.5px solid var(--gold-primary)' : '1.5px solid var(--border-gold-subtle)',
        boxShadow: isHovered 
          ? '0 12px 30px rgba(161, 116, 36, 0.22), 0 2px 6px rgba(161, 116, 36, 0.14)'
          : '0 8px 24px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(161, 116, 36, 0.14)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--gold-dark)',
        cursor: 'pointer',
        zIndex: 90,
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease'
      }}
    >
      <ArrowUp size={18} strokeWidth={2.2} />
    </button>
  );
};
