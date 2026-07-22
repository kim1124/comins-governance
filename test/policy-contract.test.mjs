import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function readPolicy(relativePath) {
  const path = join(root, relativePath);
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

function section(markdown, heading) {
  const start = markdown.indexOf(`${heading}\n`);
  if (start === -1) return "";
  const rest = markdown.slice(start);
  const nextHeading = rest.indexOf("\n## ", heading.length + 1);
  return (nextHeading === -1 ? rest : rest.slice(0, nextHeading)).trim();
}

const agents = readPolicy("AGENTS.md");
const contract = readPolicy("COMINS_CONTRACT.md");
const standard = readPolicy("SENSITIVE_DATA_STANDARD.md");
const checklist = readPolicy("MODULE_CHECKLIST.md");
const security = readPolicy("SECURITY.md");
const release = readPolicy("RELEASE_POLICY.md");
const moduleAgents = readPolicy("templates/module/AGENTS.template.md");
const governanceConfig = readPolicy(".codex/config.toml");
const moduleConfig = readPolicy("templates/module/.codex/config.toml");
const changelog = readPolicy("CHANGELOG.md");
const readme = readPolicy("README.md");

test("documents the Comins reference skill without changing the Contract version", () => {
  assert.match(readme, /\.agents\/skills\/comins-reference/);
  assert.match(readme, /\$comins-reference/);
  assert.match(changelog, /^## Unreleased$/m);
  assert.match(changelog, /comins-reference/);
  assert.match(contract, /^# Comins Contract v1\.2$/m);
});

test("delimits one canonical comins-reference managed block", () => {
  const start = "<!-- comins-reference:managed-start contract=v1.2 -->";
  const end = "<!-- comins-reference:managed-end -->";
  assert.equal(moduleAgents.split(start).length - 1, 1);
  assert.equal(moduleAgents.split(end).length - 1, 1);
  assert.ok(moduleAgents.indexOf(start) < moduleAgents.indexOf(end));
});

test("keeps model policy in the exact managed project configuration", () => {
  const expected = [
    "# comins-reference:managed-start",
    'model = "gpt-5.6-sol"',
    'model_reasoning_effort = "xhigh"',
    'plan_mode_reasoning_effort = "xhigh"',
    "# comins-reference:managed-end",
    "",
  ].join("\n");

  assert.equal(governanceConfig, expected);
  assert.equal(moduleConfig, expected);
  assert.doesNotMatch(agents, /gpt-5\.6|`xhigh`|`max`|`ultra`|Plan mode/i);
  assert.doesNotMatch(moduleAgents, /gpt-5\.6|`xhigh`|`max`|`ultra`|Plan mode/i);
});

test("routes development work by change risk instead of one mandatory chain", () => {
  for (const term of [
    "Inspection or research",
    "Documentation, guidance, or configuration",
    "Clear local behavior",
    "Complex or high-risk",
    "Security, release, external, or destructive",
  ]) {
    assert.match(moduleAgents, new RegExp(term, "i"));
  }
  assert.match(moduleAgents, /regression test first when it materially improves confidence/i);
  assert.match(moduleAgents, /run the unchanged broad gate only once/i);
});

test("adopts the concise Contract v1.2 sensitive-data policy", () => {
  assert.match(contract, /^# Comins Contract v1\.2$/m);
  assert.ok(standard.split("\n").length <= 120);
  for (const term of ["personal email", "API key", "Gitleaks", "npm pack", "redact", "fail closed"]) {
    assert.match(standard, new RegExp(term, "i"));
  }

  for (const heading of [
    "Scope",
    "Prohibited",
    "Allowed",
    "Required Gates",
    "Safe Output",
    "Exceptions",
    "Incident Response",
    "Residual Risks",
  ]) {
    assert.match(standard, new RegExp(`^## ${heading}$`, "m"));
  }

  assert.match(moduleAgents, /Contract v1\.2/);
  assert.match(moduleAgents, /Never track personal names, personal email addresses/);
  assert.equal(section(agents, "## Sensitive Data"), section(moduleAgents, "## Sensitive Data"));
  assert.ok(section(moduleAgents, "## Sensitive Data").split("\n").length <= 15);
  assert.doesNotMatch(`${contract}\n${standard}`, /security-audit|Git object parser|tar header parser/i);
  assert.equal(existsSync(join(root, "package.json")), false);
});

test("requires the package artifact gate only after a package boundary exists", () => {
  const sensitiveData = section(moduleAgents, "## Sensitive Data");
  assert.match(sensitiveData, /when a package boundary exists/i);
  assert.match(sensitiveData, /exact package-artifact gate/i);
});

test("enumerates the only allowed public and synthetic values", () => {
  const allowed = section(standard, "## Allowed");
  const contractSensitiveData = section(contract, "## Sensitive Data");
  const moduleSensitiveData = section(moduleAgents, "## Sensitive Data");
  const allowedTerms = [
    "public handle",
    "GitHub noreply identity",
    "service identity",
    "explicit placeholder",
    "repository-relative path",
  ];

  for (const term of allowedTerms) {
    const pattern = new RegExp(term, "i");
    assert.match(allowed, pattern);
    assert.match(contractSensitiveData, pattern);
    assert.match(moduleSensitiveData, pattern);
  }
  assert.match(allowed, /synthetic detector fixture values only at test runtime/i);
});

test("forbids unsafe suppression, output, parsers, and history baselines", () => {
  const prohibited = section(standard, "## Prohibited");
  const safeOutput = section(standard, "## Safe Output");
  const residualRisks = section(standard, "## Residual Risks");

  assert.match(prohibited, /Do not use `.gitleaksignore` or inline `gitleaks:allow` suppressions/i);
  assert.match(
    prohibited,
    /Do not implement[^.\n]*Git objects[^.\n]*revisions[^.\n]*annotated tags[^.\n]*tar[^.\n]*PAX[^.\n]*checksums[^.\n]*provider tokens[^.\n]*binary formats/i,
  );
  assert.match(safeOutput, /Capture and discard Gitleaks stdout and stderr/i);
  assert.match(safeOutput, /constant, value-free failure message/i);
  assert.match(safeOutput, /without author, email, match, fingerprint, or sensitive path values/i);
  assert.match(residualRisks, /does not add an enforcement-history baseline/i);
});

test("requires sensitive-data gates at module lifecycle boundaries", () => {
  const beforeCommit = section(checklist, "## Before First Commit");
  const beforePr = section(checklist, "## Before First Pull Request");
  const beforeRelease = section(checklist, "## Before First Public Release");

  assert.match(beforeCommit, /local hook/i);
  assert.match(beforeCommit, /Gitleaks/i);
  assert.match(beforePr, /required security CI/i);
  assert.match(beforePr, /Gitleaks/i);
  assert.match(beforeRelease, /exactly one/i);
  assert.match(beforeRelease, /npm pack --json --ignore-scripts/);
  assert.match(
    beforeRelease,
    /Compare the package file list returned by `npm pack --json --ignore-scripts` with the `package\.json#files` allow-list/i,
  );
  assert.match(beforeRelease, /extract/i);
  assert.match(beforeRelease, /Gitleaks/i);
});

test("keeps release, incident, and adoption policy aligned", () => {
  assert.match(release, /package\.json#files/);
  assert.match(release, /npm pack --json --ignore-scripts/);
  assert.match(
    release,
    /Compare the package file list returned by `npm pack --json --ignore-scripts` with the `package\.json#files` allow-list/i,
  );
  assert.match(release, /exactly one/i);
  assert.match(release, /extract/i);
  assert.match(release, /Gitleaks/i);
  assert.match(release, /privacy-safe publisher metadata/i);

  assert.match(security, /credential\/PII incident/i);
  assert.match(security, /stop the affected release/i);
  assert.match(security, /rotate/i);
  assert.match(security, /without public disclosure/i);

  assert.match(changelog, /^## v1\.2 /m);
  assert.match(changelog, /separate reviewed module adoption/i);
});
