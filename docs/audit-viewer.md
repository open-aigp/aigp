# AIGP Reference Audit Viewer

This document defines a practical baseline for building an AIGP audit viewer that non-technical auditors can use.

## Objectives

1. Reconstruct governance timelines across agents and traces.
2. Verify cryptographic integrity and producer authenticity.
3. Surface policy and profile violations clearly.

## Minimum Features

1. DAG reconstruction from `sequence_number` + `causality_ref`.
2. Event signature verification (`event_signature`, `signature_key_id`).
3. Merkle verification:
   - Full-tree verification with `governance_merkle_tree.resources`.
   - Selective verification with `governance_merkle_tree.inclusion_proofs`.
4. Boundary risk visualization for `UNVERIFIED_BOUNDARY`.
5. Profile compliance checks (for example, signed `high`/`critical` events in regulated profiles).
6. Ordering findings for sequence and causal-link integrity.

## Sequence and Causality Visualization

The viewer SHOULD render ordering in two layers:

- `sequence_number`: in-lane event order for one (`agent_id`, `trace_id`) stream.
- `causality_ref`: cross-lane dependency edges linking one event to its causal predecessor.

```mermaid
flowchart TB
  subgraph O["Agent: orchestrator | Trace: T-42"]
    direction TB
    O1["O1 INJECT_SUCCESS<br/>seq=1"]
    O2["O2 A2A_CALL -> researcher<br/>seq=2"]
    O3["O3 A2A_CALL -> executor<br/>seq=3"]
    O4["O4 GOVERNANCE_PROOF<br/>seq=4"]
    O1 --> O2 --> O3 --> O4
  end

  subgraph R["Agent: researcher | Trace: T-42"]
    direction TB
    R1["R1 TOOL_INVOKED<br/>seq=1"]
    R2["R2 MEMORY_READ<br/>seq=2"]
    R3["R3 UNVERIFIED_BOUNDARY<br/>seq=3"]
    R4["R4 INFERENCE_COMPLETED<br/>seq=4"]
    R1 --> R2 --> R3 --> R4
  end

  subgraph E["Agent: executor | Trace: T-42"]
    direction TB
    E1["E1 TOOL_INVOKED<br/>seq=1"]
    E2["E2 TOOL_DENIED (high)<br/>seq=2"]
    E3["E3 HUMAN_APPROVAL<br/>seq=3"]
    E4["E4 TOOL_INVOKED<br/>seq=4"]
    E5["E5 INFERENCE_COMPLETED<br/>seq=5"]
    E1 --> E2 --> E3 --> E4 --> E5
  end

  subgraph G["Agent: guard | Trace: T-42"]
    direction TB
    G1["G1 POLICY_VIOLATION<br/>seq=1"]
  end

  O2 -. "causality_ref" .-> R1
  O3 -. "causality_ref" .-> E1
  E2 -. "causality_ref" .-> G1
  G1 -. "causality_ref" .-> E3
  R4 -. "causality_ref" .-> O4
  E5 -. "causality_ref" .-> O4

  classDef orchestrator fill:#e0ecff,stroke:#3b82f6,stroke-width:1.5px,color:#0f172a;
  classDef researcher fill:#e7f8ee,stroke:#16a34a,stroke-width:1.5px,color:#0f172a;
  classDef executor fill:#f3e8ff,stroke:#9333ea,stroke-width:1.5px,color:#0f172a;
  classDef guard fill:#fee2e2,stroke:#dc2626,stroke-width:1.5px,color:#0f172a;

  class O1,O2,O3,O4 orchestrator;
  class R1,R2,R3,R4 researcher;
  class E1,E2,E3,E4,E5 executor;
  class G1 guard;

  linkStyle 0,1,2,3,4,5,6,7,8,9 stroke:#2563eb,stroke-width:2px;
  linkStyle 10,11,12,13,14,15 stroke:#f59e0b,stroke-width:2px,stroke-dasharray:6 4;
```

Legend:

- Blue solid edges: `sequence_number` ordering checks.
- Orange dashed edges: `causality_ref` dependency checks.
- Node colors: per-agent lanes.

## Verification Report Contract

The viewer SHOULD output a machine-readable report with:

- `run_id`
- `verified_at`
- `total_events`
- `failed_events`
- `signature_failures`
- `merkle_failures`
- `ordering_failures`
- `profile_violations`
- `result` (`pass` | `fail` | `warning`)
- `findings` (stable finding IDs + event context + details)

Recommended schema:

- `schema/aigp-verifier-report.schema.json`

## Recommended UI Views

1. Timeline view: ordered events for one `trace_id`.
2. DAG view: cross-agent causal links.
3. Evidence panel: signature + Merkle proof details for selected event.
4. Findings panel: profile violations grouped by severity.

## Recommended Finding IDs

- `SEQUENCE_GAP`
- `SEQUENCE_DUPLICATE`
- `SEQUENCE_RESET`
- `BROKEN_CAUSAL_REF`
- `SIGNATURE_VERIFICATION_FAILED`
- `MERKLE_ROOT_MISMATCH`
- `INCLUSION_PROOF_INVALID`

## Non-Goals

- Defining a mandatory UI framework.
- Defining a transport protocol.
- Replacing existing SIEM/observability tools.
