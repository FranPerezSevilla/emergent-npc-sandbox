from pathlib import Path

path = Path('src/main.ts')
text = path.read_text()
old = "appendMessage('You', '[You give Mara three silver coins to help cover the baker's overdue debt.]');"
new = 'appendMessage(\'You\', "[You give Mara three silver coins to help cover the baker\'s overdue debt.]");'
if old not in text:
    raise SystemExit('expected broken M2 action line not found')
path.write_text(text.replace(old, new, 1))
