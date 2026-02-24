---
title: AgentGP Golden Path Contract
layout: default
---

# AgentGP Golden Path Contract

This contract defines the minimum API surface expected by the AIGP Python golden-path runner (`govern(agent).run(...)`).

Machine-readable OpenAPI contract:
- [`python/aigp/openapi/agentgp-golden-path.openapi.json`](https://github.com/open-aigp/aigp-sdks/blob/main/python/aigp/openapi/agentgp-golden-path.openapi.json)

## Stable Response Envelope

All endpoints SHOULD return:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "governance": {
    "governance_hash": "8dd4648db4f94db951f83bb70fa7b575533912f4fd3219d161384df2b8d523ec"
  }
}
```

## Required Endpoints

### `GET /api/sdk/capabilities`

Declares server capabilities and endpoint support.

`data` example:

```json
{
  "endpoints": ["/api/govern/step", "/api/traces/{trace_id}"],
  "min_sdk_version": "1.0.0"
}
```

### `POST /api/govern/step`

Single orchestration call for prompt, policy, tool, and governance proof.

Request fields:
- `agent_id`
- `trace_id`
- `input`
- `prompt_name`
- `prompt_variables`
- `policy_name`
- `policy_variables`
- `tools`
- `tool_input`
- `governance_mode`
- `metadata`
- `dry_run` (optional startup validation mode)
- `required` (optional startup validation resources)

Response `data` SHOULD include:
- `allowed`
- `prompt` (`name`, `version`, `content`, `allowed`)
- `policy` (`name`, `version`, `content`, `allowed`, `reason`)
- `tools` list (`name`, `allowed`, `reason`)
- `governance_hash`
- `coverage`

### `GET /api/traces/{trace_id}`

Canonical trace retrieval endpoint used by SDK and UI.

Response `data` SHOULD include:
- `trace_id`
- `events` (normalized event list)
- `coverage` (prompt/policy/tool/audit completeness)

## Strict Mode Expectations

When SDK strict mode is enabled:
- startup MUST fail if API key, agent ID, or endpoint compatibility is invalid
- startup MUST fail if required prompts/policies/tools are missing
- run MUST fail if `governance_hash` is absent
- audit emissions MUST carry a non-empty `governance_hash`
