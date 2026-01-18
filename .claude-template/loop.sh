#!/bin/bash
# Autonomous loop runner for plan-loop-implementation
# Usage: .claude/loop.sh [max_iterations] "task description"

MAX_ITERATIONS=${1:-50}
TASK="${2:-continue}"
STATE_FILE=".claude/loop-state.md"

echo "Starting autonomous loop..."
echo "Max iterations: $MAX_ITERATIONS"
echo "Task: $TASK"
echo "State file: $STATE_FILE"
echo ""

for i in $(seq 1 $MAX_ITERATIONS); do
    echo "=== Iteration $i of $MAX_ITERATIONS ==="

    # Run Claude with the task
    if [ "$i" -eq 1 ]; then
        # First iteration: use the full task
        claude "$TASK"
    else
        # Subsequent iterations: just continue
        claude "continue"
    fi

    # Check if all tasks are complete
    if [ -f "$STATE_FILE" ]; then
        PENDING=$(grep -c "^\- \[ \]" "$STATE_FILE" 2>/dev/null || echo "0")
        if [ "$PENDING" -eq 0 ]; then
            echo ""
            echo "=== All tasks complete! ==="
            exit 0
        fi
        echo "Remaining tasks: $PENDING"
    fi

    echo ""
    sleep 2
done

echo "=== Max iterations reached ==="
echo "Some tasks may still be pending. Run 'claude continue' to resume."
