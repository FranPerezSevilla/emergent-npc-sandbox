from pathlib import Path

path = Path('src/main.ts')
text = path.read_text()


def replace_once(old: str, new: str) -> None:
    global text
    if old not in text:
        raise SystemExit(f'expected block not found:\n{old[:300]}')
    text = text.replace(old, new, 1)


replace_once(
    "import { beliefsForNpc, m1Beliefs, redTravelerExitFact } from './ai/world-state.ts';\nimport './starter.css';",
    "import { beliefsForNpc, m1Beliefs, redTravelerExitFact } from './ai/world-state.ts';\nimport { buildSessionExport } from './session-export.ts';\nimport './starter.css';"
)

replace_once(
    '''        <button class="load-model" id="m3-transfer" type="button">Resolve Mara → Iven social event</button>
        <button class="load-model" id="m3-reset-state" type="button">Reset M3 claim + transfer</button>''',
    '''        <button class="load-model" id="m3-transfer" type="button">Resolve Mara → Iven social event</button>
        <button class="load-model" id="m3-reset-state" type="button">Reset M3 claim + transfer</button>
        <button class="load-model" id="export-session" type="button">Export session JSON</button>'''
)

replace_once(
    "const m3ResetState = document.getElementById('m3-reset-state') as HTMLButtonElement;\nconst m2StateOutput = document.getElementById('m2-state-output') as HTMLPreElement;",
    "const m3ResetState = document.getElementById('m3-reset-state') as HTMLButtonElement;\nconst exportSessionButton = document.getElementById('export-session') as HTMLButtonElement;\nconst m2StateOutput = document.getElementById('m2-state-output') as HTMLPreElement;"
)

marker = '''m3ResetState.addEventListener('click', () => {
  m3State = resetM3State(localStorage);
  refreshM3Engines();
  traces.length = 0;
  traceOutput.textContent = 'No inference trace yet.';
  modelStatus.textContent = 'M3 claim and transfer state reset.';
  renderM3State();
});'''

replacement = marker + '''

exportSessionButton.addEventListener('click', () => {
  const exportedAt = new Date().toISOString();
  const payload = buildSessionExport({
    exportedAt,
    provider: {
      providerId: provider.providerId,
      modelId: provider.modelId
    },
    conversations: runtimeNpcs.map((runtime) => ({
      npcId: runtime.profile.id,
      npcName: runtime.profile.name,
      role: runtime.profile.role,
      turns: runtime.turns
    })),
    traces,
    npcContextSnapshots: runtimeNpcs.map((runtime) => ({
      npcId: runtime.profile.id,
      beliefs: beliefsForRuntimeNpc(runtime.profile.id),
      memories: memoriesForNpc(m2State, runtime.profile.id),
      relationship: relationshipForNpc(m2State, runtime.profile.id)
    })),
    state: {
      m1: {
        objectiveTruth: redTravelerExitFact,
        authoredBeliefs: m1Beliefs
      },
      m2: m2State,
      m3: m3State
    }
  });

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `emergent-npc-session-${exportedAt.replace(/[:.]/g, '-')}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
  modelStatus.textContent = 'Session JSON exported. Upload that file to ChatGPT for full-session validation.';
});'''
replace_once(marker, replacement)

path.write_text(text)
