"use client";

import { useStateMachine } from "@/hooks/useStateMachine";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface MissionViewProps {
  title?: string;
  autoAdvance?: boolean;
  onStateChange?: (state: string, previousState: string) => void;
}

const STATE_CONFIG: Record<string, { icon: string; label: string; description: string }> = {
  idle: { icon: "🏠", label: "Bereit", description: "Warte auf Einsatz" },
  calling: { icon: "📞", label: "Alarmaufruf", description: "Rufe Einsatzkräfte" },
  alerting: { icon: "🔔", label: "Alarmierung", description: "Warnung aktiv" },
  deploying: { icon: "🚑", label: "Ausrücken", description: "Fahrt zum Einsatzort" },
  arriving: { icon: "🏭", label: "Eintreffen", description: "Am Einsatzort angekommen" },
  returning: { icon: "🏁", label: "Rückkehr", description: "Fahrt zurück" },
};

export function MissionView({
  title = "Einsatzanzeige",
  autoAdvance = false,
  onStateChange,
}: MissionViewProps) {
  const {
    state,
    context,
    goNext,
    goPrev,
    reset,
    skip,
    goToState,
    goToIndex,
    currentStateIndex,
    canGoBack,
    canGoForward,
    STATE_SEQUENCE,
  } = useStateMachine({
    autoAdvance,
    onStateChange,
  });

  const [isAutoAdvance, setIsAutoAdvance] = useState(autoAdvance);

  const handleAutoAdvanceChange = (checked: boolean) => {
    setIsAutoAdvance(checked);
    // Note: autoAdvance is passed via props, so this is a UI-only toggle
    // For a real implementation, you'd want to manage this state differently
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-6">
      <h1 className="text-3xl font-bold mb-8">{title}</h1>

      {/* Current State Display */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="text-9xl">{STATE_CONFIG[state]?.icon || "❓"}</div>
        <h2 className="text-2xl font-semibold capitalize">{state}</h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-300">
          {STATE_CONFIG[state]?.description || "Unbekannter Zustand"}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Schritt {currentStateIndex + 1} von {STATE_SEQUENCE.length}
        </p>
      </div>

      {/* Context Info */}
      <div className="mb-8 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow w-full max-w-md">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Verlauf:</p>
          <p className="text-zinc-600 dark:text-zinc-300 font-mono">
            {context.history.length > 0
              ? context.history.join(" → ")
              : "Kein Verlauf"}
          </p>
        </div>
        <div className="mt-2 flex justify-between text-sm text-zinc-500">
          <span>Can go back: {canGoBack ? "Ja" : "Nein"}</span>
          <span>Can go forward: {canGoForward ? "Ja" : "Nein"}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 w-full max-w-md">
        <Button
          onClick={goPrev}
          disabled={!canGoBack}
          variant="outline"
          className="flex-1"
        >
          ← Zurück
        </Button>
        <Button
          onClick={goNext}
          disabled={!canGoForward}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Weiter →
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8 w-full max-w-md">
        <Button onClick={skip} variant="outline" className="flex-1">
          Überspringen
        </Button>
        <Button onClick={reset} variant="outline" className="flex-1">
          Reset
        </Button>
      </div>

      {/* Direct State Selection */}
      <div className="mb-8 w-full max-w-md">
        <h3 className="font-semibold mb-2 text-center">Direktwahl:</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {STATE_SEQUENCE.map((s) => (
            <Button
              key={s}
              onClick={() => goToState(s)}
              variant={state === s ? "default" : "outline"}
              className="flex-1 min-w-[80px]"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow">
        <Label htmlFor="autoAdvance">Automatisch weiter</Label>
        <Switch
          id="autoAdvance"
          checked={isAutoAdvance}
          onCheckedChange={handleAutoAdvanceChange}
        />
      </div>
    </div>
  );
}

export default MissionView;
