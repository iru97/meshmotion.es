#!/bin/bash
# Session initialization hook - runs when Claude Code starts
# Provides context about the project state

echo "## {{PROJECT_NAME}} Session Context"
echo ""

# Git status
echo "### Git Status"
echo '```'
BRANCH=$(git branch --show-current 2>/dev/null || echo "not a git repo")
echo "Branch: $BRANCH"

# Count uncommitted changes
CHANGES=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
echo "Uncommitted changes: $CHANGES files"

# Last commit
LAST_COMMIT=$(git log -1 --format="%h %s (%ar)" 2>/dev/null || echo "no commits")
echo ""
echo "Last commit:"
echo "  $LAST_COMMIT"
echo '```'
echo ""

# Project health checks
echo "### Project Health"
echo '```'

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "Dependencies: Installed"
else
    echo "Dependencies: NOT INSTALLED - run 'npm install'"
fi

# TypeScript check (quick)
if command -v npx &> /dev/null && [ -f "tsconfig.json" ]; then
    TS_ERRORS=$(npx tsc --noEmit 2>&1 | grep -c "error TS" || echo "0")
    if [ "$TS_ERRORS" = "0" ]; then
        echo "TypeScript: OK"
    else
        echo "TypeScript: $TS_ERRORS errors"
    fi
fi

# Check for lint config
if [ -f ".eslintrc.json" ] || [ -f ".eslintrc.js" ] || [ -f "eslint.config.js" ]; then
    echo "ESLint: Configured"
fi

echo '```'
echo ""

# Recently modified files
echo "### Recently Modified"
echo '```'
git diff --name-only HEAD~5 2>/dev/null | head -10 || find src -type f -mtime -1 2>/dev/null | head -10
echo '```'
echo ""

# Outstanding TODOs
echo "### Outstanding TODOs"
TODO_COUNT=$(grep -r "TODO\|FIXME\|HACK" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | wc -l | tr -d ' ')
echo "Found $TODO_COUNT TODO/FIXME/HACK comments in src/"
echo ""

# Quick stats
echo "### Quick Stats"
echo '```'
if [ -d "src/components" ]; then
    COMPONENTS=$(find src/components -name "*.tsx" 2>/dev/null | wc -l | tr -d ' ')
    echo "Components: $COMPONENTS"
fi
if [ -d "src/hooks" ]; then
    HOOKS=$(find src/hooks -name "*.ts" 2>/dev/null | wc -l | tr -d ' ')
    echo "Hooks: $HOOKS"
fi
if [ -d "src/types" ]; then
    TYPES=$(find src/types -name "*.ts" 2>/dev/null | wc -l | tr -d ' ')
    echo "Types: $TYPES"
fi
echo '```'
