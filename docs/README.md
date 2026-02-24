# Website Docs Source

This directory is the docs source used by this repository's GitHub Pages workflow.
Production custom-domain hosting for [open-aigp.org](https://open-aigp.org) is managed in the `open-aigp/open-aigp.org` repository.

## Deployment

- Workflow: `.github/workflows/pages.yml`
- Trigger: pushes to `main` that change `docs/**` or `schema/aigp-event.schema.json`
- Pre-deploy guard: `scripts/check-version-sync.sh` must pass (enforced in Pages workflow)
- Custom domain ownership: `open-aigp.org` is owned by the `open-aigp/open-aigp.org` repository. This repo must not contain `docs/CNAME` for that domain.
- Published paths:
  - `/` from `docs/`
  - `/schema/aigp-event.schema.json` copied from `schema/`

## Editing rule

If docs/examples change in this repo, mirror corresponding website content updates to `open-aigp/open-aigp.org` to keep production site content in sync.

Running implementation ledger:
- `docs/implementation-record.md` is the canonical, dated record of delivered work and held items.

## Version sync automation

- Canonical version source: `spec/aigp-spec.md` (`**Version:** x.y.z`)
- CI workflow: `.github/workflows/version-sync.yml`
- Local check: `bash scripts/check-version-sync.sh`

This guard ensures README, docs site copy, examples, and schema version labels stay aligned before deploy.
