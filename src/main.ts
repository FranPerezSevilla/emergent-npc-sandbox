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

import { FakeInferenceProvider } from './ai/fake-inference-provider.ts';
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

document.body.insertAdjacentHTML(
  'beforeend',
  `<div class="hud">
    <section class="bootstrap-panel">
      <h1>Emergent NPC Sandbox — Bootstrap</h1>
      <p>Click the scene for mouse look. Move with WASD. Approach Mara and press E.</p>
      <p>This milestone intentionally uses a deterministic fake NPC response.</p>
      <span class="provider-badge">FAKE INFERENCE PROVIDER</span>
    </section>
    <div class="crosshair" id="crosshair" aria-hidden="true"></div>
    <div class="interact-prompt" id="interact-prompt"></div>
    <section class="dialogue-panel" id="dialogue-panel" hidden aria-label="Conversation with Mara">
      <div class="dialogue-header">
        <strong>Mara — placeholder NPC</strong>
        <button class="dialogue-close" id="dialogue-close" type="button" aria-label="Close conversation">×</button>
      </div>
      <div class="transcript" id="transcript" aria-live="polite"></div>
      <form class="dialogue-form" id="dialogue-form">
        <input id="dialogue-input" autocomplete="off" maxlength="500" placeholder="Say anything…" aria-label="Message to Mara" />
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
const npcCloth = makeMaterial(new Color(0.34, 0.18, 0.42), 0.22);
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

addBlock('ground', [0, -0.15, 0], [18, 0.3, 18], darkStone);
addBlock('left-building', [-6.2, 2.2, -2.5], [3.6, 4.4, 7], stone, [0, 0, -2]);
addBlock('right-building', [6.1, 2.7, -3.3], [3.7, 5.4, 6.2], stone, [0, 0, 2.5]);
addBlock('back-building', [0.3, 2.3, -8.2], [8.8, 4.6, 2.2], stone, [0, 2, 0]);
addBlock('tavern-door', [0, 1.2, -7], [1.5, 2.4, 0.24], wood);
addBlock('crate-left', [-3.3, 0.55, 1.4], [1.1, 1.1, 1.1], wood, [0, 12, 0]);
addBlock('crate-right', [3.6, 0.35, -0.2], [1.4, 0.7, 1], wood, [0, -10, 0]);

const npc = new Entity('mara-placeholder');
npc.setPosition(0, 1.05, -3.4);
npc.addComponent('render', { type: 'capsule', material: npcCloth });
app.root.addChild(npc);

const npcHead = new Entity('mara-head');
npcHead.setLocalPosition(0, 1.15, 0);
npcHead.setLocalScale(0.7, 0.85, 0.72);
npcHead.addComponent('render', { type: 'sphere', material: npcSkin });
npc.addChild(npcHead);

const player = new Entity('player');
player.setPosition(0, 1.65, 5.5);
app.root.addChild(player);

const camera = new Entity('camera');
camera.addComponent('camera', { clearColor: new Color(0.065, 0.075, 0.11), fov: 76 });
player.addChild(camera);

const key = new Set<string>();
let yaw = 0;
let pitch = 0;
let dialogueOpen = false;
let canInteract = false;

const interactPrompt = document.getElementById('interact-prompt') as HTMLDivElement;
const crosshair = document.getElementById('crosshair') as HTMLDivElement;
const dialoguePanel = document.getElementById('dialogue-panel') as HTMLElement;
const dialogueClose = document.getElementById('dialogue-close') as HTMLButtonElement;
const dialogueForm = document.getElementById('dialogue-form') as HTMLFormElement;
const dialogueInput = document.getElementById('dialogue-input') as HTMLInputElement;
const dialogueSend = document.getElementById('dialogue-send') as HTMLButtonElement;
const transcript = document.getElementById('transcript') as HTMLDivElement;
const inferenceProvider = new FakeInferenceProvider();

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

const closeDialogue = (): void => {
  dialogueOpen = false;
  dialoguePanel.hidden = true;
  crosshair.hidden = false;
  interactPrompt.textContent = canInteract ? 'E — Talk to Mara' : '';
};

const openDialogue = (): void => {
  if (!canInteract || dialogueOpen) return;
  dialogueOpen = true;
  dialoguePanel.hidden = false;
  crosshair.hidden = true;
  interactPrompt.textContent = '';
  document.exitPointerLock();
  if (transcript.childElementCount === 0) {
    appendMessage('Mara', 'Mara looks up as you approach.');
  }
  dialogueInput.focus();
};

window.addEventListener('keydown', (event) => {
  if (event.code === 'Escape' && dialogueOpen) {
    closeDialogue();
    return;
  }

  key.add(event.code);
  if (event.code === 'KeyE' && canInteract && !dialogueOpen) {
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
  if (!playerUtterance) return;

  appendMessage('You', playerUtterance);
  dialogueInput.value = '';
  dialogueInput.disabled = true;
  dialogueSend.disabled = true;

  try {
    const response = await inferenceProvider.generate({
      npcId: 'mara-placeholder',
      playerUtterance
    });
    appendMessage('Mara', response.dialogue);
  } catch (error) {
    console.error('Fake inference failed', error);
    appendMessage('System', 'The Bootstrap fake provider failed. Check the browser console.');
  } finally {
    dialogueInput.disabled = false;
    dialogueSend.disabled = false;
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
      const nextX = Math.max(-7.7, Math.min(7.7, current.x + (forwardX * forward + rightX * strafe) * speed * dt));
      const nextZ = Math.max(-7.7, Math.min(7.7, current.z + (forwardZ * forward + rightZ * strafe) * speed * dt));
      player.setPosition(nextX, 1.65, nextZ);
    }
  }

  const playerPosition = player.getPosition();
  const npcPosition = npc.getPosition();
  const dx = npcPosition.x - playerPosition.x;
  const dz = npcPosition.z - playerPosition.z;
  const distance = Math.hypot(dx, dz);
  const radians = (yaw * Math.PI) / 180;
  const lookX = -Math.sin(radians);
  const lookZ = -Math.cos(radians);
  const facing = distance > 0.001 ? (lookX * dx + lookZ * dz) / distance : 1;
  canInteract = distance < 3.1 && facing > 0.35;

  if (!dialogueOpen) {
    interactPrompt.textContent = canInteract ? 'E — Talk to Mara' : '';
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

window.addEventListener('resize', () => app.resizeCanvas());
