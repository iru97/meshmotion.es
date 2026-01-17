---
name: component-generator
description: Generate new React components following MeshMotion patterns. Use when creating new UI components, panels, or viewer elements.
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
user-invocable: true
hooks:
  PostToolUse:
    - matcher: "Write"
      hooks:
        - type: command
          command: "npx prettier --write $(jq -r '.tool_input.file_path' 2>/dev/null || echo '') 2>/dev/null || true"
          timeout: 30
---

# Component Generator Skill

Generate new React components that follow MeshMotion's established patterns.

## Usage

Invoke with: `/component-generator [ComponentName] [type]`

Types:
- `ui` - Basic UI component (buttons, inputs, cards)
- `panel` - Sidebar panel with glassmorphism
- `viewer` - 3D viewer component (Three.js integration)
- `modal` - Dialog/modal component
- `settings` - Settings panel with controls

## Component Templates

### UI Component Template
```typescript
'use client';

import { cn } from '@/lib/utils';

interface {{ComponentName}}Props {
  className?: string;
  children?: React.ReactNode;
}

export function {{ComponentName}}({ className, children }: {{ComponentName}}Props) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}
```

### Panel Component Template
```typescript
'use client';

import { cn } from '@/lib/utils';
import { useViewerStore } from '@/lib/store/viewer-store';

interface {{ComponentName}}Props {
  className?: string;
}

export function {{ComponentName}}({ className }: {{ComponentName}}Props) {
  // Use selectors for state
  const someState = useViewerStore((state) => state.someState);
  const setSomeState = useViewerStore((state) => state.setSomeState);

  return (
    <div
      className={cn(
        'bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4',
        className
      )}
    >
      <h3 className="text-sm font-medium text-foreground/80 mb-4">
        Panel Title
      </h3>
      {/* Content */}
    </div>
  );
}
```

### Viewer Component Template (Three.js)
```typescript
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface {{ComponentName}}Props {
  // Props here
}

export function {{ComponentName}}({}: {{ComponentName}}Props) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // Animation logic - mutate refs, don't update state
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}
```

### Modal Component Template
```typescript
'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface {{ComponentName}}Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function {{ComponentName}}({ isOpen, onClose, title, children }: {{ComponentName}}Props) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
        <div className="bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">{children}</div>
        </div>
      </div>
    </>
  );
}
```

## File Naming Conventions

- Component file: `src/components/[category]/{{ComponentName}}.tsx`
- Categories: `viewer/`, `panels/`, `settings/`, `ui/`, `export/`, `assets/`
- Use PascalCase for component files
- Use kebab-case for directories

## After Generation

1. Add export to category index if exists
2. Import in parent component
3. Add to store if state needed
4. Write tests if complex logic
