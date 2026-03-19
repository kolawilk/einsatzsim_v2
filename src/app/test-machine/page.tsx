"use client";

import { useStateMachine } from "@/hooks/useStateMachine";
import { useState } from "react";

const STATE_ICONS: Record<string, string> = {
  idle: "🏠",
  calling: "📞",
  alerting: "🔔",
  deploying: "🚑",
  arriving: "🏭",
  returning: "🏁",
};

export default function TestMachinePage() {
  const {
    state,
    context,
    goNext,
    goPrev,
    reset,
    skip,
    goToState,
    currentStateIndex,
    canGoBack,
    canGoForward,
  } = useStateMachine({
    autoAdvance: false,
    onStateChange: (newState, previousState) => {
      console.log(`State changed: ${previousState} → ${newState}`);
    },
  });

  const [autoAdvance, setAutoAdvance] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-6">
      <h1 className="text-3xl font-bold mb-8">State Machine Test</h1>

      {/* Current State Display */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="text-9xl">{STATE_ICONS[state]}</div>
        <h2 className="text-2xl font-semibold capitalize">{state}</h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          Index: {currentStateIndex} / 5
        </p>
      </div>

      {/* Context Info */}
      <div className="mb-8 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow">
        <p>History: {context.history.join(" → ")}</p>
        <p className="text-sm text-zinc-500">
          Can go back: {canGoBack} | Can go forward: {canGoForward}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={goPrev}
          disabled={!canGoBack}
          className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded disabled:opacity-50"
        >
          ← Prev
        </button>
        <button
          onClick={goNext}
          disabled={!canGoForward}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next →
        </button>
        <button
          onClick={skip}
          className="px-4 py-2 bg-amber-500 text-white rounded"
        >
          Skip
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Reset
        </button>
      </div>

      {/* Direct State Selection */}
      <div className="mb-8">
        <h3 className="font-semibold mb-2">Jump to State:</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {(Object.keys(STATE_ICONS) as string[]).map((s) => (
            <button
              key={s}
              onClick={() => goToState(s as any)}
              className={`px-3 py-1 rounded ${
                state === s
                  ? "bg-blue-500 text-white"
                  : "bg-zinc-200 dark:bg-zinc-800"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="autoAdvance"
          checked={autoAdvance}
          onChange={(e) => setAutoAdvance(e.target.checked)}
        />
        <label htmlFor="autoAdvance">Auto-advance (placeholder)</label>
      </div>
    </div>
  );
}
