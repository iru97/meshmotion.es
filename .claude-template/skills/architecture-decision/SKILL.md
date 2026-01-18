# /architecture-decision - Architecture Decision Records

Guide through creating Architecture Decision Records (ADR) for significant technical decisions.

## Usage
```
/architecture-decision [decision topic]
```

## When to Use
- Choosing between technologies
- Changing project patterns
- Adding major dependencies
- Structural refactoring
- Breaking API changes

## Process

### Step 1: Understand the Decision
Ask via AskUserQuestion:

**Question 1: Decision Type**
- Technology choice
- Architecture pattern
- API design
- Data model
- Infrastructure

**Question 2: Urgency**
- Blocking work now
- Needed this sprint
- Planning ahead
- Exploratory

**Question 3: Reversibility**
- Easy to change later
- Moderate effort to reverse
- Difficult/costly to reverse
- Irreversible

### Step 2: Research Options
- Use WebSearch for best practices
- Check existing codebase patterns
- Review similar decisions in project

### Step 3: Generate ADR

```markdown
# ADR-[NUMBER]: [Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Date
[YYYY-MM-DD]

## Context
[What is the issue that we're seeing that is motivating this decision?]

## Decision Drivers
- [Driver 1]
- [Driver 2]
- [Driver 3]

## Considered Options
1. **[Option 1]**
   - Pros: [list]
   - Cons: [list]

2. **[Option 2]**
   - Pros: [list]
   - Cons: [list]

3. **[Option 3]**
   - Pros: [list]
   - Cons: [list]

## Decision
We will use **[chosen option]** because [reasoning].

## Consequences

### Positive
- [Positive consequence 1]
- [Positive consequence 2]

### Negative
- [Negative consequence 1]
- [Mitigation: how we'll handle it]

### Neutral
- [Trade-off or change to consider]

## Implementation Notes
[How to implement this decision]

## Related Decisions
- [Link to related ADRs if any]
```

### Step 4: Validate with User
Review the ADR and confirm decision before proceeding.

### Step 5: Save ADR
Save to `docs/adr/` or project's ADR location.

## Example

**User**: "/architecture-decision state management library"

**Questions**:
1. Type? → Technology choice
2. Urgency? → Needed this sprint
3. Reversibility? → Moderate effort

**Research**: Compare Zustand, Redux Toolkit, Jotai, Recoil

**ADR Generated**:
```markdown
# ADR-001: State Management Library

## Status
Proposed

## Context
Need global state management for user auth, theme, and app settings.
Current: prop drilling causing maintenance issues.

## Considered Options
1. **Zustand** - Simple, minimal boilerplate
2. **Redux Toolkit** - Standard, great devtools
3. **Jotai** - Atomic, React-focused

## Decision
We will use **Zustand** because:
- Minimal boilerplate fits our small team
- No context providers needed
- TypeScript support is excellent
- Easy migration path if needed later

## Consequences
### Positive
- Less code to maintain
- Fast to implement

### Negative
- Less standardized than Redux
- Mitigation: Document patterns in CONVENTIONS.md
```
