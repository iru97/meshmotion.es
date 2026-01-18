# MeshMotion Capability Registry

Complete registry of all available Task subagents, agent prompts, skills, tools, and their optimal use cases.

## How Resources Work

### Task Subagents (Built-in)
Use `Task` tool with `subagent_type` parameter:
- `Explore` - Fast codebase exploration
- `Plan` - Design implementation plans
- `general-purpose` - Research, multi-step analysis
- `Bash` - Command execution

### Agent Prompts (`.claude/agents/`)
Read these files for specialized guidance - they're prompt templates, not auto-spawned:
- `orchestrator` - Multi-phase coordination patterns
- `code-reviewer` - Code quality review guidance
- `test-architect` - Test design patterns
- `threejs-optimizer` - 3D performance patterns
- `refactoring-architect` - Safe refactoring patterns
- `sprint-planner` - Task breakdown patterns

### Skills (Invoke via Skill tool)
User-invocable workflows with specialized logic.

## Capability Matrix

### Request Type → Recommended Resources

| Request Type | Task Subagents | Agent Prompts to Read | Skills | Tools |
|--------------|----------------|----------------------|--------|-------|
| **Bug Fix** | Explore, general-purpose | `code-reviewer` | `/debug-wizard` | Grep, Read, Bash |
| **New Feature** | Explore, Plan | `orchestrator`, `code-reviewer`, `test-architect` | `/feature-planner`, `/component-generator` | All |
| **Refactoring** | Explore, Plan | `refactoring-architect`, `code-reviewer` | `/architecture-decision` | Read, Edit, Grep |
| **Performance** | Explore, general-purpose | `threejs-optimizer`, `code-reviewer` | `/dependency-auditor` | Bash, Read |
| **Testing** | Explore | `test-architect`, `code-reviewer` | `/debug-wizard` | Bash, Read, Write |
| **Research** | general-purpose | - | `/architecture-decision`, `/dependency-auditor` | WebSearch, WebFetch, Read |
| **Documentation** | Explore | - | - | Read, Write, Glob |
| **Migration** | Explore, Plan | `orchestrator`, `refactoring-architect` | `/architecture-decision` | All |
| **Full Project** | All | All | All | All |

### Domain → Specialized Resources

| Domain | Agent Prompts | Skills | Key Files |
|--------|---------------|--------|-----------|
| **UI** | `code-reviewer` | `/component-generator` | `src/components/**` |
| **State** | `code-reviewer`, `refactoring-architect` | `/architecture-decision` | `src/lib/store/**` |
| **3D/Rendering** | `threejs-optimizer`, `code-reviewer` | `/export-debugger` | `src/components/viewer/**`, `src/lib/three/**` |
| **Export/Import** | `code-reviewer` | `/export-debugger` | `src/lib/conversion/**`, `src/hooks/use-*` |
| **Animation** | `threejs-optimizer`, `code-reviewer` | `/debug-wizard` | `src/components/animation/**` |
| **Performance** | `threejs-optimizer` | `/dependency-auditor` | All |
| **Types** | `code-reviewer` | - | `src/types/**` |
| **Tests** | `test-architect` | `/debug-wizard` | `__tests__/**` |

## Agent Prompt Templates

### orchestrator
```yaml
purpose: Prompt template for complex multi-phase coordination
tools: [Read, Glob, Grep, Bash, Task, AskUserQuestion, TodoWrite]
model: opus
read_when:
  - Large features (5+ files)
  - Multi-system changes
  - Release coordination
  - Recovery from failures
provides: Phase patterns, quality gates, error recovery strategies
```

### sprint-planner
```yaml
purpose: Prompt template for planning and task breakdown
tools: [Read, Glob, Grep, AskUserQuestion, TodoWrite]
model: sonnet
read_when:
  - Milestone planning
  - Epic breakdown
  - Complexity estimation
  - Prioritization
provides: Task lists, Dependency maps, Risk assessments
```

### code-reviewer
```yaml
purpose: Prompt template for MeshMotion-specific code review
tools: [Read, Grep, Glob, Bash]
model: sonnet
read_when:
  - After any code changes
  - Pattern compliance
  - Security review
  - Performance review
checks_to_perform:
  - Zustand selector patterns
  - Three.js disposal
  - TypeScript strict compliance
  - No console.logs
```

### test-architect
```yaml
purpose: Prompt template for test design and implementation
tools: [Read, Write, Edit, Bash, Grep, Glob]
model: sonnet
read_when:
  - Test suite design
  - Coverage improvement
  - Test debugging
patterns_provided:
  - React Testing Library
  - Jest mocking
  - Three.js test mocks
coverage_target: 80%
```

### threejs-optimizer
```yaml
purpose: Prompt template for WebGL and Three.js performance
tools: [Read, Grep, Glob, Bash, Edit]
model: sonnet
read_when:
  - Performance audits
  - Memory leak detection
  - Draw call optimization
  - Animation performance
targets_provided:
  - Draw calls (<100)
  - FPS (60+)
  - Memory usage
  - Load time
```

### refactoring-architect
```yaml
purpose: Prompt template for safe code transformations
tools: [Read, Grep, Glob, Edit, Bash]
model: sonnet
read_when:
  - Extract component/hook
  - Consolidate patterns
  - Type improvements
  - Dead code removal
safety_patterns:
  - Tests must pass
  - Small incremental changes
  - Rollback strategy
```

## Skill Capabilities

### Master Commands

| Skill | Philosophy | Best For |
|-------|------------|----------|
| `/plan` | Analyze → Validate → Execute with agents | Complex features, ambiguous requirements, research |
| `/plan-loop-implementation` | Questions → Loop until done (Ralph Wiggum) | Batch work, migrations, clear success criteria |

### Interactive Skills (AskUserQuestion)

| Skill | Questions Asked | Outputs |
|-------|-----------------|---------|
| `/plan` | Scope, Focus, Constraints, Approach | Full orchestration plan |
| `/plan-loop-implementation` | Scope, Success criteria, Constraints | TodoWrite loop until all pass |
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

### Pattern: Quick Fix
```
1. Task(Explore): Find relevant code
2. Read agent: code-reviewer (review guidance)
3. [fix]
4. Verify: tests pass, lint clean
```

### Pattern: New Component
```
1. Skill(/feature-planner): Define requirements
2. Skill(/component-generator): Create files
3. Read agent: code-reviewer (review guidance)
4. Read agent: test-architect (test guidance)
5. Skill(/pr-preparation): Final PR
```

### Pattern: Performance Work
```
1. Task(Explore): Find 3D/rendering code
2. Read agent: threejs-optimizer (baseline patterns)
3. [optimization work]
4. Read agent: threejs-optimizer (verify patterns)
5. Read agent: code-reviewer (review)
6. Run tests to check for regressions
```

### Pattern: Large Feature
```
1. Read agent: sprint-planner (breakdown patterns)
2. Skill(/feature-planner): Detail each feature
3. Skill(/architecture-decision): If needed
4. Read agent: orchestrator (coordination patterns)
5. Task(Plan): Design architecture
6. [implementation with TodoWrite tracking]
7. Read agent: code-reviewer (per component)
8. Read agent: test-architect (tests)
9. Read agent: threejs-optimizer (if 3D)
10. Skill(/pr-preparation): Final PR
```

### Pattern: Epic/Project
```
Phase 1: Research
├── Task(general-purpose): Research best practices
├── Skill(/dependency-auditor): Check dependencies
└── Skill(/architecture-decision): ×N as needed

Phase 2: Planning
├── Read agent: sprint-planner (breakdown patterns)
├── Skill(/feature-planner): ×N per feature
└── Read agent: orchestrator (master coordination)

Phase 3: Implementation (TodoWrite tracking)
├── Task(Explore): Find relevant code
├── [implementation work]
└── Read agent: code-reviewer (per component)

Phase 4: Integration
├── Read agent: test-architect (integration tests)
├── Read agent: threejs-optimizer (if 3D)
└── Run full test suite

Phase 5: Polish
├── Read agent: refactoring-architect (cleanup)
├── Skill(/pr-preparation): Final PR
└── Final verification
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
    taskSubagents: ['Explore'],  // Always useful for finding code
    agentPromptsToRead: [],       // Prompt templates to read
    skills: [],                   // Skills to invoke
    tools: ['Read', 'Glob', 'Grep'],
  };

  // Add by scope
  if (analysis.scope >= 'large') {
    resources.agentPromptsToRead.push('orchestrator');
    resources.agentPromptsToRead.push('sprint-planner');
    resources.taskSubagents.push('Plan');
  }

  // Add by type
  switch (analysis.type) {
    case 'bug-fix':
      resources.skills.push('/debug-wizard');
      break;
    case 'feature':
      resources.skills.push('/feature-planner');
      resources.agentPromptsToRead.push('test-architect');
      break;
    case 'refactor':
      resources.agentPromptsToRead.push('refactoring-architect');
      break;
    case 'research':
      resources.tools.push('WebSearch', 'WebFetch');
      resources.taskSubagents.push('general-purpose');
      resources.skills.push('/architecture-decision');
      break;
  }

  // Add by domain
  if (analysis.domains.includes('3d')) {
    resources.agentPromptsToRead.push('threejs-optimizer');
  }
  if (analysis.domains.includes('ui')) {
    resources.skills.push('/component-generator');
  }

  // Always read code-reviewer for any code changes
  if (analysis.type !== 'research') {
    resources.agentPromptsToRead.push('code-reviewer');
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
