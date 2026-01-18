# /dependency-auditor - Dependency Audit & Security

Audit project dependencies for security vulnerabilities, updates, and best practices.

## Usage
```
/dependency-auditor [optional: specific package to audit]
```

## Process

### Step 1: Determine Scope
Ask via AskUserQuestion:

**Question 1: Audit Scope**
- Full audit (all dependencies)
- Security only (vulnerabilities)
- Updates only (outdated packages)
- Specific package

**Question 2: Update Strategy**
- Conservative (patch only)
- Moderate (minor updates OK)
- Aggressive (major updates OK)

### Step 2: Run Audits

```bash
# Security audit
npm audit

# Check for outdated
npm outdated

# Check bundle size impact
npx bundle-phobia [package]
```

### Step 3: Research Findings
Use WebSearch to check:
- Known vulnerabilities
- Package maintenance status
- Recommended alternatives
- Breaking changes in updates

### Step 4: Generate Report

```markdown
# Dependency Audit Report

## Summary
- Total dependencies: [count]
- Direct dependencies: [count]
- Security issues: [count]
- Outdated packages: [count]

## Security Issues

### Critical
| Package | Vulnerability | Fix |
|---------|--------------|-----|
| [name] | [CVE-XXX] | Update to [version] |

### High
| Package | Vulnerability | Fix |
|---------|--------------|-----|
| [name] | [description] | [action] |

## Outdated Packages

### Recommended Updates
| Package | Current | Latest | Type | Risk |
|---------|---------|--------|------|------|
| [name] | [ver] | [ver] | minor | low |

### Major Updates Available
| Package | Current | Latest | Breaking Changes |
|---------|---------|--------|------------------|
| [name] | [ver] | [ver] | [summary] |

## Package Health

### Concerning
| Package | Issue | Recommendation |
|---------|-------|----------------|
| [name] | Unmaintained (2+ years) | Consider [alternative] |
| [name] | High vulnerability history | Monitor closely |

### Healthy
- [package]: Active maintenance, regular releases

## Bundle Size Analysis

### Largest Dependencies
| Package | Size | % of Bundle |
|---------|------|-------------|
| [name] | [size] | [%] |

### Optimization Opportunities
- [package]: Consider lazy loading
- [package]: Lighter alternative available

## Recommended Actions

### Immediate (Security)
1. `npm update [package]` - fixes [vulnerability]

### Short-term (Maintenance)
1. Update [packages] to minor versions
2. Review [package] alternatives

### Long-term (Health)
1. Plan migration from [deprecated package]
2. Consider [optimization]
```

### Step 5: Create Action Items
Convert findings into TodoWrite tasks:
- Immediate security fixes
- Safe updates
- Research needed for major updates

## Example

**User**: "/dependency-auditor security only"

**Audit Results**:
```
3 vulnerabilities found (1 critical, 2 moderate)
```

**Report**:
```markdown
# Security Audit Report

## Critical
| Package | Issue | Fix |
|---------|-------|-----|
| lodash | Prototype Pollution | `npm update lodash` |

## Moderate
| Package | Issue | Fix |
|---------|-------|-----|
| axios | SSRF | Update to 1.6.0+ |
| postcss | ReDoS | Update to 8.4.31+ |

## Recommended Actions
1. Run `npm audit fix`
2. Manually update axios (breaking changes)
3. Test thoroughly after updates
```
