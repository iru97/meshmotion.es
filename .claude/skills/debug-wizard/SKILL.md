---
name: debug-wizard
description: Interactive debugging wizard that asks questions to narrow down issues. Use when encountering bugs, errors, or unexpected behavior. Guides through systematic debugging.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
  - AskUserQuestion
  - TodoWrite
user-invocable: true
---

# Debug Wizard Skill

An interactive wizard that helps systematically debug issues in MeshMotion.

## Usage

Invoke with: `/debug-wizard [symptom]`

Examples:
- `/debug-wizard model not loading`
- `/debug-wizard animation freezes`
- `/debug-wizard export fails`
- `/debug-wizard performance slow`

## Debugging Workflow

### Phase 1: Symptom Classification

Use `AskUserQuestion` to classify the issue:

```
Question 1: Issue Category
- Header: "Category"
- Options:
  - "Loading/Import" - Model won't load or convert
  - "Rendering" - Visual glitches, missing elements
  - "Animation" - Playback issues, timing problems
  - "Export" - Export fails or produces wrong output
  - "Performance" - Slow, laggy, memory issues
  - "UI" - Controls not working, layout broken

Question 2: Reproducibility
- Header: "Reproducible?"
- Options:
  - "Always" - Happens every time
  - "Sometimes" - Intermittent
  - "Once" - Happened once, can't reproduce
  - "Specific file" - Only with certain models
```

### Phase 2: Gather Context

Based on category, ask targeted questions:

#### For Loading Issues:
```
- File format? (GLB, FBX, OBJ, etc.)
- File size?
- Error message in console?
- Does sample model work?
```

#### For Rendering Issues:
```
- What's missing/wrong? (Materials, textures, geometry)
- Does it work in other viewers?
- Which browser?
- GPU/Hardware?
```

#### For Animation Issues:
```
- Type of animation? (Skeletal, morph, transform)
- Does it play at all or freeze mid-way?
- Timeline position when it happens?
- Multiple animations or single?
```

#### For Export Issues:
```
- Export format?
- Error message?
- File produced but wrong, or no file?
- Does re-import of export work?
```

#### For Performance Issues:
```
- When does it slow down? (Load, playback, idle)
- Model complexity? (Vertices, materials)
- Browser dev tools show what? (CPU, GPU, Memory)
- Multiple models loaded?
```

### Phase 3: Diagnostic Steps

Create a diagnostic checklist with `TodoWrite`:

```typescript
// Example for animation freeze issue
[
  { content: "Check browser console for errors", status: "in_progress" },
  { content: "Verify animation clip duration", status: "pending" },
  { content: "Check mixer.update() is being called", status: "pending" },
  { content: "Verify action.time is incrementing", status: "pending" },
  { content: "Test with different animation", status: "pending" },
  { content: "Check for NaN values in transforms", status: "pending" },
]
```

### Phase 4: Code Investigation

Based on answers, investigate specific code:

```typescript
// Issue: Animation freezes
// Check these locations:
[
  "src/components/viewer/Model.tsx:useFrame",      // Is mixer updating?
  "src/lib/store/viewer-store.ts:isPlaying",       // Is playing state correct?
  "src/components/animation/AnimationControls.tsx", // Is time syncing?
]
```

### Phase 5: Solution Proposals

Ask about solution preference:

```
Question: Preferred approach
- Header: "Fix approach"
- Options:
  - "Quick fix" - Minimal change to resolve
  - "Proper fix" - Address root cause
  - "Investigate more" - Need more information
  - "Workaround" - Temporary solution
```

## Debug Decision Tree

```
Issue Reported
    ↓
[AskUserQuestion: Category]
    ↓
├── Loading → Check format detection → Check conversion → Check loader
├── Rendering → Check materials → Check textures → Check geometry
├── Animation → Check mixer → Check action → Check timing
├── Export → Check format support → Check exporter → Check blob
├── Performance → Profile CPU → Profile GPU → Check memory
└── UI → Check state → Check events → Check rendering
```

## Common Solutions Database

### Loading Issues
| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| "Failed to load" | Invalid file | Validate with glTF Validator |
| "Conversion failed" | Unsupported format | Check AssimpJS support |
| "File too large" | Exceeds 50MB limit | Optimize model first |

### Animation Issues
| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Freezes | mixer.update not called | Check useFrame hook |
| Wrong speed | timeScale incorrect | Verify playbackSpeed sync |
| Doesn't start | action not played | Check action.play() call |

### Export Issues
| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| 0-byte file | Empty scene | Verify scene.children |
| Missing textures | Texture not embedded | Check exporter options |
| Wrong scale | Coordinate system | Check y-up vs z-up |

## Output Format

```markdown
## Debug Report: [Issue Description]

### Classification
- Category: [Loading/Rendering/Animation/Export/Performance/UI]
- Reproducibility: [Always/Sometimes/Once/Specific]
- Severity: [Critical/High/Medium/Low]

### Findings
1. [What was discovered]
2. [Related code locations]
3. [Error messages if any]

### Root Cause
[Explanation of why this is happening]

### Recommended Fix
[Code changes with explanation]

### Verification Steps
[How to verify the fix works]
```
