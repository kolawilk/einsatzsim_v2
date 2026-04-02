import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useScreenWakeLock, NoSleep } from '@/hooks';

// Mock navigator.wakeLock
const mockWakeLock = {
  type: 'screen' as const,
  released: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  release: vi.fn().mockResolvedValue(undefined),
};

describe('useScreenWakeLock', () => {
  beforeEach(() => {
    (navigator as any).wakeLock = {
      request: vi.fn().mockResolvedValue(mockWakeLock),
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return correct initial state', async () => {
    const { result } = renderHook(() => useScreenWakeLock());
    
    // Wait for effect to run
    await waitFor(() => {});
    
    expect(result.current.isActive).toBe(false);
    expect(typeof result.current.requestWakeLock).toBe('function');
    expect(typeof result.current.releaseWakeLock).toBe('function');
  });

  it('should request wake lock on mount', async () => {
    const { result } = renderHook(() => useScreenWakeLock());
    
    // Wait for effect to run
    await waitFor(() => {});
    
    expect((navigator as any).wakeLock.request).toHaveBeenCalledWith('screen');
  });

  it('should set isActive when wake lock is acquired', async () => {
    (navigator as any).wakeLock.request = vi.fn().mockResolvedValue(mockWakeLock);
    
    const { result } = renderHook(() => useScreenWakeLock());
    
    await waitFor(() => {
      expect(result.current.isActive).toBe(true);
    });
  });

  it('should release wake lock on unmount', async () => {
    const mockWakeLock = {
      type: 'screen' as const,
      released: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      release: vi.fn().mockResolvedValue(undefined),
    };
    (navigator as any).wakeLock.request = vi.fn().mockResolvedValue(mockWakeLock);

    const { result, unmount } = renderHook(() => useScreenWakeLock());
    
    await waitFor(() => {
      expect(result.current.isActive).toBe(true);
    });
    
    unmount();
    
    await waitFor(() => {
      expect(mockWakeLock.release).toHaveBeenCalled();
    });
  });

  it('should handle unsupported wake lock API', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    // Remove wakeLock from navigator
    delete (navigator as any).wakeLock;
    
    const { result } = renderHook(() => useScreenWakeLock());
    
    // Wait for effect to run
    await waitFor(() => {});
    
    expect(result.current.isActive).toBe(false);
    expect(consoleLogSpy).toHaveBeenCalledWith('Screen Wake Lock API not supported');
    
    consoleLogSpy.mockRestore();
  });
});

describe('NoSleep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create and enable NoSleep', () => {
    const noSleep = new NoSleep();
    
    // Mock video element
    const videoElement = document.createElement('video');
    vi.spyOn(document, 'createElement').mockReturnValue(videoElement);
    vi.spyOn(document.body, 'appendChild');
    
    // Mock video play
    vi.spyOn(videoElement, 'play').mockResolvedValue(undefined);
    
    noSleep.enable();
    
    expect(noSleep).toBeDefined();
  });
});
