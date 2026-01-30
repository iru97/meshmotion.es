# Skill: /feature-synthesis

## Purpose
Convert deep research findings into prioritized requirements, dependency graphs, and MVP definition.

## Invocation
```
/feature-synthesis [loop-state-feature-research.md]
```

## Inputs
- Completed feature research state file
- Cross-cutting findings
- Project constraints

## Process

### 1. Extract Requirements Per Feature

For each feature, compile from X.7 Synthesis:

```markdown
### Feature [N]: [Name]

**MUST-HAVE (MVP):**
- [ ] [Requirement 1]
- [ ] [Requirement 2]
- [ ] [Requirement 3]

**NICE-TO-HAVE (v1.1):**
- [ ] [Enhancement 1]
- [ ] [Enhancement 2]

**FUTURE POSSIBILITIES:**
- [ ] [Possibility 1]
- [ ] [Possibility 2]

**TECHNICAL NOTES:**
- [Key implementation detail]
- [Performance consideration]
```

### 2. Create Priority Matrix

Score each feature on:
- **Effort:** 1-5 (1=low, 5=high)
- **Impact:** 1-5 (1=low, 5=high)
- **Uniqueness:** Does this differentiate us?
- **Dependencies:** What must come first?

```markdown
## IMPLEMENTATION PRIORITY MATRIX

### Tier 1: Core Differentiators (P0)
| Feature | Effort | Impact | Priority |
|---------|--------|--------|----------|
| [Name]  | High   | V.High | **P0**   |

**Rationale:** [Why these are P0]

### Tier 2: Essential UX (P1)
| Feature | Effort | Impact | Priority |
|---------|--------|--------|----------|
| [Name]  | Medium | High   | **P1**   |

**Rationale:** [Why these are P1]

### Tier 3: Growth Features (P2)
| Feature | Effort | Impact | Priority |
|---------|--------|--------|----------|
| [Name]  | Medium | Medium | **P2**   |

**Rationale:** [Why these are P2]

### Tier 4: Platform Features (P3)
| Feature | Effort | Impact | Priority |
|---------|--------|--------|----------|
| [Name]  | V.High | Niche  | **P3**   |

**Rationale:** [Why these are P3]
```

### 3. Build Dependency Graph

Identify which features depend on others:

```markdown
## DEPENDENCY GRAPH

[Feature A] ──────────────────┐
       │                      │
       ▼                      ▼
[Feature B] ←──────── [Feature C]
       │                      │
       ▼                      ▼
[Feature D] ←──────── [Feature E]
       │
       ▼
[Feature F]
       │
       ▼
[Feature G] (independent, can parallel)
       │
       ▼
[Feature H] (requires backend decision)
```

### 4. Define MVP

```markdown
## MVP DEFINITION

### [Product Name] MVP

**Core Features (Must Ship):**
1. [Feature from P0]
2. [Feature from P0]
3. [Feature from P1 - essential]

**Success Metrics:**
- [Metric 1 with target]
- [Metric 2 with target]
- [Metric 3 with target]

**Technical Constraints:**
- [Constraint 1]
- [Constraint 2]

**Out of Scope for MVP:**
- [Feature deferred]
- [Feature deferred]
- [Feature requiring backend]
```

### 5. Determine Build Order

Based on dependencies and priorities:

```markdown
## RECOMMENDED BUILD ORDER

### Phase 1: Foundation
1. [Feature/Task] - enables everything else
2. [Feature/Task] - core infrastructure

### Phase 2: Core Value
3. [P0 Feature] - primary differentiator
4. [P0 Feature] - key capability

### Phase 3: Essential UX
5. [P1 Feature] - user expectation
6. [P1 Feature] - quality of life

### Phase 4: Enhancement
7. [P2 Feature] - growth
8. [P2 Feature] - expansion

### Phase 5: Platform (Future)
9. [P3 Feature] - ecosystem
10. [P3 Feature] - integrations
```

## Outputs

1. **Requirements lists** per feature (must/nice/future)
2. **Priority matrix** with effort/impact scores
3. **Dependency graph** showing relationships
4. **MVP definition** with success metrics
5. **Build order** recommendation

## Quality Checklist

- [ ] All features have requirements extracted
- [ ] Priority tiers are justified
- [ ] Dependencies are mapped
- [ ] MVP is clearly scoped
- [ ] Build order respects dependencies
- [ ] Success metrics are measurable
