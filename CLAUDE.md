# MeshMotion - Professional 3D Model Viewer

## 🚀 Start Here: `/plan`

**For ANY request, use `/plan`**. It analyzes, validates, and orchestrates.

```
/plan [your request in natural language]
```

Examples:
- `/plan fix the animation freezing bug`
- `/plan add screenshot export feature`
- `/plan refactor the entire export system`
- `/plan build a complete testing suite`

The `/plan` command will:
1. **Analyze** your request (scope, type, complexity)
2. **Ask questions** to validate understanding
3. **Show** the full orchestration plan (agents, skills, phases)
4. **Enhance** your prompt with specifics
5. **Execute** with full progress tracking

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (localhost:3000) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript check |

## Tech Stack

Next.js 15 + React 19 + TypeScript 5 + Three.js 0.160 + R3F 9.4 + Zustand 4.4 + Tailwind 3.4 + shadcn/ui

## Critical Patterns

```typescript
// Zustand: ALWAYS use selectors
const isPlaying = useViewerStore((state) => state.isPlaying)

// Three.js: NEVER update state in useFrame
useFrame((_, delta) => { meshRef.current.rotation.y += delta })

// Async: Standard Result pattern
interface Result<T> { success: boolean; data?: T; error?: string }
```

---

## 🤖 Full Capability Set

### Master Command
| Command | Purpose |
|---------|---------|
| `/plan` | **Primary entry point** - analyzes any request and orchestrates |

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
| `/export-debugger` | Debug exports |
| `/build-deploy` | Build & deploy |

### Specialized Agents
| Agent | Best For |
|-------|----------|
| `orchestrator` | Complex multi-phase tasks |
| `sprint-planner` | Task breakdown |
| `code-reviewer` | Code quality |
| `test-architect` | Testing |
| `threejs-optimizer` | 3D performance |
| `refactoring-architect` | Safe refactoring |

---

## 🔧 Automated Features

**Session Start**: Git status, health check, TODOs
**PreToolUse**: Block dangerous commands, validate edits
**PostToolUse**: Auto-format code

---

## 📚 Documentation

**Always read these for context:**

@.claude/docs/CAPABILITIES.md
@.claude/docs/PROMPT_TEMPLATES.md
@.claude/docs/ARCHITECTURE.md
@.claude/docs/CONVENTIONS.md

**Coding rules are defined in:** `.claude/rules/*.md`

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/             # React components
│   ├── viewer/            # 3D scene
│   ├── animation/         # Animation controls
│   └── ...
├── lib/
│   ├── store/             # Zustand (viewer-store.ts)
│   ├── three/             # Three.js utilities
│   └── conversion/        # Format conversion
├── hooks/                 # Custom hooks
└── types/                 # TypeScript types
```

## Path Aliases

`@/*` → `./src/*` | `@/components/*` | `@/lib/*` | `@/hooks/*` | `@/types/*`
