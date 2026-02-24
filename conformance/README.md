# AIGP SDK Conformance Fixtures

`validation-fixtures.tsv` is the shared fixture set used by all SDK test suites
(Python, TypeScript, Go, Rust, Java, Kotlin, .NET).

Each row defines:

- `trace_id` / `span_id` combinations
- `governance_hash` validity by event shape
- expected validator outcome (`expect_valid`)

When validator behavior changes, update this fixture file and keep all SDK tests green.

`validation-fixtures.tsv` also carries causal ordering fields:

- `sequence_number`
- `causality_ref`

SDK validators SHOULD enforce base per-event checks here:

- `sequence_number` MUST be >= 1
- `causality_ref` MAY be empty (when present, it is checked by stream-level verifiers)
- `governance_hash` MUST always be present as a field
- `governance_hash` MAY be empty only for events with no governed content (for example, `AGENT_REGISTERED`)
- Events with governed content (for example, `INJECT_SUCCESS`) MUST use a 64-char lowercase hex `governance_hash`
