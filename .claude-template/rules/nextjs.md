# Next.js App Router Rules

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

## Performance

### Code Splitting
```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <div>Loading...</div>
});
```

### Image Optimization
- Use `next/image` for automatic optimization
- Provide explicit width/height to prevent layout shift
- Use WebP format when possible

## Metadata

```typescript
// In layout.tsx or page.tsx
export const metadata = {
  title: '{{PROJECT_NAME}}',
  description: '{{PROJECT_DESCRIPTION}}',
};
```

## Environment Variables

- `NEXT_PUBLIC_*` - Exposed to browser
- All other env vars - Server-only

```typescript
// Access in code
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```
