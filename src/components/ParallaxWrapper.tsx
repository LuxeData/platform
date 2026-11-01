'use client';
import React, { useEffect, useRef, useState } from 'react';

export interface ParallaxWrapperProps {
  children: React.ReactNode;
  speed?: number; // Parallax speed factor (-0.15 to 0.15 recommended)
  maxOffset?: number; // Maximum offset in px to keep motion subtle and restrained
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ParallaxWrapper — Subtle Swiss Optical Parallax Depth Component
 * 
 * Provides restrained physical depth (a few pixels of floating travel)
 * as the user scrolls through product showcases.
 * 
 * Eliminates measurement feedback loops by decoupling the static layout container
 * (measured via getBoundingClientRect) from the inner hardware-accelerated motion container.
 * 60fps/120fps with zero layout thrashing or lag.
 */
export const ParallaxWrapper: React.FC<ParallaxWrapperProps> = ({
  children,
  speed = 0.06,
  maxOffset = 22,
  className = '',
  style = {}
}) => {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const [offsetY, setOffsetY] = useState(0);
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
        const el = outerRef.current;
        if (!el) {
          rafId = null;
          return;
        }

        // Measure untransformed outer layout container to avoid feedback loops
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Only compute if partially or fully in viewport
        if (rect.bottom >= -80 && rect.top <= windowHeight + 80) {
          const elementCenter = rect.top + rect.height / 2;
          const viewportCenter = windowHeight / 2;
          const distanceFromCenter = elementCenter - viewportCenter;
          
          let calculatedOffset = distanceFromCenter * speed;
          calculatedOffset = Math.max(-maxOffset, Math.min(maxOffset, calculatedOffset));
          
          setOffsetY(calculatedOffset);
        }

        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      motionQuery.removeEventListener('change', motionListener);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [speed, maxOffset]);

  const innerTransformStyle: React.CSSProperties = isReducedMotion
    ? {}
    : {
        transform: `translate3d(0, ${offsetY.toFixed(2)}px, 0)`,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      };

  return (
    <div
      ref={outerRef}
      className={`parallax-outer-boundary ${className}`}
      style={{
        position: 'relative',
        ...style
      }}
    >
      <div
        className="parallax-motion-inner"
        style={innerTransformStyle}
      >
        {children}
      </div>
    </div>
  );
};
