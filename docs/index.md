---
title: AIGP
layout: default
---

# AIGP v0.12

Open standard for cryptographic AI governance proof events.

## v0.12 Schema Preview

- Formatted JSON Schema: [`/schema/aigp-event.v0.12.schema.json`](https://open-aigp.org/schema/aigp-event.v0.12.schema.json)
- Documentation page: [`/schema-v0.12`](https://open-aigp.org/schema-v0.12)
- Repository source: [`schema/aigp-event.v0.12.schema.json`](https://github.com/open-aigp/aigp/blob/main/schema/aigp-event.v0.12.schema.json)


## New In v0.12

- Salted-proof metadata (`is_salted`, `salt_ref`) for privacy-sensitive verification
- Streaming interruption metadata (`is_partial`, `offset_unit`, `offset`) for partial-output evidence
- Stable verifier finding IDs for ordering, signature, and Merkle failures
- Machine-readable verifier report schema (`schema/aigp-verifier-report.schema.json`)

## v0.12 Implementation Status

| Area | Implemented | Status |
|---|---|---|
| Privacy-preserving proof metadata | Optional `is_salted` + `salt_ref` on Merkle leaves | Done |
| Streaming interruption evidence | Optional `is_partial` + `offset_unit` + `offset` on Merkle leaves | Done |
| Auditor finding taxonomy | Stable IDs for ordering, signature, and Merkle findings | Done |
| Verifier report contract | JSON Schema for machine-readable verifier output | Done |
| Wire schemas | Protobuf + JSON Schema updated for v0.12 fields | Done |
| Documentation and examples | Spec/README/docs/examples/changelog aligned to `0.12` | Done |

## Known Gaps (Transparent by Design)

- Runtime trust is still emitter-dependent without attestation/transparency controls.
- Benchmark and operations guidance is still in progress (throughput, latency, profile defaults).
- Adoption is early and needs more independent implementers.

Track and contribute here: [`docs/trust-hardening-roadmap.md`](./trust-hardening-roadmap.md)
Running implementation ledger: [`docs/implementation-record.md`](./implementation-record.md)

## Developer and Product View

| Audience | Immediate value |
|---|---|
| Developers | One event contract and SDK parity across languages, frameworks, and transports |
| Platform teams | Canonical governance fields for traceability and enforcement evidence |
| Audit and security teams | Stable finding IDs and machine-readable verifier report schema |
| Product and compliance leaders | Open, vendor-neutral proof format that supports external audits |

## Integrate In 30 Seconds

### Python

```bash
pip install aigp
```

```python
from aigp import AIGPInstrumentor

instrumentor = AIGPInstrumentor(agent_id="agent.my-bot")
event = instrumentor.emit(
    "INJECT_SUCCESS",
    policy_name="policy.trading-limits",
    policy_version=4,
    content="Max position: $10M",
)
print(event["event_type"], event["governance_hash"])
```

### TypeScript

```bash
npm install @aigp/sdk
```

```ts
import { emitAIGPEvent } from "@aigp/sdk";

const event = emitAIGPEvent({
  event_type: "INJECT_SUCCESS",
  event_category: "inject",
  agent_id: "agent.my-bot",
  content: "Max position: $10M",
});
console.log(event.event_id, event.governance_hash);
```

### Go

```bash
go get github.com/open-aigp/aigp-sdks/go
```

```go
package main

import (
	"fmt"

	aigp "github.com/open-aigp/aigp-sdks/go"
)

func main() {
event, _ := aigp.EmitAIGPEvent(aigp.CreateEventOptions{
	EventType:     "INJECT_SUCCESS",
	EventCategory: "inject",
	AgentID:       "agent.my-bot",
}, "Max position: $10M")
fmt.Println(event.EventID, event.GovernanceHash)
}
```

Success looks like:
- `event_id` is a UUID
- `governance_hash` is 64-char lowercase hex
- `trace_id` is present

### Golden Path (AgentGP + AIGP SDK)

```python
from aigp import AgentGPConfig, govern

runner = govern(
    AgentGPConfig(
        base_url="https://api.agentgp.ai",
        api_key="sk-...",
        agent_id="agent.my-bot",
        strict=True,
        required_prompts=["prompt.support-v3"],
        required_policies=["policy.content-filter"],
        required_tools=["tool.search"],
    )
)

result = runner.run(
    {"question": "How do I reset my password?"},
    prompt_name="prompt.support-v3",
    policy_name="policy.content-filter",
    tools=["tool.search"],
)
print(result.trace_id, result.governance_hash, result.allowed)
```

The SDK auto-executes:
- Startup fail-fast checks (`/api/sdk/capabilities`)
- Register -> prompt -> policy -> tool -> audit proof sequence
- Automatic `trace_id`, `sequence_number`, `causality_ref`, `governance_hash`
- Stable response envelope handling (`success`, `data`, `error`, `trace_id`, `governance`)

Contract details: [`AgentGP Golden Path Contract`](./agentgp-golden-path.md)

### SDK Coverage (Parity)

All SDKs implement the same core shape:
- Selective verification helpers with spec-aligned inclusion proof fields (`leaf_hash`, `proof_path`)
- Vendor-neutral signer boundaries (`EventSigner`/`IEventSigner` + sign helper)
- Transport-agnostic reliability utilities (`RetryPolicy`, `ReliableEmitter`)
- Canonical SDK source repository: [`open-aigp/aigp-sdks`](https://github.com/open-aigp/aigp-sdks)

<details>
<summary><strong>All SDKs (click to expand)</strong></summary>

| SDK | Install | SDK Page | Status |
|---|---|---|
| Python | `pip install aigp` | [python](https://github.com/open-aigp/aigp-sdks/tree/main/python) | Reference SDK (+ OTel/OpenLineage integration) |
| TypeScript | `npm install @aigp/sdk` | [typescript](https://github.com/open-aigp/aigp-sdks/tree/main/typescript) | Core parity complete |
| Go | `go get github.com/open-aigp/aigp-sdks/go` | [go](https://github.com/open-aigp/aigp-sdks/tree/main/go) | Core parity complete |
| Rust | `cargo add aigp` | [rust](https://github.com/open-aigp/aigp-sdks/tree/main/rust) | Core parity complete |
| Java | Maven: `org.open-aigp:aigp-sdk` | [java](https://github.com/open-aigp/aigp-sdks/tree/main/java) | Core parity complete |
| Kotlin | Gradle/Maven: `org.open-aigp:aigp-kotlin-sdk` | [kotlin](https://github.com/open-aigp/aigp-sdks/tree/main/kotlin) | Core parity complete |
| .NET | `dotnet add package AIGP.Sdk` | [dotnet](https://github.com/open-aigp/aigp-sdks/tree/main/dotnet) | Core parity complete |

<details>
<summary><strong>Rust quick start</strong></summary>

```toml
[dependencies]
aigp = "0.1.0"
```

```rust
use aigp::{compute_governance_hash, create_aigp_event, CreateEventOptions};

let event = create_aigp_event(CreateEventOptions {
    event_type: "INJECT_SUCCESS".to_string(),
    agent_id: "agent.my-bot".to_string(),
    governance_hash: Some(compute_governance_hash("Max position: $10M", Some("sha256"))?),
    ..Default::default()
})?;
```
</details>

<details>
<summary><strong>Java quick start</strong></summary>

```xml
<dependency>
  <groupId>org.open-aigp</groupId>
  <artifactId>aigp-sdk</artifactId>
  <version>0.1.0</version>
</dependency>
```

```java
AIGP.CreateEventOptions options = new AIGP.CreateEventOptions();
options.eventType = "INJECT_SUCCESS";
options.agentId = "agent.my-bot";
options.governanceHash = AIGP.computeGovernanceHash("Max position: $10M", "sha256");
AIGP.AIGPEvent event = AIGP.createAIGPEvent(options);
```
</details>

<details>
<summary><strong>Kotlin quick start</strong></summary>

```kotlin
val event = createAIGPEvent(
    CreateEventOptions(
        eventType = "INJECT_SUCCESS",
        agentId = "agent.my-bot",
        governanceHash = computeGovernanceHash("Max position: $10M", "sha256"),
    )
)
```
</details>

</details>

## AIGP Loves Open Standards

AIGP is designed to integrate with open standards, not compete with them.

AIGP does not replace OpenTelemetry, OpenLineage, or CloudEvents. It composes with them.
For governance proof, AIGP plays a role similar to what OpenTelemetry plays for observability: a shared, implementation-neutral standard.

| Concern | Standard | What it answers |
|---|---|---|
| Observability | OpenTelemetry | What was slow, failed, retried, or overloaded? |
| Governance Proof | AIGP | What governed this agent action, and can it be cryptographically verified? |
| Data Lineage | OpenLineage | What data moved where, and through which systems? |
| Event Transport | CloudEvents | How are events packaged and routed between systems? |

- **W3C Trace Context**: AIGP reuses `trace_id`, `span_id`, and `trace_flags` for end-to-end correlation.
- **OpenTelemetry**: AIGP dual-emits governance proof alongside operational spans.
- **CloudEvents**: AIGP events can ride a standard event envelope for interoperable routing.
- **OpenLineage**: AIGP attaches governance context to lineage via open facets.
- **JSON Schema + Protobuf**: AIGP keeps open, language-neutral contracts for validation and codegen.

## AIGP v0.12 Event Example

```json
{
  "event_id": "a1b2c3d4-e5f6-4890-abcd-ef1234567890",
  "event_type": "GOVERNANCE_PROOF",
  "event_category": "governance-proof",
  "event_time": "2026-02-19T08:30:00.123Z",
  "agent_id": "agent.trading-bot-v2",
  "governance_hash": "8dd4648db4f94db951f83bb70fa7b575533912f4fd3219d161384df2b8d523ec",
  "hash_type": "merkle-sha256",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "spec_version": "0.12",
  "governance_merkle_tree": {
    "algorithm": "sha256",
    "leaf_count": 2,
    "leaves": [
      {
        "resource_type": "policy",
        "resource_name": "policy.trading-limits",
        "hash": "2a7b9c1d4e5f67890abcdef1234567890abcdef1234567890abcdef12345678"
      },
      {
        "resource_type": "lineage",
        "resource_name": "lineage.upstream-orders",
        "hash": "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
        "hash_mode": "pointer",
        "content_ref": "s3://aigp-governance/sha256:5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f"
      }
    ],
    "inclusion_proofs": [
      {
        "leaf_hash": "2a7b9c1d4e5f67890abcdef1234567890abcdef1234567890abcdef12345678",
        "proof_path": [
          {
            "sibling_hash": "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
            "sibling_position": "right"
          }
        ]
      }
    ]
  }
}
```

## Where To Go Next

- Spec: [spec/aigp-spec.md](https://github.com/open-aigp/aigp/blob/main/spec/aigp-spec.md)
- JSON Schema: [schema/aigp-event.schema.json](https://open-aigp.org/schema/aigp-event.schema.json)
- Verifier Report Schema: [schema/aigp-verifier-report.schema.json](https://open-aigp.org/schema/aigp-verifier-report.schema.json)
- Repository layout: [docs/repository-layout.md](https://github.com/open-aigp/aigp/blob/main/docs/repository-layout.md)
- Audit viewer guide: [docs/audit-viewer.md](https://github.com/open-aigp/aigp/blob/main/docs/audit-viewer.md)
- Verifier report guide: [docs/verifier-report.md](https://github.com/open-aigp/aigp/blob/main/docs/verifier-report.md)
- SDKs: [aigp-sdks](https://github.com/open-aigp/aigp-sdks)
- Tools: [aigp-tools](https://github.com/open-aigp/aigp-tools)
- OpenLineage integration: [integrations/openlineage/](https://github.com/open-aigp/aigp/tree/main/integrations/openlineage)
- CloudEvents integration: [integrations/cloudevents/](https://github.com/open-aigp/aigp/tree/main/integrations/cloudevents)

## FAQ

### Is AIGP just another telemetry format?
No. AIGP focuses on governance-proof semantics and cryptographic integrity. It is not a general observability replacement.

### Why not use OpenTelemetry alone?
OpenTelemetry captures operational telemetry. AIGP adds governance-proof semantics and cryptographic evidence.

### Why not use OpenLineage alone?
OpenLineage captures data movement and lineage. AIGP captures governance decisions and governed artifacts.

### Does AIGP require AgentGP?
No. AgentGP is the first reference implementation. AIGP is implementation-neutral and open to all vendors and frameworks.
