import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const skillRoot = join(root, ".agents", "skills", "comins-reference");
const skill = readFileSync(join(skillRoot, "SKILL.md"), "utf8");
const openaiYaml = readFileSync(join(skillRoot, "agents", "openai.yaml"), "utf8");

test("defines the focused Comins guidance initialization and update triggers", () => {
  assert.match(skill, /^name: comins-reference$/m);
  assert.match(skill, /^description: Use when /m);
  assert.match(skill, /new independent Comins module/i);
  assert.match(skill, /shared governance guidance changes/i);
  assert.doesNotMatch(skill, /TODO|TBD|FIXME/);
  assert.ok(skill.split(/\s+/).length < 500);
});

test("routes initialization and marked updates through the deterministic helper", () => {
  assert.match(skill, /scripts\/sync-guidance\.mjs init --target/);
  assert.match(skill, /scripts\/sync-guidance\.mjs update --target/);
  assert.match(skill, /COMINS_CONTRACT\.md/);
  assert.match(skill, /CHANGELOG\.md/);
  assert.match(skill, /templates\/module\/AGENTS\.md/);
  assert.match(skill, /preserve[^\n]*module-specific guidance/i);
});

test("fails closed for legacy guidance and protects external operations", () => {
  assert.match(skill, /unmarked[^\n]*reviewed[^\n]*migration/i);
  assert.match(skill, /Do not[^\n]*push[^\n]*merge[^\n]*publish/i);
  assert.match(skill, /explicit maintainer request/i);
});

test("exposes the requested user-facing skill metadata", () => {
  assert.match(openaiYaml, /display_name: "Comins-reference"/);
  assert.match(openaiYaml, /short_description: "Create and refresh shared Comins guidance"/);
  assert.match(openaiYaml, /default_prompt: "Use \$comins-reference /);
});
