#!/bin/bash
# PostToolUse hook: Auto-format and lint after file edits

set -e

# Read JSON input from stdin
INPUT=$(cat)

# Extract file path
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# Get file extension
EXT="${FILE_PATH##*.}"

# =============================================================================
# AUTO-FORMAT - Format the edited file
# =============================================================================
case "$EXT" in
    ts|tsx|js|jsx|json|css|scss|md|html)
        # Run Prettier if available
        if command -v npx &> /dev/null && [ -f "node_modules/.bin/prettier" ]; then
            npx prettier --write "$FILE_PATH" 2>/dev/null || true
        fi
        ;;
esac

# =============================================================================
# TYPE CHECK - For TypeScript files, check for errors
# =============================================================================
if [ "$EXT" = "ts" ] || [ "$EXT" = "tsx" ]; then
    # Quick type check of the specific file (non-blocking)
    if command -v npx &> /dev/null; then
        ERRORS=$(npx tsc --noEmit "$FILE_PATH" 2>&1 | grep -c "error TS" || echo "0")
        if [ "$ERRORS" != "0" ]; then
            # Output as context for Claude (non-blocking)
            echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PostToolUse\",\"additionalContext\":\"TypeScript: $ERRORS error(s) in $FILE_PATH - run 'npm run type-check' for details\"}}"
        fi
    fi
fi

exit 0
