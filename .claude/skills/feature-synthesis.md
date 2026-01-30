# Skill: /feature-synthesis

## Purpose
Convert deep research findings into **100+ synthesized requirements**, prioritized with effort/impact scoring, dependency graphs, and MVP definition.

## Invocation
```
/feature-synthesis [loop-state-feature-research.md]
```

---

## MANDATORY REQUIREMENTS

### Minimum Synthesis Depth
| Requirement | Minimum | Per |
|-------------|---------|-----|
| Must-have items | **5** | Per feature |
| Nice-to-have items | **5** | Per feature |
| Future items | **3** | Per feature |
| Technical notes | **3** | Per feature |
| Effort score justification | **1** | Per feature |
| Impact score justification | **1** | Per feature |

### For 12 Features
- **60 must-have requirements** minimum
- **60 nice-to-have requirements** minimum
- **36 future items** minimum
- **12 effort/impact assessments** with justification
- **1 dependency graph** with all relationships
- **1 MVP definition** with success metrics

---

## SYNTHESIS PASS STRUCTURE

Synthesis is executed in **4 mandatory passes**:

### PASS 1: REQUIREMENTS EXTRACTION (Per Feature)
```
FOR EACH FEATURE:
  Extract from X.7 synthesis + all research findings

  REQUIRED OUTPUTS:

  **MUST-HAVE (MVP) - Minimum 5 items:**
  - [ ] [Requirement from X.1 existing solutions gaps]
  - [ ] [Requirement from X.2 core customization]
  - [ ] [Requirement from X.5 basic interaction]
  - [ ] [Requirement from X.6 primary technical approach]
  - [ ] [Requirement for minimum viable feature]

  **NICE-TO-HAVE (v1.1) - Minimum 5 items:**
  - [ ] [Enhancement from X.2 advanced customization]
  - [ ] [Enhancement from X.3 quality improvements]
  - [ ] [Enhancement from X.4 annotations]
  - [ ] [Enhancement from X.5 advanced interactions]
  - [ ] [Enhancement from competitive analysis]

  **FUTURE POSSIBILITIES - Minimum 3 items:**
  - [ ] [From X.1 state of the art research]
  - [ ] [From X.6 advanced technical possibilities]
  - [ ] [From whitespace/market gap analysis]

  **TECHNICAL NOTES - Minimum 3 items:**
  - [Primary implementation approach from X.6]
  - [Key library/dependency]
  - [Performance consideration]

  CHECKPOINT: All features have requirements extracted
```

### PASS 2: EFFORT/IMPACT SCORING (Per Feature)
```
FOR EACH FEATURE:
  Score based on research findings

  EFFORT SCORING (1-5):
  1 = Few hours, single file, obvious implementation
  2 = Day or two, 2-3 files, straightforward
  3 = Week, multiple components, some complexity
  4 = 2+ weeks, new systems, significant complexity
  5 = Month+, architectural changes, high risk

  SCORE JUSTIFICATION (REQUIRED):
  - Lines of code estimate
  - Files to create/modify
  - Dependencies to add
  - Testing complexity
  - Risk factors

  IMPACT SCORING (1-5):
  1 = Minor convenience, few users care
  2 = Nice to have, some users want
  3 = Important, many users expect
  4 = Critical, key differentiator
  5 = Essential, defines the product

  SCORE JUSTIFICATION (REQUIRED):
  - User demand evidence (from X.1 research)
  - Competitive advantage (from whitespace)
  - Revenue/growth potential
  - Technical enablement (unlocks other features)

  PRIORITY CALCULATION:
  Priority Score = Impact × (6 - Effort)

  | Impact | Effort | Score | Priority |
  |--------|--------|-------|----------|
  | 5      | 1      | 25    | P0       |
  | 5      | 2      | 20    | P0       |
  | 4      | 2      | 16    | P0       |
  | 4      | 3      | 12    | P1       |
  | 3      | 3      | 9     | P1       |
  | 3      | 4      | 6     | P2       |
  | 2      | 4      | 4     | P2       |
  | 2      | 5      | 2     | P3       |

  CHECKPOINT: All features have effort/impact scores with justification
```

### PASS 3: DEPENDENCY ANALYSIS
```
FOR ALL FEATURES:
  Identify relationships

  DEPENDENCY TYPES:
  1. HARD DEPENDENCY: Feature B cannot start until Feature A complete
     → A must be higher priority than B

  2. SOFT DEPENDENCY: Feature B benefits from Feature A
     → A should be higher priority, but B can start

  3. SHARED DEPENDENCY: Features A and B both need Component X
     → Component X must be built first

  4. PARALLEL: Features A and B are independent
     → Can be built simultaneously

  REQUIRED OUTPUTS:

  **Dependency Matrix:**
  |          | F1 | F2 | F3 | F4 | F5 | ... |
  |----------|----|----|----|----|----| --- |
  | F1       | -  |    | H  |    | S  |     |
  | F2       | H  | -  |    |    |    |     |
  | F3       |    |    | -  | S  |    |     |

  H = Hard dependency, S = Soft dependency

  **Dependency Graph (ASCII):**
  [Foundation] ────┬────────────────────┐
        │         │                    │
        ▼         ▼                    ▼
  [Feature A] ←── [Feature B]    [Feature C]
        │                              │
        └──────────────┬───────────────┘
                       ▼
                [Feature D]

  **Critical Path:**
  1. [First feature] - no dependencies
  2. [Second feature] - depends on 1
  3. [Third feature] - depends on 2
  ...

  **Parallel Opportunities:**
  - [Feature X] and [Feature Y] can be built simultaneously
  - [Feature Z] is independent

  CHECKPOINT: All dependencies mapped, critical path identified
```

### PASS 4: MVP DEFINITION & BUILD ORDER
```
MVP SCOPING:

  SELECTION CRITERIA:
  - All P0 features MUST be included
  - P1 features included if on critical path
  - P2/P3 features excluded unless dependency

  REQUIRED OUTPUTS:

  **MVP Feature List:**
  1. [Feature] - [1-sentence justification]
  2. [Feature] - [1-sentence justification]
  ...

  **MVP Success Metrics:**
  | Metric | Target | Measurement Method |
  |--------|--------|-------------------|
  | [Performance metric] | [specific number] | [how measured] |
  | [Usability metric] | [specific number] | [how measured] |
  | [Business metric] | [specific number] | [how measured] |

  **Technical Constraints:**
  - [Constraint 1 with rationale]
  - [Constraint 2 with rationale]

  **Explicitly Out of Scope:**
  - [Feature] - deferred to v1.1 because [reason]
  - [Feature] - deferred because [reason]

BUILD ORDER:

  **Phase 1: Foundation**
  - [Task 1] - enables all other work
  - [Task 2] - core infrastructure
  Duration: [estimate]

  **Phase 2: Core Features**
  - [P0 Feature 1]
  - [P0 Feature 2]
  Duration: [estimate]

  **Phase 3: Essential UX**
  - [P1 Feature 1]
  - [P1 Feature 2]
  Duration: [estimate]

  **Phase 4: Integration & Polish**
  - Integration testing
  - Performance optimization
  - Accessibility audit
  Duration: [estimate]

  GATE: MVP defined, build order respects dependencies
```

---

## STATE FILE FORMAT (MANDATORY)

```markdown
# Feature Synthesis: [Project Name]

## Session State
**Last Updated**: [ISO timestamp]
**Current Pass**: [1-4]
**Current Feature**: [N of total]
**Status**: IN_PROGRESS | COMPLETE

## Progress Summary
| Pass | Status | Progress |
|------|--------|----------|
| 1. Requirements Extraction | [✓/In Progress] | [N/Total] features |
| 2. Effort/Impact Scoring | [✓/In Progress] | [N/Total] features |
| 3. Dependency Analysis | [✓/In Progress] | [Complete/Pending] |
| 4. MVP Definition | [✓/In Progress] | [Complete/Pending] |

---

## FEATURE REQUIREMENTS

### Feature 1: [Name]

**MUST-HAVE (MVP):**
- [ ] [Requirement 1]
- [ ] [Requirement 2]
- [ ] [Requirement 3]
- [ ] [Requirement 4]
- [ ] [Requirement 5]

**NICE-TO-HAVE (v1.1):**
- [ ] [Enhancement 1]
- [ ] [Enhancement 2]
- [ ] [Enhancement 3]
- [ ] [Enhancement 4]
- [ ] [Enhancement 5]

**FUTURE POSSIBILITIES:**
- [ ] [Future 1]
- [ ] [Future 2]
- [ ] [Future 3]

**TECHNICAL NOTES:**
- [Note 1]
- [Note 2]
- [Note 3]

---

[Repeat for all features]

---

## EFFORT/IMPACT ASSESSMENT

### Feature 1: [Name]

**Effort Score: [1-5]**
Justification:
- LOC estimate: [number]
- Files to modify: [list]
- Dependencies: [list]
- Testing: [simple/moderate/complex]
- Risk: [low/medium/high]

**Impact Score: [1-5]**
Justification:
- User demand: [evidence from research]
- Competitive advantage: [whitespace identified]
- Technical enablement: [what it unlocks]

**Priority Score: [calculated]**
**Priority Tier: [P0/P1/P2/P3]**

---

[Repeat for all features]

---

## PRIORITY MATRIX

### Tier P0: Core Differentiators
| Feature | Effort | Impact | Score | Justification |
|---------|--------|--------|-------|---------------|
| [Name] | [1-5] | [1-5] | [calc] | [why P0] |

### Tier P1: Essential UX
| Feature | Effort | Impact | Score | Justification |
|---------|--------|--------|-------|---------------|
| [Name] | [1-5] | [1-5] | [calc] | [why P1] |

### Tier P2: Growth Features
| Feature | Effort | Impact | Score | Justification |
|---------|--------|--------|-------|---------------|
| [Name] | [1-5] | [1-5] | [calc] | [why P2] |

### Tier P3: Platform Features
| Feature | Effort | Impact | Score | Justification |
|---------|--------|--------|-------|---------------|
| [Name] | [1-5] | [1-5] | [calc] | [why P3] |

---

## DEPENDENCY ANALYSIS

### Dependency Matrix
|     | F1 | F2 | F3 | F4 | F5 | F6 | F7 | F8 | F9 | F10 | F11 | F12 |
|-----|----|----|----|----|----|----|----|----|----|----|-----|-----|
| F1  | -  |    |    |    |    |    |    |    |    |    |     |     |
| F2  |    | -  |    |    |    |    |    |    |    |    |     |     |
...

Legend: H = Hard dependency, S = Soft dependency, blank = independent

### Dependency Graph
```
[ASCII diagram showing all feature relationships]
```

### Critical Path
1. [Feature] - foundation, no deps
2. [Feature] - depends on #1
3. [Feature] - depends on #2
...

### Parallel Opportunities
- [Features that can be built simultaneously]

---

## MVP DEFINITION

### Core Features (Must Ship)
1. [Feature] - [justification]
2. [Feature] - [justification]
...

### Success Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| [metric] | [number] | [method] |

### Technical Constraints
- [Constraint with rationale]

### Out of Scope
- [Feature] - deferred because [reason]

---

## BUILD ORDER

### Phase 1: Foundation ([duration])
- [ ] [Task]
- [ ] [Task]

### Phase 2: Core Features ([duration])
- [ ] [Feature]
- [ ] [Feature]

### Phase 3: Essential UX ([duration])
- [ ] [Feature]
- [ ] [Feature]

### Phase 4: Polish ([duration])
- [ ] [Task]
- [ ] [Task]

---

## QUALITY GATES

### Gate 1: Requirements Complete
- [ ] All features have 5+ must-have items
- [ ] All features have 5+ nice-to-have items
- [ ] All features have 3+ future items
- [ ] All features have 3+ technical notes

### Gate 2: Scoring Complete
- [ ] All features have effort score with justification
- [ ] All features have impact score with justification
- [ ] All features assigned to priority tier
- [ ] Priority calculations verified

### Gate 3: Dependencies Complete
- [ ] Dependency matrix filled
- [ ] Dependency graph created
- [ ] Critical path identified
- [ ] Parallel opportunities noted

### Gate 4: MVP Complete
- [ ] MVP features selected with justification
- [ ] Success metrics defined with targets
- [ ] Out of scope explicitly listed
- [ ] Build order respects dependencies
- [ ] READY FOR /generate-prd
```

---

## EXECUTION CHECKLIST

Before marking synthesis complete:

- [ ] **60+ must-have requirements** (5 per feature × 12)
- [ ] **60+ nice-to-have requirements** (5 per feature × 12)
- [ ] **36+ future items** (3 per feature × 12)
- [ ] **12 effort scores** with justification
- [ ] **12 impact scores** with justification
- [ ] **Dependency matrix** complete
- [ ] **Dependency graph** visualized
- [ ] **Critical path** identified
- [ ] **MVP defined** with success metrics
- [ ] **Build order** respects dependencies
- [ ] **All 4 quality gates** passed
- [ ] **State file** committed
- [ ] **Ready for /generate-prd**
