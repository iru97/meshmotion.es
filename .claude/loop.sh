#!/bin/bash
set -e

# MeshMotion Ralph Wiggum Loop
# External bash loop that runs Claude until completion

if [ -z "$1" ]; then
  echo "Usage: $0 <max-iterations> [goal]"
  echo ""
  echo "Examples:"
  echo "  $0 50 'add tests for all export hooks'"
  echo "  $0 100 'migrate all components to new Button API'"
  echo "  $0 30  # Resume existing loop from state file"
  echo ""
  echo "The loop will:"
  echo "  1. Run Claude with the prompt from PROMPT_loop.md"
  echo "  2. Claude reads state from loop-state.md"
  echo "  3. Claude does ONE task, validates, commits"
  echo "  4. If Claude outputs <loop-complete>, loop exits"
  echo "  5. Otherwise, loop continues to next iteration"
  exit 1
fi

MAX_ITERATIONS=$1
GOAL="${2:-}"

STATE_FILE=".claude/loop-state.md"
PROMPT_FILE=".claude/PROMPT_loop.md"
PROGRESS_LOG=".claude/loop-progress.log"

# Initialize progress log
echo "=== Loop Started: $(date) ===" >> "$PROGRESS_LOG"
echo "Max iterations: $MAX_ITERATIONS" >> "$PROGRESS_LOG"
echo "Goal: ${GOAL:-'(resuming from state file)'}" >> "$PROGRESS_LOG"
echo "---" >> "$PROGRESS_LOG"

# If goal provided and no existing state, initialize
if [ -n "$GOAL" ] && [ ! -f "$STATE_FILE" ]; then
  echo "Initializing new loop with goal: $GOAL"

  cat > "$STATE_FILE" << EOF
# Loop Implementation State

## Status: IN_PROGRESS

## Original Request
> $GOAL

## Requirements
(To be gathered on first iteration)

## Tasks
(To be created on first iteration)

## Progress Log
- $(date '+%Y-%m-%d %H:%M'): Loop initialized
EOF
fi

# Check state file exists
if [ ! -f "$STATE_FILE" ]; then
  echo "Error: No state file found and no goal provided."
  echo "Either provide a goal or ensure $STATE_FILE exists."
  exit 1
fi

echo ""
echo "Starting Ralph Wiggum loop..."
echo "State file: $STATE_FILE"
echo "Max iterations: $MAX_ITERATIONS"
echo ""

for ((i=1; i<=$MAX_ITERATIONS; i++)); do
  echo "=========================================="
  echo "=== Iteration $i of $MAX_ITERATIONS ==="
  echo "=========================================="

  # Run Claude with the loop prompt
  # The prompt file tells Claude how to behave in the loop
  result=$(claude -p "$(cat "$PROMPT_FILE")" --allowedTools "Read,Write,Edit,Glob,Grep,Bash,Task,TodoWrite" 2>&1) || true

  echo "$result"

  # Log this iteration
  echo "Iteration $i: $(date '+%H:%M:%S')" >> "$PROGRESS_LOG"

  # Check for completion signal
  if echo "$result" | grep -q "<loop-complete>"; then
    echo ""
    echo "=========================================="
    echo "LOOP COMPLETE!"
    echo "Finished after $i iterations."
    echo "=========================================="
    echo "" >> "$PROGRESS_LOG"
    echo "=== COMPLETED: $(date) after $i iterations ===" >> "$PROGRESS_LOG"

    # Update state file
    sed -i 's/## Status: IN_PROGRESS/## Status: COMPLETE/' "$STATE_FILE"

    exit 0
  fi

  # Check for abort signal
  if echo "$result" | grep -q "<loop-abort>"; then
    echo ""
    echo "=========================================="
    echo "LOOP ABORTED by Claude."
    echo "Check state file for details."
    echo "=========================================="
    echo "=== ABORTED: $(date) at iteration $i ===" >> "$PROGRESS_LOG"

    sed -i 's/## Status: IN_PROGRESS/## Status: ABORTED/' "$STATE_FILE"

    exit 1
  fi

  # Check for stuck signal (needs human intervention)
  if echo "$result" | grep -q "<loop-stuck>"; then
    echo ""
    echo "=========================================="
    echo "LOOP STUCK - needs human intervention."
    echo "Review the state file and provide guidance."
    echo "Then run: $0 $((MAX_ITERATIONS - i))"
    echo "=========================================="
    echo "=== STUCK: $(date) at iteration $i ===" >> "$PROGRESS_LOG"

    exit 2
  fi

  echo ""
  echo "Iteration $i complete. Continuing..."
  echo ""

  # Small delay to avoid hammering
  sleep 1
done

echo ""
echo "=========================================="
echo "Reached max iterations ($MAX_ITERATIONS)."
echo "Progress saved in $STATE_FILE"
echo "To continue: $0 <more-iterations>"
echo "=========================================="
echo "=== MAX ITERATIONS REACHED: $(date) ===" >> "$PROGRESS_LOG"
