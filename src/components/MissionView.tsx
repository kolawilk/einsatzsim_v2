"use client";

import { useStateMachine } from "@/hooks/useStateMachine";
import type { StateMachineState } from "@/types";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { SettingsDialog, loadSettings, type Settings } from "@/components/ui";
import { SettingsIcon } from "lucide-react";

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
  autoAdvance: initialAutoAdvance = false,
  onStateChange,
}: MissionViewProps) {
  // Load settings from localStorage on mount
  const [settings, setSettings] = useState<Settings>(() => {
    const loaded = loadSettings();
    return {
      autoAdvance: initialAutoAdvance ?? loaded.autoAdvance,
    };
  });

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
    setAudioConfigs,
  } = useStateMachine({
    autoAdvance: settings.autoAdvance,
    onStateChange,
  });

  // Set default audio configs for states (using placeholder audio)
  useEffect(() => {
    const audioConfigs: Record<string, { sound_in?: string; sound_floor?: string[] }> = {
      idle: {
        sound_in: "/audio/call_start.mp3",
        sound_floor: ["/audio/ambient_idle.mp3"],
      },
      calling: {
        sound_in: "/audio/call_received.mp3",
        sound_floor: ["/audio/ambient_calling.mp3"],
      },
      alerting: {
        sound_in: "/audio/alarm_start.mp3",
        sound_floor: ["/audio/ambient_alert.mp3", "/audio/siren_fade.mp3"],
      },
      deploying: {
        sound_in: "/audio/deploy_start.mp3",
        sound_floor: ["/audio/ambient_driving.mp3"],
      },
      arriving: {
        sound_in: "/audio/arrive_start.mp3",
        sound_floor: ["/audio/ambient_scene.mp3"],
      },
      returning: {
        sound_in: "/audio/return_start.mp3",
        sound_floor: ["/audio/ambient_return.mp3"],
      },
    };
    setAudioConfigs(audioConfigs as any);
  }, [setAudioConfigs]);

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
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
          <span>Kann zurückgehen: {canGoBack ? "Ja" : "Nein"}</span>
          <span>Kann vorwärts: {canGoForward ? "Ja" : "Nein"}</span>
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
              onClick={() => goToState(s as StateMachineState)}
              variant={state === s ? "default" : "outline"}
              className="flex-1 min-w-[80px]"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Settings Dialog */}
      <div className="mt-4">
        <SettingsDialog onSettingsChange={handleSettingsChange} />
      </div>
    </div>
  );
}

export default MissionView;
