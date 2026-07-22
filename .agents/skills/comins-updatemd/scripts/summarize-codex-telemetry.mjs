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

  for (const input of inputs) {
    let inputRecognized = false;
    let inputDuration = 0;
    const inputTokens = {
      input: 0,
      cachedInput: 0,
      output: 0,
      reasoning: 0,
      total: 0,
    };
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
          inputDuration = Math.max(inputDuration, duration);
        }
        if (usage && typeof usage === "object") {
          inputRecognized = true;
          inputTokens.input = maxNumber(inputTokens.input, usage.input_tokens);
          inputTokens.cachedInput = maxNumber(
            inputTokens.cachedInput,
            usage.cached_input_tokens,
          );
          inputTokens.output = maxNumber(inputTokens.output, usage.output_tokens);
          inputTokens.reasoning = maxNumber(
            inputTokens.reasoning,
            usage.reasoning_output_tokens,
          );
          inputTokens.total = maxNumber(inputTokens.total, usage.total_tokens);
        }
      }
    }
    if (!inputRecognized) unavailable = true;
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
  return [
    "comins-updatemd telemetry: available",
    `inputs: ${summary.inputs}`,
    `turns: ${summary.turns}`,
    `tool-calls: ${summary.toolCalls}`,
    `waits: ${summary.waits}`,
    `delegations: ${summary.delegations}`,
    `duration-ms: ${summary.durationMs}`,
    `models: ${formatCounts(summary.models)}`,
    `reasoning-efforts: ${formatCounts(summary.reasoningEfforts)}`,
    `tokens-input: ${summary.tokens.input}`,
    `tokens-cached-input: ${summary.tokens.cachedInput}`,
    `tokens-output: ${summary.tokens.output}`,
    `tokens-reasoning: ${summary.tokens.reasoning}`,
    `tokens-total: ${summary.tokens.total}`,
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
