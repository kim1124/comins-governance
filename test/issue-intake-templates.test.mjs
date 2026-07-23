import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const templateRoot = join(root, "templates", "module", ".github");

function read(relativePath) {
  return readFileSync(join(templateRoot, relativePath), "utf8");
}

function fieldIds(yaml) {
  return [...yaml.matchAll(/^\s+id: ([a-z][a-z0-9-]*)$/gm)].map((match) => match[1]);
}

const bug = read("ISSUE_TEMPLATE/01-bug-report.yml");
const feature = read("ISSUE_TEMPLATE/02-feature-request.yml");
const chooser = read("ISSUE_TEMPLATE/config.yml");
const prompt = read("codex/issue-analysis.prompt.md");
const schemaText = read("codex/issue-analysis.schema.json");
const schema = JSON.parse(schemaText);
const workflow = read("workflows/codex-issue-analysis.yml");

function assertStrictObject(objectSchema) {
  if (objectSchema.type === "object") {
    assert.equal(objectSchema.additionalProperties, false);
    assert.deepEqual(
      [...objectSchema.required].sort(),
      Object.keys(objectSchema.properties).sort(),
    );
    for (const property of Object.values(objectSchema.properties)) {
      assertStrictObject(property);
    }
  }
}

test("keeps public issue intake concise and separate from the maintainer request brief", () => {
  assert.deepEqual(fieldIds(bug), [
    "behavior",
    "reproduction",
    "environment",
    "additional",
    "confirmations",
  ]);
  assert.deepEqual(fieldIds(feature), [
    "problem",
    "outcome",
    "alternatives",
    "additional",
    "confirmations",
  ]);
  assert.ok(bug.split("\n").length <= 75);
  assert.ok(feature.split("\n").length <= 70);
  assert.doesNotMatch(`${bug}\n${feature}`, /label: (작업 유형|대상|범위|완료 조건|권한)$/m);
  assert.doesNotMatch(`${bug}\n${feature}`, /연락처|이메일 주소/);
});

test("requires observable facts while keeping supporting material optional", () => {
  for (const label of ["현상과 기대 결과", "재현 방법", "사용 환경"]) {
    assert.match(bug, new RegExp(`label: ${label}`));
  }
  for (const label of ["해결하려는 문제와 사용 사례", "기대하는 결과"]) {
    assert.match(feature, new RegExp(`label: ${label}`));
  }
  assert.match(bug, /id: additional[\s\S]*?required: false/);
  assert.match(feature, /id: alternatives[\s\S]*?required: false/);
  assert.match(feature, /id: additional[\s\S]*?required: false/);
  assert.match(`${bug}\n${feature}`, /보안 취약점/);
  assert.match(`${bug}\n${feature}`, /개인정보, 자격 증명과 토큰을 제거했습니다/);
  assert.equal(chooser, "blank_issues_enabled: false\n");
});

test("defines a strict read-only Codex analysis contract", () => {
  assert.match(prompt, /untrusted user report/i);
  assert.match(prompt, /Do not implement changes/i);
  assert.match(prompt, /leave work authority and release decisions to the maintainer/i);
  assertStrictObject(schema);
  assert.deepEqual(schema.properties.classification.enum, [
    "bug",
    "performance",
    "feature",
    "documentation",
    "question",
    "security",
    "unknown",
  ]);
  assert.deepEqual(schema.properties.readiness.enum, [
    "needs-information",
    "maintainer-review",
    "implementation-ready",
    "security-routing",
  ]);
  assert.ok(schema.required.includes("recommendedSolution"));
  assert.ok(schema.required.includes("validationStrategy"));
  assert.ok(schema.required.includes("questions"));
});

test("gates issue analysis and posts only a structured read-only result", () => {
  assert.match(workflow, /types: \[opened, edited, reopened, labeled\]/);
  assert.match(workflow, /OWNER.*MEMBER.*COLLABORATOR/);
  assert.match(workflow, /github\.event\.label\.name == 'codex:analyze'/);
  assert.match(workflow, /gsub\("<!\-\-\.\*\?\-\->"; ""; "s"\)/);
  assert.match(workflow, /\.\[0:20000\]/);
  assert.match(
    workflow,
    /uses: openai\/codex-action@52fe01ec70a42f454c9d2ebd47598f9fd6893d56 # v1/,
  );
  assert.match(workflow, /permission-profile: ':read-only'/);
  assert.match(workflow, /safety-strategy: drop-sudo/);
  assert.match(workflow, /output-schema-file: \.github\/codex\/issue-analysis\.schema\.json/);
  assert.match(workflow, /openai-api-key: \$\{\{ secrets\.OPENAI_API_KEY \}\}/);
  assert.match(
    workflow,
    /uses: actions\/github-script@f28e40c7f34bde8b3046d885e986cb6290c5673b # v7/,
  );
  assert.match(workflow, /issues: write/);
  assert.doesNotMatch(workflow, /pull-requests: write/);
  assert.match(workflow, /escapeHtml/);
  const scriptBlock = workflow.match(/          script: \|\n([\s\S]+)$/);
  assert.ok(scriptBlock);
  const script = scriptBlock[1]
    .split("\n")
    .map((line) => line.replace(/^ {12}/, ""))
    .join("\n");
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  assert.doesNotThrow(() => new AsyncFunction("github", "context", script));
});
