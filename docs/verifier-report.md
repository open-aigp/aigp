---
title: Verifier Report
layout: default
---

# AIGP Verifier Report (`v0.11`)

This document defines the practical output contract for verifier tools.

Canonical schema:

- [`schema/aigp-verifier-report.schema.json`](../schema/aigp-verifier-report.schema.json)

## Why this matters

- **Developers** get a stable machine-readable output to plug into CI and pipelines.
- **Product and audit teams** get consistent findings regardless of runtime/vendor.

## Required finding IDs

- Ordering: `SEQUENCE_GAP`, `SEQUENCE_DUPLICATE`, `SEQUENCE_RESET`, `BROKEN_CAUSAL_REF`
- Signature: `SIGNATURE_VERIFICATION_FAILED`
- Merkle: `MERKLE_ROOT_MISMATCH`, `INCLUSION_PROOF_INVALID`

## Minimal report example

```json
{
  "run_id": "verify-2026-02-20T15:22:01Z",
  "spec_version": "0.11",
  "verified_at": "2026-02-20T15:22:01.000Z",
  "source": "s3://aigp-gov/events/trace-550e8400/",
  "trace_id": "550e8400-e29b-41d4-a716-446655440000",
  "result": "fail",
  "summary": {
    "total_events": 124,
    "passed_events": 122,
    "failed_events": 2,
    "signature_failures": 0,
    "merkle_failures": 1,
    "ordering_failures": 1,
    "profile_violations": 0
  },
  "findings": [
    {
      "finding_id": "SEQUENCE_GAP",
      "message": "Missing sequence number 3 for agent.trading-bot-v2.",
      "severity": "high",
      "event_id": "c3d4e5f6..."
    },
    {
      "finding_id": "MERKLE_ROOT_MISMATCH",
      "message": "Computed root did not match governance_hash.",
      "severity": "critical",
      "event_id": "e5f67890...",
      "details": {
        "expected": "a3f2b8c1...",
        "computed": "f9e8d7c6..."
      }
    }
  ]
}
```
