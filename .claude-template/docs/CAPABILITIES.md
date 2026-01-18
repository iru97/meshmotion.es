# Capability Registry

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
| **Performance** | Explore, general-purpose | `code-reviewer` | `/dependency-auditor` | Bash, Read |
| **Testing** | Explore | `test-architect`, `code-reviewer` | `/debug-wizard` | Bash, Read, Write |
| **Research** | general-purpose | - | `/architecture-decision`, `/dependency-auditor` | WebSearch, WebFetch, Read |
| **Documentation** | Explore | - | - | Read, Write, Glob |
| **Migration** | Explore, Plan | `orchestrator`, `refactoring-architect` | `/architecture-decision` | All |

### Domain → Specialized Resources

| Domain | Agent Prompts | Skills | Key Files |
|--------|---------------|--------|-----------|
| **UI** | `code-reviewer` | `/component-generator` | `{{COMPONENTS_PATH}}` |
| **State** | `code-reviewer`, `refactoring-architect` | `/architecture-decision` | `{{STORE_PATH}}` |
| **API** | `code-reviewer` | `/debug-wizard` | `{{API_PATH}}` |
| **Types** | `code-reviewer` | - | `{{TYPES_PATH}}` |
| **Tests** | `test-architect` | `/debug-wizard` | `{{TESTS_PATH}}` |

## Complexity Estimation

| Complexity | Agents | Characteristics |
|------------|--------|-----------------|
| 1 ⭐ | 1-2 | Single file, obvious fix |
| 2 ⭐⭐ | 2-3 | Few files, clear scope |
| 3 ⭐⭐⭐ | 3-5 | New component, store changes |
| 4 ⭐⭐⭐⭐ | 5-10 | Multiple systems, testing |
| 5 ⭐⭐⭐⭐⭐ | 10+ | Architectural, research |

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
9. Skill(/pr-preparation): Final PR
```
