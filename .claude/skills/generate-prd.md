# Skill: /generate-prd

## Purpose
Generate a **comprehensive PRD document** with 50+ sections covering all aspects from executive summary through technical architecture to implementation phases.

## Invocation
```
/generate-prd [synthesis-output or state-file]
```

---

## MANDATORY REQUIREMENTS

### Minimum PRD Depth
| Section | Minimum Items |
|---------|---------------|
| Executive Summary | 3 value propositions |
| Problem Statement | 5 pain points, 5 user types |
| Success Metrics | 6 metrics with targets |
| Feature Specs | 5 acceptance criteria per feature |
| UI Specs | Layout + component hierarchy + interactions |
| Technical Architecture | Data flow + state + file structure |
| Implementation Phases | 4+ phases with tasks |
| Risks | 5+ risks with mitigations |
| Appendices | Data formats + technical details |

### Total Document Size
- **10+ pages** equivalent content
- **50+ acceptance criteria** total
- **20+ technical specifications**
- **Complete implementation roadmap**

---

## PRD GENERATION PASSES

### PASS 1: EXECUTIVE & PROBLEM (Sections 1-2)
```
SECTION 1: EXECUTIVE SUMMARY

  REQUIRED CONTENT:

  **Product Name & Tagline:**
  [Name]: [One-line description]

  **Vision Statement (2-3 sentences):**
  [What the product is, why it matters, who it's for]

  **Key Differentiator:**
  "[Specific capability] that [competitive advantage] -
   [evidence from research showing no competitor does this]"

  **Value Propositions (minimum 3):**
  1. [Value 1 with specific benefit]
  2. [Value 2 with specific benefit]
  3. [Value 3 with specific benefit]

  **Target Release:**
  MVP: [version] - [scope summary]
  v1.1: [scope summary]

---

SECTION 2: PROBLEM STATEMENT

  **Current Pain Points (minimum 5):**
  1. [Pain point from research X.1.3/X.1.4]
     → Impact: [who is affected, how severely]
  2. [Pain point]
     → Impact: [description]
  3. [Pain point]
     → Impact: [description]
  4. [Pain point]
     → Impact: [description]
  5. [Pain point]
     → Impact: [description]

  **Target Users (minimum 5 with detail):**
  | User Type | Description | Primary Need | Pain Level |
  |-----------|-------------|--------------|------------|
  | [Type 1] | [who they are] | [what they need] | High/Med/Low |
  | [Type 2] | [who they are] | [what they need] | High/Med/Low |
  | [Type 3] | [who they are] | [what they need] | High/Med/Low |
  | [Type 4] | [who they are] | [what they need] | High/Med/Low |
  | [Type 5] | [who they are] | [what they need] | High/Med/Low |

  **Why Now:**
  - [Market timing reason]
  - [Technology enabler]
  - [Competitive window]

  CHECKPOINT: Executive + Problem complete
```

### PASS 2: GOALS & METRICS (Section 3)
```
SECTION 3: GOALS & SUCCESS METRICS

  **Primary Goals (3-5):**
  1. [Goal tied to value proposition 1]
  2. [Goal tied to value proposition 2]
  3. [Goal tied to value proposition 3]

  **Success Metrics (minimum 6 with specific targets):**

  | Category | Metric | Target | Measurement Method |
  |----------|--------|--------|-------------------|
  | Performance | Load time | <3 seconds | Lighthouse CI |
  | Performance | Frame rate | 60 FPS sustained | stats-gl monitor |
  | Performance | Memory usage | <500MB | DevTools heap |
  | Performance | Draw calls | <100 | renderer.info |
  | Usability | Task completion | >90% | User testing |
  | Usability | Time to first action | <30 seconds | Analytics |
  | Technical | Browser support | 95%+ modern | BrowserStack |
  | Technical | Accessibility | WCAG 2.1 AA | Axe audit |
  | Business | [metric] | [target] | [method] |

  **Non-Goals (explicit):**
  - [What we are NOT trying to achieve]
  - [What is explicitly out of scope]

  CHECKPOINT: Goals & Metrics complete
```

### PASS 3: FEATURE SPECIFICATIONS (Section 4)
```
SECTION 4: MVP FEATURE SPECIFICATIONS

FOR EACH MVP FEATURE:

  ### 4.N [Feature Name] (Priority: P[0-3])

  **User Story:**
  As a [specific user type from Section 2],
  I want [specific capability],
  So that [specific benefit tied to pain point].

  **Description:**
  [2-3 sentences explaining the feature in plain language]

  **Acceptance Criteria (minimum 5):**
  - [ ] [Criterion 1 - functional requirement]
  - [ ] [Criterion 2 - functional requirement]
  - [ ] [Criterion 3 - edge case handling]
  - [ ] [Criterion 4 - error state handling]
  - [ ] [Criterion 5 - performance requirement]

  **Technical Specifications:**
  - **Implementation Approach:** [from research X.6]
  - **Key Dependencies:** [libraries, APIs]
  - **Data Format:** [input/output format]
  - **Performance Target:** [specific metric]

  **UI/UX Requirements:**
  - **Location:** [where in the interface]
  - **Interaction:** [how user interacts]
  - **Feedback:** [what user sees/hears]

  **Edge Cases:**
  | Scenario | Expected Behavior |
  |----------|------------------|
  | [Edge case 1] | [How system handles it] |
  | [Edge case 2] | [How system handles it] |
  | [Edge case 3] | [How system handles it] |

  **Dependencies:**
  - Depends on: [Feature X] because [reason]
  - Enables: [Feature Y]

  ---

REPEAT FOR ALL MVP FEATURES

CHECKPOINT: All feature specs have 5+ acceptance criteria
```

### PASS 4: UI SPECIFICATIONS (Section 5)
```
SECTION 5: USER INTERFACE SPECIFICATIONS

  ### 5.1 Overall Layout

  **ASCII Layout Diagram:**
  ```
  ┌─────────────────────────────────────────────────────────────┐
  │  [Header Area - describe contents]                          │
  ├─────────────────────────────────────────────────────────────┤
  │                    │                                        │
  │  [Left Panel]      │       [Main Area]                      │
  │  - item 1          │       - primary content                │
  │  - item 2          │       - interactions                   │
  │                    │                                        │
  ├─────────────────────────────────────────────────────────────┤
  │  [Footer/Controls Area]                                     │
  └─────────────────────────────────────────────────────────────┘
  ```

  **Responsive Behavior:**
  | Breakpoint | Layout Change |
  |------------|---------------|
  | Desktop (>1024px) | [layout] |
  | Tablet (768-1024px) | [layout] |
  | Mobile (<768px) | [layout] |

  ### 5.2 Component Hierarchy

  ```
  app/
  └── [route]/
      └── page.tsx
          ├── [Component1]
          │   ├── [SubComponent1a]
          │   └── [SubComponent1b]
          ├── [Component2]
          │   ├── [SubComponent2a]
          │   │   └── [SubSubComponent]
          │   └── [SubComponent2b]
          └── [Component3]
              └── [SubComponent3a]
  ```

  ### 5.3 Component Specifications

  FOR EACH MAJOR COMPONENT:

  **[ComponentName]**
  - **Purpose:** [what it does]
  - **Props:**
    | Prop | Type | Required | Description |
    |------|------|----------|-------------|
    | [prop1] | [type] | Yes/No | [description] |
  - **State:** [what state it manages]
  - **Events:** [what events it emits]

  ### 5.4 Interaction Patterns

  | Action | Trigger | Response | Feedback |
  |--------|---------|----------|----------|
  | [Action 1] | [click/key/etc] | [what happens] | [visual/audio] |
  | [Action 2] | [trigger] | [response] | [feedback] |

  ### 5.5 Keyboard Shortcuts

  | Shortcut | Action | Context |
  |----------|--------|---------|
  | Space | [action] | [when available] |
  | Escape | [action] | [when available] |
  | [Key] | [action] | [context] |

  CHECKPOINT: UI specs complete with layout, hierarchy, interactions
```

### PASS 5: TECHNICAL ARCHITECTURE (Section 6)
```
SECTION 6: TECHNICAL ARCHITECTURE

  ### 6.1 System Overview

  **Tech Stack:**
  | Layer | Technology | Version | Purpose |
  |-------|------------|---------|---------|
  | Framework | [e.g., Next.js] | [version] | [why] |
  | UI | [e.g., React] | [version] | [why] |
  | 3D | [e.g., Three.js] | [version] | [why] |
  | State | [e.g., Zustand] | [version] | [why] |
  | Styling | [e.g., Tailwind] | [version] | [why] |

  ### 6.2 Data Flow

  ```
  [Input Source]
       │
       ▼
  [Processing Step 1] ──── [Description]
       │
       ▼
  [Processing Step 2] ──── [Description]
       │
       ▼
  [Store/State] ──── [What's stored]
       │
       ▼
  [Rendering] ──── [What's displayed]
  ```

  ### 6.3 State Management

  **Store Structure:**
  ```typescript
  interface [StoreName]State {
    // Data
    [property1]: [Type];
    [property2]: [Type];

    // UI State
    [uiProperty1]: boolean;
    [uiProperty2]: string;

    // Actions
    [action1]: (param: Type) => void;
    [action2]: () => void;
  }
  ```

  **State Slices:**
  | Slice | Purpose | Persisted |
  |-------|---------|-----------|
  | [slice1] | [what it holds] | Yes/No |
  | [slice2] | [what it holds] | Yes/No |

  ### 6.4 File Structure

  ```
  src/
  ├── app/
  │   └── [route]/
  │       └── page.tsx
  ├── components/
  │   └── [feature]/
  │       ├── [Component1].tsx
  │       ├── [Component2].tsx
  │       └── index.ts
  ├── hooks/
  │   ├── use-[hook1].ts
  │   └── use-[hook2].ts
  ├── lib/
  │   ├── [utility]/
  │   │   └── index.ts
  │   └── store/
  │       └── [store-name].ts
  └── types/
      └── [types-file].ts
  ```

  ### 6.5 API/Data Contracts

  **Input Formats:**
  ```typescript
  interface [InputFormat] {
    [field]: [type];
  }
  ```

  **Output Formats:**
  ```typescript
  interface [OutputFormat] {
    [field]: [type];
  }
  ```

  ### 6.6 Performance Architecture

  | Concern | Strategy | Target |
  |---------|----------|--------|
  | Rendering | [approach] | [metric] |
  | Memory | [approach] | [metric] |
  | Loading | [approach] | [metric] |

  CHECKPOINT: Technical architecture complete
```

### PASS 6: IMPLEMENTATION PHASES (Section 7)
```
SECTION 7: IMPLEMENTATION PHASES

  ### Phase 1: Foundation
  **Duration:** [estimate]
  **Goal:** [what this phase achieves]

  **Tasks:**
  | # | Task | Description | Acceptance |
  |---|------|-------------|------------|
  | 1.1 | [Task] | [detail] | [how to verify] |
  | 1.2 | [Task] | [detail] | [how to verify] |
  | 1.3 | [Task] | [detail] | [how to verify] |

  **Deliverables:**
  - [What exists at end of phase]

  **Exit Criteria:**
  - [ ] [Criterion 1]
  - [ ] [Criterion 2]

  ---

  ### Phase 2: Core Features
  **Duration:** [estimate]
  **Goal:** [what this phase achieves]

  **Tasks:**
  | # | Task | Description | Acceptance |
  |---|------|-------------|------------|
  | 2.1 | [Task] | [detail] | [how to verify] |
  | 2.2 | [Task] | [detail] | [how to verify] |

  **Dependencies:** Requires Phase 1 complete

  **Exit Criteria:**
  - [ ] [Criterion 1]
  - [ ] [Criterion 2]

  ---

  [REPEAT FOR ALL PHASES]

  ### Phase Summary

  | Phase | Duration | Key Deliverable |
  |-------|----------|-----------------|
  | 1. Foundation | [time] | [deliverable] |
  | 2. Core Features | [time] | [deliverable] |
  | 3. [Name] | [time] | [deliverable] |
  | 4. Polish | [time] | [deliverable] |

  **Total Estimated Duration:** [sum]

  CHECKPOINT: All phases defined with tasks and criteria
```

### PASS 7: RISKS & APPENDICES (Sections 8-10)
```
SECTION 8: RISKS & MITIGATIONS

  | # | Risk | Impact | Likelihood | Mitigation | Owner |
  |---|------|--------|------------|------------|-------|
  | 1 | [Risk from technical research] | High/Med/Low | High/Med/Low | [Strategy] | [Role] |
  | 2 | [Risk] | [Impact] | [Likelihood] | [Strategy] | [Role] |
  | 3 | [Risk] | [Impact] | [Likelihood] | [Strategy] | [Role] |
  | 4 | [Risk] | [Impact] | [Likelihood] | [Strategy] | [Role] |
  | 5 | [Risk] | [Impact] | [Likelihood] | [Strategy] | [Role] |

  **Contingency Plans:**
  - If [Risk 1] occurs: [Contingency]
  - If [Risk 2] occurs: [Contingency]

---

SECTION 9: OUT OF SCOPE

  **Explicitly Deferred:**
  | Feature | Reason | Target Version |
  |---------|--------|----------------|
  | [Feature] | [Why deferred] | v1.1 |
  | [Feature] | [Why deferred] | v2.0 |
  | [Feature] | [Why deferred] | Future |

  **Not Planned:**
  - [Thing we will never do and why]

---

SECTION 10: APPENDICES

  ### Appendix A: Data Format Specifications

  **[Format Name]:**
  ```json
  {
    "field1": "type and description",
    "field2": "type and description"
  }
  ```

  **Example:**
  ```json
  {
    "example": "data"
  }
  ```

  ### Appendix B: Technical Reference

  **[Topic]:**
  [Detailed technical information]

  **[Topic]:**
  [Detailed technical information]

  ### Appendix C: Glossary

  | Term | Definition |
  |------|------------|
  | [Term 1] | [Definition] |
  | [Term 2] | [Definition] |

  CHECKPOINT: All sections complete
```

---

## STATE FILE FORMAT

```markdown
# PRD Generation: [Project Name]

## Session State
**Last Updated**: [timestamp]
**Current Pass**: [1-7]
**Current Section**: [N]
**Status**: IN_PROGRESS | COMPLETE

## Progress
| Pass | Sections | Status |
|------|----------|--------|
| 1 | Executive, Problem | [✓/In Progress] |
| 2 | Goals & Metrics | [✓/In Progress] |
| 3 | Feature Specs | [✓/In Progress] |
| 4 | UI Specs | [✓/In Progress] |
| 5 | Technical Arch | [✓/In Progress] |
| 6 | Implementation | [✓/In Progress] |
| 7 | Risks & Appendices | [✓/In Progress] |

## Quality Gates
- [ ] Executive has 3+ value propositions
- [ ] Problem has 5+ pain points, 5+ user types
- [ ] Metrics has 6+ with specific targets
- [ ] Each feature has 5+ acceptance criteria
- [ ] UI has layout + hierarchy + interactions
- [ ] Architecture has data flow + state + files
- [ ] 4+ implementation phases with tasks
- [ ] 5+ risks with mitigations
- [ ] Appendices have data formats
```

---

## EXECUTION CHECKLIST

Before marking PRD complete:

- [ ] **10 sections** complete
- [ ] **3+ value propositions** in executive summary
- [ ] **5+ pain points** with impact
- [ ] **5+ user types** with details
- [ ] **6+ success metrics** with targets
- [ ] **5+ acceptance criteria** per feature
- [ ] **UI layout** with ASCII diagram
- [ ] **Component hierarchy** complete
- [ ] **Interaction patterns** documented
- [ ] **Data flow** diagram
- [ ] **State structure** defined
- [ ] **File structure** specified
- [ ] **4+ implementation phases**
- [ ] **5+ risks** with mitigations
- [ ] **Data formats** in appendices
- [ ] **All quality gates** passed
- [ ] **Ready for /prd-to-ralph**
