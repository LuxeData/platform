import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { copyToClipboard } from '../clipboard';

describe('Clipboard Utility (copyToClipboard)', () => {
  let mockTextarea: any;
  let appendedElements: any[] = [];
  let originalNavigatorDesc: PropertyDescriptor | undefined;

  beforeAll(() => {
    originalNavigatorDesc = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  });

  afterAll(() => {
    if (originalNavigatorDesc) {
      Object.defineProperty(globalThis, 'navigator', originalNavigatorDesc);
    } else {
      delete (globalThis as any).navigator;
    }
    delete (globalThis as any).window;
    delete (globalThis as any).document;
  });

  beforeEach(() => {
    appendedElements = [];
    mockTextarea = {
      value: '',
      style: {},
      setAttribute: vi.fn(),
      focus: vi.fn(),
      select: vi.fn(),
      setSelectionRange: vi.fn()
    };

    (globalThis as any).window = globalThis;

    (globalThis as any).document = {
      createElement: vi.fn().mockImplementation((tag: string) => {
        if (tag === 'textarea') return mockTextarea;
        return { style: {} };
      }),
      body: {
        appendChild: vi.fn().mockImplementation((el: any) => {
          appendedElements.push(el);
        }),
        removeChild: vi.fn().mockImplementation((el: any) => {
          appendedElements = appendedElements.filter(e => e !== el);
        }),
        contains: vi.fn().mockImplementation((el: any) => {
          return appendedElements.includes(el);
        })
      },
      execCommand: vi.fn().mockReturnValue(true)
    };

    Object.defineProperty(globalThis, 'navigator', {
      value: {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined)
        }
      },
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses modern navigator.clipboard.writeText when available', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        clipboard: { writeText: writeTextMock }
      },
      writable: true,
      configurable: true
    });

    const result = await copyToClipboard('Test Luxury Quote');
    expect(result).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('Test Luxury Quote');
  });

  it('falls back to document.execCommand when navigator.clipboard throws', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const writeTextMock = vi.fn().mockRejectedValue(new Error('Permission denied'));
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        clipboard: { writeText: writeTextMock }
      },
      writable: true,
      configurable: true
    });

    const execCommandMock = vi.fn().mockReturnValue(true);
    (globalThis as any).document.execCommand = execCommandMock;

    const result = await copyToClipboard('Fallback Text');
    expect(result).toBe(true);
    expect(execCommandMock).toHaveBeenCalledWith('copy');
    expect(mockTextarea.value).toBe('Fallback Text');
    expect(mockTextarea.select).toHaveBeenCalled();
    expect(mockTextarea.setSelectionRange).toHaveBeenCalledWith(0, 'Fallback Text'.length);
  });

  it('falls back to document.execCommand when navigator.clipboard is undefined', async () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: {},
      writable: true,
      configurable: true
    });

    const execCommandMock = vi.fn().mockReturnValue(true);
    (globalThis as any).document.execCommand = execCommandMock;

    const result = await copyToClipboard('HTTP Legacy Environment Text');
    expect(result).toBe(true);
    expect(execCommandMock).toHaveBeenCalledWith('copy');
  });

  it('cleans up textarea DOM element in finally block even if document.execCommand throws an exception', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    Object.defineProperty(globalThis, 'navigator', {
      value: {},
      writable: true,
      configurable: true
    });

    (globalThis as any).document.execCommand = vi.fn().mockImplementation(() => {
      throw new Error('Blocked by security policy');
    });

    const result = await copyToClipboard('Leaked Test Text');

    expect(result).toBe(false);
    expect((globalThis as any).document.body.removeChild).toHaveBeenCalledWith(mockTextarea);
    expect(appendedElements.length).toBe(0);
  });
});
