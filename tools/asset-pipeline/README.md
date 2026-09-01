# Asset Pipeline Tooling

This directory is reserved for **small, repeatable, headless asset-processing tools** described in `docs/09-asset-pipeline.md`.

Do not build a large framework before the first real asset-import task requires automation.

When repeated work justifies tooling, prefer a narrow command surface such as:

```text
asset:inspect <source>
asset:import <source-id> [selection]
asset:validate [path]
asset:catalog
```

Possible implementation tools may include Blender headless and glTF command-line utilities, but dependencies must be justified by a concrete issue.

The human owner should not need a desktop DCC/editor for routine asset ingestion when a reliable headless path exists.
