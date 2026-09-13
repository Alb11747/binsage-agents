#!/usr/bin/env node
// Initial trust is pinned here, independently of the downloaded release envelope.
import { createHash, verify } from "node:crypto";
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  writeFile,
  rm,
} from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { homedir, tmpdir } from "node:os";
import { spawn } from "node:child_process";
import { parseArgs } from "node:util";

const KEY_ID = "binsage-maintainer-2026-09";
const PUBLIC_KEY =
  "-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEAN2bUGA8oti6X+AmR6fekRvRDcBYqNIR/g2KDADWeUwA=\n-----END PUBLIC KEY-----\n";
const MAX_ENVELOPE = 90 * 1024 * 1024;
const hash = (data) => createHash("sha256").update(data).digest("hex");
const { values } = parseArgs({
  options: {
    release: { type: "string" },
    "state-dir": { type: "string" },
    "verify-only": { type: "boolean" },
    help: { type: "boolean" },
  },
});
if (values.help) {
  process.stdout.write(
    "BinSage bootstrap [--release LOCAL_JSON_OR_HTTPS_URL] [--state-dir DIRECTORY] [--verify-only]\nVerifies the pinned Ed25519 signature and every payload hash before executing any downloaded code. Does not enroll an account or create schedules.\n",
  );
  process.exit(0);
}
if (Number(process.versions.node.split(".")[0]) < 24)
  throw new Error("Node.js 24 or newer is required");
async function noLinks(path) {
  let current = resolve(path);
  while (true) {
    try {
      if ((await lstat(current)).isSymbolicLink())
        throw new Error(`Symbolic links are not supported: ${current}`);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    const parent = dirname(current);
    if (parent === current) return;
    current = parent;
  }
}
const source =
  values.release ?? "https://binsage.alb11747.com/agents/releases/current.json";
let raw;
if (/^https:\/\//.test(source)) {
  const response = await fetch(source, {
    signal: AbortSignal.timeout(120_000),
    redirect: "error",
  });
  if (!response.ok || !response.body)
    throw new Error(`Release download failed: ${response.status}`);
  const chunks = [];
  let bytes = 0;
  for await (const chunk of response.body) {
    bytes += chunk.length;
    if (bytes > MAX_ENVELOPE)
      throw new Error("Release envelope exceeds size limit");
    chunks.push(chunk);
  }
  raw = Buffer.concat(chunks);
} else {
  const path = resolve(source);
  await noLinks(path);
  if ((await lstat(path)).size > MAX_ENVELOPE)
    throw new Error("Release envelope exceeds size limit");
  raw = await readFile(path);
}
const release = JSON.parse(raw.toString("utf8"));
const m = release.manifest;
if (
  !m ||
  m.format !== 1 ||
  m.keyId !== KEY_ID ||
  !Number.isSafeInteger(m.sequence) ||
  m.sequence < 1 ||
  typeof m.version !== "string" ||
  !/^[a-zA-Z0-9._-]{1,80}$/.test(m.version) ||
  !Array.isArray(m.files) ||
  !m.files.length ||
  m.files.length > 1024 ||
  typeof release.signature !== "string" ||
  release.signature.length > 256 ||
  !release.files ||
  typeof release.files !== "object" ||
  Array.isArray(release.files)
)
  throw new Error("Invalid release manifest");
if (
  !verify(
    null,
    Buffer.from(JSON.stringify(m)),
    PUBLIC_KEY,
    Buffer.from(release.signature, "base64"),
  )
)
  throw new Error("Release signature does not match pinned maintainer key");
const paths = new Set();
const decoded = new Map();
let total = 0;
for (const file of m.files) {
  if (
    !file ||
    typeof file.path !== "string" ||
    file.path.length > 240 ||
    !/^(dist|skills|docs)\/[a-zA-Z0-9_./-]+$/.test(file.path) ||
    file.path
      .split("/")
      .some(
        (part) =>
          !part ||
          part === "." ||
          part === ".." ||
          part.endsWith(".") ||
          /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part),
      ) ||
    paths.has(file.path.toLowerCase()) ||
    !Number.isSafeInteger(file.bytes) ||
    file.bytes < 0 ||
    file.bytes > 16 * 1024 * 1024 ||
    !/^[0-9a-f]{64}$/.test(file.sha256)
  )
    throw new Error("Invalid release file");
  paths.add(file.path.toLowerCase());
  const encoded =
    Object.hasOwn(release.files, file.path) && release.files[file.path];
  total += file.bytes;
  if (
    typeof encoded !== "string" ||
    encoded.length > Math.ceil((16 * 1024 * 1024) / 3) * 4 ||
    total > 64 * 1024 * 1024
  )
    throw new Error("Release payload exceeds bounds");
  const bytes = Buffer.from(encoded, "base64");
  if (
    bytes.toString("base64") !== encoded ||
    bytes.length !== file.bytes ||
    hash(bytes) !== file.sha256
  )
    throw new Error("Release payload hash mismatch");
  decoded.set(file.path, bytes);
}
if (
  Object.keys(release.files).length !== m.files.length ||
  !decoded.has("dist/pool-client.js") ||
  !decoded.has("dist/binsage-contributor.mjs")
)
  throw new Error("Release has unlisted files or lacks the client/launcher");
for (const path of paths) {
  const parts = path.split("/");
  for (let i = 1; i < parts.length; i++)
    if (paths.has(parts.slice(0, i).join("/")))
      throw new Error("Release file conflicts with a directory");
}
process.stdout.write(
  `Verified ${m.version}, sequence ${m.sequence}, ${m.files.length} files, pinned key ${KEY_ID}\n`,
);
if (values["verify-only"]) process.exit(0);

const state = resolve(
  values["state-dir"] ?? join(homedir(), ".binsage-contributor"),
);
await noLinks(state);
await mkdir(state, { recursive: true, mode: 0o700 });
const trustPath = join(state, "release-trust.json");
await noLinks(trustPath);
try {
  const trust = JSON.parse(await readFile(trustPath, "utf8"));
  if (trust.keys?.[KEY_ID] !== PUBLIC_KEY)
    throw new Error(
      "Existing release trust differs; preserve it and request a reviewed trust migration",
    );
  if (
    m.sequence < (trust.policy?.minimumSequence ?? 1) ||
    trust.policy?.revokedKeyIds?.includes(KEY_ID)
  )
    throw new Error("Release is rejected by the saved trust policy");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  await writeFile(
    trustPath,
    JSON.stringify(
      {
        keys: { [KEY_ID]: PUBLIC_KEY },
        policy: { minimumSequence: 1, revokedKeyIds: [] },
      },
      null,
      2,
    ),
    { flag: "wx", mode: 0o600 },
  );
}
const securityPath = join(state, "software", "security.json");
await noLinks(securityPath);
try {
  const security = JSON.parse(await readFile(securityPath, "utf8"));
  if (
    !Number.isSafeInteger(security.minimumSequence) ||
    !Array.isArray(security.revokedKeyIds)
  )
    throw new Error("Invalid saved security policy; inspect recovery state");
  if (
    m.sequence < security.minimumSequence ||
    security.revokedKeyIds.includes(KEY_ID)
  )
    throw new Error(
      "Release is below the saved security floor or has a revoked signing key",
    );
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const temporary = await mkdtemp(join(tmpdir(), "binsage-bootstrap-"));
async function run(args) {
  await new Promise((resolveRun, reject) => {
    const child = spawn(process.execPath, args, {
      stdio: "inherit",
      windowsHide: true,
    });
    const timer = setTimeout(() => {
      child.kill();
      reject(
        new Error("Verified installer timed out; inspect saved update state"),
      );
    }, 60_000);
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("exit", (code) => {
      clearTimeout(timer);
      code === 0
        ? resolveRun()
        : reject(new Error(`Verified installer exited ${code}`));
    });
  });
}
try {
  // Only signature-checked files enter this temporary execution directory.
  for (const [path, bytes] of decoded) {
    const target = join(temporary, path);
    await mkdir(dirname(target), { recursive: true, mode: 0o700 });
    await writeFile(target, bytes, { flag: "wx", mode: 0o600 });
  }
  const envelope = join(temporary, "release.json");
  await writeFile(envelope, raw, { flag: "wx", mode: 0o600 });
  await run([
    join(temporary, "dist/pool-client.js"),
    "update",
    "--release",
    envelope,
    "--trust",
    trustPath,
    "--state-dir",
    state,
  ]);
  const launcher = join(state, "binsage-contributor.mjs");
  await noLinks(launcher);
  try {
    const prior = await readFile(launcher);
    if (hash(prior) !== hash(decoded.get("dist/binsage-contributor.mjs")))
      throw new Error(
        "Existing stable launcher differs; preserve it and review migration before replacement",
      );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await writeFile(launcher, decoded.get("dist/binsage-contributor.mjs"), {
      flag: "wx",
      mode: 0o600,
    });
  }
  process.stdout.write(
    `Installed verified software. Stable launcher: ${launcher}\nNext: check live readiness and follow /agents/onboarding.md; no enrollment or schedule has been created.\n`,
  );
} finally {
  if (
    dirname(resolve(temporary)) !== resolve(tmpdir()) ||
    !temporary.split(/[\\/]/).at(-1).startsWith("binsage-bootstrap-")
  )
    throw new Error(
      "Unexpected bootstrap temporary directory; preserve it for inspection",
    );
  await rm(temporary, { recursive: true, force: true });
}
