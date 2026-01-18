---
name: orchestrator
description: Prompt template for complex multi-step tasks. Read this file for guidance on coordinating large features, managing task dependencies, and ensuring comprehensive completion.
tools: Read, Glob, Grep, Bash, Task, AskUserQuestion, TodoWrite
model: opus
---

# Orchestrator Prompt Template

This document provides guidance for coordinating complex development tasks. Read this when working on large features or multi-system changes.

**How to use**: Read this file for patterns and workflows, then apply the guidance to your current task. This is NOT auto-spawned - it's a prompt template for reference.

## When to Apply This Guidance

- **Large Features**: Features touching 5+ files or multiple systems
- **Architectural Changes**: Changes to state management, routing, or core patterns
- **Cross-Cutting Concerns**: Performance optimization, security hardening
- **Release Preparation**: Coordinating multiple PRs, testing, documentation
- **Recovery**: Recovering from failed builds, broken states

## Orchestration Workflow

### Phase 1: Task Analysis

Break down the request into components:

```typescript
interface OrchestrationPlan {
  goal: string;
  phases: Phase[];
  agents: AgentAssignment[];
  skills: SkillUsage[];
  risks: Risk[];
  successCriteria: string[];
}

interface Phase {
  name: string;
  tasks: Task[];
  dependencies: string[];  // Phase names this depends on
  canParallelize: boolean;
}

interface AgentAssignment {
  agent: string;
  phase: string;
  task: string;
}
```

### Phase 2: Interactive Planning

Use `AskUserQuestion` to validate approach:

```
Question 1: Confirm scope
- Header: "Scope"
- Options:
  - "Proceed with full plan"
  - "Start with Phase 1 only"
  - "Need to discuss approach"
  - "Too large, break down further"

Question 2: Constraints
- Header: "Constraints"
- multiSelect: true
- Options:
  - "Must maintain backward compatibility"
  - "Performance is critical"
  - "Time-sensitive"
  - "Learning exercise (explain more)"
```

### Phase 3: Task Delegation

Use `Task` tool with built-in subagent types for parallel work:

```typescript
// Example: Spawn subagents for parallel exploration/research
await Promise.all([
  Task({ subagent_type: 'Explore', prompt: 'Find all files related to animation system' }),
  Task({ subagent_type: 'general-purpose', prompt: 'Research Three.js performance patterns' }),
  Task({ subagent_type: 'Plan', prompt: 'Design architecture for new feature' }),
]);
```

**Task subagent types:**
- `Explore`: Fast codebase exploration, finding files, searching code
- `Plan`: Designing implementation plans, architectural decisions
- `general-purpose`: Research, multi-step analysis, complex queries
- `Bash`: Command execution, git operations, terminal tasks

**Agent prompt templates** (read for guidance):
- `code-reviewer`: After any code changes
- `test-architect`: When adding features
- `threejs-optimizer`: For 3D/rendering work
- `refactoring-architect`: For structural changes
- `sprint-planner`: For breaking down work

### Phase 4: Execution Tracking

Use `TodoWrite` to track multi-phase progress:

```typescript
[
  // Phase 1: Foundation
  { content: "Phase 1: Research & Planning", status: "completed", activeForm: "Planning" },
  { content: "  - Analyze current implementation", status: "completed", activeForm: "Analyzing" },
  { content: "  - Document requirements", status: "completed", activeForm: "Documenting" },

  // Phase 2: Implementation
  { content: "Phase 2: Core Implementation", status: "in_progress", activeForm: "Implementing core" },
  { content: "  - Update types", status: "completed", activeForm: "Updating types" },
  { content: "  - Modify store", status: "in_progress", activeForm: "Modifying store" },
  { content: "  - Create components", status: "pending", activeForm: "Creating components" },

  // Phase 3: Integration
  { content: "Phase 3: Integration", status: "pending", activeForm: "Integrating" },

  // Phase 4: Verification
  { content: "Phase 4: Verification", status: "pending", activeForm: "Verifying" },
]
```

### Phase 5: Quality Gates

Before completing each phase, verify:

```typescript
interface QualityGate {
  phase: string;
  checks: Check[];
  blocking: boolean;
}

const gates: QualityGate[] = [
  {
    phase: 'implementation',
    checks: [
      { name: 'Type check', command: 'npm run type-check' },
      { name: 'Lint', command: 'npm run lint' },
    ],
    blocking: true,
  },
  {
    phase: 'integration',
    checks: [
      { name: 'Build', command: 'npm run build' },
      { name: 'Tests', command: 'npm run test' },
    ],
    blocking: true,
  },
];
```

## Orchestration Patterns

### Pattern 1: Sequential Phases
```
Phase 1 → Phase 2 → Phase 3 → Phase 4
(Must complete in order)
```

### Pattern 2: Parallel Work
```
        ┌→ Phase 2a ─┐
Phase 1 ─┼→ Phase 2b ─┼→ Phase 3
        └→ Phase 2c ─┘
(2a, 2b, 2c can run in parallel)
```

### Pattern 3: Iterative
```
Phase 1 → Phase 2 → Review → (if issues) → Phase 2
                          → (if pass) → Phase 3
```

## Complex Task Templates

### Template: New Feature End-to-End
```
1. Requirements (sprint-planner)
2. Architecture (architecture-decision)
3. Implementation (parallel):
   - Types
   - Store
   - Components
4. Integration
5. Testing (test-architect)
6. Review (code-reviewer)
7. Documentation
8. PR Preparation (pr-preparation)
```

### Template: Performance Optimization
```
1. Baseline Measurement (threejs-optimizer)
2. Identify Bottlenecks
3. Plan Optimizations (architecture-decision)
4. Implement (iterative):
   - Change
   - Measure
   - Verify improvement
5. Document Results
```

### Template: Major Refactoring
```
1. Document Current State
2. Plan Changes (refactoring-architect)
3. Create Safety Net:
   - Add tests for existing behavior
   - Document expected outcomes
4. Incremental Changes:
   - Small change
   - Verify
   - Commit
5. Final Verification
6. Update Documentation
```

## Error Recovery

When things go wrong:

1. **Build Failure**: Identify failing component, fix incrementally
2. **Test Failure**: Determine if test or implementation is wrong
3. **Type Errors**: Fix from bottom up (types → implementation)
4. **Runtime Errors**: Add debugging, identify root cause

Use `AskUserQuestion` when stuck:

```
Question: How to proceed?
- Header: "Blocked"
- Options:
  - "Try alternative approach"
  - "Rollback and restart"
  - "Need user input"
  - "Skip and continue"
```

## Success Criteria

Before declaring complete, verify:

- [ ] All phases completed
- [ ] All quality gates passed
- [ ] No regressions introduced
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Ready for PR or merged

## Output Format

```markdown
## Orchestration Complete: [Task Name]

### Summary
[What was accomplished]

### Phases Completed
1. ✅ Phase 1: [name] - [summary]
2. ✅ Phase 2: [name] - [summary]
3. ✅ Phase 3: [name] - [summary]

### Agents Used
- code-reviewer: [findings]
- test-architect: [tests added]

### Quality Gates
- ✅ Type check
- ✅ Lint
- ✅ Build
- ✅ Tests

### Changes Made
- [files modified/created]

### Next Steps
- [any follow-up needed]
```
