# MeshMotion Capability Registry

Complete registry of all available agents, skills, tools, and their optimal use cases.

## Capability Matrix

### Request Type → Recommended Resources

| Request Type | Primary Agent | Supporting Agents | Skills | Tools |
|--------------|---------------|-------------------|--------|-------|
| **Bug Fix** | `debug-wizard` | `code-reviewer` | `/debug-wizard` | Grep, Read, Bash |
| **New Feature** | `orchestrator` | `sprint-planner`, `code-reviewer`, `test-architect` | `/feature-planner`, `/component-generator` | All |
| **Refactoring** | `refactoring-architect` | `code-reviewer`, `test-architect` | `/architecture-decision` | Read, Edit, Grep |
| **Performance** | `threejs-optimizer` | `code-reviewer` | `/dependency-auditor` | Bash, Read |
| **Testing** | `test-architect` | `code-reviewer` | `/debug-wizard` | Bash, Read, Write |
| **Research** | - | - | `/architecture-decision`, `/dependency-auditor` | WebSearch, WebFetch, Read |
| **Documentation** | - | - | - | Read, Write, Glob |
| **Migration** | `orchestrator` | `refactoring-architect`, `test-architect` | `/architecture-decision` | All |
| **Full Project** | `orchestrator` | ALL | ALL | ALL |

### Domain → Specialized Resources

| Domain | Agents | Skills | Key Files |
|--------|--------|--------|-----------|
| **UI** | `code-reviewer` | `/component-generator` | `src/components/**` |
| **State** | `code-reviewer`, `refactoring-architect` | `/architecture-decision` | `src/lib/store/**` |
| **3D/Rendering** | `threejs-optimizer`, `code-reviewer` | `/export-debugger` | `src/components/viewer/**`, `src/lib/three/**` |
| **Export/Import** | `code-reviewer` | `/export-debugger` | `src/lib/conversion/**`, `src/hooks/use-*` |
| **Animation** | `threejs-optimizer`, `code-reviewer` | `/debug-wizard` | `src/components/animation/**` |
| **Performance** | `threejs-optimizer` | `/dependency-auditor` | All |
| **Types** | `code-reviewer` | - | `src/types/**` |
| **Tests** | `test-architect` | `/debug-wizard` | `__tests__/**` |

## Agent Capabilities

### orchestrator
```yaml
purpose: Master coordinator for complex multi-phase tasks
tools: [Read, Glob, Grep, Bash, Task, AskUserQuestion, TodoWrite]
model: opus
spawns: All other agents
best_for:
  - Large features (5+ files)
  - Multi-system changes
  - Release coordination
  - Recovery from failures
phases: [Research, Planning, Implementation, Testing, Polish]
```

### sprint-planner
```yaml
purpose: Interactive planning and task breakdown
tools: [Read, Glob, Grep, AskUserQuestion, TodoWrite]
model: sonnet
best_for:
  - Milestone planning
  - Epic breakdown
  - Complexity estimation
  - Prioritization
outputs: [Task lists, Dependency maps, Risk assessments]
```

### code-reviewer
```yaml
purpose: MeshMotion-specific code review
tools: [Read, Grep, Glob, Bash]
model: sonnet
best_for:
  - After any code changes
  - Pattern compliance
  - Security review
  - Performance review
checks:
  - Zustand selector patterns
  - Three.js disposal
  - TypeScript strict compliance
  - No console.logs
```

### test-architect
```yaml
purpose: Test design and implementation
tools: [Read, Write, Edit, Bash, Grep, Glob]
model: sonnet
best_for:
  - Test suite design
  - Coverage improvement
  - Test debugging
patterns:
  - React Testing Library
  - Jest mocking
  - Three.js test mocks
coverage_target: 80%
```

### threejs-optimizer
```yaml
purpose: WebGL and Three.js performance
tools: [Read, Grep, Glob, Bash, Edit]
model: sonnet
best_for:
  - Performance audits
  - Memory leak detection
  - Draw call optimization
  - Animation performance
metrics:
  - Draw calls (<100)
  - FPS (60+)
  - Memory usage
  - Load time
```

### refactoring-architect
```yaml
purpose: Safe code transformations
tools: [Read, Grep, Glob, Edit, Bash]
model: sonnet
best_for:
  - Extract component/hook
  - Consolidate patterns
  - Type improvements
  - Dead code removal
safety:
  - Tests must pass
  - Small incremental changes
  - Rollback strategy
```

## Skill Capabilities

### Interactive Skills (AskUserQuestion)

| Skill | Questions Asked | Outputs |
|-------|-----------------|---------|
| `/plan` | Scope, Focus, Constraints, Approach | Full orchestration plan |
| `/feature-planner` | Type, Scope, Impact, Testing | Task breakdown, Requirements |
| `/debug-wizard` | Category, Reproducibility, Details | Diagnostic checklist, Solutions |
| `/architecture-decision` | Type, Urgency, Options | ADR document |
| `/pr-preparation` | Type, Breaking, Testing | PR description, Checks |
| `/dependency-auditor` | Scope, Update strategy | Audit report, Tasks |

### Utility Skills

| Skill | Tools Used | Outputs |
|-------|------------|---------|
| `/component-generator` | Read, Write, Glob | Component files |
| `/export-debugger` | Read, Grep, Bash | Debug report |
| `/build-deploy` | Bash, Read | Build status, Deploy |

## Tool Capabilities

### Information Gathering
| Tool | Use Case | Speed |
|------|----------|-------|
| `Read` | Read specific files | Fast |
| `Glob` | Find files by pattern | Fast |
| `Grep` | Search content | Fast |
| `WebSearch` | Research topics | Medium |
| `WebFetch` | Fetch URLs | Medium |

### Execution
| Tool | Use Case | Confirmation |
|------|----------|--------------|
| `Bash` | Run commands | Hook validates |
| `Edit` | Modify files | Hook validates |
| `Write` | Create files | Hook validates |
| `Task` | Spawn agents | Auto |

### Interaction
| Tool | Use Case | Blocking |
|------|----------|----------|
| `AskUserQuestion` | Get user input | Yes |
| `TodoWrite` | Track progress | No |

## Orchestration Patterns

### Pattern: Quick Fix (1-3 agents)
```
1. code-reviewer (identify issue)
2. [fix]
3. code-reviewer (verify fix)
```

### Pattern: New Component (3-5 agents)
```
1. feature-planner (requirements)
2. component-generator (create)
3. code-reviewer (review)
4. test-architect (test)
5. pr-preparation (PR)
```

### Pattern: Performance Work (4-6 agents)
```
1. threejs-optimizer (baseline)
2. [optimization work]
3. threejs-optimizer (verify)
4. code-reviewer (review)
5. test-architect (regression tests)
```

### Pattern: Large Feature (8-15 agents)
```
1. sprint-planner (breakdown)
2. feature-planner (each feature)
3. architecture-decision (if needed)
4. orchestrator (coordinate)
5. [implementation] + code-reviewer (per component)
6. test-architect (tests)
7. threejs-optimizer (if 3D)
8. refactoring-architect (cleanup)
9. pr-preparation (PR)
```

### Pattern: Epic/Project (15-30+ agents)
```
Phase 1: Research
├── dependency-auditor
├── WebSearch research
└── architecture-decision (×N)

Phase 2: Planning
├── sprint-planner
├── feature-planner (×N)
└── orchestrator (master plan)

Phase 3: Implementation (parallel tracks)
├── Track A: [features] + code-reviewer
├── Track B: [features] + code-reviewer
└── Track C: [features] + code-reviewer

Phase 4: Integration
├── orchestrator (coordinate)
├── test-architect (integration)
└── threejs-optimizer (performance)

Phase 5: Polish
├── refactoring-architect
├── test-architect (coverage)
└── pr-preparation
```

## Complexity Estimation

| Complexity | Agents | Duration | Characteristics |
|------------|--------|----------|-----------------|
| 1 ⭐ | 1-2 | Minutes | Single file, obvious fix |
| 2 ⭐⭐ | 2-3 | <1 hour | Few files, clear scope |
| 3 ⭐⭐⭐ | 3-5 | Hours | New component, store touch |
| 4 ⭐⭐⭐⭐ | 5-10 | Day+ | Multiple systems, testing |
| 5 ⭐⭐⭐⭐⭐ | 10+ | Days+ | Architectural, research |

## Resource Selection Algorithm

```typescript
function selectResources(request: Request): Resources {
  const analysis = analyzeRequest(request);

  // Start with base resources
  const resources: Resources = {
    agents: [],
    skills: [],
    tools: ['Read', 'Glob', 'Grep'],
  };

  // Add by scope
  if (analysis.scope >= 'large') {
    resources.agents.push('orchestrator');
    resources.agents.push('sprint-planner');
  }

  // Add by type
  switch (analysis.type) {
    case 'bug-fix':
      resources.skills.push('/debug-wizard');
      break;
    case 'feature':
      resources.skills.push('/feature-planner');
      resources.agents.push('test-architect');
      break;
    case 'refactor':
      resources.agents.push('refactoring-architect');
      break;
    case 'research':
      resources.tools.push('WebSearch', 'WebFetch');
      resources.skills.push('/architecture-decision');
      break;
  }

  // Add by domain
  if (analysis.domains.includes('3d')) {
    resources.agents.push('threejs-optimizer');
  }
  if (analysis.domains.includes('ui')) {
    resources.skills.push('/component-generator');
  }

  // Always add code-reviewer for any code changes
  if (analysis.type !== 'research') {
    resources.agents.push('code-reviewer');
  }

  // Add PR preparation for anything > small
  if (analysis.scope >= 'medium') {
    resources.skills.push('/pr-preparation');
  }

  return resources;
}
```

## Integration with /plan

The `/plan` skill uses this registry to:
1. Analyze request → determine scope, type, domains
2. Look up recommended resources in capability matrix
3. Calculate agent count based on complexity
4. Generate orchestration plan
5. Validate with user via AskUserQuestion
6. Execute with TodoWrite tracking
