import { Howl } from "howler";

/**
 * Audio layer types supported by the system
 */
export type AudioLayerType = "sound_in" | "sound_floor" | "sound_random" | "sound_sequence" | "sound_out";

/**
 * Configuration for a single audio layer
 */
export interface AudioLayerConfig {
  /** URL path to the audio file */
  src: string;
  /** Whether to loop the audio */
  loop?: boolean;
  /** Volume level (0-1) */
  volume?: number;
  /** Random delay min/max in ms for random sounds */
  randomDelay?: [min: number, max: number];
}

/**
 * Audio state for a mission state
 */
export interface StateAudioConfig {
  sound_in?: string | string[];
  sound_floor?: string | string[];
  sound_random?: string | string[];
  sound_sequence?: string | string[];
  sound_out?: string | string[];
  auto_advance?: boolean;
  duration_ms?: number;
}

/**
 * AudioEngine manages audio playback for the state machine
 */
export class AudioEngine {
  private sounds: Map<string, Howl> = new Map();
  private activeSounds: Map<string, Howl> = new Map();
  private floorSounds: Map<string, Howl[]> = new Map();
  private randomTimers: Map<string, NodeJS.Timeout[]> = new Map();
  private currentLayer: Map<string, string[]> = new Map();

  /**
   * Preload a single audio file
   */
  public preloadAudio(id: string, src: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.sounds.has(id)) {
        resolve();
        return;
      }

      const sound = new Howl({
        src: [src],
        volume: 1.0,
        onplayerror: (error) => {
          console.error(`Error playing audio ${id}:`, error);
        },
      });

      sound.on("loaded", () => {
        this.sounds.set(id, sound);
        resolve();
      });

      sound.on("loaderror", (errId, errorMsg) => {
        console.warn(`Load warning for ${id}:`, errorMsg);
        // Still resolve - missing audio is not a blocking error
        resolve();
      });
    });
  }

  /**
   * Preload multiple audio files
   */
  public async preloadAudioBatch(audios: { id: string; src: string }[]): Promise<void> {
    const promises = audios.map((audio) => this.preloadAudio(audio.id, audio.src));
    await Promise.all(promises);
  }

  /**
   * Play sound_in layer for a state
   */
  public playSoundIn(state: string, src?: string | string[]): Promise<void> {
    return this.playLayer(state, "sound_in", src);
  }

  /**
   * Play sound_floor layer for a state (looping background)
   */
  public async playSoundFloor(state: string, src?: string | string[]): Promise<void> {
    // Stop previous floor sounds
    this.stopLayer(state, "sound_floor");

    if (!src) return;

    const sources = Array.isArray(src) ? src : [src];
    const sounds: Howl[] = [];

    for (const s of sources) {
      const sound = await this.getOrCreateSound(s);
      if (sound) {
        sound.loop(true).volume(0.7);
        sound.play();
        sounds.push(sound);
      }
    }

    this.floorSounds.set(state, sounds);
    this.currentLayer.set(state, [...(this.currentLayer.get(state) || []), "sound_floor"]);
  }

  /**
   * Play sound_random layer for a state (intermittent sounds)
   */
  public playSoundRandom(
    state: string,
    src?: string | string[],
    delayRange: [number, number] = [1000, 5000]
  ): void {
    // Clear existing timers
    this.stopLayer(state, "sound_random");

    if (!src) return;

    const sources = Array.isArray(src) ? src : [src];

    const timers: NodeJS.Timeout[] = [];
    sources.forEach((s) => {
      const playRandom = () => {
        this.getOrCreateSound(s).then((sound) => {
          if (sound) {
            sound.play();
          }
        });

        // Schedule next play
        const delay = Math.random() * (delayRange[1] - delayRange[0]) + delayRange[0];
        timers.push(setTimeout(playRandom, delay));
      };
      playRandom();
    });

    this.randomTimers.set(state, timers);
  }

  /**
   * Play sound_sequence layer for a state
   */
  public async playSoundSequence(
    state: string,
    src?: string | string[]
  ): Promise<void> {
    if (!src) return;

    const sources = Array.isArray(src) ? src : [src];

    // Stop previous sequence if any
    this.stopLayer(state, "sound_sequence");

    let delay = 0;
    for (const s of sources) {
      setTimeout(() => {
        this.getOrCreateSound(s).then((sound) => {
          if (sound) {
            sound.play();
          }
        });
      }, delay);
      delay += 2000; // 2 seconds between each sound
    }

    this.currentLayer.set(state, [...(this.currentLayer.get(state) || []), "sound_sequence"]);
  }

  /**
   * Play sound_out layer for a state
   */
  public async playSoundOut(state: string, src?: string | string[]): Promise<void> {
    return this.playLayer(state, "sound_out", src);
  }

  /**
   * Play a specific audio layer
   */
  private async playLayer(state: string, layer: AudioLayerType, src?: string | string[]): Promise<void> {
    this.stopLayer(state, layer);

    if (!src) return;

    const sources = Array.isArray(src) ? src : [src];

    for (const s of sources) {
      const sound = await this.getOrCreateSound(s);
      if (sound) {
        sound.play();
        this.activeSounds.set(`${state}_${layer}`, sound);
      }
    }

    this.currentLayer.set(state, [...(this.currentLayer.get(state) || []), layer]);
  }

  /**
   * Stop all audio for a specific layer
   */
  public stopLayer(state: string, layer: AudioLayerType): void {
    // Stop active sounds
    const key = `${state}_${layer}`;
    const sound = this.activeSounds.get(key);
    if (sound) {
      sound.stop();
      this.activeSounds.delete(key);
    }

    // Stop floor sounds
    if (layer === "sound_floor") {
      const floorSounds = this.floorSounds.get(state);
      if (floorSounds) {
        floorSounds.forEach((s) => s.stop());
        this.floorSounds.delete(state);
      }
    }

    // Stop random timers
    if (layer === "sound_random") {
      const timers = this.randomTimers.get(state);
      if (timers) {
        timers.forEach((t) => clearTimeout(t));
        this.randomTimers.delete(state);
      }
    }
  }

  /**
   * Stop all audio for a state
   */
  public stopState(state: string): void {
    const layers = this.currentLayer.get(state) || [];
    layers.forEach((layer) => {
      this.stopLayer(state, layer as AudioLayerType);
    });
    this.currentLayer.delete(state);
  }

  /**
   * Stop all audio globally
   */
  public stopAll(): void {
    this.sounds.forEach((sound) => sound.stop());
    this.activeSounds.clear();
    this.floorSounds.clear();
    this.randomTimers.forEach((timers) => timers.forEach((t) => clearTimeout(t)));
    this.randomTimers.clear();
    this.currentLayer.clear();
  }

  /**
   * Set global volume
   */
  public setVolume(volume: number): void {
    Howler.volume(volume);
  }

  /**
   * Get current volume
   */
  public getVolume(): number {
    return Howler.volume();
  }

  /**
   * Get or create a Howl sound instance
   */
  private async getOrCreateSound(src: string): Promise<Howl | null> {
    // Generate a unique ID based on the source path
    const id = `audio_${src}`;

    if (this.sounds.has(id)) {
      return this.sounds.get(id) || null;
    }

    try {
      await this.preloadAudio(id, src);
      return this.sounds.get(id) || null;
    } catch (error) {
      console.error(`Failed to load audio ${src}:`, error);
      return null;
    }
  }

  /**
   * Unload all sounds
   */
  public destroy(): void {
    this.stopAll();
    this.sounds.forEach((sound) => sound.unload());
    this.sounds.clear();
  }
}

// Singleton instance
export const audioEngine = new AudioEngine();
