import { execFileSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const FAILURE = "comins-reference: failed\n";
const AGENTS_START_PATTERN = /<!-- comins-reference:managed-start contract=v[^\s]+ -->/g;
const AGENTS_END_PATTERN = /<!-- comins-reference:managed-end -->/g;
const CONFIG_START_PATTERN = /# comins-reference:managed-start/g;
const CONFIG_END_PATTERN = /# comins-reference:managed-end/g;

function repositoryRoot(target) {
  const resolvedTarget = realpathSync(target);
  const root = execFileSync(
    "git",
    ["-C", resolvedTarget, "rev-parse", "--show-toplevel"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  ).trim();
  if (realpathSync(root) !== resolvedTarget) throw new Error("target is not root");
  return resolvedTarget;
}

function governanceRoot() {
  const scriptPath = realpathSync(fileURLToPath(import.meta.url));
  const root = resolve(dirname(scriptPath), "../../../..");
  if (!existsSync(join(root, "COMINS_CONTRACT.md"))) {
    throw new Error("governance source missing");
  }
  return root;
}

function isStandaloneLine(content, index, length) {
  const beginsLine = index === 0 || content[index - 1] === "\n";
  const after = index + length;
  const endsLine = after === content.length
    || content[after] === "\n"
    || (content[after] === "\r" && content[after + 1] === "\n");
  return beginsLine && endsLine;
}

function managedBlock(content, startPattern, endPattern) {
  const starts = [...content.matchAll(startPattern)];
  const ends = [...content.matchAll(endPattern)];
  const markerTokens = [...content.matchAll(/comins-reference:managed-(?:start|end)/g)];
  if (starts.length !== 1 || ends.length !== 1 || markerTokens.length !== 2) {
    throw new Error("managed markers invalid");
  }
  const start = starts[0].index;
  const endStart = ends[0].index;
  if (
    start === undefined
    || endStart === undefined
    || start >= endStart
    || !isStandaloneLine(content, start, starts[0][0].length)
    || !isStandaloneLine(content, endStart, ends[0][0].length)
  ) {
    throw new Error("managed markers invalid");
  }
  const end = endStart + ends[0][0].length;
  return {
    end,
    start,
    value: content.slice(start, end),
  };
}

function replaceManaged(content, canonical, startPattern, endPattern) {
  const managed = managedBlock(content, startPattern, endPattern);
  return `${content.slice(0, managed.start)}${canonical}${content.slice(managed.end)}`;
}

function assertNotSymlink(path) {
  let metadata;
  try {
    metadata = lstatSync(path);
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }
  if (metadata.isSymbolicLink()) throw new Error("managed target is a symlink");
}

function preflightTargetPaths(agentsPath, configPath) {
  assertNotSymlink(agentsPath);
  assertNotSymlink(dirname(configPath));
  assertNotSymlink(configPath);
}

function parseArguments(args) {
  if (args.length !== 3 || args[1] !== "--target") {
    throw new Error("invalid arguments");
  }
  if (args[0] !== "init" && args[0] !== "update") {
    throw new Error("invalid operation");
  }
  return { operation: args[0], target: args[2] };
}

function applyWrites(writes) {
  const applied = [];
  try {
    for (const write of writes) {
      mkdirSync(dirname(write.path), { recursive: true });
      writeFileSync(write.path, write.content, {
        encoding: "utf8",
        flag: write.original === null ? "wx" : "w",
      });
      applied.push(write);
    }
  } catch (error) {
    for (const write of applied.reverse()) {
      if (write.original === null) rmSync(write.path, { force: true });
      else writeFileSync(write.path, write.original, "utf8");
    }
    throw error;
  }
}

try {
  const { operation, target } = parseArguments(process.argv.slice(2));
  const targetRoot = repositoryRoot(target);
  const sourceRoot = governanceRoot();
  const agentsTemplate = readFileSync(
    join(sourceRoot, "templates", "module", "AGENTS.template.md"),
    "utf8",
  );
  const configTemplate = readFileSync(
    join(sourceRoot, "templates", "module", ".codex", "config.toml"),
    "utf8",
  );
  const canonicalAgents = managedBlock(
    agentsTemplate,
    AGENTS_START_PATTERN,
    AGENTS_END_PATTERN,
  ).value;
  const canonicalConfig = managedBlock(
    configTemplate,
    CONFIG_START_PATTERN,
    CONFIG_END_PATTERN,
  ).value;
  const agentsPath = join(targetRoot, "AGENTS.md");
  const configPath = join(targetRoot, ".codex", "config.toml");
  preflightTargetPaths(agentsPath, configPath);
  const agentsOriginal = existsSync(agentsPath) ? readFileSync(agentsPath, "utf8") : null;
  const configOriginal = existsSync(configPath) ? readFileSync(configPath, "utf8") : null;

  let agentsContent;
  let configContent;
  if (operation === "init") {
    if (agentsOriginal !== null || configOriginal !== null) {
      throw new Error("managed surface exists");
    }
    agentsContent = `${canonicalAgents}\n`;
    configContent = `${canonicalConfig}\n`;
  } else {
    if (agentsOriginal === null) throw new Error("AGENTS.md missing");
    agentsContent = replaceManaged(
      agentsOriginal,
      canonicalAgents,
      AGENTS_START_PATTERN,
      AGENTS_END_PATTERN,
    );
    configContent = configOriginal === null
      ? `${canonicalConfig}\n`
      : replaceManaged(
          configOriginal,
          canonicalConfig,
          CONFIG_START_PATTERN,
          CONFIG_END_PATTERN,
        );
  }

  preflightTargetPaths(agentsPath, configPath);
  applyWrites([
    { content: agentsContent, original: agentsOriginal, path: agentsPath },
    { content: configContent, original: configOriginal, path: configPath },
  ]);
  process.stdout.write(`comins-reference: ${operation === "init" ? "initialized" : "updated"}\n`);
} catch {
  process.stderr.write(FAILURE);
  process.exitCode = 1;
}
