'use client';
import React, { useRef, useState, useCallback, useEffect } from 'react';

interface InteractiveTiltCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number; // max tilt in degrees (default 3.5)
  glareOpacity?: number; // max glare opacity (default 0.22)
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  active?: boolean;
}

export const InteractiveTiltCard: React.FC<InteractiveTiltCardProps> = ({
  children,
  className = '',
  style = {},
  maxTilt = 3.5,
  glareOpacity = 0.22,
  onClick,
  onMouseEnter,
  onMouseLeave,
  active = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.matchMedia) {
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(motionQuery.matches);
        const motionListener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        motionQuery.addEventListener('change', motionListener);

        const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
        setCanHover(hoverQuery.matches);
        const hoverListener = (e: MediaQueryListEvent) => setCanHover(e.matches);
        hoverQuery.addEventListener('change', hoverListener);

        return () => {
          motionQuery.removeEventListener('change', motionListener);
          hoverQuery.removeEventListener('change', hoverListener);
          if (rafId.current) cancelAnimationFrame(rafId.current);
        };
      }
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || prefersReducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Clamped normalized coordinates (-1 to 1)
      const normX = Math.max(-1, Math.min(1, (x - centerX) / centerX));
      const normY = Math.max(-1, Math.min(1, (y - centerY) / centerY));

      // Restrained tilt angle: rotateX depends on Y delta (inverted), rotateY on X delta
      const rotateX = -normY * maxTilt;
      const rotateY = normX * maxTilt;

      setTilt({ x: rotateX, y: rotateY });

      // Cursor position in percentage
      const glareX = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const glareY = Math.max(0, Math.min(100, (y / rect.height) * 100));
      setGlare({ x: glareX, y: glareY, opacity: glareOpacity });
    });
  }, [canHover, prefersReducedMotion, maxTilt, glareOpacity]);

  const handleMouseEnter = useCallback(() => {
    if (!canHover || prefersReducedMotion) return;
    setIsHovered(true);
    if (onMouseEnter) onMouseEnter();
  }, [canHover, prefersReducedMotion, onMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
    if (onMouseLeave) onMouseLeave();
  }, [onMouseLeave]);

  // Dynamic physical cast shadow: moves in opposite direction of tilt to simulate physical elevation
  const dynamicShadow = isHovered && canHover && !prefersReducedMotion
    ? `${(-tilt.y * 2.2).toFixed(1)}px ${Math.max(8, tilt.x * 2.2 + 18).toFixed(1)}px 36px -4px rgba(15, 23, 42, 0.12), 0 3px 10px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.95)`
    : (style.boxShadow || 'var(--shadow-card)');

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`luxury-tilt-card ${className} ${active ? 'active-tilt' : ''}`}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        ...style,
        boxShadow: dynamicShadow,
        transform: prefersReducedMotion || !canHover
          ? style.transform
          : isHovered
            ? `perspective(1200px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) translateY(-4px) scale3d(1.008, 1.008, 1.008)`
            : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)',
        transition: isHovered
          ? 'transform 0.14s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.14s cubic-bezier(0.16, 1, 0.3, 1)'
          : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Haute Horlogerie Polished Sapphire Crystal Sheen Highlight */}
      {canHover && !prefersReducedMotion && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 3,
            overflow: 'hidden',
            opacity: isHovered ? glare.opacity : 0,
            transition: isHovered ? 'opacity 0.2s ease' : 'opacity 0.45s ease',
            background: `radial-gradient(circle 380px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.95) 0%, rgba(212, 175, 55, 0.15) 28%, rgba(180, 130, 40, 0.05) 50%, transparent 75%)`,
          }}
        />
      )}

      {/* Subtle Specular Rim Light */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 2,
          boxShadow: isHovered
            ? 'inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 0 rgba(0, 0, 0, 0.04)'
            : 'inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          transition: 'box-shadow 0.3s ease'
        }}
      />

      {children}
    </div>
  );
};
