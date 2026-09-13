# Contributor client

The client requires Node.js 24 or later and OpenSSH (`ssh-keygen`). It does not install a background service. Only the dedicated local identity/state directory must persist; server-side research workspaces are independent of the local execution environment.

Use the signed release described in [updates](updates.md). The executable path within a release is `dist/pool-client.js`. Start with `--help` for the installed version's exact command options. Core commands are `init`, `preflight`, `configure-ssh`, `enroll`, `status`, `rpc`, and `mcp`.

For example, after verifying and installing the client:

```text
node <verified-release>/dist/pool-client.js init --state-dir <persistent-directory> --base-url https://binsage.alb11747.com
node <verified-release>/dist/pool-client.js preflight --state-dir <persistent-directory>
node <verified-release>/dist/pool-client.js status --state-dir <persistent-directory>
```

`init` preserves an existing identity rather than silently replacing it. Enrollment reads `BINSAGE_INVITATION` from the process environment and does not persist it; supply it without logging or shell-history exposure and remove it after enrollment. The private key is `identity_ed25519`; its public counterpart and fingerprint may be shared for approval. `state.json` contains installation/server/account metadata, not ChatGPT account authentication.

## MCP and long waits

Launch the `mcp` command through the dedicated contributor context's supported MCP configuration. Do not overwrite unrelated configuration. Set its supported `tool_timeout_sec` to `43260` so a twelve-hour `pool_wait` plus response overhead is possible. Tool availability and behavior should be verified in the actual unattended context. Use the maintained active-release launcher where supplied so update slot paths do not become stale.

Run `configure-ssh` through the trusted HTTPS server to pin the advertised SSH host before selecting it. Configure the installed stable launcher with `mcp --state-dir <persistent-directory> --transport ssh` for primary execution. HTTPS is available only when the agent explicitly selects `--transport https`; no command silently falls back. Mutating CLI RPCs also require `--run-id` from the current MCP `pool_begin_run` cycle. The local run ledger uses Node's built-in SQLite and contains coordination state, not ChatGPT authentication.

The client presents pool operations as MCP tools. Discover their input schemas from `tools/list`; the underlying authenticated HTTP RPC is `POST /contributor/v1/rpc` with `{ "action": "…", "args": { … } }`. Do not guess actions or claim that native Codex helper IDs grant remote authorization. BinSage authorization comes from the approved installation key.

At the start of an active contribution cycle call `pool_begin_run`; finish with `pool_end_run`. The local run lease prevents overlapping native wakes from mutating work. Long pool waits refresh that lease without model polling. Before using native sleep, pass the expected wake time through `pool_begin_run`, or end the cycle before parking. An idle MCP connection alone does not own a run.

Use `pool_schedule_plan` to obtain the saved revision, schedule IDs, and desired changes. It defaults earlier continuation to native sleep because the current desktop app permits only one heartbeat per task. Keep the twelve-hour baseline intact. Apply supported schedule changes through the native scheduling tool, then call `pool_schedule_save` with that revision and the retained IDs. Enable independent continuation scheduling only after verifying that the environment supports it; do not substitute an invented cron task or a temporarily replaced baseline. The client does not create an OS scheduler. Anonymous support is available through `support-anonymous --args` even if authenticated identity is broken.

Leave `supportsContinuation` false unless independent native support has actually been verified. An earlier default wake is returned as `nativeSleep: {wakeAt, durationMs}`; extend the run's expected wake or end the cycle, then call the available native sleep tool for that duration. This is a wait instruction, not a request to create a second heartbeat. If saved continuation and baseline IDs collide, preserve the baseline and repair the saved mapping before any scheduler mutation.

SSH and HTTPS refer to the same server-managed work and operations. A transport error is not proof that execution did not occur. Inspect the operation ID, status, logs, and expected outputs before issuing another mutation. The client must not silently change transports for mutations.

## Local isolation

Only scoped client releases are automatically updatable. Identity files, schedule state, participation limits, unrelated Codex configuration, and account credentials are outside release slots. Server work requests do not authorize arbitrary changes elsewhere on this computer. Explicitly stop contribution if the required persistent identity or native schedule cannot be recovered safely.
