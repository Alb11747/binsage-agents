---
name: binsage-research
description: Claim and complete BinSage pool research using the contributor's spare Codex allowance, with quota-aware checkpoints and continuation.
---

Read https://binsage.alb11747.com/agents/usage.md for reserve and schedule behavior. Refresh the contributor's own reported usage at startup, after long waits, before substantial work, periodically during sustained work, and around resets. All Pro tiers use the Pro profile; missing windows are not invented. Saved contributor overrides take precedence. At a soft threshold, finish a bounded unit, checkpoint, and stop accepting work. Missing usage permits bounded wrap-up/recovery, not unlimited research.

Acquire the account contribution session and claim the highest-priority compatible enabled job. Respect paused research. Idle exploration stays within explicitly enabled areas and its evidence/effort budget. Use the job's worktree and resource admission, especially the serialized Ghidra lane. Share authenticated research/results; public release requires separate authorization.

Use `pool_wait` for actionable queue/mailbox events or native sleep for time-only pauses. Do not occupy a Ghidra slot while waiting. Preserve the twelve-hour fallback schedule and reconcile at most one earlier continuation before ending. Save operation IDs, complete checkpoint manifests, and handoff context. Uncertain SSH execution requires verification before the agent chooses a fallback or retry.

When the objective is unfinished at wrap-up, stop writers, create a verified checkpoint, release shared locks, and yield the job with its current revision/generation and checkpoint ID. Yield returns enabled work to the queue and preserves disabled work as paused. Mark complete only when the objective is actually finished.
