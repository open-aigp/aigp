---
title: AIGP Schema v0.12 (Preview)
layout: default
---

# AIGP Event Schema v0.12

This page publishes the versioned v0.12 JSON Schema artifact.

## Artifacts

- Raw JSON Schema: [`/schema/aigp-event.v0.12.schema.json`](https://open-aigp.org/schema/aigp-event.v0.12.schema.json)
- Source file in repo: [`schema/aigp-event.v0.12.schema.json`](https://github.com/open-aigp/aigp/blob/main/schema/aigp-event.v0.12.schema.json)

## What is documented in the JSON

The schema contains field-level constraints for:

- Core event identity and timing (`event_id`, `event_type`, `event_category`, `event_time`)
- Agent and trace correlation (`agent_id`, `trace_id`, `sequence_number`, `causality_ref`)
- Governance integrity (`governance_hash`, `hash_type`, `event_signature`, `signature_key_id`)
- Merkle governance proof envelope (`governance_merkle_tree.algorithm`, `resource_count`, `resources`, `inclusion_proofs`)
- Privacy and streaming extensions (`is_salted`, `salt_ref`, `is_partial`, `offset_unit`, `offset`)

## Required fields (v0.12)

- `event_id`
- `event_type`
- `event_category`
- `event_time`
- `agent_id`
- `governance_hash`
- `trace_id`
- `sequence_number`

## Validation

Use any JSON Schema Draft 2020-12 validator against the raw schema URL.

```bash
curl -sS https://open-aigp.org/schema/aigp-event.v0.12.schema.json | jq '.title, .$id'
```

## Notes

- This page is a publication surface for the versioned schema artifact.
- Normative behavior remains governed by `spec/aigp-spec.md`.
