---
name: architecture-decision
description: Guide through Architecture Decision Records (ADR). Use when making significant technical decisions that should be documented. Interactive process with AskUserQuestion.
allowed-tools:
  - Read
  - Glob
  - Grep
  - WebSearch
  - AskUserQuestion
  - Write
user-invocable: true
---

# Architecture Decision Skill

Guide through creating Architecture Decision Records (ADRs) for significant technical choices.

## Usage

Invoke with: `/architecture-decision [topic]`

Examples:
- `/architecture-decision state-management`
- `/architecture-decision animation-system`
- `/architecture-decision export-formats`

## When to Create an ADR

- Adding a new library/dependency
- Changing architectural patterns
- Making performance tradeoffs
- Choosing between approaches
- Deprecating existing functionality

## ADR Creation Workflow

### Phase 1: Context Gathering

Use `AskUserQuestion` to understand the decision:

```
Question 1: Decision Type
- Header: "Type"
- Options:
  - "New feature architecture"
  - "Technology choice"
  - "Pattern/approach change"
  - "Performance optimization"
  - "Deprecation/removal"

Question 2: Urgency
- Header: "Timeline"
- Options:
  - "Immediate" - Need to decide now
  - "Soon" - Within current sprint
  - "Planning" - Future consideration
  - "Exploratory" - Just evaluating
```

### Phase 2: Research Phase

Use `WebSearch` to research options:

```
Search queries to run:
- "[technology] vs [alternative] 2025"
- "[approach] best practices React"
- "[library] performance benchmarks"
- "Three.js [topic] recommended approach"
```

Analyze codebase for current patterns:
- How similar decisions were made
- Existing dependencies and constraints
- Compatibility requirements

### Phase 3: Options Evaluation

Present options with `AskUserQuestion`:

```
Question: Preferred approach
- Header: "Approach"
- Options:
  - "Option A: [description]" - [tradeoffs]
  - "Option B: [description]" - [tradeoffs]
  - "Option C: [description]" - [tradeoffs]
  - "Need more research"
```

### Phase 4: Document Decision

Create ADR file in `.claude/docs/decisions/`:

```markdown
# ADR-XXX: [Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Date
[YYYY-MM-DD]

## Context
[What is the issue that we're seeing that motivates this decision?]

## Decision Drivers
- [Driver 1]
- [Driver 2]
- [Driver 3]

## Considered Options
1. [Option 1]
2. [Option 2]
3. [Option 3]

## Decision
We will use [chosen option] because [reasons].

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Drawback 1]
- [Drawback 2]

### Neutral
- [Observation 1]

## Implementation Notes
[How to implement this decision]

## Related Decisions
- ADR-XXX: [Related decision]

## References
- [Link to documentation]
- [Link to benchmarks]
```

### Phase 5: Confirmation

Ask for final confirmation:

```
Question: Finalize decision?
- Header: "Confirm"
- Options:
  - "Accept and document"
  - "Revise options"
  - "Need stakeholder input"
  - "Defer decision"
```

## ADR Templates for MeshMotion

### State Management Decision
```markdown
Context: Need to manage [specific state]
Options:
1. Add to viewer-store (Zustand)
2. Create new dedicated store
3. Use React Context
4. Component-local state

Considerations:
- Is it shared across components?
- Does it need persistence?
- How often does it change?
- Does it affect 3D rendering?
```

### Three.js Integration Decision
```markdown
Context: Need to implement [3D feature]
Options:
1. Use @react-three/drei helper
2. Build custom with raw Three.js
3. Use external library
4. Extend existing implementation

Considerations:
- Does drei have this?
- Performance requirements?
- Maintenance burden?
- Bundle size impact?
```

### Export Format Decision
```markdown
Context: Need to support [format] export
Options:
1. Client-side with Three.js exporter
2. Client-side with custom implementation
3. Server-side processing
4. External service

Considerations:
- Browser compatibility?
- File size limits?
- Feature completeness?
- User experience?
```

## Existing ADRs

Store ADRs in `.claude/docs/decisions/`:
- `ADR-001-zustand-state-management.md`
- `ADR-002-static-export.md`
- `ADR-003-assimpjs-conversion.md`

## Integration

After decision is made:
1. Update relevant rule files in `.claude/rules/`
2. Add to CLAUDE.md if it affects patterns
3. Create tasks with `sprint-planner` if implementation needed
4. Notify team if collaborative decision
