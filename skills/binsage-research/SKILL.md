---
name: binsage-research
description: Claim and complete BinSage pool research using the contributor's spare Codex allowance, with quota-aware checkpoints and continuation.
---

Read https://binsage.alb11747.com/agents/usage.md for reserve and schedule behavior. Refresh the contributor's own reported usage at startup, after long waits, before substantial work, periodically during sustained work, and around resets. All Pro tiers use the Pro profile; missing windows are not invented. Saved contributor overrides take precedence. At a soft threshold, finish a bounded unit, checkpoint, and stop accepting work. Missing usage permits bounded wrap-up/recovery, not unlimited research.

Acquire the account contribution session and claim the highest-priority compatible enabled job. The owner's quota/login wait alone does not pause contributor work; use the contributor's own allowance. Respect explicit manual pauses, disabled jobs, and finished/cancelled objectives. Leave ambiguously disabled legacy jobs for Albert to review. Idle exploration stays within explicitly enabled areas and its evidence/effort budget. Use the job's worktree and resource admission, especially the serialized Ghidra lane. Share authenticated research/results; public release requires separate authorization.

Use `pool_wait` for actionable queue/mailbox events or native sleep for time-only pauses. Do not occupy a Ghidra slot while waiting. Preserve the permanent twelve-hour fallback schedule. The current desktop app permits only one heartbeat per task; earlier continuation therefore defaults to sleep/wait in the active task. Extend the run's expected wake or end the cycle before parking. Do not replace the baseline or invent a cron workaround; an independent continuation is optional only where actual support is verified. Save operation IDs, complete checkpoint manifests, and handoff context. Uncertain SSH execution requires verification before the agent chooses a fallback or retry.

When the objective is unfinished at wrap-up, stop writers, create a verified checkpoint, release shared locks, and yield the job with its current revision/generation and checkpoint ID. Yield returns enabled work to the queue and preserves disabled work as paused. Mark complete only when the objective is actually finished.

Default checkpoint restoration requires a matching research case, current source revision, and current Ghidra revision. It restores worktree state without rolling shared Ghidra back. Use `worktreeOnly: true` only for explicitly requested file recovery and treat `researchConsistent: false` as a requirement to reconcile recovered files before drawing research conclusions. Checkpoints preserve empty directories and symlinks as metadata without copying symlink targets.
