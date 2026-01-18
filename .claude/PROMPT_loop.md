# Loop Iteration Prompt

You are in a Ralph Wiggum loop. An external bash script is running you repeatedly until all tasks are complete.

## FIRST: Read State File

```
Read .claude/loop-state.md
```

This file contains:
- Original request
- Requirements (if gathered)
- Task list with completion status
- Progress log

## YOUR MISSION THIS ITERATION

Complete **ONE task** from the task list, then exit. The bash loop will restart you.

### If State Shows "Requirements: (To be gathered)"

This is the FIRST iteration. You must:
1. Use AskUserQuestion to gather requirements (scope, success criteria, constraints)
2. Break down the request into numbered tasks
3. Update the state file with requirements and tasks
4. Exit (bash loop will restart you to begin implementation)

### If Tasks Exist with Pending Items

1. **ORIENT**: Find the first uncompleted task `[ ]`
2. **EXPLORE**: Use Task(Explore) to find relevant files - NEVER assume code doesn't exist
3. **IMPLEMENT**: Make changes for THIS TASK ONLY
4. **VALIDATE**: Run `npm run type-check && npm run lint`
5. **IF VALIDATION FAILS**: Fix and retry (stay on same task)
6. **IF VALIDATION PASSES**:
   - Update state file: change `[ ]` to `[x]` for this task
   - Add to progress log: timestamp, task completed, commit hash
   - Commit: `git add -A && git commit -m "feat: [task description]"`
   - Exit normally (bash loop continues)

### If ALL Tasks Are Complete `[x]`

1. Run final validation: `npm run type-check && npm run lint && npm run test`
2. If all pass, output: `<loop-complete>`
3. The bash loop will exit successfully

## SIGNALS

Output these EXACT strings for the bash loop to detect:

- `<loop-complete>` - All tasks done, validation passed
- `<loop-abort>` - Something is fundamentally wrong, stop the loop
- `<loop-stuck>` - Need human intervention (3+ failed attempts on same issue)

## CRITICAL RULES

1. **ONE TASK PER ITERATION** - Do not try to complete multiple tasks
2. **ALWAYS UPDATE STATE FILE** - Before exiting, update the state file
3. **COMMIT AFTER EACH TASK** - Each successful task = one commit
4. **DON'T ASK QUESTIONS AFTER FIRST ITERATION** - Requirements are in state file
5. **SEARCH BEFORE CREATING** - Use Task(Explore) to find existing code

## STATE FILE FORMAT

```markdown
# Loop Implementation State

## Status: IN_PROGRESS | COMPLETE | ABORTED

## Original Request
> [the user's original request]

## Requirements
- Scope: [single/related/migration]
- Success Criteria: [what "done" looks like]
- Constraints: [rules to follow]

## Tasks
- [x] [1/N] First task (completed)
- [x] [2/N] Second task (completed)
- [ ] [3/N] Third task ← CURRENT (do this one)
- [ ] [4/N] Fourth task
- [ ] [5/N] Fifth task

## Progress Log
- 2024-01-15 14:30: Loop started
- 2024-01-15 14:35: Task 1 complete (commit: abc123)
- 2024-01-15 14:42: Task 2 complete (commit: def456)
```

## EXAMPLE ITERATION

```
[Claude starts]

Reading state file...

Found:
- Status: IN_PROGRESS
- Tasks: 2/5 complete
- Current task: [3/5] Write tests for GLTF export

ORIENT: Task 3 - Write tests for GLTF export

EXPLORE:
Task(Explore): "Find GLTF export implementation and existing test patterns"
Found: src/lib/conversion/gltf-exporter.ts
Found: src/hooks/__tests__/use-format-exporter.test.ts

IMPLEMENT:
Adding tests to use-format-exporter.test.ts for GLTF format...

VALIDATE:
$ npm run type-check
✓ No errors
$ npm run lint
✓ No warnings

UPDATE STATE FILE:
- [x] [3/5] Write tests for GLTF export

COMMIT:
$ git commit -m "test: add GLTF export tests"
[abc789]

Progress: 3/5 tasks complete. Exiting for next iteration.

[Claude exits, bash loop restarts Claude]
```

## NOW: Read the state file and execute ONE task.
