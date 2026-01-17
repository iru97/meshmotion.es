---
name: pr-preparation
description: Comprehensive PR preparation workflow. Runs checks, generates description, identifies reviewers, and ensures quality. Multi-tool workflow for perfect PRs.
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - AskUserQuestion
  - TodoWrite
user-invocable: true
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "echo 'Running PR preparation checks...'"
          once: true
---

# PR Preparation Skill

Comprehensive workflow to prepare a high-quality pull request.

## Usage

Invoke with: `/pr-preparation [base-branch]`

Default base branch: `main`

## PR Preparation Workflow

### Phase 1: Pre-flight Checks

Run automated checks with `Bash`:

```bash
# 1. Ensure clean working directory
git status --porcelain

# 2. Run type checking
npm run type-check

# 3. Run linting
npm run lint

# 4. Run tests (if available)
npm run test --if-present

# 5. Build check
npm run build
```

Create checklist with `TodoWrite`:

```typescript
[
  { content: "Type check passes", status: "pending", activeForm: "Checking types" },
  { content: "Lint passes", status: "pending", activeForm: "Running linter" },
  { content: "Tests pass", status: "pending", activeForm: "Running tests" },
  { content: "Build succeeds", status: "pending", activeForm: "Building" },
  { content: "No console.logs", status: "pending", activeForm: "Checking logs" },
  { content: "No TODOs in changed files", status: "pending", activeForm: "Checking TODOs" },
]
```

### Phase 2: Change Analysis

Analyze the changes:

```bash
# Get changed files
git diff main --name-only

# Get diff stats
git diff main --stat

# Get commit history
git log main..HEAD --oneline
```

Categorize changes:
- **Features**: New functionality
- **Fixes**: Bug fixes
- **Refactors**: Code improvements
- **Docs**: Documentation
- **Tests**: Test additions/changes
- **Chores**: Build, deps, config

### Phase 3: PR Description Generation

Use `AskUserQuestion` to gather context:

```
Question 1: PR Type
- Header: "PR Type"
- Options:
  - "Feature" - New functionality
  - "Bug Fix" - Fixes an issue
  - "Refactor" - Code improvement
  - "Docs" - Documentation
  - "Chore" - Maintenance

Question 2: Breaking Changes?
- Header: "Breaking?"
- Options:
  - "No breaking changes"
  - "Yes - API changes"
  - "Yes - Behavior changes"
  - "Yes - Dependency changes"

Question 3: Testing Done
- Header: "Testing"
- multiSelect: true
- Options:
  - "Manual testing"
  - "Unit tests added"
  - "Integration tests"
  - "Visual regression"
```

### Phase 4: Generate PR Description

```markdown
## Summary
[Auto-generated from commits + user input]

## Changes
- [Change 1 from diff analysis]
- [Change 2]
- [Change 3]

## Type
- [ ] Feature
- [x] Bug Fix (checked based on user input)
- [ ] Refactor
- [ ] Docs
- [ ] Chore

## Breaking Changes
[None / Description of breaking changes]

## Testing
- [x] Manual testing (based on user input)
- [ ] Unit tests added
- [ ] Integration tests

## Screenshots
[If UI changes, prompt for screenshots]

## Checklist
- [x] Type check passes
- [x] Lint passes
- [x] Tests pass
- [x] Build succeeds
- [ ] Documentation updated (if needed)
- [ ] CHANGELOG updated (if needed)

## Related Issues
[Auto-detect from commit messages or ask]
```

### Phase 5: Quality Verification

Use `AskUserQuestion` for final checks:

```
Question: Final verification
- Header: "Ready?"
- multiSelect: true
- Options:
  - "Code has been self-reviewed"
  - "Commit messages are clear"
  - "Branch is up to date with base"
  - "Ready to create PR"
```

### Phase 6: Create PR

If all checks pass:

```bash
# Push branch
git push -u origin $(git branch --show-current)

# Create PR with gh CLI
gh pr create \
  --title "[Type]: Description" \
  --body "$(cat pr-description.md)" \
  --base main
```

## Quality Gates

### Must Pass (Blocking)
- [ ] Type check (`npm run type-check`)
- [ ] Lint (`npm run lint`)
- [ ] Build (`npm run build`)

### Should Pass (Warning)
- [ ] Tests (`npm run test`)
- [ ] No TODO comments in changed files
- [ ] No console.log statements

### Nice to Have
- [ ] Documentation updated
- [ ] CHANGELOG entry
- [ ] Screenshots for UI changes

## PR Templates by Type

### Feature PR
```markdown
## Feature: [Name]

### What
[What does this feature do?]

### Why
[Why is this feature needed?]

### How
[Brief technical approach]

### Testing
[How was it tested?]
```

### Bug Fix PR
```markdown
## Fix: [Issue]

### Problem
[What was broken?]

### Cause
[Why was it broken?]

### Solution
[How did you fix it?]

### Verification
[How to verify the fix?]
```

### Refactor PR
```markdown
## Refactor: [Area]

### Before
[What was the old approach?]

### After
[What is the new approach?]

### Why
[Benefits of the change]

### Risk
[Any risks with this change?]
```

## Integration

- Runs `code-reviewer` agent automatically before PR
- Uses `build-deploy check` for pre-flight
- Creates follow-up tasks if issues found
