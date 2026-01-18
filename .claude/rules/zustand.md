# Zustand State Management Rules

## Store Structure

### Main Store Location
The primary store is at `src/lib/store/viewer-store.ts`

### Store Definition Pattern
```typescript
import { create } from 'zustand';

interface ViewerState {
  // State
  model: Model | null;
  isPlaying: boolean;
  currentTime: number;

  // Actions
  setModel: (model: Model | null) => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
}

export const useViewerStore = create<ViewerState>((set, get) => ({
  // Initial state
  model: null,
  isPlaying: false,
  currentTime: 0,

  // Actions
  setModel: (model) => set({ model }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setCurrentTime: (time) => set({ currentTime: time }),
}));
```

## Selectors - Avoid Re-renders

### Use Selectors for Specific State
```typescript
// BAD: Subscribes to entire store, re-renders on ANY change
const store = useViewerStore();
const { isPlaying } = store;

// GOOD: Only re-renders when isPlaying changes
const isPlaying = useViewerStore((state) => state.isPlaying);
```

### Multiple Selectors
```typescript
// GOOD: Individual selectors
const isPlaying = useViewerStore((state) => state.isPlaying);
const currentTime = useViewerStore((state) => state.currentTime);

// ALSO GOOD: Combined with shallow comparison for objects
import { shallow } from 'zustand/shallow';

const { isPlaying, currentTime } = useViewerStore(
  (state) => ({ isPlaying: state.isPlaying, currentTime: state.currentTime }),
  shallow
);
```

### Action Selectors
```typescript
// Actions don't change - safe to select without shallow
const setModel = useViewerStore((state) => state.setModel);
const togglePlay = useViewerStore((state) => state.togglePlay);
```

## State Updates

### Immer-style Updates (if using immer middleware)
```typescript
// Without immer - must spread
set((state) => ({
  settings: { ...state.settings, volume: 0.5 }
}));

// With immer middleware - can mutate directly
set((state) => {
  state.settings.volume = 0.5;
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
const totalItems = useViewerStore((state) => state.items.length);
const activeItem = useViewerStore((state) =>
  state.items.find(item => item.id === state.activeId)
);
```

### Memoize Expensive Computations
```typescript
import { useMemo } from 'react';

function Component() {
  const items = useViewerStore((state) => state.items);
  const filter = useViewerStore((state) => state.filter);

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
      name: 'viewer-storage',
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
