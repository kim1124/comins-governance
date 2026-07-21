import { execFileSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const FAILURE = "comins-reference: failed\n";
const START_PATTERN = /<!-- comins-reference:managed-start contract=v[^\s]+ -->/g;
const END_MARKER = "<!-- comins-reference:managed-end -->";

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

function managedBlock(content) {
  const starts = [...content.matchAll(START_PATTERN)];
  const firstEnd = content.indexOf(END_MARKER);
  const lastEnd = content.lastIndexOf(END_MARKER);
  if (starts.length !== 1 || firstEnd === -1 || firstEnd !== lastEnd) {
    throw new Error("managed markers invalid");
  }
  const start = starts[0].index;
  if (start === undefined || start >= firstEnd) throw new Error("managed markers invalid");
  return {
    end: firstEnd + END_MARKER.length,
    start,
    value: content.slice(start, firstEnd + END_MARKER.length),
  };
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

try {
  const { operation, target } = parseArguments(process.argv.slice(2));
  const targetRoot = repositoryRoot(target);
  const template = readFileSync(
    join(governanceRoot(), "templates", "module", "AGENTS.md"),
    "utf8",
  );
  const canonical = managedBlock(template).value;
  const agentsPath = join(targetRoot, "AGENTS.md");

  if (operation === "init") {
    writeFileSync(agentsPath, `${canonical}\n`, { encoding: "utf8", flag: "wx" });
    process.stdout.write("comins-reference: initialized\n");
  } else {
    const current = readFileSync(agentsPath, "utf8");
    const managed = managedBlock(current);
    const updated = `${current.slice(0, managed.start)}${canonical}${current.slice(managed.end)}`;
    writeFileSync(agentsPath, updated, "utf8");
    process.stdout.write("comins-reference: updated\n");
  }
} catch {
  process.stderr.write(FAILURE);
  process.exitCode = 1;
}
