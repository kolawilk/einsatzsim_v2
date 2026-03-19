import { useEffect, useCallback, useRef } from "react";
import { audioEngine, StateAudioConfig, AudioLayerType } from "@/lib/audioEngine";

/**
 * Audio layer hook that manages audio playback for state machine states
 */
export function useAudio() {
  const isMounted = useRef(false);

  // Initialize audio engine on mount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      audioEngine.stopAll();
    };
  }, []);

  /**
   * Play audio for a state transition
   */
  const playStateAudio = useCallback(
    async (
      state: string,
      config: StateAudioConfig | undefined,
      previousState: string | null = null
    ) => {
      if (!config) return;

      // Stop audio from previous state
      if (previousState) {
        audioEngine.stopState(previousState);
      }

      // Play sound_in immediately
      await audioEngine.playSoundIn(state, config.sound_in);

      // Start floor (background) sounds
      await audioEngine.playSoundFloor(state, config.sound_floor);

      // Start random sounds
      if (config.sound_random) {
        audioEngine.playSoundRandom(state, config.sound_random);
      }

      // Start sequence sounds
      if (config.sound_sequence) {
        await audioEngine.playSoundSequence(state, config.sound_sequence);
      }
    },
    []
  );

  /**
   * Play exit audio before transitioning to next state
   */
  const playExitAudio = useCallback(
    async (state: string, config: StateAudioConfig | undefined) => {
      if (!config || !config.sound_out) return;
      await audioEngine.playSoundOut(state, config.sound_out);
    },
    []
  );

  /**
   * Stop all audio for a specific state
   */
  const stopAudio = useCallback((state: string) => {
    audioEngine.stopState(state);
  }, []);

  /**
   * Stop all audio globally
   */
  const stopAllAudio = useCallback(() => {
    audioEngine.stopAll();
  }, []);

  /**
   * Set audio volume (0-1)
   */
  const setVolume = useCallback((volume: number) => {
    audioEngine.setVolume(volume);
  }, []);

  /**
   * Get current audio volume
   */
  const getVolume = useCallback((): number => {
    return audioEngine.getVolume();
  }, []);

  /**
   * Preload audio files for a mission
   */
  const preloadMissionAudio = useCallback(
    async (states: Record<string, StateAudioConfig>) => {
      const audioPaths = new Set<string>();

      // Collect all audio paths
      Object.values(states).forEach((stateConfig) => {
        const layers: AudioLayerType[] = [
          "sound_in",
          "sound_floor",
          "sound_random",
          "sound_sequence",
          "sound_out",
        ];
        layers.forEach((layer) => {
          const src = stateConfig[layer];
          if (src) {
            if (Array.isArray(src)) {
              src.forEach((s) => audioPaths.add(s));
            } else if (src) {
              audioPaths.add(src);
            }
          }
        });
      });

      // Preload all audio files
      const promises = Array.from(audioPaths).map((src) => {
        // Use relative path from public directory
        const path = src.startsWith("/") ? src : `/${src}`;
        return audioEngine.preloadAudio(`audio_${src}`, path);
      });

      await Promise.all(promises);
    },
    []
  );

  return {
    playStateAudio,
    playExitAudio,
    stopAudio,
    stopAllAudio,
    setVolume,
    getVolume,
    preloadMissionAudio,
  };
}
