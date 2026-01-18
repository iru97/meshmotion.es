# /debug-wizard - Interactive Debugging Guide

Guided debugging wizard that asks questions to narrow down issues systematically.

## Usage
```
/debug-wizard [optional: error or symptom description]
```

## Process

### Step 1: Categorize the Issue
Ask via AskUserQuestion:

**Question 1: Issue Category**
- Runtime error (crash/exception)
- Unexpected behavior (works but wrong)
- Performance issue (slow/laggy)
- Build/compile error
- Test failure

**Question 2: Reproducibility**
- Always happens
- Sometimes (intermittent)
- Only in specific conditions
- Only in production

### Step 2: Gather Details
Based on category, ask specific questions:

**For Runtime Errors**:
- What's the error message?
- What action triggers it?
- Which file/component?

**For Unexpected Behavior**:
- What should happen?
- What actually happens?
- When did it start working incorrectly?

**For Performance**:
- What's slow? (load, interaction, render)
- Specific page/component?
- Approximate timing?

**For Build Errors**:
- Full error output?
- Recent changes?
- Dependencies updated?

### Step 3: Generate Investigation Plan

```markdown
## Debug Investigation: [Issue]

### Symptoms
- [What user described]

### Hypothesis
Most likely causes (ranked):
1. [Cause 1] - [why likely]
2. [Cause 2] - [why likely]
3. [Cause 3] - [why likely]

### Investigation Steps
- [ ] Check [location 1] for [what]
- [ ] Verify [condition]
- [ ] Test [scenario]

### Quick Checks
- [ ] `npm run type-check` - any errors?
- [ ] `npm run lint` - any warnings?
- [ ] Console errors in browser?
- [ ] Network tab issues?

### If Found, Fix Pattern
[Template for the fix based on issue type]
```

### Step 4: Execute Investigation
- Use Task(Explore) to find relevant code
- Read identified files
- Check hypotheses in order

### Step 5: Apply Fix
- Make minimal change to fix
- Verify fix works
- Run tests
- Document root cause

## Common Debug Patterns

### React Re-render Issues
```
Symptom: Component re-renders constantly
Check:
1. useEffect dependencies
2. Inline objects/functions in JSX
3. Store selector granularity
```

### State Not Updating
```
Symptom: State change doesn't reflect in UI
Check:
1. Mutation vs new reference
2. Selector returning stale data
3. Component not subscribed
```

### API Errors
```
Symptom: API call fails
Check:
1. Network tab - request sent?
2. CORS issues?
3. Auth token valid?
4. Request payload correct?
```

### Build Failures
```
Symptom: Build fails
Check:
1. TypeScript errors first
2. Import paths correct?
3. Missing dependencies?
4. Environment variables?
```

## Example

**User**: "/debug-wizard button click does nothing"

**Questions**:
1. Category? → Unexpected behavior
2. Reproducibility? → Always
3. Which button? → Submit form button
4. Console errors? → No

**Investigation Plan**:
```markdown
## Debug: Submit Button Not Working

### Hypotheses
1. onClick handler not attached
2. Event not propagating (stopPropagation somewhere)
3. Handler throws silently
4. Form validation blocking

### Steps
- [ ] Find SubmitButton component
- [ ] Check onClick is passed and defined
- [ ] Add console.log to handler
- [ ] Check for e.preventDefault() issues
```
