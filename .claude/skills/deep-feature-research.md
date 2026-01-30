# Skill: /deep-feature-research

## Purpose
Execute exhaustive research on a list of features, generating **300+ subphases** of investigation with enforced web searches, competitor analysis, and technical feasibility assessment.

## Invocation
```
/deep-feature-research [feature-list.md or inline list]
```

---

## MANDATORY REQUIREMENTS

### Minimum Research Depth
| Requirement | Minimum | Per |
|-------------|---------|-----|
| Web searches | **3** | Per category (X.1-X.6) |
| Competitors documented | **3** | Per feature |
| Technical approaches | **2** | Per feature |
| Whitespace/gaps identified | **1** | Per feature |
| Subphases | **42** | Per feature (7 categories × 6 items) |

### For 12 Features
- **504 total subphases** minimum
- **216 web searches** minimum (12 × 6 categories × 3 searches)
- **36 competitors** documented
- **12 whitespace opportunities** identified

---

## RESEARCH PASS STRUCTURE

Research is executed in **5 mandatory passes**, not feature-by-feature:

### PASS 1: EXISTING SOLUTIONS (All Features)
```
FOR EACH FEATURE:
  Execute X.1 Existing Solutions Research

  REQUIRED WEB SEARCHES:
  1. "[feature] tools software" → Find existing products
  2. "[feature] open source github" → Find OSS solutions
  3. "[feature] limitations problems" → Find pain points

  REQUIRED OUTPUTS:
  - [ ] 3+ competitors identified with names
  - [ ] Each competitor's approach documented
  - [ ] Each competitor's limitations listed
  - [ ] User complaints/pain points collected
  - [ ] State of the art identified

  CHECKPOINT: Cannot proceed until all features have X.1 complete
```

### PASS 2: CUSTOMIZATION & QUALITY (All Features)
```
FOR EACH FEATURE:
  Execute X.2 Customization Options
  Execute X.3 Quality Improvements

  REQUIRED WEB SEARCHES:
  1. "[feature] customization options settings" → Find params
  2. "[feature] accessibility colorblind" → A11y options
  3. "[feature] quality levels performance" → Quality tiers
  4. "[feature] best practices UX" → Standards

  REQUIRED OUTPUTS:
  - [ ] Customizable parameters listed (min 5)
  - [ ] Preset options defined
  - [ ] Accessibility considerations documented
  - [ ] Quality tiers defined (low/medium/high)
  - [ ] Performance vs quality trade-offs noted

  CHECKPOINT: Cannot proceed until all features have X.2, X.3 complete
```

### PASS 3: INTERACTION & MARKERS (All Features)
```
FOR EACH FEATURE:
  Execute X.4 Markers & Annotations
  Execute X.5 Interaction Patterns

  REQUIRED WEB SEARCHES:
  1. "[feature] annotation labeling" → Marker patterns
  2. "[feature] keyboard shortcuts accessibility" → A11y
  3. "[feature] interaction design patterns" → UX standards
  4. "[feature] mobile touch gestures" → Mobile UX

  REQUIRED OUTPUTS:
  - [ ] What can be labeled/annotated
  - [ ] Measurement tools needed
  - [ ] Click/hover/keyboard interactions defined
  - [ ] Touch/mobile interactions defined
  - [ ] Screen reader support requirements

  CHECKPOINT: Cannot proceed until all features have X.4, X.5 complete
```

### PASS 4: TECHNICAL FEASIBILITY (All Features)
```
FOR EACH FEATURE:
  Execute X.6 Technical Possibilities

  REQUIRED WEB SEARCHES:
  1. "[feature] javascript implementation" → JS approaches
  2. "[feature] three.js webgl" → 3D-specific (if applicable)
  3. "[feature] performance optimization" → Performance
  4. "[feature] library npm package" → Existing libs

  REQUIRED OUTPUTS:
  - [ ] 2+ implementation approaches documented
  - [ ] Performance considerations listed
  - [ ] Browser compatibility noted
  - [ ] Dependencies/libraries identified
  - [ ] Memory/CPU constraints documented

  CHECKPOINT: Cannot proceed until all features have X.6 complete
```

### PASS 5: SYNTHESIS & CROSS-CUTTING (All Features)
```
FOR EACH FEATURE:
  Execute X.7 Feature Synthesis

  NO WEB SEARCHES - Compile from previous passes

  REQUIRED OUTPUTS:
  - [ ] Must-have list (min 3 items)
  - [ ] Nice-to-have list (min 3 items)
  - [ ] Future possibilities list (min 2 items)
  - [ ] Dependencies on other features
  - [ ] Complexity score (1-5)

THEN CROSS-CUTTING:
  Extract patterns that appear in 3+ features:
  - [ ] Accessibility patterns
  - [ ] Performance patterns
  - [ ] UX conventions
  - [ ] Technical patterns

  GATE: All features must have X.7 complete before proceeding to PRD
```

---

## STATE FILE FORMAT (MANDATORY)

```markdown
# Deep Feature Research: [Project Name]

## Session State (Auto-Resume)
**Last Updated**: [ISO timestamp]
**Current Pass**: [1-5]
**Current Feature**: [N of total]
**Current Category**: [X.Y]
**Current Subphase**: [X.Y.Z]
**Status**: IN_PROGRESS | PASS_COMPLETE | ALL_COMPLETE
**Sessions Used**: [count]

## Progress Summary
| Pass | Status | Features Complete |
|------|--------|-------------------|
| 1. Existing Solutions | [✓/In Progress/Pending] | [N/Total] |
| 2. Customization & Quality | [✓/In Progress/Pending] | [N/Total] |
| 3. Interaction & Markers | [✓/In Progress/Pending] | [N/Total] |
| 4. Technical Feasibility | [✓/In Progress/Pending] | [N/Total] |
| 5. Synthesis & Cross-cutting | [✓/In Progress/Pending] | [N/Total] |

## Web Search Log
| Timestamp | Feature | Query | Key Finding |
|-----------|---------|-------|-------------|
| [time] | [N] | "[query]" | [1-sentence finding] |

---

## FEATURE [N]: [NAME]

### [N].1 EXISTING SOLUTIONS RESEARCH

**Web Searches Executed:** [count]/3 required

#### [N].1.1 What tools currently do [feature]?
- **Query**: "[specific search query used]"
- **Finding**: [detailed finding]
- **Sources**: [URLs]

#### [N].1.2 What approaches do they use?
- **Query**: "[specific search query used]"
- **Finding**: [detailed finding]

#### [N].1.3 What are their limitations?
- **Query**: "[specific search query used]"
- **Finding**: [detailed finding]

#### [N].1.4 What do users complain about?
- **Finding**: [from forums, reviews]

#### [N].1.5 What's the state of the art?
- **Finding**: [cutting edge approaches]

#### [N].1.6 CHECKPOINT
- [x] 3+ competitors identified: [names]
- [x] Approaches documented
- [x] Limitations listed
- [x] Pain points collected
- [ ] State of art identified

**Category Complete:** [YES/NO]

---

[Repeat for X.2 through X.7]

---

## RESEARCH FINDINGS DATABASE

### Feature [N]: [Name]

**KEY INSIGHT:** [Single most important discovery - REQUIRED]

**COMPETITORS:**
| Name | Approach | Limitations |
|------|----------|-------------|
| [1] | [how it works] | [problems] |
| [2] | [how it works] | [problems] |
| [3] | [how it works] | [problems] |

**TECHNICAL APPROACHES:**
| Approach | Pros | Cons |
|----------|------|------|
| [1] | [benefits] | [drawbacks] |
| [2] | [benefits] | [drawbacks] |

**WHITESPACE IDENTIFIED:** [Gap in market - REQUIRED]

**LIBRARIES/DEPENDENCIES:**
- [library]: [what it provides]

---

## CROSS-CUTTING FINDINGS

### Accessibility Patterns (appears in [N] features)
- [Pattern 1]
- [Pattern 2]

### Performance Patterns (appears in [N] features)
- [Pattern 1]
- [Pattern 2]

### UX Conventions (appears in [N] features)
- [Pattern 1]
- [Pattern 2]

---

## QUALITY GATES

### Gate 1: Pass 1 Complete
- [ ] All features have X.1 complete
- [ ] 3+ competitors per feature documented
- [ ] Web search log has [N×3] entries

### Gate 2: Pass 2 Complete
- [ ] All features have X.2, X.3 complete
- [ ] Customization params defined per feature
- [ ] Quality tiers defined per feature

### Gate 3: Pass 3 Complete
- [ ] All features have X.4, X.5 complete
- [ ] Interaction patterns defined per feature
- [ ] Accessibility requirements documented

### Gate 4: Pass 4 Complete
- [ ] All features have X.6 complete
- [ ] 2+ technical approaches per feature
- [ ] Dependencies identified

### Gate 5: All Research Complete
- [ ] All features have X.7 complete
- [ ] Cross-cutting patterns extracted
- [ ] Findings database complete
- [ ] All whitespace opportunities identified
- [ ] READY FOR SYNTHESIS SKILL

---

## RESUME PROTOCOL

On `continue` command:

1. Read state file
2. Check "Current Pass" and "Current Feature"
3. Find last completed subphase (has findings documented)
4. Continue from next incomplete subphase
5. After completing a category, update checkpoint
6. After completing a pass, update Progress Summary
7. Commit state file after each feature category complete
```

---

## SUBPHASE TEMPLATES (ALL 42 PER FEATURE)

### X.1 Existing Solutions (6 subphases)
```
X.1.1 [ ] What tools currently do [feature]?
      → Search: "[feature] tools software platforms"
      → Document: Names, URLs, descriptions

X.1.2 [ ] What approaches/techniques do they use?
      → Search: "[feature] implementation approach technique"
      → Document: Methods, algorithms, patterns

X.1.3 [ ] What are their limitations?
      → Search: "[feature] problems limitations issues"
      → Document: Gaps, missing features, complaints

X.1.4 [ ] What do users/researchers complain about?
      → Search: "[feature] reddit forum review complaints"
      → Document: Pain points, frustrations

X.1.5 [ ] What's the state of the art?
      → Search: "[feature] latest research paper 2024 2025"
      → Document: Cutting edge, academic advances

X.1.6 [ ] CHECKPOINT: Landscape understood?
      → Verify: 3 competitors, approaches, limitations documented
```

### X.2 Customization Options (7 subphases)
```
X.2.1 [ ] What parameters can be customized?
      → List all adjustable settings

X.2.2 [ ] What presets make sense?
      → Define 3-5 preset configurations

X.2.3 [ ] What's the customization UI pattern?
      → Sliders, dropdowns, toggles, color pickers

X.2.4 [ ] Accessibility considerations?
      → Search: "[feature] accessibility WCAG"
      → Colorblind modes, keyboard control

X.2.5 [ ] Sensible default values?
      → Research common defaults in similar tools

X.2.6 [ ] User preferences persistence?
      → LocalStorage, URL params, account sync

X.2.7 [ ] CHECKPOINT: Customization spec complete?
      → Verify: All params listed, presets defined, a11y covered
```

### X.3 Quality Improvements (7 subphases)
```
X.3.1 [ ] Visual quality tiers?
      → Low (fast), Medium (balanced), High (beautiful)

X.3.2 [ ] Performance vs quality trade-offs?
      → What degrades at each tier

X.3.3 [ ] Enhancement effects?
      → Glow, shadows, anti-aliasing, post-processing

X.3.4 [ ] Progressive enhancement?
      → Start low, increase based on device capability

X.3.5 [ ] Publication-quality output?
      → High-res export, vector output, print settings

X.3.6 [ ] Mobile quality considerations?
      → Reduced quality for mobile/tablet

X.3.7 [ ] CHECKPOINT: Quality options defined?
      → Verify: Tiers defined, trade-offs documented
```

### X.4 Markers & Annotations (7 subphases)
```
X.4.1 [ ] What can be labeled?
      → Points, regions, objects, values

X.4.2 [ ] What can be annotated?
      → Text notes, arrows, highlights

X.4.3 [ ] Measurement tools needed?
      → Distance, angle, area, volume

X.4.4 [ ] Data overlays?
      → Graphs, charts, values on model

X.4.5 [ ] Time-based annotations?
      → Markers that appear at specific frames

X.4.6 [ ] Export annotation data?
      → JSON, CSV, image with annotations

X.4.7 [ ] CHECKPOINT: Annotation spec complete?
      → Verify: All annotation types defined
```

### X.5 Interaction Patterns (7 subphases)
```
X.5.1 [ ] Click/tap interactions?
      → Select, activate, toggle, drill-down

X.5.2 [ ] Hover/focus interactions?
      → Tooltips, highlights, previews

X.5.3 [ ] Keyboard navigation?
      → Search: "keyboard shortcuts [domain]"
      → Tab order, arrow keys, shortcuts

X.5.4 [ ] Touch/mobile gestures?
      → Pinch, swipe, long-press, multi-touch

X.5.5 [ ] Accessibility (screen readers)?
      → ARIA labels, focus management, announcements

X.5.6 [ ] Multi-select patterns?
      → Shift+click, Ctrl+click, lasso, select all

X.5.7 [ ] CHECKPOINT: Interaction spec complete?
      → Verify: All input methods covered
```

### X.6 Technical Possibilities (7 subphases)
```
X.6.1 [ ] Implementation approaches?
      → Search: "[feature] javascript implementation"
      → 2+ different approaches with trade-offs

X.6.2 [ ] Performance considerations?
      → Search: "[feature] performance optimization"
      → CPU, GPU, memory, network

X.6.3 [ ] Browser/device compatibility?
      → Chrome, Firefox, Safari, Edge, mobile

X.6.4 [ ] Dependencies needed?
      → Search: "[feature] npm library package"
      → List libraries with bundle sizes

X.6.5 [ ] Memory/CPU constraints?
      → Max data size, concurrent operations

X.6.6 [ ] Existing code to leverage?
      → Project patterns, utilities, components

X.6.7 [ ] CHECKPOINT: Technical approach decided?
      → Verify: Primary approach selected, deps listed
```

### X.7 Feature Synthesis (6 subphases)
```
X.7.1 [ ] Must-have capabilities (min 3)
      → Core functionality for MVP

X.7.2 [ ] Nice-to-have enhancements (min 3)
      → v1.1 improvements

X.7.3 [ ] Future possibilities (min 2)
      → Long-term vision

X.7.4 [ ] Dependencies on other features
      → What must be built first

X.7.5 [ ] Complexity estimate (1-5)
      → Based on technical research

X.7.6 [ ] GATE: Ready for PRD?
      → All synthesis items complete
```

---

## EXECUTION CHECKLIST

Before marking research complete:

- [ ] **504+ subphases** documented (42 × 12 features)
- [ ] **216+ web searches** logged with queries and findings
- [ ] **36+ competitors** in findings database
- [ ] **12+ whitespace opportunities** identified
- [ ] **All 5 passes** completed in order
- [ ] **All quality gates** passed
- [ ] **Cross-cutting patterns** extracted
- [ ] **State file** committed with full documentation
- [ ] **Ready for /feature-synthesis** skill
