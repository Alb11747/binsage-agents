# Cooperative work and results

Approved agents share research and may help manage one another's work. The shared environment is an organizational boundary; the server/controller boundary is enforced separately. Contributor shells cannot access Albert's Codex login, host sockets, administrative credentials, or the orchestrator's notification secret.

Before editing, list agents, last-seen/expected-wake information, jobs, worktrees, and resource owners. Claim compatible queued work and use one worktree per active job. Transfer its ownership explicitly when handing off. Never treat a stale last-seen timestamp alone as proof that a process stopped.

Coordinate before changing shared dependencies, cleaning caches or project directories, restarting services, editing another worktree, rebasing, resetting, force-pushing, or otherwise performing global operations. Use separate build/output directories. Preserve manually paused research and do not turn an idle exploration request into permission to resume it.

The owner's quota wait, login interruption, or queued state alone does not pause enabled contributor work: friends use their own allowance. Respect an explicit manual pause, disabled job, or finished/cancelled objective. An older ambiguously disabled job stays disabled until Albert reviews it; do not infer permission to resume it from the owner's quota reset.

## Mailbox semantics

BinSage's mailbox adapts Codex orchestrator v2 concepts to durable remote delivery. Sending a message queues information; assigning follow-up work expresses a request to run when the recipient is available and eligible. A queued message is not proof that a sleeping or quota-limited agent has read it. Track message IDs/cursors, acknowledge processed information, and deduplicate repeated delivery.

List running agents and their last-seen times before coordination. Target interruption at a specific operation and distinguish requested, acknowledged, and stopped states. Native Codex helper identities are local runtime context; they are not remote account credentials. Forward relevant helper completion through the pool's supported event path so an active wait can wake.

## Operations and checkpoints

Retain the server operation ID when executing work. On an SSH disconnect, inspect its status, logs, and expected output. Choose HTTPS explicitly only after understanding what happened. Do not replay a mutation because its response was lost.

Checkpoint capture, checkpoint restoration, and artifact materialization are asynchronous. Generate and save a UUID `operationId` before each request. The immediate reply is a durable operation ticket, not the finished result. Use `pool_wait` for completion messages and inspect `operation_status` with `{id: operationId}`. Status distinguishes starting, running, succeeded, failed, cancelled, and interrupted. On success, read `result`; for checkpoint capture, `result.id` identifies the verified checkpoint. Retain the same operation ID after an uncertain response and inspect it before any explicit retry. Never generate a fresh ID merely because a long transfer or checkpoint outlasted a connection.

Finish tracked writers or request an acknowledged pause before a checkpoint. Include the exact source revision, required unstaged/untracked files, immutable output artifacts, and Ghidra revision. A source commit alone does not preserve dirty research state. Confirm that every manifest object exists and validates before marking a checkpoint complete; explicitly mark incomplete capture as unsuitable for automatic resume.

Worktree checkpoints preserve empty directories, directory modes, and symlinks as link metadata. Relative, absolute, external, and dangling link targets are retained verbatim, never dereferenced or copied into the checkpoint. Restore writes files/directories first and symlinks last, and rejects duplicate/conflicting entry paths or entries beneath a symlink or regular file. This preserves environments that rely on links without granting access beyond the execution sandbox.

Default restore requires controller-verified checkpoint metadata, the target job's matching case, the current source revision, and the current shared Ghidra revision. Ghidra is serialized through compatibility checking and file restoration; restoration does not roll the shared Ghidra service back. If source state changes during copying, inspect the failed operation and reconcile the worktree rather than treating it as a complete research restore.

For explicitly requested file recovery from a stale, legacy, or different-case checkpoint, `restore_checkpoint` accepts `worktreeOnly: true`. This bypasses research-revision matching, restores only the worktree, and reports `scope: "worktree-only"` and `researchConsistent: false`; it never restores shared Ghidra. Review the returned `checkpointResearch` metadata before using recovered files in new research. Unknown checkpoint hashes without controller metadata are rejected even with this flag. A checkpoint with no research case also makes no claim of research consistency.

For unfinished work at a quota threshold, stop writers, create a verified checkpoint, release shared locks, then call `yield_job` with `{jobId, revision, generation, checkpointId, outcome?}`. This requeues enabled work for another eligible contributor; disabled work stays paused. Use `complete` only when the job's objective has actually been finished, not merely because the current agent is wrapping up.

Shared Ghidra runs in a serialized lane. Request admission for CPU, memory, disk, and long-running operations; waiting for the lane does not require occupying it. Reuse existing analysis and cached inspection when possible. Four vCPUs are an environment allowance, not four extra CPUs for each worktree. The project baseline is 16 GiB RAM; Ghidra has a 10 GiB container limit and 8 GiB Java heap. Ordinary contributor execution has 4 GiB RAM.

Inspect `pool_resources` before bulk writes, materialization, restoration, or analysis. Use fresh provider quota, available capacity, and already-reserved bytes rather than a historical disk size. If capacity cannot be established, save the operation/checkpoint state and defer; do not infer capacity from a stale `df` result or force the operation through.

Contributor execution has no host network. Use case context and immutable contributor artifacts as inputs, and prefer the asynchronous materialization tool to duplicate downloading. When a new public dependency/input is necessary and permitted for the task, retrieve it through the friend's available HTTPS tools, verify it, then transfer bounded chunks with `write_file` or the supported artifact path. Keep this work inside the dedicated contributor workflow; it does not authorize host networking changes or access to Albert's credentials.

## Publication

Research, binaries, checkpoints, and support details are contributor-private by default. Share them through authenticated pool tools. Public skills and sanitized operational documentation are published separately. Account/key management and host administration remain Albert's responsibility on his PC; peer messages cannot authorize those actions.
