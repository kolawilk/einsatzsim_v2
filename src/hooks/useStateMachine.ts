import { useState, useCallback, useRef } from "react";
import type {
  StateMachineState,
  StateMachineContext,
  StateMachineOptions,
} from "@/types";

const STATE_SEQUENCE: StateMachineState[] = [
  "idle",
  "calling",
  "alerting",
  "deploying",
  "arriving",
  "returning",
];

const getInitialState = (): StateMachineState => "idle";

export function useStateMachine(options: StateMachineOptions = {}) {
  const { autoAdvance = false, onStateChange } = options;

  const [state, setState] = useState<StateMachineState>(getInitialState);
  const [history, setHistory] = useState<StateMachineState[]>(["idle"]);
  const historyRef = useRef<StateMachineState[]>(["idle"]);

  const currentStateIndex = STATE_SEQUENCE.indexOf(state);
  const canGoBack = currentStateIndex > 0;
  const canGoForward = currentStateIndex < STATE_SEQUENCE.length - 1;

  const transitionTo = useCallback(
    (newState: StateMachineState) => {
      if (newState === state) return;

      const previousState = state;
      setState(newState);
      setHistory((prev) => {
        const newHistory = [...prev, newState] as StateMachineState[];
        historyRef.current = newHistory;
        return newHistory.slice(-50); // Keep last 50 states to prevent memory issues
      });

      if (onStateChange) {
        onStateChange(newState, previousState);
      }
    },
    [state, onStateChange]
  );

  const goNext = useCallback(() => {
    if (!canGoForward) return;
    const nextState = STATE_SEQUENCE[currentStateIndex + 1];
    transitionTo(nextState);
  }, [currentStateIndex, canGoForward, transitionTo]);

  const goPrev = useCallback(() => {
    if (!canGoBack) return;
    const prevState = STATE_SEQUENCE[currentStateIndex - 1];
    transitionTo(prevState);
  }, [currentStateIndex, canGoBack, transitionTo]);

  const reset = useCallback(() => {
    transitionTo("idle");
  }, [transitionTo]);

  const skip = useCallback(() => {
    if (canGoForward) {
      goNext();
    } else {
      reset();
    }
  }, [canGoForward, goNext, reset]);

  const goToState = useCallback(
    (targetState: StateMachineState) => {
      if (!STATE_SEQUENCE.includes(targetState)) return;
      transitionTo(targetState);
    },
    [transitionTo]
  );

  const goToIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= STATE_SEQUENCE.length) return;
      transitionTo(STATE_SEQUENCE[index]);
    },
    [transitionTo]
  );

  const context: StateMachineContext = {
    state,
    history: historyRef.current,
    canGoBack,
    canGoForward,
  };

  return {
    // State
    state,
    context,

    // Actions
    goNext,
    goPrev,
    reset,
    skip,
    goToState,
    goToIndex,

    // Helpers
    STATE_SEQUENCE,
    currentStateIndex,
    canGoBack,
    canGoForward,
  };
}
