# Test Assets

This directory contains simple test GLB files for immediate testing of the 3D Next Viewer.

## Available Test Files

### `cube.glb`
- **Type:** Static mesh
- **Size:** ~1.5KB
- **Description:** Simple red cube for basic viewer testing
- **Material:** PBR material (red, low metallic, medium roughness)
- **Use case:** Test basic model loading, material presets, lighting presets, orbit controls

## Quick Test

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open browser at `http://localhost:3000`

3. Drag and drop `cube.glb` into the viewer

4. Test features:
   - ✅ Orbit controls (rotate, zoom, pan)
   - ✅ Material presets (try Clay, Wireframe, X-Ray, PBR)
   - ✅ Lighting presets (try Studio, Dramatic, Soft, Outdoor)
   - ✅ Grid visibility
   - ✅ Shadow rendering

## For Animation Testing

This cube is a static mesh and does not have animations. For animation testing, you'll need:

- **Character models** with skeletal rigs (download from Mixamo)
- **Animation files** compatible with the character's skeleton

See `public/models/mixamo/README.md` for instructions on downloading animated characters and animation clips from Mixamo.

## Regenerate Test Assets

If you need to regenerate the test cube:

```bash
node scripts/generate-test-cube.js
```

---

**Next Steps:**
1. Test basic viewer functionality with `cube.glb`
2. Download Mixamo assets for animation testing (see `/public/models/mixamo/README.md`)
3. Test character loading and animation retargeting
