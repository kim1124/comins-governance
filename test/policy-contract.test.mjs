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
const moduleAgents = readPolicy("templates/module/AGENTS.md");
const changelog = readPolicy("CHANGELOG.md");

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
  assert.match(beforeRelease, /extract/i);
  assert.match(beforeRelease, /Gitleaks/i);
});

test("keeps release, incident, and adoption policy aligned", () => {
  assert.match(release, /package\.json#files/);
  assert.match(release, /npm pack --json --ignore-scripts/);
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
