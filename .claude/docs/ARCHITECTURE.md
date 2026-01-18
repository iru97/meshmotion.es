# MeshMotion Architecture

## Overview

MeshMotion is a client-side 3D model viewer built as a static Next.js application. All 3D rendering happens in the browser using WebGL via Three.js.

## Data Flow

```
User Upload → Format Detection → Conversion (if needed) → GLB Loading → Scene Rendering
                                       ↓
                              AssimpJS (WASM)
```

## State Architecture

### Zustand Store (`viewer-store.ts`)

Single source of truth for all application state:

```
ViewerState
├── Model Data
│   ├── currentCharacter: GLTFModel | null
│   ├── uploadedCharacters: GLTFModel[]
│   ├── currentAnimation: AnimationClip | null
│   └── uploadedAnimations: AnimationClipWithMetadata[]
│
├── Playback Control
│   ├── isPlaying: boolean
│   ├── playbackSpeed: number
│   ├── currentTime: number
│   ├── duration: number
│   └── loop: boolean
│
├── View Settings
│   ├── lightingPreset: LightingPreset
│   ├── materialPreset: MaterialPreset
│   ├── environmentPreset: EnvironmentPreset
│   └── showGrid: boolean
│
├── UI State
│   ├── selectedExportFormat: ExportFormat | null
│   ├── rightPanelTab: string
│   └── isLoadingModel: boolean
│
└── Comparison Mode
    ├── enabled: boolean
    ├── layout: 'vertical' | 'horizontal'
    ├── syncPlayback: boolean
    ├── view1: ViewState
    └── view2: ViewState
```

### Middleware Stack

```typescript
create<ViewerState>()(
  devtools(              // Chrome DevTools integration
    persist(             // LocalStorage persistence
      (set) => ({...}),
      {
        name: 'viewer-storage',
        partialize: (state) => ({
          // Only persist user preferences
          lightingPreset: state.lightingPreset,
          materialPreset: state.materialPreset,
          // NOT runtime data like currentCharacter
        })
      }
    ),
    { name: 'ViewerStore' }
  )
)
```

## Component Architecture

### Render Tree

```
App (layout.tsx)
└── MainViewer (page.tsx)
    ├── ActionToolbar          # Top toolbar
    ├── Scene                  # 3D Canvas container
    │   └── Canvas (R3F)
    │       ├── Environment    # HDR environment
    │       ├── Lighting       # Light rig
    │       ├── Model          # GLTF model + animations
    │       └── OrbitControls  # Camera controls
    ├── RightSidebar           # Settings panels
    │   ├── AnimationControls
    │   ├── CharacterSelector
    │   ├── AnimationSelector
    │   └── SettingsTabs
    │       ├── LightingSettings
    │       ├── MaterialSettings
    │       └── EnvironmentSettings
    ├── AssetsPanel            # Asset library
    └── ExportModal            # Export dialog
```

### Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| `Scene` | Canvas setup, mode switching, hook initialization |
| `Model` | GLTF rendering, animation mixer, time sync |
| `Lighting` | Apply lighting preset from store |
| `AnimationControls` | Playback UI, timeline scrubbing |
| `ExportModal` | Format selection, options, export trigger |

## Hook Architecture

### Hook Dependency Graph

```
useGLTFLoader
├── useFormatConverter (format detection & conversion)
├── useViewerStore (state updates)
└── indexedDBStorage (persistence)

useFormatExporter
├── three-exporters (format-specific exporters)
└── useViewerStore (model access)

useKeyboardShortcuts
└── useViewerStore (direct state access via getState())

useAnimations (@react-three/drei)
└── Animation mixer management
```

### Hook Patterns

**1. Loading Hook Pattern**
```typescript
function useLoader() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (input) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await doLoad(input)
      return { success: true, data: result }
    } catch (e) {
      setError(e.message)
      return { success: false, error: e.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { load, isLoading, error, reset: () => setError(null) }
}
```

**2. Store Selector Hook Pattern**
```typescript
// Create reusable selector hooks
export const useCurrentModel = () => useViewerStore((s) => s.currentCharacter)
export const useIsPlaying = () => useViewerStore((s) => s.isPlaying)
export const usePlaybackActions = () => useViewerStore((s) => ({
  togglePlay: s.togglePlay,
  setSpeed: s.setSpeed,
}), shallow)
```

## File Format Flow

### Import Flow

```
File Drop/Select
      ↓
validateFile() - Check size & extension
      ↓
detectFileFormat() - Determine format
      ↓
[If not GLB/GLTF]
      ↓
convertToGLB() - AssimpJS WASM conversion
      ↓
GLTFLoader.loadAsync() - Parse GLB
      ↓
normalizeModel() - Scale & center
      ↓
Store update + IndexedDB persist
```

### Export Flow

```
Export button click
      ↓
ExportModal opens
      ↓
Select format, options, filename
      ↓
exportModel(model, format, options)
      ↓
[Format-specific exporter]
      ↓
Blob creation
      ↓
downloadFile() - Trigger download
```

## Performance Considerations

### Three.js Optimizations

1. **Geometry Reuse**: Memoize geometries with `useMemo`
2. **Material Sharing**: Define materials outside components
3. **Draw Call Reduction**: Use `InstancedMesh` for repeated objects
4. **Frustum Culling**: Ensure proper bounding boxes
5. **Disposal**: Always clean up in useEffect returns

### React Optimizations

1. **Selector Granularity**: Select minimum needed state
2. **Memo Components**: Wrap expensive children
3. **Lazy Loading**: Dynamic imports for modals/panels
4. **Event Debouncing**: Throttle slider updates

### Memory Management

1. **Model Unloading**: Dispose when switching models
2. **Texture Limits**: Warn on large textures
3. **Animation Caching**: Cache parsed animations
4. **IndexedDB Cleanup**: Limit stored assets
