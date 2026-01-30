# Skill: /prd-to-ralph

## Purpose
Convert a PRD document into ralph-tui compatible prd.json format for autonomous implementation.

## Invocation
```
/prd-to-ralph [prd-document.md]
```

## Inputs
- Complete PRD document
- Implementation phases with tasks
- Acceptance criteria per feature

## prd.json Format

```json
{
  "branchName": "feature-branch-name",
  "userStories": [
    {
      "id": "unique-id",
      "title": "Imperative task description",
      "passes": false,
      "priority": 1,
      "acceptanceCriteria": "Testable completion condition"
    }
  ]
}
```

## Conversion Rules

### 1. Branch Name
- Derive from product/feature name
- Use kebab-case
- Example: `biomechanics-mvp`, `muscle-heatmap-feature`

### 2. User Story ID Format
```
[phase]-[number]

Examples:
- foundation-1
- timeline-2
- import-3
- viz-4
- polish-5
```

### 3. Title Format
- **Imperative verb** + object
- Keep under 60 characters
- Be specific about what is created/modified

```
Good:
- "Create /app/biomechanics/page.tsx route"
- "Implement play/pause button with Space shortcut"
- "Add drag-and-drop file upload UI"

Bad:
- "The route should be created" (passive)
- "Route" (too vague)
- "Create the thing that handles the files" (unclear)
```

### 4. Priority
- Sequential execution order (1, 2, 3...)
- Respects dependency graph
- Foundation tasks first
- Polish tasks last

### 5. Acceptance Criteria
- Single sentence when possible
- Multiple conditions separated by periods
- Must be verifiable by Claude

```
Good:
- "Route exists at /biomechanics, renders without errors, uses 'use client' directive."
- "Slider value syncs with currentTime in store. Animation mixer responds to time changes."

Bad:
- "It works" (not verifiable)
- "Good performance" (not measurable)
```

## Conversion Process

### Step 1: Extract Tasks from PRD

From each PRD section:

**From Feature Specifications:**
```
Acceptance Criteria:
- [ ] BVH files load with skeleton visualization
- [ ] CSV motion data maps to model joints
```

Becomes:
```json
{
  "id": "import-1",
  "title": "Create lib/parsers/bvh-parser.ts using THREE.BVHLoader",
  "acceptanceCriteria": "Parser loads BVH files. Returns skeleton and animation clip. Handles errors gracefully."
}
```

**From Implementation Phases:**
```
Phase 1: Foundation
- [ ] Create /biomechanics route
- [ ] Set up BiomechanicsScene component
```

Becomes:
```json
{
  "id": "foundation-1",
  "title": "Create /app/biomechanics/page.tsx route",
  "acceptanceCriteria": "Route exists, renders without errors, basic layout present."
}
```

### Step 2: Order by Dependencies

1. Types/interfaces first
2. Store/state second
3. Base components third
4. Feature implementations fourth
5. Integration/polish last

### Step 3: Assign Priorities

```
priority: 1  → First task executed
priority: 2  → Second task
...
priority: N  → Last task
```

### Step 4: Validate JSON

```bash
# Check valid JSON
cat prd.json | jq .

# Check required fields
cat prd.json | jq '.userStories[] | select(.id == null or .title == null or .passes == null or .priority == null or .acceptanceCriteria == null)'
```

## Example Conversion

**PRD Input:**
```markdown
### 4.1 Biomechanics Data Import (P0)

**Acceptance Criteria:**
- [ ] BVH files load with skeleton visualization
- [ ] CSV motion data maps to model joints
- [ ] Drag-and-drop file upload works
```

**prd.json Output:**
```json
{
  "branchName": "biomechanics-mvp",
  "userStories": [
    {
      "id": "import-1",
      "title": "Create lib/parsers/bvh-parser.ts using THREE.BVHLoader",
      "passes": false,
      "priority": 11,
      "acceptanceCriteria": "Parser loads BVH files using three/examples/jsm/loaders/BVHLoader. Returns skeleton and animation clip. Handles parse errors with Result pattern."
    },
    {
      "id": "import-2",
      "title": "Create lib/parsers/csv-parser.ts for motion data",
      "passes": false,
      "priority": 12,
      "acceptanceCriteria": "Parses CSV with columns: time, joint, x, y, z. Converts to MotionData interface. Validates required columns."
    },
    {
      "id": "import-5",
      "title": "Add drag-and-drop file upload UI",
      "passes": false,
      "priority": 15,
      "acceptanceCriteria": "Drop zone accepts BVH, CSV, JSON files. Visual feedback on drag. Error toast for unsupported formats."
    }
  ]
}
```

## Task Granularity Guidelines

### Too Large (Split It)
```
"Implement the entire data import system"
```

### Too Small (Combine It)
```
"Add import statement for React"
```

### Just Right
```
"Create lib/parsers/bvh-parser.ts using THREE.BVHLoader"
```

**Rule of Thumb:** Each task should be completable in one Claude iteration (~5-15 minutes of work).

## Outputs

1. **prd.json** - ralph-tui compatible file
2. **Validation report** - any issues found

## Usage After Conversion

```bash
# Install ralph-tui
bun install -g ralph-tui

# Run implementation
ralph-tui run --prd ./prd.json

# Resume if interrupted
ralph-tui resume
```

## Quality Checklist

- [ ] branchName is valid git branch name
- [ ] All userStories have required fields
- [ ] IDs are unique
- [ ] Priorities are sequential (no gaps)
- [ ] All passes: false initially
- [ ] Titles are imperative and specific
- [ ] Acceptance criteria are testable
- [ ] Task order respects dependencies
- [ ] JSON is valid (parseable)
