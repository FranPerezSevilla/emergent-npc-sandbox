from pathlib import Path

path = Path('src/main.ts')
text = path.read_text()
old = "  IVEN_PROPAGATED_CLAIM_BELIEF_ID,\n"
if old not in text:
    raise SystemExit('unused M3 import not found')
path.write_text(text.replace(old, '', 1))
