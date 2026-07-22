import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
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
const templatePath = join(root, "templates", "module", "AGENTS.template.md");
const configTemplatePath = join(root, "templates", "module", ".codex", "config.toml");
const startPattern = /<!-- comins-reference:managed-start contract=v[^\s]+ -->/;
const endMarker = "<!-- comins-reference:managed-end -->";
const configStart = "# comins-reference:managed-start";
const configEnd = "# comins-reference:managed-end";
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

function canonicalConfigBlock() {
  const template = readFileSync(configTemplatePath, "utf8");
  const start = template.indexOf(configStart);
  const end = template.indexOf(configEnd, start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  return template.slice(start, end + configEnd.length);
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
  assert.equal(
    readFileSync(join(target, ".codex", "config.toml"), "utf8"),
    `${canonicalConfigBlock()}\n`,
  );
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
  const configDirectory = join(target, ".codex");
  mkdirSync(configDirectory);
  const configPrefix = 'approval_policy = "on-request"\n';
  const configSuffix = '\nsandbox_mode = "workspace-write"\n';
  writeFileSync(
    join(configDirectory, "config.toml"),
    `${configPrefix}${configStart}\nmodel = "old-model"\n${configEnd}${configSuffix}`,
  );

  const result = run("update", target);

  assert.equal(result.status, 0);
  assert.equal(result.stdout, "comins-reference: updated\n");
  assert.equal(result.stderr, "");
  assert.equal(
    readFileSync(agentsPath, "utf8"),
    `${prefix}${canonicalBlock()}${suffix}`,
  );
  assert.equal(
    readFileSync(join(configDirectory, "config.toml"), "utf8"),
    `${configPrefix}${canonicalConfigBlock()}${configSuffix}`,
  );
});

test("creates a missing managed project config during a marked update", () => {
  const target = createRepository();
  writeFileSync(join(target, "AGENTS.md"), `${canonicalBlock()}\n`);

  const result = run("update", target);

  assert.equal(result.status, 0);
  assert.equal(
    readFileSync(join(target, ".codex", "config.toml"), "utf8"),
    `${canonicalConfigBlock()}\n`,
  );
});

test("preflights an unmarked config before changing AGENTS.md", () => {
  const target = createRepository();
  const agentsPath = join(target, "AGENTS.md");
  const originalAgents = [
    "<!-- comins-reference:managed-start contract=v1.1 -->",
    "# Old shared guidance",
    "<!-- comins-reference:managed-end -->",
    "",
    "## Module Guidance",
    "",
    "- Preserve this module rule.",
    "",
  ].join("\n");
  writeFileSync(agentsPath, originalAgents);
  mkdirSync(join(target, ".codex"));
  const originalConfig = 'model = "repository-owned"\n';
  writeFileSync(join(target, ".codex", "config.toml"), originalConfig);

  const result = run("update", target);

  assert.equal(result.status, 1);
  assert.equal(result.stderr, "comins-reference: failed\n");
  assert.equal(readFileSync(agentsPath, "utf8"), originalAgents);
  assert.equal(readFileSync(join(target, ".codex", "config.toml"), "utf8"), originalConfig);
});

test("rejects AGENTS markers that are not standalone lines before changing config", () => {
  const target = createRepository();
  const agentsPath = join(target, "AGENTS.md");
  const originalAgents = [
    "prefix <!-- comins-reference:managed-start contract=v1.1 -->",
    "# Old shared guidance",
    "<!-- comins-reference:managed-end --> suffix",
    "",
  ].join("\n");
  writeFileSync(agentsPath, originalAgents);
  mkdirSync(join(target, ".codex"));
  const originalConfig = `${configStart}\nmodel = "old-model"\n${configEnd}\n`;
  writeFileSync(join(target, ".codex", "config.toml"), originalConfig);

  const result = run("update", target);

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "comins-reference: failed\n");
  assert.equal(readFileSync(agentsPath, "utf8"), originalAgents);
  assert.equal(readFileSync(join(target, ".codex", "config.toml"), "utf8"), originalConfig);
});

test("rejects config markers that are not standalone lines before changing AGENTS", () => {
  const target = createRepository();
  const agentsPath = join(target, "AGENTS.md");
  const originalAgents = [
    "<!-- comins-reference:managed-start contract=v1.1 -->",
    "# Old shared guidance",
    "<!-- comins-reference:managed-end -->",
    "",
  ].join("\n");
  writeFileSync(agentsPath, originalAgents);
  mkdirSync(join(target, ".codex"));
  const originalConfig = [
    configStart,
    'model = "old-model"',
    `prefix ${configEnd}`,
    "",
  ].join("\n");
  writeFileSync(join(target, ".codex", "config.toml"), originalConfig);

  const result = run("update", target);

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "comins-reference: failed\n");
  assert.equal(readFileSync(agentsPath, "utf8"), originalAgents);
  assert.equal(readFileSync(join(target, ".codex", "config.toml"), "utf8"), originalConfig);
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

test("does not create either managed surface when initialization preflight fails", () => {
  const target = createRepository();
  mkdirSync(join(target, ".codex"));
  writeFileSync(join(target, ".codex", "config.toml"), 'model = "existing"\n');

  const result = run("init", target);

  assert.equal(result.status, 1);
  assert.equal(existsSync(join(target, "AGENTS.md")), false);
  assert.equal(readFileSync(join(target, ".codex", "config.toml"), "utf8"), 'model = "existing"\n');
});

test("refuses a symlinked AGENTS.md without changing the external file or config", () => {
  const target = createRepository();
  const externalRoot = mkdtempSync(join(tmpdir(), "comins-reference-external-"));
  temporaryRoots.push(externalRoot);
  const externalAgents = join(externalRoot, "AGENTS.md");
  const originalAgents = [
    "<!-- comins-reference:managed-start contract=v1.1 -->",
    "# External sentinel",
    "<!-- comins-reference:managed-end -->",
    "",
  ].join("\n");
  writeFileSync(externalAgents, originalAgents);
  symlinkSync(externalAgents, join(target, "AGENTS.md"));
  mkdirSync(join(target, ".codex"));
  const originalConfig = `${configStart}\nmodel = "old-model"\n${configEnd}\n`;
  writeFileSync(join(target, ".codex", "config.toml"), originalConfig);

  const result = run("update", target);

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "comins-reference: failed\n");
  assert.equal(readFileSync(externalAgents, "utf8"), originalAgents);
  assert.equal(readFileSync(join(target, ".codex", "config.toml"), "utf8"), originalConfig);
});

test("refuses a symlinked config file without changing AGENTS or the external file", () => {
  const target = createRepository();
  const agentsPath = join(target, "AGENTS.md");
  const originalAgents = `${canonicalBlock()}\n`;
  writeFileSync(agentsPath, originalAgents);
  mkdirSync(join(target, ".codex"));
  const externalRoot = mkdtempSync(join(tmpdir(), "comins-reference-external-"));
  temporaryRoots.push(externalRoot);
  const externalConfig = join(externalRoot, "config.toml");
  const originalConfig = `${configStart}\nmodel = "old-model"\n${configEnd}\n`;
  writeFileSync(externalConfig, originalConfig);
  symlinkSync(externalConfig, join(target, ".codex", "config.toml"));

  const result = run("update", target);

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "comins-reference: failed\n");
  assert.equal(readFileSync(agentsPath, "utf8"), originalAgents);
  assert.equal(readFileSync(externalConfig, "utf8"), originalConfig);
});

test("refuses a symlinked .codex directory without changing external contents", () => {
  const target = createRepository();
  const agentsPath = join(target, "AGENTS.md");
  const originalAgents = `${canonicalBlock()}\n`;
  writeFileSync(agentsPath, originalAgents);
  const externalCodex = mkdtempSync(join(tmpdir(), "comins-reference-external-codex-"));
  temporaryRoots.push(externalCodex);
  const externalConfig = join(externalCodex, "config.toml");
  const originalConfig = `${configStart}\nmodel = "old-model"\n${configEnd}\n`;
  writeFileSync(externalConfig, originalConfig);
  symlinkSync(externalCodex, join(target, ".codex"));

  const result = run("update", target);

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "comins-reference: failed\n");
  assert.equal(readFileSync(agentsPath, "utf8"), originalAgents);
  assert.equal(readFileSync(externalConfig, "utf8"), originalConfig);
});
