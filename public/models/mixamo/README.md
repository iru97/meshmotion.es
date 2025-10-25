# Mixamo Assets for 3D Next Viewer

This directory contains 3D character models and animations from Mixamo.

## 📁 Directory Structure

```
mixamo/
├── characters/
│   ├── mannequin.glb           # Default Y-Bot character
│   ├── xbot.glb                # Alternative X-Bot character
│   └── ...
├── animations/
│   ├── idle.glb                # Idle standing animation
│   ├── walk.glb                # Walking animation
│   ├── run.glb                 # Running animation
│   ├── jump.glb                # Jump animation
│   ├── wave.glb                # Wave gesture
│   ├── dance.glb               # Dance animation
│   └── ...
└── README.md                   # This file
```

---

## 🎯 How to Download Assets from Mixamo

### Step 1: Create Account
1. Go to [Mixamo.com](https://www.mixamo.com/)
2. Sign in with Adobe ID (free account)

### Step 2: Download Default Character

#### Y-Bot (Recommended Default Character)

1. Go to: https://www.mixamo.com/#/?page=1&type=Character
2. Search for **"Y Bot"** or find it in the character list
3. Click on the character
4. Click **"Download"** button (top right)
5. **Download Settings:**
   - Format: **glTF Binary (.glb)** ✅
   - Pose: **T-pose**
   - Click **Download**
6. Rename to: `mannequin.glb`
7. Move to: `public/models/mixamo/characters/mannequin.glb`

#### X-Bot (Alternative Character)

1. Search for **"X Bot"**
2. Same download process
3. Rename to: `xbot.glb`
4. Move to: `public/models/mixamo/characters/xbot.glb`

---

### Step 3: Download Animations

For each animation, follow this process:

1. Go to: https://www.mixamo.com/#/?page=1&type=Motion
2. Search for the animation name (see list below)
3. Select **Y Bot** character from the character picker
4. Click **"Download"** button
5. **Download Settings:**
   - Format: **glTF Binary (.glb)** ✅
   - Skin: **Without Skin** ✅ (IMPORTANT!)
   - Frame Rate: **30 fps**
   - Keyframe Reduction: **uniform** (or none)
   - Click **Download**
6. Rename according to list below
7. Move to `public/models/mixamo/animations/`

---

## 📋 Recommended Animations to Download

### Essential (Priority 1)

| Animation Name in Mixamo | Download As | Description |
|--------------------------|-------------|-------------|
| **Idle** | `idle.glb` | Standing idle animation |
| **Walking** | `walk.glb` | Walking forward |
| **Running** | `run.glb` | Running forward |
| **Jump** | `jump.glb` | Jumping in place |
| **Waving** | `wave.glb` | Friendly wave gesture |

### Additional (Priority 2)

| Animation Name in Mixamo | Download As | Description |
|--------------------------|-------------|-------------|
| **Dancing** | `dance.glb` | Dance animation |
| **Sitting** | `sit.glb` | Sitting down |
| **Standing Up** | `standup.glb` | Standing up from sit |
| **Punching** | `punch.glb` | Punch animation |
| **Kick** | `kick.glb` | Kick animation |
| **Crouch** | `crouch.glb` | Crouching pose |

### Fun Extras (Priority 3)

| Animation Name in Mixamo | Download As | Description |
|--------------------------|-------------|-------------|
| **Capoeira** | `capoeira.glb` | Capoeira dance move |
| **Hip Hop Dancing** | `hiphop.glb` | Hip hop dance |
| **Breakdance** | `breakdance.glb` | Breakdance move |
| **Zombie Walk** | `zombie.glb` | Zombie walking |
| **Silly Dancing** | `silly-dance.glb` | Silly dance |

---

## ⚙️ IMPORTANT: Download Settings

Always use these settings for compatibility:

### For Characters:
```
Format: glTF Binary (.glb)
Pose: T-pose
```

### For Animations:
```
Format: glTF Binary (.glb)
Skin: WITHOUT SKIN ✅ (This is critical!)
Frame Rate: 30 fps
Keyframe Reduction: uniform or none
```

**Why "Without Skin"?**
- Animation-only GLB files contain just the motion data
- Can be applied to any character with compatible skeleton
- Smaller file size
- Better for mixing and matching

---

## 🔄 Quick Download Script (Manual Steps)

If you want to download the essential pack quickly:

1. **Characters (2 files):**
   - Y Bot → `mannequin.glb`
   - X Bot → `xbot.glb`

2. **Essential Animations (5 files):**
   - Idle → `idle.glb` (Without Skin)
   - Walking → `walk.glb` (Without Skin)
   - Running → `run.glb` (Without Skin)
   - Jump → `jump.glb` (Without Skin)
   - Waving → `wave.glb` (Without Skin)

**Total: 7 files (~5-10MB total)**

---

## 🧪 Testing the Viewer

Once you have downloaded the assets:

### Test 1: Load Default Character
1. Start dev server: `npm run dev`
2. Open browser: `http://localhost:3000`
3. Drag & drop `mannequin.glb` into the viewer
4. Should see the character in T-pose

### Test 2: Apply Animation
1. Character already loaded from Test 1
2. Drag & drop `idle.glb` into the viewer
3. Character should start playing idle animation
4. Use Play/Pause controls
5. Adjust speed slider

### Test 3: Mix Characters and Animations
1. Load `mannequin.glb`
2. Load `walk.glb`
3. Use Character Selector to keep mannequin
4. Use Animation Selector to switch between animations
5. Load `xbot.glb`
6. Use Character Selector to switch between mannequin and xbot
7. Same animation should apply to both characters

### Test 4: Lighting Presets
1. Character loaded
2. Open Settings panel (right sidebar)
3. Try different lighting presets:
   - Studio (default)
   - Dramatic (high contrast)
   - Soft (ambient)
   - Outdoor (natural)

### Test 5: Material Presets
1. Character loaded
2. Open Settings panel
3. Try different materials:
   - Textured (original)
   - Clay (gray uniform)
   - Wireframe (topology)
   - X-Ray (transparent)
   - PBR (metallic)

---

## 📦 Alternative: Use Test Files

If you don't want to create a Mixamo account, you can test with any GLB file:

- Download from [Sketchfab](https://sketchfab.com/3d-models?features=downloadable&sort_by=-likeCount)
- Use [glTF Sample Models](https://github.com/KhronosGroup/glTF-Sample-Models)
- Export from Blender as GLB

**Just make sure:**
- File format is `.glb` or `.gltf`
- File size is under 50MB
- If it has animations, they should use bone/skeleton system

---

## 🐛 Troubleshooting

### Issue: "Invalid file type"
**Solution:** Make sure the file extension is `.glb` not `.fbx` or other format.

### Issue: "File too large"
**Solution:** Files over 50MB will be rejected. Try:
- Downloading with "Keyframe Reduction: uniform"
- Using a different character/animation

### Issue: Animation doesn't play
**Solution:**
- Make sure you downloaded animation "Without Skin"
- Check that the character and animation use compatible skeletons
- Try with Mixamo's default Y-Bot first

### Issue: Character looks weird
**Solution:**
- Download character in "T-pose" not "A-pose"
- Make sure format is glTF Binary (.glb)

---

## 📚 Resources

- [Mixamo Official Site](https://www.mixamo.com/)
- [Mixamo Tutorial Videos](https://helpx.adobe.com/creative-cloud/how-to/mixamo-animations.html)
- [glTF Format Specification](https://www.khronos.org/gltf/)
- [Three.js GLTFLoader Docs](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)

---

## 📝 Notes

- All Mixamo content is free for personal and commercial use
- No attribution required
- You can modify, combine, and export animations
- Maximum 20 downloads per day (free account limit)

---

**Happy animating! 🎬**
