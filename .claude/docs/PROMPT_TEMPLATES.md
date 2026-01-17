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
- **Domains**: [ui, state, 3d, ...]

### Specific Requirements
1. [Requirement 1 - derived from analysis]
2. [Requirement 2 - from user validation]
3. [Requirement 3 - from codebase patterns]

### Affected Areas
- **Files to read**: [list]
- **Files to modify**: [list]
- **Files to create**: [list]

### Patterns to Follow
- [Pattern 1 from .claude/rules/]
- [Pattern 2 specific to domain]
- [Pattern 3 from existing code]

### Success Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

### Constraints
- [Constraint 1 - from user]
- [Constraint 2 - from project]
- [Constraint 3 - from best practices]

### Resources Allocated
- Agents: [list with purposes]
- Skills: [list with purposes]
- Estimated phases: [count]
```

## Templates by Request Type

### Bug Fix Template

```markdown
## Enhanced Request: Fix [Bug Description]

### Original Request
> [user request]

### Bug Analysis
- **Symptom**: [What the user sees]
- **Location**: [Where it likely occurs]
- **Trigger**: [How to reproduce]
- **Impact**: [Severity]

### Investigation Plan
1. Search for error patterns in [files]
2. Check [specific functions/components]
3. Verify [related state/props]

### Fix Requirements
- Must not introduce regressions
- Must follow existing error handling patterns
- Must include verification steps

### Affected Areas
- Primary: `[file:function]`
- Related: `[other files that might be affected]`

### Patterns to Follow
- Error handling: Return Result<T> pattern
- State updates: Use Zustand selectors
- Cleanup: Dispose Three.js resources

### Success Criteria
- [ ] Bug no longer reproduces
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Existing tests pass
- [ ] Related functionality works

### Resources
- Primary: `/debug-wizard`
- Review: `code-reviewer`
- If needed: `test-architect` (add regression test)
```

### Feature Template

```markdown
## Enhanced Request: Implement [Feature Name]

### Original Request
> [user request]

### Feature Definition
- **What**: [Clear description of functionality]
- **Why**: [User value / business reason]
- **Who**: [Target users]

### Requirements
1. **Functional**:
   - [FR1]
   - [FR2]
2. **Non-functional**:
   - Performance: [target]
   - Accessibility: [requirements]

### Technical Design
- **State changes**: [Zustand store additions]
- **New components**: [list]
- **New hooks**: [list]
- **Type additions**: [list]

### Affected Areas
- Create: `src/components/[new]/`
- Modify: `src/lib/store/viewer-store.ts`
- Modify: `src/types/[relevant].ts`

### Patterns to Follow
- Component: Functional + named export + Props interface
- State: Zustand selectors, actions in store
- 3D: useFrame for animations, refs for mutations
- Style: Tailwind + cn() + glassmorphism

### Success Criteria
- [ ] Feature works as described
- [ ] Follows project patterns
- [ ] TypeScript strict compliance
- [ ] Performance acceptable
- [ ] Responsive design
- [ ] Code reviewed

### Resources
- Planning: `/feature-planner`, `sprint-planner`
- Implementation: `/component-generator`
- Review: `code-reviewer`
- Testing: `test-architect`
- If 3D: `threejs-optimizer`
- Final: `/pr-preparation`
```

### Refactor Template

```markdown
## Enhanced Request: Refactor [Area/System]

### Original Request
> [user request]

### Current State
- **Code smells**: [identified issues]
- **Technical debt**: [what's accumulated]
- **Pain points**: [developer experience issues]

### Target State
- **Goal**: [what good looks like]
- **Patterns**: [patterns to introduce]
- **Cleanup**: [what to remove]

### Transformation Plan
1. [Step 1 - smallest safe change]
2. [Step 2 - next increment]
3. [Step 3 - ...]
(Each step must be independently verifiable)

### Safety Requirements
- Behavior must remain identical
- Tests must pass after each step
- Rollback strategy: `git revert HEAD`

### Affected Areas
- Primary: `[files being refactored]`
- Consumers: `[files that import/use]`
- Types: `[type definitions]`

### Patterns to Follow
- Extract: One component/hook per file
- Rename: Use IDE refactoring, not find-replace
- Delete: Remove completely, no commented code

### Success Criteria
- [ ] All tests pass
- [ ] No behavior changes
- [ ] Code is cleaner/simpler
- [ ] Patterns are consistent
- [ ] No new warnings

### Resources
- Primary: `refactoring-architect`
- If architectural: `/architecture-decision`
- Review: `code-reviewer`
- Verify: `test-architect`
```

### Performance Template

```markdown
## Enhanced Request: Optimize [Area] Performance

### Original Request
> [user request]

### Current Performance
- **Metrics**: [current measurements]
- **Bottlenecks**: [identified issues]
- **User impact**: [what users experience]

### Target Performance
- **FPS**: [target, e.g., 60fps]
- **Load time**: [target]
- **Memory**: [target]
- **Draw calls**: [target, e.g., <100]

### Optimization Strategy
1. Measure baseline
2. Identify biggest wins
3. Implement optimizations
4. Verify improvements
5. Check for regressions

### Techniques to Consider
- Bundle: Tree shaking, code splitting
- React: Memo, useMemo, useCallback
- Three.js: Instancing, LOD, disposal
- Network: Lazy loading, caching

### Affected Areas
- Hot paths: `[performance-critical code]`
- Rendering: `[3D components]`
- State: `[frequently updated state]`

### Patterns to Follow
- Profile before optimizing
- One change at a time
- Measure after each change
- Document tradeoffs

### Success Criteria
- [ ] Meets performance targets
- [ ] No functionality regression
- [ ] Improvements documented
- [ ] Sustainable (not one-time hacks)

### Resources
- Primary: `threejs-optimizer`
- Audit: `/dependency-auditor`
- Review: `code-reviewer`
- Regression: `test-architect`
```

### Research Template

```markdown
## Enhanced Request: Research [Topic]

### Original Request
> [user request]

### Research Questions
1. [Primary question]
2. [Secondary question]
3. [Tertiary question]

### Scope
- **Depth**: [surface/moderate/deep]
- **Breadth**: [focused/exploratory]
- **Output**: [decision/recommendation/POC]

### Sources to Consult
- Official docs: [links]
- Community: [forums, discussions]
- Code: [reference implementations]
- Benchmarks: [performance data]

### Evaluation Criteria
- [Criterion 1]
- [Criterion 2]
- [Criterion 3]

### Deliverables
- [ ] Summary document
- [ ] Recommendation
- [ ] If applicable: ADR
- [ ] If applicable: POC code

### Resources
- Research: `WebSearch`, `WebFetch`
- Decision: `/architecture-decision`
- If coding: relevant agents
```

## Validation Questions

### For All Requests
1. "Is this scope correct?" → Adjust size
2. "What areas to focus on?" → Prioritize domains
3. "Any constraints?" → Add requirements
4. "Preferred approach?" → Adjust thoroughness

### For Bug Fixes
1. "Can you reproduce it?" → Determine certainty
2. "When did it start?" → Narrow cause
3. "What have you tried?" → Avoid repetition

### For Features
1. "Must-have vs nice-to-have?" → Prioritize scope
2. "Similar features to reference?" → Find patterns
3. "Performance concerns?" → Add constraints

### For Refactoring
1. "What's the pain point?" → Focus effort
2. "Safe to break API?" → Determine constraints
3. "Testing coverage?" → Assess risk

## Enhancement Examples

### Example 1: Vague → Specific

**Before**:
> "fix the animation"

**After**:
> Investigate and fix animation playback issue. The animation [freezes/doesn't start/plays wrong]. Check:
> - `Model.tsx:useFrame` - is mixer updating?
> - `viewer-store.ts:isPlaying` - is state correct?
> - `AnimationControls.tsx` - is UI in sync?
>
> Success: Animation plays smoothly, responds to controls, maintains 60fps.

### Example 2: Broad → Scoped

**Before**:
> "add comparison feature"

**After**:
> Implement side-by-side model comparison with these specific requirements:
> 1. Add `ComparisonState` to viewer-store (enabled, layout, syncPlayback, view1, view2)
> 2. Create `ComparisonScene.tsx` with dual Canvas
> 3. Create `ComparisonControls.tsx` for sync/layout toggle
> 4. Add keyboard shortcut 'C' to toggle comparison mode
> 5. Support vertical and horizontal layouts
>
> Follow patterns in existing `Scene.tsx`. Performance target: 60fps with two medium-complexity models.

### Example 3: Technical → Actionable

**Before**:
> "optimize the renderer"

**After**:
> Audit and optimize Three.js rendering performance:
> 1. Baseline: Measure current draw calls, FPS, memory
> 2. Targets: <100 draw calls, 60fps, <500MB memory
> 3. Techniques: Geometry instancing, material sharing, texture optimization
> 4. Verify: Profile before/after each change
>
> Focus on `Scene.tsx`, `Model.tsx`, `Lighting.tsx`. Use `threejs-optimizer` agent.
