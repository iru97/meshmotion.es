# Prompt Enhancement Templates

Templates for transforming user requests into comprehensive, actionable prompts.

## Enhancement Process

```
User Request → Analysis → Validation → Enhancement → Execution
     ↓              ↓           ↓            ↓
"fix the bug"  [scope,type]  [questions]  [detailed prompt]
```

## Template Structure

Every enhanced prompt includes:

```markdown
## Enhanced Request: [Title]

### Original Request
> [User's original words]

### Interpreted Scope
- **Type**: [bug-fix/feature/refactor/...]
- **Scope**: [micro/small/medium/large/epic]
- **Complexity**: [1-5] ⭐
- **Domains**: [ui, state, api, ...]

### Specific Requirements
1. [Requirement 1]
2. [Requirement 2]

### Affected Areas
- **Files to read**: [list]
- **Files to modify**: [list]
- **Files to create**: [list]

### Patterns to Follow
- [Pattern from .claude/rules/]

### Success Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
```

## Templates by Request Type

### Bug Fix Template

```markdown
## Enhanced Request: Fix [Bug Description]

### Bug Analysis
- **Symptom**: [What the user sees]
- **Location**: [Where it likely occurs]
- **Trigger**: [How to reproduce]
- **Impact**: [Severity]

### Investigation Plan
1. Search for error patterns
2. Check specific functions
3. Verify related state

### Success Criteria
- [ ] Bug no longer reproduces
- [ ] No TypeScript errors
- [ ] Existing tests pass
```

### Feature Template

```markdown
## Enhanced Request: Implement [Feature Name]

### Feature Definition
- **What**: [Clear description]
- **Why**: [User value]
- **Who**: [Target users]

### Requirements
1. **Functional**: [FR1], [FR2]
2. **Non-functional**: [Performance], [Accessibility]

### Technical Design
- **State changes**: [Store additions]
- **New components**: [list]
- **Type additions**: [list]

### Success Criteria
- [ ] Feature works as described
- [ ] Follows project patterns
- [ ] TypeScript compliant
```

### Refactor Template

```markdown
## Enhanced Request: Refactor [Area/System]

### Current State
- **Code smells**: [identified issues]
- **Technical debt**: [what's accumulated]

### Target State
- **Goal**: [what good looks like]
- **Patterns**: [patterns to introduce]

### Transformation Plan
1. [Step 1 - smallest safe change]
2. [Step 2 - next increment]

### Safety Requirements
- Behavior must remain identical
- Tests must pass after each step
```

## Validation Questions

### For All Requests
1. "Is this scope correct?"
2. "What areas to focus on?"
3. "Any constraints?"

### For Bug Fixes
1. "Can you reproduce it?"
2. "When did it start?"

### For Features
1. "Must-have vs nice-to-have?"
2. "Similar features to reference?"

### For Refactoring
1. "What's the pain point?"
2. "Safe to break API?"
