import {
  AppBase,
  AppOptions,
  CameraComponentSystem,
  Color,
  Entity,
  FILLMODE_FILL_WINDOW,
  LightComponentSystem,
  RenderComponentSystem,
  RESOLUTION_AUTO,
  StandardMaterial,
  createGraphicsDevice
} from 'playcanvas';

import type { ConversationTrace } from './ai/conversation-trace.ts';
import type { InferenceProvider } from './ai/inference.ts';
import { ivenProfile } from './ai/iven.ts';
import { runM0Benchmark } from './ai/m0-benchmark.ts';
import { M1FakeInferenceProvider } from './ai/m1-fake-inference-provider.ts';
import { maraProfile } from './ai/mara.ts';
import { NpcConversationEngine } from './ai/npc-conversation-engine.ts';
import type { ConversationTurn, NpcProfile } from './ai/npc-types.ts';
import {
  M1_OPENROUTER_MODEL_ID,
  OpenRouterInferenceProvider
} from './ai/openrouter-inference-provider.ts';
import { beliefsForNpc, m1Beliefs, redTravelerExitFact } from './ai/world-state.ts';
import './starter.css';

const canvas = document.getElementById('application-canvas') as HTMLCanvasElement;
const device = await createGraphicsDevice(canvas);
const options = new AppOptions();
options.graphicsDevice = device;
options.componentSystems = [RenderComponentSystem, CameraComponentSystem, LightComponentSystem];

const app = new AppBase(canvas);
app.init(options);
app.start();
app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
app.setCanvasResolution(RESOLUTION_AUTO);
app.scene.ambientLight = new Color(0.12, 0.11, 0.15);

const providerMode = new URLSearchParams(window.location.search).get('provider') ?? 'remote';
const useFakeProvider = providerMode === 'fake';
const openRouterProvider = useFakeProvider ? undefined : new OpenRouterInferenceProvider();
let authCallbackError: string | undefined;

if (openRouterProvider) {
  try {
    await openRouterProvider.completeAuthCallback();
  } catch (error) {
    authCallbackError = error instanceof Error ? error.message : String(error);
  }
}

const provider: InferenceProvider = useFakeProvider ? new M1FakeInferenceProvider() : openRouterProvider!;
const maraEngine = new NpcConversationEngine(provider, maraProfile, beliefsForNpc('mara'));
const ivenEngine = new NpcConversationEngine(provider, ivenProfile, beliefsForNpc('iven'));
const traces: ConversationTrace[] = [];
let providerReady = useFakeProvider || openRouterProvider?.isSignedIn() === true;

(window as unknown as { __npcTraces: ConversationTrace[] }).__npcTraces = traces;
(window as unknown as { __m1TruthBeliefs: unknown }).__m1TruthBeliefs = {
  objectiveTruth: redTravelerExitFact,
  beliefs: m1Beliefs
};

document.body.insertAdjacentHTML(
  'beforeend',
  `<div class="hud">
    <section class="bootstrap-panel">
      <h1>Emergent NPC Sandbox — M1</h1>
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
      </details>
    </section>
    <div class="crosshair" id="crosshair" aria-hidden="true"></div>
    <div class="interact-prompt" id="interact-prompt"></div>
    <section class="dialogue-panel" id="dialogue-panel" hidden aria-label="NPC conversation">
      <div class="dialogue-header">
        <div>
          <strong id="npc-name">NPC</strong>
          <span class="npc-state" id="npc-state">neutral · none</span>
        </div>
        <button class="dialogue-close" id="dialogue-close" type="button" aria-label="Close conversation">×</button>
      </div>
      <div class="transcript" id="transcript" aria-live="polite"></div>
      <form class="dialogue-form" id="dialogue-form">
        <input id="dialogue-input" autocomplete="off" maxlength="500" placeholder="Say anything…" aria-label="Message to NPC" />
        <button id="dialogue-send" type="submit">Send</button>
      </form>
    </section>
  </div>`
);

const makeMaterial = (diffuse: Color, emissiveScale = 0.1): StandardMaterial => {
  const material = new StandardMaterial();
  material.diffuse = diffuse;
  material.emissive = new Color(
    diffuse.r * emissiveScale,
    diffuse.g * emissiveScale,
    diffuse.b * emissiveScale
  );
  material.update();
  return material;
};

const stone = makeMaterial(new Color(0.23, 0.24, 0.27));
const darkStone = makeMaterial(new Color(0.12, 0.13, 0.16));
const wood = makeMaterial(new Color(0.27, 0.17, 0.12));
const maraCloth = makeMaterial(new Color(0.34, 0.18, 0.42), 0.22);
const ivenCloth = makeMaterial(new Color(0.18, 0.28, 0.36), 0.2);
const npcSkin = makeMaterial(new Color(0.57, 0.47, 0.43), 0.12);

const addBlock = (
  name: string,
  position: [number, number, number],
  scale: [number, number, number],
  material: StandardMaterial,
  euler: [number, number, number] = [0, 0, 0]
): Entity => {
  const entity = new Entity(name);
  entity.setPosition(...position);
  entity.setLocalScale(...scale);
  entity.setEulerAngles(...euler);
  entity.addComponent('render', { type: 'box', material });
  app.root.addChild(entity);
  return entity;
};

const addNpc = (
  profile: NpcProfile,
  position: [number, number, number],
  material: StandardMaterial
): Entity => {
  const entity = new Entity(profile.id);
  entity.setPosition(...position);
  entity.addComponent('render', { type: 'capsule', material });
  app.root.addChild(entity);

  const head = new Entity(`${profile.id}-head`);
  head.setLocalPosition(0, 1.15, 0);
  head.setLocalScale(0.7, 0.85, 0.72);
  head.addComponent('render', { type: 'sphere', material: npcSkin });
  entity.addChild(head);
  return entity;
};

addBlock('ground', [0, -0.15, 0], [18, 0.3, 18], darkStone);
addBlock('left-building', [-6.2, 2.2, -2.5], [3.6, 4.4, 7], stone, [0, 0, -2]);
addBlock('right-building', [6.1, 2.7, -3.3], [3.7, 5.4, 6.2], stone, [0, 0, 2.5]);
addBlock('back-building', [0.3, 2.3, -8.2], [8.8, 4.6, 2.2], stone, [0, 2, 0]);
addBlock('tavern-door', [0, 1.2, -7], [1.5, 2.4, 0.24], wood);
addBlock('crate-left', [-3.3, 0.55, 1.4], [1.1, 1.1, 1.1], wood, [0, 12, 0]);
addBlock('crate-right', [3.6, 0.35, -0.2], [1.4, 0.7, 1], wood, [0, -10, 0]);

const maraEntity = addNpc(maraProfile, [-1.5, 1.05, -3.4], maraCloth);
const ivenEntity = addNpc(ivenProfile, [2.4, 1.05, -2.9], ivenCloth);

const player = new Entity('player');
player.setPosition(0, 1.65, 5.5);
app.root.addChild(player);

const camera = new Entity('camera');
camera.addComponent('camera', { clearColor: new Color(0.065, 0.075, 0.11), fov: 76 });
player.addChild(camera);

type RuntimeNpc = {
  profile: NpcProfile;
  entity: Entity;
  engine: NpcConversationEngine;
  turns: ConversationTurn[];
  intro: string;
};

const runtimeNpcs: RuntimeNpc[] = [
  {
    profile: maraProfile,
    entity: maraEntity,
    engine: maraEngine,
    turns: [],
    intro: 'Mara looks up as you approach.'
  },
  {
    profile: ivenProfile,
    entity: ivenEntity,
    engine: ivenEngine,
    turns: [],
    intro: 'Iven pauses his patrol and gives you a measured look.'
  }
];

const key = new Set<string>();
let yaw = 0;
let pitch = 0;
let dialogueOpen = false;
let interactableNpc: RuntimeNpc | undefined;
let activeNpc: RuntimeNpc | undefined;

const interactPrompt = document.getElementById('interact-prompt') as HTMLDivElement;
const crosshair = document.getElementById('crosshair') as HTMLDivElement;
const dialoguePanel = document.getElementById('dialogue-panel') as HTMLElement;
const dialogueClose = document.getElementById('dialogue-close') as HTMLButtonElement;
const dialogueForm = document.getElementById('dialogue-form') as HTMLFormElement;
const dialogueInput = document.getElementById('dialogue-input') as HTMLInputElement;
const dialogueSend = document.getElementById('dialogue-send') as HTMLButtonElement;
const transcript = document.getElementById('transcript') as HTMLDivElement;
const providerBadge = document.getElementById('provider-badge') as HTMLSpanElement;
const loadModel = document.getElementById('load-model') as HTMLButtonElement;
const modelStatus = document.getElementById('model-status') as HTMLDivElement;
const npcName = document.getElementById('npc-name') as HTMLElement;
const npcState = document.getElementById('npc-state') as HTMLSpanElement;
const m1StateOutput = document.getElementById('m1-state-output') as HTMLPreElement;
const traceOutput = document.getElementById('trace-output') as HTMLPreElement;
const benchmarkButton = document.getElementById('run-benchmark') as HTMLButtonElement;
const benchmarkOutput = document.getElementById('benchmark-output') as HTMLPreElement;

providerBadge.textContent = useFakeProvider
  ? 'FAKE M1 — deterministic contradictory testimony'
  : `REMOTE AI — OpenRouter / ${M1_OPENROUTER_MODEL_ID}`;
modelStatus.textContent = useFakeProvider
  ? 'Deterministic M1 fake mode enabled by ?provider=fake.'
  : authCallbackError
    ? `OpenRouter connection failed: ${authCallbackError}`
    : providerReady
      ? 'OpenRouter connected for this browser session.'
      : 'Connect OpenRouter. Authorization uses browser OAuth PKCE; no API key is embedded in this app.';
loadModel.hidden = useFakeProvider;
loadModel.textContent = providerReady ? 'OpenRouter connected' : 'Connect OpenRouter';
m1StateOutput.textContent = JSON.stringify(
  {
    objectiveTruth: redTravelerExitFact,
    beliefs: m1Beliefs
  },
  null,
  2
);

const appendMessage = (speaker: string, text: string): void => {
  const line = document.createElement('div');
  line.className = 'message';
  const label = document.createElement('strong');
  label.textContent = `${speaker}: `;
  const content = document.createElement('span');
  content.textContent = text;
  line.append(label, content);
  transcript.appendChild(line);
  transcript.scrollTop = transcript.scrollHeight;
};

const renderTranscript = (runtime: RuntimeNpc): void => {
  transcript.replaceChildren();
  appendMessage(runtime.profile.name, runtime.intro);
  for (const turn of runtime.turns) {
    appendMessage(turn.speaker === 'player' ? 'You' : runtime.profile.name, turn.text);
  }
};

const setConversationBusy = (busy: boolean): void => {
  dialogueInput.disabled = busy;
  dialogueSend.disabled = busy;
  loadModel.disabled = busy || providerReady;
  benchmarkButton.disabled = busy || !providerReady;
};

const connectRemoteProvider = async (): Promise<void> => {
  if (providerReady || !openRouterProvider) return;

  setConversationBusy(true);
  modelStatus.textContent = 'Redirecting to OpenRouter authorization…';
  try {
    await openRouterProvider.signIn();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    modelStatus.textContent = `OpenRouter connection failed: ${message}`;
    throw error;
  } finally {
    setConversationBusy(false);
  }
};

const interactionLabel = (runtime: RuntimeNpc | undefined): string =>
  runtime ? `E — Talk to ${runtime.profile.name}` : '';

const closeDialogue = (): void => {
  dialogueOpen = false;
  activeNpc = undefined;
  dialoguePanel.hidden = true;
  crosshair.hidden = false;
  interactPrompt.textContent = interactionLabel(interactableNpc);
};

const openDialogue = (): void => {
  if (!interactableNpc || dialogueOpen) return;
  activeNpc = interactableNpc;
  dialogueOpen = true;
  dialoguePanel.hidden = false;
  dialoguePanel.setAttribute('aria-label', `Conversation with ${activeNpc.profile.name}`);
  npcName.textContent = `${activeNpc.profile.name} — ${activeNpc.profile.role}`;
  npcState.textContent = 'neutral · none';
  crosshair.hidden = true;
  interactPrompt.textContent = '';
  document.exitPointerLock();
  renderTranscript(activeNpc);
  dialogueInput.focus();
};

loadModel.addEventListener('click', () => {
  void connectRemoteProvider().catch(() => undefined);
});

benchmarkButton.addEventListener('click', async () => {
  benchmarkOutput.textContent = '';
  try {
    if (!providerReady) {
      modelStatus.textContent = 'Connect OpenRouter before running the M0 regression probes.';
      return;
    }
    setConversationBusy(true);
    const records = await runM0Benchmark(maraEngine, (completed, total, probe) => {
      modelStatus.textContent = `M0 regression ${completed}/${total}: ${probe.id}`;
    });
    benchmarkOutput.textContent = JSON.stringify(records, null, 2);
    modelStatus.textContent = `M0 regression complete: ${records.length} probes.`;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    benchmarkOutput.textContent = `Benchmark stopped: ${message}`;
  } finally {
    setConversationBusy(false);
  }
});

window.addEventListener('keydown', (event) => {
  if (event.code === 'Escape' && dialogueOpen) {
    closeDialogue();
    return;
  }

  key.add(event.code);
  if (event.code === 'KeyE' && interactableNpc && !dialogueOpen) {
    event.preventDefault();
    openDialogue();
  }
});

window.addEventListener('keyup', (event) => key.delete(event.code));

canvas.addEventListener('click', () => {
  if (!dialogueOpen) void canvas.requestPointerLock();
});

document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement !== canvas || dialogueOpen) return;
  yaw -= event.movementX * 0.12;
  pitch = Math.max(-75, Math.min(75, pitch - event.movementY * 0.1));
  player.setEulerAngles(0, yaw, 0);
  camera.setLocalEulerAngles(pitch, 0, 0);
});

dialogueClose.addEventListener('click', closeDialogue);

dialogueForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const playerUtterance = dialogueInput.value.trim();
  if (!playerUtterance || !activeNpc) return;

  if (!providerReady) {
    modelStatus.textContent = `Connect OpenRouter before talking to ${activeNpc.profile.name}.`;
    loadModel.focus();
    return;
  }

  const runtime = activeNpc;
  appendMessage('You', playerUtterance);
  dialogueInput.value = '';
  setConversationBusy(true);

  try {
    const result = await runtime.engine.respond(playerUtterance, runtime.turns);
    traces.push(result.trace);
    traceOutput.textContent = JSON.stringify(result.trace, null, 2);
    console.debug('M1 ConversationTrace', result.trace);

    const providerFailure = result.trace.attempts.find((attempt) => attempt.providerError !== undefined);
    if (providerFailure?.providerError) {
      const message = `Remote AI unavailable: ${providerFailure.providerError}`;
      modelStatus.textContent = message;
      appendMessage('System', message);
      return;
    }

    appendMessage(runtime.profile.name, result.response.dialogue);
    npcState.textContent = `${result.response.emotion} · ${result.response.gesture}`;
    runtime.turns.push(
      { speaker: 'player', text: playerUtterance },
      { speaker: 'npc', text: result.response.dialogue }
    );
    modelStatus.textContent = `OpenRouter connected · last response ${result.trace.totalLatencyMs} ms.`;
  } catch (error) {
    console.error('M1 conversation orchestration failed before a validated response could be produced', error);
    const message = error instanceof Error ? error.message : String(error);
    modelStatus.textContent = `Conversation system error: ${message}`;
    appendMessage('System', 'Conversation failed before a validated NPC response could be produced.');
  } finally {
    setConversationBusy(false);
    dialogueInput.focus();
  }
});

app.on('update', (dt: number) => {
  if (!dialogueOpen) {
    let forward = 0;
    let strafe = 0;
    if (key.has('KeyW')) forward += 1;
    if (key.has('KeyS')) forward -= 1;
    if (key.has('KeyD')) strafe += 1;
    if (key.has('KeyA')) strafe -= 1;

    if (forward !== 0 || strafe !== 0) {
      const length = Math.hypot(forward, strafe);
      forward /= length;
      strafe /= length;
      const radians = (yaw * Math.PI) / 180;
      const forwardX = -Math.sin(radians);
      const forwardZ = -Math.cos(radians);
      const rightX = Math.cos(radians);
      const rightZ = -Math.sin(radians);
      const speed = 4.2;
      const current = player.getPosition();
      const nextX = Math.max(
        -7.7,
        Math.min(7.7, current.x + (forwardX * forward + rightX * strafe) * speed * dt)
      );
      const nextZ = Math.max(
        -7.7,
        Math.min(7.7, current.z + (forwardZ * forward + rightZ * strafe) * speed * dt)
      );
      player.setPosition(nextX, 1.65, nextZ);
    }
  }

  const playerPosition = player.getPosition();
  const radians = (yaw * Math.PI) / 180;
  const lookX = -Math.sin(radians);
  const lookZ = -Math.cos(radians);
  let nearest: RuntimeNpc | undefined;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const runtime of runtimeNpcs) {
    const npcPosition = runtime.entity.getPosition();
    const dx = npcPosition.x - playerPosition.x;
    const dz = npcPosition.z - playerPosition.z;
    const distance = Math.hypot(dx, dz);
    const facing = distance > 0.001 ? (lookX * dx + lookZ * dz) / distance : 1;
    if (distance < 3.1 && facing > 0.35 && distance < nearestDistance) {
      nearest = runtime;
      nearestDistance = distance;
    }
  }

  interactableNpc = nearest;
  if (!dialogueOpen) {
    interactPrompt.textContent = interactionLabel(interactableNpc);
  }
});

const moonLight = new Entity('moon-light');
moonLight.addComponent('light', {
  type: 'directional',
  intensity: 1.8,
  castShadows: true,
  color: new Color(0.6, 0.68, 0.9)
});
moonLight.setEulerAngles(48, 28, 0);
app.root.addChild(moonLight);

const tavernLight = new Entity('tavern-light');
tavernLight.setPosition(0, 2.1, -5.8);
tavernLight.addComponent('light', {
  type: 'omni',
  intensity: 1.7,
  range: 7,
  color: new Color(1, 0.57, 0.28)
});
app.root.addChild(tavernLight);

setConversationBusy(false);

window.addEventListener('resize', () => app.resizeCanvas());