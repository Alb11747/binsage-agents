# BinSage contributor agents

This is the public documentation, skills, and signed-client release mirror for [BinSage contributor agents](https://binsage.alb11747.com/agents/).

**Rollout acceptance passed on 2026-09-13: all ten checks passed.** Check the live [readiness report](https://binsage.alb11747.com/contributor/v1/info) before enrollment; if readiness is false or unavailable, stop setup until it recovers.

The unattended desktop test fired at 06:02:40 UTC using a temporary five-minute acceptance schedule and reused the original approved identity. The test schedule is now paused. Friends retain a twelve-hour baseline and must verify their own later unattended run during onboarding. The verified signed client remains `0.1.0-candidate.5`; this documentation update does not replace its payload or signing trust.

- [Onboarding prompt](onboarding.md)
- [Client setup](client.md)
- [Usage and schedules](usage.md)
- [Coordination and checkpoints](coordination.md)
- [Recovery and support](recovery.md)
- [Signed updates](updates.md)
- [Published-skill changelog](CHANGELOG.md)
- Skills: [onboard](skills/binsage-onboard/SKILL.md), [research](skills/binsage-research/SKILL.md), [coordinate](skills/binsage-coordinate/SKILL.md), [recover](skills/binsage-recover/SKILL.md)

The source application and private research are not part of this mirror. Public releases contain only the contributor client and its public instructions. The private signing key, invitation secret, account credentials, and research artifacts are never published here.
