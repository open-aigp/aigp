# AIGP Implementation Record

This is the running implementation ledger for the `open-aigp/aigp` spec repository.

Use this file as the canonical snapshot of what has been delivered, what is in progress, and what is intentionally deferred.

## How To Maintain

- Update this table in every PR that materially changes spec/schema/conformance/docs.
- Keep rows dated (`YYYY-MM-DD`) and append newest work at the top.
- Link to concrete files, docs, and schemas so reviewers can verify quickly.

## Delivered Work

| Date | Track | What Was Implemented | Status | Source of Truth |
|---|---|---|---|---|
| 2026-02-20 | v0.11 version simplification | Unified spec version label to `0.11` and aligned README/docs/examples/changelog/version checks | Done | `spec/aigp-spec.md`, `README.md`, `docs/index.md`, `CHANGELOG.md`, `scripts/check-version-sync.sh` |
| 2026-02-20 | Privacy-proof extension | Added optional salted-proof leaf metadata (`is_salted`, `salt_ref`) with schema validation and normative spec guidance | Done | `schema/aigp-event.schema.json`, `schema/aigp-event.proto`, `spec/aigp-spec.md` |
| 2026-02-20 | Streaming-proof extension | Added optional partial-stream metadata (`is_partial`, `offset_unit`, `offset`) for mid-stream governance interruption evidence | Done | `schema/aigp-event.schema.json`, `schema/aigp-event.proto`, `spec/aigp-spec.md`, `examples/inference-blocked-partial.json` |
| 2026-02-20 | Auditor readiness | Added stable integrity finding taxonomy and machine-readable verifier report schema + docs | Done | `schema/aigp-verifier-report.schema.json`, `docs/verifier-report.md`, `docs/audit-viewer.md`, `spec/aigp-spec.md` |
| 2026-02-20 | Conformance consistency | Fixed fixture/spec mismatch for `governance_hash` empty allowance only for no-content lifecycle events | Done | `conformance/validation-fixtures.tsv`, `conformance/README.md` |
| 2026-02-20 | SDK parity alignment (mirror) | Applied governance-hash lifecycle parity fix across Python/TypeScript/Go/Rust/Java/Kotlin/.NET mirror SDKs and tests | Done | `sdks/*` (mirror), canonical repo: `open-aigp/aigp-sdks` |
| 2026-02-20 | Repository hygiene | Clarified split-repo model and ownership boundaries for spec vs SDKs vs tools | Done | `README.md`, `docs/repository-layout.md`, `.github/workflows/sdk-conformance.yml`, `.github/workflows/python-sdk.yml` |
| 2026-02-20 | Website/docs reliability | Updated Pages workflow to stage schema artifacts correctly and maintain version-sync guardrails | Done | `.github/workflows/pages.yml`, `docs/README.md`, `scripts/check-version-sync.sh` |
| 2026-02-20 | Developer path clarity | Expanded multi-SDK docs and product/developer messaging, including 30-second integration narrative | Done | `README.md`, `docs/index.md` |

## Deferred / Explicitly Held

| Date | Item | Decision |
|---|---|---|
| 2026-02-20 | P0 runtime trust hardening (attestation/transparency/witness) | Held for later milestone; not part of v0.11 scope |

