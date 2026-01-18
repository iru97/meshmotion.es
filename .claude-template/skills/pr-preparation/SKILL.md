# /pr-preparation - Comprehensive PR Workflow

Complete PR preparation including checks, description generation, and quality assurance.

## Usage
```
/pr-preparation [optional: PR title or branch name]
```

## Process

### Step 1: Gather PR Context
Ask via AskUserQuestion:

**Question 1: Change Type**
- Feature (new functionality)
- Fix (bug fix)
- Refactor (code improvement)
- Docs (documentation)
- Chore (maintenance)

**Question 2: Breaking Changes?**
- Yes (API/behavior change)
- No (backwards compatible)

**Question 3: Testing Done?**
- Unit tests added/updated
- Manual testing only
- E2E tests added
- No testing yet

### Step 2: Run Quality Checks

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Tests
npm test

# Build
npm run build
```

Report any failures before proceeding.

### Step 3: Analyze Changes

```bash
# Get change summary
git diff main...HEAD --stat

# Get detailed diff
git diff main...HEAD
```

Identify:
- Files changed
- Lines added/removed
- Key changes to highlight

### Step 4: Generate PR Description

```markdown
## Summary
[2-3 bullet points describing the changes]

## Type of Change
- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Documentation
- [ ] Chore

## Changes Made
- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] No regressions identified

## Screenshots (if UI changes)
[Add screenshots here]

## Checklist
- [ ] Code follows project conventions
- [ ] Self-reviewed the code
- [ ] No console.log statements
- [ ] TypeScript strict mode passes
- [ ] Documentation updated (if needed)

## Notes for Reviewers
[Any context reviewers should know]
```

### Step 5: Identify Reviewers
Based on files changed, suggest reviewers:
- Component changes → UI team
- State changes → Architecture team
- API changes → Backend team

### Step 6: Create PR
If checks pass:
```bash
gh pr create --title "[type]: description" --body "..."
```

## Pre-PR Checklist

### Code Quality
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] No console.log statements
- [ ] Proper error handling
- [ ] No commented-out code

### Testing
- [ ] Tests added for new code
- [ ] All tests passing
- [ ] Manual testing done

### Documentation
- [ ] Code comments where needed
- [ ] README updated (if needed)
- [ ] CHANGELOG updated (if needed)

### Git
- [ ] Commits are atomic and descriptive
- [ ] Branch is up to date with main
- [ ] No merge conflicts

## Example

**User**: "/pr-preparation"

**Analysis**:
- Branch: `feature/dark-mode`
- 5 files changed
- 150 lines added
- Type: Feature

**Checks**:
```
✓ TypeScript: No errors
✓ ESLint: No warnings
✓ Tests: 42 passed
✓ Build: Success
```

**Generated PR**:
```markdown
## Summary
- Add dark mode toggle to settings
- Persist theme preference to localStorage
- Support system preference detection

## Type of Change
- [x] Feature

## Changes Made
- Added `ThemeToggle` component
- Added `theme` state to settings store
- Updated CSS variables for dark theme
- Added localStorage persistence

## Testing
- [x] Unit tests for ThemeToggle
- [x] Manual testing in Chrome/Firefox
- [x] Verified persistence works
```
