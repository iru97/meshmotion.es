# Performance Rules (Based on Vercel Best Practices)

## CRITICAL: Eliminating Waterfalls

### Defer Await Until Needed
```typescript
// BAD: Await blocks everything
async function getData() {
  const user = await fetchUser();
  const posts = await fetchPosts(); // Waits for user unnecessarily
  return { user, posts };
}

// GOOD: Start both, await when needed
async function getData() {
  const userPromise = fetchUser();
  const postsPromise = fetchPosts();
  const [user, posts] = await Promise.all([userPromise, postsPromise]);
  return { user, posts };
}
```

### Strategic Suspense Boundaries
```typescript
// Wrap slow components to show faster ones immediately
<Suspense fallback={<Skeleton />}>
  <SlowDataComponent />
</Suspense>
```

## CRITICAL: Bundle Size Optimization

### Avoid Barrel File Imports
```typescript
// BAD: Imports entire library
import { Button } from '@/components/ui';

// GOOD: Direct import for tree-shaking
import { Button } from '@/components/ui/button';
```

### Dynamic Imports for Heavy Components
```typescript
// Lazy load heavy dependencies
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />
});
```

### Icon Library Optimization
```typescript
// BAD: Imports all icons
import { icons } from 'lucide-react';

// GOOD: Import specific icons
import { Play, Pause, Settings } from 'lucide-react';
```

## HIGH: Re-render Optimization

### Narrow Effect Dependencies
```typescript
// BAD: Too many dependencies cause unnecessary reruns
useEffect(() => {
  updateTitle(user.name);
}, [user]); // Runs on any user change

// GOOD: Only what's needed
useEffect(() => {
  updateTitle(user.name);
}, [user.name]); // Only runs when name changes
```

### Use Transitions for Non-Urgent Updates
```typescript
import { useTransition } from 'react';

function Search() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    // Urgent: Update input immediately
    setQuery(e.target.value);

    // Non-urgent: Filter results can wait
    startTransition(() => {
      setFilteredResults(filterBy(e.target.value));
    });
  };
}
```

### Lazy State Initialization
```typescript
// BAD: Runs on every render
const [state, setState] = useState(expensiveComputation());

// GOOD: Only runs once
const [state, setState] = useState(() => expensiveComputation());
```

## MEDIUM: JavaScript Performance

### Use Set/Map for O(1) Lookups
```typescript
// BAD: O(n) array lookup
const isSelected = selectedIds.includes(id);

// GOOD: O(1) Set lookup
const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
const isSelected = selectedSet.has(id);
```

### Cache Property Access in Loops
```typescript
// BAD: Property access on each iteration
for (let i = 0; i < arr.length; i++) {
  // arr.length evaluated each time
}

// GOOD: Cache the length
for (let i = 0, len = arr.length; i < len; i++) {
  // len is cached
}
```

### Early Return from Functions
```typescript
// BAD: Nested conditions
function process(data) {
  if (data) {
    if (data.isValid) {
      // Process...
    }
  }
}

// GOOD: Early returns
function process(data) {
  if (!data) return;
  if (!data.isValid) return;
  // Process...
}
```

## MEDIUM: Rendering Performance

### CSS content-visibility for Long Lists
```css
.list-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px; /* Estimated height */
}
```

### Hoist Static JSX Elements
```typescript
// BAD: Recreated every render
function Component() {
  return (
    <div>
      <StaticHeader /> {/* Recreated each time */}
      <DynamicContent />
    </div>
  );
}

// GOOD: Hoist static elements
const staticHeader = <StaticHeader />;

function Component() {
  return (
    <div>
      {staticHeader}
      <DynamicContent />
    </div>
  );
}
```

### Prevent Hydration Mismatch
```typescript
// For client-only values that differ from server
import { useSyncExternalStore } from 'react';

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false // Server returns false
  );
}
```

## LOW: Advanced Patterns

### Store Event Handlers in Refs
```typescript
// For handlers that shouldn't cause re-renders when changed
const handlerRef = useRef(onUpdate);
handlerRef.current = onUpdate;

useEffect(() => {
  element.addEventListener('change', handlerRef.current);
}, []); // No dependency on handler
```

### Batch DOM CSS Changes
```typescript
// BAD: Multiple reflows
element.style.width = '100px';
element.style.height = '100px';

// GOOD: Single reflow
element.style.cssText = 'width: 100px; height: 100px';
// Or use classes
element.classList.add('sized');
```
