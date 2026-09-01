#!/usr/bin/env python3
"""Validate legal/third-party.json using only the Python standard library."""

from __future__ import annotations

import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REGISTRY = ROOT / "legal" / "third-party.json"

ALLOWED_TYPES = {
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
}
ALLOWED_REVIEW = {"pending", "approved", "blocked", "removed"}
ALLOWED_PERMISSION = {"allowed", "prohibited", "unclear", "not_applicable"}
ALLOWED_REDISTRIBUTION = {"allowed", "restricted", "prohibited", "unclear", "not_applicable"}
ID_RE = re.compile(r"^[a-z0-9]+(?:[._-][a-z0-9]+)*$")

REQUIRED_FIELDS = {
    "id",
    "type",
    "name",
    "creator",
    "sourceUrl",
    "licenseName",
    "reviewStatus",
    "releaseAllowed",
    "attributionRequired",
    "commercialUse",
    "modification",
    "redistribution",
    "aiProcessing",
    "usedIn",
    "notes",
    "evidence",
    "lastReviewed",
}


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def nonempty_string(value: object) -> bool:
    return isinstance(value, str) and bool(value.strip())


def valid_iso_date(value: object) -> bool:
    if not isinstance(value, str):
        return False
    try:
        date.fromisoformat(value)
        return True
    except ValueError:
        return False


def main() -> int:
    errors: list[str] = []

    try:
        data = json.loads(REGISTRY.read_text(encoding="utf-8"))
    except Exception as exc:  # noqa: BLE001 - useful CI error
        print(f"ERROR: cannot read {REGISTRY}: {exc}", file=sys.stderr)
        return 1

    if data.get("schemaVersion") != 1:
        fail(errors, "schemaVersion must be 1")

    entries = data.get("entries")
    if not isinstance(entries, list):
        fail(errors, "entries must be an array")
        entries = []

    seen: set[str] = set()
    for index, entry in enumerate(entries):
        prefix = f"entries[{index}]"
        if not isinstance(entry, dict):
            fail(errors, f"{prefix} must be an object")
            continue

        missing = sorted(REQUIRED_FIELDS - entry.keys())
        if missing:
            fail(errors, f"{prefix} missing required fields: {', '.join(missing)}")

        entry_id = entry.get("id")
        if not nonempty_string(entry_id) or not ID_RE.match(entry_id):
            fail(errors, f"{prefix}.id must be a stable lowercase slug")
        elif entry_id in seen:
            fail(errors, f"duplicate id: {entry_id}")
        else:
            seen.add(entry_id)

        if entry.get("type") not in ALLOWED_TYPES:
            fail(errors, f"{prefix}.type is invalid: {entry.get('type')!r}")

        for field in ("name", "creator", "sourceUrl", "licenseName"):
            if not nonempty_string(entry.get(field)):
                fail(errors, f"{prefix}.{field} must be a non-empty string; use an explicit unresolved value when genuinely pending")

        review = entry.get("reviewStatus")
        if review not in ALLOWED_REVIEW:
            fail(errors, f"{prefix}.reviewStatus is invalid: {review!r}")

        if not isinstance(entry.get("releaseAllowed"), bool):
            fail(errors, f"{prefix}.releaseAllowed must be boolean")
        if not isinstance(entry.get("attributionRequired"), bool):
            fail(errors, f"{prefix}.attributionRequired must be boolean")

        for field in ("commercialUse", "modification", "aiProcessing"):
            if entry.get(field) not in ALLOWED_PERMISSION:
                fail(errors, f"{prefix}.{field} is invalid: {entry.get(field)!r}")

        if entry.get("redistribution") not in ALLOWED_REDISTRIBUTION:
            fail(errors, f"{prefix}.redistribution is invalid: {entry.get('redistribution')!r}")

        for field in ("usedIn", "evidence"):
            value = entry.get(field)
            if not isinstance(value, list) or any(not nonempty_string(v) for v in value):
                fail(errors, f"{prefix}.{field} must be an array of non-empty strings")

        if not isinstance(entry.get("notes"), str):
            fail(errors, f"{prefix}.notes must be a string")

        if not valid_iso_date(entry.get("lastReviewed")):
            fail(errors, f"{prefix}.lastReviewed must be YYYY-MM-DD")

        if entry.get("attributionRequired") is True and not nonempty_string(entry.get("requiredCreditText")):
            fail(errors, f"{prefix}.requiredCreditText is required when attributionRequired is true")

        release_allowed = entry.get("releaseAllowed") is True
        if review in {"pending", "blocked", "removed"} and release_allowed:
            fail(errors, f"{prefix} cannot have releaseAllowed=true while reviewStatus={review}")

        if review == "blocked" and entry.get("releaseAllowed") is not False:
            fail(errors, f"{prefix} blocked resources must have releaseAllowed=false")

        if review == "approved" and release_allowed:
            if entry.get("commercialUse") in {"unclear", "prohibited"}:
                fail(errors, f"{prefix} release-ready resource cannot have commercialUse={entry.get('commercialUse')}")
            if entry.get("redistribution") == "unclear":
                fail(errors, f"{prefix} release-ready resource cannot have redistribution=unclear")
            if entry.get("aiProcessing") == "unclear":
                fail(errors, f"{prefix} release-ready resource cannot have aiProcessing=unclear; use not_applicable if the workflow does not process it with AI")

    if errors:
        print("Third-party registry validation FAILED:", file=sys.stderr)
        for error in errors:
            print(f" - {error}", file=sys.stderr)
        return 1

    print(f"Third-party registry OK: {len(entries)} entr{'y' if len(entries) == 1 else 'ies'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
