# Skill: /deep-feature-research

## Purpose
Execute exhaustive research on a list of features, generating 300+ subphases of investigation with web searches, competitor analysis, and technical feasibility assessment.

## Invocation
```
/deep-feature-research [feature-list.md or inline list]
```

## Inputs
- Feature list (N features)
- Constraints from research-brief.md
- Project context (tech stack, patterns)

## Process

### 1. Initialize State File

Create `loop-state-feature-research.md`:

```markdown
# Deep Feature Research: [Project Name]

## Session State (Auto-Resume)
**Last Updated**: [timestamp]
**Current Phase**: Feature 1
**Current Subphase**: 1.1.1
**Status**: IN_PROGRESS
**Sessions Used**: 1
**Subphases Completed**: 0

---

## RESEARCH STRUCTURE

This document contains deep research for N features with 7 subphase categories each:
- **X.1** Existing Solutions Research
- **X.2** Customization Options
- **X.3** Quality Improvements
- **X.4** Markers & Annotations
- **X.5** Interaction Patterns
- **X.6** Technical Possibilities
- **X.7** Feature Synthesis

Total: N features × ~25 subphases = **[total]+ subphases**
```

### 2. Generate Subphases for Each Feature

For each feature, generate the 7 categories:

```markdown
## FEATURE [N]: [FEATURE NAME]

### [N].1 EXISTING SOLUTIONS RESEARCH
[N].1.1 [ ] What tools currently do [feature]?
      → Research: [relevant tools, platforms]
[N].1.2 [ ] What approaches/techniques do they use?
      → [specific techniques to investigate]
[N].1.3 [ ] What are their limitations?
      → Pain points, gaps, user complaints
[N].1.4 [ ] What do users/researchers complain about?
      → Forums, reviews, papers
[N].1.5 [ ] What's the state of the art?
      → Academic papers, cutting edge
[N].1.6 [ ] CHECKPOINT: Landscape understood?

### [N].2 CUSTOMIZATION OPTIONS
[N].2.1 [ ] What parameters can be customized?
[N].2.2 [ ] What presets make sense?
[N].2.3 [ ] What's the customization UI pattern?
[N].2.4 [ ] Accessibility considerations?
[N].2.5 [ ] Sensible default values?
[N].2.6 [ ] User preferences persistence?
[N].2.7 [ ] CHECKPOINT: Customization spec complete?

### [N].3 QUALITY IMPROVEMENTS
[N].3.1 [ ] Visual quality tiers?
[N].3.2 [ ] Performance vs quality trade-offs?
[N].3.3 [ ] Enhancement effects?
[N].3.4 [ ] Progressive enhancement?
[N].3.5 [ ] Publication-quality output?
[N].3.6 [ ] Mobile quality considerations?
[N].3.7 [ ] CHECKPOINT: Quality options defined?

### [N].4 MARKERS & ANNOTATIONS
[N].4.1 [ ] What can be labeled?
[N].4.2 [ ] What can be annotated?
[N].4.3 [ ] Measurement tools needed?
[N].4.4 [ ] Data overlays?
[N].4.5 [ ] Time-based annotations?
[N].4.6 [ ] Export annotation data?
[N].4.7 [ ] CHECKPOINT: Annotation spec complete?

### [N].5 INTERACTION PATTERNS
[N].5.1 [ ] Click/tap interactions?
[N].5.2 [ ] Hover/focus interactions?
[N].5.3 [ ] Keyboard navigation?
[N].5.4 [ ] Touch/mobile gestures?
[N].5.5 [ ] Accessibility (screen readers)?
[N].5.6 [ ] Multi-select patterns?
[N].5.7 [ ] CHECKPOINT: Interaction spec complete?

### [N].6 TECHNICAL POSSIBILITIES
[N].6.1 [ ] Implementation approaches?
[N].6.2 [ ] Performance considerations?
[N].6.3 [ ] Browser/device compatibility?
[N].6.4 [ ] Dependencies needed?
[N].6.5 [ ] Memory/CPU constraints?
[N].6.6 [ ] Existing libraries to leverage?
[N].6.7 [ ] CHECKPOINT: Technical approach decided?

### [N].7 FEATURE SYNTHESIS
[N].7.1 [ ] Must-have capabilities
[N].7.2 [ ] Nice-to-have enhancements
[N].7.3 [ ] Future possibilities
[N].7.4 [ ] Dependencies on other features
[N].7.5 [ ] Complexity estimate (1-5)
[N].7.6 [ ] GATE: Ready for PRD?
```

### 3. Execute Research Passes

**Pass 1: Existing Solutions (all features)**
- WebSearch for each feature's X.1 subphases
- Document competitors, approaches, limitations
- Identify whitespace opportunities

**Pass 2: Customization & Quality (all features)**
- Research UI patterns for customization
- Identify quality levels and trade-offs
- Document best practices

**Pass 3: Interaction & Technical (all features)**
- Research interaction patterns (keyboard, touch, a11y)
- Assess technical feasibility
- Identify dependencies and libraries

**Pass 4: Synthesis (all features)**
- Compile must-have/nice-to-have/future lists
- Score complexity
- Check dependencies

### 4. Document Findings

After each web search, add to findings database:

```markdown
## RESEARCH FINDINGS DATABASE

### Feature [N]: [Name]

**Key Insight:** [Most important discovery]

**Existing Solutions:**
- [Tool 1]: [what it does, limitations]
- [Tool 2]: [what it does, limitations]

**Technical Findings:**
- [Library/approach]: [how it works]
- [Performance data]: [metrics]

**Whitespace Identified:**
- [Gap 1]: [opportunity]
- [Gap 2]: [opportunity]
```

### 5. Cross-Cutting Patterns

After all features researched, identify shared patterns:

```markdown
## CROSS-CUTTING RESEARCH FINDINGS

### Accessibility & Keyboard Navigation
[Patterns that apply to multiple features]

### Performance Optimization
[Shared performance techniques]

### UX Conventions
[Standard patterns in the domain]
```

## Outputs

1. **loop-state-feature-research.md** - Complete research state
2. **Research Findings Database** - Organized findings
3. **Cross-cutting Findings** - Shared patterns

## Resume Protocol

On `continue`:
1. Read state file
2. Find last completed subphase (marked `[x]`)
3. Continue from next `[ ]` subphase
4. Update session count and timestamp

## Quality Indicators

- [ ] All features have all 7 categories
- [ ] Each category has 6-7 subphases
- [ ] Web searches executed for key questions
- [ ] Findings documented in database
- [ ] Cross-cutting patterns identified
- [ ] Checkpoints/gates passed
