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

# /plan-loop-implementation - Persistent Loop Implementation

Inspired by Geoffrey Huntley's Ralph Wiggum technique. **Gathers requirements ONCE, then loops until ALL tasks complete** - even across multiple Claude sessions.

## How It Actually Works (Not Just Theory)

```
┌─────────────────────────────────────────────────────────────────┐
│ ON INVOCATION: Check for existing loop state                    │
├─────────────────────────────────────────────────────────────────┤
│ Read .claude/loop-state.md                                      │
│                                                                 │
│ EXISTS with pending tasks? → CONTINUE from where we left off    │
│ DOESN'T EXIST?            → START FRESH (gather requirements)   │
└─────────────────────────────────────────────────────────────────┘
```

**This is the key**: State persists on disk, so you can continue across sessions.

## User Workflow

```bash
# Start the loop
/plan-loop-implementation add tests for all export hooks

# [Claude asks questions, creates state file, starts implementing]
# [After some tasks, context gets long or you need to pause]

# Continue anytime - just say:
continue

# Or re-invoke:
/plan-loop-implementation

# [Claude reads state file, sees pending tasks, continues WITHOUT re-asking questions]
```

## State File Format

Location: `.claude/loop-state.md`

```markdown
# Loop Implementation State

## Status: IN_PROGRESS

## Original Request
> add tests for all export hooks

## Requirements (gathered once)
- Scope: Related set of changes
- Success Criteria: All tests pass, No TypeScript errors
- Constraints: Follow existing patterns, Commit after each task

## Tasks
- [x] [1/5] Create test file for useFormatExporter
- [x] [2/5] Write tests for GLB export
- [ ] [3/5] Write tests for GLTF export        ← CURRENT
- [ ] [4/5] Write tests for OBJ export
- [ ] [5/5] Add integration tests

## Progress Log
- 2024-01-15 14:30: Started loop
- 2024-01-15 14:35: Task 1 complete (commit: abc123)
- 2024-01-15 14:42: Task 2 complete (commit: def456)
- 2024-01-15 14:50: Paused (context limit)
- 2024-01-15 15:00: Resumed
```

## Execution Flow

### Step 1: Check State (ALWAYS FIRST)

```typescript
// FIRST THING ON INVOCATION
const stateFile = await Read('.claude/loop-state.md');

if (stateFile.exists && stateFile.status === 'IN_PROGRESS') {
  // CONTINUE MODE - don't ask questions again!
  const pendingTasks = stateFile.tasks.filter(t => !t.completed);
  if (pendingTasks.length > 0) {
    continueFromTask(pendingTasks[0]);
  } else {
    completeLoop();
  }
} else {
  // START FRESH - gather requirements
  gatherRequirements();
}
```

### Step 2: Gather Requirements (only if starting fresh)

Use `AskUserQuestion` ONCE:

```
Question 1: What to implement?
- Header: "Scope"
- Options:
  - "Single component/hook"
  - "Related set of changes"
  - "System-wide migration"

Question 2: When is it done?
- Header: "Done when"
- multiSelect: true
- Options:
  - "All tests pass"
  - "No TypeScript errors"
  - "No lint warnings"
  - "Feature works as described"

Question 3: Constraints?
- Header: "Constraints"
- multiSelect: true
- Options:
  - "Don't break existing functionality"
  - "Follow existing patterns"
  - "Commit after each task"
```

### Step 3: Create State File & Task List

```markdown
# Loop Implementation State

## Status: IN_PROGRESS

## Original Request
> [user's request]

## Requirements
- Scope: [from question 1]
- Success Criteria: [from question 2]
- Constraints: [from question 3]

## Tasks
- [ ] [1/N] First task
- [ ] [2/N] Second task
...

## Progress Log
- [timestamp]: Started loop
```

### Step 4: Implementation Loop

For EACH task:

```
┌─────────────────────────────────────────────────────────────────┐
│ ORIENT                                                          │
│ • Task(Explore): Find relevant files for THIS task              │
│ • Read existing code - NEVER assume something doesn't exist     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ IMPLEMENT                                                       │
│ • Make changes for THIS TASK ONLY                               │
│ • Small, focused edits                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ VALIDATE                                                        │
│ • npm run type-check                                            │
│ • npm run lint                                                  │
│ • npm run test (if applicable)                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ VALIDATION PASSED?                                              │
│                                                                 │
│ NO  → Fix issues, re-validate (stay on same task)               │
│ YES → Update state file, commit, continue to next task          │
└─────────────────────────────────────────────────────────────────┘
```

### Step 5: Update State After Each Task

After successful validation:

1. **Update state file**:
   ```markdown
   - [x] [3/5] Write tests for GLTF export  ← Mark complete
   - [ ] [4/5] Write tests for OBJ export   ← Now current
   ```

2. **Add to progress log**:
   ```markdown
   - 2024-01-15 14:50: Task 3 complete (commit: ghi789)
   ```

3. **Commit**:
   ```bash
   git add -A && git commit -m "feat: [task description]"
   ```

4. **Update TodoWrite** for UI visibility

### Step 6: Completion

When all tasks are done:

1. **Update state file**:
   ```markdown
   ## Status: COMPLETE
   ```

2. **Final validation**: Run full test suite

3. **Summary**: List all commits made

4. **Cleanup option**: Ask if user wants to delete state file

## Critical Rules

### 1. ALWAYS Check State First
```
// WRONG: Start asking questions immediately
"Let me gather requirements..."

// RIGHT: Check state file first
Read('.claude/loop-state.md') → Continue if exists, else gather requirements
```

### 2. NEVER Re-Ask Questions on Continue
```
// WRONG: Ask questions again when user says "continue"
"What would you like to implement?"

// RIGHT: Read state file, continue from pending task
"Continuing from task 3/5: Write tests for GLTF export..."
```

### 3. Update State File After EVERY Task
```
// WRONG: Only update at the end
// If context runs out, progress is lost!

// RIGHT: Update state file immediately after each task completes
```

### 4. Commit After Each Task
```bash
# Each successful task = one commit
# Easy to rollback if needed
# Progress is preserved in git history
```

## Example Session

```
User: /plan-loop-implementation add tests for all export hooks

Claude: I'll check for existing loop state...
        No existing state found. Let me gather requirements.

[AskUserQuestion: Scope?]
User: Related set of changes

[AskUserQuestion: Done when?]
User: [selects] All tests pass, No TypeScript errors

[AskUserQuestion: Constraints?]
User: [selects] Follow existing patterns, Commit after each task

Claude: Creating loop state and task breakdown...

## Loop State Created

Tasks:
1. [ ] Create test file for useFormatExporter
2. [ ] Write tests for GLB export
3. [ ] Write tests for GLTF export
4. [ ] Write tests for OBJ export
5. [ ] Add integration tests

Starting implementation loop...

---

### Task 1/5: Create test file for useFormatExporter

**ORIENT**
Task(Explore): Finding existing test patterns...
Found: src/hooks/__tests__/use-gltf-loader.test.ts

**IMPLEMENT**
Creating src/hooks/__tests__/use-format-exporter.test.ts...

**VALIDATE**
$ npm run type-check → ✓
$ npm run lint → ✓
$ npm run test → ✓

**COMMIT**
$ git commit -m "test: add test file for useFormatExporter"

Updating state file... Task 1/5 complete.

---

### Task 2/5: Write tests for GLB export

**ORIENT**
Task(Explore): Finding GLB export implementation...
[continues...]

---

[After task 3, context is getting long]

Claude: Progress saved. 3/5 tasks complete.

To continue, just say "continue" or invoke /plan-loop-implementation

---

User: continue

Claude: Checking loop state...
        Found: 3/5 tasks complete, continuing from task 4.

### Task 4/5: Write tests for OBJ export

[continues without re-asking questions]
```

## Escape Hatches

### Abort the Loop
```
User: abort loop
Claude: [Updates state to ABORTED, shows progress summary]
```

### Reset and Start Over
```
User: reset loop
Claude: [Deletes state file, ready for fresh start]
```

### Check Status
```
User: loop status
Claude: [Reads state file, shows current progress]
```

## When to Use This vs /plan

| `/plan` | `/plan-loop-implementation` |
|---------|----------------------------|
| Need to figure out WHAT to do | Already know WHAT, need to DO it |
| Complex design decisions | Clear, mechanical tasks |
| Research required | Implementation focused |
| Might need to pivot | Straight-line execution |

**Combine them:**
```
/plan design the new animation system
[After design is clear]
/plan-loop-implementation implement the animation system per the design
```

## State File Location

`.claude/loop-state.md` - tracked in git so you can:
- See history of loops
- Resume on different machines
- Share progress with team
