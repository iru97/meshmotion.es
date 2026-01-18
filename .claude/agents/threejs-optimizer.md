---
name: threejs-optimizer
description: Prompt template for 3D performance optimization. Read this file for guidance on auditing and optimizing WebGL/Three.js rendering performance, fixing memory leaks, and reducing draw calls.
tools: Read, Grep, Glob, Bash, Edit
model: sonnet
---

# Three.js Optimizer Prompt Template

This document provides guidance for optimizing 3D rendering performance in MeshMotion. Read this when working on performance issues.

**How to use**: Read this file for performance checklists, optimization patterns, and profiling techniques, then apply the guidance to optimize 3D code.

## Performance Audit Checklist for MeshMotion

### CRITICAL: Draw Calls (Target: <100 for 60fps)

#### Check Current Draw Calls
```typescript
// Add to Scene.tsx temporarily for debugging
useFrame(({ gl }) => {
  console.log('Draw calls:', gl.info.render.calls)
  console.log('Triangles:', gl.info.render.triangles)
  console.log('Geometries:', gl.info.memory.geometries)
  console.log('Textures:', gl.info.memory.textures)
})
```

#### Optimization Strategies
- [ ] Use `InstancedMesh` for repeated objects
- [ ] Merge static geometry with `BufferGeometryUtils.mergeGeometries()`
- [ ] Share materials between meshes (define outside component or useMemo)

### CRITICAL: Memory Leaks

#### Disposal Checklist
```typescript
// Every useEffect that creates Three.js objects needs cleanup
useEffect(() => {
  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshStandardMaterial()
  const texture = new THREE.TextureLoader().load(url)

  return () => {
    geometry.dispose()
    material.dispose()
    texture.dispose()
  }
}, [])
```

#### Model Cleanup Pattern
```typescript
// Proper cleanup for loaded GLTF models
useEffect(() => {
  return () => {
    if (gltf) {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose()
          if (Array.isArray(child.material)) {
            child.material.forEach(m => {
              m.map?.dispose()
              m.normalMap?.dispose()
              m.dispose()
            })
          } else if (child.material) {
            child.material.map?.dispose()
            child.material.normalMap?.dispose()
            child.material.dispose()
          }
        }
      })
    }
  }
}, [gltf])
```

### HIGH: React Three Fiber Patterns

#### WRONG: State updates in useFrame
```typescript
// BAD - causes React re-renders every frame
useFrame(() => {
  setRotation(prev => prev + 0.01) // DON'T DO THIS
})
```

#### CORRECT: Direct ref mutations
```typescript
// GOOD - direct DOM manipulation, no re-renders
const meshRef = useRef<THREE.Mesh>(null)

useFrame((state, delta) => {
  if (meshRef.current) {
    meshRef.current.rotation.y += delta
  }
})
```

#### Memoize Geometries and Materials
```typescript
// Define outside component or use useMemo
const sharedGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])
const sharedMaterial = useMemo(() => new THREE.MeshStandardMaterial({
  color: '#ffffff'
}), [])

// Reuse across multiple meshes
<mesh geometry={sharedGeometry} material={sharedMaterial} />
```

### MEDIUM: Texture Optimization

#### Power-of-Two Dimensions
Textures should be: 256, 512, 1024, 2048, 4096 pixels
```typescript
// Check texture dimensions
texture.image.width  // Should be power of 2
texture.image.height // Should be power of 2
```

#### Texture Settings
```typescript
const texture = useTexture('/texture.jpg')

// Optimize based on use case
texture.minFilter = THREE.LinearMipmapLinearFilter // For distant viewing
texture.magFilter = THREE.LinearFilter
texture.anisotropy = gl.capabilities.getMaxAnisotropy() // Better quality at angles
texture.generateMipmaps = true // For LOD
```

### MEDIUM: Lighting Optimization

#### Current Lighting Audit
Check `src/lib/three/lighting-presets.ts`:
- Count total lights per preset (target: ≤3 dynamic lights)
- Check shadow-casting lights (expensive)
- Verify shadow map resolution

#### Optimization
```typescript
// Reduce shadow map size for performance
<directionalLight
  castShadow
  shadow-mapSize={[1024, 1024]} // Instead of 2048x2048
  shadow-camera-far={50}
  shadow-camera-near={0.1}
/>
```

### LOW: Animation Performance

#### Animation Mixer Optimization
```typescript
// Cache animation actions
const actionsRef = useRef<Map<string, THREE.AnimationAction>>(new Map())

useEffect(() => {
  animations.forEach(clip => {
    const action = mixer.clipAction(clip)
    actionsRef.current.set(clip.name, action)
  })

  return () => {
    actionsRef.current.forEach(action => {
      action.stop()
      mixer.uncacheAction(action.getClip())
    })
    actionsRef.current.clear()
  }
}, [animations, mixer])
```

### Canvas Configuration

#### Optimal Settings
```tsx
<Canvas
  gl={{
    powerPreference: 'high-performance',
    antialias: true, // Disable if performance critical
    alpha: false, // Faster if no transparency needed
    stencil: false, // Disable if not using stencil buffer
    depth: true,
    preserveDrawingBuffer: true, // Only for screenshots
  }}
  camera={{ position: [5, 3, 8], fov: 50, near: 0.1, far: 1000 }}
  dpr={[1, 2]} // Limit pixel ratio for performance
>
```

## Performance Testing Protocol

### 1. Identify Bottleneck (CPU vs GPU)
```typescript
// Add to test: override all materials with basic material
scene.traverse((child) => {
  if (child instanceof THREE.Mesh) {
    child.material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  }
})
// If FPS improves: GPU bound (shaders, textures)
// If no improvement: CPU bound (draw calls, JS)
```

### 2. Profile Metrics
```bash
# Chrome DevTools
1. Performance tab → Record while using app
2. Look for long frames (>16ms for 60fps)
3. Check for GC pauses (memory issues)

# R3F specific
npm install @react-three/perf
# Add <Perf /> to Canvas
```

### 3. Output Format

```markdown
## Performance Audit: MeshMotion

### Metrics
- Draw calls: X (target: <100)
- FPS: X (target: 60+)
- Memory: X MB
- Triangles: X

### Critical Issues
1. **Issue**: Description
   - Location: `file:line`
   - Impact: X% FPS drop
   - Fix: Code example

### Optimizations Applied
1. Change description
   - Before: metrics
   - After: metrics
   - Improvement: X%

### Recommendations
- Priority ordered list
```

## Commands
```bash
# Check bundle size
npm run build && npx @next/bundle-analyzer

# Profile memory
# Chrome DevTools → Memory → Take heap snapshot
```
