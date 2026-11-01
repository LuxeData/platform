import React from 'react';

export default function Loading() {
  return (
    <div
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '24px 20px 60px',
        minHeight: '85vh'
      }}
    >
      {/* Top Ticker Skeleton */}
      <div
        className="skeleton-shimmer"
        style={{
          height: '36px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '28px',
          border: '1px solid var(--border-hairline)'
        }}
      />

      {/* Hero Header Skeleton */}
      <div style={{ marginBottom: '32px' }}>
        <div
          className="skeleton-shimmer"
          style={{
            height: '24px',
            width: '180px',
            borderRadius: 'var(--radius-full)',
            marginBottom: '14px'
          }}
        />
        <div
          className="skeleton-shimmer"
          style={{
            height: '42px',
            width: '420px',
            maxWidth: '90%',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '10px'
          }}
        />
        <div
          className="skeleton-shimmer"
          style={{
            height: '18px',
            width: '600px',
            maxWidth: '100%',
            borderRadius: 'var(--radius-sm)'
          }}
        />
      </div>

      {/* Macro Metrics 4-Card Grid Skeleton */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '36px'
        }}
      >
        {[1, 2, 3, 4].map(idx => (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div
                className="skeleton-shimmer"
                style={{ height: '12px', width: '110px', borderRadius: '4px' }}
              />
              <div
                className="skeleton-shimmer"
                style={{ height: '18px', width: '60px', borderRadius: 'var(--radius-full)' }}
              />
            </div>
            <div
              className="skeleton-shimmer"
              style={{ height: '32px', width: '130px', borderRadius: '6px', marginBottom: '10px' }}
            />
            <div
              className="skeleton-shimmer"
              style={{ height: '12px', width: '180px', borderRadius: '4px' }}
            />
          </div>
        ))}
      </div>

      {/* Main Terminal Grid Skeleton */}
      <div
        className="glass-card"
        style={{
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {/* Navigation Tabs Skeleton */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            borderBottom: '1px solid var(--border-hairline)',
            paddingBottom: '16px',
            marginBottom: '24px'
          }}
        >
          {[120, 140, 130, 110].map((width, i) => (
            <div
              key={i}
              className="skeleton-shimmer"
              style={{ height: '32px', width: `${width}px`, borderRadius: 'var(--radius-sm)' }}
            />
          ))}
        </div>

        {/* Content Rows Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[1, 2, 3, 4, 5].map(row => (
            <div
              key={row}
              className="skeleton-shimmer"
              style={{
                height: '56px',
                width: '100%',
                borderRadius: 'var(--radius-sm)'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
