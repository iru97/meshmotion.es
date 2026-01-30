# Research Loop Iteration Prompt

You are in a deep research loop. An external bash script is running you repeatedly until the investigation is complete.

## FIRST: Read State File

```
Read .claude/loop-state-vittorio-research.md
```

This file contains:
- Current phase and subphase
- Completed subphases with findings
- Findings database (accumulated knowledge)
- Next session instructions

## YOUR MISSION THIS ITERATION

Complete **2-4 SUBPHASES** from the current phase, then exit. The bash loop will restart you.

### Research Loop Rules

1. **FIND THE CURRENT SUBPHASE**: Look for `[ ]` unchecked items
2. **LAUNCH PARALLEL RESEARCH**: Use Task(general-purpose) with WebSearch/WebFetch for deep research
3. **GO DEEP, NOT WIDE**: Each subphase needs SPECIFIC details, not summaries
4. **UPDATE FINDINGS DATABASE**: Add detailed findings to the database section
5. **MARK SUBPHASES COMPLETE**: Change `[ ]` to `[x]` with summary
6. **COMMIT PROGRESS**: Git commit the state file after each iteration

### Quality Standards for Each Subphase

- **Names/Titles**: Get EXACT names, not descriptions
- **Numbers**: Get SPECIFIC figures (citations, revenue, users)
- **Technical Details**: Get ACTUAL parameters, not approximations
- **Sources**: Document WHERE information came from
- **Gaps**: Note what COULDN'T be found

### Phase Progression

After completing all subphases in a phase:
1. Run the CHECKPOINT subphase
2. If checkpoint passes, move to next phase
3. If checkpoint fails, add remediation subphases

### Example Iteration

```
[Claude starts]

Reading state file...

Current Phase: 2.1 (BIOMECHANICS TECHNICAL DEEP DIVE)
Current Subphase: 2.1.5
Completed: 2.1.1 through 2.1.4

EXECUTING: 2.1.5 - Read the main source files

Task(general-purpose): "Analyze biomechanics tools env_base.py - list all classes, methods, key patterns"

FINDINGS:
- MujocoEnv class inherits gym.Env
- 15 core methods: step, reset, seed, get_obs, get_reward...
- [detailed findings]

UPDATING STATE FILE:
2.1.5 [x] Read the main source files
      → MujocoEnv: 15 methods, gym.Env base
      → Key pattern: get_obs_dict/get_reward_dict abstract

EXECUTING: 2.1.6 - Understand muscle model implementation
...

COMMIT: git commit -m "research: phase 2.1 subphases 5-6 complete"

Progress: 6/13 subphases in Phase 2.1 complete. Exiting for next iteration.

[Claude exits, bash loop restarts]
```

## SIGNALS

Output these EXACT strings for the bash loop to detect:

- `<loop-complete>` - ALL phases complete (reached Phase 9 synthesis)
- `<loop-abort>` - Fundamental blocker (API rate limits, missing critical info)
- `<loop-stuck>` - Need human input (ambiguous direction, conflicting info)
- `<loop-phase-complete>` - Current macro-phase finished, ready for next

## CRITICAL RULES

1. **DEEP NOT SHALLOW**: Each subphase should yield 5-10 specific findings
2. **USE PARALLEL TASKS**: Launch 2-4 Task agents simultaneously for efficiency
3. **UPDATE STATE FILE**: Every iteration must update the state file
4. **COMMIT EACH ITERATION**: Save progress to git
5. **DOCUMENT SOURCES**: Every finding needs a source link
6. **NOTE GAPS**: If something can't be found, document that

## RESEARCH QUALITY CHECKLIST

Before marking a subphase complete:
- [ ] Did I get specific names, not generic descriptions?
- [ ] Did I get actual numbers, not estimates?
- [ ] Did I find primary sources, not secondary summaries?
- [ ] Did I note what I couldn't find?
- [ ] Did I add findings to the database section?

## NOW: Read the state file and execute 2-4 subphases deeply.
