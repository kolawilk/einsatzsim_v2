export type StateMachineState =
  | "idle"
  | "calling"
  | "alerting"
  | "deploying"
  | "arriving"
  | "returning";

export interface StateConfig {
  image: string;
  sound_in?: string;
  sound_floor?: string[];
  sound_random?: string[];
  sound_sequence?: string[];
  sound_out?: string;
  auto_advance?: boolean;
  duration_ms?: number;
}

export interface Mission {
  id: string;
  title: string;
  states: Record<StateMachineState, StateConfig>;
}

export interface StateMachineEvent {
  type: "START" | "NEXT" | "PREV" | "RESET" | "SKIP";
}

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
