# Einsatzsim v2 - Architecture

## Overview

Einsatzsim is a web-based mission simulator for fire department play scenarios, optimized for iPad/iPhone with AlwaysOn display support.

## Core Concepts

### State Machine
The application uses a finite state machine with the following states:
- **idle**: Initial state, waiting for mission start
- **calling**: Emergency call received
- **alerting**: Alarm sounds, crew assembles
- **deploying**: Crew deploys to scene
- **arriving**: Arrived at emergency scene
- **returning**: Mission complete, returning to station

### Audio System
Each state supports multiple audio layers:
- `sound_in`: Played immediately on state entry
- `sound_floor`: Background ambience (looped, overlapping)
- `sound_random`: Random intermittent sounds
- `sound_sequence`: Sequential audio playback
- `sound_out`: Played before transitioning to next state

### Mission Format (YAML)
```yaml
mission:
  id: string
  title: string
  states:
    idle:
      image: string
      sound_in: string
      sound_floor: [string]
      sound_random: [string]
      sound_sequence: [string]
      sound_out: string
      auto_advance: boolean
      duration_ms: number
    # ... other states
```

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI**: shadcn/ui components
- **State Management**: React Context + useReducer
- **Audio**: Web Audio API with Howler.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide React + Emojis

## Project Structure

```
einsatzsim/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main app view
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── StateButton.tsx   # Central state control button
│   │   ├── MissionView.tsx   # Full-screen mission display
│   │   ├── SettingsDialog.tsx # Settings modal
│   │   └── AudioEngine.tsx   # Audio management
│   ├── hooks/
│   │   ├── useStateMachine.ts # State machine logic
│   │   └── useAudio.ts       # Audio playback hooks
│   ├── lib/
│   │   ├── missions.ts       # Mission loader/parser
│   │   └── utils.ts          # Utilities
│   └── types/
│       └── index.ts          # TypeScript definitions
├── public/
│   ├── audio/                # Audio assets
│   └── images/               # State images
├── docs/
│   └── architecture.md       # This file
└── tasks/                    # Backlog
```

## Key Features

### AlwaysOn Support
- Uses `screen.keepAwake` API where available
- Fallback: NoSleep.js for older browsers
- Optimized rendering to minimize battery drain

### Semi-Automatic Mode
Configurable auto-transitions between states with manual checkpoints at key decision points.

### Session Management
- Missions don't repeat during a session
- Session state persists in memory
- Abort mission capability

## Performance Considerations

- Images: Preloaded, optimized for mobile
- Audio: Lazy loaded, cached after first play
- Animations: CSS-based, GPU accelerated
- No unnecessary re-renders
