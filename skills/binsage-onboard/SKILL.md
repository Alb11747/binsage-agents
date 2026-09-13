---
name: binsage-onboard
description: Set up a friend's persistent BinSage contributor identity and native schedule, or reconcile an incomplete enrollment.
---

Read https://binsage.alb11747.com/agents/onboarding.md and the live `/contributor/v1/info` readiness report before enrollment. If the site fails, use the homepage then https://github.com/Alb11747/binsage-agents. Do not claim readiness from the presence of these skills.

Verify persistent local storage, native scheduling, own-account quota access, and server connectivity. Hosted environments without these capabilities must direct the user to the local desktop app on an awake, online computer. Do not store private keys in memory; preserve dedicated local keys/state outside release slots.

Request account approval using the privately supplied invitation and locally generated public key. Approval binds the reviewed fingerprint/revision; retries must preserve identity. Show the public fingerprint, never secrets. Configure one permanent twelve-hour native schedule, preserving its ID and unrelated settings. The current desktop app supports only one heartbeat per task: use native sleep or pool wait for earlier work by default. Never pause or replace the baseline for a temporary wake, and never invent a cron workaround. Use at most one independent continuation only after verifying actual support. Record a later unattended run with the same identity before calling setup complete.

Use the usage guide for defaults and contributor customization. Updates do not authorize changed quota limits, account credentials, or global configuration. Once enrolled, scheduled runs operate the queue rather than reenrolling.
