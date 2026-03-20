"use client";

import { useStateMachine } from "@/hooks/useStateMachine";
import { useState } from "react";
import { STATE_SEQUENCE } from "@/hooks/useStateMachine";

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
    onStateChange: (newState: string, previousState: string) => {
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
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Verlauf:</p>
          <p className="text-zinc-600 dark:text-zinc-300 font-mono">
            {context.history.length > 0 ? context.history.join(" → ") : "Kein Verlauf"}
          </p>
        </div>
        <div className="mt-2 flex justify-between text-sm text-zinc-500">
          <span>Kann zurückgehen: {canGoBack ? "Ja" : "Nein"}</span>
          <span>Kann vorwärts: {canGoForward ? "Ja" : "Nein"}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 w-full max-w-md">
        <button
          onClick={goPrev}
          disabled={!canGoBack}
          className="flex-1 px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-50"
        >
          ← Zurück
        </button>
        <button
          onClick={goNext}
          disabled={!canGoForward}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Weiter →
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8 w-full max-w-md">
        <button
          onClick={skip}
          className="flex-1 px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          Überspringen
        </button>
        <button
          onClick={reset}
          className="flex-1 px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          Reset
        </button>
      </div>

      {/* Direct State Selection */}
      <div className="mb-8 w-full max-w-md">
        <h3 className="font-semibold mb-2 text-center">Direktwahl:</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {STATE_SEQUENCE.map((s) => (
            <button
              key={s}
              onClick={() => goToState(s)}
              className={`px-4 py-2 rounded ${
                state === s
                  ? "bg-blue-600 text-white"
                  : "border hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow">
        <label htmlFor="autoAdvance" className="font-medium">
          Automatisch weiter
        </label>
        <input
          id="autoAdvance"
          type="checkbox"
          checked={autoAdvance}
          onChange={(e) => setAutoAdvance(e.target.checked)}
        />
      </div>
    </div>
  );
}
