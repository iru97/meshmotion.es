#!/bin/bash
# PreToolUse hook: Validate bash commands
# Exit code 2 blocks the command with feedback to Claude

set -e

# Read JSON input from stdin
INPUT=$(cat)

# Extract command
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
    exit 0
fi

# =============================================================================
# BLOCKED COMMANDS - Dangerous operations
# =============================================================================

# Check for destructive rm commands
if echo "$COMMAND" | grep -qE "rm\s+(-rf|--force|-r\s+-f)\s+/"; then
    echo "BLOCKED: Cannot remove root filesystem paths" >&2
    exit 2
fi

if echo "$COMMAND" | grep -qE "rm\s+(-rf|--force)\s+~"; then
    echo "BLOCKED: Cannot force remove home directory" >&2
    exit 2
fi

if echo "$COMMAND" | grep -qE "rm\s+-rf\s+\.\s*$"; then
    echo "BLOCKED: Cannot remove current directory recursively" >&2
    exit 2
fi

# Check for sudo with dangerous commands
if echo "$COMMAND" | grep -qE "sudo\s+(rm|chmod|chown)"; then
    echo "BLOCKED: Cannot run destructive commands with sudo" >&2
    exit 2
fi

# Check for chmod 777
if echo "$COMMAND" | grep -qE "chmod\s+777"; then
    echo "BLOCKED: chmod 777 is insecure - use specific permissions (e.g., 755, 644)" >&2
    exit 2
fi

# Check for piping curl/wget to shell
if echo "$COMMAND" | grep -qE "(curl|wget).*\|\s*(bash|sh|zsh)"; then
    echo "BLOCKED: Piping curl/wget to shell is dangerous" >&2
    exit 2
fi

# Check for writing to system paths
if echo "$COMMAND" | grep -qE ">\s*/etc/"; then
    echo "BLOCKED: Cannot write to /etc/" >&2
    exit 2
fi

# Check for force push
if echo "$COMMAND" | grep -qE "git\s+push\s+.*--force"; then
    echo "BLOCKED: Force push is disabled by policy" >&2
    echo "If you really need to force push, ask the user for explicit permission" >&2
    exit 2
fi

# =============================================================================
# WARNINGS - Non-blocking but informational
# =============================================================================
WARNINGS=""

# Warn about git reset --hard
if echo "$COMMAND" | grep -qE "git\s+reset\s+--hard"; then
    WARNINGS="${WARNINGS}- WARNING: 'git reset --hard' will lose uncommitted changes\n"
fi

# Warn about npm publish
if echo "$COMMAND" | grep -qE "npm\s+publish"; then
    WARNINGS="${WARNINGS}- WARNING: This will publish to npm registry\n"
fi

# Warn about deleting node_modules
if echo "$COMMAND" | grep -qE "rm.*node_modules"; then
    WARNINGS="${WARNINGS}- TIP: Consider 'npm ci' instead of deleting and reinstalling\n"
fi

# Suggest better alternatives
if echo "$COMMAND" | grep -qE "\bgrep\b" && ! echo "$COMMAND" | grep -qE "\|"; then
    WARNINGS="${WARNINGS}- TIP: Consider using 'rg' (ripgrep) for faster searching\n"
fi

if echo "$COMMAND" | grep -qE "\bfind\s+\S+\s+-name\b"; then
    WARNINGS="${WARNINGS}- TIP: Consider using 'fd' for faster file finding\n"
fi

# Output warnings as context (non-blocking)
if [ -n "$WARNINGS" ]; then
    echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"additionalContext\":\"Command validation:\\n${WARNINGS}\"}}"
fi

exit 0
