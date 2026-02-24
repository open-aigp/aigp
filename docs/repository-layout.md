# Repository Layout

AIGP uses a split-repository model:

| Repository | Purpose |
|---|---|
| `open-aigp/aigp` | Normative specification, JSON Schema/Protobuf schema, conformance fixtures, and governance process |
| `open-aigp/aigp-sdks` | Multi-language SDK implementations (Python, TypeScript, Go, Rust, Java, Kotlin, .NET) |
| `open-aigp/aigp-tools` | Verifier CLI, audit viewer UI, and report/export tooling |

During migration, `open-aigp/aigp/sdks/` may exist as a mirror for compatibility, but canonical SDK development happens in `open-aigp/aigp-sdks`.

## Ownership Boundaries

- Normative requirements MUST live in `open-aigp/aigp/spec/` and `open-aigp/aigp/schema/`.
- SDK behavior MUST conform to fixtures from `open-aigp/aigp/conformance/`.
- Canonical SDK CI MUST run in `open-aigp/aigp-sdks`; this repo only guards mirror ownership.
- Tooling output formats MAY evolve independently as long as verifier conclusions remain consistent with the spec.

## Conformance Sync

SDK and tooling repos should regularly sync:

- `conformance/validation-fixtures.tsv`
- `schema/aigp-event.schema.json`
- `schema/aigp-event.proto`

This keeps implementations aligned with spec-level compatibility guarantees.
