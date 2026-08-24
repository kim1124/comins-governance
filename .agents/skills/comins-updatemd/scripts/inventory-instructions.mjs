#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync, realpathSync } from "node:fs";
import { dirname, resolve } from "node:path";

const FAILURE = "comins-updatemd inventory: failed\n";

function fail() {
  process.stderr.write(FAILURE);
  process.exitCode = 1;
}

function parseArguments(argv) {
  const repositories = [];
  const externalSkills = [];
  let json = false;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--json") {
      json = true;
      continue;
    }
    if (argument === "--repo") {
      const value = argv[index + 1];
      index += 1;
      const separator = value?.indexOf("=") ?? -1;
      if (separator < 1) throw new Error("invalid repository");
      const name = value.slice(0, separator);
      const path = value.slice(separator + 1);
      if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(name) || path.length === 0) {
        throw new Error("invalid repository");
      }
      repositories.push({ name, path });
      continue;
    }
    if (argument === "--external-skill") {
      const value = argv[index + 1];
      index += 1;
      const separator = value?.indexOf("=") ?? -1;
      if (separator < 1) throw new Error("invalid external skill");
      const name = value.slice(0, separator);
      const path = value.slice(separator + 1);
      if (!/^[a-zA-Z0-9][a-zA-Z0-9._:-]*$/.test(name) || path.length === 0) {
        throw new Error("invalid external skill");
      }
      externalSkills.push({ name, path });
      continue;
    }
    throw new Error("invalid argument");
  }

  if (repositories.length === 0) throw new Error("missing repository");
  if (new Set(repositories.map(({ name }) => name)).size !== repositories.length) {
    throw new Error("duplicate repository");
  }
  if (new Set(externalSkills.map(({ name }) => name)).size !== externalSkills.length) {
    throw new Error("duplicate external skill");
  }
  return { json, repositories, externalSkills };
}

function exactGitRoot(path) {
  const requested = realpathSync(resolve(path));
  const reported = execFileSync("git", ["-C", requested, "rev-parse", "--show-toplevel"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
  if (realpathSync(reported) !== requested) throw new Error("not an exact Git root");
  return requested;
}

function repositoryFiles(root) {
  return execFileSync(
    "git",
    ["-C", root, "ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
  )
    .split("\0")
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right, "en"));
}

function classify(path) {
  if (
    /(?:^|\/)AGENTS(?:\.override)?\.md$/.test(path) ||
    path === "CLAUDE.md" ||
    path === ".github/copilot-instructions.md"
  ) {
    return "automatic-guidance";
  }
  if (path === "COMINS_CONTRACT.md") return "common-policy";
  if (
    path === "OSS_LICENSE_POLICY.md" ||
    path === "SENSITIVE_DATA_STANDARD.md" ||
    path === "RELEASE_POLICY.md"
  ) {
    return "triggered-policy";
  }
  if (path === ".codex/config.toml") return "configuration";
  if (/^(?:\.agents|\.codex)\/skills\/[^/]+\/SKILL\.md$/.test(path)) return "skill";
  if (/^(?:reports\/|docs\/superpowers\/(?:plans|specs)\/)/.test(path)) return "historical";
  if (
    path === "README.md" ||
    path === "GUIDE.md" ||
    path === "SECURITY.md" ||
    path === "CONTRIBUTING.md" ||
    path === "MODULE_CHECKLIST.md" ||
    path === "templates/module/AGENTS.template.md" ||
    (/^docs\//.test(path) && path.endsWith(".md"))
  ) {
    return "conditional-reference";
  }
  return null;
}

const FINDING_RULES = [
  {
    type: "broad-pre-read",
    test: (line) =>
      /\b(?:read|inspect|review|open)\b.*\b(?:all|every)\b.*\b(?:docs?|documents?|AGENTS|files?)\b/i.test(
        line,
      ) ||
      /\bread\b.*(?:README|GUIDE).*\b(?:and|plus)\b.*(?:README|GUIDE|AGENTS)/i.test(line),
  },
  {
    type: "model-prose",
    test: (line) =>
      /\bgpt-\d/i.test(line) ||
      /\breasoning(?:[_ -]effort)?\b.*\b(?:low|medium|high|xhigh|max|ultra)\b/i.test(line),
  },
  {
    type: "mandatory-process-chain",
    test: (line) =>
      /(?:research|researching).*(?:design|spec).*(?:plan|planning).*(?:TDD|test[- ]first)/i.test(
        line,
      ) &&
      !/(?:are )?(?:selected|routed|chosen) by(?:\s|$)|not (?:one|a) mandatory|rather than/i.test(
        line,
      ),
  },
  {
    type: "broad-verification",
    test: (line) =>
      /\b(?:always|every|all)\b.*\b(?:verify:full|full (?:gate|suite|verification))\b/i.test(line),
  },
  {
    type: "broad-skill-trigger",
    test: (line) =>
      /\beven (?:a )?\d+% chance\b.*\bskill\b/i.test(line) ||
      /\buse\b.*\b(?:every|all|any)\b.*\b(?:task|conversation|project)\b/i.test(line),
  },
  {
    type: "unconditional-process-gate",
    test: (line) =>
      /\bapplies to (?:every|all) (?:project|task)\b.*\bregardless\b/i.test(line),
  },
  {
    type: "fresh-evidence-only",
    test: (line) =>
      /\b(?:have not|haven't)\b.*\brun\b.*\bin this (?:message|turn)\b.*\b(?:cannot|must not)\b.*\bclaim\b/i.test(
        line,
      ),
  },
];

function findingsForContents(path, contents) {
  const findings = [];
  const lines = contents.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    for (const rule of FINDING_RULES) {
      if (rule.test(lines[index])) {
        findings.push({ type: rule.type, path, line: index + 1 });
      }
    }
  }
  return findings;
}

function findingsFor(root, files) {
  const findings = [];
  for (const file of files) {
    if (
      ![
        "automatic-guidance",
        "common-policy",
        "triggered-policy",
        "skill",
        "conditional-reference",
      ].includes(file.kind)
    ) {
      continue;
    }
    const absolutePath = resolve(root, file.path);
    if (lstatSync(absolutePath).isSymbolicLink()) continue;
    const contents = readFileSync(absolutePath, "utf8");
    findings.push(...findingsForContents(file.path, contents));
  }
  return findings.sort(
    (left, right) =>
      left.path.localeCompare(right.path, "en") ||
      left.line - right.line ||
      left.type.localeCompare(right.type, "en"),
  );
}

function metricsFor(files) {
  const bytesByKind = {};
  for (const file of files) {
    bytesByKind[file.kind] = (bytesByKind[file.kind] ?? 0) + file.bytes;
  }

  const codexGuidance = new Map(
    files
      .filter(
        ({ path, kind }) =>
          kind === "automatic-guidance" && /(?:^|\/)AGENTS(?:\.override)?\.md$/.test(path),
      )
      .map((file) => [file.path, file]),
  );
  const guidanceAt = (directory) => {
    const prefix = directory === "." ? "" : `${directory}/`;
    return (
      codexGuidance.get(`${prefix}AGENTS.override.md`) ??
      codexGuidance.get(`${prefix}AGENTS.md`) ??
      null
    );
  };
  const rootGuidance = guidanceAt(".");
  let maxChainBytes = rootGuidance?.bytes ?? 0;

  for (const path of codexGuidance.keys()) {
    const directory = dirname(path);
    const segments = directory === "." ? [] : directory.split("/");
    let chainBytes = rootGuidance?.bytes ?? 0;
    for (let depth = 1; depth <= segments.length; depth += 1) {
      chainBytes += guidanceAt(segments.slice(0, depth).join("/"))?.bytes ?? 0;
    }
    maxChainBytes = Math.max(maxChainBytes, chainBytes);
  }

  return {
    classifiedFiles: files.length,
    bytesByKind,
    codexRootGuidanceBytes: rootGuidance?.bytes ?? 0,
    codexMaxDiscoveredChainBytes: maxChainBytes,
  };
}

function inspectRepository({ name, path }) {
  const root = exactGitRoot(path);
  const files = repositoryFiles(root)
    .filter((relativePath) => existsSync(resolve(root, relativePath)))
    .map((relativePath) => ({ path: relativePath, kind: classify(relativePath) }))
    .map((file) => {
      if (file.kind === null) return file;
      const absolutePath = resolve(root, file.path);
      const bytes = lstatSync(absolutePath).isSymbolicLink()
        ? 0
        : readFileSync(absolutePath).byteLength;
      return { ...file, bytes };
    })
    .filter(({ kind }) => kind !== null);
  return { name, files, metrics: metricsFor(files), findings: findingsFor(root, files) };
}

function inspectExternalSkill({ name, path }) {
  const absolutePath = realpathSync(resolve(path));
  if (!lstatSync(absolutePath).isFile()) throw new Error("external skill is not a file");
  const contents = readFileSync(absolutePath, "utf8");
  return {
    name,
    bytes: Buffer.byteLength(contents),
    findings: findingsForContents(name, contents),
  };
}

function humanOutput(repositories, activatedSkills) {
  const lines = [];
  const kinds = [
    "automatic-guidance",
    "common-policy",
    "triggered-policy",
    "configuration",
    "skill",
    "conditional-reference",
    "historical",
  ];
  for (const repository of repositories) {
    if (lines.length > 0) lines.push("");
    lines.push(`repository ${repository.name}`);
    for (const kind of kinds) {
      lines.push(`${kind}: ${repository.files.filter((file) => file.kind === kind).length}`);
      lines.push(`${kind}-bytes: ${repository.metrics.bytesByKind[kind] ?? 0}`);
    }
    lines.push(`codex-root-guidance-bytes: ${repository.metrics.codexRootGuidanceBytes}`);
    lines.push(
      `codex-max-discovered-chain-bytes: ${repository.metrics.codexMaxDiscoveredChainBytes}`,
    );
    lines.push(`findings: ${repository.findings.length}`);
    for (const finding of repository.findings) {
      lines.push(`${finding.type} ${finding.path}:${finding.line}`);
    }
  }
  if (lines.length > 0) lines.push("");
  lines.push(`activated-skills: ${activatedSkills.length}`);
  for (const skill of activatedSkills) {
    lines.push(`activated-skill ${skill.name}`);
    lines.push(`activated-skill-bytes: ${skill.bytes}`);
    lines.push(`activated-skill-findings: ${skill.findings.length}`);
    for (const finding of skill.findings) {
      lines.push(`${finding.type} ${finding.path}:${finding.line}`);
    }
  }
  return `${lines.join("\n")}\n`;
}

try {
  const options = parseArguments(process.argv.slice(2));
  const repositories = options.repositories.map(inspectRepository);
  const activatedSkills = options.externalSkills.map(inspectExternalSkill);
  if (options.json) {
    process.stdout.write(
      `${JSON.stringify({ version: 1, repositories, activatedSkills }, null, 2)}\n`,
    );
  } else {
    process.stdout.write(humanOutput(repositories, activatedSkills));
  }
} catch {
  fail();
}
