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
  const start = "<!-- comins-reference:managed-start contract=v1.5 -->";
  const end = "<!-- comins-reference:managed-end -->";

  assert.match(contract, /^# Comins Contract v1\.5$/m);
  assert.match(changelog, /^## v1\.5 - 2026-08-06$/m);
  assert.equal(moduleAgents.split(start).length - 1, 1);
  assert.equal(moduleAgents.split(end).length - 1, 1);
  assert.ok(moduleAgents.indexOf(start) < moduleAgents.indexOf(end));
  assert.ok(moduleAgents.trim().split(/\s+/).length <= 260);
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

test("defines the lean management order consistently", () => {
  const contractOrder = section(contract, "## Required Management Order");
  const moduleOrder = section(moduleAgents, "## Required Order");
  const moduleRouting = section(moduleAgents, "## Work Routing");
  const readmeOrder = section(readme, "## Management Order");

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
  assertOrdered(moduleOrder, [
    "license compliance",
    "security and sensitive data",
    "Comins common rules",
    "module rules",
    "smallest change and affected checks",
    "Git, pull request, and CI",
    "release checks only when publishing",
  ]);
  assertOrdered(readmeOrder, [
    "Check license compliance.",
    "Check security vulnerabilities and sensitive data.",
    "Check Comins common scope, authority, and approval rules.",
    "Apply the target module's own rules and commands.",
    "Make the smallest change and run affected checks only.",
    "Confirm Git, pull-request, and CI requirements.",
    "Run release checks only for an actual publication.",
  ]);
  assert.match(contractOrder, /Only a triggered stage requires execution/i);
  assert.match(contractOrder, /must not expand the task into\s+unrelated module/i);
  assert.match(contractOrder, /General-purpose skills and historical plans do not reclassify work/i);
  assert.match(contractOrder, /Subagents are opt-in/i);
  assert.match(contractOrder, /Never pass full conversation history/i);
  assert.match(contractOrder, /Use one final review and one required broad gate/i);
  assert.match(contractOrder, /reuse valid evidence/i);
  assert.match(moduleRouting, /must not expand the selected route/i);
  assert.match(moduleRouting, /Subagents require explicit maintainer delegation/i);
  assert.match(moduleRouting, /one final review and one required broad gate/i);
  assert.match(contractOrder, /`codex-<short-feature-name>`/);
  assert.match(contractOrder, /append `-2`, `-3`,\s+and so on/i);
  assert.match(contractOrder, /Existing and provider-managed branches are exempt/i);
  assert.match(moduleAgents, /`codex-<short-feature-name>`/);
  assert.match(agents, /`codex-<short-feature-name>`/);
  assert.match(
    moduleRouting,
    /General-purpose skills and historical plans must not expand the selected route/i,
  );
  assert.match(agents, /Do not run independent module product gates for a Governance-only change/i);
});

test("keeps the manager overview out of the active instruction surface", () => {
  assert.equal(existsSync(join(root, "DEV_GUIDE.md")), false);
  assert.doesNotMatch(readme, /DEV_GUIDE\.md/);
  assert.match(readme, /Governance defines the order and common blocking conditions/i);
  assert.match(readme, /affected module\s+defines and runs the actual checker/i);
  assert.match(contract, /Governance defines common requirements/i);
  assert.match(moduleAgents, /module owns its checker commands and CI implementation/i);
});

test("limits routine license checks and scopes detailed evidence", () => {
  assert.ok(licensePolicy.split("\n").length <= 130);
  assert.match(licensePolicy, /part of Comins Contract v1\.5/i);
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
  assert.match(moduleAgents, /SENSITIVE_DATA_STANDARD\.md/);
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

  assert.match(contract, /^# Comins Contract v1\.5$/m);
  assert.doesNotMatch(moduleAgents, /COMINS_NPM_PUBLIC_(?:NAME|EMAIL)/);
});

test("conditions package and release gates on their actual lifecycle", () => {
  assert.match(
    contract,
    /Package and\s+release rules apply only when a package boundary and matching workflow exist/i,
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
