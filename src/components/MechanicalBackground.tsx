'use client';
import React, { useEffect, useState } from 'react';

export const MechanicalBackground: React.FC = () => {
  const movementRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        if (movementRef.current) {
          // Subtle restrained parallax drift (max 48px)
          const offset = Math.min(window.scrollY * 0.1, 48);
          movementRef.current.style.transform = `translate3d(-50%, ${offset.toFixed(1)}px, 0)`;
        }
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div 
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        maxWidth: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      {/* 1. Fluid Ambient Luminous Auroras */}
      <div 
        style={{
          position: 'absolute',
          top: '-10%',
          left: '30%',
          width: '700px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180, 130, 40, 0.08) 0%, rgba(180, 130, 40, 0.02) 50%, transparent 70%)',
          filter: 'blur(70px)'
        }}
      />
      
      <div 
        style={{
          position: 'absolute',
          top: '25%',
          right: '15%',
          width: '650px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5, 150, 105, 0.04) 0%, rgba(15, 23, 42, 0.02) 50%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />

      {/* 2. Haute Horlogerie Rotating Movement Rings & Guilloché Watermark (Direct GPU RAF) */}
      <div 
        ref={movementRef}
        style={{
          position: 'absolute',
          top: '6%',
          left: '50%',
          transform: 'translate3d(-50%, 0px, 0)',
          willChange: 'transform',
          width: '920px',
          height: '920px',
          opacity: 0.85
        }}
      >
        {/* Layer A: Côtes de Genève (Geneva Stripes) & Guilloché Wave Geometry */}
        <svg 
          viewBox="0 0 900 900" 
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
        >
          <defs>
            {/* Synthetic Ruby Jewel Gradient */}
            <radialGradient id="rubyJewel" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="60%" stopColor="#BE123C" />
              <stop offset="100%" stopColor="#881337" />
            </radialGradient>
            
            {/* Fine Guilloché Wave Pattern */}
            <pattern id="guillocheWaves" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <path d="M 0,15 Q 7.5,5 15,15 T 30,15" fill="none" stroke="rgba(180, 130, 40, 0.035)" strokeWidth="0.75" />
            </pattern>
          </defs>

          {/* Guilloché Circle Disk */}
          <circle cx="450" cy="450" r="320" fill="url(#guillocheWaves)" />
        </svg>

        {/* Layer B: Outer Ring: Fluted Bezel & Minute Track (Slow Clockwise) */}
        <svg 
          className="animate-rotate-slow" 
          viewBox="0 0 900 900" 
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
        >
          {/* Outer track circles */}
          <circle cx="450" cy="450" r="430" fill="none" stroke="rgba(180, 130, 40, 0.08)" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="450" cy="450" r="410" fill="none" stroke="rgba(15, 23, 42, 0.05)" strokeWidth="1" />
          
          {/* 60 Minute Bezel Knurl Hash Marks */}
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i * 6 * Math.PI) / 180;
            const isFiveMin = i % 5 === 0;
            const rInner = isFiveMin ? 395 : 403;
            const rOuter = 410;
            const x1 = 450 + Math.cos(angle) * rInner;
            const y1 = 450 + Math.sin(angle) * rInner;
            const x2 = 450 + Math.cos(angle) * rOuter;
            const y2 = 450 + Math.sin(angle) * rOuter;
            return (
              <line
                key={`bezel-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isFiveMin ? 'rgba(180, 130, 40, 0.22)' : 'rgba(15, 23, 42, 0.08)'}
                strokeWidth={isFiveMin ? '1.5' : '0.8'}
              />
            );
          })}

          {/* 12 Hour Index Markers */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 450 + Math.cos(angle) * 365;
            const y1 = 450 + Math.sin(angle) * 365;
            const x2 = 450 + Math.cos(angle) * 395;
            const y2 = 450 + Math.sin(angle) * 395;
            return (
              <line
                key={`idx-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(180, 130, 40, 0.25)"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {/* Layer C: Middle Ring: Audemars Piguet Octagon Geometry & Escapement (Counter-Clockwise) */}
        <svg 
          className="animate-rotate-reverse" 
          viewBox="0 0 900 900" 
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
        >
          {/* Subtle Octagon outline */}
          <polygon
            points="320,150 580,150 750,320 750,580 580,750 320,750 150,580 150,320"
            fill="none"
            stroke="rgba(180, 130, 40, 0.12)"
            strokeWidth="1.2"
          />
          {/* 8 Octagon Screw Heads */}
          {[
            [320, 150], [580, 150], [750, 320], [750, 580],
            [580, 750], [320, 750], [150, 580], [150, 320]
          ].map(([x, y], i) => (
            <g key={`screw-${i}`}>
              <circle
                cx={x}
                cy={y}
                r="5"
                fill="none"
                stroke="rgba(180, 130, 40, 0.25)"
                strokeWidth="1.2"
              />
              <line
                x1={x - 3}
                y1={y}
                x2={x + 3}
                y2={y}
                stroke="rgba(180, 130, 40, 0.22)"
                strokeWidth="1"
              />
            </g>
          ))}
          {/* Gear teeth circle */}
          <circle cx="450" cy="450" r="290" fill="none" stroke="rgba(15, 23, 42, 0.05)" strokeWidth="1" strokeDasharray="8 8" />
        </svg>

        {/* Layer D: Inner Ring: Tourbillon Balance Wheel & Ruby Bearing Stone (Medium Clockwise) */}
        <svg 
          className="animate-rotate-medium" 
          viewBox="0 0 900 900" 
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
        >
          <defs>
            <radialGradient id="rubyJewelLayerD" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="40%" stopColor="#E11D48" />
              <stop offset="85%" stopColor="#9F1239" />
              <stop offset="100%" stopColor="#4C0519" />
            </radialGradient>
          </defs>
          <circle cx="450" cy="450" r="180" fill="none" stroke="rgba(180, 130, 40, 0.16)" strokeWidth="1.2" />
          <circle cx="450" cy="450" r="140" fill="none" stroke="rgba(15, 23, 42, 0.04)" strokeWidth="1" strokeDasharray="4 6" />
          
          {/* 6 Tourbillon Cage Arms with Chamfered Joints */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * 60 * Math.PI) / 180;
            const x1 = 450 + Math.cos(angle) * 75;
            const y1 = 450 + Math.sin(angle) * 75;
            const x2 = 450 + Math.cos(angle) * 180;
            const y2 = 450 + Math.sin(angle) * 180;
            return (
              <g key={`spoke-${i}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(180, 130, 40, 0.18)"
                  strokeWidth="1.2"
                />
                {/* Balance Weight Screw at perimeter */}
                <circle
                  cx={x2}
                  cy={y2}
                  r="3.5"
                  fill="none"
                  stroke="rgba(180, 130, 40, 0.28)"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Central Synthetic Ruby Pivot Jewel (Haute Horlogerie Signature) */}
          <circle
            cx="450"
            cy="450"
            r="16"
            fill="none"
            stroke="rgba(180, 130, 40, 0.35)"
            strokeWidth="1.5"
          />
          <circle
            cx="450"
            cy="450"
            r="9"
            fill="url(#rubyJewelLayerD)"
            stroke="rgba(244, 63, 94, 0.5)"
            strokeWidth="1"
            opacity="0.85"
          />
        </svg>
      </div>

      {/* 3. Subtle Horological Floating Light Particles */}
      <div 
        className="animate-float-subtle"
        style={{
          position: 'absolute',
          top: '20%',
          left: '22%',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'rgba(180, 130, 40, 0.25)',
          boxShadow: '0 0 12px rgba(180, 130, 40, 0.35)'
        }} 
      />
      <div 
        className="animate-float-subtle"
        style={{
          position: 'absolute',
          top: '38%',
          right: '20%',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: 'rgba(5, 150, 105, 0.22)',
          boxShadow: '0 0 10px rgba(5, 150, 105, 0.3)',
          animationDelay: '2.5s'
        }} 
      />

      {/* 4. Subtle Vignette Depth Mask */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 30%, transparent 40%, rgba(248, 249, 250, 0.88) 90%)',
        pointerEvents: 'none'
      }} />
    </div>
  );
};
