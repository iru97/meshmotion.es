# /feature-planner - Interactive Feature Planning

Interactive wizard for planning new features with proper requirements gathering.

## Usage
```
/feature-planner [feature name or description]
```

## Process

### Step 1: Understand the Feature
Ask via AskUserQuestion:

**Question 1: Feature Type**
- New page/route
- New component
- Enhancement to existing
- Integration/API
- Other

**Question 2: Scope**
- Micro (single component)
- Small (few components)
- Medium (new section/feature)
- Large (multiple systems)

**Question 3: Has Similar Features?**
- Yes (which one to reference)
- No (new pattern needed)

### Step 2: Gather Requirements
Ask clarifying questions based on feature type:

**For UI Features**:
- Responsive requirements?
- Accessibility needs?
- Animation/interaction?

**For Data Features**:
- Data source?
- Caching needs?
- Real-time updates?

**For Integration**:
- API endpoints?
- Authentication?
- Error handling?

### Step 3: Generate Plan

Output structured plan:

```markdown
## Feature: [Name]

### Overview
[Description based on gathered requirements]

### User Stories
- As a [user], I want [feature] so that [benefit]

### Technical Requirements

#### Components to Create
- [ ] `ComponentName.tsx` - [description]

#### State Changes
- [ ] Add `[state]` to store

#### Types to Add
- [ ] `interface [Name]`

#### API/Data
- [ ] [endpoint or data source]

### Implementation Order
1. Types first
2. State/store
3. Components
4. Integration
5. Tests

### Testing Strategy
- Unit: [what to test]
- Integration: [what to test]
- E2E: [critical flows]

### Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
```

### Step 4: Validate Plan
Ask user to confirm or adjust before proceeding.

### Step 5: Create TodoWrite Tasks
Convert plan into actionable todo items.

## Example

**User**: "/feature-planner dark mode toggle"

**Questions**:
1. Feature type? → Enhancement to existing
2. Scope? → Small
3. Similar features? → Theme selector exists

**Plan Generated**:
```markdown
## Feature: Dark Mode Toggle

### Components
- [ ] ThemeToggle.tsx - Toggle button component

### State
- [ ] Add `theme: 'light' | 'dark'` to settings store
- [ ] Add `toggleTheme` action

### Implementation
1. Add theme state to store
2. Create ThemeToggle component
3. Wire up to CSS variables
4. Persist preference to localStorage

### Acceptance Criteria
- [ ] Toggle switches between light/dark
- [ ] Preference persists across sessions
- [ ] System preference detected on first visit
```
