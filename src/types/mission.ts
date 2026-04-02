// Mission types for Einsatzsim v2

export type StateMachineState =
  | "idle"
  | "calling"
  | "alerting"
  | "deploying"
  | "arriving"
  | "returning";

export interface MissionState {
  image: string;
  sound_in?: string | string[];
  sound_floor?: string | string[];
  sound_random?: string | string[];
  sound_sequence?: string | string[];
  sound_out?: string | string[];
  auto_advance?: boolean;
  duration_ms?: number;
}

export interface Mission {
  id: string;
  title: string;
  description?: string;
  states: Record<StateMachineState, MissionState>;
  meta?: {
    version?: string;
    author?: string;
    created?: string;
    tags?: string[];
  };
}

export interface LoadedMission {
  mission: Mission;
  source: string;
}

export type MissionValidationError = {
  field: string;
  message: string;
  value?: unknown;
};

export type MissionLoadResult =
  | { success: true; data: LoadedMission }
  | { success: false; errors: MissionValidationError[] };

// State machine context and options (shared types)
export interface StateMachineContext {
  state: StateMachineState;
  history: StateMachineState[];
  canGoBack: boolean;
  canGoForward: boolean;
}

export interface StateMachineOptions {
  autoAdvance?: boolean;
  onStateChange?: (state: StateMachineState, previousState: StateMachineState) => void;
}
