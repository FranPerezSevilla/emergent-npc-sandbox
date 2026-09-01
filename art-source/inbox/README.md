# Asset Inbox

This directory represents the **intake boundary** for external art source files.

Read `docs/09-asset-pipeline.md` before importing anything.

## Normal workflow

- Public/free assets: prefer a source manifest under `art-source/sources/` containing the legal source URL and license metadata. The agent can fetch the source when permitted.
- Purchased/login-gated assets: the human acquires them and makes the bundle available through an approved private mechanism. Do not bypass access controls.
- Custom assets: provide the original file or a durable source location and record provenance.

## Important

Raw source archives are staging inputs, **not runtime assets**.

Do not put an entire pack into production just because it is available. Select only the files required by the current issue.

Large/raw archives should normally stay out of ordinary Git history. This directory's binary contents are ignored by default; this README is tracked as the contract.

Normalized production assets belong under `runtime-assets/`.
