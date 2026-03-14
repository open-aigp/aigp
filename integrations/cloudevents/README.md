# AIGP CloudEvents Binding

**Version:** 0.13 (Draft)

**Companion to:** [AIGP Specification v0.13](../../spec/aigp-spec.md), Section 13

---

## Overview

AIGP events are transported using the [CloudEvents](https://cloudevents.io/) specification (CNCF Graduated, v1.0). CloudEvents provides a vendor-neutral envelope with protocol bindings for HTTP, Kafka, AMQP, NATS, gRPC, and WebSockets.

By adopting CloudEvents as the transport layer, AIGP gains interoperability with every CloudEvents-compatible broker, gateway, and serverless platform — including AWS EventBridge, Azure Event Grid, Google Eventarc, Knative, and Dapr — without defining custom transport bindings.

## Architecture

```
AI Agent
    │
    ├─ AIGP Event (JSON)
    │       │
    │       ▼
    │  CloudEvents Envelope
    │  ┌─────────────────────────────────────┐
    │  │ specversion: "1.0"                  │
    │  │ type: "org.aigp.v1.inject_success"  │
    │  │ source: "aigp://org.finco/agent..." │
    │  │ aigpagentid: "agent.trading-bot-v2" │
    │  │ aigpcategory: "inject"              │
    │  │ aigpclassification: "confidential"  │
    │  │                                     │
    │  │ data: { full AIGPEvent }            │
    │  └─────────────────────────────────────┘
    │       │
    ▼       ▼
  OTel    CloudEvents-compatible transport
  Span    (HTTP, Kafka, AMQP, NATS, gRPC)
    │       │
    ▼       ▼
  Observability    AI Governance Store
  Backend          (compliance, audit)
```

## Type Convention

CloudEvents `type` follows reverse-DNS with AIGP version prefix:

```
org.aigp.v1.<lowercase_event_type>
```

Examples:
- `org.aigp.v1.inject_success`
- `org.aigp.v1.governance_proof`
- `org.aigp.v1.memory_read`
- `org.aigp.v1.unverified_boundary`

Consumers can subscribe using prefix matching:
- `org.aigp.v1.*` — all AIGP v1 events
- `org.aigp.v1.inject_*` — all injection events
- `org.aigp.v1.memory_*` — all memory governance events

## Source Convention

CloudEvents `source` uses a URI scheme identifying the organization and agent:

```
aigp://<org_id>/<agent_id>
```

Examples:
- `aigp://org.finco/agent.trading-bot-v2`
- `aigp://org.acme-corp/agent.customer-support`
- `aigp://default/agent.standalone-bot` (when org_id is empty)

## Extension Attributes

AIGP defines six CloudEvents extension attributes for envelope-level filtering. Names conform to CloudEvents rules: lowercase `[a-z0-9]` only.

| Attribute | Type | AIGP Field | Purpose |
|---|---|---|---|
| `aigpagentid` | String | `agent_id` | Per-agent routing |
| `aigporgid` | String | `org_id` | Per-organization routing |
| `aigpcategory` | String | `event_category` | Category-based filtering |
| `aigpclassification` | String | `data_classification` | Sensitivity-based routing |
| `aigpseverity` | String | `severity` | Priority-based routing |
| `aigphashtype` | String | `hash_type` | Hash algorithm filtering |

### Routing Examples

| Use Case | Filter Expression |
|---|---|
| All events from one agent | `aigpagentid = "agent.trading-bot-v2"` |
| Restricted data to compliance queue | `aigpclassification = "restricted"` |
| Critical violations to PagerDuty | `aigpseverity = "critical"` AND `aigpcategory = "policy"` |
| All memory governance events | `aigpcategory = "memory"` |
| Merkle-tree events only | `aigphashtype = "merkle-sha256"` |

## Content Modes

### Structured Mode (JSON envelope + payload)

The entire CloudEvents envelope is a single JSON document. Used for event brokers and platforms that inspect events as JSON.

See: [`examples/structured-inject-success.json`](./examples/structured-inject-success.json)

### Binary Mode (headers + raw payload)

CloudEvents attributes are HTTP headers (`ce-*`) or Kafka headers (`ce_*`). The body is the raw AIGP event JSON with no wrapper.

See: Spec Section 13.3.2 for HTTP and Kafka binary mode examples.

## Python SDK

```python
from aigp import create_aigp_event
from aigp.cloudevents import wrap_as_cloudevent, unwrap_from_cloudevent

# Create an AIGP event
event = create_aigp_event(
    event_type="INJECT_SUCCESS",
    event_category="inject",
    agent_id="agent.trading-bot-v2",
    trace_id="4bf92f3577b34da6a3ce929d0e0e4736",
    governance_hash="a3f2b8c1...",
    org_id="org.finco",
    data_classification="confidential",
)

# Wrap in CloudEvents envelope (structured mode)
ce = wrap_as_cloudevent(event)
# -> {"specversion": "1.0", "type": "org.aigp.v1.inject_success", "data": {...}}

# Unwrap back to AIGP event
aigp_event = unwrap_from_cloudevent(ce)
# -> {"event_id": "...", "event_type": "INJECT_SUCCESS", ...}
```

## References

- [CloudEvents Specification v1.0](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md)
- [CloudEvents JSON Format](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md)
- [CloudEvents HTTP Protocol Binding](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md)
- [CloudEvents Kafka Protocol Binding](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/kafka-protocol-binding.md)
- [AIGP Specification Section 13](../../spec/aigp-spec.md#13-transport-bindings-via-cloudevents)
