# Skill: /research-to-prd

## Master Orchestration Skill for Deep Research → PRD → Ralph-tui Implementation

This skill orchestrates the complete pipeline from an initial research prompt through deep investigation to a production-ready PRD and ralph-tui compatible implementation plan.

---

## CONVERSATION FLOW ANALYSIS

### What We Did (Chronological)

```
USER PROMPT
    ↓
"Research Vittorio Caggiano and biomechanics visualization opportunities"
    ↓
PHASE 1: SUBJECT RESEARCH
├── Background research (person, company, projects)
├── Domain expertise identification
├── Technology landscape mapping
└── User feedback: "too superficial"
    ↓
PHASE 2: FEATURE IDEATION
├── Brainstorm potential features
├── Initial list of 12 features
├── User feedback: "no MyoSuite references"
└── Cleaned and revised feature list
    ↓
PHASE 3: DEEP RESEARCH STRUCTURE
├── Created 7 subphase categories per feature
├── 12 features × 25 subphases = 300+ items
├── Categories: Existing Solutions, Customization, Quality,
│   Markers, Interaction, Technical, Synthesis
└── State file for resume capability
    ↓
PHASE 4: DEEP RESEARCH EXECUTION
├── Pass 1: Web searches for each feature
├── Competitor analysis (OpenSim, BioDigital, etc.)
├── Technical feasibility research (Three.js, WebGL)
├── Pass 2: Interaction patterns, accessibility, UX
├── Cross-cutting findings (shared patterns)
└── Key insight: NO web tool does dynamic muscle activation
    ↓
PHASE 5: SYNTHESIS
├── Must-have / Nice-to-have / Future per feature
├── Priority matrix (P0-P3 tiers)
├── Dependency graph
├── MVP definition
└── Effort/Impact scoring
    ↓
PHASE 6: PRD CREATION
├── Executive summary
├── Problem statement
├── Goals & success metrics
├── Feature specifications + acceptance criteria
├── UI specifications
├── Technical architecture
├── Implementation phases
└── Risks & mitigations
    ↓
PHASE 7: RALPH-TUI CONVERSION
├── Research ralph-tui prd.json format
├── Convert PRD to userStories array
├── Priority ordering
└── Acceptance criteria per story
    ↓
OUTPUT: prd.json ready for `ralph-tui run`
```

---

## MASTER WORKFLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         /research-to-prd                                    │
│                    Master Orchestrator Skill                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 1: INTAKE & SCOPING                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                     │
│  │ Parse User  │───▶│  Clarify    │───▶│   Define    │                     │
│  │   Prompt    │    │   Scope     │    │ Constraints │                     │
│  └─────────────┘    └─────────────┘    └─────────────┘                     │
│         │                  │                  │                             │
│         └──────────────────┴──────────────────┘                             │
│                            │                                                │
│                            ▼                                                │
│                   [research-brief.md]                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 2: DOMAIN RESEARCH                          /deep-domain-research   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                     │
│  │  Subject    │───▶│  Industry   │───▶│ Technology  │                     │
│  │  Research   │    │  Landscape  │    │   Mapping   │                     │
│  └─────────────┘    └─────────────┘    └─────────────┘                     │
│         │                  │                  │                             │
│         ▼                  ▼                  ▼                             │
│  [Person/Company]   [Competitors]      [Tech Stack]                        │
│                            │                                                │
│                            ▼                                                │
│                   [domain-research.md]                                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 3: FEATURE IDEATION                          /feature-ideation      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                     │
│  │ Brainstorm  │───▶│   Filter    │───▶│  Validate   │                     │
│  │  Features   │    │ Constraints │    │  with User  │                     │
│  └─────────────┘    └─────────────┘    └─────────────┘                     │
│         │                  │                  │                             │
│         └──────────────────┴──────────────────┘                             │
│                            │                                                │
│                            ▼                                                │
│                   [feature-list.md]                                         │
│                   (N features identified)                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 4: DEEP FEATURE RESEARCH                   /deep-feature-research   │
│                                                                             │
│  FOR EACH FEATURE (parallel where possible):                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │ Existing │  │Customize │  │ Quality  │  │ Markers  │            │   │
│  │  │Solutions │  │ Options  │  │Improvmts │  │ Annotate │            │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │   │
│  │       │             │             │             │                   │   │
│  │  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐                          │   │
│  │  │Interact  │  │Technical │  │Synthesis │                          │   │
│  │  │Patterns  │  │Possible  │  │(Summary) │                          │   │
│  │  └──────────┘  └──────────┘  └──────────┘                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                            │                                                │
│                            ▼                                                │
│             [loop-state-feature-research.md]                               │
│             (300+ subphases with findings)                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 5: CROSS-CUTTING RESEARCH                 /cross-cutting-research   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                     │
│  │Accessibility│───▶│ Performance │───▶│    UX       │                     │
│  │  Patterns   │    │  Patterns   │    │  Patterns   │                     │
│  └─────────────┘    └─────────────┘    └─────────────┘                     │
│         │                  │                  │                             │
│         └──────────────────┴──────────────────┘                             │
│                            │                                                │
│                            ▼                                                │
│            [Cross-cutting findings added to state]                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 6: SYNTHESIS & PRIORITIZATION               /feature-synthesis      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                     │
│  │ Must-Have   │───▶│  Priority   │───▶│ Dependency  │                     │
│  │Nice-to-Have │    │   Matrix    │    │   Graph     │                     │
│  │   Future    │    │  (P0-P3)    │    │             │                     │
│  └─────────────┘    └─────────────┘    └─────────────┘                     │
│         │                  │                  │                             │
│         └──────────────────┴──────────────────┘                             │
│                            │                                                │
│                            ▼                                                │
│                   [MVP Definition]                                          │
│                   [Effort/Impact Scores]                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 7: PRD GENERATION                              /generate-prd        │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                     │
│  │  Executive  │───▶│  Feature    │───▶│  Technical  │                     │
│  │  Summary    │    │   Specs     │    │Architecture │                     │
│  └─────────────┘    └─────────────┘    └─────────────┘                     │
│         │                  │                  │                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                     │
│  │     UI      │───▶│   Phases    │───▶│   Risks     │                     │
│  │   Specs     │    │  (Sprints)  │    │Mitigations  │                     │
│  └─────────────┘    └─────────────┘    └─────────────┘                     │
│                            │                                                │
│                            ▼                                                │
│                   [Complete PRD Document]                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 8: RALPH-TUI CONVERSION                      /prd-to-ralph         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                     │
│  │  Extract    │───▶│  Generate   │───▶│  Validate   │                     │
│  │   Tasks     │    │ userStories │    │   Format    │                     │
│  └─────────────┘    └─────────────┘    └─────────────┘                     │
│                            │                                                │
│                            ▼                                                │
│                      [prd.json]                                             │
│                                                                             │
│  Ready for: ralph-tui run --prd ./prd.json                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## DETAILED STAGE BREAKDOWN

### STAGE 1: INTAKE & SCOPING

**Purpose:** Understand user intent, clarify scope, identify constraints

**Inputs:**
- User's initial prompt
- Project context (CLAUDE.md, existing code)

**Process:**
```
1. Parse user prompt for:
   - Subject matter (person, domain, technology)
   - Goal type (research, feature, product)
   - Implied constraints

2. Ask clarifying questions:
   - "What is the primary goal?"
   - "Any topics/technologies to avoid?"
   - "Target audience?"
   - "Timeline/scope constraints?"

3. Define research boundaries:
   - In-scope topics
   - Out-of-scope topics
   - Hard constraints (e.g., "no MyoSuite")
```

**Outputs:**
- `research-brief.md` with scope, constraints, goals

**Gate:** User confirms scope before proceeding

---

### STAGE 2: DOMAIN RESEARCH

**Purpose:** Build foundational understanding of the domain

**Inputs:**
- research-brief.md
- Subject/domain from user prompt

**Subphases:**
```
2.1 Subject Research
    - Background (person, company, history)
    - Expertise areas
    - Notable projects/publications
    - Public presence (GitHub, papers, talks)

2.2 Industry Landscape
    - Major players
    - Existing solutions
    - Market gaps
    - User pain points

2.3 Technology Mapping
    - Current tech stack (project)
    - Relevant technologies
    - Integration possibilities
    - Technical constraints
```

**Tools Used:**
- WebSearch for background research
- WebFetch for detailed page analysis
- Task(Explore) for codebase context

**Outputs:**
- `domain-research.md` with findings

---

### STAGE 3: FEATURE IDEATION

**Purpose:** Generate and filter potential features

**Inputs:**
- domain-research.md
- research-brief.md (constraints)

**Process:**
```
3.1 Brainstorm
    - Generate 15-20 feature ideas
    - No filtering at this stage
    - Include wild ideas

3.2 Filter
    - Apply constraints (remove forbidden topics)
    - Check technical feasibility
    - Assess alignment with goals

3.3 Validate
    - Present feature list to user
    - Get feedback on direction
    - Refine based on input
```

**Outputs:**
- `feature-list.md` with N approved features

**Gate:** User approves feature list before deep research

---

### STAGE 4: DEEP FEATURE RESEARCH

**Purpose:** Exhaustively research each feature

**Inputs:**
- feature-list.md
- N features to investigate

**Structure (per feature):**
```
X.1 Existing Solutions Research
    X.1.1 What tools currently do this?
    X.1.2 What approaches do they use?
    X.1.3 What are their limitations?
    X.1.4 What do users complain about?
    X.1.5 What's the state of the art?
    X.1.6 CHECKPOINT: Landscape understood?

X.2 Customization Options
    X.2.1 What parameters can be customized?
    X.2.2 What presets make sense?
    X.2.3 What's the customization UI?
    X.2.4 Accessibility considerations?
    X.2.5 Default values?
    X.2.6 CHECKPOINT: Customization spec complete?

X.3 Quality Improvements
    X.3.1 Visual quality options
    X.3.2 Performance quality trade-offs
    X.3.3 Fidelity levels
    X.3.4 Enhancement effects
    X.3.5 Publication-quality output
    X.3.6 CHECKPOINT: Quality spec complete?

X.4 Markers & Annotations
    X.4.1 What can be labeled?
    X.4.2 What can be annotated?
    X.4.3 Measurement tools?
    X.4.4 Data overlays?
    X.4.5 Export options?
    X.4.6 CHECKPOINT: Annotation spec complete?

X.5 Interaction Patterns
    X.5.1 Click interactions
    X.5.2 Hover interactions
    X.5.3 Keyboard navigation
    X.5.4 Touch/mobile
    X.5.5 Accessibility (screen readers)
    X.5.6 CHECKPOINT: Interaction spec complete?

X.6 Technical Possibilities
    X.6.1 Implementation approaches
    X.6.2 Performance considerations
    X.6.3 Browser compatibility
    X.6.4 Dependencies needed
    X.6.5 Memory/CPU constraints
    X.6.6 CHECKPOINT: Technical approach decided?

X.7 Feature Synthesis
    X.7.1 Must-have capabilities
    X.7.2 Nice-to-have enhancements
    X.7.3 Future possibilities
    X.7.4 Dependencies on other features
    X.7.5 Complexity estimate (1-5)
    X.7.6 GATE: Ready for PRD?
```

**Total:** N features × 7 categories × ~6 items = ~42N subphases

**State File Format:**
```markdown
# Deep Feature Research: [Project Name]

## Session State
Last Updated: [timestamp]
Current Feature: [N]
Current Subphase: [X.Y.Z]
Status: IN_PROGRESS

## Feature 1: [Name]
### 1.1 Existing Solutions
1.1.1 [x] Question → Finding
1.1.2 [ ] Question
...
```

**Outputs:**
- `loop-state-feature-research.md` (resumable)
- Findings database per feature

---

### STAGE 5: CROSS-CUTTING RESEARCH

**Purpose:** Identify patterns that apply across all features

**Topics:**
```
5.1 Accessibility Patterns
    - WCAG compliance
    - Keyboard navigation
    - Screen reader support
    - Color contrast requirements

5.2 Performance Patterns
    - Target metrics (FPS, draw calls, memory)
    - Optimization techniques
    - Profiling tools

5.3 UX Patterns
    - Common UI patterns for domain
    - Timeline/playback conventions
    - Interaction standards (J/K/L, Space)

5.4 Technical Patterns
    - Shared libraries/utilities
    - State management patterns
    - Data flow patterns
```

**Outputs:**
- Cross-cutting findings added to state file

---

### STAGE 6: SYNTHESIS & PRIORITIZATION

**Purpose:** Convert research into actionable requirements

**Process:**
```
6.1 Per-Feature Requirements
    - Extract must-have list
    - Extract nice-to-have list
    - Extract future possibilities

6.2 Priority Matrix
    ┌──────────┬────────────┬──────────────────────┐
    │ Tier     │ Criteria   │ Features             │
    ├──────────┼────────────┼──────────────────────┤
    │ P0       │ Core value │ Differentiators      │
    │ P1       │ Expected   │ Table stakes         │
    │ P2       │ Growth     │ Expansion            │
    │ P3       │ Platform   │ Ecosystem            │
    └──────────┴────────────┴──────────────────────┘

6.3 Dependency Graph
    - Which features depend on others?
    - What's the build order?
    - What can be parallelized?

6.4 MVP Definition
    - Core features only
    - Success metrics
    - Out of scope
```

**Outputs:**
- Priority matrix
- Dependency graph
- MVP definition

---

### STAGE 7: PRD GENERATION

**Purpose:** Create comprehensive PRD document

**Template:**
```markdown
# Product Requirements Document

## 1. Executive Summary
- Product name
- One-paragraph description
- Key value proposition

## 2. Problem Statement
- Current pain points
- Target users
- Why now?

## 3. Goals & Success Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| ...    | ...    | ...         |

## 4. Feature Specifications
### 4.1 [Feature Name]
**User Story:** As a [user], I want [goal] so that [benefit]
**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
**Technical Notes:**
- Implementation approach
- Dependencies

## 5. UI Specifications
- Layout diagrams
- Component hierarchy
- Interaction patterns

## 6. Technical Architecture
- Data flow
- State management
- File structure

## 7. Implementation Phases
- Phase 1: [scope, duration]
- Phase 2: [scope, duration]
- ...

## 8. Risks & Mitigations
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|

## 9. Out of Scope
- What's NOT included
- Future considerations
```

**Outputs:**
- Complete PRD document

---

### STAGE 8: RALPH-TUI CONVERSION

**Purpose:** Convert PRD to ralph-tui compatible format

**prd.json Format:**
```json
{
  "branchName": "feature-name",
  "userStories": [
    {
      "id": "phase-task",
      "title": "Task description",
      "passes": false,
      "priority": 1,
      "acceptanceCriteria": "What validates completion"
    }
  ]
}
```

**Conversion Rules:**
```
1. Each PRD acceptance criterion → one userStory
2. Priority = execution order (1 = first)
3. Group by phase for logical ordering
4. Title = imperative action ("Create...", "Add...", "Implement...")
5. acceptanceCriteria = testable condition
```

**Outputs:**
- `prd.json` ready for ralph-tui

---

## SKILL INVOCATION

### Master Command

```
/research-to-prd [initial prompt]
```

**Example:**
```
/research-to-prd "Research biomechanics visualization opportunities
inspired by Vittorio Caggiano's work. Create features for MeshMotion
that would appeal to researchers and educators."
```

### Stage-Specific Commands

```
/deep-domain-research [subject]
/feature-ideation [domain-research.md]
/deep-feature-research [feature-list.md]
/cross-cutting-research [state-file.md]
/feature-synthesis [state-file.md]
/generate-prd [synthesis-output]
/prd-to-ralph [prd-document.md]
```

---

## STATE PERSISTENCE

All stages write to state files for resume capability:

```
.claude/
├── research-brief.md           # Stage 1 output
├── domain-research.md          # Stage 2 output
├── feature-list.md             # Stage 3 output
├── loop-state-feature-research.md  # Stage 4-5 output (resumable)
└── prd-complete.md             # Stage 6-7 output

prd.json                        # Stage 8 output (ralph-tui ready)
```

---

## ERROR HANDLING

### User Feedback Integration

At any stage, user can redirect:
- "This is too superficial" → Increase depth, add subphases
- "Remove X references" → Apply constraint, clean history
- "Focus on Y instead" → Adjust scope, re-prioritize

### Resume Protocol

If context runs out:
1. Save current state to file
2. Mark progress (checkboxes, timestamps)
3. On resume, read state file
4. Continue from last checkpoint

---

## QUALITY GATES

Each stage has a gate before proceeding:

| Stage | Gate Condition |
|-------|----------------|
| 1 | User confirms scope |
| 2 | Domain understanding validated |
| 3 | User approves feature list |
| 4 | All feature subphases complete |
| 5 | Cross-cutting patterns identified |
| 6 | MVP defined, priorities set |
| 7 | PRD reviewed (optional) |
| 8 | prd.json validates |

---

## ESTIMATED DURATION

| Stage | Typical Duration | Parallelizable |
|-------|------------------|----------------|
| 1. Intake | 5-10 min | No |
| 2. Domain Research | 30-60 min | Partially |
| 3. Feature Ideation | 15-30 min | No |
| 4. Deep Research | 2-4 hours | Yes (features) |
| 5. Cross-Cutting | 30-60 min | Yes (topics) |
| 6. Synthesis | 30-60 min | No |
| 7. PRD Generation | 30-60 min | No |
| 8. Ralph Conversion | 15-30 min | No |

**Total:** 5-8 hours for comprehensive research-to-implementation

---

## IMPLEMENTATION NOTES

### This Skill Should:
1. Use TodoWrite extensively for progress tracking
2. Commit state files regularly
3. Ask clarifying questions early (Stage 1)
4. Not ask questions after Stage 3 (use state file)
5. Support `continue` command at any point
6. Produce ralph-tui compatible output

### This Skill Should NOT:
1. Skip the deep research phases
2. Make assumptions without validation
3. Proceed without user confirmation at gates
4. Lose progress on context overflow
