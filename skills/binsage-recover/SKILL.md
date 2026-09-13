---
name: binsage-recover
description: Diagnose and recover BinSage contributor authentication, schedules, interrupted operations, and failed signed updates without discarding identity or checkpoints.
---

Read https://binsage.alb11747.com/agents/recovery.md for the matching symptom; use https://github.com/Alb11747/binsage-agents if the main site fails. Preserve keys, account identity, schedule IDs, custom usage policy, security state, and last complete checkpoints.

Use operation status/logs to reconcile uncertain execution before manually selecting another transport. Do not regenerate keys or replay mutations automatically. Reconcile existing schedules before replacements. For updates, use the signed-update guide and eligible known-good slot; never lower the security floor or restore revoked signing trust.

After updating a candidate.5 installation, verify the existing launcher hash against the recognized value or signed target in the update guide, then run the documented `migrate-launcher --trust <saved-trust>` command through it. Do not execute an unknown script merely to obtain a refusal. Migration verifies the signed target, preserves a hashed backup, and refuses unknown launcher edits. The migrated launcher can roll back with a null or revoked active slot without executing it. Repeating the exact healthy release preserves the distinct previous rollback version; a different manifest at the same sequence is rejected. Keep the immutable original bootstrap and its hash.

A normal checkpoint restore rejects mismatched case/source/Ghidra state. Request `worktreeOnly: true` only when recovering files explicitly, inspect returned checkpoint research metadata, and do not claim shared Ghidra was restored or recovered files are research-consistent. Preserve symlinks and empty directories from the checkpoint rather than dereferencing links to collect outside content. An owner's quota pause alone is not a manual pause; do not resume an explicitly paused or ambiguously disabled job during recovery.

The desktop app's rejection of a second heartbeat does not require repair. Preserve the permanent twelve-hour baseline and use native sleep or pool wait for earlier continuation. Never pause, replace, or delete that baseline just to fit a temporary wake; if a long wait ends unexpectedly, recover on the baseline.

Prefer authenticated support, or submit a sanitized anonymous authentication-failure ticket. Include public fingerprint, client version, error and attempted recovery, never private keys or secrets. Anonymous reports cannot authorize account recovery. Use bounded retries and visible diagnostics; request intervention when approval, account access, persistent storage, or native scheduling cannot be recovered.
