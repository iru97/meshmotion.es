# {{PROJECT_NAME}} - {{PROJECT_DESCRIPTION}}

## Start Here: `/plan` or `/plan-loop-implementation`

**For ANY request, start with `/plan`**. It analyzes, validates, and orchestrates.

```
/plan [your request in natural language]
```

**For batch work with clear criteria, use `/plan-loop-implementation`**. It loops until done.

```bash
# Run the actual bash loop (autonomous)
.claude/loop.sh 50 "your task description"
```

**Key feature**: State persists in `.claude/loop-state.md`. When context runs out, just say `continue` and Claude picks up where it left off WITHOUT re-asking questions.

### When to Use Which

| Use `/plan` | Use `/plan-loop-implementation` |
|-------------|--------------------------------|
| Complex features needing design | Clear, well-defined tasks |
| Ambiguous requirements | Batch migrations/refactors |
| Research-heavy tasks | Adding test coverage |
| Architectural decisions | "Do X to all files matching Y" |

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `{{DEV_COMMAND}}` | Development server |
| `{{BUILD_COMMAND}}` | Production build |
| `{{LINT_COMMAND}}` | Linter |
| `{{TYPE_CHECK_COMMAND}}` | TypeScript check |
| `{{TEST_COMMAND}}` | Run tests |

## Tech Stack

{{TECH_STACK}}

## Critical Patterns

```typescript
// {{PATTERN_1_NAME}}
{{PATTERN_1_CODE}}

// {{PATTERN_2_NAME}}
{{PATTERN_2_CODE}}

// Async: Standard Result pattern
interface Result<T> { success: boolean; data?: T; error?: string }
```

---

## Capability Set

### Master Commands
| Command | Purpose |
|---------|---------|
| `/plan` | **Primary entry point** - analyzes, validates, then executes with agents |
| `/plan-loop-implementation` | **Loop mode** - gathers requirements, then loops until done |

### Interactive Skills
| Skill | Purpose |
|-------|---------|
| `/feature-planner` | Interactive feature planning |
| `/debug-wizard` | Guided debugging |
| `/architecture-decision` | Create ADRs |
| `/pr-preparation` | Complete PR workflow |
| `/dependency-auditor` | Security & updates |

### Utility Skills
| Skill | Purpose |
|-------|---------|
| `/component-generator` | Generate components |
| `/build-deploy` | Build & deploy |

### Specialized Agents
| Agent | Best For |
|-------|----------|
| `orchestrator` | Complex multi-phase tasks |
| `sprint-planner` | Task breakdown |
| `code-reviewer` | Code quality |
| `test-architect` | Testing |
| `refactoring-architect` | Safe refactoring |

---

## Automated Features

**Session Start**: Git status, health check, TODOs
**PreToolUse**: Block dangerous commands, validate edits
**PostToolUse**: Auto-format code

---

## Documentation

**Always read these for context:**

@.claude/docs/CAPABILITIES.md
@.claude/docs/PROMPT_TEMPLATES.md
@.claude/docs/ARCHITECTURE.md
@.claude/docs/CONVENTIONS.md

**Coding rules are defined in:** `.claude/rules/*.md`

---

## Project Structure

```
{{PROJECT_STRUCTURE}}
```

## Path Aliases

{{PATH_ALIASES}}
