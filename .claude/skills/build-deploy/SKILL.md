---
name: build-deploy
description: Build and deploy MeshMotion. Use for production builds, deployment preparation, and build error debugging.
allowed-tools:
  - Read
  - Bash
  - Grep
  - Glob
user-invocable: true
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "echo 'Running build command...'"
          once: true
---

# Build & Deploy Skill

Manage MeshMotion builds and deployment processes.

## Usage

Invoke with: `/build-deploy [command]`

Commands:
- `check` - Verify build readiness
- `build` - Run production build
- `analyze` - Analyze bundle size
- `deploy` - Prepare for deployment

## Build Readiness Checklist

### Pre-Build Verification
```bash
# 1. Check TypeScript
npm run type-check

# 2. Check ESLint
npm run lint

# 3. Check dependencies
npm ci

# 4. Verify env vars
cat .env.example
```

### Build Command
```bash
npm run build
```

This runs `next build` which outputs to `.next/` and `out/` (static export).

## Static Export Configuration

MeshMotion uses static HTML export (`output: 'export'` in next.config.js).

### Limitations to Verify
- [ ] No `next/headers` or `next/cookies` usage
- [ ] No server actions
- [ ] No API routes in production
- [ ] All dynamic routes have `generateStaticParams`
- [ ] Images use `unoptimized: true`

### Check for SSR Issues
```bash
# Find potential SSR problems
grep -rn "getServerSideProps\|getInitialProps" src/
grep -rn "headers()\|cookies()" src/
```

## Bundle Analysis

### Run Analyzer
```bash
# Install if needed
npm install --save-dev @next/bundle-analyzer

# Analyze
ANALYZE=true npm run build
```

### Common Bundle Issues

| Issue | Solution |
|-------|----------|
| Large Three.js bundle | Already necessary, ensure tree-shaking |
| lucide-react large | Use direct imports: `import { Icon } from 'lucide-react'` |
| Unused dependencies | Remove from package.json |
| Duplicate packages | Check with `npm ls [package]` |

### Optimize Three.js Imports
```typescript
// WRONG: Imports everything
import * as THREE from 'three'

// BETTER: Import specific classes
import { Vector3, Box3, Mesh } from 'three'

// Note: With modern bundlers, both should tree-shake correctly
```

## Build Errors

### Common Errors

#### "window is not defined"
Three.js component rendered on server.

**Fix**: Dynamic import with ssr: false
```typescript
const Scene = dynamic(() => import('@/components/viewer/Scene'), {
  ssr: false,
})
```

#### "Cannot find module"
Import path issue.

**Fix**: Verify path aliases in tsconfig.json
```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

#### Type Errors
TypeScript strict mode violations.

**Fix**: Run type-check and fix issues
```bash
npm run type-check 2>&1 | head -50
```

## Deployment Preparation

### For Netlify/Vercel (Static)
```bash
# Build output directory
npm run build
# Static files in: out/
```

### Environment Variables
```bash
# Copy example and fill values
cp .env.example .env.local

# Required for build:
NEXT_PUBLIC_APP_NAME=MeshMotion
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Verify Build Output
```bash
# Check output size
du -sh out/

# List generated files
find out -type f -name "*.html" | head -20

# Check for large assets
find out -type f -size +1M -exec ls -lh {} \;
```

## Deploy Commands

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy preview
netlify deploy --dir=out

# Deploy production
netlify deploy --dir=out --prod
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## Post-Deploy Verification

1. Load main page - check 3D viewer loads
2. Upload a model - verify upload works
3. Play animation - check playback
4. Export model - verify download
5. Check mobile - responsive design
6. Check console - no errors

## Quick Commands

```bash
# Full build pipeline
npm run lint && npm run type-check && npm run build

# Quick build (skip checks)
npm run build

# Start local production server
npm run start

# Check build output
ls -la out/
```
