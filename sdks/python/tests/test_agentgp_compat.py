"""AgentGP ingest compatibility helpers."""

import json

from aigp.events import create_aigp_event, to_agentgp_ingest_event


def test_create_event_populates_default_source():
    event = create_aigp_event(
        event_type="INJECT_SUCCESS",
        event_category="inject",
        agent_id="agent.test",
        org_id="org.acme",
        trace_id="4bf92f3577b34da6a3ce929d0e0e4736",
        governance_hash="a" * 64,
    )
    assert event["source"] == "aigp://org.acme/agent.test"


def test_to_agentgp_ingest_event_stringifies_nested_fields():
    event = create_aigp_event(
        event_type="INJECT_SUCCESS",
        event_category="inject",
        agent_id="agent.test",
        trace_id="4bf92f3577b34da6a3ce929d0e0e4736",
        governance_hash="a" * 64,
        annotations={"signed": {"scope": "prod"}},
        governance_merkle_tree={
            "algorithm": "sha256",
            "resource_count": 1,
            "resources": [
                {
                    "resource_type": "policy",
                    "resource_name": "policy.limits",
                    "hash": "b" * 64,
                }
            ],
        },
    )

    wire = to_agentgp_ingest_event(event)
    assert wire["spec_version"] == "0.13"
    assert wire["source"] == "aigp://default/agent.test"
    assert isinstance(wire["annotations"], str)
    assert isinstance(wire["governance_merkle_tree"], str)

    parsed_annotations = json.loads(wire["annotations"])
    assert parsed_annotations["signed"]["scope"] == "prod"

    parsed_tree = json.loads(wire["governance_merkle_tree"])
    assert parsed_tree["resource_count"] == 1
