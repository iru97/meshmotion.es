# Vercel React Best Practices Skill

> Based on vercel-labs/agent-skills repository (January 2026)
> 40+ rules across 8 categories, prioritized by impact

## CRITICAL Priority Rules

### 1. Eliminating Waterfalls

#### Defer Await Until Needed
Move `await` into the code branch where the value is actually used, not at the point of function call.

```typescript
// BEFORE: Blocks immediately
const data = await fetchData();
if (needsData) {
  use(data);
}

// AFTER: Only blocks when needed
const dataPromise = fetchData();
if (needsData) {
  use(await dataPromise);
}
```

#### Promise.all for Independent Operations
```typescript
// BEFORE: Sequential (slow)
const user = await fetchUser(id);
const posts = await fetchPosts(id);
const comments = await fetchComments(id);

// AFTER: Parallel (fast)
const [user, posts, comments] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
  fetchComments(id)
]);
```

#### Strategic Suspense Boundaries
```typescript
<Suspense fallback={<HeaderSkeleton />}>
  <Header /> {/* Shows immediately when ready */}
</Suspense>
<Suspense fallback={<ContentSkeleton />}>
  <SlowContent /> {/* Independent loading */}
</Suspense>
```

### 2. Bundle Size Optimization

#### Avoid Barrel File Imports
```typescript
// BAD: Pulls entire module
import { Button } from '@/components/ui';

// GOOD: Tree-shakeable
import { Button } from '@/components/ui/button';
```

#### Dynamic Imports for Heavy Components
```typescript
import dynamic from 'next/dynamic';

const HeavyEditor = dynamic(() => import('./Editor'), {
  loading: () => <EditorSkeleton />,
  ssr: false
});
```

#### Icon Libraries - Direct Imports
```typescript
// BAD: Imports all icons (500kb+)
import * as Icons from 'lucide-react';

// GOOD: Only what you need (1kb per icon)
import { Play, Pause, Settings } from 'lucide-react';
```

## HIGH Priority Rules

### 3. Server-Side Performance

#### React.cache() for Deduplication
```typescript
import { cache } from 'react';

const getUser = cache(async (id: string) => {
  return await db.user.findUnique({ where: { id } });
});

// Called multiple times in component tree, only fetches once
```

#### after() for Non-Blocking Operations
```typescript
import { after } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  const result = await processData(data);

  // Analytics runs after response is sent
  after(async () => {
    await logAnalytics(data);
  });

  return Response.json(result);
}
```

### 4. Client-Side Data Fetching

#### Use SWR for Automatic Deduplication
```typescript
import useSWR from 'swr';

function useUser(id: string) {
  const { data, error, isLoading } = useSWR(
    `/api/users/${id}`,
    fetcher,
    { revalidateOnFocus: false }
  );
  return { user: data, error, isLoading };
}
```

## MEDIUM Priority Rules

### 5. Re-render Optimization

#### useTransition for Non-Urgent Updates
```typescript
import { useTransition } from 'react';

function FilteredList() {
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState('');

  const handleFilter = (value: string) => {
    startTransition(() => {
      setFilter(value); // Can be interrupted
    });
  };
}
```

#### Narrow Effect Dependencies
```typescript
// BAD: Runs on any user object change
useEffect(() => {
  document.title = user.name;
}, [user]);

// GOOD: Only runs when name changes
useEffect(() => {
  document.title = user.name;
}, [user.name]);
```

#### Lazy State Initialization
```typescript
// BAD: computeInitial() runs every render
const [state, setState] = useState(computeInitial());

// GOOD: computeInitial() only runs once
const [state, setState] = useState(() => computeInitial());
```

### 6. Rendering Performance

#### CSS content-visibility for Long Lists
```css
.list-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

#### Hoist Static JSX
```typescript
// Defined outside component - created once
const staticIcon = <Icon name="check" />;

function Item() {
  return (
    <div>
      {staticIcon} {/* Reused, not recreated */}
      <span>{dynamicContent}</span>
    </div>
  );
}
```

## LOW-MEDIUM Priority Rules

### 7. JavaScript Performance

#### Set/Map for O(1) Lookups
```typescript
// BAD: O(n) every check
const isSelected = selectedIds.includes(id);

// GOOD: O(1) lookup
const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
const isSelected = selectedSet.has(id);
```

#### Early Returns
```typescript
// BAD: Deeply nested
function process(data) {
  if (data) {
    if (data.valid) {
      if (data.ready) {
        return transform(data);
      }
    }
  }
  return null;
}

// GOOD: Flat structure
function process(data) {
  if (!data) return null;
  if (!data.valid) return null;
  if (!data.ready) return null;
  return transform(data);
}
```

#### Use toSorted() for Immutability
```typescript
// MUTATES original
const sorted = items.sort((a, b) => a.name.localeCompare(b.name));

// IMMUTABLE - returns new array
const sorted = items.toSorted((a, b) => a.name.localeCompare(b.name));
```

### 8. Advanced Patterns

#### Store Handlers in Refs
```typescript
const onChangeRef = useRef(onChange);
onChangeRef.current = onChange;

useEffect(() => {
  element.addEventListener('change', () => onChangeRef.current());
  return () => element.removeEventListener('change', () => onChangeRef.current());
}, []); // No onChange dependency
```

---

## Performance Benefits Summary

| Optimization | Typical Improvement |
|--------------|---------------------|
| Direct imports vs barrel files | 15-70% faster dev boot |
| Parallel data fetching | 2-10x faster data loading |
| Dynamic imports | 28% faster builds |
| Suspense boundaries | 40% faster perceived load |
| Set/Map lookups | O(n) → O(1) |

## Quick Reference

When reviewing code, check for:
- [ ] Sequential awaits that could be parallel
- [ ] Barrel file imports
- [ ] Large icon library imports
- [ ] Missing Suspense boundaries
- [ ] useEffect with object dependencies
- [ ] array.includes() in render
- [ ] State initialization with function calls
