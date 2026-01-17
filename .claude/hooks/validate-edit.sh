#!/bin/bash
# PreToolUse hook: Validate file edits
# Exit code 2 blocks the edit with feedback to Claude

set -e

# Read JSON input from stdin
INPUT=$(cat)

# Extract file path
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# Get relative path
REL_PATH=$(realpath --relative-to="$(pwd)" "$FILE_PATH" 2>/dev/null || echo "$FILE_PATH")

# =============================================================================
# BLOCKED FILES - Never modify these
# =============================================================================
BLOCKED_PATTERNS=(
    "^\.env$"
    "^\.env\."
    "^\.git/"
    "package-lock\.json$"
    "yarn\.lock$"
    "pnpm-lock\.yaml$"
    "node_modules/"
)

for pattern in "${BLOCKED_PATTERNS[@]}"; do
    if echo "$REL_PATH" | grep -qE "$pattern"; then
        echo "BLOCKED: Cannot modify protected file: $REL_PATH" >&2
        echo "This file is protected by project policy." >&2
        exit 2
    fi
done

# =============================================================================
# BRANCH PROTECTION - Sensitive files on main/master
# =============================================================================
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "")
SENSITIVE_PATTERNS=(
    "^\.claude/settings\.json$"
    "^tsconfig\.json$"
    "^next\.config\."
    "^package\.json$"
)

if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
    for pattern in "${SENSITIVE_PATTERNS[@]}"; do
        if echo "$REL_PATH" | grep -qE "$pattern"; then
            echo "BLOCKED: Cannot modify $REL_PATH on protected branch '$CURRENT_BRANCH'" >&2
            echo "Create a feature branch first: git checkout -b feature/your-change" >&2
            exit 2
        fi
    done
fi

# =============================================================================
# CONTENT VALIDATION - Check for common issues
# =============================================================================
if [ -n "$CONTENT" ]; then
    WARNINGS=""

    # Check for hardcoded secrets
    if echo "$CONTENT" | grep -qiE "(api[_-]?key|apikey|secret|password|token)\s*[:=]\s*['\"][^'\"]{10,}"; then
        WARNINGS="${WARNINGS}- WARNING: Possible hardcoded secret detected\n"
    fi

    # Check for console.log in production code (not in tests)
    if echo "$REL_PATH" | grep -qE "\.tsx?$" && ! echo "$REL_PATH" | grep -qE "(test|spec)\."; then
        if echo "$CONTENT" | grep -qE "console\.(log|debug|info)\("; then
            WARNINGS="${WARNINGS}- WARNING: console.log detected - remove before committing\n"
        fi
    fi

    # Check for 'any' type in TypeScript
    if echo "$REL_PATH" | grep -qE "\.tsx?$"; then
        if echo "$CONTENT" | grep -qE ": any[^a-zA-Z]|<any>"; then
            WARNINGS="${WARNINGS}- WARNING: 'any' type detected - use proper types or 'unknown'\n"
        fi
    fi

    # Output warnings as context (non-blocking)
    if [ -n "$WARNINGS" ]; then
        echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"additionalContext\":\"Content validation:\\n${WARNINGS}\"}}"
    fi
fi

exit 0
