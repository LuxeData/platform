'use client';
import React from 'react';

export const MechanicalBackground: React.FC = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      maxWidth: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0
    }}>
      {/* 1. Fluid Ambient Luminous Auroras */}
      <div 
        style={{
          position: 'absolute',
          top: '-10%',
          left: '30%',
          width: '650px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180, 130, 40, 0.06) 0%, rgba(180, 130, 40, 0.01) 50%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
      
      <div 
        style={{
          position: 'absolute',
          top: '25%',
          right: '15%',
          width: '600px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5, 150, 105, 0.03) 0%, rgba(15, 23, 42, 0.02) 50%, transparent 70%)',
          filter: 'blur(70px)'
        }}
      />

      {/* 2. Haute Horlogerie Rotating Movement Rings (Airy Watermark) */}
      <div style={{
        position: 'absolute',
        top: '8%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '880px',
        height: '880px',
        opacity: 0.75
      }}>
        {/* Outer Ring: Fluted Bezel & Minute Track (Slow Clockwise) */}
        <svg 
          className="animate-rotate-slow" 
          viewBox="0 0 800 800" 
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
        >
          {/* Outer circle */}
          <circle cx="400" cy="400" r="380" fill="none" stroke="rgba(180, 130, 40, 0.07)" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="400" cy="400" r="360" fill="none" stroke="rgba(15, 23, 42, 0.04)" strokeWidth="1" />
          
          {/* 12 Hour Index Markers */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 400 + Math.cos(angle) * 350;
            const y1 = 400 + Math.sin(angle) * 350;
            const x2 = 400 + Math.cos(angle) * 375;
            const y2 = 400 + Math.sin(angle) * 375;
            return (
              <line
                key={`idx-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(180, 130, 40, 0.16)"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>

        {/* Middle Ring: Audemars Piguet Octagon Geometry & Escapement (Counter-Clockwise) */}
        <svg 
          className="animate-rotate-reverse" 
          viewBox="0 0 800 800" 
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
        >
          {/* Subtle Octagon outline */}
          <polygon
            points="280,120 520,120 680,280 680,520 520,680 280,680 120,520 120,280"
            fill="none"
            stroke="rgba(180, 130, 40, 0.09)"
            strokeWidth="1.2"
          />
          {/* 8 Octagon Screw Heads */}
          {[
            [280, 120], [520, 120], [680, 280], [680, 520],
            [520, 680], [280, 680], [120, 520], [120, 280]
          ].map(([x, y], i) => (
            <circle
              key={`screw-${i}`}
              cx={x}
              cy={y}
              r="4"
              fill="none"
              stroke="rgba(180, 130, 40, 0.20)"
              strokeWidth="1"
            />
          ))}
          {/* Gear teeth circle */}
          <circle cx="400" cy="400" r="270" fill="none" stroke="rgba(15, 23, 42, 0.04)" strokeWidth="1" strokeDasharray="8 8" />
        </svg>

        {/* Inner Ring: Tourbillon Balance Wheel & Radial Spokes (Medium Clockwise) */}
        <svg 
          className="animate-rotate-medium" 
          viewBox="0 0 800 800" 
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
        >
          <circle cx="400" cy="400" r="170" fill="none" stroke="rgba(180, 130, 40, 0.12)" strokeWidth="1" />
          <circle cx="400" cy="400" r="130" fill="none" stroke="rgba(15, 23, 42, 0.03)" strokeWidth="1" strokeDasharray="3 5" />
          
          {/* 6 Tourbillon Cage Arms */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * 60 * Math.PI) / 180;
            const x1 = 400 + Math.cos(angle) * 70;
            const y1 = 400 + Math.sin(angle) * 70;
            const x2 = 400 + Math.cos(angle) * 170;
            const y2 = 400 + Math.sin(angle) * 170;
            return (
              <line
                key={`spoke-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(180, 130, 40, 0.14)"
                strokeWidth="1"
              />
            );
          })}
        </svg>
      </div>

      {/* 3. Subtle Vignette Depth Mask */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 30%, transparent 40%, rgba(248, 249, 250, 0.85) 90%)',
        pointerEvents: 'none'
      }} />
    </div>
  );
};
