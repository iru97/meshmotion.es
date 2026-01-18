# Styling Rules (Tailwind CSS + shadcn/ui)

## Tailwind CSS Guidelines

### Utility-First Approach
```typescript
// GOOD: Use Tailwind utilities directly
<div className="flex items-center gap-4 p-4 rounded-lg bg-card">

// AVOID: Custom CSS classes for what Tailwind provides
<div className="my-custom-flex-container">
```

### Class Organization Order
Follow this order for readability:
1. Layout (flex, grid, position)
2. Spacing (p, m, gap)
3. Sizing (w, h, min, max)
4. Typography (text, font)
5. Colors (bg, text color, border)
6. Effects (shadow, opacity, blur)
7. Transitions/animations
8. Responsive modifiers

```typescript
<div className="
  flex items-center justify-between
  px-4 py-2 gap-2
  w-full max-w-md
  text-sm font-medium
  bg-card text-card-foreground
  rounded-lg shadow-sm
  hover:bg-accent
  transition-colors
">
```

### Use cn() Utility for Conditional Classes
```typescript
import { cn } from '@/lib/utils';

interface ButtonProps {
  className?: string;
  isActive?: boolean;
}

export function Button({ className, isActive }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md font-medium transition-colors',
        isActive && 'bg-primary text-primary-foreground',
        !isActive && 'bg-secondary hover:bg-secondary/80',
        className
      )}
    >
      Click me
    </button>
  );
}
```

## shadcn/ui Components

### Always Use shadcn/ui for Common UI
```typescript
// GOOD: Use shadcn/ui components
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

// AVOID: Building these from scratch
```

### Component Variants
```typescript
// Use built-in variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Combine with size
<Button variant="outline" size="sm">Small</Button>
<Button variant="default" size="lg">Large</Button>
```

## Responsive Design

### Mobile-First Approach
```typescript
// Start with mobile, add breakpoints for larger screens
<div className="
  flex flex-col          /* Mobile: Stack vertically */
  md:flex-row           /* Tablet+: Row layout */
  lg:gap-8              /* Desktop: More spacing */
">
```

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Hide/Show by Breakpoint
```typescript
<div className="hidden md:block">Desktop only</div>
<div className="md:hidden">Mobile only</div>
```

## Animation

### Tailwind Transitions
```typescript
// Smooth color transitions
<button className="transition-colors hover:bg-accent">

// Transform transitions
<div className="transition-transform hover:scale-105">

// Multiple properties
<div className="transition-all duration-300 ease-out">
```

## Dark Mode

### Color Variables
Use CSS variables that adapt to dark mode:
```typescript
// GOOD: Uses theme-aware colors
<div className="bg-background text-foreground">
<div className="bg-card text-card-foreground">
<div className="border-border">

// AVOID: Hard-coded colors that don't adapt
<div className="bg-white text-black">
```

### Available Theme Colors
- `background` / `foreground` - Page background/text
- `card` / `card-foreground` - Card surfaces
- `primary` / `primary-foreground` - Primary actions
- `secondary` / `secondary-foreground` - Secondary elements
- `muted` / `muted-foreground` - Subdued elements
- `accent` / `accent-foreground` - Highlighted elements
- `destructive` - Error/delete actions
- `border` - Border color
- `ring` - Focus ring color
