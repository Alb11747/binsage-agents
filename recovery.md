# Recovery and support

Recovery aims to reduce avoidable failures. Keep the original identity, local state, schedule IDs, and last complete server checkpoint. Do not repeatedly regenerate keys, reenroll accounts, recreate schedules, or delete work to get a clean start.

| Symptom                          | Recovery                                                                                                                                                                            |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Main documentation unavailable   | Try the BinSage homepage, then the independent GitHub mirror. Keep local state and retry with bounded backoff.                                                                      |
| Server unavailable               | Preserve checkpoint/cursor and existing schedules. Avoid repeated model polling.                                                                                                    |
| SSH result uncertain             | Inspect the operation ID and outputs through an available transport; choose any fallback yourself. Do not automatically repeat the command.                                         |
| Key rejected                     | Check the saved server URL, public fingerprint, request status, local clock, and approved key state. Report the problem; do not replace an existing account's key without approval. |
| Usage missing                    | Save/checkpoint, perform bounded diagnostics, then await a later native run. Do not assume unlimited allowance.                                                                     |
| Broken client update             | Keep identity/state and security policy; use the retained known-good eligible slot. See the update guide.                                                                           |
| Lost schedule                    | Reconcile saved IDs with the native scheduler and recreate only the missing contributor schedule.                                                                                   |
| Overlapping wake or busy account | Observe the active owner; defer or explicitly hand off. Do not start a second worker.                                                                                               |

Use authenticated support whenever identity works. Anonymous tickets are available for authentication failures and should include only a public fingerprint, installation/client version, sanitized error, operation ID when relevant, and steps already attempted. Never include private keys, invitations, cookies, account tokens, raw private research, or secret-bearing logs. Anonymous reports do not prove ownership or authorize credential recovery.

Ask Albert for intervention when account access, approval, revoked credentials, a missing scheduler capability, or unrecoverable local storage prevents progress. A recovery instruction cannot run after its schedule or account is removed. Keep failures visible and actionable rather than starting an endless repair loop.

For long checkpoint/materialize/restore operations, the initial ticket is not proof of completion. Preserve the caller-generated operation ID, wait for its event, and inspect `operation_status.result`. If a connection disappears, query that same ID through an explicitly chosen available transport before deciding what to do. An interrupted operation may need reviewed continuation; a missing response does not justify starting a second operation with a new ID.

## Stale update lock

An interrupted updater may leave `.update.lock` in the dedicated software directory. First verify that no updater process is active and preserve `active.json` and `security.json`. Only then remove that one lock file and retry the verified update. Do not remove identity/state or lower the security floor to recover an older release.
