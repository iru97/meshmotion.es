# React Development Rules

## Component Patterns

### Functional Components Only
- Use functional components with hooks; never use class components
- Export components as named exports, not default exports
- Name component files in PascalCase matching the component name

### Props & Types
```typescript
// Interface naming: ComponentNameProps
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// Destructure props in parameters
export function Button({ children, onClick, variant = 'primary', disabled }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{children}</button>;
}
```

### Hooks Best Practices
- Place hooks at the top of components, before any conditional logic
- Use `useCallback` for functions passed as props to child components
- Use `useMemo` for expensive computations, not for all values
- Custom hooks must start with `use` prefix

### State Management
- Prefer local state (`useState`) when possible
- Use Zustand store (`@/lib/store/viewer-store.ts`) for shared state
- Use `useTransition` for non-urgent state updates
- Use functional updates: `setState(prev => prev + 1)`

## Re-render Optimization

### Memoization Guidelines
```typescript
// Memoize callbacks passed to children
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Memoize expensive computations
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// Wrap heavy child components
const MemoizedChild = React.memo(HeavyChild);
```

### Avoid Re-render Triggers
- Don't create objects/arrays inline in JSX
- Don't define functions inside render
- Use refs for values that shouldn't trigger re-renders
- Subscribe only to needed store slices

## Component Organization

### File Structure
```typescript
// 1. Imports (external, then internal, then types)
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import type { ComponentProps } from './types';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
}

// 3. Component
export function MyComponent({ title }: MyComponentProps) {
  // 3a. Hooks
  const [state, setState] = useState(false);

  // 3b. Handlers
  const handleClick = useCallback(() => {
    setState(true);
  }, []);

  // 3c. Derived values
  const displayTitle = title.toUpperCase();

  // 3d. Early returns
  if (!title) return null;

  // 3e. Render
  return (
    <div>
      <h1>{displayTitle}</h1>
      <Button onClick={handleClick}>Click</Button>
    </div>
  );
}
```

## Error Handling

### Error Boundaries
- Wrap 3D scene components in error boundaries
- Provide fallback UI for failed components
- Log errors for debugging

### Loading States
- Use React Suspense for lazy-loaded components
- Show skeleton UI during data loading
- Handle empty states explicitly

## Accessibility

- Use semantic HTML elements
- Add `aria-label` for icon-only buttons
- Ensure keyboard navigation works
- Maintain focus management in modals
