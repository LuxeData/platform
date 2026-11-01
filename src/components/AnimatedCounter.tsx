'use client';
import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value?: number;
  from?: number;
  animateOnMount?: boolean;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number; // milliseconds
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value = 0,
  from = 0,
  animateOnMount = true,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 850,
  className = '',
  style = {}
}) => {
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  // Initialize state with safeValue so SSR and initial client hydration match 100% (zero hydration errors)
  const [displayValue, setDisplayValue] = useState<number>(safeValue);
  const displayValueRef = useRef<number>(safeValue);
  const startValueRef = useRef<number>(from);
  const isFirstRender = useRef(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(safeValue);
      displayValueRef.current = safeValue;
      return;
    }

    let start = displayValueRef.current;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (animateOnMount) {
        start = from;
        setDisplayValue(from);
        displayValueRef.current = from;
      } else {
        return;
      }
    }

    // If starting value is already safeValue, nothing to animate
    if (start === safeValue) {
      setDisplayValue(safeValue);
      displayValueRef.current = safeValue;
      return;
    }

    startValueRef.current = start;
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // High-precision Ease Out Cubic: 1 - (1 - t)^3
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValueRef.current + (safeValue - startValueRef.current) * easeProgress;

      setDisplayValue(current);
      displayValueRef.current = current;

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(safeValue);
        displayValueRef.current = safeValue;
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [safeValue, duration, prefersReducedMotion, animateOnMount, from]);

  // Robust number formatting with proper negative and prefix sign handling
  const isNegative = displayValue < 0;
  const absValue = Math.abs(displayValue);
  const formattedNumber = absValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  const hasPlusPrefix = prefix.startsWith('+');
  const cleanPrefix = hasPlusPrefix ? prefix.slice(1) : prefix;
  const sign = isNegative ? '-' : (hasPlusPrefix ? '+' : '');

  return (
    <span
      className={`tabular-nums ${className}`}
      style={{
        fontVariantNumeric: 'tabular-nums',
        display: 'inline-block',
        ...style
      }}
    >
      {sign}{cleanPrefix}{formattedNumber}{suffix}
    </span>
  );
};
