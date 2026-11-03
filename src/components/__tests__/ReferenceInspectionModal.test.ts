import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ReferenceInspectionModal } from '../ReferenceInspectionModal';
import { WATCH_MODELS } from '../../lib/marketEngine';
import { WatchModel } from '../../types/watch';

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill, ...rest }: any) => React.createElement('img', rest)
}));

describe('ReferenceInspectionModal', () => {
  const sampleWatch = WATCH_MODELS[0]; // Rolex Submariner Date 126610LN
  let mockClose: ReturnType<typeof vi.fn>;
  let mockOpenTerminal: ReturnType<typeof vi.fn>;
  let mockOpenAppraisal: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockClose = vi.fn();
    mockOpenTerminal = vi.fn();
    mockOpenAppraisal = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const html = renderToStaticMarkup(
      React.createElement(ReferenceInspectionModal, {
        watch: sampleWatch,
        isOpen: false,
        onClose: mockClose,
        onOpenTerminal: mockOpenTerminal,
        onOpenAppraisal: mockOpenAppraisal
      })
    );
    expect(html).toBe('');
  });

  it('renders nothing when watch is null', () => {
    const html = renderToStaticMarkup(
      React.createElement(ReferenceInspectionModal, {
        watch: null,
        isOpen: true,
        onClose: mockClose,
        onOpenTerminal: mockOpenTerminal,
        onOpenAppraisal: mockOpenAppraisal
      })
    );
    expect(html).toBe('');
  });

  it('renders reference identity, model name, and case specs when open', () => {
    const html = renderToStaticMarkup(
      React.createElement(ReferenceInspectionModal, {
        watch: sampleWatch,
        isOpen: true,
        onClose: mockClose,
        onOpenTerminal: mockOpenTerminal,
        onOpenAppraisal: mockOpenAppraisal
      })
    );

    expect(html).toContain('REF: 126610LN');
    expect(html).toContain(sampleWatch.brand);
    expect(html).toContain(sampleWatch.model);
    expect(html).toContain(sampleWatch.caseSize);
    expect(html).toContain(sampleWatch.material);
  });

  it('renders the 10% trimmed mean breakdown grid and mathematical bounds', () => {
    const html = renderToStaticMarkup(
      React.createElement(ReferenceInspectionModal, {
        watch: sampleWatch,
        isOpen: true,
        onClose: mockClose,
        onOpenTerminal: mockOpenTerminal,
        onOpenAppraisal: mockOpenAppraisal
      })
    );

    // Mathematical terms
    expect(html).toContain('10% Trimmed Mean (CMV)');
    expect(html).toContain('Wholesale Cash Floor (-20%)');
    expect(html).toContain('Protected Gross Spread');
    expect(html).toContain('10% Trimmed Mean Statistical Breakdown');
    expect(html).toContain('Raw Asking Range');
    expect(html).toContain('Outliers Cut (-20% Total)');
    expect(html).toContain('Analyzed 80% Core Band');
    expect(html).toContain('Resulting Consensus CMV');
    expect(html).toContain('active lots analyzed');
  });

  it('renders historical trajectory chart and active market listings sample', () => {
    const html = renderToStaticMarkup(
      React.createElement(ReferenceInspectionModal, {
        watch: sampleWatch,
        isOpen: true,
        onClose: mockClose,
        onOpenTerminal: mockOpenTerminal,
        onOpenAppraisal: mockOpenAppraisal
      })
    );

    expect(html).toContain('12-Month Historical Comps Trajectory');
    expect(html).toContain('Active Market Listings Sample');
    expect(html).toContain('Chrono24');
    expect(html).toContain('Open in Full Terminal');
    expect(html).toContain('Appraise Custom Piece');
  });

  it('triggers onClose when backdrop is clicked, but ignores clicks inside modal card', () => {
    let capturedElement: any = null;
    const CaptureComponent = (props: any) => {
      capturedElement = ReferenceInspectionModal(props);
      return null;
    };

    renderToStaticMarkup(
      React.createElement(CaptureComponent, {
        watch: sampleWatch,
        isOpen: true,
        onClose: mockClose,
        onOpenTerminal: mockOpenTerminal,
        onOpenAppraisal: mockOpenAppraisal
      })
    );

    expect(capturedElement).not.toBeNull();
    const backdropProps = capturedElement?.props;

    // Simulate clicking directly on backdrop
    const mockBackdropEvent = {
      target: 'backdrop-element',
      currentTarget: 'backdrop-element'
    };
    backdropProps.onClick(mockBackdropEvent);
    expect(mockClose).toHaveBeenCalledTimes(1);

    // Simulate clicking inside child card
    const mockChildClickEvent = {
      target: 'child-card-element',
      currentTarget: 'backdrop-element'
    };
    backdropProps.onClick(mockChildClickEvent);
    expect(mockClose).toHaveBeenCalledTimes(1); // Still 1, didn't fire again
  });

  it('invokes onOpenTerminal and onOpenAppraisal callbacks from action buttons', () => {
    let capturedElement: any = null;
    const CaptureComponent = (props: any) => {
      capturedElement = ReferenceInspectionModal(props);
      return null;
    };

    renderToStaticMarkup(
      React.createElement(CaptureComponent, {
        watch: sampleWatch,
        isOpen: true,
        onClose: mockClose,
        onOpenTerminal: mockOpenTerminal,
        onOpenAppraisal: mockOpenAppraisal
      })
    );

    expect(capturedElement).not.toBeNull();
    const modalContainer = capturedElement?.props.children;
    const cardChildren = React.Children.toArray(modalContainer.props.children);

    // Find close button
    const closeBtn: any = cardChildren.find((c: any) => c?.props?.['aria-label'] === 'Close inspection dialog');
    expect(closeBtn).toBeDefined();
    closeBtn.props.onClick();
    expect(mockClose).toHaveBeenCalledTimes(1);

    // Find footer actions container
    const footer: any = cardChildren[cardChildren.length - 1];
    expect(footer).toBeDefined();
    const buttons = React.Children.toArray(footer.props.children) as any[];
    expect(buttons.length).toBe(2);

    // Button 0: Appraise Custom Piece
    buttons[0].props.onClick();
    expect(mockOpenAppraisal).toHaveBeenCalledWith(sampleWatch);

    // Button 1: Open in Full Terminal
    buttons[1].props.onClick();
    expect(mockOpenTerminal).toHaveBeenCalledWith(sampleWatch);
  });

  it('executes component useEffect to register Escape keydown listener on window and cleans up on unmount', () => {
    const listeners: Record<string, ((e: any) => void)[]> = {};
    const mockWindow = {
      addEventListener: vi.fn((event: string, cb: any) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(cb);
      }),
      removeEventListener: vi.fn((event: string, cb: any) => {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter(fn => fn !== cb);
        }
      })
    };
    const mockDocument = {
      body: {
        style: {
          overflow: 'auto'
        }
      }
    };

    const originalWindow = (globalThis as any).window;
    const originalDocument = (globalThis as any).document;
    (globalThis as any).window = mockWindow;
    (globalThis as any).document = mockDocument;

    const capturedEffects: (() => void | (() => void))[] = [];
    const reactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    const originalDispatcher = reactInternals.ReactCurrentDispatcher.current;

    reactInternals.ReactCurrentDispatcher.current = {
      useEffect: (effect: () => void | (() => void)) => {
        capturedEffects.push(effect);
      },
      useMemo: (factory: () => any) => factory()
    };

    try {
      // Invoke component directly to execute its real hooks
      ReferenceInspectionModal({
        watch: sampleWatch,
        isOpen: true,
        onClose: mockClose,
        onOpenTerminal: mockOpenTerminal,
        onOpenAppraisal: mockOpenAppraisal
      });

      // Verify that ReferenceInspectionModal registered its effect hooks
      expect(capturedEffects.length).toBeGreaterThan(0);

      // Execute all registered effect callbacks from the component
      const cleanups = capturedEffects
        .map(fn => fn())
        .filter((c): c is () => void => typeof c === 'function');

      // Verify keydown listener was registered by the component
      expect(mockWindow.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));

      // Trigger Enter key - should not dismiss
      listeners['keydown']?.forEach(cb => cb({ key: 'Enter' }));
      expect(mockClose).not.toHaveBeenCalled();

      // Trigger Escape key - should dismiss
      listeners['keydown']?.forEach(cb => cb({ key: 'Escape' }));
      expect(mockClose).toHaveBeenCalledTimes(1);

      // Execute cleanup and verify removeEventListener was called
      cleanups.forEach(c => c());
      expect(mockWindow.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    } finally {
      reactInternals.ReactCurrentDispatcher.current = originalDispatcher;
      if (originalWindow) {
        (globalThis as any).window = originalWindow;
      } else {
        delete (globalThis as any).window;
      }
      if (originalDocument) {
        (globalThis as any).document = originalDocument;
      } else {
        delete (globalThis as any).document;
      }
    }
  });

  it('manages document.body.style.overflow lock on open and restores on unmount', () => {
    const mockWindow = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    };
    const mockDocument = {
      body: {
        style: {
          overflow: 'auto'
        }
      }
    };
    const originalWindow = (globalThis as any).window;
    const originalDocument = (globalThis as any).document;
    (globalThis as any).window = mockWindow;
    (globalThis as any).document = mockDocument;

    const capturedEffects: (() => void | (() => void))[] = [];
    const reactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    const originalDispatcher = reactInternals.ReactCurrentDispatcher.current;

    reactInternals.ReactCurrentDispatcher.current = {
      useEffect: (effect: () => void | (() => void)) => {
        capturedEffects.push(effect);
      },
      useMemo: (factory: () => any) => factory()
    };

    try {
      ReferenceInspectionModal({
        watch: sampleWatch,
        isOpen: true,
        onClose: mockClose,
        onOpenTerminal: mockOpenTerminal,
        onOpenAppraisal: mockOpenAppraisal
      });

      const cleanups = capturedEffects
        .map(fn => fn())
        .filter((c): c is () => void => typeof c === 'function');

      // Verify overflow was set to hidden while modal is open
      expect(mockDocument.body.style.overflow).toBe('hidden');

      // Run cleanups
      cleanups.forEach(c => c());
      expect(mockDocument.body.style.overflow).toBe('auto');
    } finally {
      reactInternals.ReactCurrentDispatcher.current = originalDispatcher;
      if (originalWindow) {
        (globalThis as any).window = originalWindow;
      } else {
        delete (globalThis as any).window;
      }
      if (originalDocument) {
        (globalThis as any).document = originalDocument;
      } else {
        delete (globalThis as any).document;
      }
    }
  });

  it('handles single-point price history without NaN in chart points', () => {
    const singlePointWatch: WatchModel = {
      ...sampleWatch,
      priceHistory: [
        { date: '2024-10', price: 14500, volume: 50 }
      ]
    };

    const html = renderToStaticMarkup(
      React.createElement(ReferenceInspectionModal, {
        watch: singlePointWatch,
        isOpen: true,
        onClose: mockClose,
        onOpenTerminal: mockOpenTerminal,
        onOpenAppraisal: mockOpenAppraisal
      })
    );

    expect(html).not.toContain('NaN');
    expect(html).toContain('12-Month Historical Comps Trajectory');
    expect(html).toContain('14,500');
  });

  it('handles empty price history gracefully by omitting chart', () => {
    const noHistoryWatch: WatchModel = {
      ...sampleWatch,
      priceHistory: []
    };

    const html = renderToStaticMarkup(
      React.createElement(ReferenceInspectionModal, {
        watch: noHistoryWatch,
        isOpen: true,
        onClose: mockClose,
        onOpenTerminal: mockOpenTerminal,
        onOpenAppraisal: mockOpenAppraisal
      })
    );

    expect(html).not.toContain('12-Month Historical Comps Trajectory');
    expect(html).toContain(noHistoryWatch.brand);
  });

  it('handles watch with unknown reference not present in chrono24MarketData', () => {
    const customWatch: WatchModel = {
      ...sampleWatch,
      reference: 'UNKNOWN-999',
      brand: 'Custom Brand',
      model: 'Custom Model'
    };

    const html = renderToStaticMarkup(
      React.createElement(ReferenceInspectionModal, {
        watch: customWatch,
        isOpen: true,
        onClose: mockClose,
        onOpenTerminal: mockOpenTerminal,
        onOpenAppraisal: mockOpenAppraisal
      })
    );

    expect(html).toContain('REF: UNKNOWN-999');
    expect(html).toContain('10% Trimmed Mean (CMV)');
    expect(html).toContain('Wholesale Cash Floor (-20%)');
  });
});
