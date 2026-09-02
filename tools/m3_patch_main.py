from pathlib import Path

path = Path('src/main.ts')
text = path.read_text()


def replace_once(old: str, new: str) -> None:
    global text
    if old not in text:
        raise SystemExit(f'expected block not found:\n{old[:300]}')
    text = text.replace(old, new, 1)


replace_once(
    "import { runM0Benchmark } from './ai/m0-benchmark.ts';\nimport { M2FakeInferenceProvider } from './ai/m2-fake-inference-provider.ts';\nimport { maraProfile } from './ai/mara.ts';",
    "import { runM0Benchmark } from './ai/m0-benchmark.ts';\nimport { M3FakeInferenceProvider } from './ai/m3-fake-inference-provider.ts';\nimport { maraProfile } from './ai/mara.ts';"
)
replace_once(
    "import { NpcConversationEngine } from './ai/npc-conversation-engine.ts';\nimport type { ConversationTurn, NpcProfile } from './ai/npc-types.ts';",
    "import { NpcConversationEngine } from './ai/npc-conversation-engine.ts';\nimport type { ConversationTurn, NpcProfile } from './ai/npc-types.ts';\nimport {\n  IVEN_PROPAGATED_CLAIM_BELIEF_ID,\n  MARA_TO_IVEN_TRANSFER_ID,\n  PLAYER_RED_TRAVELER_EXIT_CLAIM_ID,\n  loadM3State,\n  propagatedBeliefsForNpc,\n  recordPlayerRedTravelerClaimToMara,\n  resetM3State,\n  saveM3State,\n  transferPlayerClaimFromMaraToIven\n} from './ai/propagation-state.ts';"
)
replace_once(
    "const provider: InferenceProvider = useFakeProvider ? new M2FakeInferenceProvider() : openRouterProvider!;\nconst maraEngine = new NpcConversationEngine(provider, maraProfile, beliefsForNpc('mara'));\nconst ivenEngine = new NpcConversationEngine(provider, ivenProfile, beliefsForNpc('iven'));\nconst traces: ConversationTrace[] = [];\nconst providerReady = useFakeProvider || openRouterProvider?.isSignedIn() === true;\nlet m2State = loadM2State(localStorage);",
    "let m3State = loadM3State(localStorage);\nconst provider: InferenceProvider = useFakeProvider ? new M3FakeInferenceProvider() : openRouterProvider!;\nconst beliefsForRuntimeNpc = (npcId: string) => [\n  ...beliefsForNpc(npcId),\n  ...propagatedBeliefsForNpc(m3State, npcId)\n];\nlet maraEngine = new NpcConversationEngine(provider, maraProfile, beliefsForRuntimeNpc('mara'));\nlet ivenEngine = new NpcConversationEngine(provider, ivenProfile, beliefsForRuntimeNpc('iven'));\nconst traces: ConversationTrace[] = [];\nconst providerReady = useFakeProvider || openRouterProvider?.isSignedIn() === true;\nlet m2State = loadM2State(localStorage);"
)
replace_once(
    "(window as unknown as { __npcTraces: ConversationTrace[] }).__npcTraces = traces;\n(window as unknown as { __m2State: unknown }).__m2State = m2State;",
    "(window as unknown as { __npcTraces: ConversationTrace[] }).__npcTraces = traces;\n(window as unknown as { __m3State: unknown }).__m3State = m3State;\n(window as unknown as { __m2State: unknown }).__m2State = m2State;"
)

old_header = '''      <h1>Emergent NPC Sandbox — M2</h1>
      <p>Click the scene for mouse look. Move with WASD. Approach Mara or Iven and press E.</p>
      <p>M2 test: talk to Mara, use the explicit three-silver action, close or reload the page, then ask «¿Te acuerdas de lo que hice por ti antes?».</p>'''
new_header = '''      <h1>Emergent NPC Sandbox — M3</h1>
      <p>Click the scene for mouse look. Move with WASD. Approach Mara or Iven and press E.</p>
      <p>M3 test: explicitly tell Mara you saw the red-cloaked traveler leave, resolve the Mara → Iven social event in Debug, then ask Iven what he thinks happened.</p>'''
replace_once(old_header, new_header)

old_debug = '''      <details class="debug-panel">
        <summary>Debug / M2 memory &amp; relationship</summary>
        <p>Only structured memory/relationship state persists. Raw dialogue turns are deliberately not saved.</p>
        <pre id="m2-state-output"></pre>
        <button class="load-model" id="m2-reset-state" type="button">Reset M2 memory + relationship</button>
        <p>Last trace below. All traces remain available as <code>window.__npcTraces</code>.</p>
        <pre id="trace-output">No inference trace yet.</pre>
        <details>
          <summary>M1 regression / truth vs belief</summary>'''
new_debug = '''      <details class="debug-panel">
        <summary>Debug / M3 information propagation</summary>
        <p>Claim creation and transfer are explicit game-owned transitions. Generated dialogue cannot grant Iven the rumor.</p>
        <pre id="m3-state-output"></pre>
        <button class="load-model" id="m3-transfer" type="button">Resolve Mara → Iven social event</button>
        <button class="load-model" id="m3-reset-state" type="button">Reset M3 claim + transfer</button>
        <p>Last trace below. All traces remain available as <code>window.__npcTraces</code>.</p>
        <pre id="trace-output">No inference trace yet.</pre>
        <details>
          <summary>M2 regression / memory &amp; relationship</summary>
          <p>Only structured memory/relationship state persists. Raw dialogue turns are deliberately not saved.</p>
          <pre id="m2-state-output"></pre>
          <button class="load-model" id="m2-reset-state" type="button">Reset M2 memory + relationship</button>
        </details>
        <details>
          <summary>M1 regression / truth vs belief</summary>'''
replace_once(old_debug, new_debug)

replace_once(
    '''      <div class="transcript" id="transcript" aria-live="polite"></div>
      <button class="load-model" id="m2-help-mara" type="button" hidden>Give Mara 3 silver for baker debt</button>''',
    '''      <div class="transcript" id="transcript" aria-live="polite"></div>
      <button class="load-model" id="m3-tell-mara" type="button" hidden>Tell Mara: I saw the red-cloaked traveler leave</button>
      <button class="load-model" id="m2-help-mara" type="button" hidden>Give Mara 3 silver for baker debt</button>'''
)
replace_once(
    "const npcState = document.getElementById('npc-state') as HTMLSpanElement;\nconst m2StateOutput = document.getElementById('m2-state-output') as HTMLPreElement;",
    "const npcState = document.getElementById('npc-state') as HTMLSpanElement;\nconst m3StateOutput = document.getElementById('m3-state-output') as HTMLPreElement;\nconst m3TellMara = document.getElementById('m3-tell-mara') as HTMLButtonElement;\nconst m3Transfer = document.getElementById('m3-transfer') as HTMLButtonElement;\nconst m3ResetState = document.getElementById('m3-reset-state') as HTMLButtonElement;\nconst m2StateOutput = document.getElementById('m2-state-output') as HTMLPreElement;"
)
replace_once(
    "  ? 'FAKE M2 — deterministic memory + relationship fixture'",
    "  ? 'FAKE M3 — deterministic information propagation fixture'"
)
replace_once(
    "  ? 'Deterministic M2 fake mode enabled by ?provider=fake.'",
    "  ? 'Deterministic M3 fake mode enabled by ?provider=fake.'"
)

anchor = '''const updateM2Action = (): void => {
  const talkingToMara = activeNpc?.profile.id === 'mara';'''
insert = '''const refreshM3Engines = (): void => {
  maraEngine = new NpcConversationEngine(provider, maraProfile, beliefsForRuntimeNpc('mara'));
  ivenEngine = new NpcConversationEngine(provider, ivenProfile, beliefsForRuntimeNpc('iven'));
  const maraRuntime = runtimeNpcs.find((runtime) => runtime.profile.id === 'mara');
  const ivenRuntime = runtimeNpcs.find((runtime) => runtime.profile.id === 'iven');
  if (maraRuntime) maraRuntime.engine = maraEngine;
  if (ivenRuntime) ivenRuntime.engine = ivenEngine;
};

const updateM3Actions = (): void => {
  const hasClaim = m3State.claims.some((claim) => claim.id === PLAYER_RED_TRAVELER_EXIT_CLAIM_ID);
  const hasTransfer = m3State.transfers.some((transfer) => transfer.id === MARA_TO_IVEN_TRANSFER_ID);
  m3TellMara.hidden = activeNpc?.profile.id !== 'mara';
  m3TellMara.disabled = hasClaim;
  m3TellMara.textContent = hasClaim
    ? 'M3 claim already recorded'
    : 'Tell Mara: I saw the red-cloaked traveler leave';
  m3Transfer.disabled = !hasClaim || hasTransfer;
  m3Transfer.textContent = hasTransfer
    ? 'Mara → Iven rumor already transferred'
    : 'Resolve Mara → Iven social event';
};

const renderM3State = (): void => {
  m3StateOutput.textContent = JSON.stringify(
    {
      claims: m3State.claims,
      transfers: m3State.transfers,
      derivedBeliefs: {
        mara: propagatedBeliefsForNpc(m3State, 'mara'),
        iven: propagatedBeliefsForNpc(m3State, 'iven')
      }
    },
    null,
    2
  );
  (window as unknown as { __m3State: unknown }).__m3State = m3State;
  updateM3Actions();
};

renderM3State();

const updateM2Action = (): void => {
  const talkingToMara = activeNpc?.profile.id === 'mara';'''
replace_once(anchor, insert)

replace_once(
    "  renderTranscript(activeNpc);\n  updateM2Action();\n  dialogueInput.focus();",
    "  renderTranscript(activeNpc);\n  updateM3Actions();\n  updateM2Action();\n  dialogueInput.focus();"
)

marker = '''m2HelpMara.addEventListener('click', () => {'''
listeners = '''m3TellMara.addEventListener('click', () => {
  if (activeNpc?.profile.id !== 'mara') return;
  const previousState = m3State;
  m3State = recordPlayerRedTravelerClaimToMara(m3State, new Date().toISOString());
  if (m3State !== previousState) {
    saveM3State(localStorage, m3State);
    refreshM3Engines();
    appendMessage('You', "[You tell Mara that you personally saw the red-cloaked traveler leave through the back door after midnight.]");
    appendMessage('System', 'M3 claim recorded with source=player and recipient=Mara. Now resolve the Mara → Iven social event in Debug.');
    modelStatus.textContent = 'M3 structured claim recorded for Mara.';
  }
  renderM3State();
  dialogueInput.focus();
});

m3Transfer.addEventListener('click', () => {
  const previousState = m3State;
  m3State = transferPlayerClaimFromMaraToIven(m3State, new Date().toISOString());
  if (m3State !== previousState) {
    saveM3State(localStorage, m3State);
    refreshM3Engines();
    modelStatus.textContent = 'M3 social event resolved: Mara relayed the player claim to Iven as hearsay.';
  }
  renderM3State();
});

m3ResetState.addEventListener('click', () => {
  m3State = resetM3State(localStorage);
  refreshM3Engines();
  traces.length = 0;
  traceOutput.textContent = 'No inference trace yet.';
  modelStatus.textContent = 'M3 claim and transfer state reset.';
  renderM3State();
});

m2HelpMara.addEventListener('click', () => {'''
replace_once(marker, listeners)

replace_once("console.debug('M2 ConversationTrace', result.trace);", "console.debug('M3 ConversationTrace', result.trace);")
replace_once(
    "console.error('M2 conversation orchestration failed before a validated response could be produced', error);",
    "console.error('M3 conversation orchestration failed before a validated response could be produced', error);"
)

path.write_text(text)
