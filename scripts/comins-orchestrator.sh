#!/bin/sh
# Run from the target Comins module root. Preserve the base Sol configuration.
set -eu
exec codex --model gpt-6-astra \
  -c 'model_reasoning_effort="high"' \
  -c 'plan_mode_reasoning_effort="high"' "$@"
