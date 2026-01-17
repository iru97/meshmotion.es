---
name: feature-planner
description: Interactive feature planning wizard. Use when starting a new feature to gather requirements, plan implementation, and create a task breakdown. Uses AskUserQuestion for interactive planning.
allowed-tools:
  - Read
  - Glob
  - Grep
  - AskUserQuestion
  - TodoWrite
user-invocable: true
---

# Feature Planner Skill

An interactive wizard that guides you through planning a new feature for MeshMotion.

## Usage

Invoke with: `/feature-planner [feature-name]`

## Planning Workflow

### Phase 1: Requirements Gathering

Use `AskUserQuestion` to understand the feature:

```
Questions to ask:
1. Feature Type
   - Header: "Feature type"
   - Options:
     - "UI Component" - New visual element or panel
     - "3D Feature" - Three.js/viewer functionality
     - "Export/Import" - File handling capability
     - "Performance" - Optimization work

2. Scope
   - Header: "Scope"
   - Options:
     - "Small" - Single file change, <100 lines
     - "Medium" - 2-5 files, new component
     - "Large" - Multiple components, store changes
     - "Epic" - Architectural changes, multiple systems

3. User Impact
   - Header: "User facing?"
   - Options:
     - "Yes - Visible UI change"
     - "Yes - New capability"
     - "No - Internal refactor"
     - "No - Developer tooling"
```

### Phase 2: Technical Analysis

Based on answers, analyze the codebase:

1. **For UI Components**: Check existing patterns in `src/components/`
2. **For 3D Features**: Review `src/components/viewer/` and `src/lib/three/`
3. **For Export/Import**: Check `src/lib/conversion/` and `src/hooks/use-*.ts`
4. **For Performance**: Audit current implementation first

### Phase 3: Task Breakdown

Use `TodoWrite` to create actionable tasks:

```typescript
// Example task breakdown for "Add model comparison overlay mode"
[
  { content: "Research existing comparison mode implementation", status: "pending" },
  { content: "Design overlay UI mockup approach", status: "pending" },
  { content: "Add overlay layout option to ComparisonState type", status: "pending" },
  { content: "Implement overlay rendering in ComparisonScene", status: "pending" },
  { content: "Add opacity/blend controls to UI", status: "pending" },
  { content: "Update keyboard shortcuts for overlay toggle", status: "pending" },
  { content: "Test with different model sizes", status: "pending" },
  { content: "Update documentation", status: "pending" },
]
```

### Phase 4: Implementation Checklist

Ask about implementation preferences:

```
Questions:
1. Testing approach
   - "Write tests first (TDD)"
   - "Write tests after implementation"
   - "Skip tests for now"

2. Review preference
   - "Self-review before commit"
   - "Request code review"
   - "Pair programming style"
```

## Output Format

After planning, provide:

```markdown
## Feature Plan: [Feature Name]

### Requirements
- Type: [UI/3D/Export/Performance]
- Scope: [Small/Medium/Large/Epic]
- User-facing: [Yes/No]

### Affected Areas
- Files to modify: [list]
- Files to create: [list]
- Store changes: [yes/no, details]
- Type changes: [yes/no, details]

### Task Breakdown
[Generated todo list with estimates]

### Dependencies
- External packages needed: [list or none]
- Internal dependencies: [components/hooks needed]

### Risks & Considerations
- [Potential issues]
- [Performance concerns]
- [Breaking changes]

### Ready to Start?
[Confirmation or additional questions]
```

## Example Session

```
User: /feature-planner model-screenshot

Claude: I'll help you plan the model screenshot feature. Let me gather some requirements.

[AskUserQuestion: Feature type?]
User: UI Component

[AskUserQuestion: Scope?]
User: Medium

[AskUserQuestion: User facing?]
User: Yes - New capability

Claude: Let me analyze the codebase for relevant patterns...
[Reads Scene.tsx, checks for existing screenshot code]

Based on my analysis, here's the plan:

## Feature Plan: Model Screenshot

### Requirements
- Type: UI Component with 3D integration
- Scope: Medium (3-4 files)
- User-facing: Yes

### Affected Areas
- Create: `src/components/export/ScreenshotButton.tsx`
- Modify: `src/components/panels/ActionToolbar.tsx`
- Modify: `src/lib/store/viewer-store.ts` (add screenshot state)

### Task Breakdown
[TodoWrite with 6 tasks]

Shall I start implementing?
```

## Integration with Other Skills

After planning, suggest:
- `/component-generator` for new components
- `/build-deploy check` before starting
- `code-reviewer` agent after implementation
