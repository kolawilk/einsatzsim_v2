"use client";

import { MissionView } from "@/components/MissionView";

export default function MissionPage() {
  const handleStateChange = (newState: string, previousState: string) => {
    console.log(`Zustandsänderung: ${previousState} → ${newState}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-50 dark:bg-black">
      <MissionView
        title="Einsatzanzeige"
        autoAdvance={false}
        onStateChange={handleStateChange}
      />
    </div>
  );
}
