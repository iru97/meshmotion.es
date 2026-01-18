# /build-deploy - Build and Deploy Workflow

Build and deploy workflow including build validation, error debugging, and deployment preparation.

## Usage
```
/build-deploy [optional: build | deploy | debug]
```

## Process

### Step 1: Determine Action
Ask via AskUserQuestion:

**Question 1: Action**
- Build only (validate production build)
- Deploy (build + deploy)
- Debug build error

**Question 2: Environment**
- Development
- Staging
- Production

### Step 2: Pre-Build Checks

```bash
# Ensure clean state
git status

# Check for uncommitted changes
# Verify on correct branch

# Install dependencies
npm ci

# Type check
npm run type-check

# Lint
npm run lint

# Run tests
npm test
```

### Step 3: Build

```bash
npm run build
```

If build fails, analyze errors and provide fixes.

### Step 4: Build Analysis

```markdown
## Build Report

### Status: [Success | Failed]

### Build Stats
- Duration: [time]
- Output size: [size]
- Pages: [count]
- Assets: [count]

### Bundle Analysis
- Main bundle: [size]
- Vendor bundle: [size]
- Largest chunks: [list]

### Warnings
- [Warning 1]
- [Warning 2]

### Optimizations Available
- [ ] [Optimization 1]
- [ ] [Optimization 2]
```

### Step 5: Deploy (if requested)

Depending on platform:

**Vercel**:
```bash
vercel --prod
```

**Other**:
```bash
# Platform-specific deploy command
```

## Build Error Debugging

### Common Build Errors

**TypeScript Errors**
```
Symptom: Type errors in build
Fix: Run `npm run type-check` locally, fix all errors
```

**Import Errors**
```
Symptom: Module not found
Check:
1. Package installed?
2. Import path correct?
3. File exists?
```

**Environment Variables**
```
Symptom: undefined env vars
Check:
1. Defined in .env?
2. Prefixed with NEXT_PUBLIC_ for client?
3. Available in build environment?
```

**Memory Issues**
```
Symptom: JavaScript heap out of memory
Fix: NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Debug Process

1. **Read Error Message**
   - What file?
   - What line?
   - What's the actual error?

2. **Reproduce Locally**
   ```bash
   npm run build
   ```

3. **Check Recent Changes**
   ```bash
   git log --oneline -10
   git diff HEAD~5
   ```

4. **Isolate the Issue**
   - Comment out suspected code
   - Build again
   - Binary search if needed

5. **Fix and Verify**
   - Apply fix
   - Build successfully
   - Run tests
   - Commit fix

## Deployment Checklist

### Pre-Deploy
- [ ] All tests pass
- [ ] Build succeeds locally
- [ ] Environment variables configured
- [ ] No console.log in production code
- [ ] Error tracking configured

### Post-Deploy
- [ ] Verify deployment succeeded
- [ ] Check critical flows work
- [ ] Monitor error rates
- [ ] Check performance metrics

## Example

**User**: "/build-deploy debug"

**Error**:
```
Error: Cannot find module '@/components/NewFeature'
```

**Analysis**:
```markdown
## Build Error Debug

### Error
Module not found: @/components/NewFeature

### Investigation
1. Checked file exists: ❌ No
2. Recent commits: Added import but not file
3. Branch status: Missing file from merge

### Fix
Create missing component or remove import:
- Option A: Create `src/components/NewFeature.tsx`
- Option B: Remove import from `src/app/page.tsx:15`

### Resolution
[Implement chosen fix]
```
