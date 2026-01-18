# /plan - Master Orchestration Command

Analyzes ANY request, maps to available capabilities, validates plan with user, then executes.

## Usage
```
/plan [your request in natural language]
```

## Process

### Phase 1: Analysis (Lightweight)
Determine from keywords:
- **Type**: bug-fix, feature, refactor, research, migration, performance
- **Scope**: micro (1 file), small (2-5), medium (5-10), large (10+), epic (architectural)
- **Complexity**: 1-5 stars
- **Domains**: ui, state, api, auth, etc.

### Phase 2: Validation (AskUserQuestion)
Ask 2-4 focused questions:
1. Scope confirmation
2. Focus areas
3. Constraints
4. Approach preference (if options exist)

### Phase 3: Resource Selection
Based on analysis, select:
- Task subagents to spawn
- Agent prompts to read
- Skills to invoke
- Tools to use

### Phase 4: Orchestration Plan
Generate plan showing:
- Phases with agents
- Quality gates
- Estimated complexity

### Phase 5: Execute
- Use TodoWrite for tracking
- Spawn Task agents for deep work
- Validate at each gate
- Adapt as agents discover specifics

## Example

**User**: "fix the login button not working"

**Analysis**:
- Type: bug-fix
- Scope: small (likely 1-3 files)
- Complexity: 2 ⭐⭐
- Domains: ui, auth

**Validation Questions**:
1. "What happens when you click? (nothing / error / wrong redirect)"
2. "Is this on all pages or specific?"

**Plan**:
```
Phase 1: Investigation
├── Task(Explore): Find login button component
├── Read: Related auth hooks
└── Gate: Understand root cause

Phase 2: Fix
├── Edit: Apply fix
├── Read agent: code-reviewer
└── Gate: No errors

Phase 3: Verify
├── Type-check, lint
└── Done
```

## Integration with /plan-loop-implementation

For batch work with clear success criteria:
```
/plan-loop-implementation add tests for all hooks
```

The loop will:
1. Ask requirements ONCE
2. Create TodoWrite list
3. Loop until all complete
4. Validate each item
