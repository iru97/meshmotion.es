#!/bin/bash
# Pre-edit validation hook
# Warns about editing sensitive files

FILE="$1"

# Warn about env files
if [[ "$FILE" =~ \.env ]]; then
    echo "WARNING: Editing environment file. Ensure no secrets are committed."
fi

# Warn about config files
if [[ "$FILE" =~ (package\.json|tsconfig\.json|next\.config) ]]; then
    echo "INFO: Editing configuration file. Changes may affect build."
fi

# Block editing lock files
if [[ "$FILE" =~ (package-lock\.json|yarn\.lock|pnpm-lock\.yaml) ]]; then
    echo "BLOCKED: Do not manually edit lock files."
    exit 1
fi

exit 0
