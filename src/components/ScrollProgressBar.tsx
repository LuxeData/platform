'use client';
import React, { useEffect, useState } from 'react';

/**
 * ScrollProgressBar — Refined Swiss Gold Scroll Progress Indicator
 * 
 * Provides an elite 2px hairline scroll progress bar at the very top of the page.
 * Uses requestAnimationFrame and GPU scaleX transforms for buttery smooth 60fps/120fps tracking
 * with ZERO layout reflows.
 * Automatically respects prefers-reduced-motion.
 */
export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);
    const motionListener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionListener);

    if (motionQuery.matches) {
      return () => {
        motionQuery.removeEventListener('change', motionListener);
      };
    }

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;

      rafId = window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        if (scrollHeight > 0) {
          const progress = Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100);
          setScrollProgress(progress);
        } else {
          setScrollProgress(0);
        }
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll(); // Initial measure

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      motionQuery.removeEventListener('change', motionListener);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  if (isReducedMotion) {
    return null;
  }

  const normalizedScale = Math.max(0, Math.min(1, scrollProgress / 100));

  return (
    <div 
      aria-hidden="true"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '2px',
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        overflow: 'visible',
        pointerEvents: 'none',
        zIndex: 102
      }}
    >
      {/* Precision Progress Track (GPU scaleX — zero layout reflows) */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `scaleX(${normalizedScale})`,
          transformOrigin: '0% 50%',
          background: 'linear-gradient(90deg, var(--gold-dark) 0%, var(--gold-primary) 50%, #D4AF37 100%)',
          boxShadow: '0 0 8px rgba(180, 130, 40, 0.6)',
          willChange: 'transform'
        }}
      />

      {/* Leading Jewel Pip (Unclipped luminous sphere) */}
      {scrollProgress > 0.5 && scrollProgress < 99.5 && (
        <div 
          style={{
            position: 'absolute',
            left: `${scrollProgress}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid var(--gold-primary)',
            boxShadow: '0 0 8px rgba(180, 130, 40, 0.9), 0 0 2px rgba(255, 255, 255, 0.8)',
            pointerEvents: 'none',
            zIndex: 2
          }}
        />
      )}
    </div>
  );
};
