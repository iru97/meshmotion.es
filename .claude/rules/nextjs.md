# Next.js 15 App Router Rules

## Routing Conventions

### File Structure
```
app/
├── layout.tsx          # Root layout (required)
├── page.tsx            # Home page
├── loading.tsx         # Loading UI
├── error.tsx           # Error boundary
├── not-found.tsx       # 404 page
└── api/
    └── [route]/
        └── route.ts    # API route handlers
```

### Client vs Server Components
- Server Components are the default (no directive needed)
- Add `'use client'` ONLY when you need:
  - React hooks (useState, useEffect, etc.)
  - Browser APIs (window, document)
  - Event handlers (onClick, onChange)
  - Three.js / React Three Fiber components

```typescript
// Client component example
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## Data Fetching

### Server Components
```typescript
// Fetch in server components (no useEffect needed)
async function ProductList() {
  const products = await fetch('https://api.example.com/products');
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

### Client-Side Fetching
- Use SWR or React Query for client-side data
- Implement proper loading and error states
- Cache responses appropriately

## Static Export Configuration

This project uses static export (`output: 'export'` in next.config.js):

### Limitations
- No server-side features (API routes, middleware)
- No dynamic routes without `generateStaticParams`
- No image optimization (use unoptimized or external)

### Best Practices
- All data fetching happens at build time or client-side
- Use environment variables prefixed with `NEXT_PUBLIC_`
- Avoid `next/headers` and `next/cookies`

## Performance

### Code Splitting
```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const Heavy3DViewer = dynamic(() => import('@/components/viewer/Scene'), {
  ssr: false, // Critical for Three.js
  loading: () => <div>Loading 3D viewer...</div>
});
```

### Image Optimization
- Use `next/image` with `unoptimized` prop for static export
- Provide explicit width/height to prevent layout shift
- Use WebP format when possible

## Metadata

```typescript
// In layout.tsx or page.tsx
export const metadata = {
  title: 'MeshMotion - 3D Model Viewer',
  description: 'Professional 3D model viewer with animation support',
};
```

## Environment Variables

- `NEXT_PUBLIC_*` - Exposed to browser
- All other env vars - Server-only (not available in static export)

```typescript
// Access in code
const appName = process.env.NEXT_PUBLIC_APP_NAME;
```
