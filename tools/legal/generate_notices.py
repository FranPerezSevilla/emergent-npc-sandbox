#!/usr/bin/env python3
"""Generate human-readable attribution/notice views from legal/third-party.json."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REGISTRY = ROOT / "legal" / "third-party.json"
ATTRIBUTIONS = ROOT / "legal" / "ATTRIBUTIONS.md"
NOTICES = ROOT / "legal" / "THIRD_PARTY_NOTICES.md"

TYPE_ORDER = [
    "software",
    "tool",
    "ai_model",
    "ai_service",
    "generated_content_source",
    "animation",
    "asset_3d",
    "asset_2d",
    "texture",
    "font",
    "music",
    "sfx",
    "stock_media",
    "other",
]

TYPE_TITLES = {
    "software": "Software & runtimes",
    "tool": "Tools",
    "ai_model": "AI models",
    "ai_service": "AI services",
    "generated_content_source": "AI-assisted retained content sources",
    "animation": "Animation",
    "asset_3d": "3D assets",
    "asset_2d": "2D assets",
    "texture": "Textures",
    "font": "Fonts",
    "music": "Music",
    "sfx": "Sound effects",
    "stock_media": "Stock media",
    "other": "Other",
}


def load_entries() -> list[dict]:
    data = json.loads(REGISTRY.read_text(encoding="utf-8"))
    return [e for e in data.get("entries", []) if e.get("reviewStatus") != "removed"]


def sort_entries(entries: list[dict]) -> list[dict]:
    rank = {kind: i for i, kind in enumerate(TYPE_ORDER)}
    return sorted(entries, key=lambda e: (rank.get(e.get("type"), 999), str(e.get("name", "")).lower(), str(e.get("id", ""))))


def build_attributions(entries: list[dict]) -> str:
    lines = [
        "# Attributions",
        "",
        "<!-- GENERATED FROM legal/third-party.json. Do not manually add authoritative records here. -->",
        "",
    ]
    if not entries:
        lines.append("No production third-party resources are registered yet.")
        lines.append("")
        return "\n".join(lines)

    current_type = None
    for entry in sort_entries(entries):
        kind = entry.get("type", "other")
        if kind != current_type:
            lines.extend([f"## {TYPE_TITLES.get(kind, kind)}", ""])
            current_type = kind

        name = entry.get("name", entry.get("id", "Unnamed"))
        creator = entry.get("creator", "Unknown")
        status = entry.get("reviewStatus", "pending")
        lines.append(f"### {name}")
        lines.append("")
        lines.append(f"- Creator/provider: {creator}")
        lines.append(f"- Registry ID: `{entry.get('id', '')}`")
        lines.append(f"- License/terms: {entry.get('licenseName', 'unresolved')}")
        if entry.get("sourceUrl"):
            lines.append(f"- Source: {entry['sourceUrl']}")
        if entry.get("licenseUrl"):
            lines.append(f"- License/terms URL: {entry['licenseUrl']}")
        lines.append(f"- Review status: {status}")
        lines.append(f"- Attribution required: {'yes' if entry.get('attributionRequired') else 'no'}")
        credit = entry.get("requiredCreditText")
        if credit:
            lines.extend(["- Required credit text:", "", f"  > {credit}"])
        used_in = entry.get("usedIn") or []
        if used_in:
            lines.append(f"- Used in: {', '.join(f'`{p}`' for p in used_in)}")
        notes = str(entry.get("notes", "")).strip()
        if notes:
            lines.append(f"- Notes: {notes}")
        lines.append("")

    return "\n".join(lines)


def build_notices(entries: list[dict]) -> str:
    lines = [
        "# Third-Party Notices",
        "",
        "<!-- GENERATED FROM legal/third-party.json. Do not manually add authoritative records here. -->",
        "",
    ]
    if not entries:
        lines.append("No production third-party resources are registered yet.")
        lines.append("")
        return "\n".join(lines)

    lines.extend([
        "This inventory summarizes recorded third-party resources. Full license/notice evidence, when stored in-repository, lives under `legal/licenses/`.",
        "",
    ])

    for entry in sort_entries(entries):
        lines.append(f"## {entry.get('name', entry.get('id', 'Unnamed'))}")
        lines.append("")
        lines.append(f"- ID: `{entry.get('id', '')}`")
        lines.append(f"- Type: `{entry.get('type', 'other')}`")
        lines.append(f"- Creator/provider: {entry.get('creator', 'Unknown')}")
        lines.append(f"- License/terms: {entry.get('licenseName', 'unresolved')}")
        if entry.get("licenseUrl"):
            lines.append(f"- License/terms URL: {entry['licenseUrl']}")
        if entry.get("sourceUrl"):
            lines.append(f"- Source URL: {entry['sourceUrl']}")
        lines.append(f"- Commercial use: {entry.get('commercialUse', 'unclear')}")
        lines.append(f"- Modification: {entry.get('modification', 'unclear')}")
        lines.append(f"- Redistribution: {entry.get('redistribution', 'unclear')}")
        lines.append(f"- AI processing: {entry.get('aiProcessing', 'unclear')}")
        lines.append(f"- Release allowed: {'yes' if entry.get('releaseAllowed') else 'no'}")
        evidence = entry.get("evidence") or []
        if evidence:
            lines.append(f"- Evidence: {', '.join(evidence)}")
        lines.append("")

    return "\n".join(lines)


def check_or_write(path: Path, expected: str, check: bool) -> bool:
    expected = expected.rstrip() + "\n"
    if check:
        actual = path.read_text(encoding="utf-8") if path.exists() else ""
        if actual != expected:
            print(f"ERROR: {path.relative_to(ROOT)} is out of date; run python tools/legal/generate_notices.py", file=sys.stderr)
            return False
        return True
    path.write_text(expected, encoding="utf-8")
    print(f"wrote {path.relative_to(ROOT)}")
    return True


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail if generated files are not up to date")
    args = parser.parse_args()

    entries = load_entries()
    ok = True
    ok &= check_or_write(ATTRIBUTIONS, build_attributions(entries), args.check)
    ok &= check_or_write(NOTICES, build_notices(entries), args.check)
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
