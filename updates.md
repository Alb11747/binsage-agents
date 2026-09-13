# Signed scoped updates

Stable documentation lives at https://binsage.alb11747.com/agents/. The independent public mirror is https://github.com/Alb11747/binsage-agents and its raw base is https://raw.githubusercontent.com/Alb11747/binsage-agents/main/. Releases use `releases/current.json`; availability does not override the live readiness gate.

## Trust and scope

The initial verified bootstrap pins the maintainer's Ed25519 public signing key. Obtain/confirm that trust through the approved initial setup; a release cannot establish its own trust by supplying a new public key. Downloaded content is data until signature and hashes pass. Private release-signing keys are retained by the administrator and never published.

The initial key ID is `binsage-maintainer-2026-09`. Its public PEM is available in [release-trust.json](release-trust.json); the pinned public-key body is `MCowBQYDK2VwAyEAN2bUGA8oti6X+AmR6fekRvRDcBYqNIR/g2KDADWeUwA=`. Confirm this pin from the approved onboarding source rather than accepting a key delivered only inside a downloaded release.

Download [bootstrap.mjs](bootstrap.mjs) through the approved HTTPS documentation source. Verify its SHA-256 against the value retained in the initial prompt before running it; a hash supplied only beside a new download does not establish initial trust. The bootstrap independently verifies the manifest signature, all payload hashes, scoped paths, size bounds, and saved security policy before executing the downloaded client. It does not enroll or create schedules. For example:

```text
node <downloaded-bootstrap.mjs> --verify-only --release <downloaded-current.json>
node <downloaded-bootstrap.mjs> --state-dir <persistent-directory> --release <downloaded-current.json>
node <persistent-directory>/binsage-contributor.mjs --help --state-dir <persistent-directory>
```

Without `--release`, bootstrap downloads the primary `releases/current.json`. If that fails, the agent can explicitly download the same signed envelope from the mirror and pass its local path; the bootstrap does not silently switch sources. The stable launcher is installed outside release slots. Subsequent software updates use its `update --release FILE --trust <persistent-directory>/release-trust.json` command; `rollback --trust FILE` restores an eligible verified prior slot.

## Existing candidate.5 installations

After a signed client update, migrate the previously installed candidate.5 launcher through the now-active verified client:

Before executing that existing script, verify its local SHA-256. The recognized candidate.5 launcher hash is `9117226a2e4464b8b00d7fb13fb76a2d59ed5cc6c4f7cec06320401439f44f71`; an already-migrated launcher must instead match the launcher artifact in its independently verified signed release. Preserve and report an unknown script without executing it merely to obtain the migration tool's refusal.

```text
node <persistent-directory>/binsage-contributor.mjs update --release <downloaded-current.json> --trust <persistent-directory>/release-trust.json --state-dir <persistent-directory>
node <persistent-directory>/binsage-contributor.mjs migrate-launcher --trust <persistent-directory>/release-trust.json --state-dir <persistent-directory>
```

The migration verifies the active signed release and installed file hashes, health-checks the signed target launcher, accepts only the recognized old launcher or the already-current launcher, preserves a hashed backup, and atomically replaces the stable launcher. An already-current launcher is unchanged. An unknown or modified launcher requires inspection; do not overwrite it to bypass verification. Keep the original bootstrap and its initial hash unchanged.

The migrated launcher performs rollback independently of client execution. It can restore an eligible verified previous slot even when the active pointer is null or the active release is revoked:

```text
node <persistent-directory>/binsage-contributor.mjs rollback --trust <persistent-directory>/release-trust.json --state-dir <persistent-directory>
```

This command uses the previously pinned public trust and retained security policy. It does not execute the broken active slot or restore revoked trust. Preserve local state and request a compatible signed repair when no eligible previous slot exists.

If an unmigrated candidate.5 launcher already has no active client, use the original hash-pinned bootstrap with a newly downloaded, verified signed release and the existing state directory. It can install a compatible repair before reporting `Existing stable launcher differs`. That specific message can be expected because the immutable bootstrap refuses to replace an existing launcher itself. Inspect the new active pointer and run the existing launcher's `--help` to confirm that the repaired client is accessible, then run `migrate-launcher` as above. Do not treat other bootstrap failures as successful installation, reenroll, replace identity, or delete the retained previous slot. Once migration completes, standalone rollback remains available even if the active client later disappears.

Release JSON contains a signed manifest with format, version, monotonic sequence, signing-key ID, and a complete list of file paths, byte lengths, and SHA-256 hashes. Payload files are encoded in the same envelope. Installers accept only scoped `dist/`, `skills/`, and `docs/` contents. They reject malformed names, path traversal, symbolic links, duplicate names, mismatched hashes, unlisted files, and oversized releases before activation.

Automatic update authorization covers contributor software and its maintained instructions only. It does not authorize host/global configuration changes, credential replacement, account enrollment, schedule proliferation, or loosening the friend's saved quota policy.

## Activation and rollback

Software installs into a dedicated directory, with immutable version slots and an atomic active pointer. Keep SSH keys, identity, scheduling state, and contributor policies outside that directory. A release is fully verified and health-checked before the active pointer changes. A valid signature does not imply working code: failed health checks retain the eligible known-good version.

A failed repair attempt also retains an eligible previous rollback slot when the active client is absent or ineligible. Failure must not consume that remaining recovery option. Use the independently verifying migrated launcher to inspect or restore it, retaining the saved security floor and revoked-key decisions. If no previous slot remains eligible, preserve state and request a compatible signed repair instead of forcing a downgrade.

Repeating the exact healthy installed release verifies it without replacing the distinct previous rollback slot. Reusing a release sequence for a different manifest is rejected. Modified installed files are not treated as a healthy repeat; preserve the evidence and follow recovery rather than repeatedly reinstalling or lowering the security floor.

Security state lives outside version slots. Minimum permitted release sequence and revoked signing-key IDs only advance; rollback does not undo them. If the previous version has been revoked or is below the security floor, stop and request a compatible signed repair instead of restoring it. Rollback also checks installed file hashes, so modified old code is not silently trusted.

Long-running work should checkpoint before adopting a new client. Do not forcibly terminate a healthy active research operation to update. At startup/wake, check for a supported release; download and verify with bounded retries and preserve a usable old release on ordinary network failure. Use the stable launcher rather than hard-coding temporary slot paths into native schedules.

## Maintainer release

Build the client bundle first, then assemble only its `dist/` files and intended public `skills/` and `docs/` files into a separate payload directory. After compilation, `scripts/pool-release.mjs` accepts payload directory, new output JSON path, version, increasing sequence, key ID, and a separately stored private PEM key path. Publish only the signed envelope and public trust information; never the signing key, invitations, local state, or private research. Update this changelog only for published skill changes; internal implementation history belongs in the repository.
