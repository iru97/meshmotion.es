# Loop Implementation State

## Status: READY_TO_START

## Original Request
> Implement MeshMotion Biomechanics MVP based on the researched PRD. Features include: biomechanics data import (BVH, CSV), muscle activation heatmap, trajectory playback, force vector visualization, and shareable URL state.

## Requirements

**Scope:** Medium-Large (5 core features, new route, new store)

**Success Criteria:**
- [ ] /biomechanics route loads without errors
- [ ] BVH files can be imported and visualized
- [ ] Muscle activation heatmap renders with viridis colormap
- [ ] Timeline controls work (play/pause/scrub/speed)
- [ ] Force vectors display when data is loaded
- [ ] URL state encodes/restores camera and playback
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Maintains 60fps with medium complexity model

**Constraints:**
- Client-side only (no backend)
- Must follow existing MeshMotion patterns (Zustand, R3F, shadcn/ui)
- Must be accessible (keyboard navigation, ARIA labels)
- Must not break existing viewer functionality

## Tasks

### Phase 1: Foundation
- [ ] [1/25] Create `/app/biomechanics/page.tsx` route
- [ ] [2/25] Create `types/biomechanics.ts` with interfaces (MotionData, ActivationData, ForceData)
- [ ] [3/25] Create `lib/store/biomechanics-store.ts` with Zustand store
- [ ] [4/25] Create `components/biomechanics/BiomechanicsScene.tsx` base component
- [ ] [5/25] Add basic layout with Canvas and placeholder panels

### Phase 2: Timeline Controls
- [ ] [6/25] Create `components/biomechanics/TimelineControls.tsx`
- [ ] [7/25] Implement play/pause button with keyboard shortcut (Space)
- [ ] [8/25] Implement timeline slider with frame scrubbing
- [ ] [9/25] Implement speed selector (0.25x-2x)
- [ ] [10/25] Add time display (MM:SS.ms format)

### Phase 3: Data Import
- [ ] [11/25] Create `lib/parsers/bvh-parser.ts` using THREE.BVHLoader
- [ ] [12/25] Create `lib/parsers/csv-parser.ts` for motion data
- [ ] [13/25] Create `lib/parsers/activation-parser.ts` for muscle data
- [ ] [14/25] Create `hooks/use-biomechanics-loader.ts` hook
- [ ] [15/25] Add drag-and-drop file upload UI

### Phase 4: Visualization
- [ ] [16/25] Create `lib/colormaps/index.ts` with viridis, cividis, etc.
- [ ] [17/25] Create `components/biomechanics/MuscleHeatmap.tsx` with vertex colors
- [ ] [18/25] Create `components/biomechanics/ActivationLegend.tsx`
- [ ] [19/25] Create `components/biomechanics/ForceVectors.tsx` with ArrowHelper
- [ ] [20/25] Sync visualization updates with timeline playback

### Phase 5: URL State & Sharing
- [ ] [21/25] Create `hooks/use-url-state.ts` with lz-string compression
- [ ] [22/25] Implement URL state encoding (camera, time, speed)
- [ ] [23/25] Implement URL state restoration on load
- [ ] [24/25] Add "Copy Link" button with toast notification

### Phase 6: Polish
- [ ] [25/25] Final integration test, performance verification, accessibility check

## Progress Log
- 2026-01-30 22:45: Loop state created from PRD research
- Status: Ready for implementation

## Technical References

**Key Files to Reference:**
- Existing store pattern: `src/lib/store/viewer-store.ts`
- Existing scene pattern: `src/components/viewer/Scene.tsx`
- Existing model pattern: `src/components/viewer/Model.tsx`
- UI components: `src/components/ui/`

**Dependencies to Add:**
- `lz-string` - URL state compression
- `papaparse` - CSV parsing (if not using simple regex)

**Performance Targets:**
- <100 draw calls
- 60fps sustained
- <500MB memory
- <3s initial load

## Notes for Implementation

1. **Start with types** - Define interfaces before components
2. **Use existing patterns** - Copy from viewer-store.ts for consistency
3. **Test incrementally** - Validate after each task
4. **Commit atomically** - One task = one commit
5. **Search before creating** - Use Task(Explore) to find existing utilities
