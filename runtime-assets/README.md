# Runtime Assets

This folder is the source of truth for **selected, normalized assets actually intended for the game**.

See `docs/09-asset-pipeline.md`.

Target subfolders:

```text
runtime-assets/
  environment/
  characters/
  animations/
  textures/
  audio/
```

## Rules

- Prefer portable canonical formats; for 3D, default to glTF 2.0 / GLB unless a concrete constraint requires otherwise.
- Do not copy entire marketplace/source packs here.
- Every external asset family should be traceable to a manifest under `art-source/sources/`.
- Engine/build-specific directories may consume/copy these assets, but should not silently become the only source of truth.
- Prominent visual assets must be adapted according to `docs/07-visual-direction.md` rather than shipped with untouched pack styling.
