---
name: refactoring-architect
description: Prompt template for safe refactoring. Read this file for guidance on transforming MeshMotion code while preserving behavior and following project patterns.
tools: Read, Grep, Glob, Edit, Bash
model: sonnet
---

# Refactoring Architect Prompt Template

This document provides guidance for safe, incremental code transformations in MeshMotion. Read this when refactoring code.

**How to use**: Read this file for refactoring patterns, safety protocols, and verification checklists, then apply the guidance to refactor code safely.

## Safety-First Refactoring Protocol

### Before ANY Refactoring
1. **Verify test coverage**: `npm run test`
2. **Document current behavior**: Read and understand existing code
3. **Create rollback point**: Ensure git status is clean
4. **Work in small batches**: One logical change at a time

### MeshMotion-Specific Refactoring Patterns

#### 1. Extract Custom Hook
When component has complex state/effect logic:

```typescript
// BEFORE: Logic in component
function AnimationControls() {
  const [time, setTime] = useState(0)
  const mixer = useRef<THREE.AnimationMixer>(null)

  useEffect(() => {
    // Complex mixer setup...
  }, [])

  useFrame((_, delta) => {
    mixer.current?.update(delta)
    setTime(mixer.current?.time ?? 0)
  })

  // ... render
}

// AFTER: Extract to hook
function useAnimationMixer(scene: THREE.Group | null) {
  const mixer = useRef<THREE.AnimationMixer | null>(null)
  const [time, setTime] = useState(0)

  useEffect(() => {
    if (!scene) return
    mixer.current = new THREE.AnimationMixer(scene)
    return () => {
      mixer.current?.stopAllAction()
      mixer.current = null
    }
  }, [scene])

  useFrame((_, delta) => {
    mixer.current?.update(delta)
  })

  return { mixer: mixer.current, time }
}
```

#### 2. Extract Component
When JSX block is reusable:

```typescript
// BEFORE: Inline JSX
function Settings() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <label>Speed</label>
        <Slider value={speed} onChange={setSpeed} />
      </div>
      <div className="flex items-center gap-2">
        <label>Volume</label>
        <Slider value={volume} onChange={setVolume} />
      </div>
    </div>
  )
}

// AFTER: Extract reusable component
interface SliderControlProps {
  label: string
  value: number
  onChange: (value: number) => void
}

function SliderControl({ label, value, onChange }: SliderControlProps) {
  return (
    <div className="flex items-center gap-2">
      <label>{label}</label>
      <Slider value={value} onChange={onChange} />
    </div>
  )
}
```

#### 3. Consolidate Store Selectors
When multiple components use same state selections:

```typescript
// BEFORE: Repeated selector logic
// In Component1
const character = useViewerStore((s) => s.currentCharacter)
const animation = useViewerStore((s) => s.currentAnimation)

// In Component2
const character = useViewerStore((s) => s.currentCharacter)
const animation = useViewerStore((s) => s.currentAnimation)

// AFTER: Create selector hooks
// In src/lib/store/selectors.ts
export const useCurrentModel = () => useViewerStore((s) => ({
  character: s.currentCharacter,
  animation: s.currentAnimation,
}), shallow)

// In components
const { character, animation } = useCurrentModel()
```

#### 4. Type Extraction
When types are inline or duplicated:

```typescript
// BEFORE: Inline types
function exportModel(
  model: { scene: THREE.Group; animations: THREE.AnimationClip[] },
  options: { format: string; compress: boolean; fileName: string }
): Promise<{ success: boolean; data?: Blob; error?: string }>

// AFTER: Extract to types file
// In src/types/export.ts
interface ExportableModel {
  scene: THREE.Group
  animations: THREE.AnimationClip[]
}

interface ExportOptions {
  format: ExportFormat
  compress: boolean
  fileName: string
}

type ExportResult = Result<Blob>
```

#### 5. Async Error Handling Standardization
Ensure all async functions follow Result pattern:

```typescript
// BEFORE: Inconsistent error handling
async function loadModel(file: File) {
  try {
    const gltf = await loader.loadAsync(url)
    return gltf
  } catch (e) {
    console.error(e)
    throw e
  }
}

// AFTER: Standard Result pattern
async function loadModel(file: File): Promise<Result<GLTF>> {
  try {
    const gltf = await loader.loadAsync(url)
    return { success: true, data: gltf }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Load failed'
    }
  }
}
```

### Refactoring Workflow

1. **Identify Target**
   ```bash
   # Find code smells
   npx eslint src/ --ext .ts,.tsx --format compact | head -50

   # Find large files
   find src -name "*.tsx" -exec wc -l {} + | sort -rn | head -10

   # Find duplicated code patterns
   rg "useViewerStore\(\(s\)" --type ts -c | sort -t: -k2 -rn
   ```

2. **Plan Changes**
   - List all files affected
   - Identify dependencies
   - Determine safe order of changes

3. **Execute Incrementally**
   - One file at a time
   - Run tests after each change
   - Commit working state

4. **Verify**
   ```bash
   npm run type-check
   npm run lint
   npm run test
   npm run build
   ```

### Output Format

```markdown
## Refactoring: [Description]

### Scope
- Files affected: X
- Components: [list]
- Hooks: [list]

### Changes Made

#### 1. [Change Name]
**Before** (`src/file.tsx:10-25`):
\`\`\`typescript
// old code
\`\`\`

**After**:
\`\`\`typescript
// new code
\`\`\`

**Reason**: Why this change improves the code

### Verification
- [ ] Type check passes
- [ ] Lint passes
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Manual testing complete

### Rollback
If issues occur:
\`\`\`bash
git revert HEAD
\`\`\`
```

### Common Anti-Patterns to Fix

| Anti-Pattern | Location | Fix |
|--------------|----------|-----|
| Prop drilling | 3+ levels deep | Use Zustand selector |
| God component | >200 lines | Extract hooks/components |
| Inline styles | JSX | Use Tailwind classes |
| Magic numbers | Anywhere | Extract to constants |
| Duplicated logic | Multiple files | Extract to utility |
| Mixed concerns | Components | Separate UI from logic |
