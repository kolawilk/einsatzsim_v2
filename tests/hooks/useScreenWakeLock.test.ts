import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScreenWakeLock, NoSleep } from '../src/hooks/useScreenWakeLock';

describe('useScreenWakeLock', () => {
  beforeEach(() => {
    (navigator as any).wakeLock = {
      request: vi.fn().mockResolvedValue({
        type: 'screen' as const,
        released: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        release: vi.fn().mockResolvedValue(undefined),
      }),
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return correct initial state', () => {
    const { result } = renderHook(() => useScreenWakeLock());
    
    expect(result.current.isActive).toBe(false);
    expect(typeof result.current.requestWakeLock).toBe('function');
    expect(typeof result.current.releaseWakeLock).toBe('function');
  });

  it('should request wake lock on mount', async () => {
    const { result } = renderHook(() => useScreenWakeLock());
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect((navigator as any).wakeLock.request).toHaveBeenCalledWith('screen');
  });

  it('should set isActive when wake lock is acquired', async () => {
    (navigator as any).wakeLock.request = vi.fn().mockResolvedValue({
      type: 'screen' as const,
      released: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      release: vi.fn().mockResolvedValue(undefined),
    });
    
    const { result } = renderHook(() => useScreenWakeLock());
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(result.current.isActive).toBe(true);
  });

  it('should release wake lock on unmount', async () => {
    const mockRelease = vi.fn().mockResolvedValue(undefined);
    (navigator as any).wakeLock.request = vi.fn().mockResolvedValue({
      type: 'screen' as const,
      released: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      release: mockRelease,
    });

    const { result, unmount } = renderHook(() => useScreenWakeLock());
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    unmount();
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(mockRelease).toHaveBeenCalled();
  });

  it('should handle unsupported wake lock API', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    delete (navigator as any).wakeLock;
    
    const { result } = renderHook(() => useScreenWakeLock());
    
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(result.current.isActive).toBe(false);
    expect(consoleLogSpy).toHaveBeenCalledWith('Screen Wake Lock API not supported');
    
    consoleLogSpy.mockRestore();
  });
});

describe('NoSleep', () => {
  it('should create NoSleep instance', () => {
    const noSleep = new NoSleep();
    expect(noSleep).toBeDefined();
  });
});
