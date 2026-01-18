---
name: dependency-auditor
description: Audit project dependencies for security vulnerabilities, updates, and best practices. Uses WebSearch to check for issues and recommendations.
allowed-tools:
  - Read
  - Bash
  - WebSearch
  - WebFetch
  - AskUserQuestion
  - TodoWrite
user-invocable: true
---

# Dependency Auditor Skill

Comprehensive dependency audit for security, updates, and best practices.

## Usage

Invoke with: `/dependency-auditor [scope]`

Scopes:
- `security` - Check for vulnerabilities only
- `updates` - Check for available updates
- `full` - Complete audit (default)
- `[package-name]` - Audit specific package

## Audit Workflow

### Phase 1: Gather Current State

Read package.json and lock files:

```bash
# Get dependency list
npm ls --depth=0 --json

# Check for known vulnerabilities
npm audit --json

# Check outdated packages
npm outdated --json
```

### Phase 2: Security Audit

Use `WebSearch` to check for vulnerabilities:

```
Search queries:
- "[package-name] vulnerability 2025"
- "[package-name] security advisory"
- "[package-name] CVE"
```

Use `WebFetch` to check official sources:
- GitHub Security Advisories
- npm audit database
- Snyk vulnerability database

### Phase 3: Update Analysis

For each outdated package, research:

```
Search queries:
- "[package] changelog"
- "[package] breaking changes [current-version] to [latest-version]"
- "[package] migration guide"
```

Use `AskUserQuestion` for update decisions:

```
Question: Update strategy for [package]
- Header: "[package]"
- Options:
  - "Update to latest" - [version] (may have breaking changes)
  - "Update to minor" - [version] (should be safe)
  - "Keep current" - [version] (skip this update)
  - "Need more info" - Research before deciding
```

### Phase 4: MeshMotion-Specific Checks

#### Three.js Ecosystem
Check compatibility between:
- `three` ↔ `@react-three/fiber` ↔ `@react-three/drei`
- Check Three.js changelog for breaking changes

```
Search: "three.js [version] react-three-fiber compatibility"
```

#### Next.js Ecosystem
Check compatibility:
- `next` ↔ `react` version requirements
- App Router specific requirements

#### shadcn/ui Components
Check for component updates:
- New components available
- Deprecations

### Phase 5: Generate Report

Create audit report with `TodoWrite` for action items:

```typescript
[
  { content: "🔴 [CRITICAL] Update lodash: CVE-2021-XXXXX", status: "pending", activeForm: "Updating lodash" },
  { content: "🟡 [HIGH] Update next: 15.0.3 → 15.1.0", status: "pending", activeForm: "Updating Next.js" },
  { content: "🟢 [LOW] Update lucide-react: new icons available", status: "pending", activeForm: "Updating icons" },
]
```

## Audit Report Format

```markdown
## Dependency Audit Report
**Date**: [YYYY-MM-DD]
**Total Dependencies**: [count]
**Vulnerabilities Found**: [count]

### 🔴 Critical Security Issues
| Package | Current | Issue | Recommendation |
|---------|---------|-------|----------------|
| lodash | 4.17.20 | CVE-2021-XXXXX | Update to 4.17.21 |

### 🟡 High Priority Updates
| Package | Current | Latest | Breaking Changes? |
|---------|---------|--------|-------------------|
| next | 15.0.3 | 15.1.0 | No |
| three | 0.160.0 | 0.162.0 | Yes - see notes |

### 🟢 Available Updates
| Package | Current | Latest | Notes |
|---------|---------|--------|-------|
| lucide-react | 0.548.0 | 0.550.0 | New icons |

### ⚪ Up to Date
- react: 19.0.0 ✓
- typescript: 5.x.x ✓
- tailwindcss: 3.4.x ✓

### Compatibility Matrix
| Package | Required By | Version Constraint |
|---------|-------------|-------------------|
| react | next, @react-three/fiber | ^18.0.0 || ^19.0.0 |
| three | @react-three/fiber, drei | >=0.156.0 |

### Recommendations
1. [Prioritized action item 1]
2. [Prioritized action item 2]
3. [Prioritized action item 3]
```

## Package-Specific Checks

### Three.js Updates
```
Check before updating:
1. R3F compatibility: https://docs.pmnd.rs/react-three-fiber
2. Drei compatibility: https://github.com/pmndrs/drei
3. Breaking changes: https://github.com/mrdoob/three.js/releases
```

### React 19 Compatibility
```
Check for:
1. Concurrent features usage
2. Deprecated lifecycle methods
3. Server Component boundaries
```

### Next.js Updates
```
Check for:
1. App Router changes
2. Middleware changes
3. Build configuration changes
```

## Automated Fixes

For safe updates, generate commands:

```bash
# Security fixes (usually safe)
npm audit fix

# Minor updates (usually safe)
npm update

# Specific package update
npm install [package]@[version]
```

## Integration

After audit:
- Create tasks for critical updates
- Update package.json
- Run full test suite
- Update lock file
- Document breaking changes in ADR if significant
