# Deep Feature Research: MeshMotion Biomechanics Visualization

## Session State (Auto-Resume)
**Last Updated**: 2026-01-30T22:15:00
**Current Phase**: ALL FEATURES (Deep Research Pass 2)
**Current Subphase**: Cross-cutting findings complete
**Status**: IN_PROGRESS
**Sessions Used**: 2
**Subphases Completed**: ~180 (Deep research on interaction, tech, accessibility)

---

## RESEARCH STRUCTURE

This document contains deep research for 12 features with 7 subphase categories each:
- **X.1** Existing Solutions Research
- **X.2** Customization Options
- **X.3** Quality Improvements
- **X.4** Markers & Annotations
- **X.5** Interaction Patterns
- **X.6** Technical Possibilities
- **X.7** Feature Synthesis

Total: 12 features × ~25 subphases = **300+ subphases**

---

## FEATURE 1: MUSCLE ACTIVATION HEATMAP

### 1.1 EXISTING SOLUTIONS RESEARCH
```
1.1.1 [ ] What tools currently show muscle activation?
      → Research: BioDigital, Visible Body, OpenSim, academic tools
1.1.2 [ ] What visualization approaches do they use?
      → Color gradients, opacity, glow effects, outlines
1.1.3 [ ] What are their limitations?
      → Static vs dynamic, color options, data input
1.1.4 [ ] What do users/researchers complain about?
      → Forums, papers, reviews
1.1.5 [ ] What color scales are used in scientific literature?
      → Research standard biomechanics visualization conventions
1.1.6 [ ] CHECKPOINT: Understand current landscape?
```

### 1.2 CUSTOMIZATION OPTIONS
```
1.2.1 [ ] Color scheme options
      → Presets: Heat (blue-red), Viridis, Plasma, custom
1.2.2 [ ] User-defined color ranges
      → Min/max colors, midpoint, gradient stops
1.2.3 [ ] Colorblind accessibility modes
      → Deuteranopia, Protanopia, Tritanopia safe palettes
1.2.4 [ ] Intensity scaling options
      → Linear, logarithmic, custom curves
1.2.5 [ ] Threshold controls
      → Show only activation above X%, highlight peaks
1.2.6 [ ] Per-muscle customization
      → Enable/disable individual muscles, group selection
1.2.7 [ ] CHECKPOINT: Full customization spec?
```

### 1.3 QUALITY IMPROVEMENTS
```
1.3.1 [ ] Visual fidelity levels
      → Low (solid color), Medium (gradient), High (shader effects)
1.3.2 [ ] Smooth transitions between activation levels
      → Interpolation methods, animation smoothing
1.3.3 [ ] Glow/bloom effects for high activation
      → Post-processing options
1.3.4 [ ] Muscle fiber direction visualization
      → Texture-based directional indication
1.3.5 [ ] Transparency options
      → See-through skin, layered visualization
1.3.6 [ ] Publication-quality rendering
      → Anti-aliasing, resolution, export settings
1.3.7 [ ] CHECKPOINT: Quality options defined?
```

### 1.4 MARKERS & ANNOTATIONS
```
1.4.1 [ ] Muscle name labels
      → On-hover, always visible, customizable position
1.4.2 [ ] Activation value display
      → Percentage, raw value, normalized
1.4.3 [ ] Peak activation markers
      → Automatic detection, visual indicator
1.4.4 [ ] Time-series graphs per muscle
      → Mini sparkline, expandable chart
1.4.5 [ ] Muscle group highlighting
      → Flexors, extensors, agonist/antagonist pairs
1.4.6 [ ] Custom annotation points
      → User-added markers with notes
1.4.7 [ ] CHECKPOINT: Annotation system designed?
```

### 1.5 INTERACTION PATTERNS
```
1.5.1 [ ] Click to select muscle
      → Show details, isolate, highlight
1.5.2 [ ] Hover for quick info
      → Tooltip with name, activation, group
1.5.3 [ ] Multi-select muscles
      → Shift+click, lasso selection
1.5.4 [ ] Keyboard navigation
      → Tab through muscles, arrow keys
1.5.5 [ ] Touch/mobile interactions
      → Long press, pinch to isolate
1.5.6 [ ] Search/filter muscles
      → Text search, filter by group/activation level
1.5.7 [ ] CHECKPOINT: Interaction patterns complete?
```

### 1.6 TECHNICAL POSSIBILITIES
```
1.6.1 [ ] Shader-based coloring approaches
      → Vertex colors, UV mapping, procedural
1.6.2 [ ] Performance with many muscles (50+)
      → Instancing, LOD, culling strategies
1.6.3 [ ] Real-time data streaming
      → WebSocket, data buffer management
1.6.4 [ ] GPU vs CPU color calculation
      → Trade-offs, browser compatibility
1.6.5 [ ] Memory management for time-series
      → Circular buffers, compression
1.6.6 [ ] Browser compatibility matrix
      → WebGL 1 vs 2, Safari limitations
1.6.7 [ ] CHECKPOINT: Technical approach decided?
```

### 1.7 FEATURE SYNTHESIS
```
1.7.1 [ ] Must-have capabilities list
1.7.2 [ ] Nice-to-have enhancements list
1.7.3 [ ] Future possibilities list
1.7.4 [ ] Dependencies on other features
1.7.5 [ ] Estimated complexity (1-5)
1.7.6 [ ] GATE: Ready for PRD?
```

---

## FEATURE 2: TRAJECTORY PLAYBACK

### 2.1 EXISTING SOLUTIONS RESEARCH
```
2.1.1 [ ] How do video players handle timeline?
      → YouTube, Vimeo, professional NLEs
2.1.2 [ ] How do animation tools handle playback?
      → Blender, Maya, After Effects patterns
2.1.3 [ ] How do biomechanics tools handle motion?
      → Mokka, Visual3D, OpenSim
2.1.4 [ ] What frame rates are typical?
      → Motion capture: 100-500Hz, display: 30-60fps
2.1.5 [ ] What do researchers need for analysis?
      → Frame-by-frame, slow motion, loop regions
2.1.6 [ ] CHECKPOINT: Understand playback needs?
```

### 2.2 CUSTOMIZATION OPTIONS
```
2.2.1 [ ] Speed presets
      → 0.1x, 0.25x, 0.5x, 1x, 2x, 4x, custom
2.2.2 [ ] Loop modes
      → None, loop all, loop region, ping-pong
2.2.3 [ ] Playback direction
      → Forward, reverse, both
2.2.4 [ ] Timeline display formats
      → Frames, seconds, percentage, custom
2.2.5 [ ] Keyframe/event markers
      → User-defined points of interest
2.2.6 [ ] Auto-play options
      → On load, on hover, never
2.2.7 [ ] CHECKPOINT: Playback options complete?
```

### 2.3 QUALITY IMPROVEMENTS
```
2.3.1 [ ] Frame interpolation
      → Linear, cubic, spline for smooth slow-mo
2.3.2 [ ] Motion blur effect
      → Optional for fast movements
2.3.3 [ ] Ghost/onion skin mode
      → Show previous/next frames overlaid
2.3.4 [ ] Trail visualization
      → Path traces for selected points
2.3.5 [ ] Smooth scrubbing
      → No jitter when dragging timeline
2.3.6 [ ] Buffering strategy
      → Preload frames, streaming large files
2.3.7 [ ] CHECKPOINT: Quality features defined?
```

### 2.4 MARKERS & ANNOTATIONS
```
2.4.1 [ ] Timeline markers
      → Add named markers at specific times
2.4.2 [ ] Event annotations
      → Heel strike, toe off, peak force, etc.
2.4.3 [ ] Region selection
      → Define start/end for loop or export
2.4.4 [ ] Comparison markers
      → Mark points to compare across trials
2.4.5 [ ] Auto-detected events
      → Algorithm to find gait events, peaks
2.4.6 [ ] Marker export/import
      → Save/load annotation sets
2.4.7 [ ] CHECKPOINT: Timeline annotation complete?
```

### 2.5 INTERACTION PATTERNS
```
2.5.1 [ ] Scrub bar interaction
      → Click, drag, touch gestures
2.5.2 [ ] Keyboard shortcuts
      → Space (play/pause), arrows (frame step), J/K/L
2.5.3 [ ] Mouse wheel control
      → Scroll to scrub, with modifier for zoom
2.5.4 [ ] Touch gestures
      → Swipe to scrub, two-finger for speed
2.5.5 [ ] Timeline zoom
      → Zoom into region for precision
2.5.6 [ ] Waveform/thumbnail preview
      → Visual preview on hover
2.5.7 [ ] CHECKPOINT: Interaction patterns complete?
```

### 2.6 TECHNICAL POSSIBILITIES
```
2.6.1 [ ] Data formats supported
      → JSON, binary, streaming protocols
2.6.2 [ ] Large file handling
      → 10k+ frames, streaming, chunking
2.6.3 [ ] Synchronization with audio
      → If audio track exists
2.6.4 [ ] Multiple synchronized timelines
      → For comparison mode
2.6.5 [ ] Animation mixer architecture
      → Three.js AnimationMixer patterns
2.6.6 [ ] Worker thread for parsing
      → Keep UI responsive during load
2.6.7 [ ] CHECKPOINT: Technical approach decided?
```

### 2.7 FEATURE SYNTHESIS
```
2.7.1 [ ] Must-have capabilities list
2.7.2 [ ] Nice-to-have enhancements list
2.7.3 [ ] Future possibilities list
2.7.4 [ ] Dependencies on other features
2.7.5 [ ] Estimated complexity (1-5)
2.7.6 [ ] GATE: Ready for PRD?
```

---

## FEATURE 3: SHAREABLE URL

### 3.1 EXISTING SOLUTIONS RESEARCH
```
3.1.1 [ ] How do mapping tools share state?
      → Google Maps, Mapbox URL patterns
3.1.2 [ ] How do design tools share views?
      → Figma, Canva sharing mechanisms
3.1.3 [ ] How do code playgrounds share?
      → CodePen, JSFiddle, StackBlitz
3.1.4 [ ] URL length limitations by browser/server
      → Chrome, Firefox, Safari, nginx, CDN limits
3.1.5 [ ] Privacy considerations
      → What should/shouldn't be in URL
3.1.6 [ ] CHECKPOINT: Understand sharing patterns?
```

### 3.2 CUSTOMIZATION OPTIONS
```
3.2.1 [ ] What state to include
      → Camera, time, selection, settings, annotations
3.2.2 [ ] Share presets
      → "View only", "Full state", "Minimal"
3.2.3 [ ] Expiring links
      → Optional time-limited shares
3.2.4 [ ] Password protection
      → Optional access control
3.2.5 [ ] Custom short URLs
      → User-defined slugs
3.2.6 [ ] QR code generation
      → For print/presentation use
3.2.7 [ ] CHECKPOINT: Sharing options complete?
```

### 3.3 QUALITY IMPROVEMENTS
```
3.3.1 [ ] URL compression algorithms
      → lz-string, pako, custom encoding
3.3.2 [ ] Graceful degradation
      → Handle partial/corrupted state
3.3.3 [ ] Version compatibility
      → Handle old URLs after updates
3.3.4 [ ] Preview generation
      → Thumbnail for social sharing
3.3.5 [ ] Open Graph meta tags
      → Rich previews in Slack, Twitter, etc.
3.3.6 [ ] Loading experience
      → Progress indicator, skeleton UI
3.3.7 [ ] CHECKPOINT: Quality features defined?
```

### 3.4 MARKERS & ANNOTATIONS
```
3.4.1 [ ] Include annotations in share
      → Markers, labels, measurements
3.4.2 [ ] Comment/note attachment
      → "Look at this part" messages
3.4.3 [ ] Highlight specific element
      → Deep link to specific muscle/joint
3.4.4 [ ] Timestamp deep links
      → Link to specific moment in time
3.4.5 [ ] View angle presets
      → Front, side, top + custom
3.4.6 [ ] CHECKPOINT: Annotation sharing complete?
```

### 3.5 INTERACTION PATTERNS
```
3.5.1 [ ] Copy link button
      → One-click copy to clipboard
3.5.2 [ ] Share menu
      → Email, social, embed code options
3.5.3 [ ] "Share this view" contextual action
      → Right-click or toolbar button
3.5.4 [ ] Notification of shared link
      → Toast confirmation
3.5.5 [ ] Link management
      → View/delete shared links (if stored)
3.5.6 [ ] CHECKPOINT: Interaction patterns complete?
```

### 3.6 TECHNICAL POSSIBILITIES
```
3.6.1 [ ] Client-only vs server storage
      → Trade-offs, hybrid approach
3.6.2 [ ] State serialization format
      → JSON schema, binary, protobuf
3.6.3 [ ] Compression benchmarks
      → Size vs speed trade-offs
3.6.4 [ ] Hash vs query parameter
      → URL fragment (#) vs query (?)
3.6.5 [ ] CDN/edge caching
      → For stored states
3.6.6 [ ] Analytics tracking
      → Track shared link opens
3.6.7 [ ] CHECKPOINT: Technical approach decided?
```

### 3.7 FEATURE SYNTHESIS
```
3.7.1 [ ] Must-have capabilities list
3.7.2 [ ] Nice-to-have enhancements list
3.7.3 [ ] Future possibilities list
3.7.4 [ ] Dependencies on other features
3.7.5 [ ] Estimated complexity (1-5)
3.7.6 [ ] GATE: Ready for PRD?
```

---

## FEATURE 4: BIOMECHANICS DATA IMPORT

### 4.1 EXISTING SOLUTIONS RESEARCH
```
4.1.1 [ ] C3D format deep dive
      → Structure, markers, analog data, events
4.1.2 [ ] BVH format deep dive
      → Hierarchy, motion data, limitations
4.1.3 [ ] OpenCap output format
      → What data is available, API access
4.1.4 [ ] TRC/MOT formats (OpenSim)
      → Marker trajectories, motion files
4.1.5 [ ] FBX motion data
      → Animation curves, skeleton binding
4.1.6 [ ] CSV/JSON custom formats
      → Flexible import patterns
4.1.7 [ ] What formats do researchers actually use?
      → Survey existing workflows
4.1.8 [ ] CHECKPOINT: Format landscape understood?
```

### 4.2 CUSTOMIZATION OPTIONS
```
4.2.1 [ ] Coordinate system mapping
      → Y-up vs Z-up, handedness
4.2.2 [ ] Unit conversion
      → mm, cm, m, inches
4.2.3 [ ] Frame rate handling
      → Resample, interpolate, preserve
4.2.4 [ ] Marker naming conventions
      → Map to standard skeleton
4.2.5 [ ] Missing data handling
      → Interpolate, hide, flag
4.2.6 [ ] Data filtering options
      → Butterworth, moving average
4.2.7 [ ] CHECKPOINT: Import options complete?
```

### 4.3 QUALITY IMPROVEMENTS
```
4.3.1 [ ] Format auto-detection
      → Identify format from file content
4.3.2 [ ] Validation and error reporting
      → Clear messages for malformed files
4.3.3 [ ] Large file handling
      → Streaming, chunked loading
4.3.4 [ ] Preview before full import
      → Quick scan, show summary
4.3.5 [ ] Batch import
      → Multiple files, trials
4.3.6 [ ] Import history
      → Re-import with same settings
4.3.7 [ ] CHECKPOINT: Quality features defined?
```

### 4.4 MARKERS & ANNOTATIONS
```
4.4.1 [ ] Marker visualization
      → Point cloud, spheres, labels
4.4.2 [ ] Marker trajectory trails
      → Show path over time
4.4.3 [ ] Marker selection
      → Click to see marker data
4.4.4 [ ] Marker-to-skeleton mapping
      → Visual connection lines
4.4.5 [ ] Gap/occlusion indicators
      → Show where data is missing
4.4.6 [ ] Ground reaction force markers
      → Force plate data visualization
4.4.7 [ ] CHECKPOINT: Marker system designed?
```

### 4.5 INTERACTION PATTERNS
```
4.5.1 [ ] Drag and drop import
      → Drop zone UI
4.5.2 [ ] File picker
      → System dialog
4.5.3 [ ] URL import
      → Paste link to file
4.5.4 [ ] Cloud storage integration
      → Google Drive, Dropbox
4.5.5 [ ] Recent files
      → Quick access to previous imports
4.5.6 [ ] Import wizard
      → Step-by-step for complex formats
4.5.7 [ ] CHECKPOINT: Interaction patterns complete?
```

### 4.6 TECHNICAL POSSIBILITIES
```
4.6.1 [ ] Parser libraries available
      → c3d.js, bvh-parser, custom
4.6.2 [ ] WebAssembly for heavy parsing
      → Performance for large files
4.6.3 [ ] Worker thread architecture
      → Non-blocking import
4.6.4 [ ] IndexedDB caching
      → Cache parsed data locally
4.6.5 [ ] Streaming parsers
      → Process while downloading
4.6.6 [ ] Memory limits
      → Browser constraints, optimization
4.6.7 [ ] CHECKPOINT: Technical approach decided?
```

### 4.7 FEATURE SYNTHESIS
```
4.7.1 [ ] Must-have capabilities list
4.7.2 [ ] Nice-to-have enhancements list
4.7.3 [ ] Future possibilities list
4.7.4 [ ] Dependencies on other features
4.7.5 [ ] Estimated complexity (1-5)
4.7.6 [ ] GATE: Ready for PRD?
```

---

## FEATURE 5: FORCE VECTOR VISUALIZATION

### 5.1 EXISTING SOLUTIONS RESEARCH
```
5.1.1 [ ] How do engineering tools show forces?
      → FEA software, CAD tools
5.1.2 [ ] How do biomechanics tools show forces?
      → Visual3D, Mokka, OpenSim
5.1.3 [ ] Force types in biomechanics
      → GRF, joint reaction, muscle, external
5.1.4 [ ] Visualization conventions
      → Arrow styles, colors, scaling
5.1.5 [ ] What insights do forces provide?
      → Clinical/research applications
5.1.6 [ ] CHECKPOINT: Force viz landscape understood?
```

### 5.2 CUSTOMIZATION OPTIONS
```
5.2.1 [ ] Arrow style presets
      → Classic, cone, line, ribbon
5.2.2 [ ] Color coding schemes
      → By magnitude, by type, by direction
5.2.3 [ ] Scale factor controls
      → Manual, auto-scale, log scale
5.2.4 [ ] Component display
      → X/Y/Z separately or combined
5.2.5 [ ] Force type filtering
      → Show/hide specific force types
5.2.6 [ ] Reference frame selection
      → Global, local, segment-based
5.2.7 [ ] CHECKPOINT: Customization options complete?
```

### 5.3 QUALITY IMPROVEMENTS
```
5.3.1 [ ] Smooth arrow animation
      → Interpolation for changing magnitudes
5.3.2 [ ] Depth cues
      → Perspective, occlusion, shadows
5.3.3 [ ] Clarity at different scales
      → Adaptive rendering
5.3.4 [ ] Force plate visualization
      → Show plate boundaries, CoP
5.3.5 [ ] Vector field mode
      → Distributed forces as field
5.3.6 [ ] Publication-quality export
      → Clean arrows for papers
5.3.7 [ ] CHECKPOINT: Quality features defined?
```

### 5.4 MARKERS & ANNOTATIONS
```
5.4.1 [ ] Force magnitude labels
      → Newtons, body weights, percentage
5.4.2 [ ] Direction indicators
      → Angle displays
5.4.3 [ ] Peak force markers
      → Automatic detection, highlight
5.4.4 [ ] Force vs time mini-graphs
      → Sparklines at application points
5.4.5 [ ] Center of pressure path
      → CoP trajectory on force plate
5.4.6 [ ] CHECKPOINT: Annotation system designed?
```

### 5.5 INTERACTION PATTERNS
```
5.5.1 [ ] Click force vector for details
      → Popup with full data
5.5.2 [ ] Hover to highlight
      → Emphasize selected force
5.5.3 [ ] Toggle visibility by type
      → Quick filter buttons
5.5.4 [ ] Drag to adjust scale
      → Direct manipulation
5.5.5 [ ] Lock/unlock scaling
      → Maintain scale across time
5.5.6 [ ] CHECKPOINT: Interaction patterns complete?
```

### 5.6 TECHNICAL POSSIBILITIES
```
5.6.1 [ ] ArrowHelper vs custom geometry
      → Three.js approaches
5.6.2 [ ] Instanced rendering
      → Many arrows efficiently
5.6.3 [ ] Real-time data handling
      → Streaming force data
5.6.4 [ ] Coordinate transformations
      → Force plate to global to local
5.6.5 [ ] GPU-based arrow rendering
      → Geometry shaders
5.6.6 [ ] CHECKPOINT: Technical approach decided?
```

### 5.7 FEATURE SYNTHESIS
```
5.7.1 [ ] Must-have capabilities list
5.7.2 [ ] Nice-to-have enhancements list
5.7.3 [ ] Future possibilities list
5.7.4 [ ] Dependencies on other features
5.7.5 [ ] Estimated complexity (1-5)
5.7.6 [ ] GATE: Ready for PRD?
```

---

## FEATURE 6: COMPARISON VIEW

### 6.1 EXISTING SOLUTIONS RESEARCH
```
6.1.1 [ ] How do video tools compare clips?
      → Premiere, DaVinci split screens
6.1.2 [ ] How do image tools compare?
      → Lightroom, slider comparisons
6.1.3 [ ] How do gait labs compare trials?
      → Existing clinical workflows
6.1.4 [ ] Overlay vs side-by-side preferences
      → User research insights
6.1.5 [ ] What gets compared in biomechanics?
      → Pre/post, left/right, patient/norm
6.1.6 [ ] CHECKPOINT: Comparison needs understood?
```

### 6.2 CUSTOMIZATION OPTIONS
```
6.2.1 [ ] Layout modes
      → Side-by-side, top-bottom, overlay, quad
6.2.2 [ ] Synchronization options
      → Time-synced, event-synced, manual
6.2.3 [ ] Overlay blend modes
      → Opacity, difference, color-coded
6.2.4 [ ] Ghost/silhouette mode
      → Show one as outline over other
6.2.5 [ ] Mirror mode for bilateral
      → Flip one side for comparison
6.2.6 [ ] Independent vs linked cameras
      → Same angle or different
6.2.7 [ ] CHECKPOINT: Comparison modes complete?
```

### 6.3 QUALITY IMPROVEMENTS
```
6.3.1 [ ] Smooth layout transitions
      → Animate between modes
6.3.2 [ ] Color differentiation
      → Distinct colors for each model
6.3.3 [ ] Difference highlighting
      → Show where models diverge
6.3.4 [ ] Quantitative difference metrics
      → Calculate and display deviation
6.3.5 [ ] Normalization options
      → Scale to same size, align root
6.3.6 [ ] CHECKPOINT: Quality features defined?
```

### 6.4 MARKERS & ANNOTATIONS
```
6.4.1 [ ] Comparison labels
      → "Before/After", "Left/Right", custom
6.4.2 [ ] Difference measurements
      → Angle deviation, position offset
6.4.3 [ ] Sync point markers
      → Mark corresponding events
6.4.4 [ ] Deviation graphs
      → Time-series of difference
6.4.5 [ ] Statistical overlays
      → Mean, SD bands for norms
6.4.6 [ ] CHECKPOINT: Annotation system designed?
```

### 6.5 INTERACTION PATTERNS
```
6.5.1 [ ] Drag divider for split view
      → Adjust split position
6.5.2 [ ] Swap sides
      → Quick toggle which is which
6.5.3 [ ] Toggle sync on/off
      → Button to lock/unlock time
6.5.4 [ ] Focus mode
      → Temporarily view one full-screen
6.5.5 [ ] Comparison presets
      → Save common comparison setups
6.5.6 [ ] CHECKPOINT: Interaction patterns complete?
```

### 6.6 TECHNICAL POSSIBILITIES
```
6.6.1 [ ] Multiple canvas approach
      → Separate WebGL contexts
6.6.2 [ ] Single canvas with viewports
      → Scissor test rendering
6.6.3 [ ] Shared vs separate scenes
      → Memory vs isolation trade-offs
6.6.4 [ ] Sync mechanism
      → Event bus, shared clock
6.6.5 [ ] Performance with two models
      → GPU memory, draw calls
6.6.6 [ ] CHECKPOINT: Technical approach decided?
```

### 6.7 FEATURE SYNTHESIS
```
6.7.1 [ ] Must-have capabilities list
6.7.2 [ ] Nice-to-have enhancements list
6.7.3 [ ] Future possibilities list
6.7.4 [ ] Dependencies on other features
6.7.5 [ ] Estimated complexity (1-5)
6.7.6 [ ] GATE: Ready for PRD?
```

---

## FEATURE 7: EMBED/IFRAME COMPONENT

### 7.1 EXISTING SOLUTIONS RESEARCH
```
7.1.1 [ ] How does YouTube embed work?
      → iframe API, parameters, events
7.1.2 [ ] How does Sketchfab embed work?
      → 3D viewer embedding patterns
7.1.3 [ ] How do LMS embeds work?
      → LTI, SCORM, xAPI
7.1.4 [ ] Security considerations
      → CSP, sandboxing, clickjacking
7.1.5 [ ] Responsive embed challenges
      → Sizing, aspect ratio
7.1.6 [ ] CHECKPOINT: Embed patterns understood?
```

### 7.2 CUSTOMIZATION OPTIONS
```
7.2.1 [ ] UI element visibility
      → Controls, toolbar, logo, watermark
7.2.2 [ ] Initial state parameters
      → Camera, time, selection via URL
7.2.3 [ ] Interaction permissions
      → Allow rotate, zoom, play, none
7.2.4 [ ] Theme/branding options
      → Colors, custom CSS
7.2.5 [ ] Size presets
      → Fixed, responsive, fullscreen option
7.2.6 [ ] Autoplay options
      → On load, on scroll into view
7.2.7 [ ] CHECKPOINT: Embed options complete?
```

### 7.3 QUALITY IMPROVEMENTS
```
7.3.1 [ ] Load time optimization
      → Lazy loading, progressive
7.3.2 [ ] Placeholder/skeleton
      → Before full load
7.3.3 [ ] Offline fallback
      → Static image if no connection
7.3.4 [ ] Bandwidth adaptation
      → Quality based on connection
7.3.5 [ ] Mobile optimization
      → Touch-friendly, reduced complexity
7.3.6 [ ] CHECKPOINT: Quality features defined?
```

### 7.4 MARKERS & ANNOTATIONS
```
7.4.1 [ ] Pre-set annotations
      → Embedded with specific labels
7.4.2 [ ] Interactive hotspots
      → Click for more info
7.4.3 [ ] Callout overlays
      → Text boxes pointing to features
7.4.4 [ ] Caption/subtitle support
      → Timed text overlays
7.4.5 [ ] CHECKPOINT: Annotation in embeds complete?
```

### 7.5 INTERACTION PATTERNS
```
7.5.1 [ ] postMessage API
      → Communicate with parent page
7.5.2 [ ] Event callbacks
      → onReady, onPlay, onTimeUpdate, etc.
7.5.3 [ ] Method API
      → play(), pause(), seekTo(), etc.
7.5.4 [ ] Fullscreen toggle
      → Expand to full browser
7.5.5 [ ] Link to full app
      → "Open in MeshMotion" button
7.5.6 [ ] CHECKPOINT: Interaction API complete?
```

### 7.6 TECHNICAL POSSIBILITIES
```
7.6.1 [ ] iframe vs Web Component
      → Encapsulation approaches
7.6.2 [ ] Bundle size optimization
      → Minimal embed bundle
7.6.3 [ ] CDN distribution
      → Global edge caching
7.6.4 [ ] Version management
      → Embed version stability
7.6.5 [ ] Usage tracking
      → Analytics for embeds
7.6.6 [ ] CHECKPOINT: Technical approach decided?
```

### 7.7 FEATURE SYNTHESIS
```
7.7.1 [ ] Must-have capabilities list
7.7.2 [ ] Nice-to-have enhancements list
7.7.3 [ ] Future possibilities list
7.7.4 [ ] Dependencies on other features
7.7.5 [ ] Estimated complexity (1-5)
7.7.6 [ ] GATE: Ready for PRD?
```

---

## FEATURE 8: LIVE POSE INPUT

### 8.1 EXISTING SOLUTIONS RESEARCH
```
8.1.1 [ ] MediaPipe pose estimation capabilities
      → Landmarks, confidence, speed
8.1.2 [ ] Other pose libraries
      → TensorFlow.js, PoseNet, MoveNet
8.1.3 [ ] Existing webcam-to-avatar apps
      → Snap camera, vTuber tools
8.1.4 [ ] Accuracy limitations
      → Depth, occlusion, clothing
8.1.5 [ ] Research on pose-to-muscle mapping
      → Academic approaches
8.1.6 [ ] CHECKPOINT: Pose tech understood?
```

### 8.2 CUSTOMIZATION OPTIONS
```
8.2.1 [ ] Camera selection
      → Choose input device
8.2.2 [ ] Mirror mode
      → Flip horizontal
8.2.3 [ ] Smoothing level
      → Jitter reduction vs latency
8.2.4 [ ] Bone mapping customization
      → Map landmarks to skeleton
8.2.5 [ ] Calibration workflow
      → T-pose, range of motion
8.2.6 [ ] Confidence threshold
      → Hide low-confidence estimates
8.2.7 [ ] CHECKPOINT: Pose options complete?
```

### 8.3 QUALITY IMPROVEMENTS
```
8.3.1 [ ] Temporal smoothing
      → Reduce jitter without lag
8.3.2 [ ] Pose prediction
      → Interpolate during occlusion
8.3.3 [ ] Multi-person handling
      → Track specific person
8.3.4 [ ] Depth estimation
      → Improve 3D from 2D
8.3.5 [ ] Lighting adaptation
      → Handle poor lighting
8.3.6 [ ] CHECKPOINT: Quality features defined?
```

### 8.4 MARKERS & ANNOTATIONS
```
8.4.1 [ ] Landmark visualization
      → Show detected points
8.4.2 [ ] Confidence indicators
      → Color-code by certainty
8.4.3 [ ] Skeleton overlay on video
      → Show detection on camera feed
8.4.4 [ ] Real-time metrics
      → Joint angles, velocities
8.4.5 [ ] Recording with timestamps
      → Save pose session
8.4.6 [ ] CHECKPOINT: Pose annotation designed?
```

### 8.5 INTERACTION PATTERNS
```
8.5.1 [ ] Camera permission flow
      → Request, handle denial
8.5.2 [ ] Start/stop capture
      → Clear controls
8.5.3 [ ] Picture-in-picture camera
      → Show feed while viewing model
8.5.4 [ ] Record session
      → Capture for later analysis
8.5.5 [ ] Privacy mode
      → Process locally only
8.5.6 [ ] CHECKPOINT: Interaction patterns complete?
```

### 8.6 TECHNICAL POSSIBILITIES
```
8.6.1 [ ] WebRTC camera access
      → getUserMedia API
8.6.2 [ ] MediaPipe WASM/WebGL
      → Performance optimization
8.6.3 [ ] Worker thread processing
      → Keep UI responsive
8.6.4 [ ] Pose data format
      → Internal representation
8.6.5 [ ] Latency measurement
      → End-to-end delay
8.6.6 [ ] Mobile camera support
      → Front vs back camera
8.6.7 [ ] CHECKPOINT: Technical approach decided?
```

### 8.7 FEATURE SYNTHESIS
```
8.7.1 [ ] Must-have capabilities list
8.7.2 [ ] Nice-to-have enhancements list
8.7.3 [ ] Future possibilities list
8.7.4 [ ] Dependencies on other features
8.7.5 [ ] Estimated complexity (1-5)
8.7.6 [ ] GATE: Ready for PRD?
```

---

## FEATURE 9: MARKERS & ANNOTATIONS

### 9.1 EXISTING SOLUTIONS RESEARCH
```
9.1.1 [ ] How do CAD tools handle annotations?
      → SolidWorks, AutoCAD patterns
9.1.2 [ ] How do medical imaging tools annotate?
      → DICOM viewers, 3D Slicer
9.1.3 [ ] How do video tools add markers?
      → Premiere, Frame.io
9.1.4 [ ] Measurement tools in 3D viewers
      → Sketchfab, model viewers
9.1.5 [ ] Research/clinical annotation needs
      → What do professionals need?
9.1.6 [ ] CHECKPOINT: Annotation patterns understood?
```

### 9.2 CUSTOMIZATION OPTIONS
```
9.2.1 [ ] Marker types
      → Point, line, angle, area, volume
9.2.2 [ ] Label styles
      → Font, size, color, background
9.2.3 [ ] Leader line options
      → Style, color, attachment
9.2.4 [ ] Units and precision
      → mm/cm/m, decimal places
9.2.5 [ ] Annotation layers
      → Group, show/hide sets
9.2.6 [ ] Templates/presets
      → Common annotation sets
9.2.7 [ ] CHECKPOINT: Annotation options complete?
```

### 9.3 QUALITY IMPROVEMENTS
```
9.3.1 [ ] Occlusion handling
      → Labels in front, behind options
9.3.2 [ ] Readability at any zoom
      → Scale-independent text
9.3.3 [ ] Smart label placement
      → Avoid overlaps automatically
9.3.4 [ ] High-DPI support
      → Crisp text on retina displays
9.3.5 [ ] Smooth animation
      → Fade in/out, transitions
9.3.6 [ ] CHECKPOINT: Quality features defined?
```

### 9.4 MEASUREMENT TOOLS
```
9.4.1 [ ] Distance measurement
      → Point to point
9.4.2 [ ] Angle measurement
      → Joint angles, segment angles
9.4.3 [ ] Area measurement
      → Surface selection
9.4.4 [ ] Circumference
      → Around limbs
9.4.5 [ ] Range of motion
      → Min/max angle during motion
9.4.6 [ ] Velocity measurement
      → Speed of point over time
9.4.7 [ ] CHECKPOINT: Measurement tools complete?
```

### 9.5 INTERACTION PATTERNS
```
9.5.1 [ ] Point-and-click placement
      → Click to add marker
9.5.2 [ ] Snap to surface/vertex
      → Precise placement
9.5.3 [ ] Drag to reposition
      → Adjust after placing
9.5.4 [ ] Edit annotation text
      → Double-click to edit
9.5.5 [ ] Delete annotations
      → Select and delete
9.5.6 [ ] Annotation toolbar
      → Tool selection UI
9.5.7 [ ] CHECKPOINT: Interaction patterns complete?
```

### 9.6 TECHNICAL POSSIBILITIES
```
9.6.1 [ ] HTML overlay vs WebGL
      → CSS3D vs canvas rendering
9.6.2 [ ] Performance with many annotations
      → DOM vs canvas limits
9.6.3 [ ] Annotation data format
      → JSON schema for save/load
9.6.4 [ ] Raycasting for placement
      → Surface intersection
9.6.5 [ ] Persistence storage
      → Local vs cloud
9.6.6 [ ] CHECKPOINT: Technical approach decided?
```

### 9.7 FEATURE SYNTHESIS
```
9.7.1 [ ] Must-have capabilities list
9.7.2 [ ] Nice-to-have enhancements list
9.7.3 [ ] Future possibilities list
9.7.4 [ ] Dependencies on other features
9.7.5 [ ] Estimated complexity (1-5)
9.7.6 [ ] GATE: Ready for PRD?
```

---

## FEATURE 10: EXPORT & SCREENSHOT

### 10.1 EXISTING SOLUTIONS RESEARCH
```
10.1.1 [ ] How do 3D tools export images?
      → Blender, Maya render settings
10.1.2 [ ] How do web tools capture canvas?
      → html2canvas, native APIs
10.1.3 [ ] Video export in browsers
      → MediaRecorder, ffmpeg.wasm
10.1.4 [ ] Publication requirements
      → Journal figure guidelines
10.1.5 [ ] What formats do researchers need?
      → PNG, SVG, PDF, TIFF, MP4
10.1.6 [ ] CHECKPOINT: Export needs understood?
```

### 10.2 CUSTOMIZATION OPTIONS
```
10.2.1 [ ] Resolution presets
      → 1x, 2x, 4x, custom DPI
10.2.2 [ ] Aspect ratio options
      → 16:9, 4:3, 1:1, custom
10.2.3 [ ] Background options
      → Transparent, color, gradient
10.2.4 [ ] Include/exclude UI
      → Clean render vs with controls
10.2.5 [ ] Watermark options
      → Add/remove branding
10.2.6 [ ] Annotation visibility
      → Include labels in export
10.2.7 [ ] CHECKPOINT: Export options complete?
```

### 10.3 QUALITY IMPROVEMENTS
```
10.3.1 [ ] Anti-aliasing for export
      → Higher quality than display
10.3.2 [ ] HDR/wide gamut support
      → For professional workflows
10.3.3 [ ] Lossless formats
      → PNG, TIFF options
10.3.4 [ ] Video encoding quality
      → Bitrate, codec options
10.3.5 [ ] Batch export
      → Multiple angles/frames
10.3.6 [ ] CHECKPOINT: Quality features defined?
```

### 10.4 VIDEO EXPORT
```
10.4.1 [ ] Frame rate options
      → 24, 30, 60 fps
10.4.2 [ ] Duration selection
      → Full, region, custom
10.4.3 [ ] Codec options
      → H.264, WebM, GIF
10.4.4 [ ] Audio inclusion
      → If audio track exists
10.4.5 [ ] Progress indication
      → Export progress bar
10.4.6 [ ] CHECKPOINT: Video export designed?
```

### 10.5 INTERACTION PATTERNS
```
10.5.1 [ ] Quick screenshot button
      → One-click capture
10.5.2 [ ] Export dialog
      → Settings before export
10.5.3 [ ] Preview before export
      → See result before saving
10.5.4 [ ] Drag to save
      → Drag image from canvas
10.5.5 [ ] Export history
      → Recent exports
10.5.6 [ ] CHECKPOINT: Interaction patterns complete?
```

### 10.6 TECHNICAL POSSIBILITIES
```
10.6.1 [ ] Canvas toDataURL vs toBlob
      → Performance, format support
10.6.2 [ ] WebGL readPixels
      → High-res capture
10.6.3 [ ] OffscreenCanvas
      → Background rendering
10.6.4 [ ] ffmpeg.wasm for video
      → Browser-based encoding
10.6.5 [ ] Web Workers for encoding
      → Non-blocking export
10.6.6 [ ] CHECKPOINT: Technical approach decided?
```

### 10.7 FEATURE SYNTHESIS
```
10.7.1 [ ] Must-have capabilities list
10.7.2 [ ] Nice-to-have enhancements list
10.7.3 [ ] Future possibilities list
10.7.4 [ ] Dependencies on other features
10.7.5 [ ] Estimated complexity (1-5)
10.7.6 [ ] GATE: Ready for PRD?
```

---

## FEATURE 11: REST API

### 11.1 EXISTING SOLUTIONS RESEARCH
```
11.1.1 [ ] How do 3D viewer APIs work?
      → Sketchfab, BioDigital API patterns
11.1.2 [ ] Health tech API standards
      → FHIR, HL7, SMART on FHIR
11.1.3 [ ] Developer experience best practices
      → Stripe, Twilio API design
11.1.4 [ ] Authentication patterns
      → API keys, OAuth, JWT
11.1.5 [ ] Rate limiting approaches
      → Tiers, quotas, throttling
11.1.6 [ ] CHECKPOINT: API patterns understood?
```

### 11.2 CUSTOMIZATION OPTIONS
```
11.2.1 [ ] API key scopes
      → Read, write, admin levels
11.2.2 [ ] Webhook configuration
      → Events to notify
11.2.3 [ ] Response formats
      → JSON, Protocol Buffers
11.2.4 [ ] Pagination options
      → Cursor, offset, page size
11.2.5 [ ] Field selection
      → GraphQL-style field picking
11.2.6 [ ] CHECKPOINT: API options complete?
```

### 11.3 QUALITY IMPROVEMENTS
```
11.3.1 [ ] Versioning strategy
      → URL vs header versioning
11.3.2 [ ] Error response format
      → Consistent error schema
11.3.3 [ ] Request validation
      → Schema validation, clear errors
11.3.4 [ ] Caching headers
      → ETags, Cache-Control
11.3.5 [ ] Compression
      → gzip, brotli responses
11.3.6 [ ] CHECKPOINT: API quality defined?
```

### 11.4 DOCUMENTATION
```
11.4.1 [ ] OpenAPI/Swagger spec
      → Machine-readable docs
11.4.2 [ ] Interactive playground
      → Try API in browser
11.4.3 [ ] Code examples
      → Python, JS, cURL
11.4.4 [ ] Quick start guide
      → 5-minute integration
11.4.5 [ ] Changelog
      → Version history
11.4.6 [ ] CHECKPOINT: Documentation complete?
```

### 11.5 ENDPOINTS DESIGN
```
11.5.1 [ ] Models CRUD
      → Create, read, update, delete
11.5.2 [ ] Visualization state
      → Get/set view parameters
11.5.3 [ ] Export endpoints
      → Trigger screenshot/video
11.5.4 [ ] Share/embed generation
      → Create shareable links
11.5.5 [ ] Webhook management
      → Subscribe to events
11.5.6 [ ] CHECKPOINT: Endpoint design complete?
```

### 11.6 TECHNICAL POSSIBILITIES
```
11.6.1 [ ] REST vs GraphQL
      → Trade-offs
11.6.2 [ ] Serverless implementation
      → Edge functions, workers
11.6.3 [ ] Database backend
      → PostgreSQL, MongoDB, etc.
11.6.4 [ ] CDN for assets
      → Model file distribution
11.6.5 [ ] Monitoring and logging
      → Request tracking
11.6.6 [ ] CHECKPOINT: Technical approach decided?
```

### 11.7 FEATURE SYNTHESIS
```
11.7.1 [ ] Must-have capabilities list
11.7.2 [ ] Nice-to-have enhancements list
11.7.3 [ ] Future possibilities list
11.7.4 [ ] Dependencies on other features
11.7.5 [ ] Estimated complexity (1-5)
11.7.6 [ ] GATE: Ready for PRD?
```

---

## FEATURE 12: LMS INTEGRATION

### 12.1 EXISTING SOLUTIONS RESEARCH
```
12.1.1 [ ] LTI 1.3 specification
      → How it works, requirements
12.1.2 [ ] SCORM overview
      → Progress tracking, completion
12.1.3 [ ] xAPI (Tin Can) possibilities
      → Learning analytics
12.1.4 [ ] Existing LMS integrations
      → BioDigital Courseware, Visible Body
12.1.5 [ ] What do educators need?
      → Assignment, grading, analytics
12.1.6 [ ] CHECKPOINT: LMS landscape understood?
```

### 12.2 CUSTOMIZATION OPTIONS
```
12.2.1 [ ] Assignment types
      → View, interact, quiz, explore
12.2.2 [ ] Grading modes
      → Completion, time spent, quiz score
12.2.3 [ ] Content restrictions
      → Lock features for students
12.2.4 [ ] Progress indicators
      → What counts as progress
12.2.5 [ ] Instructor dashboard
      → View student activity
12.2.6 [ ] CHECKPOINT: LMS options complete?
```

### 12.3 QUALITY IMPROVEMENTS
```
12.3.1 [ ] Reliable grade passback
      → Handle network issues
12.3.2 [ ] Detailed activity logging
      → What students did
12.3.3 [ ] Accessibility compliance
      → WCAG 2.1 for education
12.3.4 [ ] Mobile LMS support
      → Works in Canvas app, etc.
12.3.5 [ ] Offline handling
      → Sync when reconnected
12.3.6 [ ] CHECKPOINT: Quality features defined?
```

### 12.4 ASSESSMENT FEATURES
```
12.4.1 [ ] Identify anatomy quizzes
      → Click the bicep
12.4.2 [ ] Measurement quizzes
      → Measure this angle
12.4.3 [ ] Free-form exploration
      → Open-ended discovery
12.4.4 [ ] Guided tutorials
      → Step-by-step lessons
12.4.5 [ ] Quiz builder for instructors
      → Create custom assessments
12.4.6 [ ] CHECKPOINT: Assessment designed?
```

### 12.5 INTERACTION PATTERNS
```
12.5.1 [ ] Single sign-on flow
      → From LMS to viewer
12.5.2 [ ] Assignment launch
      → Open specific content
12.5.3 [ ] Progress saving
      → Resume where left off
12.5.4 [ ] Submit for grading
      → Mark assignment complete
12.5.5 [ ] Return to LMS
      → Navigate back
12.5.6 [ ] CHECKPOINT: Interaction patterns complete?
```

### 12.6 TECHNICAL POSSIBILITIES
```
12.6.1 [ ] LTI libraries available
      → Node.js, Python options
12.6.2 [ ] Platform certification
      → Canvas, Blackboard, Moodle
12.6.3 [ ] Key management
      → Secure credential storage
12.6.4 [ ] Deep linking
      → Link to specific content
12.6.5 [ ] Roster sync
      → Import class lists
12.6.6 [ ] CHECKPOINT: Technical approach decided?
```

### 12.7 FEATURE SYNTHESIS
```
12.7.1 [ ] Must-have capabilities list
12.7.2 [ ] Nice-to-have enhancements list
12.7.3 [ ] Future possibilities list
12.7.4 [ ] Dependencies on other features
12.7.5 [ ] Estimated complexity (1-5)
12.7.6 [ ] GATE: Ready for PRD?
```

---

## RESEARCH FINDINGS DATABASE

### Feature 1: Muscle Activation Heatmap

**Existing Solutions:**
- BioDigital Human: 8,000+ structures, static anatomy only, no dynamic activation
- Muscle & Motion: 1,200+ exercises with primary/secondary muscle highlighting
- BodyViz: Density-based filtering, can highlight muscles by tissue type
- Anatomy.app: Color-coded landmarks, no activation data

**Color Scales (Accessibility):**
- AVOID: Red/green combinations (8% males are colorblind)
- RECOMMENDED: Blue/orange, blue/yellow (cividis), viridis, plasma
- Scientific standard: Perceptually uniform colormaps
- Best for heatmaps: Two complementary colors + white/black middle
- Tools: Scientific colour maps (fabiocrameri.ch) - free, citable

**Technical Approach (WebGL):**
- webgl-heatmap.js: High-performance library, intensity 0-1 per point
- Fragment shader: mix() function for gradient interpolation
- Performance: <100ms for 1.5M points with GPU processing
- Three.js: ShaderMaterial with uniforms for colors + intensity
- Instanced rendering for many muscles efficiently
- Trade-off: GPU animation = upfront cost, but smooth runtime

**EMG Biofeedback Patterns:**
- Real-time visual/auditory feedback of muscle activity
- Augmented Reality overlays emerging (research stage)
- mTrigger: "makes muscle activation visible and measurable"
- Clinical use: Rehab protocols, motor programming

**Key Insight:** NO web tool does dynamic muscle activation visualization - this is whitespace.

---

### Feature 2: Trajectory Playback

**Best Practices (Video Players):**
- Controls: Bottom center, large clickable buttons
- Scrubbing: "Swifter" technique with thumbnail grid = 48% faster navigation
- Frame-accurate: Difficult in browsers, need cached range
- Scroll-based scrubbing: Control distance, trigger points, smoothing
- Chapter markers: Enable jumping to timestamps
- Keyboard: Left/right arrows for frame step, space for play/pause

**Performance Considerations:**
- Frame-accurate scrubbing is hard in browsers vs desktop apps
- Solution: Preload/cache frames, use thumbnail previews on hover
- Mobile: Larger buttons, swipe gestures, sticky controls
- Motion capture data: 100-500Hz capture, display at 30-60fps

**Ghost/Onion Skin:**
- Show previous/next frames overlaid
- Common in animation software (Blender, Maya)
- Trail visualization for point trajectories

---

### Feature 3: Shareable URL

**lz-string Library:**
- LZW compression algorithm (1984, Lempel-Ziv-Welch)
- compressToEncodedURIComponent() for URL-safe output
- Typical: 400 bytes → ~180 bytes compressed
- 15k+ GitHub stars, mature and stable

**URL Limits:**
- Chrome: ~32KB practical limit
- Safari: More restrictive
- Safe target: <2000 characters for universal compatibility

**Best Practices:**
- Use hash (#) for client-only state, query (?) for server-aware
- Validate origins for security
- Fallback: Server-side storage with short ID for large states
- Open Graph meta tags for rich previews in Slack/Twitter

**Pattern Examples:**
- Google Maps: Zoom, center, markers in URL
- CodePen/JSFiddle: Full code state in URL
- Figma: Share links with view state

---

### Feature 4: Biomechanics Data Import

**C3D Format:**
- Standard since mid-1980s (NIH Bethesda)
- Public domain, binary format
- Contains: 3D coordinates, analog data (force plates, EMG)
- NOT skeleton-based (raw marker data)
- **NO JavaScript parser exists** - need to create or use WASM

**Available Parsers (other languages):**
| Library | Language | Notes |
|---------|----------|-------|
| EZC3D | C++/Python/MATLAB | Most comprehensive |
| BTK | C++/Python/MATLAB | Used by OpenSim |
| Pyomeca | Python | Easy read/write |
| c3dio | Rust | Modern implementation |

**BVH Format:**
- Hierarchy-based (skeleton)
- Text format, easier to parse
- JavaScript parsers exist

**OpenCap:**
- Cloud-based, smartphone video input
- Outputs muscle activation data
- API access available

**Strategy for MeshMotion:**
1. BVH: Use existing JS parsers
2. C3D: Create custom parser or compile EZC3D to WASM
3. OpenCap: API integration for cloud data

---

### Feature 5: Force Vector Visualization

**Conventions:**
- Arrow length proportional to magnitude
- Arrow direction = force direction
- Origin at point of application
- 3D GRF resolved into: vertical, longitudinal, transverse

**Color Coding (existing tools):**
- Visual3D: Red for GRF, yellow for calculated forces
- Golf software: Blue for individual feet, yellow for combined
- By type: Different colors for GRF, joint, muscle forces

**Technical Implementation:**
- THREE.ArrowHelper for simple arrows
- Custom geometry for styled arrows
- Auto-scale based on max force in scene
- Instanced rendering for many arrows

**Key Data:**
- Center of Pressure (CoP) trajectory
- Force plate boundaries
- Component breakdown (X/Y/Z)

---

### Feature 6: Comparison View

**Existing Tools:**
- Dual Player (whythetrick.io): Side-by-side, frame-by-frame, free
- CompareVid.com: Free online comparator
- NVIDIA ICAT: Up to 4 videos, split screen, zoom/pan
- Natron: Node-based, opacity/slide comparison

**Modes:**
- Side-by-side (horizontal/vertical split)
- Overlay with opacity slider
- Slider/wipe comparison (drag divider)
- Ghost/silhouette overlay

**Synchronization:**
- Time-synced (same timestamp)
- Event-synced (heel strike to heel strike)
- Manual offset control

**Technical Approach:**
- Single canvas with scissor test (more efficient)
- OR multiple canvases (simpler isolation)
- Shared clock/event bus for sync

---

### Feature 7: Embed/iframe Component

**Reference Implementations:**
- Sketchfab Viewer API: Control viewer in JS, screenshots, camera
- Trimble Connect: postMessage API for 3D viewer
- YouTube iframe API: Events, methods, parameters

**postMessage Pattern:**
```javascript
// Parent → iframe
iframe.contentWindow.postMessage({action: 'play'}, targetOrigin);
// iframe → Parent
window.parent.postMessage({event: 'timeUpdate', time: 5.2}, parentOrigin);
```

**Security:**
- ALWAYS validate event.origin
- Use specific targetOrigin (not '*')
- HTTPS only
- CSP headers for embedding control

**Customization Options:**
- UI visibility (controls, logo, watermark)
- Interaction permissions (rotate, zoom, none)
- Autoplay (on load, on scroll)
- Theme/branding

---

### Feature 8: Live Pose Input

**MediaPipe Pose:**
- 33 body landmarks (superset of COCO)
- Two-stage: Detection (128×128) → Tracking (256×256)
- Real-time on mobile/desktop/web
- Complexity levels 0-2 (accuracy vs speed)

**Limitations:**
- Single person only (vs YOLOv8 multi-person)
- Struggles with: rapid movement, varying lighting, occlusions
- Rare poses in training data = poor estimation
- Depth estimation limited from 2D input

**Smoothing Techniques:**
- Temporal smoothing to reduce jitter
- Pose prediction during occlusion
- Confidence threshold filtering

**Implementation:**
- WebRTC getUserMedia for camera
- MediaPipe WASM/WebGL for processing
- Worker thread to keep UI responsive

---

### Feature 9: Markers & Annotations

**CAD Tools Reference:**
- Exocad: Distance, angle, annotation from measurement
- 3D-Tool: Clearances, wall thickness, bounding box, areas
- Shapr3D: 3-point angle, minimum distance, notable points

**Medical Imaging Reference:**
- MITK: Distance, angle, path on 2D/3D images
- 3D Slicer: Markups module - points, lines, curves, angles, planes, ROIs

**Measurement Types:**
- Point-to-point distance
- 3-point angle
- Surface area
- Circumference (around limbs)
- Range of motion (min/max during animation)

**Technical:**
- HTML overlay (CSS3D) vs WebGL canvas rendering
- Raycasting for surface point placement
- Snap to vertex/surface
- JSON schema for save/load

---

### Feature 10: Export & Screenshot

**Methods:**
- canvas.toDataURL(): Old, in-memory string, URL length limits
- canvas.toBlob(): Better, async, no length limits
- preserveDrawingBuffer: true required for WebGL

**Resolution Limits:**
- 4000×4000 = 64MB memory
- 8000×8000 = 256MB memory
- Browsers set limits on large allocations
- Solution: Render in parts, assemble later

**Video Recording:**
- MediaRecorder API for canvas capture
- ffmpeg.wasm for encoding in browser
- WebSocket export for high quality (server-side ffmpeg)

**Quality Settings:**
- toDataURL quality parameter: 0-1 for JPEG/WebP
- OffscreenCanvas for background rendering
- High-DPI export: Multiply canvas size by pixel ratio

---

### Feature 11: REST API

**Design Principles:**
- Versioning: URL (/v1/), header, or semantic
- Authentication: API keys (server-to-server), OAuth 2.0 (user-specific), JWT
- Rate limiting: X-RateLimit-* headers, 429 + Retry-After
- HTTPS always

**Documentation:**
- OpenAPI/Swagger spec (machine-readable)
- Interactive playground
- Code examples (Python, JS, cURL)
- Quick start guide (<5 minutes)

**Developer Experience:**
- Consistent naming (snake_case everywhere)
- Clear error messages with schema
- Sandboxes for testing
- Tiered rate limits (free vs paid)

---

### Feature 12: LMS Integration

**LTI 1.3 Overview:**
- Standard by 1EdTech (formerly IMS Global)
- OAuth 2.0 + OpenID Connect + JWT
- Supported: Canvas, Moodle, Blackboard, D2L

**Key Concepts:**
- Tool Consumer: The LMS (Canvas, etc.)
- Tool Provider: Your application
- Launch Request: Secure message on tool link click

**LTI Advantage Extensions:**
- Assignments and Grades: Sync grades to gradebook
- Names and Roles: Access class roster
- Deep Linking: Link to specific content

**Implementation:**
- Node.js LTI libraries available
- Platform certification process for each LMS
- Key management for secure credentials

---

## CROSS-CUTTING RESEARCH FINDINGS

### Customization & User Preferences

**Theme/Dark Mode:**
- Complete Anatomy: Light/dark mode toggle, background color customization
- Visible Body: Auto-detect system preference
- Best practice: Theme selector in initial onboarding + settings

**User Preferences to Save:**
- Color schemes (muscle colors, force colors)
- Default camera view
- UI element visibility
- Playback speed default
- Annotation styles

---

### Ghost/Onion Skin Visualization

**Definition:** Display animated object at multiple frames - current frame normal, others as transparent ghosts

**Best Practices:**
- Optimal: 3-5 previous frames, 1-2 upcoming frames
- Blender add-on: "3D Onion Skinning" - ghost frames in full 3D
- Motion trails + ghosted frames together = powerful for review
- Reduces mental load vs frame-by-frame scrubbing

**Implementation:**
- Composite mesh with transparent material
- Geometry Nodes approach (Blender pattern)
- Can combine with motion vectors to show direction

---

### BVH Format Support

**JavaScript Parsers Available:**
| Library | Source | Notes |
|---------|--------|-------|
| BVHImporter | GitHub (herzig) | Converts to THREE.Skeleton + AnimationClip |
| parse-bvh | npm | Tech-agnostic, returns joint array |
| bvh-parser | npm | Similar to parse-bvh |

**BVH Structure:**
- Header: Hierarchy + initial pose
- Data: Motion frames at ~30fps (0.033333 frame time)
- OFFSET: Position relative to parent
- CHANNELS: Rotation/translation parameters

**Free Data Sources:**
- CMU Graphics Lab Motion Capture Database (http://mocap.cs.cmu.edu)

---

### Camera Preset Views

**Standard Views:**
- Front, Back, Left, Right, Top, Bottom
- Isometric (45° from each axis)
- User-saved custom views

**Implementation in Three.js:**
- Calculate from model's AABB (bounding box)
- Linear interpolation for smooth transitions
- Quaternion SLERP to avoid spinning issues
- OrthographicCamera for true isometric

**Transition Animation:**
- Use GSAP or Three.js AnimationMixer
- ~0.5-1s duration for smooth feel
- Avoid sudden jumps in rotation

---

### Annotation Best Practices

**Key Principles:**
1. Label every relevant object (avoid false negatives)
2. Maintain consistency across entire dataset
3. Adapt labels to audience familiarity
4. Multi-stage review process

**3D-Specific Challenges:**
- Occlusion (surfaces not visible to camera)
- Annotation fatigue (constant panning/zooming)
- Point density variation with distance

**Solutions:**
- Multiple viewpoints (front, side, top)
- Consensus scoring (multiple annotators)
- Automated consistency checks

---

### Accessibility & Keyboard Navigation

**WebGL Accessibility Challenges:**
- Canvas creates "black box" for screen readers
- Assistive tech doesn't understand pixel content
- Solution: Shadow DOM with accessible elements behind canvas

**WCAG Contrast:**
- AA minimum: 4.5:1 ratio
- AAA minimum: 7:1 ratio
- Can enforce with fragment shader on backgrounds

**Keyboard Navigation:**
- Tab through interactive elements
- Shortkeys: h (headings), t (tables), g (graphics)
- Enter/Space to activate
- Arrow keys for frame stepping

**Mobile Accessibility:**
- VoiceOver (iOS) / TalkBack (Android) use touch gestures
- Must provide button alternatives for keyboard shortcuts
- Rotor-based navigation instead of keyboard focus

**Testing Tools:**
- NVDA + Firefox/Chrome (best combo)
- stats-gl for performance monitoring
- Spector.js for WebGL frame capture

---

### Three.js Performance Optimization

**Draw Calls Target:**
- Under 100 for smooth 60fps
- Each mesh = 1 draw call
- 100k trees instanced = 1 draw call (better than 100 unique objects)

**Instancing:**
- InstancedMesh for repeated objects
- BatchedMesh for same material, different geometry
- BufferGeometryUtils.merge() for static geometry

**Memory Management:**
- ALWAYS call .dispose() on unused resources
- Textures: Use power-of-2 dimensions (128, 256, 512, 1024)
- JPG vs PNG: Same GPU memory, different file size
- KTX2 compressed textures: Half memory usage

**Profiling Tools:**
- stats-gl: FPS/CPU/GPU monitoring
- renderer.info: Memory and draw call stats
- lil-gui: Live parameter tweaking
- Browser DevTools Performance tab

---

### Timeline Scrubbing UX

**Thumbnail Previews:**
- Storyboard: Grid of thumbnails from video frames
- Show on hover over timeline
- Calculate timestamp from cursor position
- Display appropriate tile from spritesheet

**Best Practices:**
- Make it optional/configurable
- Mobile: Show timestamp only (no thumbnail under 640px)
- Edge cases: Fix thumbnail at video boundaries
- Variable speed: Playback speed adjusts with drag speed

**Keyboard Shortcuts (Standard):**
- J/K/L: Reverse/Pause/Forward
- Arrow keys: Frame-by-frame
- Space: Play/pause

---

### URL State Management (React)

**Methods:**
- history.push({ pathname, search, state })
- useLocation() for reading current URL
- useParams() for dynamic segments
- useSearchParams() for query parameters

**Best Practices:**
- URL as source of truth (not local state)
- Use 'qs' library for query param operations
- Sync state on mount and on URL change
- useUrlState hook (Alibaba pattern)

**pushState Limitations:**
- Must be same origin
- State object must be serializable
- React Router v6 uses own state system

---

### MediaPipe Pose Smoothing

**Jitter Problem:**
- Raw landmark data is noisy
- Legacy smoothLandmarks parameter removed in new API
- Visible on official demo page

**Smoothing Filters:**
- Kalman filter: Predictive smoothing
- Exponential Moving Average (EMA): Simple weighted average
- One-Euro filter: Adaptive smoothing (best for real-time)

**Configuration:**
- minDetectionConfidence: 0.5 default
- minTrackingConfidence: 0.5 default
- 33 landmarks, 3D coordinates

**Accuracy:**
- Mean joint coordinate difference: ~0.097m
- Average angle difference: ~10 degrees
- Works on CPU (mobile + desktop)

---

### OpenCap Data Formats

**Output Formats:**
- .osim: OpenSim model files
- .mot: Motion/kinematics data
- .sto: Storage files (forces, activations)

**Available Data:**
- Raw: marker motion capture, GRF, EMG (10 muscles), video
- Processed: scaled models, IK, ID, muscle simulations

**Muscle Activation:**
- Normalized by max value per participant
- Vasti activation validation: AUC 0.83, accuracy 75%
- Requires Static Optimization (external forces not measured)

**Resources:**
- API: https://opencap.ai
- Core: github.com/stanfordnmbl/opencap-core
- Data: SimTK repository

---

## NEXT SESSION INSTRUCTIONS

1. Read this file
2. Check current phase/subphase
3. Execute research with web searches
4. Document findings
5. Update progress markers [x]
6. Continue to next subphase

---

## PROGRESS LOG

### Session 1 (2026-01-30)
- Created research structure with 12 features × ~25 subphases = 300+ items
- Starting from Feature 1, Subphase 1.1.1
- Executed 15+ web searches across all feature areas
- Documented findings for all 12 features in database
- Key discoveries:
  - NO web tool does dynamic muscle activation (whitespace!)
  - NO JavaScript C3D parser exists (need to create)
  - lz-string is the standard for URL state compression
  - MediaPipe has limitations (single person, lighting sensitive)
  - LTI 1.3 uses OAuth 2.0 + JWT (modern auth)

### Session 2 (2026-01-30 continued)
- Deep research on interaction patterns, accessibility, performance
- Added cross-cutting findings:
  - Accessibility: Shadow DOM for screen readers, WCAG contrast
  - Three.js: <100 draw calls target, instancing, .dispose() critical
  - Timeline UX: Thumbnail storyboards, J/K/L keyboard standard
  - URL state: history.push pattern, useUrlState hook
  - MediaPipe: Kalman/EMA/One-Euro filters for jitter
  - OpenCap: .osim/.mot/.sto formats, normalized activations
- ~180 subphases covered
- Next: Synthesize into feature requirements, then PRD
