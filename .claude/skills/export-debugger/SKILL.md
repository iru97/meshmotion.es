---
name: export-debugger
description: Debug 3D model export issues in MeshMotion. Use when export fails or produces incorrect results.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
user-invocable: true
---

# Export Debugger Skill

Diagnose and fix issues with MeshMotion's 3D model export functionality.

## Usage

Invoke with: `/export-debugger [format]`

Formats: `glb`, `gltf`, `obj`, `stl`, `ply`, `fbx`, `usdz`

## Diagnostic Checklist

### 1. Verify Export Chain

```
File: src/lib/conversion/three-exporters.ts
Entry: exportModel(model, format, options)
  ↓
Format dispatcher (switch statement)
  ↓
Format-specific exporter (exportToGLB, exportToOBJ, etc.)
  ↓
Three.js Exporter (GLTFExporter, OBJExporter, etc.)
  ↓
Blob creation
  ↓
downloadFile()
```

### 2. Common Issues by Format

#### GLB/GLTF
- **Issue**: Empty scene export
  - Check: `model.scene` is valid THREE.Group
  - Check: Scene has visible children

- **Issue**: Missing textures
  - Check: Texture URLs are accessible
  - Check: Materials have maps assigned

- **Issue**: Animation not included
  - Check: `options.includeAnimations` is true
  - Check: `model.animations` array populated

#### OBJ
- **Issue**: Missing materials
  - OBJ exports geometry only
  - Need separate MTL file for materials

- **Issue**: Scale incorrect
  - Check coordinate system (y-up vs z-up)

#### STL
- **Issue**: Only one mesh exported
  - STL doesn't support multi-mesh
  - Need to merge geometry first

#### FBX
- **Issue**: Export unavailable
  - FBX export requires server-side processing
  - Check: `formatInfo.availability === 'full'`

### 3. Debug Steps

#### Step 1: Verify Model Data
```typescript
// Add to exportModel function temporarily
console.log('Model to export:', {
  hasScene: !!model.scene,
  sceneChildren: model.scene?.children.length,
  animations: model.animations?.length,
  materials: countMaterials(model.scene),
})
```

#### Step 2: Check Exporter Output
```typescript
// In format-specific export function
const exporter = new GLTFExporter()

exporter.parse(
  model.scene,
  (result) => {
    console.log('Export result type:', typeof result)
    console.log('Export result size:', result.byteLength || JSON.stringify(result).length)
  },
  (error) => {
    console.error('Export error:', error)
  },
  options
)
```

#### Step 3: Verify Blob Creation
```typescript
// Check blob is valid
const blob = new Blob([result], { type: mimeType })
console.log('Blob size:', blob.size)
console.log('Blob type:', blob.type)
```

### 4. Error Patterns

| Error | Likely Cause | Solution |
|-------|--------------|----------|
| "No model loaded" | model.scene undefined | Verify model loaded before export |
| "Export failed: undefined" | Exporter threw error | Check browser console for details |
| 0-byte file | Empty scene | Verify scene has renderable children |
| Corrupted file | Encoding issue | Check binary vs text format |
| Missing animations | Wrong options | Set `includeAnimations: true` |

### 5. Format Configuration Reference

```typescript
// From src/lib/conversion/format-config.ts
interface FormatInfo {
  id: string
  supportsAnimations: boolean
  supportsMaterials: boolean
  supportsTextures: boolean
  availability: 'full' | 'partial' | 'server-only'
  dataLoss?: string[]
}
```

## Commands

```bash
# Check format config
grep -A 10 "id: 'glb'" src/lib/conversion/format-config.ts

# Find export function
grep -n "exportTo" src/lib/conversion/three-exporters.ts

# Check hook implementation
cat src/hooks/use-format-exporter.ts
```

## Fix Templates

### Fix: Handle Export Errors
```typescript
try {
  const result = await exportModel(model, format, options)
  if (!result.success) {
    // User-friendly error
    toast.error(`Export failed: ${result.error}`)
    return
  }
  downloadFile(result.data!, result.fileName!)
} catch (error) {
  console.error('Export exception:', error)
  toast.error('An unexpected error occurred')
}
```

### Fix: Validate Before Export
```typescript
function validateForExport(model: GLTFModel, format: ExportFormat): ValidationResult {
  const issues: string[] = []

  if (!model?.scene) {
    issues.push('No model loaded')
  }

  if (model.scene?.children.length === 0) {
    issues.push('Model has no visible content')
  }

  const formatInfo = getExportFormatInfo(format)
  if (formatInfo?.dataLoss?.includes('Animations') && model.animations?.length > 0) {
    issues.push(`${format.toUpperCase()} will not include animations`)
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings: formatInfo?.dataLoss || []
  }
}
```
