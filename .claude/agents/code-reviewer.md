---
name: code-reviewer
description: Prompt template for code review. Read this file for guidance on reviewing MeshMotion code for quality, security, and adherence to project patterns.
tools: Read, Grep, Glob, Bash
model: sonnet
---

# Code Reviewer Prompt Template

This document provides guidance for reviewing MeshMotion code. Read this when performing code reviews.

**How to use**: Read this file for review checklists and patterns, then apply the guidance to review code changes.

## MeshMotion-Specific Review Checklist

### 1. React/TypeScript Standards
- [ ] Functional components only (no class components)
- [ ] Named exports (no default exports except pages)
- [ ] Props interfaces named `ComponentNameProps`
- [ ] No `any` types - use `unknown` or proper types
- [ ] Interfaces for object shapes, types for unions
- [ ] Proper cleanup in useEffect hooks

### 2. Zustand Store Patterns (viewer-store.ts)
- [ ] Selectors used for state access (not destructuring)
```typescript
// CORRECT
const isPlaying = useViewerStore((state) => state.isPlaying)
// WRONG
const { isPlaying } = useViewerStore()
```
- [ ] Actions defined in store, not components
- [ ] Shallow comparison when selecting objects
- [ ] State updates use functional pattern

### 3. Three.js / React Three Fiber
- [ ] Resources disposed on cleanup (geometry, material, texture)
- [ ] No state updates in useFrame - use refs
- [ ] Geometries/materials reused with useMemo
- [ ] Dynamic imports with `ssr: false` for Three.js components
- [ ] Proper animation mixer cleanup

### 4. Performance Patterns
- [ ] No inline objects/functions in JSX
- [ ] useCallback for handlers passed to children
- [ ] useMemo for expensive computations
- [ ] Direct imports (no barrel file imports)
- [ ] Lazy state initialization

### 5. Async/Result Pattern
All async functions must return:
```typescript
interface Result<T> {
  success: boolean
  data?: T
  error?: string
  warnings?: string[]
}
```

### 6. Security Checks
- [ ] No hardcoded secrets or API keys
- [ ] Input validation for file uploads (50MB limit)
- [ ] Proper file type validation
- [ ] No console.log in production code

## Review Process

1. Run `git diff` to see changes
2. Read modified files completely
3. Cross-reference with project patterns in `.claude/rules/`
4. Generate review in this format:

```markdown
## Code Review: [File Name]

### Summary
Brief overview of changes and overall quality score (1-10)

### Critical Issues (Must Fix)
- Issue description
  - Location: `file:line`
  - Problem: What's wrong
  - Fix: How to fix with code example

### Improvements (Should Fix)
- Same format as critical

### Suggestions (Consider)
- Same format

### Positive Observations
- What was done well
```

## Commands to Run
```bash
git diff HEAD~1
npm run lint
npm run type-check
```
