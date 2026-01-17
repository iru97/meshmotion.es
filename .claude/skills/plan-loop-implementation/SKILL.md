---
name: plan-loop-implementation
description: Ralph Wiggum-inspired loop implementation. Gathers requirements once, then implements in a continuous loop with validation at each step until all tasks complete. For autonomous multi-task implementation.
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - Task
  - Edit
  - Write
  - AskUserQuestion
  - TodoWrite
  - WebSearch
  - WebFetch
user-invocable: true
---

# /plan-loop-implementation - Ralph Wiggum Loop Implementation

Inspired by Geoffrey Huntley's Ralph Wiggum technique: **gather requirements once, then loop until done**.

## Usage

```
/plan-loop-implementation [your request in natural language]
```

Examples:
- `/plan-loop-implementation migrate all components to use new Button API`
- `/plan-loop-implementation add comprehensive test coverage for export hooks`
- `/plan-loop-implementation refactor animation system to use new mixer pattern`

## How It Differs from /plan

| Aspect | /plan | /plan-loop-implementation |
|--------|-------|---------------------------|
| **Pre-execution** | Lightweight analysis + questions | Questions + initial task breakdown |
| **Execution** | Agents discover, then implement | Loop: implement → validate → repeat |
| **Human involvement** | Validates plan before execution | Validates requirements, then autonomous |
| **Completion** | After implementation phase | When ALL tasks pass validation |
| **Best for** | Complex features needing planning | Batch work with clear criteria |

## Core Philosophy (Ralph Wiggum Principles)

1. **"Don't aim for perfect on first try"** - Let the loop refine the work
2. **"Don't assume not implemented"** - ALWAYS search codebase before assuming gaps
3. **"Fresh context per task"** - Use Task subagents to avoid context pollution
4. **"Validation gates"** - Don't move on until tests/lint/typecheck pass
5. **"State via filesystem"** - TodoWrite persists between context resets

## The Loop Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: REQUIREMENTS (one-time, upfront)                       │
├─────────────────────────────────────────────────────────────────┤
│ 1. Ask user: What to implement?                                 │
│ 2. Ask user: Success criteria?                                  │
│ 3. Ask user: Constraints?                                       │
│ 4. Create initial TodoWrite task list                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2: IMPLEMENTATION LOOP (repeats until done)               │
├─────────────────────────────────────────────────────────────────┤
│ For each task in TodoWrite:                                     │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ ORIENT                                                  │   │
│   │ • Task(Explore): Find relevant files for this task     │   │
│   │ • Read existing code - DON'T ASSUME GAPS               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                         ↓                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ IMPLEMENT                                               │   │
│   │ • Make changes for THIS TASK ONLY                       │   │
│   │ • Small, focused edits                                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                         ↓                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ VALIDATE                                                │   │
│   │ • Run: npm run type-check                               │   │
│   │ • Run: npm run lint                                     │   │
│   │ • Run: npm run test (if applicable)                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                         ↓                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ VALIDATION PASSED?                                      │   │
│   │                                                         │   │
│   │ NO  → Fix issues, re-validate (stay on same task)       │   │
│   │ YES → Mark task complete, commit, move to next task     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│ Repeat until ALL tasks in TodoWrite are completed               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3: COMPLETION                                             │
├─────────────────────────────────────────────────────────────────┤
│ • Final validation: full test suite                             │
│ • Summary of all changes made                                   │
│ • Git log of commits                                            │
└─────────────────────────────────────────────────────────────────┘
```

## Phase 1: Requirements Gathering

Use `AskUserQuestion` ONCE at the start:

```
Question 1: Implementation Scope
- Header: "Scope"
- Options:
  - "Single component/hook" - One focused change
  - "Related set of changes" - 2-5 related items
  - "System-wide migration" - Touch many files
  - "Let me describe..."

Question 2: Success Criteria
- Header: "Done when"
- multiSelect: true
- Options:
  - "All tests pass"
  - "No TypeScript errors"
  - "No lint warnings"
  - "Feature works as described"
  - "Performance targets met"

Question 3: Constraints
- Header: "Constraints"
- multiSelect: true
- Options:
  - "Don't break existing functionality"
  - "Follow existing patterns"
  - "Commit after each task"
  - "No new dependencies"
```

## Phase 2: The Implementation Loop

### Step 1: ORIENT (before each task)

**Critical**: Use Task(Explore) to find relevant code. NEVER assume something doesn't exist.

```typescript
// WRONG: Assume and create
"I'll create a new useExport hook..."

// RIGHT: Search first
Task(Explore): "Find all export-related hooks and utilities in src/"
// Then read what exists before deciding what to create/modify
```

### Step 2: IMPLEMENT (focused changes)

- One task at a time
- Small, incremental edits
- Follow existing patterns found in ORIENT step
- Don't refactor unrelated code

### Step 3: VALIDATE (mandatory gate)

```bash
# Run ALL checks - don't skip any
npm run type-check   # Must pass
npm run lint         # Must pass
npm run test         # Must pass (if tests exist)
```

### Step 4: DECISION GATE

```
IF validation fails:
  - Read error messages carefully
  - Fix the specific issues
  - Re-run validation
  - DO NOT move to next task until this passes

IF validation passes:
  - Mark task as completed in TodoWrite
  - Commit with descriptive message
  - Move to next pending task
```

## TodoWrite Structure

```typescript
// Initial task breakdown
[
  { content: "[1/5] Add ExportState to viewer-store", status: "pending", activeForm: "Adding export state" },
  { content: "[2/5] Create useExportModel hook", status: "pending", activeForm: "Creating export hook" },
  { content: "[3/5] Build ExportModal component", status: "pending", activeForm: "Building export modal" },
  { content: "[4/5] Add keyboard shortcut Cmd+E", status: "pending", activeForm: "Adding keyboard shortcut" },
  { content: "[5/5] Write tests for export functionality", status: "pending", activeForm: "Writing export tests" },
]

// During execution - only ONE in_progress at a time
[
  { content: "[1/5] Add ExportState to viewer-store", status: "completed", activeForm: "Adding export state" },
  { content: "[2/5] Create useExportModel hook", status: "in_progress", activeForm: "Creating export hook" },  // ← Current
  { content: "[3/5] Build ExportModal component", status: "pending", activeForm: "Building export modal" },
  { content: "[4/5] Add keyboard shortcut Cmd+E", status: "pending", activeForm: "Adding keyboard shortcut" },
  { content: "[5/5] Write tests for export functionality", status: "pending", activeForm: "Writing export tests" },
]
```

## Critical Rules

### 1. NEVER Skip Validation
```
# WRONG
"I'll fix the lint errors later..."
"The types are probably fine..."

# RIGHT
Run validation after EVERY change.
Fix ALL errors before moving on.
```

### 2. ALWAYS Search Before Creating
```
# WRONG
"I don't see a util for this, I'll create one..."

# RIGHT
Task(Explore): "Search for existing utilities that handle [X]"
// Only create if truly doesn't exist
```

### 3. ONE Task at a Time
```
# WRONG
"While I'm here, let me also refactor this..."
"I'll add this enhancement too..."

# RIGHT
Complete current task → Validate → Commit → Next task
```

### 4. Commit After Each Task
```bash
# After validation passes
git add -A
git commit -m "feat: [task description]"
```

### 5. Fresh Context via Subagents
```typescript
// Use Task(Explore) for investigation - keeps main context clean
const files = await Task({
  type: 'Explore',
  prompt: 'Find all files that import from viewer-store'
});
```

## Example Session

```
User: /plan-loop-implementation add export functionality with GLB, GLTF, and OBJ formats

Claude: I'll gather requirements for the loop implementation.

[AskUserQuestion: Scope?]
User: Related set of changes

[AskUserQuestion: Done when?]
User: [selects] All tests pass, No TypeScript errors, Feature works

[AskUserQuestion: Constraints?]
User: [selects] Follow existing patterns, Commit after each task

## Initial Task Breakdown

Creating TodoWrite:
1. [1/6] Add ExportFormat type and ExportState to types
2. [2/6] Add export state and actions to viewer-store
3. [3/6] Create useFormatExporter hook
4. [4/6] Create ExportModal component
5. [5/6] Integrate export button in ActionToolbar
6. [6/6] Add tests for export functionality

Starting implementation loop...

---

### Task 1/6: Add ExportFormat type and ExportState

**ORIENT**
Task(Explore): Finding existing type definitions...
Found: src/types/viewer.ts - existing viewer types

**IMPLEMENT**
Adding ExportFormat and ExportState to src/types/viewer.ts...

**VALIDATE**
$ npm run type-check
✓ No errors

$ npm run lint
✓ No warnings

**COMMIT**
$ git commit -m "feat: add ExportFormat type and ExportState"

Marking task 1/6 complete. Moving to task 2/6...

---

### Task 2/6: Add export state and actions to viewer-store

**ORIENT**
Task(Explore): Finding viewer-store implementation...
Found: src/lib/store/viewer-store.ts

**IMPLEMENT**
Adding exportFormat, isExporting, setExportFormat, startExport...

**VALIDATE**
$ npm run type-check
✗ Error: Property 'exportFormat' missing in initial state

**FIX**
Adding initial value for exportFormat...

**VALIDATE (retry)**
$ npm run type-check
✓ No errors

$ npm run lint
✓ No warnings

**COMMIT**
$ git commit -m "feat: add export state and actions to viewer-store"

Marking task 2/6 complete. Moving to task 3/6...

[continues until all 6 tasks complete]

---

## Completion Summary

All 6 tasks completed:
✓ [1/6] Add ExportFormat type and ExportState to types
✓ [2/6] Add export state and actions to viewer-store
✓ [3/6] Create useFormatExporter hook
✓ [4/6] Create ExportModal component
✓ [5/6] Integrate export button in ActionToolbar
✓ [6/6] Add tests for export functionality

Final validation:
$ npm run type-check → ✓
$ npm run lint → ✓
$ npm run test → ✓

6 commits created. Export functionality complete.
```

## When to Use This vs /plan

| Use `/plan-loop-implementation` | Use `/plan` |
|--------------------------------|-------------|
| Clear, well-defined tasks | Ambiguous requirements |
| Batch migrations/refactors | Complex features needing design |
| Adding test coverage | Research-heavy tasks |
| Mechanical transformations | Architectural decisions |
| "Do X to all files matching Y" | "Figure out how to implement X" |

## Escape Hatches

If the loop gets stuck:
1. **3 failed attempts on same issue** → Stop and ask user
2. **Circular fixes** (A breaks B, fixing B breaks A) → Stop and ask user
3. **Missing information** → Stop and ask user
4. **Scope creep detected** → Stop and ask user

## Integration with /plan

You can combine them:
```
/plan research and design new animation system
[After plan completes and design is clear]
/plan-loop-implementation implement the animation system based on the design
```

The `/plan` handles the "what and why", `/plan-loop-implementation` handles the "execute until done".
