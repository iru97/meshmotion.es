#!/bin/bash
# Pre-execution hook for bash commands
# Blocks dangerous operations

COMMAND="$1"

# Block dangerous git operations
if echo "$COMMAND" | grep -qE "git\s+(push\s+--force|reset\s+--hard|clean\s+-fd)"; then
    echo "BLOCKED: Dangerous git operation. Use with caution."
    exit 1
fi

# Block rm -rf on important directories
if echo "$COMMAND" | grep -qE "rm\s+-rf\s+(/|~|\.git|node_modules|src)"; then
    echo "BLOCKED: Dangerous delete operation."
    exit 1
fi

# Block accidental production deployments without confirmation
if echo "$COMMAND" | grep -qE "(vercel\s+--prod|npm\s+publish)"; then
    echo "WARNING: Production deployment detected. Ensure this is intentional."
fi

exit 0
