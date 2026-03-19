# Einsatzsim v2 Backlog

## Ready for Development

### Task 1: Project Setup & State Machine Foundation
**Priority**: High | **Est**: 4h
- Initialize Next.js project with TypeScript
- Configure Tailwind CSS
- Set up shadcn/ui
- Create TypeScript types for State Machine and Mission format
- Implement basic useStateMachine hook with idle → calling → alerting → deploying → arriving → returning → idle flow
- Create simple test page showing current state

**Acceptance Criteria**:
- [ ] Project builds without errors
- [ ] State machine transitions work manually
- [ ] State is displayed on test page

---

### Task 2: Audio Engine Implementation
**Priority**: High | **Est**: 6h
- Integrate Howler.js for audio management
- Implement audio layer system (sound_in, sound_floor, sound_random, sound_sequence, sound_out)
- Handle audio preloading and caching
- Implement crossfade between ambient sounds
- Add volume controls

**Acceptance Criteria**:
- [ ] All 5 audio types play correctly
- [ ] Background sounds loop seamlessly
- [ ] Random sounds play at appropriate intervals
- [ ] Sequential sounds play in order
- [ ] Audio transitions smoothly between states

---

### Task 3: Mission YAML Loader & Parser
**Priority**: High | **Est**: 3h
- Create mission YAML schema validation
- Implement mission loader with js-yaml
- Create sample mission file
- Add mission selection logic
- Ensure missions don't repeat in session

**Acceptance Criteria**:
- [ ] YAML missions load and validate correctly
- [ ] Invalid YAML shows clear error
- [ ] Sample mission provided
- [ ] Mission selection works

---

### Task 4: Full-Screen Mission View
**Priority**: High | **Est**: 4h
- Create MissionView component with 100vh image display
- Implement fit: cover for images
- Add state-based image switching
- Create StateButton component (large, round, emoji-based)
- Style with fire department red theme

**Acceptance Criteria**:
- [ ] Images display full viewport
- [ ] State button is centered, large, round
- [ ] Button shows appropriate emoji per state
- [ ] Visual design matches fire department theme

---

### Task 5: Settings Dialog & Semi-Automatic Mode
**Priority**: Medium | **Est**: 4h
- Create SettingsDialog with shadcn/ui Dialog
- Add toggle for semi-automatic mode
- Configure auto-advance timing per state
- Persist settings to localStorage
- Handle manual vs automatic transitions

**Acceptance Criteria**:
- [ ] Settings open/close correctly
- [ ] Semi-automatic mode toggle works
- [ ] Auto-transitions happen at correct times
- [ ] Manual checkpoints work as specified
- [ ] Settings persist across reloads

---

### Task 6: AlwaysOn & Mobile Optimization
**Priority**: Medium | **Est**: 3h
- Implement screen wake lock API
- Add NoSleep.js fallback
- Optimize for iPad Safari/Chrome
- Test on actual iPad device
- Minimize battery drain

**Acceptance Criteria**:
- [ ] Screen stays awake during mission
- [ ] Works on iPad Safari
- [ ] Works on iPad Chrome
- [ ] Battery usage is reasonable

---

### Task 7: Mission Abort & Session Management
**Priority**: Medium | **Est**: 2h
- Add abort mission functionality
- Return to idle state on abort
- Track played missions in session
- Prevent mission repetition
- Clear session on page reload option

**Acceptance Criteria**:
- [ ] Abort button works from any state
- [ ] Returns cleanly to idle
- [ ] Missions don't repeat until all played
- [ ] Session tracking works correctly

---

## Future / Nice-to-Have

- [ ] iOS App wrapper (Capacitor/Cordova)
- [ ] App Store submission
- [ ] Additional mission packs
- [ ] Sound effects library expansion
- [ ] Multi-language support
- [ ] Parental controls
