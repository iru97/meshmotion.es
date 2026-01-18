# Three.js & React Three Fiber Rules

## Component Structure

### Scene Setup
```typescript
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 50 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <Model />
      <OrbitControls />
      <Environment preset="studio" />
    </Canvas>
  );
}
```

### Model Loading
```typescript
import { useGLTF } from '@react-three/drei';

export function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

// Preload models
useGLTF.preload('/models/default.glb');
```

## Performance Guidelines

### useFrame Best Practices
```typescript
import { useFrame } from '@react-three/fiber';

// GOOD: Minimal work in useFrame
useFrame((state, delta) => {
  meshRef.current.rotation.y += delta;
});

// BAD: Heavy computation in useFrame
useFrame(() => {
  // Don't do complex calculations here
  // Don't create new objects/arrays
  // Don't call setState
});
```

### Memory Management

#### Dispose Resources Properly
```typescript
import { useEffect } from 'react';

export function Model({ url }) {
  const { scene, materials, nodes } = useGLTF(url);

  useEffect(() => {
    return () => {
      // Clean up on unmount
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }
      });
    };
  }, [scene]);

  return <primitive object={scene} />;
}
```

#### Reuse Geometries and Materials
```typescript
// Create shared resources outside component
const sharedGeometry = new THREE.BoxGeometry(1, 1, 1);
const sharedMaterial = new THREE.MeshStandardMaterial({ color: 'hotpink' });

export function Box() {
  return (
    <mesh geometry={sharedGeometry} material={sharedMaterial} />
  );
}
```

## Animation Handling

### With useAnimations
```typescript
import { useAnimations, useGLTF } from '@react-three/drei';

export function AnimatedModel({ url }) {
  const { scene, animations } = useGLTF(url);
  const { actions, mixer } = useAnimations(animations, scene);

  useEffect(() => {
    // Play default animation
    actions['idle']?.play();

    return () => {
      // Stop all animations on cleanup
      mixer.stopAllAction();
    };
  }, [actions, mixer]);

  return <primitive object={scene} />;
}
```

### Timeline Control
```typescript
// Control animation playback
const action = actions['walk'];
if (action) {
  action.paused = false;
  action.time = normalizedTime * action.getClip().duration;
  action.play();
}
```

## @react-three/drei Utilities

### Commonly Used Helpers
- `OrbitControls` - Camera orbit controls
- `Environment` - HDR environment maps
- `useGLTF` - GLTF/GLB loader with draco support
- `useAnimations` - Animation management
- `Html` - HTML overlays in 3D space
- `Bounds` - Auto-fit camera to objects
- `ContactShadows` - Ground plane shadows
- `Stage` - Quick lighting setup

### Prefer Drei Over Raw Three.js
```typescript
// GOOD: Use drei helpers
import { PerspectiveCamera } from '@react-three/drei';
<PerspectiveCamera makeDefault position={[0, 2, 5]} />

// AVOID: Manual camera setup when drei has a helper
```

## Export Functionality

### GLB Export
```typescript
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

async function exportToGLB(scene: THREE.Scene): Promise<Blob> {
  const exporter = new GLTFExporter();
  const glb = await exporter.parseAsync(scene, { binary: true });
  return new Blob([glb], { type: 'model/gltf-binary' });
}
```

## Common Pitfalls

1. **SSR Issues**: Always use `dynamic` import with `ssr: false` for Three.js components
2. **Memory Leaks**: Dispose geometries, materials, and textures on cleanup
3. **Performance**: Avoid creating objects in render or useFrame
4. **Context Loss**: Handle WebGL context loss gracefully
5. **Mobile**: Reduce quality settings and polygon count for mobile devices
