# Trust Hardening Roadmap

Status: Planned backlog item (not yet implemented)
Last updated: 2026-02-19

## Why this exists

AIGP event signing (`event_signature`) proves event origin and integrity.
It does not prove event truthfulness or completeness if a runtime is compromised.

This document tracks the follow-up work needed for regulated trust expectations.

## Current baseline

- `T1` (implemented): signed events and signature verification support.
- Gaps: no runtime attestation guidance, no transparency log guidance, no completeness witness pattern.

## Planned trust profiles

| Profile | Scope | Outcome |
|---|---|---|
| `T1` | Signed events only | Integrity and origin proof |
| `T2` | `T1` + transparency log | Tamper-evident append-only audit trail |
| `T3` | `T2` + runtime attestation | Signature identity bound to measured runtime |
| `T4` | `T3` + witness/completeness checks | Better detection of omission and sequence tampering |

## Backlog tasks

### Phase 1 (`T2`) transparency log guidance

- [ ] Add a non-normative section to spec: transparency log architecture and verifier flow.
- [ ] Define recommended fields for log anchoring metadata in `annotations`.
- [ ] Publish one end-to-end example showing event, log index, and inclusion proof.

### Phase 2 (`T3`) runtime attestation guidance

- [ ] Add guidance for signer isolation (KMS/HSM/signer service pattern).
- [ ] Define attestation metadata shape (image digest, build provenance, runtime identity).
- [ ] Publish verifier checklist for attestation-aware signature validation.

### Phase 3 (`T4`) completeness and witness controls

- [x] Add sequence gap detection guidance (`sequence_number` monotonic checks) in spec profile rules (Section 12.4).
- [ ] Add heartbeat/checkpoint event pattern for expected cadence verification.
- [ ] Add optional witness architecture reference (independent observer channel).

## Acceptance criteria for this roadmap item

- A buyer can read one doc set and answer:
  - what AIGP currently guarantees,
  - what it does not guarantee,
  - what controls to add for regulated deployment.
- At least one reference example is published for each of `T2`, `T3`, and `T4`.

## Deferred for later

- Blockchain anchoring guidance.
- Zero-knowledge proof patterns for selective disclosure.
