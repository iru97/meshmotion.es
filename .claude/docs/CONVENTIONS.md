# MeshMotion Code Conventions

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase.tsx | `AnimationControls.tsx` |
| Hooks | use-kebab-case.ts | `use-gltf-loader.ts` |
| Utilities | kebab-case.ts | `model-utils.ts` |
| Types | kebab-case.ts | `viewer.ts` |
| Directories | kebab-case | `animation/`, `viewer/` |

## Component Structure

```typescript
// 1. 'use client' if needed
'use client';

// 2. External imports (alphabetized)
import { useCallback, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3. Internal imports (by category)
import { cn } from '@/lib/utils';
import { useViewerStore } from '@/lib/store/viewer-store';
import type { GLTFModel } from '@/types/viewer';

// 4. Types/Interfaces
interface ModelProps {
  url: string;
  onLoad?: (model: GLTFModel) => void;
}

// 5. Component (named export)
export function Model({ url, onLoad }: ModelProps) {
  // 5a. Refs
  const meshRef = useRef<THREE.Mesh>(null);

  // 5b. Store selectors (granular)
  const isPlaying = useViewerStore((state) => state.isPlaying);
  const setCurrentTime = useViewerStore((state) => state.setCurrentTime);

  // 5c. Local state
  const [isLoaded, setIsLoaded] = useState(false);

  // 5d. Callbacks
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.(model);
  }, [onLoad]);

  // 5e. Effects
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, []);

  // 5f. useFrame (R3F only)
  useFrame((state, delta) => {
    // Animation loop
  });

  // 5g. Early returns
  if (!url) return null;

  // 5h. Render
  return (
    <mesh ref={meshRef}>
      {/* children */}
    </mesh>
  );
}
```

## TypeScript Conventions

### Interfaces vs Types

```typescript
// USE INTERFACE for object shapes
interface User {
  id: string;
  name: string;
}

// USE TYPE for unions, primitives, mapped types
type Status = 'loading' | 'success' | 'error';
type Nullable<T> = T | null;
```

### Props Naming

```typescript
// Interface: ComponentNameProps
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

// Event handlers: on<Event>
interface FormProps {
  onSubmit: (data: FormData) => void;
  onChange: (field: string, value: string) => void;
}

// Render props: render<What>
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}
```

### Generics

```typescript
// Result pattern for async operations
interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
}

// Usage
async function loadModel(url: string): Promise<Result<GLTFModel>> {
  try {
    const model = await loader.loadAsync(url);
    return { success: true, data: model };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## Zustand Conventions

### Store Structure

```typescript
interface ViewerState {
  // Data properties (nouns)
  currentCharacter: GLTFModel | null;
  uploadedCharacters: GLTFModel[];

  // State flags (is/has prefix)
  isPlaying: boolean;
  isLoading: boolean;

  // Actions (verbs)
  setCharacter: (model: GLTFModel | null) => void;
  togglePlay: () => void;
  reset: () => void;
}
```

### Action Naming

| Action Type | Pattern | Example |
|-------------|---------|---------|
| Setter | `set<Property>` | `setCharacter`, `setSpeed` |
| Toggle | `toggle<Property>` | `togglePlay`, `toggleGrid` |
| Add | `add<Item>` | `addCharacter`, `addAnimation` |
| Remove | `remove<Item>` | `removeCharacter` |
| Reset | `reset<Scope>` | `reset`, `resetPlayback` |

### Selector Usage

```typescript
// CORRECT: Individual selectors
const isPlaying = useViewerStore((s) => s.isPlaying);
const speed = useViewerStore((s) => s.playbackSpeed);

// CORRECT: Multiple values with shallow
import { shallow } from 'zustand/shallow';
const { isPlaying, speed } = useViewerStore(
  (s) => ({ isPlaying: s.isPlaying, speed: s.playbackSpeed }),
  shallow
);

// WRONG: Destructuring from store
const { isPlaying } = useViewerStore(); // Re-renders on ALL changes
```

## Three.js Conventions

### Ref Naming

```typescript
const meshRef = useRef<THREE.Mesh>(null);
const groupRef = useRef<THREE.Group>(null);
const mixerRef = useRef<THREE.AnimationMixer | null>(null);
const actionRef = useRef<THREE.AnimationAction | null>(null);
```

### Disposal Pattern

```typescript
useEffect(() => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial();
  const texture = new THREE.TextureLoader().load(url);

  // Store refs for cleanup
  geometryRef.current = geometry;

  return () => {
    geometry.dispose();
    material.dispose();
    texture.dispose();
  };
}, [url]);
```

### useFrame Guidelines

```typescript
// GOOD: Direct mutations only
useFrame((state, delta) => {
  meshRef.current.rotation.y += delta;
  mixerRef.current?.update(delta);
});

// BAD: State updates cause re-renders
useFrame(() => {
  setRotation(r => r + 0.01); // DON'T DO THIS
});

// GOOD: Use store.setState for occasional updates
useFrame(() => {
  const time = actionRef.current?.time ?? 0;
  if (Math.abs(time - lastTime) > 0.1) {
    useViewerStore.getState().setCurrentTime(time);
    lastTime = time;
  }
});
```

## CSS/Tailwind Conventions

### Class Order

1. Layout (flex, grid, position)
2. Spacing (p, m, gap)
3. Sizing (w, h)
4. Typography (text, font)
5. Colors (bg, text color)
6. Effects (shadow, opacity)
7. Transitions
8. Responsive modifiers

```typescript
<div className="
  flex items-center justify-between
  px-4 py-2 gap-2
  w-full h-12
  text-sm font-medium
  bg-background text-foreground
  shadow-sm
  transition-colors
  hover:bg-accent
  md:px-6
">
```

### cn() Usage

```typescript
import { cn } from '@/lib/utils';

// Conditional classes
<button className={cn(
  'px-4 py-2 rounded-md transition-colors',
  isActive && 'bg-primary text-primary-foreground',
  !isActive && 'bg-secondary hover:bg-secondary/80',
  className
)}>
```

## Error Handling

### Try-Catch Pattern

```typescript
async function operation(): Promise<Result<Data>> {
  try {
    // Happy path
    const data = await fetch();
    return { success: true, data };
  } catch (error) {
    // Always extract message
    const message = error instanceof Error
      ? error.message
      : 'Unknown error occurred';
    return { success: false, error: message };
  } finally {
    // Cleanup (if needed)
    setIsLoading(false);
  }
}
```

### User-Facing Errors

```typescript
// In hooks/components
const { error } = useFormatExporter();

// Display with toast or inline
{error && (
  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
    {error}
  </div>
)}
```
