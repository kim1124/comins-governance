import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test, { afterEach } from "node:test";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const script = join(
  root,
  ".agents",
  "skills",
  "comins-reference",
  "scripts",
  "sync-guidance.mjs",
);
const templatePath = join(root, "templates", "module", "AGENTS.md");
const startPattern = /<!-- comins-reference:managed-start contract=v[^\s]+ -->/;
const endMarker = "<!-- comins-reference:managed-end -->";
const temporaryRoots = [];

afterEach(() => {
  for (const path of temporaryRoots.splice(0)) {
    rmSync(path, { recursive: true, force: true });
  }
});

function createRepository() {
  const path = mkdtempSync(join(tmpdir(), "comins-reference-test-"));
  temporaryRoots.push(path);
  execFileSync("git", ["init", "--quiet"], { cwd: path, stdio: "ignore" });
  return path;
}

function canonicalBlock() {
  const template = readFileSync(templatePath, "utf8");
  const start = template.search(startPattern);
  const end = template.indexOf(endMarker, start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  return template.slice(start, end + endMarker.length);
}

function run(operation, target) {
  return spawnSync(process.execPath, [script, operation, "--target", target], {
    cwd: root,
    encoding: "utf8",
  });
}

test("initializes a missing AGENTS.md from the canonical managed block", () => {
  const target = createRepository();
  const result = run("init", target);

  assert.equal(result.status, 0);
  assert.equal(result.stdout, "comins-reference: initialized\n");
  assert.equal(result.stderr, "");
  assert.equal(readFileSync(join(target, "AGENTS.md"), "utf8"), `${canonicalBlock()}\n`);
});

test("refuses to overwrite an existing AGENTS.md during initialization", () => {
  const target = createRepository();
  const agentsPath = join(target, "AGENTS.md");
  const original = "# Existing module guidance\n";
  writeFileSync(agentsPath, original);

  const result = run("init", target);

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "comins-reference: failed\n");
  assert.equal(readFileSync(agentsPath, "utf8"), original);
});

test("updates only the managed block and preserves module guidance byte-for-byte", () => {
  const target = createRepository();
  const agentsPath = join(target, "AGENTS.md");
  const oldBlock = [
    "<!-- comins-reference:managed-start contract=v1.1 -->",
    "# Old shared guidance",
    "<!-- comins-reference:managed-end -->",
  ].join("\n");
  const prefix = "<!-- repository-owned-prefix -->\n";
  const suffix = "\n\n## Module Guidance\n\n- Preserve the module-specific verification command.\n";
  writeFileSync(agentsPath, `${prefix}${oldBlock}${suffix}`);

  const result = run("update", target);

  assert.equal(result.status, 0);
  assert.equal(result.stdout, "comins-reference: updated\n");
  assert.equal(result.stderr, "");
  assert.equal(
    readFileSync(agentsPath, "utf8"),
    `${prefix}${canonicalBlock()}${suffix}`,
  );
});

test("refuses automatic update of an unmarked legacy AGENTS.md", () => {
  const target = createRepository();
  const agentsPath = join(target, "AGENTS.md");
  const original = "# Legacy module guidance\n\n- Keep this project rule.\n";
  writeFileSync(agentsPath, original);

  const result = run("update", target);

  assert.equal(result.status, 1);
  assert.equal(result.stderr, "comins-reference: failed\n");
  assert.equal(readFileSync(agentsPath, "utf8"), original);
});

test("refuses a target that is not the Git repository root", () => {
  const target = createRepository();
  const nested = join(target, "nested");
  mkdirSync(nested);

  const result = run("init", nested);

  assert.equal(result.status, 1);
  assert.equal(result.stderr, "comins-reference: failed\n");
});
