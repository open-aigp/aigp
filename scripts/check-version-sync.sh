#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

failures=0

check_contains() {
  local file="$1"
  local expected="$2"
  local label="$3"

  if grep -Fq "$expected" "$file"; then
    echo "PASS: $label"
  else
    echo "FAIL: $label"
    echo "  expected to find: $expected"
    echo "  file: $file"
    failures=1
  fi
}

check_spec_version_in_json_files() {
  local pattern="$1"
  local label="$2"
  local matched=0

  for file in $pattern; do
    if [ ! -f "$file" ]; then
      continue
    fi
    if ! grep -Eq '"spec_version"\s*:' "$file"; then
      continue
    fi
    matched=1
    if grep -Eq "\"spec_version\"\\s*:\\s*\"${SPEC_VERSION}\"" "$file"; then
      echo "PASS: ${label} (${file})"
    else
      echo "FAIL: ${label} (${file})"
      echo "  expected spec_version: ${SPEC_VERSION}"
      failures=1
    fi
  done

  if [ "$matched" -eq 0 ]; then
    echo "FAIL: ${label}"
    echo "  no files with spec_version found for pattern: $pattern"
    failures=1
  fi
}

SPEC_VERSION="$(sed -nE 's/^\*\*Version:\*\* ([0-9]+\.[0-9]+(\.[0-9]+)?).*/\1/p' spec/aigp-spec.md | head -n1)"
if [ -z "$SPEC_VERSION" ]; then
  echo "FAIL: Unable to determine spec version from spec/aigp-spec.md"
  exit 1
fi

echo "Authoritative version from spec: $SPEC_VERSION"

check_contains "README.md" "Spec-v${SPEC_VERSION}-" "README spec badge matches spec version"
check_contains "README.md" "### What's New in v${SPEC_VERSION}" "README What's New section matches spec version"
check_contains "docs/index.md" "# AIGP v${SPEC_VERSION}" "Docs headline matches spec version"
check_contains "docs/index.md" "## New In v${SPEC_VERSION}" "Docs New In section matches spec version"
check_contains "docs/index.md" "\"spec_version\": \"${SPEC_VERSION}\"" "Docs example event spec_version matches spec version"
check_contains "schema/aigp-event.schema.json" "event schema v${SPEC_VERSION}" "Schema description matches spec version"
check_contains "schema/aigp-event.schema.json" "\"examples\": [\"${SPEC_VERSION}\"]" "Schema spec_version examples match spec version"
check_contains "schema/aigp-verifier-report.schema.json" "v${SPEC_VERSION}" "Verifier report schema description matches spec version"
check_contains "schema/aigp-verifier-report.schema.json" "\"${SPEC_VERSION}\"" "Verifier report schema examples match spec version"
check_spec_version_in_json_files "examples/*.json" "Root examples spec_version matches spec version"
check_spec_version_in_json_files "integrations/cloudevents/examples/*.json" "CloudEvents examples spec_version matches spec version"
check_contains "integrations/cloudevents/README.md" "**Version:** ${SPEC_VERSION} (Draft)" "CloudEvents README version matches spec version"
check_contains "integrations/cloudevents/README.md" "v${SPEC_VERSION}" "CloudEvents README companion spec reference matches spec version"
check_contains "integrations/opentelemetry/semantic-conventions.md" "AIGP Specification v${SPEC_VERSION}" "OpenTelemetry companion spec reference matches spec version"
check_contains "integrations/openlineage/semantic-conventions.md" "blob/v${SPEC_VERSION}" "OpenLineage semantic conventions schema URL references match spec version"
check_contains "integrations/openlineage/semantic-conventions.md" "\"${SPEC_VERSION}\"" "OpenLineage semantic conventions specVersion example matches spec version"
check_contains "integrations/openlineage/facets/AIGPGovernanceRunFacet.json" "blob/v${SPEC_VERSION}" "OpenLineage governance facet ID matches spec version"
check_contains "integrations/openlineage/facets/AIGPGovernanceRunFacet.json" "\"default\": \"${SPEC_VERSION}\"" "OpenLineage governance facet default specVersion matches spec version"
check_contains "integrations/openlineage/facets/AIGPResourceInputFacet.json" "blob/v${SPEC_VERSION}" "OpenLineage resource facet ID matches spec version"
check_contains "integrations/openlineage/examples/openlineage-governance-run.json" "blob/v${SPEC_VERSION}" "OpenLineage example schema URLs match spec version"
check_contains "integrations/openlineage/examples/openlineage-governance-run.json" "\"specVersion\": \"${SPEC_VERSION}\"" "OpenLineage example specVersion matches spec version"

if [ -f "docs/CNAME" ]; then
  echo "FAIL: docs/CNAME must not exist in this repository"
  echo "  open-aigp.org custom domain is managed by the open-aigp.org repository."
  failures=1
else
  echo "PASS: docs/CNAME is absent (no conflicting custom-domain claim)"
fi

if [ "$failures" -ne 0 ]; then
  echo
  echo "Version sync check failed."
  exit 1
fi

echo
echo "Version sync check passed."
