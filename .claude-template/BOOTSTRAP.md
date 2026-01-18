# Claude Code Template Bootstrap

This is a generic template for setting up Claude Code in any React/Next.js project.

## Quick Setup

### Step 1: Copy Template
```bash
cp -r .claude-template /path/to/your/project/.claude
cp .claude-template/CLAUDE.md /path/to/your/project/CLAUDE.md
```

### Step 2: Run Bootstrap Prompt
In your new project, start Claude Code and paste the bootstrap prompt below.

---

## Bootstrap Prompt (Copy This)

```
/plan-loop-implementation Analyze this project and configure the Claude Code system.

## Tasks:
1. **Analyze project structure**: Explore src/, identify components, hooks, stores, types, and key patterns
2. **Update CLAUDE.md**: Replace all {{PLACEHOLDERS}} with actual project values:
   - {{PROJECT_NAME}} - from package.json name
   - {{PROJECT_DESCRIPTION}} - from package.json description
   - {{DEV_COMMAND}}, {{BUILD_COMMAND}}, etc. - from package.json scripts
   - {{TECH_STACK}} - detect from package.json dependencies
   - {{PROJECT_STRUCTURE}} - actual folder structure
   - {{PATH_ALIASES}} - from tsconfig.json paths

3. **Update .claude/docs/ARCHITECTURE.md**: Fill in project-specific architecture:
   - Document the actual component tree
   - Document state management approach
   - Document key patterns used

4. **Update .claude/docs/CAPABILITIES.md**: Update domain paths:
   - {{COMPONENTS_PATH}} - where components live
   - {{STORE_PATH}} - where state management lives
   - {{TYPES_PATH}} - where types live
   - {{TESTS_PATH}} - where tests live

5. **Update .claude/docs/CONVENTIONS.md**: Replace example code with actual project patterns

6. **Update .claude/rules/zustand.md** (if using Zustand): Update store path and examples

7. **Update .claude/hooks/session-init.sh**: Replace {{PROJECT_NAME}}

8. **Remove unused rules**: If not using certain tech, delete the rule file:
   - Not using Zustand? Delete zustand.md
   - Not using Next.js? Delete nextjs.md

9. **Add project-specific rules**: Create new rules if needed for:
   - Domain-specific patterns
   - API conventions
   - Database patterns

10. **Test the setup**: Run the session-init hook and verify output is correct

## Success Criteria:
- All {{PLACEHOLDERS}} replaced with real values
- CLAUDE.md accurately describes the project
- Session init hook runs without errors
- Rules match actual project tech stack
```

---

## What Gets Configured

| File | What to Update |
|------|----------------|
| `CLAUDE.md` | Project name, commands, tech stack, structure |
| `docs/ARCHITECTURE.md` | Component tree, state, patterns |
| `docs/CAPABILITIES.md` | File paths for domains |
| `docs/CONVENTIONS.md` | Real code examples |
| `rules/zustand.md` | Store path (if using) |
| `hooks/session-init.sh` | Project name |

## Placeholders Reference

| Placeholder | Example Value |
|-------------|---------------|
| `{{PROJECT_NAME}}` | `MyApp` |
| `{{PROJECT_DESCRIPTION}}` | `A web application for...` |
| `{{DEV_COMMAND}}` | `npm run dev` |
| `{{BUILD_COMMAND}}` | `npm run build` |
| `{{LINT_COMMAND}}` | `npm run lint` |
| `{{TYPE_CHECK_COMMAND}}` | `npm run type-check` |
| `{{TEST_COMMAND}}` | `npm test` |
| `{{TECH_STACK}}` | `Next.js 15 + React 19 + TypeScript` |
| `{{PROJECT_STRUCTURE}}` | Actual folder tree |
| `{{STORE_PATH}}` | `@/lib/store/app-store.ts` |
| `{{COMPONENTS_PATH}}` | `src/components/**` |
| `{{TYPES_PATH}}` | `src/types/**` |

## After Bootstrap

Once configured, you can use:

- `/plan [request]` - Analyze and execute any task
- `/plan-loop-implementation [task]` - Batch work with loop
- `/feature-planner` - Plan new features
- `/debug-wizard` - Debug issues
- `/pr-preparation` - Prepare PRs

## Maintenance

- Update `ARCHITECTURE.md` when structure changes significantly
- Add new rules to `rules/` for new patterns
- Add domain-specific skills to `skills/` if needed
