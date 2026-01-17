#!/bin/bash
# SessionStart hook for MeshMotion
# Provides context to Claude at session start

set -e

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$PROJECT_DIR"

echo "## MeshMotion Session Context"
echo ""

# Git Information
echo "### Git Status"
echo '```'
BRANCH=$(git branch --show-current 2>/dev/null || echo "not a git repo")
echo "Branch: $BRANCH"

# Uncommitted changes count
CHANGES=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
echo "Uncommitted changes: $CHANGES files"

# Last commit
echo ""
echo "Last commit:"
git log -1 --format="  %h %s (%ar)" 2>/dev/null || echo "  No commits"
echo '```'
echo ""

# Project Health
echo "### Project Health"
echo '```'

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "Dependencies: Installed"
else
    echo "Dependencies: NOT INSTALLED - run 'npm install'"
fi

# Check for TypeScript errors (quick check)
if command -v npx &> /dev/null; then
    ERRORS=$(npx tsc --noEmit 2>&1 | grep -c "error TS" || echo "0")
    if [ "$ERRORS" = "0" ]; then
        echo "TypeScript: No errors"
    else
        echo "TypeScript: $ERRORS errors"
    fi
fi

# Check for lint issues (quick estimate)
if [ -f ".eslintrc.json" ] || [ -f "eslint.config.js" ]; then
    echo "ESLint: Configured"
fi

echo '```'
echo ""

# Key Files Modified Recently
echo "### Recently Modified"
echo '```'
find src -name "*.tsx" -o -name "*.ts" 2>/dev/null | xargs ls -lt 2>/dev/null | head -5 | awk '{print $NF}'
echo '```'
echo ""

# Active TODOs
echo "### Outstanding TODOs"
TODO_COUNT=$(grep -r "TODO\|FIXME\|HACK" src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')
echo "Found $TODO_COUNT TODO/FIXME/HACK comments in src/"
if [ "$TODO_COUNT" -gt 0 ] && [ "$TODO_COUNT" -lt 10 ]; then
    echo '```'
    grep -rn "TODO\|FIXME\|HACK" src --include="*.ts" --include="*.tsx" 2>/dev/null | head -5
    echo '```'
fi
echo ""

# Quick Stats
echo "### Quick Stats"
echo '```'
echo "Components: $(find src/components -name '*.tsx' 2>/dev/null | wc -l | tr -d ' ')"
echo "Hooks: $(find src/hooks -name '*.ts' 2>/dev/null | wc -l | tr -d ' ')"
echo "Types: $(find src/types -name '*.ts' 2>/dev/null | wc -l | tr -d ' ')"
echo '```'

# Set environment for Claude
if [ -n "$CLAUDE_ENV_FILE" ]; then
    echo "export PROJECT_NAME=meshmotion" >> "$CLAUDE_ENV_FILE"
    echo "export PROJECT_TYPE=nextjs" >> "$CLAUDE_ENV_FILE"
    echo "export NODE_ENV=development" >> "$CLAUDE_ENV_FILE"
fi

exit 0
