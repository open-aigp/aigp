---
title: AIGP Schema v0.12 (Preview)
layout: default
---

# AIGP Event Schema v0.12 (Preview)

This page publishes a formatted, documented JSON Schema artifact for the v0.12 event model.

## Artifacts

- Raw JSON Schema: [`/schema/aigp-event.v0.12.schema.json`](https://open-aigp.org/schema/aigp-event.v0.12.schema.json)
- Source file in repo: [`schema/aigp-event.v0.12.schema.json`](https://github.com/open-aigp/aigp/blob/main/schema/aigp-event.v0.12.schema.json)

## What is documented in the JSON

The schema itself contains field-level descriptions for:

- CloudEvents alignment (`source`, `event_id`, `event_type`, `event_time`)
- OTel correlation (`trace_id`, `span_id`, `parent_span_id`, `trace_flags`)
- Governance integrity (`governance_hash`, `aigp_hash`, `parent_hash`, `event_signature`)
- Merkle resource proof envelope (`governance_merkle_tree`)
- Signed vs unsigned extension model (`annotations`)

## Required fields (v0.12 preview)

- `spec_version`
- `source`
- `event_id`
- `event_type`
- `event_category`
- `event_time`
- `agent_id`
- `trace_id`
- `governance_hash`

## Validation

Use any JSON Schema Draft 2020-12 validator against the raw schema URL.

```bash
curl -sS https://open-aigp.org/schema/aigp-event.v0.12.schema.json | jq '.title, .$id'
```

## Notes

- This page is a publication surface for the preview schema artifact.
- Normative spec text and version ratification remain governed by `spec/aigp-spec.md`.
