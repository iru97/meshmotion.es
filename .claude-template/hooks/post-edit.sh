#!/bin/bash
# Post-edit hook - runs after file edits
# Auto-formats code if prettier is available

FILE="$1"

# Only format TypeScript/JavaScript files
if [[ "$FILE" =~ \.(ts|tsx|js|jsx)$ ]]; then
    if command -v npx &> /dev/null && [ -f "node_modules/.bin/prettier" ]; then
        npx prettier --write "$FILE" 2>/dev/null
    fi
fi

exit 0
