import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function readPolicy(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function section(markdown, heading) {
  const start = markdown.indexOf(`${heading}\n`);
  if (start === -1) return "";
  const rest = markdown.slice(start);
  const nextHeading = rest.indexOf("\n## ", heading.length + 1);
  return (nextHeading === -1 ? rest : rest.slice(0, nextHeading)).trim();
}

function assertOrdered(content, terms) {
  let cursor = -1;
  for (const term of terms) {
    const next = content.indexOf(term);
    assert.ok(next > cursor, `${term} must appear after the prior stage`);
    cursor = next;
  }
}

const agents = readPolicy("AGENTS.md");
const contract = readPolicy("COMINS_CONTRACT.md");
const licensePolicy = readPolicy("OSS_LICENSE_POLICY.md");
const sensitiveData = readPolicy("SENSITIVE_DATA_STANDARD.md");
const checklist = readPolicy("MODULE_CHECKLIST.md");
const security = readPolicy("SECURITY.md");
const release = readPolicy("RELEASE_POLICY.md");
const moduleAgents = readPolicy("templates/module/AGENTS.template.md");
const governanceConfig = readPolicy(".codex/config.toml");
const moduleConfig = readPolicy("templates/module/.codex/config.toml");
const changelog = readPolicy("CHANGELOG.md");
const readme = readPolicy("README.md");

test("keeps one current Contract and managed module block", () => {
  const start = "<!-- comins-reference:managed-start contract=v1.7 -->";
  const end = "<!-- comins-reference:managed-end -->";

  assert.match(contract, /^# Comins Contract v1\.7$/m);
  assert.match(changelog, /^## v1\.7 - 2026-08-24$/m);
  assert.equal(moduleAgents.split(start).length - 1, 1);
  assert.equal(moduleAgents.split(end).length - 1, 1);
  assert.ok(moduleAgents.indexOf(start) < moduleAgents.indexOf(end));
  assert.ok(Buffer.byteLength(agents) <= 1_400);
  assert.ok(Buffer.byteLength(moduleAgents) <= 1_000);
  assert.ok(Buffer.byteLength(readme) <= 1_800);
  assert.ok(Buffer.byteLength(contract) <= 3_900);
  assert.match(moduleAgents, /https:\/\/github\.com\/kim1124\/comins-governance/);
});

test("keeps model settings in managed configuration instead of prose", () => {
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

test("keeps the management order and execution rules in the Contract only", () => {
  const contractOrder = section(contract, "## Required Management Order");

  assert.match(contractOrder, /resolve the target independent Git root/i);
  assertOrdered(contractOrder, [
    "**License compliance:**",
    "**Security:**",
    "**Comins common rules:**",
    "**Module rules:**",
    "**Change and verification:**",
    "**Git, pull request, and CI:**",
    "**Release, when applicable:**",
  ]);
  assert.match(contractOrder, /run\s+only the stages triggered by the requested change/i);
  assert.match(contractOrder, /does not trigger unrelated module/i);
  assert.match(contractOrder, /General-purpose skills and historical plans.+cannot add\s+stages/is);
  assert.match(contractOrder, /Use subagents only when the maintainer\s+requests delegation/i);
  assert.match(contractOrder, /never full conversation history/i);
  assert.match(contract, /broad gate.+only when\s+the selected route requires it/is);
  assert.match(contract, /retry does not\s+restart research, planning, review/i);
  assert.match(contract, /rerun only the failed or\s+affected job or test/i);
  assert.match(contract, /Correct deterministic policy, type, and unit-test failures/i);
  assert.match(contract, /preserve same-commit evidence/i);
  assert.match(contract, /`codex-<short-feature-name>`/);
  assert.match(contract, /append\s+`-2`, `-3`, and so on/i);
  assert.match(contract, /Existing and provider-managed branches are exempt/i);

  for (const wrapper of [agents, moduleAgents, readme]) {
    assert.doesNotMatch(wrapper, /`codex-<short-feature-name>`/);
    assert.doesNotMatch(wrapper, /same-commit evidence|retry does not restart/i);
    assert.doesNotMatch(wrapper, /Subagents? (?:are|require|only)/i);
    assert.doesNotMatch(wrapper, /General-purpose skills and historical plans/i);
  }

  assert.match(agents, /only common execution-policy source/i);
  assert.match(moduleAgents, /only\s+common-policy owner/i);
  assert.match(readme, /sole common execution-policy\s+source/i);
  assert.match(agents, /Do not run independent module product gates for a Governance-only change/i);
});

test("keeps the manager overview out of the active instruction surface", () => {
  assert.equal(existsSync(join(root, "DEV_GUIDE.md")), false);
  assert.doesNotMatch(readme, /DEV_GUIDE\.md/);
  assert.match(readme, /including the required management order/i);
  assert.doesNotMatch(readme, /^## Management Order$/m);
  assert.match(contract, /Governance\s+defines common requirements/i);
  assert.match(moduleAgents, /module owns their CI implementation/i);
});

test("limits routine license checks and scopes detailed evidence", () => {
  assert.ok(licensePolicy.split("\n").length <= 130);
  assert.match(licensePolicy, /part of Comins Contract v1\.7/i);
  assert.match(
    licensePolicy,
    /applies to a module after that\s+repository separately adopts the Contract revision/i,
  );
  assert.match(
    licensePolicy,
    /does not declare legal compliance or replace legal review/i,
  );

  const routine = section(licensePolicy, "## Routine Dependency Check");
  for (const identifier of [
    "MIT",
    "MIT-0",
    "ISC",
    "0BSD",
    "BSD-2-Clause",
    "BSD-3-Clause",
    "Apache-2.0",
  ]) {
    assert.match(routine, new RegExp(`\`${identifier}\``));
  }
  assert.match(routine, /package manager and standard\s+license tooling/i);
  assert.match(
    routine,
    /do\s+not require a separate upstream-source, hash, license-text, or notice record for\s+every transitive package/i,
  );

  const manual = section(licensePolicy, "## Manual Review Triggers");
  assert.match(manual, /missing, unknown, `NOASSERTION`, or `UNLICENSED`/i);
  assert.match(manual, /copyleft, source-available, proprietary/i);
  assert.match(manual, /copied, modified, generated, bundled, or distributed material/i);
  assert.match(manual, /Stop the affected pull request or release/i);

  const distributed = section(licensePolicy, "## Distributed And Copied Material");
  assert.match(distributed, /Use `THIRD_PARTY_NOTICES\.md` and `THIRD_PARTY_LICENSES\/` only when/i);
  assert.match(distributed, /Do not require published notices for ordinary non-distributed development tools/i);

  const implementation = section(licensePolicy, "## Module Implementation Boundary");
  assert.match(implementation, /Each module owns\s+the checker, command name, fixtures, CI integration/i);
  assert.match(implementation, /Fail closed only for an applicable/i);
  assert.match(implementation, /Do not expand a routine check into\s+unrelated source or artifact investigation/i);

  const releaseGate = section(licensePolicy, "## Release Gate");
  assert.match(releaseGate, /For an actual public package release/i);
  assert.match(releaseGate, /exact release artifact/i);
  assert.match(releaseGate, /emergency release does not bypass license review/i);

  assert.match(contract, /OSS_LICENSE_POLICY\.md/);
  assert.match(checklist, /license gate/i);
  assert.match(release, /license gate/i);
  assert.match(readme, /OSS_LICENSE_POLICY\.md/);
});

test("retains the canonical sensitive-data boundary without duplicating mechanics", () => {
  assert.ok(sensitiveData.split("\n").length <= 120);
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
    assert.match(sensitiveData, new RegExp(`^## ${heading}$`, "m"));
  }
  for (const term of [
    "personal email",
    "API keys",
    "Gitleaks",
    "npm pack",
    "redact",
    "fail closed",
  ]) {
    assert.match(sensitiveData, new RegExp(term, "i"));
  }
  assert.match(contract, /SENSITIVE_DATA_STANDARD\.md/);
  assert.doesNotMatch(moduleAgents, /npm pack|Gitleaks|package\.json#files/i);
});

test("requires a delivery-capable npm service identity at release boundaries", () => {
  const allowed = section(sensitiveData, "## Allowed");
  const publication = section(release, "## Publication Controls");
  const closure = section(release, "## Post-Publication Closure");
  const beforeRelease = section(checklist, "## Before First Public Release");
  const afterRelease = section(checklist, "## After Every Public Release");

  assert.match(allowed, /delivery-capable Comins service identity/i);
  assert.match(allowed, /permanent public npm metadata/i);
  assert.match(allowed, /GitHub noreply[^.\n]*Git commit/i);
  assert.match(allowed, /not[^.\n]*npm account[^.\n]*(?:verification|recovery)/i);

  assert.match(publication, /current npm maintainer identity/i);
  assert.match(publication, /immediately before[^.\n]*stage/i);
  assert.match(publication, /constant[^.\n]*value-free/i);
  assert.match(publication, /freeze[^.\n]*approval/i);

  assert.match(closure, /exact published version[^.\n]*maintainer/i);
  assert.match(closure, /publisher metadata/i);
  assert.match(beforeRelease, /delivery-capable[^.\n]*service identity/i);
  assert.match(afterRelease, /exact-version[^.\n]*identity/i);

  assert.match(contract, /^# Comins Contract v1\.7$/m);
  assert.doesNotMatch(moduleAgents, /COMINS_NPM_PUBLIC_(?:NAME|EMAIL)/);
});

test("conditions package and release gates on their actual lifecycle", () => {
  assert.match(
    contract,
    /Package and\s+release rules apply only when a package boundary and matching\s+workflow exist/i,
  );
  assert.match(
    release,
    /When a package boundary exists, the module owns its own version[^.\n]*npm publication/i,
  );
  assert.match(checklist, /Before First Public Release/);
  assert.match(release, /npm pack --json --ignore-scripts/);
  assert.match(release, /exactly one package artifact/i);
  assert.match(release, /Gitleaks/i);
  assert.match(release, /privacy-safe publisher metadata/i);
  assert.match(
    release,
    /Successful verification evidence may be reused only when the verified source tree/i,
  );
  assert.match(
    release,
    /A metadata-only change invalidates only the metadata and artifact evidence it can affect/i,
  );
  assert.match(
    release,
    /the module release workflow is the canonical owner of the exact artifact/i,
  );
  assert.match(release, /Do not create a separate local candidate artifact/i);
});

test("retains release closure and incident boundaries", () => {
  const states = section(release, "## Release States");
  const closure = section(release, "## Post-Publication Closure");

  for (const state of ["candidate", "staged", "published", "closed"]) {
    assert.match(states, new RegExp(`\\*\\*${state}:\\*\\*`, "i"));
  }
  assert.match(states, /Only closed is complete/i);
  for (const term of [
    "exact version",
    "dist-tag",
    "integrity",
    "provenance",
    "public consumer",
    "source merge",
    "residual risks",
  ]) {
    assert.match(closure, new RegExp(term, "i"));
  }

  assert.match(security, /credential\/PII incident/i);
  assert.match(security, /stop the affected release/i);
  assert.match(security, /rotate/i);
  assert.match(security, /without public disclosure/i);
});
