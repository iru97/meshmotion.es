# Skill: /prd-to-ralph

## Purpose
Convert a comprehensive PRD into **ralph-tui compatible prd.json** with 25-50+ user stories, proper prioritization, and testable acceptance criteria.

## Invocation
```
/prd-to-ralph [prd-document.md]
```

---

## MANDATORY REQUIREMENTS

### Minimum Conversion Depth
| Requirement | Minimum |
|-------------|---------|
| User stories | **25** |
| Acceptance criteria per story | **1 testable sentence** |
| Priority coverage | **All priorities 1-N sequential** |
| Task granularity | **Completable in 1 Claude iteration** |

### Output Validation
- Valid JSON (parseable by `jq`)
- All required fields present
- No duplicate IDs
- Sequential priorities (no gaps)
- All `passes: false` initially

---

## CONVERSION PASS STRUCTURE

### PASS 1: EXTRACT TASKS FROM PRD
```
SOURCE: Section 7 (Implementation Phases)

FOR EACH PHASE:
  FOR EACH TASK:
    Extract:
    - Task description → title
    - Acceptance criteria → acceptanceCriteria
    - Phase number → id prefix

  EXAMPLE EXTRACTION:

  PRD Section 7:
  ```
  ### Phase 1: Foundation
  | # | Task | Description | Acceptance |
  | 1.1 | Create route | Create /app/biomechanics/page.tsx | Route renders without errors |
  ```

  Becomes:
  ```json
  {
    "id": "foundation-1",
    "title": "Create /app/biomechanics/page.tsx route",
    "acceptanceCriteria": "Route exists and renders without errors. Uses 'use client' directive."
  }
  ```

CHECKPOINT: All phase tasks extracted
```

### PASS 2: EXTRACT FROM FEATURE SPECS
```
SOURCE: Section 4 (Feature Specifications)

FOR EACH FEATURE:
  FOR EACH ACCEPTANCE CRITERION:
    Determine if it needs its own task or groups with others

  GROUPING RULES:
  - Same component → combine
  - Different files → separate
  - < 30 min work → can combine
  - > 2 hours work → must split

  EXAMPLE:

  PRD Feature Spec:
  ```
  ### 4.1 Muscle Heatmap
  Acceptance Criteria:
  - [ ] Muscle regions colored by activation level
  - [ ] Colors update with animation playback
  - [ ] Default colormap is viridis
  - [ ] Legend shows scale
  - [ ] Toggle on/off
  ```

  Becomes multiple tasks:
  ```json
  [
    {
      "id": "viz-1",
      "title": "Create lib/colormaps/index.ts with viridis colormap",
      "acceptanceCriteria": "Exports viridis function taking 0-1 value, returns THREE.Color."
    },
    {
      "id": "viz-2",
      "title": "Create MuscleHeatmap.tsx with vertex color rendering",
      "acceptanceCriteria": "Component applies activation values as vertex colors. Uses viridis colormap."
    },
    {
      "id": "viz-3",
      "title": "Add activation legend component",
      "acceptanceCriteria": "Shows gradient bar with 0-1 scale. Matches current colormap."
    },
    {
      "id": "viz-4",
      "title": "Sync heatmap updates with playback",
      "acceptanceCriteria": "Colors update each frame during playback. Performance <1ms per update."
    }
  ]
  ```

CHECKPOINT: All feature criteria converted to tasks
```

### PASS 3: ORDER BY DEPENDENCIES
```
SOURCE: Dependency graph from synthesis + PRD Section 7

ORDERING RULES:
1. Foundation tasks ALWAYS first (priority 1-N)
2. Core infrastructure before features
3. Data loading before visualization
4. Basic features before advanced
5. Polish/integration tasks LAST

DEPENDENCY RESOLUTION:
```
IF Task B depends on Task A:
  priority(B) > priority(A)

IF Tasks A and B are independent:
  Order by: complexity (simpler first), then alphabetically
```

EXAMPLE ORDERING:

Before ordering (extracted):
- Create heatmap component
- Create colormap utility
- Create store
- Create route
- Create types

After ordering:
1. Create route (foundation)
2. Create types (foundation)
3. Create store (foundation)
4. Create colormap utility (enables heatmap)
5. Create heatmap component (depends on 3, 4)

CHECKPOINT: All tasks ordered by dependency
```

### PASS 4: ASSIGN PRIORITIES
```
PRIORITY ASSIGNMENT:
- Start at 1
- Increment by 1 for each task
- No gaps
- No duplicates

VERIFICATION:
```bash
# Check for gaps
cat prd.json | jq '[.userStories[].priority] | sort | . as $arr |
  [range(1; ($arr | max) + 1)] | . - $arr'
# Should output: []

# Check for duplicates
cat prd.json | jq '[.userStories[].priority] | group_by(.) |
  map(select(length > 1))'
# Should output: []
```

CHECKPOINT: Priorities are 1 to N with no gaps
```

### PASS 5: WRITE ACCEPTANCE CRITERIA
```
CRITERIA RULES:

1. SINGLE TESTABLE SENTENCE when possible
   Good: "Route exists at /biomechanics and renders without errors."
   Bad: "The route should work."

2. MULTIPLE CONDITIONS separated by periods
   Good: "Parser loads BVH files. Returns skeleton and animation. Handles errors gracefully."
   Bad: "Parser works correctly for all file types"

3. SPECIFIC OVER VAGUE
   Good: "Slider value syncs with currentTime in store. Updates within 16ms."
   Bad: "Slider works smoothly"

4. VERIFIABLE BY CLAUDE
   Good: "TypeScript compiles without errors. ESLint passes."
   Bad: "Code quality is good"

5. INCLUDE EDGE CASES
   Good: "Handles empty files gracefully. Shows error toast for invalid format."
   Bad: "Error handling works"

TEMPLATE:
"[Primary action/state]. [Secondary requirement]. [Edge case handling]."

EXAMPLES:
- "Store created with state properties and actions. Uses Zustand selector pattern. Exports typed hooks."
- "BVH files load successfully. Skeleton renders in scene. Invalid files show error message."
- "Timeline slider scrubs animation. Updates are smooth without jitter. Works with keyboard arrows."

CHECKPOINT: All acceptance criteria are testable
```

### PASS 6: GENERATE JSON
```
FINAL STRUCTURE:

{
  "branchName": "[feature-name-kebab-case]",
  "userStories": [
    {
      "id": "[phase]-[number]",
      "title": "[Imperative verb] [specific object]",
      "passes": false,
      "priority": [1-N],
      "acceptanceCriteria": "[Testable condition(s)]"
    }
  ]
}

FIELD REQUIREMENTS:

branchName:
- kebab-case
- descriptive of feature
- valid git branch name
- Example: "biomechanics-mvp", "muscle-heatmap-v2"

id:
- Format: [phase]-[number]
- Unique across all stories
- Examples: "foundation-1", "timeline-3", "viz-2"

title:
- Starts with imperative verb (Create, Add, Implement, Update)
- Specific about what is created/modified
- Under 80 characters
- Examples:
  - "Create /app/biomechanics/page.tsx route"
  - "Implement play/pause with Space keyboard shortcut"
  - "Add drag-and-drop file upload UI"

passes:
- ALWAYS false initially
- ralph-tui sets to true when complete

priority:
- Integer starting at 1
- Sequential with no gaps
- Lower = executed first

acceptanceCriteria:
- 1-3 sentences
- Testable by Claude
- Specific conditions
```

### PASS 7: VALIDATE OUTPUT
```
VALIDATION CHECKLIST:

1. JSON SYNTAX
   ```bash
   cat prd.json | jq . > /dev/null && echo "Valid JSON"
   ```

2. REQUIRED FIELDS
   ```bash
   cat prd.json | jq '.userStories[] |
     select(.id == null or .title == null or
            .passes == null or .priority == null or
            .acceptanceCriteria == null)'
   # Should output nothing
   ```

3. UNIQUE IDS
   ```bash
   cat prd.json | jq '[.userStories[].id] |
     group_by(.) | map(select(length > 1)) | length'
   # Should output: 0
   ```

4. SEQUENTIAL PRIORITIES
   ```bash
   cat prd.json | jq '[.userStories[].priority] | sort |
     . as $a | [range(1; length+1)] | . == $a'
   # Should output: true
   ```

5. ALL PASSES FALSE
   ```bash
   cat prd.json | jq '[.userStories[].passes] | all(. == false)'
   # Should output: true
   ```

6. MINIMUM STORIES
   ```bash
   cat prd.json | jq '.userStories | length >= 25'
   # Should output: true
   ```

CHECKPOINT: All validations pass
```

---

## TASK GRANULARITY GUIDE

### Too Large (Must Split)
```
❌ "Implement the entire data import system"
❌ "Create all visualization components"
❌ "Build the complete timeline"

Split into:
✓ "Create BVH parser"
✓ "Create CSV parser"
✓ "Create file upload UI"
✓ "Create import hook"
```

### Too Small (Combine)
```
❌ "Add import statement"
❌ "Create empty file"
❌ "Add single prop"

Combine into:
✓ "Create Component.tsx with props interface and basic render"
```

### Just Right
```
✓ "Create lib/parsers/bvh-parser.ts using THREE.BVHLoader"
✓ "Implement play/pause button with Space keyboard shortcut"
✓ "Add timeline slider with frame scrubbing"
✓ "Create URL state encoding with lz-string compression"
```

**Rule of Thumb:** Each task = 15-60 minutes of Claude work = 1 iteration

---

## STATE FILE FORMAT

```markdown
# PRD to Ralph Conversion: [Project Name]

## Session State
**Last Updated**: [timestamp]
**Current Pass**: [1-7]
**Status**: IN_PROGRESS | COMPLETE

## Progress
| Pass | Description | Status |
|------|-------------|--------|
| 1 | Extract from phases | [✓/In Progress] |
| 2 | Extract from features | [✓/In Progress] |
| 3 | Order by dependencies | [✓/In Progress] |
| 4 | Assign priorities | [✓/In Progress] |
| 5 | Write criteria | [✓/In Progress] |
| 6 | Generate JSON | [✓/In Progress] |
| 7 | Validate | [✓/In Progress] |

## Extraction Log
| Source | Tasks Extracted |
|--------|-----------------|
| Phase 1: Foundation | [N] |
| Phase 2: Core | [N] |
| Phase 3: UX | [N] |
| Phase 4: Polish | [N] |
| Feature 1 | [N] |
| Feature 2 | [N] |
| ... | ... |
| **Total** | **[N]** |

## Validation Results
- [ ] Valid JSON
- [ ] All required fields
- [ ] Unique IDs
- [ ] Sequential priorities
- [ ] All passes false
- [ ] 25+ stories

## Final Output
File: prd.json
Stories: [N]
Ready for: ralph-tui run --prd ./prd.json
```

---

## EXAMPLE COMPLETE OUTPUT

```json
{
  "branchName": "biomechanics-mvp",
  "userStories": [
    {
      "id": "foundation-1",
      "title": "Create /app/biomechanics/page.tsx route",
      "passes": false,
      "priority": 1,
      "acceptanceCriteria": "Route exists at /biomechanics. Renders without errors. Uses 'use client' directive. Basic layout with placeholder content."
    },
    {
      "id": "foundation-2",
      "title": "Create types/biomechanics.ts with TypeScript interfaces",
      "passes": false,
      "priority": 2,
      "acceptanceCriteria": "Interfaces defined: MotionData, ActivationData, ForceData, BiomechanicsState. All types exported. No TypeScript errors."
    },
    {
      "id": "foundation-3",
      "title": "Create lib/store/biomechanics-store.ts Zustand store",
      "passes": false,
      "priority": 3,
      "acceptanceCriteria": "Store has state and actions. Uses selector pattern. Exports typed hooks."
    },
    ...
    {
      "id": "polish-1",
      "title": "Final integration test and accessibility check",
      "passes": false,
      "priority": 25,
      "acceptanceCriteria": "All features work together. TypeScript compiles. ESLint passes. 60fps maintained. Keyboard navigation works."
    }
  ]
}
```

---

## EXECUTION CHECKLIST

Before marking conversion complete:

- [ ] **All PRD phases** converted to tasks
- [ ] **All feature criteria** converted to tasks
- [ ] **25+ user stories** total
- [ ] **Dependencies respected** in ordering
- [ ] **Priorities sequential** 1 to N
- [ ] **All IDs unique**
- [ ] **All criteria testable**
- [ ] **JSON validates**
- [ ] **prd.json committed**
- [ ] **Ready for ralph-tui run**
