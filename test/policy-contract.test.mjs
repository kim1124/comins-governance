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

function assertOrdered(content, terms) {
  let cursor = -1;
  for (const term of terms) {
    const next = content.indexOf(term);
    assert.ok(next > cursor, `${term} must appear once after the prior stage`);
    assert.equal(content.indexOf(term, next + term.length), -1);
    cursor = next;
  }
}

const agents = readPolicy("AGENTS.md");
const contract = readPolicy("COMINS_CONTRACT.md");
const licensePolicy = readPolicy("OSS_LICENSE_POLICY.md");
const standard = readPolicy("SENSITIVE_DATA_STANDARD.md");
const checklist = readPolicy("MODULE_CHECKLIST.md");
const security = readPolicy("SECURITY.md");
const release = readPolicy("RELEASE_POLICY.md");
const moduleAgents = readPolicy("templates/module/AGENTS.template.md");
const governanceConfig = readPolicy(".codex/config.toml");
const moduleConfig = readPolicy("templates/module/.codex/config.toml");
const changelog = readPolicy("CHANGELOG.md");
const readme = readPolicy("README.md");
const devGuide = readPolicy("DEV_GUIDE.md");

test("documents the Comins reference skill under the current Contract version", () => {
  assert.match(readme, /\.agents\/skills\/comins-reference/);
  assert.match(readme, /\$comins-reference/);
  assert.match(changelog, /^## Unreleased$/m);
  assert.match(changelog, /comins-reference/);
  assert.match(contract, /^# Comins Contract v1\.3$/m);
});

test("delimits one canonical comins-reference managed block", () => {
  const start = "<!-- comins-reference:managed-start contract=v1.3 -->";
  const end = "<!-- comins-reference:managed-end -->";
  assert.equal(moduleAgents.split(start).length - 1, 1);
  assert.equal(moduleAgents.split(end).length - 1, 1);
  assert.ok(moduleAgents.indexOf(start) < moduleAgents.indexOf(end));
  assert.match(moduleAgents, /https:\/\/github\.com\/kim1124\/comins-governance/);
  assert.ok(moduleAgents.trim().split(/\s+/).length <= 360);
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
  assert.match(moduleAgents, /run the applicable broad gate once/i);
  assert.match(moduleAgents, /product, test-contract, or environment/i);
});

test("fixes one required Comins management order", () => {
  const contractScope = section(contract, "## Scope and Change Control");
  const requiredOrder = section(contract, "## Required Management Order");
  const managedRequiredOrder = section(moduleAgents, "## Required Order");
  assert.match(
    contractScope,
    /package and release units apply only when a package boundary exists/i,
  );
  assertOrdered(requiredOrder, [
    "independent Git root",
    "shared Contract",
    "sensitive-data and security",
    "open-source license",
    "module-owned",
    "smallest authorized",
    "focused, baseline",
    "Git hooks",
    "one exact artifact",
    "post-publication closure",
  ]);
  assert.match(requiredOrder, /not applicable only when/i);
  assert.match(requiredOrder, /stops progression/i);
  assertOrdered(managedRequiredOrder, [
    "repository/instructions",
    "Contract/scope/authority",
    "security",
    "licensing",
    "module rules",
    "implementation",
    "verification",
    "Git/PR",
    "exact-artifact release",
    "closure/reporting",
  ]);
  assert.match(managedRequiredOrder, /only untriggered gates N\/A/i);
  assert.match(managedRequiredOrder, /fail closed/i);
  assertOrdered(moduleAgents, [
    "## Scope",
    "## Work Routing",
    "## Required Order",
    "## Change Boundaries",
    "## Sensitive Data",
    "## Open Source Licensing",
    "## Verification",
    "## Reporting",
  ]);
});

test("conditions package and release rules on an existing package boundary", () => {
  assert.match(
    readme,
    /when a module has a package boundary[^.\n]*independent package and release unit/i,
  );
  assert.match(
    release,
    /when a package boundary exists[^.\n]*module owns its own version[^.\n]*npm publication/i,
  );

  const beforeCreation = section(checklist, "## Before Creation");
  const repositoryBaseline = section(checklist, "## Repository Baseline");
  assert.match(
    beforeCreation,
    /when a package boundary exists[^.\n]*public npm name[^.\n]*package manager/i,
  );
  assert.match(
    repositoryBaseline,
    /when a package boundary exists[^.\n]*package-manager lockfile/i,
  );
});

test("retains the concise sensitive-data policy under Contract v1.3", () => {
  assert.match(contract, /^# Comins Contract v1\.3$/m);
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

  assert.match(moduleAgents, /Contract v1\.3/);
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

test("adopts one fail-closed OSS license policy across review and release boundaries", () => {
  assert.ok(licensePolicy.split("\n").length <= 180);
  assert.match(
    licensePolicy,
    /applies to a module only after\s+that repository separately adopts Contract v1\.3/i,
  );
  assert.match(
    licensePolicy,
    /does not declare legal compliance or replace legal review/i,
  );
  for (const heading of [
    "Scope",
    "Use Surfaces",
    "Automatic Approval",
    "Manual Review And Approval",
    "Required Evidence",
    "Pull Request And CI Gates",
    "Release Gate",
    "Exceptions",
    "Legacy And Residual Risk",
    "References",
  ]) {
    assert.match(licensePolicy, new RegExp(`^## ${heading}$`, "m"));
  }

  const automatic = section(licensePolicy, "## Automatic Approval");
  const expectedAutomaticIdentifiers = [
    "MIT",
    "MIT-0",
    "ISC",
    "0BSD",
    "BSD-2-Clause",
    "BSD-3-Clause",
    "Apache-2.0",
  ];
  const automaticCodeSpans = [...automatic.matchAll(/`([^`\n]+)`/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(automaticCodeSpans, [
    ...expectedAutomaticIdentifiers,
    "OFL-1.1",
    "NOTICE",
  ]);
  assert.match(
    automatic,
    /No other identifier, expression, alias, license family, or version range\s+passes\s+automatically/i,
  );
  assert.match(
    automatic,
    /`OFL-1\.1` may pass automatically only for unmodified fonts[\s\S]*full license\s+text[\s\S]*reserved-font-name conditions are\s+recorded and preserved/i,
  );

  const manual = section(licensePolicy, "## Manual Review And Approval");
  assert.match(
    manual,
    /Fail closed and require a scoped maintainer approval/i,
  );
  assert.match(
    manual,
    /- missing license metadata, `NOASSERTION`, or `UNLICENSED`;/i,
  );
  assert.match(
    manual,
    /- custom terms, `LicenseRef`, or a license identified only by a file reference;/i,
  );
  assert.match(
    manual,
    /- a compound SPDX expression using `AND`, `OR`, or `WITH`;/i,
  );
  assert.match(
    manual,
    /- copyleft, weak-copyleft, source-available, or proprietary terms;/i,
  );
  assert.match(
    manual,
    /- noncommercial, no-derivatives, field-of-use, platform, redistribution,\s+commercial, or other use restrictions;/i,
  );
  assert.match(
    manual,
    /- a mismatch between metadata, upstream text, source, bundle contents, or use\s+surface;/i,
  );
  assert.match(
    manual,
    /- copied, modified, or generated material whose source, exact version or\s+revision, modification state, and obligations cannot be reproduced\./i,
  );
  assert.match(
    manual,
    /Approval must identify the component, exact version or revision, use surface,\s+applicable conditions, rationale, approved public handle or role, review date,/i,
  );
  assert.match(
    manual,
    /dependency, version, source, modification, or distribution change that\s+invalidates the approval/i,
  );
  assert.match(
    manual,
    /Until that record exists, pull requests and releases\s+remain blocked/i,
  );

  const evidence = section(licensePolicy, "## Required Evidence");
  assert.match(evidence, /THIRD_PARTY_NOTICES\.md/);
  assert.match(evidence, /THIRD_PARTY_LICENSES\//);
  assert.match(evidence, /component name and exact version or revision/i);
  assert.match(evidence, /use surface and whether it is distributed/i);
  assert.match(
    evidence,
    /SPDX expression or the exact manual-review classification/i,
  );
  assert.match(evidence, /canonical source/i);
  assert.match(evidence, /whether Comins copied or modified/i);
  assert.match(
    evidence,
    /required copyright, attribution, license-text, `NOTICE`, source-marking, or\s+redistribution actions/i,
  );
  assert.match(evidence, /reference to any scoped approval/i);
  assert.match(
    evidence,
    /Include\s+those files and any required upstream `NOTICE` in the exact package artifact/i,
  );

  const pullRequestGate = section(licensePolicy, "## Pull Request And CI Gates");
  assert.match(
    pullRequestGate,
    /dependency, lockfile, peer range,\s+bundle boundary, copied or generated code, asset, notice, license text, or\s+package file list changes/i,
  );
  assert.match(pullRequestGate, /deterministic `check:licenses`\s+command/i);
  assert.match(
    pullRequestGate,
    /repository without a package boundary applies this policy to tracked\s+material but does not invent npm commands or artifact gates/i,
  );
  assert.match(
    pullRequestGate,
    /Fail closed when the gate, metadata, source, notice, required text, or scoped\s+approval is missing or cannot be verified/i,
  );
  assert.match(
    pullRequestGate,
    /must not print upstream personal contacts or unnecessary license bodies/i,
  );

  const releaseGate = section(licensePolicy, "## Release Gate");
  assert.match(
    releaseGate,
    /one exact artifact used for consumer testing/i,
  );
  assert.match(
    releaseGate,
    /artifact contains the Comins `LICENSE`,\s+`THIRD_PARTY_NOTICES\.md` when applicable, every required file under\s+`THIRD_PARTY_LICENSES\/`, and no unrecorded bundled or copied third-party\s+material/i,
  );
  assert.match(
    releaseGate,
    /Fail closed if the license gate is unavailable, the artifact differs from the\s+reviewed artifact, or any required evidence or approval is incomplete/i,
  );
  assert.match(releaseGate, /emergency release does not bypass this gate/i);

  const exceptions = section(licensePolicy, "## Exceptions");
  assert.match(
    exceptions,
    /only for one component, exact version or revision, use\s+surface, and recorded set of conditions/i,
  );
  assert.match(
    exceptions,
    /Do not use repository-wide\s+suppressions, broad license-family allowlists, version ranges, inline bypasses,\s+or undocumented verbal approval/i,
  );
  assert.match(
    exceptions,
    /Re-review an exception when its invalidation\s+condition occurs/i,
  );

  const residualRisk = section(licensePolicy, "## Legacy And Residual Risk");
  assert.match(
    residualRisk,
    /Audit already-published versions separately from the current-change gate/i,
  );
  assert.match(
    residualRisk,
    /does not alter\s+legacy registry artifacts/i,
  );
  assert.match(
    residualRisk,
    /cannot prove license ownership, upstream\s+authenticity, or a court's interpretation of the terms/i,
  );

  const moduleLicensing = section(moduleAgents, "## Open Source Licensing");
  assert.match(moduleLicensing, /Contract v1\.3/);
  assert.match(moduleLicensing, /OSS_LICENSE_POLICY\.md/);
  assert.match(moduleLicensing, /fail closed/i);
  assert.match(contract, /OSS_LICENSE_POLICY\.md/);
  assert.match(checklist, /license gate/i);
  assert.match(release, /license gate/i);
  assert.match(readme, /OSS_LICENSE_POLICY\.md/);
  assert.match(devGuide, /OSS_LICENSE_POLICY\.md/);
  assert.match(
    devGuide,
    /세 모듈이 v1\.2 관리 블록을\s+유지하며 별도 채택을 기다린다/i,
  );
  assert.match(
    devGuide,
      /Contract v1\.3을 별도 채택한 뒤\s+package 경계가 없는 저장소는\s+tracked material에 정책을 적용/i,
  );
  assert.doesNotMatch(
    devGuide,
    /package 경계가 없는 Sortable은\s+tracked material에 정책을 적용/i,
  );
  assert.match(
    changelog,
    /current modules remain on the v1\.2 managed guidance until separate v1\.3 adoption/i,
  );
});

test("keeps the administrator guide linked to the management visualization", () => {
  const imagePath = join(root, "docs/assets/comins-brand-management-overview.png");
  assert.match(
    devGuide,
    /!\[Comins 공통 브랜드 관리 체계\]\(docs\/assets\/comins-brand-management-overview\.png\)/,
  );
  assert.equal(existsSync(imagePath), true);

  const image = readFileSync(imagePath);
  assert.equal(image.subarray(1, 4).toString("ascii"), "PNG");
  assert.equal(image.readUInt32BE(16), 1672);
  assert.equal(image.readUInt32BE(20), 941);
});

test("enumerates allowed public, synthetic, and required legal values", () => {
  const allowed = section(standard, "## Allowed");
  const exceptions = section(standard, "## Exceptions");
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
  for (const surface of [
    allowed,
    contractSensitiveData,
    moduleSensitiveData,
    licensePolicy,
  ]) {
    assert.match(
      surface,
      /canonical-source third-party (?:legal|copyright, attribution, license, and `NOTICE`) text only when legally required/i,
    );
    assert.match(surface, /personal contact details/i);
  }
  assert.match(
    exceptions,
    /may not exempt a prohibited private value beyond the required legal-text boundary/i,
  );
  assert.match(exceptions, /may not[^.\n]*bypass a required gate/i);
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

  assert.match(changelog, /^## v1\.3 /m);
  assert.match(changelog, /fail-closed/i);
  assert.match(changelog, /separate reviewed module adoption/i);
});

test("requires post-publication release closure evidence", () => {
  const states = section(release, "## Release States");
  const closure = section(release, "## Post-Publication Closure");
  const afterRelease = section(checklist, "## After Every Public Release");
  const moduleReporting = section(moduleAgents, "## Reporting");

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
    "local",
    "remote",
    "residual risks",
  ]) {
    assert.match(closure, new RegExp(term, "i"));
  }
  assert.match(closure, /published[^.\n]*not closed/i);
  assert.match(closure, /append/i);
  assert.match(closure, /branches and worktrees/i);
  assert.match(closure, /separate maintainer approval/i);

  assert.match(afterRelease, /exact version/i);
  assert.match(afterRelease, /dist-tag/i);
  assert.match(afterRelease, /public consumer/i);
  assert.match(afterRelease, /reconcile/i);

  assert.match(moduleReporting, /post-publication closure/i);
  assert.match(moduleReporting, /branches(?: and |\/)worktrees/i);
  assert.match(moduleReporting, /For a public release only/i);
  assert.match(changelog, /post-publication closure/i);
  assert.match(contract, /^# Comins Contract v1\.3$/m);
});
