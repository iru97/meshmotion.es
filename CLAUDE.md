# MeshMotion - 3D Model Viewer

## Project Overview

MeshMotion is a professional 3D model viewer built with Next.js 15 and React 19, featuring advanced GLB/GLTF model loading, animation retargeting, studio lighting presets, material customization, and multi-format export capabilities.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Static Export)
- **Language**: TypeScript 5 (strict mode)
- **UI**: React 19, Tailwind CSS 3.4, shadcn/ui, Radix UI
- **3D Graphics**: Three.js 0.160, React Three Fiber 9.4, @react-three/drei 10.7
- **State**: Zustand 4.4
- **Animation**: GSAP 3.12
- **Font**: Space Grotesk

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── viewer/            # 3D scene components (Scene, Model, Lighting)
│   ├── animation/         # Animation controls
│   ├── panels/            # Layout panels (ActionToolbar, RightSidebar)
│   ├── settings/          # Settings panels (Lighting, Material, Environment)
│   ├── export/            # Export functionality
│   ├── assets/            # Asset management UI
│   ├── comparison/        # Model comparison mode
│   └── ui/                # shadcn/ui base components
├── lib/
│   ├── store/             # Zustand store (viewer-store.ts)
│   ├── three/             # Three.js utilities and presets
│   ├── conversion/        # Format conversion (assimp, exporters)
│   └── storage/           # Local storage utilities
├── hooks/                 # Custom React hooks (9 files)
└── types/                 # TypeScript type definitions
```

## Common Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build (static export)
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Code Style Guidelines

### TypeScript
- Use strict mode; no `any` types, prefer `unknown`
- Use interfaces over types for object shapes
- Use `const` assertions and discriminated unions
- Avoid enums; use const objects with `as const`

### React
- Functional components only; no class components
- Use named exports over default exports
- Props interfaces named `ComponentNameProps`
- Destructure props in function parameters
- Use `'use client'` directive only when needed

### Three.js / React Three Fiber
- Keep 3D scene components minimal and focused
- Use @react-three/drei helpers when available
- Dispose of geometries/materials/textures properly
- Use `useFrame` with caution; avoid heavy computations

### Styling
- Tailwind CSS utilities first
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Follow glassmorphism design patterns
- Mobile-first responsive design

## Path Aliases

- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/lib/*` → `./src/lib/*`
- `@/hooks/*` → `./src/hooks/*`
- `@/types/*` → `./src/types/*`

## Key Files

- `src/lib/store/viewer-store.ts` - Main Zustand state management
- `src/components/viewer/Scene.tsx` - Primary 3D scene container
- `src/lib/three/lighting-presets.ts` - Studio/Soft/Dramatic/Outdoor presets
- `src/lib/three/material-presets.ts` - Clay/Wireframe/X-Ray/PBR presets
- `src/lib/conversion/three-exporters.ts` - GLB/GLTF/FBX/USDZ/OBJ export

## Important Constraints

- Max file upload: 50MB (52428800 bytes)
- Client-side rendering only for 3D scene (no SSR for Three.js)
- Static HTML export enabled (no server-side features in production)
- No secrets in `.env` files; all config is NEXT_PUBLIC_*

## Testing

- No existing test suite; follow React Testing Library patterns if adding tests
- Mock Three.js renderer for component tests
- Test hooks in isolation with @testing-library/react-hooks

## Reference Documentation

@.claude/rules/react.md
@.claude/rules/nextjs.md
@.claude/rules/threejs.md
@.claude/rules/performance.md
