'use client';
import React, { useEffect, useRef, useState } from 'react';

export interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';
  delay?: number; // Delay in milliseconds
  distance?: number; // Distance in pixels to travel
  duration?: number; // Duration in milliseconds
  threshold?: number; // Viewport intersection threshold (0 to 1)
  className?: string;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements;
  once?: boolean;
}

/**
 * ScrollReveal — Institutional Swiss Luxury Viewport Entrance Component
 * 
 * Delivers butter-smooth 60fps/120fps viewport entrance animations.
 * Strictly hardware-accelerated using matched transform3d and opacity matrices.
 * Eliminates matrix decomposition artifacts and expensive filter blur repaints.
 * Full prefers-reduced-motion compliance.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  distance = 24,
  duration = 650,
  threshold = 0.1,
  className = '',
  style = {},
  as: Component = 'div',
  once = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. Respect prefers-reduced-motion immediately
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        setIsVisible(true);
        return;
      }
    }

    const currentEl = elementRef.current;
    if (!currentEl) return;

    // 2. Check if already visible above the fold on initial mount
    const rect = currentEl.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true);
      if (once) return;
    }

    // 3. Viewport IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once && currentEl) {
              observer.unobserve(currentEl);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    observer.observe(currentEl);

    return () => {
      if (currentEl) observer.unobserve(currentEl);
      observer.disconnect();
    };
  }, [threshold, once]);

  // Compute matched transform token structures to prevent CSS matrix decomposition artifacts
  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0) scale(1)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0) scale(1)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0) scale(1)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0) scale(1)`;
      case 'scale':
        return `translate3d(0, ${Math.min(distance, 14)}px, 0) scale(0.96)`;
      case 'none':
      default:
        return 'translate3d(0, 0, 0) scale(1)';
    }
  };

  const animationStyles: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate3d(0, 0, 0) scale(1)' : getInitialTransform(),
    transitionProperty: 'opacity, transform',
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', // Swiss luxury spring deceleration
    transitionDelay: `${delay}ms`,
    willChange: isVisible ? 'auto' : 'opacity, transform',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    ...style
  };

  const Tag = Component as any;

  return (
    <Tag
      ref={elementRef}
      className={`scroll-reveal-container ${isVisible ? 'is-revealed' : ''} ${className}`}
      style={animationStyles}
    >
      {children}
    </Tag>
  );
};
