# Usage and scheduling

Reserves are percentages to **retain**, not percentages permitted to spend. These are soft wrap-up thresholds; finish a bounded unit, checkpoint, and stop taking new work when a reserve is reached. Other activity on the same account may change allowance while a task runs.

| Plan           | Reported window        | Retained allowance                                                   |
| -------------- | ---------------------- | -------------------------------------------------------------------- |
| Every Pro tier | Weekly                 | 50% normally; 10% during the final 6 hours; 2% during the final hour |
| Plus           | Five-hour, if reported | 20%                                                                  |
| Plus           | Weekly                 | 40% normally; 10% during the final 24 hours                          |

Preserve contributor-customized limits. Do not infer a short window from a plan name: some Pro accounts do not report one. Check the account's own native usage data, including available per-limit buckets and reset times. Missing values are unavailable, not zero usage or unlimited allowance. An unrecognized plan requires a user-selected profile rather than an invented mapping. The server cannot reliably discover the friend's local allowance by reading Albert's account.

Refresh usage at startup, after a long wait, before substantial new work, around reported resets, and periodically during sustained work. Do not infer replenishment just because a predicted reset time passed. If usage becomes unavailable, save state and perform bounded recovery rather than continuing substantial work indefinitely. Never redeem reset credits, purchase allowance, or change plans as part of contribution recovery.

At wrap-up, yield unfinished work through `yield_job` after a verified checkpoint and shared-lock release. Do not mark an unfinished objective complete just to end the contribution cycle.

## Native schedules

Maintain one permanent twelve-hour baseline schedule. The current desktop app permits only one heartbeat per task; a second heartbeat in that task is rejected. Do not pause, replace, or shorten the baseline to make room for a temporary wake. Persist its ID and reconcile it before creating a replacement. An earlier independent native schedule is optional and may be used only if the actual environment demonstrably supports it; retain at most one such continuation. Do not invent a cron task as a workaround. Pause must disable the baseline and any supported continuation; uninstall should remove only this installation's schedules.

Compute an earlier wake from the next quota threshold transition or expected useful work, so a twelve-hour baseline does not sleep through the final-six-hour or final-hour opportunity. By default, keep the task running and use native `clock.sleep` until that time, or `pool_wait` when queue/mailbox events should wake it. Extend the current run's expected wake before sleeping, or finish the cycle and begin a new one after wake. If an earlier independent native schedule is demonstrably available, reconcile its saved ID rather than accumulating schedules. Keep the permanent baseline throughout. After beginning the local cycle, use `pool_claim`: it enforces one active or draining job per contributor account across computers. An `account_busy` response identifies the existing job and installation; defer or coordinate a same-job handoff rather than starting another job.

Use native sleep for a time-only pause and `pool_wait` for queue/mailbox events. Waiting consumes no model sampling while the tool is blocked, but subsequent model work still consumes allowance. Platform shutdown and tool limits can end a wait. Save the cursor/checkpoint and use the existing schedule to recover. Never hold a scarce Ghidra execution slot while waiting for unrelated work.
