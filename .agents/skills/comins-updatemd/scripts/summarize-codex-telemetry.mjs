import { readFileSync } from "node:fs";

const FAILURE = "comins-updatemd telemetry: failed\n";

function parseArguments(args) {
  const inputs = [];
  let json = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--json") {
      json = true;
      continue;
    }
    if (argument === "--input" && index + 1 < args.length) {
      inputs.push(args[index + 1]);
      index += 1;
      continue;
    }
    throw new Error("invalid arguments");
  }

  if (inputs.length === 0) throw new Error("missing input");
  return { inputs, json };
}

function increment(counts, value, validator) {
  if (typeof value !== "string" || !validator(value)) return;
  counts[value] = (counts[value] ?? 0) + 1;
}

const safeModel = (value) =>
  /^(?:gpt-\d+(?:\.\d+)*(?:-[a-z0-9]+)*|o\d+(?:-[a-z0-9]+)*)$/.test(value);
const allowedReasoningEfforts = new Set([
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
  "ultra",
]);
const safeReasoningEffort = (value) =>
  allowedReasoningEfforts.has(value);

function addNumber(current, value) {
  return typeof value === "number" && Number.isFinite(value) ? current + value : current;
}

function maxNumber(current, value) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(current, value)
    : current;
}

const tokenMetrics = [
  ["input", "input_tokens", "tokens-input-unavailable"],
  ["cachedInput", "cached_input_tokens", "tokens-cached-input-unavailable"],
  ["output", "output_tokens", "tokens-output-unavailable"],
  ["reasoning", "reasoning_output_tokens", "tokens-reasoning-unavailable"],
  ["total", "total_tokens", "tokens-total-unavailable"],
];

function emptySummary(inputCount) {
  return {
    version: 1,
    status: "available",
    models: {},
    reasoningEfforts: {},
    inputs: inputCount,
    turns: 0,
    toolCalls: 0,
    waits: 0,
    delegations: 0,
    durationMs: 0,
    tokens: {
      input: 0,
      cachedInput: 0,
      output: 0,
      reasoning: 0,
      total: 0,
    },
  };
}

function aggregate(inputs) {
  const summary = emptySummary(inputs.length);
  let unavailable = false;
  let durationUnavailable = false;
  const unavailableTokenMetrics = new Set();

  for (const input of inputs) {
    let inputRecognized = false;
    let inputDuration = 0;
    let inputDurationMeasured = false;
    const inputTokens = {
      input: 0,
      cachedInput: 0,
      output: 0,
      reasoning: 0,
      total: 0,
    };
    const inputTokenMeasured = Object.fromEntries(
      tokenMetrics.map(([key]) => [key, false]),
    );
    const lines = readFileSync(input, "utf8").split(/\r?\n/).filter(Boolean);
    for (const line of lines) {
      const record = JSON.parse(line);

      if (record?.type === "turn_context") {
        inputRecognized = true;
        summary.turns += 1;
        increment(summary.models, record.payload?.model, safeModel);
        increment(
          summary.reasoningEfforts,
          record.payload?.reasoning_effort,
          safeReasoningEffort,
        );
        continue;
      }

      if (record?.type === "response_item" && record.payload?.type === "function_call") {
        inputRecognized = true;
        summary.toolCalls += 1;
        if (/^(?:wait|wait_agent|.*_wait)$/.test(record.payload.name)) summary.waits += 1;
        if (/^(?:spawn_agent|.*_spawn_agent)$/.test(record.payload.name)) {
          summary.delegations += 1;
        }
        continue;
      }

      if (record?.type === "event_msg") {
        const duration = record.payload?.duration_ms;
        const usage = record.payload?.info?.total_token_usage;
        if (typeof duration === "number" && Number.isFinite(duration)) {
          inputRecognized = true;
          inputDurationMeasured = true;
          inputDuration = Math.max(inputDuration, duration);
        }
        if (usage && typeof usage === "object") {
          for (const [key, source] of tokenMetrics) {
            const value = usage[source];
            if (typeof value !== "number" || !Number.isFinite(value)) continue;
            inputRecognized = true;
            inputTokenMeasured[key] = true;
            inputTokens[key] = maxNumber(inputTokens[key], value);
          }
        }
      }
    }
    if (!inputRecognized) unavailable = true;
    if (!inputDurationMeasured) durationUnavailable = true;
    for (const [key] of tokenMetrics) {
      if (!inputTokenMeasured[key]) unavailableTokenMetrics.add(key);
    }
    summary.durationMs = addNumber(summary.durationMs, inputDuration);
    for (const key of Object.keys(inputTokens)) {
      summary.tokens[key] = addNumber(summary.tokens[key], inputTokens[key]);
    }
  }

  if (unavailable) {
    return {
      version: 1,
      status: "unavailable",
      inputs: inputs.length,
      diagnostics: ["telemetry-schema-unavailable"],
    };
  }

  const diagnostics = [];
  if (durationUnavailable) {
    summary.durationMs = null;
    diagnostics.push("duration-ms-unavailable");
  }
  for (const [key, , diagnostic] of tokenMetrics) {
    if (!unavailableTokenMetrics.has(key)) continue;
    summary.tokens[key] = null;
    diagnostics.push(diagnostic);
  }
  if (diagnostics.length > 0) {
    summary.status = "partial";
    summary.diagnostics = diagnostics;
  }

  return summary;
}

function formatCounts(counts) {
  const entries = Object.entries(counts).sort(([left], [right]) =>
    left.localeCompare(right),
  );
  return entries.length > 0
    ? entries.map(([label, count]) => `${label}=${count}`).join(", ")
    : "none";
}

function formatHuman(summary) {
  if (summary.status === "unavailable") {
    return "comins-updatemd telemetry: unavailable\n";
  }
  const formatMetric = (value) => (value === null ? "unmeasured" : value);
  return [
    `comins-updatemd telemetry: ${summary.status}`,
    `inputs: ${summary.inputs}`,
    `turns: ${summary.turns}`,
    `tool-calls: ${summary.toolCalls}`,
    `waits: ${summary.waits}`,
    `delegations: ${summary.delegations}`,
    `duration-ms: ${formatMetric(summary.durationMs)}`,
    `models: ${formatCounts(summary.models)}`,
    `reasoning-efforts: ${formatCounts(summary.reasoningEfforts)}`,
    `tokens-input: ${formatMetric(summary.tokens.input)}`,
    `tokens-cached-input: ${formatMetric(summary.tokens.cachedInput)}`,
    `tokens-output: ${formatMetric(summary.tokens.output)}`,
    `tokens-reasoning: ${formatMetric(summary.tokens.reasoning)}`,
    `tokens-total: ${formatMetric(summary.tokens.total)}`,
    "",
  ].join("\n");
}

try {
  const { inputs, json } = parseArguments(process.argv.slice(2));
  const summary = aggregate(inputs);
  process.stdout.write(json ? `${JSON.stringify(summary)}\n` : formatHuman(summary));
} catch {
  process.stderr.write(FAILURE);
  process.exitCode = 1;
}
