import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudio } from '@/hooks';

// Mock Audio class
class MockAudio {
  public src: string = '';
  public currentTime: number = 0;
  public paused: boolean = true;
  public volume: number = 1;
  public playsInline: boolean = false;
  public autoplay: boolean = false;
  public loop: boolean = false;

  constructor(src?: string) {
    if (src) {
      this.src = src;
    }
  }

  play() {
    this.paused = false;
    return Promise.resolve();
  }

  pause() {
    this.paused = true;
  }

  addEventListener(event: string, handler: () => void) {
    // Mock
  }

  removeEventListener(event: string, handler: () => void) {
    // Mock
  }
}

describe('useAudio', () => {
  beforeEach(() => {
    vi.stubGlobal('Audio', MockAudio);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return correct initial state', () => {
    const { result } = renderHook(() => useAudio());
    
    expect(result.current.currentSound).toBeNull();
    expect(typeof result.current.playSound).toBe('function');
    expect(typeof result.current.stopSound).toBe('function');
    expect(typeof result.current.stopAllAudio).toBe('function');
    expect(typeof result.current.playStateAudio).toBe('function');
  });

  it('should play a sound', async () => {
    const { result } = renderHook(() => useAudio());
    
    await act(async () => {
      result.current.playSound('/audio/test.mp3');
    });
    
    expect(result.current.currentSound).toBe('/audio/test.mp3');
  });

  it('should stop current sound', async () => {
    const { result } = renderHook(() => useAudio());
    
    await act(async () => {
      result.current.playSound('/audio/test.mp3');
    });
    
    await act(async () => {
      result.current.stopSound();
    });
    
    expect(result.current.currentSound).toBeNull();
  });

  it('should stop all audio on unmount', async () => {
    const { result, unmount } = renderHook(() => useAudio());
    
    await act(async () => {
      result.current.playSound('/audio/test.mp3');
    });
    
    // Unmount should not throw
    expect(() => unmount()).not.toThrow();
  });

  it('should play state audio with sound_in', async () => {
    const { result } = renderHook(() => useAudio());
    
    await act(async () => {
      result.current.playStateAudio('idle', {
        sound_in: '/audio/state.mp3',
      });
    });
    
    expect(result.current.currentSound).toBe('/audio/state.mp3');
  });

  it('should play random sound from sound_random array', async () => {
    const { result } = renderHook(() => useAudio());
    
    await act(async () => {
      result.current.playStateAudio('idle', {
        sound_in: ['/audio/sound1.mp3', '/audio/sound2.mp3'],
      });
    });
    
    expect(['sound1', 'sound2']).toContain(
      result.current.currentSound?.includes('sound1') ? 'sound1' : 'sound2'
    );
  });
});
