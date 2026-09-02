from pathlib import Path

path = Path('src/main.ts')
text = path.read_text()


def replace_once(old: str, new: str) -> None:
    global text
    if old not in text:
        raise SystemExit(f'expected block not found:\n{old[:240]}')
    text = text.replace(old, new, 1)


replace_once(
    "import { runM0Benchmark } from './ai/m0-benchmark.ts';\nimport { M1FakeInferenceProvider } from './ai/m1-fake-inference-provider.ts';\nimport { maraProfile } from './ai/mara.ts';",
    "import { runM0Benchmark } from './ai/m0-benchmark.ts';\nimport { M2FakeInferenceProvider } from './ai/m2-fake-inference-provider.ts';\nimport { maraProfile } from './ai/mara.ts';\nimport {\n  MARA_BAKER_DEBT_MEMORY_ID,\n  applyMaraBakerDebtHelp,\n  loadM2State,\n  memoriesForNpc,\n  relationshipForNpc,\n  resetM2State,\n  saveM2State,\n  selectRelevantMemories\n} from './ai/memory-state.ts';"
)
replace_once(
    "const provider: InferenceProvider = useFakeProvider ? new M1FakeInferenceProvider() : openRouterProvider!;",
    "const provider: InferenceProvider = useFakeProvider ? new M2FakeInferenceProvider() : openRouterProvider!;"
)
replace_once(
    "const traces: ConversationTrace[] = [];\nconst providerReady = useFakeProvider || openRouterProvider?.isSignedIn() === true;",
    "const traces: ConversationTrace[] = [];\nconst providerReady = useFakeProvider || openRouterProvider?.isSignedIn() === true;\nlet m2State = loadM2State(localStorage);"
)
replace_once(
    "(window as unknown as { __npcTraces: ConversationTrace[] }).__npcTraces = traces;\n(window as unknown as { __m1TruthBeliefs: unknown }).__m1TruthBeliefs = {",
    "(window as unknown as { __npcTraces: ConversationTrace[] }).__npcTraces = traces;\n(window as unknown as { __m2State: unknown }).__m2State = m2State;\n(window as unknown as { __m1TruthBeliefs: unknown }).__m1TruthBeliefs = {"
)

old_panel = '''      <h1>Emergent NPC Sandbox — M1</h1>
      <p>Click the scene for mouse look. Move with WASD. Approach Mara or Iven and press E.</p>
      <p>Ask both NPCs whether the red-cloaked traveler left after midnight. Game code owns objective truth; each NPC receives only their own belief.</p>
      <div class="provider-row">
        <span class="provider-badge" id="provider-badge"></span>
        <button class="load-model" id="load-model" type="button">Connect OpenRouter</button>
      </div>
      <div class="model-status" id="model-status"></div>
      <details class="debug-panel">
        <summary>Debug / M1 truth vs belief</summary>
        <p>Objective truth is visible here for the human tester but is never supplied to either NPC prompt.</p>
        <pre id="m1-state-output"></pre>
        <p>Last trace below. All traces remain available as <code>window.__npcTraces</code>.</p>
        <pre id="trace-output">No inference trace yet.</pre>
        <details>
          <summary>M0 regression probes</summary>
          <button id="run-benchmark" type="button">Run fixed M0 probe set against Mara</button>
          <pre id="benchmark-output"></pre>
        </details>
      </details>'''
new_panel = '''      <h1>Emergent NPC Sandbox — M2</h1>
      <p>Click the scene for mouse look. Move with WASD. Approach Mara or Iven and press E.</p>
      <p>M2 test: talk to Mara, use the explicit three-silver action, close or reload the page, then ask «¿Te acuerdas de lo que hice por ti antes?».</p>
      <div class="provider-row">
        <span class="provider-badge" id="provider-badge"></span>
        <button class="load-model" id="load-model" type="button">Connect OpenRouter</button>
      </div>
      <div class="model-status" id="model-status"></div>
      <details class="debug-panel">
        <summary>Debug / M2 memory &amp; relationship</summary>
        <p>Only structured memory/relationship state persists. Raw dialogue turns are deliberately not saved.</p>
        <pre id="m2-state-output"></pre>
        <button class="load-model" id="m2-reset-state" type="button">Reset M2 memory + relationship</button>
        <p>Last trace below. All traces remain available as <code>window.__npcTraces</code>.</p>
        <pre id="trace-output">No inference trace yet.</pre>
        <details>
          <summary>M1 regression / truth vs belief</summary>
          <p>Objective truth remains visible here for the tester and is never supplied as NPC truth.</p>
          <pre id="m1-state-output"></pre>
        </details>
        <details>
          <summary>M0 regression probes</summary>
          <button id="run-benchmark" type="button">Run fixed M0 probe set against Mara</button>
          <pre id="benchmark-output"></pre>
        </details>
      </details>'''
replace_once(old_panel, new_panel)

replace_once(
    '''      <div class="transcript" id="transcript" aria-live="polite"></div>
      <form class="dialogue-form" id="dialogue-form">''',
    '''      <div class="transcript" id="transcript" aria-live="polite"></div>
      <button class="load-model" id="m2-help-mara" type="button" hidden>Give Mara 3 silver for baker debt</button>
      <form class="dialogue-form" id="dialogue-form">'''
)
replace_once(
    "const npcState = document.getElementById('npc-state') as HTMLSpanElement;\nconst m1StateOutput = document.getElementById('m1-state-output') as HTMLPreElement;",
    "const npcState = document.getElementById('npc-state') as HTMLSpanElement;\nconst m2StateOutput = document.getElementById('m2-state-output') as HTMLPreElement;\nconst m2HelpMara = document.getElementById('m2-help-mara') as HTMLButtonElement;\nconst m2ResetState = document.getElementById('m2-reset-state') as HTMLButtonElement;\nconst m1StateOutput = document.getElementById('m1-state-output') as HTMLPreElement;"
)
replace_once(
    "  ? 'FAKE M1 — deterministic contradictory testimony'",
    "  ? 'FAKE M2 — deterministic memory + relationship fixture'"
)
replace_once(
    "  ? 'Deterministic M1 fake mode enabled by ?provider=fake.'",
    "  ? 'Deterministic M2 fake mode enabled by ?provider=fake.'"
)

state_block = '''m1StateOutput.textContent = JSON.stringify(
  {
    objectiveTruth: redTravelerExitFact,
    beliefs: m1Beliefs
  },
  null,
  2
);'''
state_replacement = state_block + '''

const updateM2Action = (): void => {
  const talkingToMara = activeNpc?.profile.id === 'mara';
  const alreadyRecorded = m2State.memories.some((memory) => memory.id === MARA_BAKER_DEBT_MEMORY_ID);
  m2HelpMara.hidden = !talkingToMara;
  m2HelpMara.disabled = alreadyRecorded;
  m2HelpMara.textContent = alreadyRecorded
    ? 'M2 memory already recorded'
    : 'Give Mara 3 silver for baker debt';
};

const renderM2State = (): void => {
  m2StateOutput.textContent = JSON.stringify(
    {
      memories: m2State.memories,
      relationships: m2State.relationships
    },
    null,
    2
  );
  (window as unknown as { __m2State: unknown }).__m2State = m2State;
  updateM2Action();
};

renderM2State();'''
replace_once(state_block, state_replacement)

replace_once(
    "  renderTranscript(activeNpc);\n  dialogueInput.focus();",
    "  renderTranscript(activeNpc);\n  updateM2Action();\n  dialogueInput.focus();"
)

marker = '''loadModel.addEventListener('click', () => {
  void connectRemoteProvider().catch(() => undefined);
});'''
listeners = marker + '''

m2HelpMara.addEventListener('click', () => {
  if (activeNpc?.profile.id !== 'mara') return;
  const previousState = m2State;
  m2State = applyMaraBakerDebtHelp(m2State, new Date().toISOString());
  if (m2State !== previousState) {
    saveM2State(localStorage, m2State);
    appendMessage('You', '[You give Mara three silver coins to help cover the baker\'s overdue debt.]');
    appendMessage('System', 'M2 memory recorded. Close the conversation or reload the page, then ask Mara whether she remembers what you did for her.');
    modelStatus.textContent = 'M2 structured memory recorded · Mara trust is now +1.';
  }
  renderM2State();
  dialogueInput.focus();
});

m2ResetState.addEventListener('click', () => {
  m2State = resetM2State(localStorage);
  for (const runtime of runtimeNpcs) runtime.turns.length = 0;
  traces.length = 0;
  traceOutput.textContent = 'No inference trace yet.';
  modelStatus.textContent = 'M2 structured memory and relationship state reset.';
  if (activeNpc) renderTranscript(activeNpc);
  renderM2State();
});'''
replace_once(marker, listeners)

replace_once(
    "  setConversationBusy(true);\n\n  try {\n    const result = await runtime.engine.respond(playerUtterance, runtime.turns);",
    "  setConversationBusy(true);\n\n  const socialContext = {\n    memories: selectRelevantMemories(memoriesForNpc(m2State, runtime.profile.id), playerUtterance),\n    relationship: relationshipForNpc(m2State, runtime.profile.id)\n  };\n\n  try {\n    const result = await runtime.engine.respond(playerUtterance, runtime.turns, socialContext);"
)
replace_once("console.debug('M1 ConversationTrace', result.trace);", "console.debug('M2 ConversationTrace', result.trace);")
replace_once(
    "console.error('M1 conversation orchestration failed before a validated response could be produced', error);",
    "console.error('M2 conversation orchestration failed before a validated response could be produced', error);"
)

path.write_text(text)
