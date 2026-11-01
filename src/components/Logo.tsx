import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 38, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 2px 6px rgba(15, 23, 42, 0.12))' }}
    >
      <defs>
        {/* Luxury Brushed Champagne Gold Gradients */}
        <linearGradient id="goldTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5DF9E" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8C6615" />
        </linearGradient>

        <linearGradient id="goldRight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ECC98A" />
          <stop offset="50%" stopColor="#B38928" />
          <stop offset="100%" stopColor="#6E4F0A" />
        </linearGradient>

        <linearGradient id="goldBottom" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#7A560D" />
          <stop offset="50%" stopColor="#B99230" />
          <stop offset="100%" stopColor="#F1D895" />
        </linearGradient>

        <linearGradient id="goldLeft" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F7E2A4" />
          <stop offset="60%" stopColor="#C99F31" />
          <stop offset="100%" stopColor="#7E590E" />
        </linearGradient>

        <linearGradient id="goldL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="35%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#855F10" />
        </linearGradient>

        <linearGradient id="goldArrow" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B8902A" />
          <stop offset="60%" stopColor="#F5DF9E" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>

        <radialGradient id="octaCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#141A28" />
          <stop offset="75%" stopColor="#0B0F19" />
          <stop offset="100%" stopColor="#05070B" />
        </radialGradient>
      </defs>

      {/* Dark Obsidian Octagon Core */}
      <polygon 
        points="34,6 66,6 94,34 94,66 66,94 34,94 6,66 6,34" 
        fill="url(#octaCore)" 
      />

      {/* 8 Faceted Octagonal Bezel Segments */}
      {/* 1. Top Segment */}
      <polygon points="36,8 64,8 60,19 40,19" fill="url(#goldTop)" />
      
      {/* 2. Top-Right Segment */}
      <polygon points="66,9 92,35 83,39 62,20" fill="url(#goldTop)" />

      {/* 3. Right Segment */}
      <polygon points="93,37 93,63 82,59 82,41" fill="url(#goldRight)" />

      {/* 4. Bottom-Right Segment */}
      <polygon points="92,65 66,91 62,80 83,61" fill="url(#goldBottom)" />

      {/* 5. Bottom Segment */}
      <polygon points="64,92 36,92 40,81 60,81" fill="url(#goldBottom)" />

      {/* 6. Bottom-Left Segment */}
      <polygon points="34,91 8,65 17,61 38,80" fill="url(#goldLeft)" />

      {/* 7. Left Segment */}
      <polygon points="7,63 7,37 18,41 18,59" fill="url(#goldLeft)" />

      {/* 8. Top-Left Segment */}
      <polygon points="8,35 34,9 38,20 17,39" fill="url(#goldTop)" />

      {/* Inner Thin Inset Octagon Stroke */}
      <polygon 
        points="39,21 61,21 79,39 79,61 61,79 39,79 21,61 21,39" 
        fill="none" 
        stroke="rgba(212, 175, 55, 0.2)" 
        strokeWidth="1" 
      />

      {/* Stylized Monogram "L" */}
      {/* Vertical Pillar */}
      <polygon 
        points="27,38 35,30 35,70 27,70" 
        fill="url(#goldL)" 
      />
      {/* Bottom Horizontal Leg */}
      <polygon 
        points="27,62 61,62 68,70 27,70" 
        fill="url(#goldL)" 
      />

      {/* Financial Upward Trajectory Arrow (Thick Chevron) */}
      <path 
        d="M28 70 L46 50 L53 57 L69 38" 
        stroke="url(#goldArrow)" 
        strokeWidth="6" 
        strokeLinecap="square" 
        strokeLinejoin="miter" 
      />
      
      {/* Triangular Arrowhead pointing into upper-right bezel segment */}
      <polygon 
        points="70,30 73,43 61,38" 
        fill="url(#goldArrow)" 
      />
    </svg>
  );
};
