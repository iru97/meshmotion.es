---
name: plan
description: Master orchestration command. Analyzes ANY request, maps to available capabilities, validates plan with user, enhances prompt, then executes. Use this as the entry point for any task.
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - Task
  - AskUserQuestion
  - TodoWrite
  - WebSearch
  - WebFetch
user-invocable: true
---

# /plan - Master Orchestration Command

The intelligent entry point for ANY request. Analyzes, plans, validates, and executes.

## Usage

```
/plan [your request in natural language]
```

Examples:
- `/plan fix the animation freezing bug`
- `/plan add screenshot export feature`
- `/plan refactor the entire export system`
- `/plan build a complete testing suite`
- `/plan research and implement real-time collaboration`

## How It Works

### Phase 1: Request Analysis

Classify the request across multiple dimensions:

```typescript
interface RequestAnalysis {
  // Scope
  scope: 'micro' | 'small' | 'medium' | 'large' | 'epic' | 'project';

  // Type
  type: 'bug-fix' | 'feature' | 'refactor' | 'research' | 'optimization' |
        'testing' | 'documentation' | 'migration' | 'mixed';

  // Complexity
  complexity: 1 | 2 | 3 | 4 | 5;  // 1=trivial, 5=architectural

  // Domains touched
  domains: ('ui' | 'state' | '3d' | 'export' | 'import' | 'animation' |
            'performance' | 'types' | 'tests' | 'docs')[];

  // Estimated agents needed
  agentCount: number;

  // Parallelizable?
  parallelizable: boolean;

  // Research required?
  needsResearch: boolean;
}
```

### Phase 2: Capability Mapping

Map request to available resources:

```typescript
interface CapabilityMap {
  // Agents to use
  agents: {
    name: string;
    count: number;
    purpose: string;
    phase: string;
  }[];

  // Skills to invoke
  skills: {
    name: string;
    purpose: string;
    phase: string;
  }[];

  // Tools required
  tools: string[];

  // Phases
  phases: {
    name: string;
    parallel: boolean;
    agents: string[];
    skills: string[];
  }[];
}
```

### Phase 3: User Validation

Use `AskUserQuestion` to validate understanding:

```
Question 1: Scope Confirmation
- Header: "Scope"
- Options based on analysis:
  - "Yes, this is a [size] task"
  - "Smaller - just [reduced scope]"
  - "Larger - also include [expanded scope]"
  - "Different - let me clarify"

Question 2: Priority Areas
- Header: "Focus"
- multiSelect: true
- Options based on domains detected:
  - "UI/UX changes"
  - "3D/Rendering"
  - "Performance"
  - "Code quality"
  - "Testing"

Question 3: Constraints
- Header: "Constraints"
- multiSelect: true
- Options:
  - "Must maintain backward compatibility"
  - "Performance is critical"
  - "Needs thorough testing"
  - "Documentation required"
  - "Time-sensitive"

Question 4: Approach
- Header: "Approach"
- Options:
  - "Thorough (more agents, comprehensive)"
  - "Balanced (recommended)"
  - "Quick (minimal, focused)"
  - "Research first (investigate before coding)"
```

### Phase 4: Orchestration Plan

Generate detailed execution plan:

```markdown
## Orchestration Plan: [Request Summary]

### Analysis
- **Scope**: [micro/small/medium/large/epic/project]
- **Type**: [bug-fix/feature/refactor/...]
- **Complexity**: [1-5] ⭐
- **Domains**: [ui, state, 3d, ...]

### Resource Allocation

#### Task Subagents (parallel work)
| Phase | Subagent Type | Purpose |
|-------|---------------|---------|
| 1. Research | Explore | Find relevant files, patterns |
| 1. Research | general-purpose | Research best practices |
| 2. Planning | Plan | Design architecture |

#### Skills (specialized workflows)
| Phase | Skill | Purpose |
|-------|-------|---------|
| 1. Research | /dependency-auditor | Check for updates |
| 2. Planning | /feature-planner | Detailed requirements |
| 3. Implementation | /component-generator | Create components |
| 4. Testing | /debug-wizard | If issues found |
| 5. Polish | /pr-preparation | Final PR |

#### Agent Prompts (guidance)
| Phase | Agent Prompt | Purpose |
|-------|--------------|---------|
| 2. Planning | orchestrator | Multi-phase coordination patterns |
| 3. Implementation | code-reviewer | Quality check guidance |
| 3. Implementation | threejs-optimizer | 3D performance patterns |
| 4. Testing | test-architect | Test design patterns |
| 5. Polish | refactoring-architect | Safe refactoring patterns |

### Execution Phases

Phase 1: Research (parallel Tasks)
├── Task(Explore): Find related files
├── Task(general-purpose): Research patterns
└── Skill(/dependency-auditor): If needed

Phase 2: Planning (sequential)
├── Read agent: orchestrator (coordination guidance)
├── Skill(/feature-planner): Detail each feature
└── Skill(/architecture-decision): If needed

Phase 3: Implementation
├── Read agent: code-reviewer (quality patterns)
├── Implementation work with TodoWrite tracking
└── Read agent: threejs-optimizer (if 3D work)

Phase 4: Testing
├── Read agent: test-architect (test patterns)
├── Write and run tests
└── Skill(/debug-wizard): If failures

Phase 5: Polish
├── Read agent: refactoring-architect (cleanup patterns)
├── Skill(/pr-preparation): Prepare PR
└── Final verification

### Task Breakdown
[TodoWrite items will be created here]

### Enhanced Prompt
Based on our validation, here's the enhanced version of your request:

> [Original request enhanced with specific scope, constraints,
> affected files, patterns to follow, and success criteria]
```

### Phase 5: Execute

After validation, execute the plan:

1. Create TodoWrite with all tasks
2. Use Task tool for parallel research/exploration
3. Invoke skills via Skill tool for specialized workflows
4. Follow agent prompt templates for guidance
5. Track progress through phases
6. Report results after each phase
7. Adapt plan if issues arise

## Available Resources

### Task Tool Subagents (Built-in)
Use `Task` tool with these `subagent_type` values:

| Type | Best For |
|------|----------|
| `Explore` | Fast codebase exploration, find files, search code |
| `Plan` | Design implementation plans, architectural decisions |
| `general-purpose` | Research, multi-step analysis, complex queries |
| `Bash` | Command execution, git operations, terminal tasks |

### Agent Prompt Templates (`.claude/agents/`)
These provide specialized guidance when working on specific tasks:

| Agent | Read When |
|-------|-----------|
| `orchestrator` | Complex multi-phase coordination |
| `sprint-planner` | Planning & task breakdown |
| `code-reviewer` | Code quality review |
| `test-architect` | Test design & implementation |
| `threejs-optimizer` | 3D performance work |
| `refactoring-architect` | Safe refactoring |

**Usage**: Read agent file for specialized prompts and patterns, then apply guidance.

### Skills (User-Invocable via Skill tool)
| Skill | Best For |
|-------|----------|
| `/feature-planner` | Interactive feature planning |
| `/debug-wizard` | Systematic debugging |
| `/architecture-decision` | Technical decisions |
| `/pr-preparation` | PR workflow |
| `/dependency-auditor` | Security & updates |
| `/component-generator` | New components |
| `/export-debugger` | Export issues |
| `/build-deploy` | Build & deploy |
| `/vercel-react-best-practices` | Vercel React patterns |

### Core Tools
- `Read`, `Glob`, `Grep` - Codebase analysis
- `Bash` - Commands & checks
- `Task` - Spawn subagents (built-in types only)
- `Skill` - Invoke user-invocable skills
- `AskUserQuestion` - Interactive validation
- `TodoWrite` - Progress tracking
- `WebSearch`, `WebFetch` - Research
- `Edit`, `Write` - Code changes

## Scope Definitions

| Scope | Description | Typical Agents | Example |
|-------|-------------|----------------|---------|
| **Micro** | Single line/function fix | 1-2 | "Fix typo in error message" |
| **Small** | Single file change | 2-3 | "Add loading spinner" |
| **Medium** | 2-5 files, new component | 3-5 | "Add screenshot feature" |
| **Large** | Multiple components, store | 5-10 | "Refactor export system" |
| **Epic** | Architectural change | 10-20 | "Add real-time collaboration" |
| **Project** | Full system | 20+ | "Build from scratch" |

## Example Session

```
User: /plan add the ability to compare models side by side with synced animations

Claude: I'll analyze this request and create an orchestration plan.

## Request Analysis
- **Scope**: Large (multiple components, store changes, 3D integration)
- **Type**: Feature
- **Complexity**: 4/5 ⭐⭐⭐⭐
- **Domains**: ui, state, 3d, animation

[AskUserQuestion: Confirm scope?]
User: Yes, large task

[AskUserQuestion: Focus areas?]
User: [selects] 3D/Rendering, UI/UX, Performance

[AskUserQuestion: Constraints?]
User: [selects] Performance critical, Needs testing

[AskUserQuestion: Approach?]
User: Thorough

## Orchestration Plan

### Phase Breakdown

**Phase 1: Research & Planning**
- Task(Explore): Analyze existing Scene.tsx and viewer-store.ts
- Task(Plan): Design component architecture for comparison view
- Skill(/feature-planner): Define detailed requirements

**Phase 2: Implementation**
- Read orchestrator agent prompt for multi-phase coordination guidance
- Create ComparisonState in viewer-store
- Create ComparisonScene component with split Canvas
- Implement animation sync via shared mixer time
- Add UI controls for sync toggle, layout switch

**Phase 3: Quality Assurance**
- Read code-reviewer agent prompt for review guidance
- Read threejs-optimizer agent prompt for performance patterns
- Performance target: 60fps with two models
- Run tests and lint checks

**Phase 4: Finalize**
- Skill(/pr-preparation): Prepare pull request

### Enhanced Prompt
> Implement model comparison feature with side-by-side view and synced
> animations. Requirements:
> - Add ComparisonState to viewer-store with view1/view2 state
> - Create ComparisonScene component with split Canvas
> - Implement animation sync via shared mixer time
> - Add UI controls for sync toggle, layout switch
> - Performance: Target 60fps with two models
> - Testing: Unit tests for store, integration for sync
> - Follow existing patterns in Scene.tsx and Model.tsx

Ready to execute?
```

## Adaptive Execution

During execution, the plan adapts:

- **If tests fail**: Invoke `/debug-wizard`
- **If performance degrades**: Invoke `threejs-optimizer`
- **If scope creeps**: Re-validate with user
- **If blocked**: Ask user for input
- **If research needed**: Use WebSearch

## Integration

This skill is the **primary entry point**. It orchestrates all other skills and agents, making the full capability set accessible through natural language.
