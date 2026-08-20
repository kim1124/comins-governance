import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const skillRoot = join(root, ".agents", "skills", "comins-request");
const skill = readFileSync(join(skillRoot, "SKILL.md"), "utf8");
const openaiYaml = readFileSync(join(skillRoot, "agents", "openai.yaml"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const changelog = readFileSync(join(root, "CHANGELOG.md"), "utf8");

test("defines the focused Comins request-template trigger", () => {
  assert.match(skill, /^name: comins-request$/m);
  assert.match(skill, /^description: Use when /m);
  assert.match(skill, /Comins maintainer/i);
  assert.match(skill, /request format|work request template|feature brief|maintenance brief/i);
  assert.doesNotMatch(skill, /TODO|TBD|FIXME/);
  assert.ok(skill.split(/\s+/).length < 220);
});

test("prints one concise copyable request contract without starting work", () => {
  for (const field of [
    "작업 유형:",
    "대상:",
    "목표:",
    "범위:",
    "완료 조건:",
    "권한:",
  ]) {
    assert.match(skill, new RegExp(field));
  }
  assert.match(skill, /exactly one fenced text block/i);
  assert.match(skill, /Do not inspect repositories/i);
  assert.match(skill, /Do not start the requested work/i);
  assert.match(skill, /Do not add introductory or closing\s+prose/i);
});

test("exposes concise user-facing metadata", () => {
  assert.match(openaiYaml, /display_name: "Comins Request"/);
  assert.match(openaiYaml, /short_description: "Create a structured Comins work request"/);
  assert.match(openaiYaml, /default_prompt: "Use \$comins-request /);
});

test("documents discovery and installation without changing the Contract", () => {
  assert.match(readme, /\.agents\/skills\/comins-request/);
  assert.match(readme, /\$comins-request/);
  assert.match(changelog, /comins-request/);
  assert.match(changelog, /Contract v1\.2 unchanged/i);
});
