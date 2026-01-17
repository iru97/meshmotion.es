# TypeScript Rules

## Type System Best Practices

### Interfaces Over Types
```typescript
// PREFER: Interface for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// USE TYPE FOR: Unions, primitives, mapped types
type Status = 'loading' | 'success' | 'error';
type PartialUser = Partial<User>;
```

### No `any` - Use `unknown`
```typescript
// BAD: any bypasses type checking
function process(data: any) {
  return data.value; // No type safety
}

// GOOD: unknown requires type narrowing
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data');
}
```

### Const Assertions Over Enums
```typescript
// AVOID: Enums have runtime overhead
enum Status {
  Active = 'active',
  Inactive = 'inactive'
}

// PREFER: Const objects
const Status = {
  Active: 'active',
  Inactive: 'inactive'
} as const;

type Status = typeof Status[keyof typeof Status];
```

### Discriminated Unions
```typescript
// For type-safe state handling
interface LoadingState {
  status: 'loading';
}

interface SuccessState {
  status: 'success';
  data: User;
}

interface ErrorState {
  status: 'error';
  error: Error;
}

type State = LoadingState | SuccessState | ErrorState;

function render(state: State) {
  switch (state.status) {
    case 'loading':
      return <Spinner />;
    case 'success':
      return <UserProfile user={state.data} />;
    case 'error':
      return <Error message={state.error.message} />;
  }
}
```

## Function Typing

### Explicit Return Types for Public Functions
```typescript
// Public API functions should have explicit return types
export function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Internal/simple functions can use inference
const double = (n: number) => n * 2;
```

### Generic Constraints
```typescript
// Constrain generics appropriately
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

## Props Typing

### Component Props Convention
```typescript
// Name props interfaces as ComponentNameProps
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

// Use React.ComponentPropsWithoutRef for extending HTML elements
interface CustomInputProps extends React.ComponentPropsWithoutRef<'input'> {
  label: string;
}
```

### Event Handler Types
```typescript
// Use proper React event types
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  // ...
};
```

## Import/Export

### Named Exports Preferred
```typescript
// PREFER: Named exports
export function Button() { }
export const CONSTANT = 'value';
export interface ButtonProps { }

// AVOID: Default exports (harder to refactor, no auto-import consistency)
export default function Button() { }
```

### Type-Only Imports
```typescript
// Use type-only imports for types
import type { User, Settings } from './types';
import { fetchUser, updateSettings } from './api';
```

## Utility Types

### Common Patterns
```typescript
// Partial - all properties optional
type PartialUser = Partial<User>;

// Required - all properties required
type RequiredUser = Required<User>;

// Pick - select specific properties
type UserName = Pick<User, 'firstName' | 'lastName'>;

// Omit - exclude specific properties
type UserWithoutId = Omit<User, 'id'>;

// Record - type for object with known keys
type UserMap = Record<string, User>;

// Extract - extract union members
type SuccessStatus = Extract<Status, 'success' | 'completed'>;

// Exclude - exclude union members
type NonErrorStatus = Exclude<Status, 'error'>;
```

## Strict Mode Compliance

This project uses TypeScript strict mode. Ensure:

- No implicit `any`
- Strict null checks (handle undefined/null)
- Strict function types
- No unused locals/parameters
- Exact optional property types

```typescript
// Handle nullable values explicitly
function greet(name: string | undefined) {
  if (!name) return 'Hello, Guest';
  return `Hello, ${name}`;
}

// Or use optional chaining and nullish coalescing
const displayName = user?.name ?? 'Anonymous';
```
