# Skill: /generate-prd

## Purpose
Generate a comprehensive Product Requirements Document from synthesized research findings.

## Invocation
```
/generate-prd [synthesis-output or state-file]
```

## Inputs
- Feature requirements (must/nice/future per feature)
- Priority matrix
- MVP definition
- Technical findings
- Project context

## PRD Template

```markdown
# Product Requirements Document (PRD)

## Document Information
| Field | Value |
|-------|-------|
| **Product Name** | [Name] |
| **Version** | 1.0 (MVP) |
| **Date** | [Date] |
| **Status** | Draft |
| **Author** | [Research Phase] |

---

## 1. Executive Summary

[Product Name] extends [existing product] with [capability]. The primary innovation is **[key differentiator]** - a feature that [competitive advantage]. This positions [product] as [market position].

**Key Value Proposition:**
- [Value 1]
- [Value 2]
- [Value 3]

---

## 2. Problem Statement

**Current Pain Points:**
1. [Pain point 1]
2. [Pain point 2]
3. [Pain point 3]

**Target Users:**
- [User type 1]
- [User type 2]
- [User type 3]

---

## 3. Goals & Success Metrics

**Primary Goals:**
1. [Goal 1]
2. [Goal 2]
3. [Goal 3]

**Success Metrics:**
| Metric | Target | Measurement |
|--------|--------|-------------|
| [Metric 1] | [Target] | [How measured] |
| [Metric 2] | [Target] | [How measured] |
| [Metric 3] | [Target] | [How measured] |

---

## 4. MVP Feature Specifications

### 4.1 [Feature Name] (P0)

**User Story:** As a [user type], I want [goal] so that [benefit].

**Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

**Technical Specifications:**
- [Tech detail 1]
- [Tech detail 2]

---

### 4.2 [Feature Name] (P0)

**User Story:** As a [user type], I want [goal] so that [benefit].

**Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]

**Technical Specifications:**
- [Tech detail 1]

---

[Repeat for each MVP feature]

---

## 5. User Interface Specifications

### 5.1 Layout

[ASCII diagram of layout]

### 5.2 Component Hierarchy

[Component tree]

### 5.3 Key Interactions

- [Interaction 1]: [Behavior]
- [Interaction 2]: [Behavior]

---

## 6. Technical Architecture

### 6.1 Data Flow

[Data flow diagram]

### 6.2 State Management

[State structure / store slices]

### 6.3 File Structure

[Directory structure]

---

## 7. Implementation Phases

### Phase 1: Foundation
- [ ] [Task 1]
- [ ] [Task 2]

### Phase 2: Core Features
- [ ] [Task 3]
- [ ] [Task 4]

### Phase 3: Polish
- [ ] [Task 5]
- [ ] [Task 6]

---

## 8. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| [Risk 1] | High | Medium | [Mitigation] |
| [Risk 2] | Medium | High | [Mitigation] |

---

## 9. Out of Scope

- [Item 1]
- [Item 2]
- [Item 3]

---

## 10. Appendices

### Appendix A: [Technical Details]
[Detailed technical information]

### Appendix B: [Data Formats]
[Example data structures]
```

## Generation Process

### Step 1: Executive Summary
- Extract key differentiator from research
- Summarize value proposition
- Position in market

### Step 2: Problem & Users
- Compile pain points from existing solutions research
- Define target user personas from domain research

### Step 3: Goals & Metrics
- Convert success criteria from MVP definition
- Make metrics measurable and specific

### Step 4: Feature Specifications
- One section per MVP feature
- User story format
- Acceptance criteria from must-have lists
- Technical notes from research

### Step 5: UI Specifications
- Create layout diagram (ASCII)
- Define component hierarchy
- Document key interactions

### Step 6: Technical Architecture
- Data flow from technical research
- State management plan
- File/folder structure

### Step 7: Implementation Phases
- Group tasks logically
- Follow dependency order
- Balance phase sizes

### Step 8: Risks
- Extract from technical feasibility research
- Add mitigations

### Step 9: Out of Scope
- List deferred features (P2, P3)
- Note future considerations

## Outputs

1. **Complete PRD document** (markdown)
2. **Feature specifications** with acceptance criteria
3. **Technical architecture** overview
4. **Implementation phases** breakdown

## Quality Checklist

- [ ] Executive summary is compelling
- [ ] All MVP features have specs
- [ ] Acceptance criteria are testable
- [ ] UI layout is clear
- [ ] Technical architecture is defined
- [ ] Phases are logical and balanced
- [ ] Risks have mitigations
- [ ] Out of scope is explicit
