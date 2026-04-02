import { useState, useEffect, useCallback } from 'react';

// Define WakeLock interface
interface WakeLock {
  type: 'screen';
  released: boolean;
  addEventListener(type: 'release', handler: (event: any) => void): void;
  removeEventListener(type: 'release', handler: (event: any) => void): void;
  release(): Promise<void>;
}

// Define WakeLockType interface
interface WakeLockType {
  request(type: 'screen'): Promise<WakeLock>;
}

// Extend navigator interface globally
interface Navigator {
  wakeLock?: WakeLockType;
}

export function useScreenWakeLock() {
  const [isActive, setIsActive] = useState(false);
  const [wakeLockInstance, setWakeLockInstance] = useState<WakeLock | null>(null);

  const requestWakeLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) {
      console.log('Screen Wake Lock API not supported');
      return null;
    }

    try {
      if (wakeLockInstance) {
        // Already have a wake lock
        return wakeLockInstance;
      }

      const newWakeLock = await navigator.wakeLock.request('screen');
      setIsActive(true);

      newWakeLock.addEventListener('release', () => {
        setIsActive(false);
        setWakeLockInstance(null);
      });

      setWakeLockInstance(newWakeLock);
      return newWakeLock;
    } catch (err) {
      console.error(`${(err as Error).name}, ${(err as Error).message}`);
      return null;
    }
  }, [wakeLockInstance]);

  const releaseWakeLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) {
      return;
    }

    if (!wakeLockInstance) {
      return;
    }

    try {
      await wakeLockInstance.release();
      setIsActive(false);
      setWakeLockInstance(null);
    } catch (err) {
      console.error(`${(err as Error).name}, ${(err as Error).message}`);
      setWakeLockInstance(null);
      setIsActive(false);
    }
  }, [wakeLockInstance]);

  useEffect(() => {
    // Request wake lock on mount
    requestWakeLock();

    // Release on unmount
    return () => {
      releaseWakeLock();
    };
  }, [requestWakeLock, releaseWakeLock]);

  return { isActive, requestWakeLock, releaseWakeLock };
}

// NoSleep fallback for iOS Safari
export class NoSleep {
  private enabled: boolean = false;
  private videoElement?: HTMLVideoElement;

  enable() {
    if (this.enabled) return;
    this.enabled = true;

    // Create a silent video element
    this.videoElement = document.createElement('video');
    this.videoElement.src = '';
    this.videoElement.loop = true;
    this.videoElement.muted = true;
    this.videoElement.volume = 0;
    this.videoElement.playsInline = true;
    this.videoElement.autoplay = true;

    // Append to body
    document.body.appendChild(this.videoElement);

    // Play the video to prevent sleep
    this.videoElement.play().catch((error) => {
      console.error('NoSleep: ', error);
      this.enabled = false;
    });
  }

  disable() {
    if (!this.enabled || !this.videoElement) return;
    this.enabled = false;

    this.videoElement.pause();
    document.body.removeChild(this.videoElement);
    this.videoElement = undefined;
  }
}
