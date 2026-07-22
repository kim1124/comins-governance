import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test, { afterEach } from "node:test";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const script = join(
  root,
  ".agents",
  "skills",
  "comins-updatemd",
  "scripts",
  "summarize-codex-telemetry.mjs",
);
const temporaryRoots = [];

afterEach(() => {
  for (const path of temporaryRoots.splice(0)) rmSync(path, { recursive: true, force: true });
});

function fixture(lines) {
  const directory = mkdtempSync(join(tmpdir(), "comins-telemetry-test-"));
  temporaryRoots.push(directory);
  const path = join(directory, "rollout.jsonl");
  writeFileSync(path, `${lines.map((line) => JSON.stringify(line)).join("\n")}\n`);
  return path;
}

function run(path, ...extra) {
  return spawnSync(process.execPath, [script, ...extra, "--input", path], {
    cwd: root,
    encoding: "utf8",
  });
}

test("aggregates only approved telemetry counters", () => {
  const path = fixture([
    { type: "turn_context", payload: { model: "gpt-5.6-sol", reasoning_effort: "xhigh" } },
    { type: "response_item", payload: { type: "function_call", name: "exec_command" } },
    { type: "response_item", payload: { type: "function_call", name: "wait" } },
    { type: "response_item", payload: { type: "function_call", name: "spawn_agent" } },
    {
      type: "event_msg",
      payload: {
        duration_ms: 1200,
        info: {
          total_token_usage: {
            input_tokens: 100,
            cached_input_tokens: 20,
            output_tokens: 10,
            reasoning_output_tokens: 5,
            total_tokens: 115,
          },
        },
      },
    },
  ]);

  const result = run(path, "--json");

  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.version, 1);
  assert.equal(output.status, "available");
  assert.deepEqual(output.models, { "gpt-5.6-sol": 1 });
  assert.deepEqual(output.reasoningEfforts, { xhigh: 1 });
  assert.equal(output.inputs, 1);
  assert.equal(output.turns, 1);
  assert.equal(output.toolCalls, 3);
  assert.equal(output.waits, 1);
  assert.equal(output.delegations, 1);
  assert.equal(output.durationMs, 1200);
  assert.deepEqual(output.tokens, {
    input: 100,
    cachedInput: 20,
    output: 10,
    reasoning: 5,
    total: 115,
  });
  assert.doesNotMatch(result.stdout, /rollout\.jsonl|exec_command|spawn_agent/);
});

test("marks unknown schemas unavailable without dumping source values", () => {
  const path = fixture([{ unexpected: { user_content: "private-content" } }]);
  const result = run(path, "--json");

  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.status, "unavailable");
  assert.deepEqual(output.diagnostics, ["telemetry-schema-unavailable"]);
  assert.doesNotMatch(result.stdout, /private-content|rollout\.jsonl/);
});

test("marks multiple inputs unavailable when any input schema is unrecognized", () => {
  const recognized = fixture([
    { type: "turn_context", payload: { model: "gpt-5.6-sol", reasoning_effort: "xhigh" } },
  ]);
  const unrecognized = fixture([{ unexpected: { user_content: "private-content" } }]);
  const result = run(recognized, "--json", "--input", unrecognized);

  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.deepEqual(output, {
    version: 1,
    status: "unavailable",
    inputs: 2,
    diagnostics: ["telemetry-schema-unavailable"],
  });
  assert.doesNotMatch(result.stdout, /private-content|rollout\.jsonl|gpt-5\.6-sol|xhigh/);
});

test("redacts unrecognized model and reasoning labels", () => {
  const path = fixture([
    {
      type: "turn_context",
      payload: {
        model: "gpt-private-content with spaces",
        reasoning_effort: "private-content",
      },
    },
  ]);
  const result = run(path, "--json");

  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.status, "available");
  assert.deepEqual(output.models, {});
  assert.deepEqual(output.reasoningEfforts, {});
  assert.doesNotMatch(result.stdout, /private-content/);
});

test("human output includes safe model, reasoning, and token totals only", () => {
  const path = fixture([
    { type: "turn_context", payload: { model: "gpt-5.6-sol", reasoning_effort: "xhigh" } },
    { type: "response_item", payload: { type: "function_call", name: "private_tool_name" } },
    {
      type: "event_msg",
      payload: {
        private_content: "private-content",
        info: {
          total_token_usage: {
            input_tokens: 100,
            cached_input_tokens: 20,
            output_tokens: 10,
            reasoning_output_tokens: 5,
            total_tokens: 115,
          },
        },
      },
    },
  ]);

  const result = run(path);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^comins-updatemd telemetry: available$/m);
  assert.match(result.stdout, /^models: gpt-5\.6-sol=1$/m);
  assert.match(result.stdout, /^reasoning-efforts: xhigh=1$/m);
  assert.match(result.stdout, /^tokens-input: 100$/m);
  assert.match(result.stdout, /^tokens-cached-input: 20$/m);
  assert.match(result.stdout, /^tokens-output: 10$/m);
  assert.match(result.stdout, /^tokens-reasoning: 5$/m);
  assert.match(result.stdout, /^tokens-total: 115$/m);
  assert.doesNotMatch(result.stdout, /private-content|private_tool_name|rollout\.jsonl/);
});

test("uses a constant failure for invalid JSONL", () => {
  const directory = mkdtempSync(join(tmpdir(), "comins-telemetry-invalid-"));
  temporaryRoots.push(directory);
  const path = join(directory, "rollout.jsonl");
  writeFileSync(path, "not-json\n");

  const result = run(path, "--json");

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "comins-updatemd telemetry: failed\n");
});
