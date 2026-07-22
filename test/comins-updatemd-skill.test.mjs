import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const skillRoot = join(root, ".agents", "skills", "comins-updatemd");
const skill = readFileSync(join(skillRoot, "SKILL.md"), "utf8");
const openaiYaml = readFileSync(join(skillRoot, "agents", "openai.yaml"), "utf8");
const rubric = readFileSync(join(skillRoot, "references", "audit-rubric.md"), "utf8");
const matrix = readFileSync(join(skillRoot, "references", "eval-matrix.md"), "utf8");

test("defines the exact Comins guidance renewal trigger", () => {
  assert.match(skill, /^name: comins-updatemd$/m);
  assert.match(skill, /^description: Use when /m);
  assert.match(skill, /Codex model|official guidance|instruction latency|token/i);
  assert.doesNotMatch(skill, /TODO|TBD|FIXME|refresh-comins-guidance/);
  assert.ok(skill.split(/\s+/).length < 500);
});

test("audits effective guidance and keeps module adoption separate", () => {
  assert.match(skill, /inventory-instructions\.mjs/);
  assert.match(skill, /summarize-codex-telemetry\.mjs/);
  assert.match(skill, /global, project, path-local, and activated skill/i);
  assert.match(skill, /official OpenAI/i);
  assert.match(skill, /local-only audit/i);
  assert.match(skill, /\$comins-reference/);
  assert.match(skill, /do not modify independent modules/i);
  assert.match(skill, /external, destructive, costly, or scope-expanding/i);
});

test("routes detailed criteria to one-level references", () => {
  assert.match(skill, /references\/audit-rubric\.md/);
  assert.match(skill, /references\/eval-matrix\.md/);
  for (const term of ["direct context", "process chain", "blind pre-read", "verification leakage"]) {
    assert.match(rubric, new RegExp(term, "i"));
  }
  for (const term of ["with skill", "without skill", "wall time", "token", "success"]) {
    assert.match(matrix, new RegExp(term, "i"));
  }
});

test("exposes concise user-facing metadata", () => {
  assert.match(openaiYaml, /display_name: "Comins Update MD"/);
  assert.match(openaiYaml, /short_description: "Audit and renew Comins guidance safely"/);
  assert.match(openaiYaml, /default_prompt: "Use \$comins-updatemd /);
  assert.match(openaiYaml, /official sources only when freshness is requested/);
});
