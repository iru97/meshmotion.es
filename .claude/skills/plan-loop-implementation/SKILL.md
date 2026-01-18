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

# /plan-loop-implementation - Ralph Wiggum Loop

Real implementation of Geoffrey Huntley's Ralph Wiggum technique using an **external bash loop**.

## How It ACTUALLY Works

```
┌─────────────────────────────────────────────────────────────────┐
│ EXTERNAL BASH SCRIPT (.claude/loop.sh)                          │
├─────────────────────────────────────────────────────────────────┤
│ for i in 1..N; do                                               │
│   claude -p "$(cat PROMPT_loop.md)"                             │
│   if output contains "<loop-complete>"; then exit 0; fi         │
│ done                                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ EACH ITERATION (Claude runs, does ONE task, exits)              │
├─────────────────────────────────────────────────────────────────┤
│ 1. Read .claude/loop-state.md                                   │
│ 2. Find first uncompleted task                                  │
│ 3. Orient → Implement → Validate                                │
│ 4. Update state file, commit                                    │
│ 5. Exit (bash loop restarts Claude)                             │
└─────────────────────────────────────────────────────────────────┘
```

**Key insight**: Claude doesn't maintain the loop - the BASH SCRIPT does. Claude just does ONE task per invocation. Fresh context each time.

## Usage

### Start a New Loop

```bash
# From project root
.claude/loop.sh 50 "add tests for all export hooks"
```

This will:
1. Create `.claude/loop-state.md` with the goal
2. First iteration: Claude asks requirements, creates task breakdown
3. Subsequent iterations: Claude completes ONE task each
4. Loop until all tasks complete or max iterations reached

### Resume an Existing Loop

```bash
# If loop was interrupted or hit max iterations
.claude/loop.sh 30
```

Claude reads the existing state file and continues from where it left off.

### From Claude Code (Interactive)

If you invoke this skill interactively:

```
/plan-loop-implementation add tests for all export hooks
```

Claude will:
1. Check if `.claude/loop-state.md` exists
2. If YES: Continue from current state (one task)
3. If NO: Gather requirements, create state, do first task

Then tell you to run the bash loop for autonomous execution:
```
To run autonomously: .claude/loop.sh 50
```

## Files

| File | Purpose |
|------|---------|
| `.claude/loop.sh` | External bash loop script |
| `.claude/PROMPT_loop.md` | Prompt fed to Claude each iteration |
| `.claude/loop-state.md` | Persistent state (tasks, progress) |
| `.claude/loop-progress.log` | Log of all iterations |

## State File Format

```markdown
# Loop Implementation State

## Status: IN_PROGRESS

## Original Request
> add tests for all export hooks

## Requirements
- Scope: Related set of changes
- Success Criteria: All tests pass, No TypeScript errors
- Constraints: Follow existing patterns, Commit after each task

## Tasks
- [x] [1/5] Create test file structure
- [x] [2/5] Write tests for GLB export
- [ ] [3/5] Write tests for GLTF export   ← CURRENT
- [ ] [4/5] Write tests for OBJ export
- [ ] [5/5] Add integration tests

## Progress Log
- 2024-01-15 14:30: Loop started
- 2024-01-15 14:35: Task 1 complete (commit: abc123)
- 2024-01-15 14:42: Task 2 complete (commit: def456)
```

## Signals

Claude outputs these for the bash loop to detect:

| Signal | Meaning | Bash Action |
|--------|---------|-------------|
| `<loop-complete>` | All tasks done, validated | Exit 0 (success) |
| `<loop-abort>` | Fatal error, stop loop | Exit 1 (failure) |
| `<loop-stuck>` | Needs human help | Exit 2 (intervention needed) |

## Session Compaction Handling

When Claude's context is compacted:
1. **State file persists** - All progress is in `.claude/loop-state.md`
2. **PROMPT_loop.md instructs** - "First, read state file"
3. **Fresh context is fine** - Each iteration is independent

This is WHY the external loop works:
- Claude doesn't need to remember anything
- State is on disk
- Bash loop provides continuity

## Example Full Run

```bash
$ .claude/loop.sh 50 "add comprehensive tests for export functionality"

==========================================
=== Iteration 1 of 50 ===
==========================================

Reading state file...
First iteration - gathering requirements.

[AskUserQuestion: Scope?]
> Related set of changes

[AskUserQuestion: Success criteria?]
> All tests pass, No TypeScript errors

Creating task breakdown...
5 tasks created. State file updated.

==========================================
=== Iteration 2 of 50 ===
==========================================

Reading state file...
Task 1/5: Create test file structure

EXPLORE: Finding existing test patterns...
IMPLEMENT: Creating __tests__ directory structure...
VALIDATE: npm run type-check ✓
COMMIT: test: create export test structure (abc123)

State updated. 1/5 complete.

==========================================
=== Iteration 3 of 50 ===
==========================================

[... continues until all tasks complete ...]

==========================================
=== Iteration 8 of 50 ===
==========================================

Reading state file...
All tasks complete [x]. Running final validation...

$ npm run type-check ✓
$ npm run lint ✓
$ npm run test ✓

<loop-complete>

==========================================
LOOP COMPLETE!
Finished after 8 iterations.
==========================================
```

## When to Use

| Use This | Use `/plan` Instead |
|----------|---------------------|
| Clear, mechanical tasks | Ambiguous requirements |
| Batch operations | Need to figure out WHAT to do |
| "Do X to all files" | Research needed |
| Adding test coverage | Architectural decisions |
| Migrations/refactors | Complex design work |

## Combining with /plan

```bash
# First, use /plan to figure out WHAT to do
/plan design the new export system

# After design is clear, use loop for execution
.claude/loop.sh 100 "implement the export system per the design in ARCHITECTURE.md"
```

## Troubleshooting

### Loop Stuck
```bash
$ .claude/loop.sh 30
# ... iterations ...
<loop-stuck>
LOOP STUCK - needs human intervention.
```

Check `.claude/loop-state.md` for the issue, fix manually or provide guidance, then resume:
```bash
$ .claude/loop.sh 30
```

### Max Iterations Reached
```bash
Reached max iterations (50).
Progress saved in .claude/loop-state.md
To continue: .claude/loop.sh 50
```

Just run again with more iterations.

### Want to Start Over
```bash
rm .claude/loop-state.md
.claude/loop.sh 50 "new goal here"
```
