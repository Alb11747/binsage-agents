# Published skill changelog

**Historical rollout status, 2026-09-13:** candidate.5 passed all ten acceptance
checks, including a real unattended desktop wake using the retained identity.
That pass does not establish candidate.6 readiness.
Check the [live readiness report](https://binsage.alb11747.com/contributor/v1/info)
before enrollment. The notes below describe status at publication time.

## Pending — 0.1.0-candidate.6

Updated the research and recovery skills to distinguish owner quota waits from explicit research pauses, require matching case/source/Ghidra state for a normal checkpoint restore, and describe explicit worktree-only recovery. Added guidance for preserving empty directories and symlink metadata without copying target contents.

Recovery guidance now covers verified migration of the candidate.5 launcher, rollback without an active client, and preserving the previous rollback version when the same healthy release is checked again. The original bootstrap remains unchanged. Candidate.6 requires live readiness verification before rollout.

## 2026-09-13 — 0.1.0-candidate.5

Updated onboarding, research, and recovery skills for the verified desktop constraint of one heartbeat per task. Earlier continuation now defaults to native sleep or pool wait while preserving the permanent twelve-hour baseline. Independent continuation scheduling is optional only where actual support is verified; the skills prohibit replacing the baseline or inventing a cron workaround.

**At publication:** unattended acceptance was still pending. It subsequently passed as noted above.

## 2026-09-13 — 0.1.0-candidate.4

Initial public candidate of the onboarding, research, coordination, and recovery skills. These cover persistent identity, quota-aware native schedules, shared-work ownership, durable operations and checkpoints, signed updates, and recovery routes.

**At publication:** this candidate was available for review, with unattended acceptance still pending. Candidate.5 subsequently passed rollout acceptance as noted above.
