# /component-generator - Generate React Components

Generate new React components following project patterns and conventions.

## Usage
```
/component-generator [ComponentName] [optional: type]
```

Types: `ui`, `page`, `feature`, `layout`

## Process

### Step 1: Gather Requirements
Ask via AskUserQuestion:

**Question 1: Component Type**
- UI component (reusable, stateless)
- Feature component (stateful, specific)
- Page component (route-level)
- Layout component (wrapper)

**Question 2: Needs State?**
- No (pure/presentational)
- Local state only
- Global store access

**Question 3: Interactive?**
- Static display
- User interactions
- Form inputs
- Animations

### Step 2: Determine File Location

Based on type:
- UI: `src/components/ui/`
- Feature: `src/components/[feature]/`
- Page: `src/app/[route]/`
- Layout: `src/components/layout/`

### Step 3: Generate Component

**Basic UI Component Template**:
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

**Stateful Feature Component Template**:
```typescript
'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '{{STORE_PATH}}';

interface {{ComponentName}}Props {
  className?: string;
}

export function {{ComponentName}}({ className }: {{ComponentName}}Props) {
  // Store
  const data = useAppStore((state) => state.data);

  // Local state
  const [isOpen, setIsOpen] = useState(false);

  // Handlers
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className={cn('', className)}>
      {/* Component content */}
    </div>
  );
}
```

**Page Component Template**:
```typescript
import { Metadata } from 'next';
import { {{ComponentName}} } from '@/components/{{component-name}}';

export const metadata: Metadata = {
  title: '{{Page Title}}',
  description: '{{Page description}}',
};

export default function {{PageName}}Page() {
  return (
    <main className="container mx-auto py-8">
      <{{ComponentName}} />
    </main>
  );
}
```

### Step 4: Generate Test File

```typescript
import { render, screen } from '@testing-library/react';
import { {{ComponentName}} } from './{{ComponentName}}';

describe('{{ComponentName}}', () => {
  it('should render correctly', () => {
    render(<{{ComponentName}} />);
    // Add assertions
  });

  it('should handle [interaction]', () => {
    // Add interaction test
  });
});
```

### Step 5: Update Exports (if needed)

Add to barrel file if exists:
```typescript
// src/components/index.ts
export { {{ComponentName}} } from './{{ComponentName}}';
```

## Generated Files

For `MyComponent`:
```
src/components/
├── MyComponent/
│   ├── MyComponent.tsx      # Component
│   ├── MyComponent.test.tsx # Tests
│   └── index.ts             # Export
```

Or flat structure:
```
src/components/
├── MyComponent.tsx
```

## Naming Conventions

| Type | Example |
|------|---------|
| Component | `UserProfile` |
| Props | `UserProfileProps` |
| File | `UserProfile.tsx` |
| Test | `UserProfile.test.tsx` |
| CSS Module | `UserProfile.module.css` |

## Example

**User**: "/component-generator SearchBar ui"

**Generated**:
```typescript
// src/components/ui/SearchBar.tsx
'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  className,
  placeholder = 'Search...',
  onSearch
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  }, [query, onSearch]);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex items-center gap-2 px-3 py-2',
        'rounded-lg border border-border bg-background',
        className
      )}
    >
      <Search className="h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none"
      />
    </form>
  );
}
```
