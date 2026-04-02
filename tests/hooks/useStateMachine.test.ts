import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStateMachine } from '@/hooks/useStateMachine';

describe('useStateMachine', () => {
  it('should have correct initial state', () => {
    const { result } = renderHook(() => useStateMachine());
    
    expect(result.current.state).toBe('idle');
    expect(result.current.currentStateIndex).toBe(0);
    expect(result.current.canGoBack).toBe(false);
    expect(result.current.canGoForward).toBe(true);
  });

  it('should navigate to next state', () => {
    const { result } = renderHook(() => useStateMachine());
    
    act(() => {
      result.current.goNext();
    });
    
    expect(result.current.state).toBe('calling');
    expect(result.current.currentStateIndex).toBe(1);
    expect(result.current.canGoBack).toBe(true);
  });

  it('should navigate to previous state', () => {
    const { result } = renderHook(() => useStateMachine());
    
    act(() => {
      result.current.goNext();
    });
    
    act(() => {
      result.current.goPrev();
    });
    
    expect(result.current.state).toBe('idle');
  });

  it('should reset to idle state', () => {
    const { result } = renderHook(() => useStateMachine());
    
    act(() => {
      result.current.goNext();
    });
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.state).toBe('idle');
  });

  it('should skip to next state when possible', () => {
    const { result } = renderHook(() => useStateMachine());
    
    act(() => {
      result.current.skip();
    });
    
    expect(result.current.state).toBe('calling');
  });

  it('should go to specific state', () => {
    const { result } = renderHook(() => useStateMachine());
    
    act(() => {
      result.current.goToState('arriving');
    });
    
    expect(result.current.state).toBe('arriving');
  });

  it('should go to state by index', () => {
    const { result } = renderHook(() => useStateMachine());
    
    act(() => {
      result.current.goToIndex(3);
    });
    
    expect(result.current.state).toBe('deploying');
  });

  it('should log error for invalid goToIndex', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useStateMachine());
    
    act(() => {
      result.current.goToIndex(-1);
    });
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('goToIndex: Invalid index')
    );
    
    consoleErrorSpy.mockRestore();
  });

  it('should track history', () => {
    const { result } = renderHook(() => useStateMachine());
    
    act(() => {
      result.current.goNext();
    });
    
    act(() => {
      result.current.goNext();
    });
    
    expect(result.current.context.history).toContain('idle');
    expect(result.current.context.history).toContain('calling');
    expect(result.current.context.history).toContain('alerting');
  });

  it('should call onStateChange callback', () => {
    const onStateChange = vi.fn();
    const { result } = renderHook(() => useStateMachine({ onStateChange }));
    
    act(() => {
      result.current.goNext();
    });
    
    expect(onStateChange).toHaveBeenCalledWith('calling', 'idle');
  });
});
