# Skill: /research-to-prd

## Master Orchestration Skill

**Deep Research → PRD → Ralph-tui Implementation**

This skill orchestrates the complete pipeline from an initial prompt through **500+ subphases of deep research** to a production-ready PRD and ralph-tui compatible implementation plan.

---

## TOTAL OUTPUT METRICS

| Stage | Minimum Output |
|-------|----------------|
| Feature Research | **504 subphases** (12 features × 42 each) |
| Web Searches | **216 searches** (3 per category × 6 categories × 12 features) |
| Competitors Analyzed | **36** (3 per feature) |
| Requirements | **156** (13 per feature: 5 must + 5 nice + 3 future) |
| PRD Sections | **10 sections** with full content |
| User Stories | **25-50** for ralph-tui |

---

## INVOCATION

```
/research-to-prd "[Research topic/domain] for [product]. [Goals/context]."
```

**Example:**
```
/research-to-prd "Research biomechanics visualization opportunities
inspired by Vittorio Caggiano's work. Create features for MeshMotion
that would appeal to researchers and educators."
```

---

## STAGE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────┐
│                        /research-to-prd                             │
│                    8 STAGES • 500+ SUBPHASES                        │
└─────────────────────────────────────────────────────────────────────┘
                               │
    ┌──────────────────────────┼──────────────────────────┐
    ▼                          ▼                          ▼
┌────────┐              ┌────────────┐              ┌────────────┐
│STAGE 1 │              │  STAGE 2   │              │  STAGE 3   │
│ INTAKE │─────────────▶│  DOMAIN    │─────────────▶│  FEATURE   │
│& SCOPE │              │  RESEARCH  │              │  IDEATION  │
│        │              │            │              │            │
│ 5 min  │              │ 30-60 min  │              │ 15-30 min  │
└────────┘              └────────────┘              └────────────┘
    │                                                     │
    │         ┌───────────────────────────────────────────┘
    │         ▼
    │  ┌─────────────────────────────────────────────────────────────┐
    │  │                      STAGE 4                                │
    │  │              /deep-feature-research                         │
    │  │                                                             │
    │  │  • 504 subphases (12 features × 7 categories × 6 items)    │
    │  │  • 216 web searches minimum                                 │
    │  │  • 5 research passes                                        │
    │  │  • 2-4 hours                                                │
    │  └─────────────────────────────────────────────────────────────┘
    │         │
    │         ▼
    │  ┌─────────────────────────────────────────────────────────────┐
    │  │  STAGE 5                    │  STAGE 6                      │
    │  │  CROSS-CUTTING              │  /feature-synthesis           │
    │  │                             │                               │
    │  │  • Accessibility patterns   │  • 156 requirements extracted │
    │  │  • Performance patterns     │  • Effort/impact scoring      │
    │  │  • UX conventions          │  • Dependency graph           │
    │  │                             │  • MVP definition             │
    │  │  30-60 min                  │  30-60 min                    │
    │  └─────────────────────────────┴───────────────────────────────┘
    │         │
    │         ▼
    │  ┌─────────────────────────────────────────────────────────────┐
    │  │                      STAGE 7                                │
    │  │                   /generate-prd                             │
    │  │                                                             │
    │  │  • 10 sections                                              │
    │  │  • 50+ acceptance criteria                                  │
    │  │  • Full technical architecture                              │
    │  │  • 7 generation passes                                      │
    │  │  • 30-60 min                                                │
    │  └─────────────────────────────────────────────────────────────┘
    │         │
    │         ▼
    │  ┌─────────────────────────────────────────────────────────────┐
    │  │                      STAGE 8                                │
    │  │                   /prd-to-ralph                             │
    │  │                                                             │
    │  │  • 25-50 user stories                                       │
    │  │  • 7 conversion passes                                      │
    │  │  • JSON validation                                          │
    │  │  • 15-30 min                                                │
    │  │                                                             │
    │  │  OUTPUT: prd.json → ralph-tui run --prd ./prd.json         │
    │  └─────────────────────────────────────────────────────────────┘
    │
    └──────── TOTAL: 5-8 hours for complete pipeline
```

---

## DETAILED STAGE SPECIFICATIONS

### STAGE 1: INTAKE & SCOPING (5-10 min)

**Purpose:** Parse user intent, clarify scope, define constraints

**Process:**
```
1. PARSE USER PROMPT
   - Extract subject matter (person, domain, technology)
   - Identify goal type (research, feature, product)
   - Note implied constraints

2. ASK CLARIFYING QUESTIONS (use AskUserQuestion)
   - "What is the primary goal?"
   - "Any topics/technologies to AVOID?"
   - "Target audience?"
   - "Timeline/scope constraints?"

3. DEFINE RESEARCH BOUNDARIES
   - In-scope topics
   - Out-of-scope topics
   - Hard constraints (e.g., "no references to X")

4. CREATE research-brief.md
```

**Output:** `research-brief.md`

**Gate:** User confirms scope before proceeding

---

### STAGE 2: DOMAIN RESEARCH (30-60 min)

**Purpose:** Build foundational understanding

**Process:**
```
2.1 SUBJECT RESEARCH
    - Background (person, company, history)
    - Expertise areas
    - Notable projects/publications
    - Public presence (GitHub, papers, talks)

    MINIMUM WEB SEARCHES: 3

2.2 INDUSTRY LANDSCAPE
    - Major players (5+)
    - Existing solutions
    - Market gaps
    - User pain points

    MINIMUM WEB SEARCHES: 3

2.3 TECHNOLOGY MAPPING
    - Current tech stack (project)
    - Relevant technologies
    - Integration possibilities
    - Technical constraints

    MINIMUM WEB SEARCHES: 2
```

**Output:** `domain-research.md`

**Minimum:** 8 web searches, 5 competitors identified

---

### STAGE 3: FEATURE IDEATION (15-30 min)

**Purpose:** Generate and filter potential features

**Process:**
```
3.1 BRAINSTORM
    - Generate 15-20 feature ideas
    - No filtering at this stage
    - Include ambitious ideas

3.2 FILTER
    - Apply constraints (remove forbidden topics)
    - Check technical feasibility
    - Assess alignment with goals

3.3 VALIDATE WITH USER
    - Present feature list
    - Get feedback on direction
    - Refine based on input
```

**Output:** `feature-list.md` with N approved features (typically 10-15)

**Gate:** User approves feature list before deep research

---

### STAGE 4: DEEP FEATURE RESEARCH (2-4 hours)

**Invokes:** `/deep-feature-research`

**Per-Feature Structure (42 subphases each):**
```
X.1 EXISTING SOLUTIONS (6 subphases)
    - What tools exist?
    - What approaches?
    - What limitations?
    - User complaints?
    - State of art?
    - CHECKPOINT

    REQUIRED: 3 web searches, 3 competitors

X.2 CUSTOMIZATION OPTIONS (7 subphases)
    - Parameters?
    - Presets?
    - UI patterns?
    - Accessibility?
    - Defaults?
    - Persistence?
    - CHECKPOINT

X.3 QUALITY IMPROVEMENTS (7 subphases)
    - Quality tiers?
    - Trade-offs?
    - Enhancement effects?
    - Progressive enhancement?
    - Publication quality?
    - Mobile considerations?
    - CHECKPOINT

X.4 MARKERS & ANNOTATIONS (7 subphases)
    - Labels?
    - Annotations?
    - Measurements?
    - Overlays?
    - Time-based?
    - Export?
    - CHECKPOINT

X.5 INTERACTION PATTERNS (7 subphases)
    - Click/tap?
    - Hover/focus?
    - Keyboard?
    - Touch/mobile?
    - Screen readers?
    - Multi-select?
    - CHECKPOINT

    REQUIRED: 2 web searches (a11y, interactions)

X.6 TECHNICAL POSSIBILITIES (7 subphases)
    - Implementation approaches (2+)?
    - Performance?
    - Browser compatibility?
    - Dependencies?
    - Memory/CPU?
    - Existing code?
    - CHECKPOINT

    REQUIRED: 2 web searches (implementation, libraries)

X.7 FEATURE SYNTHESIS (6 subphases)
    - Must-have (3+)
    - Nice-to-have (3+)
    - Future (2+)
    - Dependencies
    - Complexity (1-5)
    - GATE
```

**5 Research Passes:**
1. Pass 1: Existing Solutions (all features)
2. Pass 2: Customization & Quality (all features)
3. Pass 3: Interaction & Markers (all features)
4. Pass 4: Technical Feasibility (all features)
5. Pass 5: Synthesis & Cross-cutting

**Output:** `loop-state-feature-research.md`

**Totals for 12 features:**
- 504 subphases
- 216+ web searches
- 36+ competitors
- 12+ whitespace opportunities

---

### STAGE 5: CROSS-CUTTING RESEARCH (30-60 min)

**Purpose:** Extract patterns across features

**Process:**
```
AFTER all features researched:

5.1 ACCESSIBILITY PATTERNS
    - WCAG compliance requirements
    - Keyboard navigation patterns
    - Screen reader support
    - Color contrast (4.5:1 AA, 7:1 AAA)

5.2 PERFORMANCE PATTERNS
    - Target metrics (FPS, draw calls, memory)
    - Optimization techniques
    - Profiling tools

5.3 UX CONVENTIONS
    - Domain-standard patterns
    - Timeline/playback conventions (J/K/L)
    - Interaction standards

5.4 TECHNICAL PATTERNS
    - Shared libraries/utilities
    - State management patterns
    - Data flow patterns
```

**Output:** Cross-cutting section added to state file

---

### STAGE 6: SYNTHESIS & PRIORITIZATION (30-60 min)

**Invokes:** `/feature-synthesis`

**4 Synthesis Passes:**
```
PASS 1: REQUIREMENTS EXTRACTION
    Per feature:
    - 5+ must-have items
    - 5+ nice-to-have items
    - 3+ future items
    - 3+ technical notes

PASS 2: EFFORT/IMPACT SCORING
    Per feature:
    - Effort score (1-5) with justification
    - Impact score (1-5) with justification
    - Priority calculation: Impact × (6 - Effort)
    - Priority tier assignment (P0-P3)

PASS 3: DEPENDENCY ANALYSIS
    - Dependency matrix (all features)
    - Dependency graph (ASCII)
    - Critical path identification
    - Parallel opportunities

PASS 4: MVP DEFINITION
    - Core features (P0 + critical P1)
    - Success metrics with targets
    - Technical constraints
    - Out of scope items
    - Build order (phases)
```

**Output:** Synthesis section in state file

**Totals:**
- 60+ must-have requirements
- 60+ nice-to-have requirements
- 36+ future items
- 12 effort/impact assessments
- Complete dependency graph
- MVP definition

---

### STAGE 7: PRD GENERATION (30-60 min)

**Invokes:** `/generate-prd`

**7 Generation Passes:**
```
PASS 1: Executive & Problem (Sections 1-2)
    - Product name & tagline
    - Vision statement
    - Key differentiator
    - 3+ value propositions
    - 5+ pain points
    - 5+ user types

PASS 2: Goals & Metrics (Section 3)
    - 3-5 primary goals
    - 6+ success metrics with targets
    - Non-goals (explicit)

PASS 3: Feature Specifications (Section 4)
    Per MVP feature:
    - User story
    - 5+ acceptance criteria
    - Technical specifications
    - UI/UX requirements
    - Edge cases
    - Dependencies

PASS 4: UI Specifications (Section 5)
    - ASCII layout diagram
    - Responsive behavior
    - Component hierarchy
    - Component specifications
    - Interaction patterns
    - Keyboard shortcuts

PASS 5: Technical Architecture (Section 6)
    - Tech stack table
    - Data flow diagram
    - State management structure
    - File structure
    - API/data contracts
    - Performance architecture

PASS 6: Implementation Phases (Section 7)
    - 4+ phases
    - Tasks per phase with acceptance
    - Deliverables
    - Exit criteria
    - Duration estimates

PASS 7: Risks & Appendices (Sections 8-10)
    - 5+ risks with mitigations
    - Out of scope list
    - Data format specifications
    - Technical reference
    - Glossary
```

**Output:** Complete PRD document

**Totals:**
- 10 sections
- 50+ acceptance criteria
- Full technical architecture
- Complete implementation roadmap

---

### STAGE 8: RALPH-TUI CONVERSION (15-30 min)

**Invokes:** `/prd-to-ralph`

**7 Conversion Passes:**
```
PASS 1: Extract from PRD phases
PASS 2: Extract from feature specs
PASS 3: Order by dependencies
PASS 4: Assign priorities (1 to N, no gaps)
PASS 5: Write testable acceptance criteria
PASS 6: Generate JSON
PASS 7: Validate output
```

**Output:** `prd.json`

**Validation:**
- Valid JSON
- All required fields
- Unique IDs
- Sequential priorities
- All passes: false
- 25+ stories

**Ready for:**
```bash
ralph-tui run --prd ./prd.json
```

---

## STATE PERSISTENCE

All stages write to state files for resume capability:

```
.claude/
├── research-brief.md                 # Stage 1
├── domain-research.md                # Stage 2
├── feature-list.md                   # Stage 3
├── loop-state-feature-research.md    # Stages 4-6 (resumable)
└── prd-complete.md                   # Stage 7

prd.json                              # Stage 8 (ralph-tui ready)
```

---

## RESUME PROTOCOL

On `continue` command:

1. Read all state files
2. Find last completed stage/pass
3. Continue from next incomplete item
4. Update state file after each checkpoint
5. Commit state file after each stage

---

## QUALITY GATES

| Stage | Gate Condition |
|-------|----------------|
| 1 | User confirms scope |
| 2 | 8+ web searches, 5+ competitors |
| 3 | User approves feature list |
| 4 | 504 subphases, 216 searches, all checkpoints |
| 5 | Cross-cutting patterns extracted |
| 6 | 156 requirements, dependency graph, MVP |
| 7 | 10 sections, 50+ criteria |
| 8 | Valid JSON, 25+ stories |

---

## EXECUTION CHECKLIST

Before marking complete:

**Stage 4:**
- [ ] 504+ subphases documented
- [ ] 216+ web searches logged
- [ ] 36+ competitors analyzed
- [ ] 12+ whitespace opportunities
- [ ] All 5 passes complete
- [ ] All checkpoints passed

**Stage 6:**
- [ ] 60+ must-have requirements
- [ ] 60+ nice-to-have requirements
- [ ] 12 effort/impact scores
- [ ] Dependency matrix complete
- [ ] MVP defined

**Stage 7:**
- [ ] 10 PRD sections
- [ ] 50+ acceptance criteria
- [ ] UI specifications
- [ ] Technical architecture
- [ ] Implementation phases

**Stage 8:**
- [ ] 25+ user stories
- [ ] Valid JSON
- [ ] Sequential priorities
- [ ] Ready for ralph-tui

---

## TOTAL DURATION

| Stage | Duration |
|-------|----------|
| 1. Intake | 5-10 min |
| 2. Domain | 30-60 min |
| 3. Ideation | 15-30 min |
| 4. Deep Research | 2-4 hours |
| 5. Cross-cutting | 30-60 min |
| 6. Synthesis | 30-60 min |
| 7. PRD | 30-60 min |
| 8. Ralph | 15-30 min |
| **TOTAL** | **5-8 hours** |

---

## SKILL DEPENDENCIES

```
/research-to-prd (orchestrator)
    ├── /deep-feature-research (stage 4)
    ├── /feature-synthesis (stage 6)
    ├── /generate-prd (stage 7)
    └── /prd-to-ralph (stage 8)
```
