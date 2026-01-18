# /plan-loop-implementation - Autonomous Loop Mode

Gathers requirements once, then implements in a continuous loop until all tasks complete.

## Usage
```
/plan-loop-implementation [task description]
```

Or via bash script for true autonomy:
```bash
.claude/loop.sh 50 "your task description"
```

## Philosophy

**Ralph Wiggum Mode**: "I'm helping!"
- Ask questions ONCE upfront
- Then just DO IT until done
- No re-asking, no re-planning
- State persists in `.claude/loop-state.md`

## Process

### Step 1: Gather Requirements (ONCE)
Ask via AskUserQuestion:
1. Scope/boundaries
2. Success criteria
3. Constraints
4. Edge cases to handle

### Step 2: Create Task List
Use TodoWrite to create comprehensive list:
- All items identified
- Each item specific and testable
- Dependencies noted

### Step 3: Implementation Loop
```
while (todos.some(t => t.status !== 'completed')) {
  1. Pick next pending todo
  2. Mark as in_progress
  3. Implement
  4. Validate (tests, types, lint)
  5. Mark completed (or note blocker)
  6. Update loop-state.md
}
```

### Step 4: Final Validation
- All todos completed
- Full test suite passes
- No TypeScript errors
- Summary report

## State Persistence

State is saved to `.claude/loop-state.md`:
```markdown
# Loop State

## Task: [description]

## Requirements (gathered)
- [req 1]
- [req 2]

## Progress
- [x] Task 1 - completed
- [x] Task 2 - completed
- [ ] Task 3 - in progress
- [ ] Task 4 - pending

## Blockers
- Task 5: [blocker description]

## Next Action
Continue with Task 3
```

## Context Recovery

When context runs out, just say `continue`:
1. Claude reads `.claude/loop-state.md`
2. Picks up where it left off
3. No re-asking questions
4. Continues until done

## Best For

- Adding tests to multiple files
- Migrating patterns across codebase
- Batch refactoring
- "Do X to all files matching Y"
- Clear, well-defined tasks

## Example

**User**: "add tests for all hooks in src/hooks"

**Requirements Gathered**:
- Test all 10 hooks
- Use React Testing Library
- Coverage target: 80%
- Include error cases

**Todo List Created**:
```
- [ ] Test use-auth.ts
- [ ] Test use-form.ts
- [ ] Test use-api.ts
... (all 10)
```

**Loop Executes**:
```
[1/10] Testing use-auth.ts... ✓
[2/10] Testing use-form.ts... ✓
[3/10] Testing use-api.ts... ✓
...
[10/10] Testing use-theme.ts... ✓

All tasks complete!
Coverage: 87%
```
