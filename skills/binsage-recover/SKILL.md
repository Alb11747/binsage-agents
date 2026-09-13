---
name: binsage-recover
description: Diagnose and recover BinSage contributor authentication, schedules, interrupted operations, and failed signed updates without discarding identity or checkpoints.
---

Read https://binsage.alb11747.com/agents/recovery.md for the matching symptom; use https://github.com/Alb11747/binsage-agents if the main site fails. Preserve keys, account identity, schedule IDs, custom usage policy, security state, and last complete checkpoints.

Use operation status/logs to reconcile uncertain execution before manually selecting another transport. Do not regenerate keys or replay mutations automatically. Reconcile existing schedules before replacements. For updates, use the signed-update guide and eligible known-good slot; never lower the security floor or restore revoked signing trust.

The desktop app's rejection of a second heartbeat does not require repair. Preserve the permanent twelve-hour baseline and use native sleep or pool wait for earlier continuation. Never pause, replace, or delete that baseline just to fit a temporary wake; if a long wait ends unexpectedly, recover on the baseline.

Prefer authenticated support, or submit a sanitized anonymous authentication-failure ticket. Include public fingerprint, client version, error and attempted recovery, never private keys or secrets. Anonymous reports cannot authorize account recovery. Use bounded retries and visible diagnostics; request intervention when approval, account access, persistent storage, or native scheduling cannot be recovered.
