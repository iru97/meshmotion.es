# Zustand State Management Rules

## Store Structure

### Store Location
The primary store is at `{{STORE_PATH}}`

### Store Definition Pattern
```typescript
import { create } from 'zustand';

interface AppState {
  // State
  data: Data | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setData: (data: Data | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  data: null,
  isLoading: false,
  error: null,

  // Actions
  setData: (data) => set({ data }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ data: null, isLoading: false, error: null }),
}));
```

## Selectors - Avoid Re-renders

### Use Selectors for Specific State
```typescript
// BAD: Subscribes to entire store, re-renders on ANY change
const store = useAppStore();
const { isLoading } = store;

// GOOD: Only re-renders when isLoading changes
const isLoading = useAppStore((state) => state.isLoading);
```

### Multiple Selectors
```typescript
// GOOD: Individual selectors
const isLoading = useAppStore((state) => state.isLoading);
const data = useAppStore((state) => state.data);

// ALSO GOOD: Combined with shallow comparison for objects
import { shallow } from 'zustand/shallow';

const { isLoading, data } = useAppStore(
  (state) => ({ isLoading: state.isLoading, data: state.data }),
  shallow
);
```

### Action Selectors
```typescript
// Actions don't change - safe to select without shallow
const setData = useAppStore((state) => state.setData);
const reset = useAppStore((state) => state.reset);
```

## State Updates

### Functional Updates
```typescript
// Without immer - must spread
set((state) => ({
  settings: { ...state.settings, theme: 'dark' }
}));

// With immer middleware - can mutate directly
set((state) => {
  state.settings.theme = 'dark';
});
```

### Getting Current State in Actions
```typescript
const useStore = create((set, get) => ({
  items: [],

  addItem: (item) => {
    const currentItems = get().items;
    set({ items: [...currentItems, item] });
  },

  // Or use functional update
  addItemAlt: (item) => set((state) => ({
    items: [...state.items, item]
  })),
}));
```

## Computed/Derived State

### Compute in Selector
```typescript
// Derive state in selector, not in store
const totalItems = useAppStore((state) => state.items.length);
const activeItem = useAppStore((state) =>
  state.items.find(item => item.id === state.activeId)
);
```

### Memoize Expensive Computations
```typescript
import { useMemo } from 'react';

function Component() {
  const items = useAppStore((state) => state.items);
  const filter = useAppStore((state) => state.filter);

  // Memoize expensive filter
  const filteredItems = useMemo(() =>
    items.filter(item => item.name.includes(filter)),
    [items, filter]
  );
}
```

## Async Actions

### Async Pattern
```typescript
const useStore = create((set, get) => ({
  data: null,
  loading: false,
  error: null,

  fetchData: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/data/${id}`);
      const data = await response.json();
      set({ data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

## Persistence (if needed)

### LocalStorage Persistence
```typescript
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // ... state and actions
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        // Only persist these fields
        settings: state.settings,
        preferences: state.preferences,
      }),
    }
  )
);
```

## Best Practices Summary

1. **Always use selectors** - Never destructure from `useStore()` directly
2. **Keep store flat** - Avoid deeply nested state
3. **Colocate actions** - Define actions in the store, not in components
4. **Use shallow** - When selecting multiple values as an object
5. **Derive state** - Compute derived values in selectors, not in store
6. **Separate concerns** - Consider multiple stores for unrelated state
