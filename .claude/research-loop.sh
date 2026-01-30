#!/bin/bash
set -e

# MeshMotion Deep Research Loop
# Autonomous investigation loop for Vittorio Caggiano research

MAX_ITERATIONS="${1:-50}"
STATE_FILE=".claude/loop-state-vittorio-research.md"
PROMPT_FILE=".claude/PROMPT_research_loop.md"
PROGRESS_LOG=".claude/research-progress.log"

echo "=========================================="
echo "  MeshMotion Deep Research Loop"
echo "=========================================="
echo ""
echo "State file: $STATE_FILE"
echo "Prompt file: $PROMPT_FILE"
echo "Max iterations: $MAX_ITERATIONS"
echo ""

# Check files exist
if [ ! -f "$STATE_FILE" ]; then
  echo "Error: State file not found: $STATE_FILE"
  exit 1
fi

if [ ! -f "$PROMPT_FILE" ]; then
  echo "Error: Prompt file not found: $PROMPT_FILE"
  exit 1
fi

# Initialize progress log
echo "" >> "$PROGRESS_LOG"
echo "=== Research Loop Started: $(date) ===" >> "$PROGRESS_LOG"
echo "Max iterations: $MAX_ITERATIONS" >> "$PROGRESS_LOG"
echo "---" >> "$PROGRESS_LOG"

for ((i=1; i<=$MAX_ITERATIONS; i++)); do
  echo ""
  echo "=========================================="
  echo "=== Research Iteration $i of $MAX_ITERATIONS ==="
  echo "=== $(date '+%Y-%m-%d %H:%M:%S') ==="
  echo "=========================================="
  echo ""

  # Run Claude with the research prompt
  result=$(claude -p "$(cat "$PROMPT_FILE")" --allowedTools "Read,Write,Edit,Glob,Grep,Bash,Task,TodoWrite,WebSearch,WebFetch" 2>&1) || true

  echo "$result"

  # Log this iteration
  echo "Iteration $i: $(date '+%H:%M:%S')" >> "$PROGRESS_LOG"

  # Check for completion signal
  if echo "$result" | grep -q "<loop-complete>"; then
    echo ""
    echo "=========================================="
    echo "  RESEARCH COMPLETE!"
    echo "  Finished after $i iterations."
    echo "=========================================="
    echo "" >> "$PROGRESS_LOG"
    echo "=== COMPLETED: $(date) after $i iterations ===" >> "$PROGRESS_LOG"
    exit 0
  fi

  # Check for phase complete signal
  if echo "$result" | grep -q "<loop-phase-complete>"; then
    echo ""
    echo "Phase complete. Continuing to next phase..."
    echo "Phase complete at iteration $i" >> "$PROGRESS_LOG"
  fi

  # Check for abort signal
  if echo "$result" | grep -q "<loop-abort>"; then
    echo ""
    echo "=========================================="
    echo "  RESEARCH ABORTED"
    echo "  Check state file for details."
    echo "=========================================="
    echo "=== ABORTED: $(date) at iteration $i ===" >> "$PROGRESS_LOG"
    exit 1
  fi

  # Check for stuck signal
  if echo "$result" | grep -q "<loop-stuck>"; then
    echo ""
    echo "=========================================="
    echo "  RESEARCH STUCK - needs human input"
    echo "  Review state file and provide guidance."
    echo "  Then run: $0 $((MAX_ITERATIONS - i))"
    echo "=========================================="
    echo "=== STUCK: $(date) at iteration $i ===" >> "$PROGRESS_LOG"
    exit 2
  fi

  echo ""
  echo "Iteration $i complete. Continuing research..."

  # Small delay
  sleep 2
done

echo ""
echo "=========================================="
echo "  Reached max iterations ($MAX_ITERATIONS)."
echo "  Progress saved in $STATE_FILE"
echo "  To continue: $0 <more-iterations>"
echo "=========================================="
echo "=== MAX ITERATIONS REACHED: $(date) ===" >> "$PROGRESS_LOG"
