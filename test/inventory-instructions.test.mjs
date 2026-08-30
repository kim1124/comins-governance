import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test, { afterEach } from "node:test";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const script = join(
  root,
  ".agents",
  "skills",
  "comins-updatemd",
  "scripts",
  "inventory-instructions.mjs",
);
const temporaryRoots = [];

afterEach(() => {
  for (const path of temporaryRoots.splice(0)) rmSync(path, { recursive: true, force: true });
});

function repository() {
  const path = mkdtempSync(join(tmpdir(), "comins-inventory-test-"));
  temporaryRoots.push(path);
  execFileSync("git", ["init", "--quiet"], { cwd: path });
  mkdirSync(join(path, ".codex"));
  mkdirSync(join(path, ".agents", "skills", "sample"), { recursive: true });
  mkdirSync(join(path, "docs", "plans", "archive"), { recursive: true });
  mkdirSync(join(path, "docs", "superpowers", "plans"), { recursive: true });
  writeFileSync(
    join(path, "AGENTS.md"),
    "# Rules\n\n- Read README.md, GUIDE.md, and every nested AGENTS.md before work.\n- Use gpt-5.6-sol with xhigh reasoning.\n",
  );
  writeFileSync(join(path, ".codex", "config.toml"), 'model = "gpt-5.6-sol"\n');
  writeFileSync(
    join(path, ".agents", "skills", "sample", "SKILL.md"),
    "---\nname: sample\ndescription: Use when testing.\n---\n",
  );
  writeFileSync(join(path, "COMINS_CONTRACT.md"), "# Contract\n");
  writeFileSync(join(path, "OSS_LICENSE_POLICY.md"), "# License policy\n");
  writeFileSync(join(path, "RELEASE_POLICY.md"), "# Release policy\n");
  writeFileSync(join(path, "SENSITIVE_DATA_STANDARD.md"), "# Sensitive-data policy\n");
  writeFileSync(join(path, "docs", "plans", "archive", "done.md"), "# Archived plan\n");
  writeFileSync(join(path, "docs", "superpowers", "plans", "done.md"), "# Historical plan\n");
  return path;
}

function run(path, ...extra) {
  return spawnSync(
    process.execPath,
    [script, ...extra, "--repo", `sample=${path}`],
    { cwd: root, encoding: "utf8" },
  );
}

test("emits stable JSON with logical names and repository-relative paths only", () => {
  const path = repository();
  const result = run(path, "--json");

  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.version, 1);
  assert.equal(output.repositories[0].name, "sample");
  assert.doesNotMatch(result.stdout, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.deepEqual(
    output.repositories[0].files.map(({ path: relativePath, kind }) => [relativePath, kind]),
    [
      [".agents/skills/sample/SKILL.md", "skill"],
      [".codex/config.toml", "configuration"],
      ["AGENTS.md", "automatic-guidance"],
      ["COMINS_CONTRACT.md", "common-policy"],
      ["docs/plans/archive/done.md", "historical"],
      ["docs/superpowers/plans/done.md", "historical"],
      ["OSS_LICENSE_POLICY.md", "triggered-policy"],
      ["RELEASE_POLICY.md", "triggered-policy"],
      ["SENSITIVE_DATA_STANDARD.md", "triggered-policy"],
    ],
  );
  assert.equal(
    output.repositories[0].metrics.bytesByKind["common-policy"],
    Buffer.byteLength(readFileSync(join(path, "COMINS_CONTRACT.md"), "utf8")),
  );
  assert.equal(
    output.repositories[0].metrics.bytesByKind["triggered-policy"],
    ["OSS_LICENSE_POLICY.md", "RELEASE_POLICY.md", "SENSITIVE_DATA_STANDARD.md"].reduce(
      (bytes, relativePath) =>
        bytes + Buffer.byteLength(readFileSync(join(path, relativePath), "utf8")),
      0,
    ),
  );
  assert.ok(output.repositories[0].findings.some(({ type }) => type === "broad-pre-read"));
  assert.ok(output.repositories[0].findings.some(({ type }) => type === "model-prose"));
});

test("supports concise human output without source content", () => {
  const path = repository();
  const result = run(path);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^repository sample$/m);
  assert.match(result.stdout, /automatic-guidance: 1/);
  assert.match(result.stdout, /common-policy: 1/);
  assert.match(result.stdout, /triggered-policy: 3/);
  assert.match(result.stdout, /broad-pre-read AGENTS\.md:3/);
  assert.doesNotMatch(result.stdout, /gpt-5\.6-sol|Read README/);
});

test("fails with a constant diagnostic for a non-root target", () => {
  const path = repository();
  mkdirSync(join(path, "nested"));
  const result = run(join(path, "nested"), "--json");

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "comins-updatemd inventory: failed\n");
});

test("ignores a tracked guidance file deleted from the working tree", () => {
  const path = repository();
  execFileSync("git", ["add", "AGENTS.md"], { cwd: path });
  rmSync(join(path, "AGENTS.md"));

  const result = run(path, "--json");

  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(
    output.repositories[0].files.some(({ path: relativePath }) => relativePath === "AGENTS.md"),
    false,
  );
});

test("does not flag an explicit risk-routed process sentence as mandatory", () => {
  const path = repository();
  writeFileSync(
    join(path, "README.md"),
    "Research, design, planning, TDD, review, and broad verification are selected by risk; they are not one mandatory sequence.\n",
  );

  const result = run(path, "--json");

  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(
    output.repositories[0].findings.some(({ type }) => type === "mandatory-process-chain"),
    false,
  );
});

test("reports repository-local instruction bytes and the largest discovered Codex chain", () => {
  const path = repository();
  mkdirSync(join(path, "src"));
  const nested = "# Source rules\n\n- Keep source changes focused.\n";
  writeFileSync(join(path, "src", "AGENTS.md"), nested);

  const result = run(path, "--json");

  assert.equal(result.status, 0, result.stderr);
  const repositoryResult = JSON.parse(result.stdout).repositories[0];
  const rootBytes = Buffer.byteLength(readFileSync(join(path, "AGENTS.md"), "utf8"));
  const nestedBytes = Buffer.byteLength(nested);
  assert.equal(repositoryResult.metrics.bytesByKind["automatic-guidance"], rootBytes + nestedBytes);
  assert.equal(repositoryResult.metrics.codexRootGuidanceBytes, rootBytes);
  assert.equal(repositoryResult.metrics.codexMaxDiscoveredChainBytes, rootBytes + nestedBytes);
  assert.equal(
    repositoryResult.files.find(({ path: relativePath }) => relativePath === "src/AGENTS.md").bytes,
    nestedBytes,
  );
});

test("audits explicitly activated external skills without exposing their paths", () => {
  const path = repository();
  const externalSkillRoot = mkdtempSync(join(tmpdir(), "comins-external-skill-test-"));
  temporaryRoots.push(externalSkillRoot);
  const externalSkill = join(externalSkillRoot, "SKILL.md");
  writeFileSync(
    externalSkill,
    [
      "---",
      "name: universal-process",
      "description: Use for every task.",
      "---",
      "",
      "If there is even a 1% chance this skill applies, it must run.",
      "This applies to every project regardless of perceived simplicity.",
      "If you have not run verification in this message, you cannot claim it passes.",
      "",
    ].join("\n"),
  );

  const result = run(
    path,
    "--json",
    "--external-skill",
    `universal-process=${externalSkill}`,
  );

  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.deepEqual(
    output.activatedSkills.map(({ name }) => name),
    ["universal-process"],
  );
  assert.ok(
    output.activatedSkills[0].findings.some(({ type }) => type === "broad-skill-trigger"),
  );
  assert.ok(
    output.activatedSkills[0].findings.some(
      ({ type }) => type === "unconditional-process-gate",
    ),
  );
  assert.ok(
    output.activatedSkills[0].findings.some(({ type }) => type === "fresh-evidence-only"),
  );
  assert.doesNotMatch(result.stdout, new RegExp(externalSkillRoot));
});
