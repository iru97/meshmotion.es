# Code Conventions

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase.tsx | `UserProfile.tsx` |
| Hooks | use-kebab-case.ts | `use-auth.ts` |
| Utilities | kebab-case.ts | `format-date.ts` |
| Types | kebab-case.ts | `user.ts` |
| Directories | kebab-case | `components/`, `hooks/` |

## Component Structure

```typescript
// 1. 'use client' if needed
'use client';

// 2. External imports (alphabetized)
import { useCallback, useEffect, useRef } from 'react';

// 3. Internal imports (by category)
import { cn } from '@/lib/utils';
import { useAppStore } from '{{STORE_PATH}}';
import type { User } from '@/types/user';

// 4. Types/Interfaces
interface UserCardProps {
  userId: string;
  onSelect?: (user: User) => void;
}

// 5. Component (named export)
export function UserCard({ userId, onSelect }: UserCardProps) {
  // 5a. Refs
  const cardRef = useRef<HTMLDivElement>(null);

  // 5b. Store selectors (granular)
  const user = useAppStore((state) => state.users[userId]);

  // 5c. Local state
  const [isExpanded, setIsExpanded] = useState(false);

  // 5d. Callbacks
  const handleClick = useCallback(() => {
    onSelect?.(user);
  }, [onSelect, user]);

  // 5e. Effects
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, []);

  // 5f. Early returns
  if (!user) return null;

  // 5g. Render
  return (
    <div ref={cardRef} onClick={handleClick}>
      {user.name}
    </div>
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
```

### Generics

```typescript
// Result pattern for async operations
interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Usage
async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await api.getUser(id);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## Store Conventions (Zustand)

### Store Structure

```typescript
interface AppState {
  // Data properties (nouns)
  currentUser: User | null;
  items: Item[];

  // State flags (is/has prefix)
  isLoading: boolean;
  hasError: boolean;

  // Actions (verbs)
  setUser: (user: User | null) => void;
  addItem: (item: Item) => void;
  reset: () => void;
}
```

### Action Naming

| Action Type | Pattern | Example |
|-------------|---------|---------|
| Setter | `set<Property>` | `setUser`, `setLoading` |
| Toggle | `toggle<Property>` | `toggleSidebar` |
| Add | `add<Item>` | `addItem`, `addNotification` |
| Remove | `remove<Item>` | `removeItem` |
| Reset | `reset<Scope>` | `reset`, `resetFilters` |

### Selector Usage

```typescript
// CORRECT: Individual selectors
const isLoading = useAppStore((s) => s.isLoading);
const user = useAppStore((s) => s.currentUser);

// CORRECT: Multiple values with shallow
import { shallow } from 'zustand/shallow';
const { isLoading, user } = useAppStore(
  (s) => ({ isLoading: s.isLoading, user: s.currentUser }),
  shallow
);

// WRONG: Destructuring from store
const { isLoading } = useAppStore(); // Re-renders on ALL changes
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
    const data = await fetch();
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Unknown error occurred';
    return { success: false, error: message };
  } finally {
    setIsLoading(false);
  }
}
```

### User-Facing Errors

```typescript
{error && (
  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
    {error}
  </div>
)}
```
