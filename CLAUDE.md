# MeshMotion - Professional 3D Model Viewer

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Production build (static export) |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |

## Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript 5 (strict mode)
- **3D Graphics**: Three.js 0.160 + React Three Fiber 9.4 + @react-three/drei 10.7
- **State**: Zustand 4.4 (with devtools + persist middleware)
- **UI**: Tailwind CSS 3.4 + shadcn/ui + Radix UI
- **Animation**: GSAP 3.12
- **Conversion**: AssimpJS (WebAssembly)

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── viewer/            # 3D scene (Scene, Model, Lighting, Environment)
│   ├── animation/         # Animation controls & selectors
│   ├── panels/            # ActionToolbar, RightSidebar
│   ├── settings/          # Lighting, Material, Environment settings
│   ├── export/            # Export modal & format menu
│   ├── assets/            # Asset management UI
│   ├── comparison/        # Model comparison mode
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── store/             # Zustand store (viewer-store.ts)
│   ├── three/             # Three.js utilities & presets
│   ├── conversion/        # Format detection, conversion, export
│   └── utils.ts           # cn(), formatFileSize(), generateId()
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript type definitions
```

## Critical Patterns

### Zustand Store - ALWAYS Use Selectors
```typescript
// CORRECT - Only re-renders when isPlaying changes
const isPlaying = useViewerStore((state) => state.isPlaying)

// WRONG - Re-renders on ANY store change
const { isPlaying } = useViewerStore()
```

### Three.js in useFrame - NEVER Update State
```typescript
// CORRECT - Direct ref mutation
useFrame((_, delta) => {
  meshRef.current.rotation.y += delta
})

// WRONG - Causes 60 React re-renders per second
useFrame(() => {
  setRotation(r => r + 0.01)
})
```

### Async Results - Standard Pattern
```typescript
interface Result<T> {
  success: boolean
  data?: T
  error?: string
  warnings?: string[]
}
```

### Resource Cleanup - ALWAYS Dispose Three.js Objects
```typescript
useEffect(() => {
  const geometry = new THREE.BoxGeometry()
  return () => geometry.dispose()
}, [])
```

## Key Files

- `src/lib/store/viewer-store.ts` - All application state
- `src/components/viewer/Scene.tsx` - Main 3D canvas
- `src/components/viewer/Model.tsx` - Model rendering & animation
- `src/lib/conversion/three-exporters.ts` - Export to GLB/GLTF/OBJ/STL
- `src/hooks/use-gltf-loader.ts` - Model loading & conversion

## Constraints

- **Max file size**: 50MB (52428800 bytes)
- **Static export only**: No server-side features in production
- **Client-side 3D**: All Three.js components use `'use client'` + `ssr: false`

## Custom Agents (invoke with name)

| Agent | Purpose |
|-------|---------|
| `code-reviewer` | Review code for quality & project patterns |
| `test-architect` | Design & implement test suites |
| `threejs-optimizer` | Audit & optimize 3D performance |
| `refactoring-architect` | Safe code transformations |

## Skills (invoke with /skillname)

| Skill | Purpose |
|-------|---------|
| `/component-generator` | Generate components matching project patterns |
| `/export-debugger` | Debug 3D model export issues |
| `/build-deploy` | Build & deployment assistance |

## Detailed Documentation

For implementation details, see:
- @.claude/rules/react.md - React patterns & hooks
- @.claude/rules/nextjs.md - Next.js 15 App Router
- @.claude/rules/threejs.md - Three.js & R3F rules
- @.claude/rules/typescript.md - TypeScript strict mode
- @.claude/rules/performance.md - Vercel performance rules
- @.claude/rules/styling.md - Tailwind & shadcn/ui
- @.claude/rules/zustand.md - State management

## Path Aliases

| Alias | Path |
|-------|------|
| `@/*` | `./src/*` |
| `@/components/*` | `./src/components/*` |
| `@/lib/*` | `./src/lib/*` |
| `@/hooks/*` | `./src/hooks/*` |
| `@/types/*` | `./src/types/*` |
