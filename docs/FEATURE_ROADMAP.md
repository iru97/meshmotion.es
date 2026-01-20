# MeshMotion Feature Roadmap

> **Generated**: January 2026
> **Goal**: Community adoption through viral sharing capabilities
> **Research**: Competitive analysis of Sketchfab, model-viewer, Marmoset, 3DViewerOnline, and others

---

## Executive Summary

MeshMotion has strong core 3D viewing capabilities but lacks the **sharing features** that drive community growth. Without screenshot export, video recording, and embeddable widgets, users cannot share their work on social media, portfolios, or websites.

### Key Insight
> "3D visual content gets 40% higher engagement on social media, but MeshMotion users have no way to create shareable content."

---

## Current Feature Inventory

### What MeshMotion Does Well

| Feature | Status | Notes |
|---------|--------|-------|
| Multi-format import | 8 formats | GLB, GLTF, FBX, OBJ, DAE, STL, PLY, 3DS |
| Multi-format export | 5 formats | GLB, GLTF, OBJ, STL, PLY |
| Animation playback | Advanced | Play, pause, speed, timeline, loop |
| Comparison mode | **Unique** | Side-by-side model/animation comparison |
| Lighting presets | 5 options | Studio, Soft, Dramatic, Outdoor, Custom |
| Environment presets | 4 options | Studio, Void, Sunset, Stage |
| Material presets | 5 options | Textured, Clay, Wireframe, X-Ray, PBR |
| Local asset library | IndexedDB | Persistent storage with metadata |
| Keyboard shortcuts | 17+ | Comprehensive shortcuts |
| URL-based loading | Basic | External URLs with CORS proxy |

### MeshMotion's Unique Differentiators

1. **Comparison Mode** - No competitor offers side-by-side animation comparison
2. **Animation Focus** - Deep animation controls exceed most viewers
3. **Multi-Format Client-Side** - Full WASM conversion without server
4. **Privacy-First** - All processing local, no upload required
5. **Modern UI** - Clean glassmorphism design

---

## Gap Analysis vs Competitors

### Critical Missing Features

| Feature | Sketchfab | model-viewer | Marmoset | MeshMotion |
|---------|-----------|--------------|----------|------------|
| Screenshot export | ✅ | ✅ | ✅ | ❌ |
| Video/GIF recording | ✅ | ❌ | ✅ | ❌ |
| Embeddable widget | ✅ | ✅ (is one) | ✅ | ❌ |
| Shareable URLs | ✅ | ✅ | ✅ | ❌ |
| AR view (WebXR) | ✅ | ✅ | ❌ | ❌ |
| Annotations | ❌ | ✅ | ❌ | ❌ |
| Measurement tools | ❌ | ❌ | ❌ | ❌ |
| Comparison mode | ❌ | ❌ | ❌ | ✅ |

---

## Feature Roadmap

### Phase 1: SHARE IT (Critical - Enable Viral Sharing)

**Goal**: Give users the ability to share MeshMotion content anywhere

#### 1.1 Screenshot Export
**Priority**: #1 (Highest)
**Effort**: 2-3 hours
**Impact**: Critical

**Description**: One-click high-quality PNG/JPEG export of current viewport

**Features**:
- [ ] Transparent background option (PNG)
- [ ] Resolution presets (1x, 2x, 4x current viewport)
- [ ] Hide/show UI elements in export
- [ ] Optional watermark/branding
- [ ] Custom filename

**Technical Approach**:
```typescript
// Already have preserveDrawingBuffer: true in Canvas
const canvas = gl.domElement;
const dataURL = canvas.toDataURL('image/png');
// Use FileSaver.js or native download
```

**Success Metrics**:
- Users can share 3D renders on Twitter, Discord, Reddit
- Portfolio images can be created

---

#### 1.2 Video/GIF Recording
**Priority**: #2
**Effort**: 1-2 days
**Impact**: Critical

**Description**: Record animation loops as MP4/WebM/GIF for social sharing

**Features**:
- [ ] Preset durations (3s, 5s, 10s, full animation, custom)
- [ ] Auto-turntable mode (360 rotation recording)
- [ ] GIF export for social media
- [ ] Quality presets (social-optimized / high quality)
- [ ] Include/exclude UI

**Technical Approach**:
```typescript
// MediaRecorder API for video
const stream = canvas.captureStream(60);
const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

// gif.js for GIF export
import GIF from 'gif.js';
```

**Dependencies**:
- `gif.js` or `gifshot` for GIF generation
- Native MediaRecorder API (no deps needed)

**Success Metrics**:
- Animation showcases can be shared as GIFs
- Turntable videos for portfolios

---

#### 1.3 Embeddable Widget
**Priority**: #3
**Effort**: 1 day
**Impact**: Critical

**Description**: Generate iframe embed code for external websites

**Features**:
- [ ] Embed code generator UI
- [ ] Customizable dimensions (responsive option)
- [ ] Auto-play toggle
- [ ] Hide UI controls option
- [ ] Custom background color
- [ ] White-label option (remove branding)

**Technical Approach**:
- MeshMotion is already a SPA
- Add `/embed` route with minimal UI
- Query params for configuration: `?autoplay=true&hideUI=true&bg=000000`

**Example Output**:
```html
<iframe
  src="https://meshmotion.es/embed?model=URL&autoplay=true"
  width="800"
  height="600"
  allow="autoplay; fullscreen; xr-spatial-tracking"
  frameborder="0">
</iframe>
```

**Success Metrics**:
- Artists embed in ArtStation, Behance, portfolios
- Game studios use in press kits

---

#### 1.4 Shareable URLs
**Priority**: #4
**Effort**: 2-3 days
**Impact**: Critical

**Description**: Generate URLs that encode model state for sharing

**Features**:
- [ ] Share current camera position/settings
- [ ] URL contains all viewer state
- [ ] Copy link button
- [ ] QR code generation
- [ ] Short URL option (via URL shortener API)

**Technical Options**:

**Option A: State-Only URLs** (Recommended first)
```
meshmotion.es/view?model=URL&camera=x,y,z&preset=studio&anim=walk
```
- Pros: Simple, works with any hosted model
- Cons: Model must be publicly accessible

**Option B: Base64 Encoded Models** (Small models)
```
meshmotion.es/view?data=BASE64_ENCODED_GLB
```
- Pros: Self-contained
- Cons: URL length limits (~2KB), only for tiny models

**Option C: Temporary Storage** (Best UX, needs backend)
- Upload to Cloudflare R2 / S3 with 24h expiry
- Pros: Any size model, clean URLs
- Cons: Requires backend service

**Success Metrics**:
- Users can share specific views on Discord
- Twitter links show 3D content directly

---

### Phase 2: VIEW IT (High Value - Mobile & Presentation)

#### 2.1 AR Quick Look (WebXR)
**Priority**: #5
**Effort**: 3-5 days
**Impact**: High

**Description**: View models in AR on mobile devices

**Features**:
- [ ] AR button (appears on supported devices)
- [ ] WebXR for Android Chrome
- [ ] Scene Viewer fallback (Android)
- [ ] USDZ Quick Look for iOS Safari
- [ ] Scale/placement controls in AR

**Technical Approach**:
```typescript
// Check AR support
if (navigator.xr?.isSessionSupported('immersive-ar')) {
  // WebXR path
}
// Add model-viewer's ar attribute approach
// Generate USDZ dynamically for iOS
```

**Dependencies**:
- `three/examples/jsm/webxr/` modules
- USDZ generation library (or server-side)

**Success Metrics**:
- Mobile users can view models in their environment
- Product visualization use cases enabled

---

#### 2.2 Turntable Animation Mode
**Priority**: #6
**Effort**: 2-3 hours
**Impact**: Medium

**Description**: Automated 360 rotating presentation view

**Features**:
- [ ] Toggle turntable mode
- [ ] Adjustable rotation speed
- [ ] Pause on hover/interaction
- [ ] Combine with animation playback

**Technical Approach**:
```typescript
useFrame((_, delta) => {
  if (turntableEnabled) {
    cameraRef.current.position.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      delta * rotationSpeed
    );
  }
});
```

**Success Metrics**:
- Professional presentation mode for portfolios
- Combined with video recording for auto-showcase

---

#### 2.3 Camera Presets
**Priority**: #7
**Effort**: 3-4 hours
**Impact**: Medium

**Description**: Save and recall camera positions

**Features**:
- [ ] Front/Side/Top/Back quick views
- [ ] Save custom camera positions
- [ ] Name and organize presets
- [ ] Smooth transition animation between views
- [ ] Persist presets per model

**Success Metrics**:
- Faster navigation for complex models
- Presentation walkthrough capability

---

#### 2.4 Fullscreen Enhancement
**Priority**: #8
**Effort**: 1-2 hours
**Impact**: Low-Medium

**Features**:
- [ ] Fullscreen toggle button
- [ ] Minimal UI in fullscreen
- [ ] Keyboard shortcut (F)
- [ ] Auto-hide controls with mouse idle

---

### Phase 3: EXPLAIN IT (Professional Features)

#### 3.1 Annotations & Hotspots
**Priority**: #9
**Effort**: 2-3 days
**Impact**: Medium

**Description**: Add clickable labels/hotspots to 3D models

**Features**:
- [ ] Add annotation at 3D point
- [ ] Custom label text
- [ ] Show/hide on hover vs always visible
- [ ] Link to external URLs
- [ ] Export/import annotations as JSON
- [ ] Camera auto-focus on annotation click

**Technical Approach**:
```typescript
// Store annotation positions in model space
interface Annotation {
  id: string;
  position: [number, number, number];
  label: string;
  description?: string;
  linkUrl?: string;
}

// Use drei's Html component for rendering
<Html position={annotation.position}>
  <div className="annotation">{annotation.label}</div>
</Html>
```

**Use Cases**:
- Educational 3D content (anatomy, engineering)
- Product feature callouts
- Game asset documentation

---

#### 3.2 Measurement Tools
**Priority**: #10
**Effort**: 3-5 days
**Impact**: Medium

**Description**: Measure distances, angles, and dimensions

**Features**:
- [ ] Point-to-point distance
- [ ] Surface area measurement
- [ ] Angle measurement
- [ ] Coordinate display
- [ ] Unit selection (m, cm, mm, in, ft)
- [ ] Export measurements

**Technical Approach**:
- Raycasting for point selection
- Three.js geometry helpers for visualization
- Store measurements as overlay layer

**Use Cases**:
- CAD review
- Manufacturing verification
- 3D printing preparation

---

#### 3.3 Model Stats Overlay
**Priority**: #11
**Effort**: 1-2 hours
**Impact**: Low

**Description**: Display technical info as HUD overlay

**Features**:
- [ ] Vertex count
- [ ] Triangle count
- [ ] Texture sizes
- [ ] Material count
- [ ] Animation info
- [ ] Memory usage estimate

**Already Have**: Model metadata in store, just need overlay UI

---

#### 3.4 Export Presets
**Priority**: #12
**Effort**: 2-3 hours
**Impact**: Low

**Description**: Save export configurations

**Features**:
- [ ] Save format + options as preset
- [ ] Quick export with preset
- [ ] Per-project presets

---

### Phase 4: SCALE IT (Future - Cloud Features)

> Note: These features require backend infrastructure

#### 4.1 Cloud Storage Integration
**Effort**: 1-2 weeks
**Description**: Connect to Google Drive, Dropbox, OneDrive

#### 4.2 Temporary Link Storage
**Effort**: 3-5 days
**Description**: Upload models to CDN for sharing (24h-7d expiry)

#### 4.3 Collaborative Viewing
**Effort**: 2-4 weeks
**Description**: Multiple users viewing same model in real-time

#### 4.4 Gallery/Profile Pages
**Effort**: 2-4 weeks
**Description**: Public profiles, collections, social features (Sketchfab-like)

---

## Implementation Priority Matrix

| Feature | Effort | Impact | Priority | Phase |
|---------|--------|--------|----------|-------|
| Screenshot Export | Low | Critical | **#1** | 1 |
| Video/GIF Recording | Medium | Critical | **#2** | 1 |
| Embeddable Widget | Low | Critical | **#3** | 1 |
| Shareable URLs | Medium | Critical | **#4** | 1 |
| AR Quick Look | High | High | #5 | 2 |
| Turntable Mode | Low | Medium | #6 | 2 |
| Camera Presets | Low | Medium | #7 | 2 |
| Fullscreen Mode | Low | Low | #8 | 2 |
| Annotations | Medium | Medium | #9 | 3 |
| Measurements | High | Medium | #10 | 3 |
| Stats Overlay | Low | Low | #11 | 3 |
| Export Presets | Low | Low | #12 | 3 |

---

## Success Metrics

### Phase 1 Goals
- [ ] Screenshots shared on Twitter: 100+
- [ ] GIFs shared on Discord: 50+
- [ ] Embeds on external sites: 25+
- [ ] Shared URLs clicked: 500+

### Community Growth Indicators
- GitHub stars increase
- User-generated content sharing
- Portfolio/blog mentions
- Discord community growth

---

## Research Sources

### Web-Based 3D Viewers
- [Sketchfab Features](https://sketchfab.com/features)
- [Sketchfab Community Blog](https://sketchfab.com/blogs/community/)
- [Online 3D Viewer](https://3dviewer.net/)
- [Top Web-Based 3D Viewers 2025](https://slashdot.org/software/3d-viewers/saas/)

### Google model-viewer
- [model-viewer GitHub](https://github.com/google/model-viewer)
- [model-viewer Annotations](https://modelviewer.dev/examples/annotations)
- [WebXR with model-viewer](https://developers.google.com/ar/develop/webxr/model-viewer)

### Professional Tools
- [Marmoset Viewer](https://marmoset.co/toolbag/viewer/)
- [Marmoset Toolbag Documentation](https://docs.marmoset.co/docs/marmoset-viewer/)

### WebXR/AR
- [Immersive Web Developer Home](https://immersiveweb.dev/)
- [WebXR Device API MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)
- [VNTANA WebXR Guide](https://www.vntana.com/the-ultimate-guide-to-3d-viewers/)

### Community & Engagement
- [How to Build Audience on Sketchfab](https://sketchfab.com/blogs/community/how-to-become-a-sketchfab-rockstar-audience-hacking/)
- [3D Visual Content Strategy](https://www.anideos.com/3d-visual-content)
- [Viral Content Ideas 2025](https://www.webprecious.com/viral-content-ideas-for-2025/)

---

## Changelog

| Date | Change |
|------|--------|
| 2026-01-20 | Initial roadmap created from competitive research |

