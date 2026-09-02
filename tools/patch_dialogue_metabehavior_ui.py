from pathlib import Path

main_path = Path('src/main.ts')
css_path = Path('src/starter.css')
main = main_path.read_text()
css = css_path.read_text()


def replace_once(text: str, old: str, new: str) -> str:
    if old not in text:
        raise SystemExit(f'expected block not found:\n{old[:400]}')
    return text.replace(old, new, 1)


main = replace_once(
    main,
    "import type { ConversationTrace } from './ai/conversation-trace.ts';\nimport type { InferenceProvider } from './ai/inference.ts';",
    "import type { ConversationTrace } from './ai/conversation-trace.ts';\nimport type { DialogueIntent, DialogueIntentRequest } from './ai/dialogue-metabehavior.ts';\nimport type { InferenceProvider } from './ai/inference.ts';"
)

main = replace_once(
    main,
    '''      <button class="load-model" id="m2-help-mara" type="button" hidden>Give Mara 3 silver for baker debt</button>
      <form class="dialogue-form" id="dialogue-form">''',
    '''      <button class="load-model" id="m2-help-mara" type="button" hidden>Give Mara 3 silver for baker debt</button>
      <div class="dialogue-intents" id="dialogue-intents" aria-label="Quick dialogue intents">
        <button class="dialogue-chip" type="button" data-dialogue-intent="ask_observation">¿Qué viste?</button>
        <button class="dialogue-chip" type="button" data-dialogue-intent="ask_rumor">¿Qué se rumorea?</button>
        <button class="dialogue-chip" type="button" data-dialogue-intent="ask_source">¿Quién te lo contó?</button>
        <button class="dialogue-chip" type="button" data-dialogue-intent="challenge">No te creo</button>
      </div>
      <form class="dialogue-form" id="dialogue-form">'''
)

main = replace_once(
    main,
    "const dialogueSend = document.getElementById('dialogue-send') as HTMLButtonElement;\nconst transcript = document.getElementById('transcript') as HTMLDivElement;",
    "const dialogueSend = document.getElementById('dialogue-send') as HTMLButtonElement;\nconst dialogueIntentButtons = Array.from(\n  document.querySelectorAll<HTMLButtonElement>('[data-dialogue-intent]')\n);\nconst transcript = document.getElementById('transcript') as HTMLDivElement;"
)

main = replace_once(
    main,
    '''const setConversationBusy = (busy: boolean): void => {
  dialogueInput.disabled = busy;
  dialogueSend.disabled = busy;
  loadModel.disabled = busy || providerReady;
  benchmarkButton.disabled = busy || !providerReady;
};''',
    '''const setConversationBusy = (busy: boolean): void => {
  dialogueInput.disabled = busy;
  dialogueSend.disabled = busy;
  for (const button of dialogueIntentButtons) button.disabled = busy;
  loadModel.disabled = busy || providerReady;
  benchmarkButton.disabled = busy || !providerReady;
};'''
)

old_submit = '''dialogueClose.addEventListener('click', closeDialogue);

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

  const socialContext = {
    memories: selectRelevantMemories(memoriesForNpc(m2State, runtime.profile.id), playerUtterance),
    relationship: relationshipForNpc(m2State, runtime.profile.id)
  };

  try {
    const result = await runtime.engine.respond(playerUtterance, runtime.turns, socialContext);
    traces.push(result.trace);
    traceOutput.textContent = JSON.stringify(result.trace, null, 2);
    console.debug('M3 ConversationTrace', result.trace);

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
    console.error('M3 conversation orchestration failed before a validated response could be produced', error);
    const message = error instanceof Error ? error.message : String(error);
    modelStatus.textContent = `Conversation system error: ${message}`;
    appendMessage('System', 'Conversation failed before a validated NPC response could be produced.');
  } finally {
    setConversationBusy(false);
    dialogueInput.focus();
  }
});'''

new_submit = '''dialogueClose.addEventListener('click', closeDialogue);

const quickIntentUtterances: Record<Exclude<DialogueIntent, 'free_text'>, string> = {
  ask_observation: '¿Qué viste exactamente sobre el viajero de la capa roja?',
  ask_rumor: '¿Qué has oído decir sobre el viajero de la capa roja?',
  ask_source: '¿Quién te contó eso sobre el viajero de la capa roja?',
  challenge: 'No te creo. Creo que te equivocas sobre el viajero de la capa roja.'
};

const submitDialogueTurn = async (
  playerUtterance: string,
  dialogueIntent: DialogueIntentRequest
): Promise<void> => {
  if (!playerUtterance || !activeNpc) return;

  if (!providerReady) {
    modelStatus.textContent = `Connect OpenRouter before talking to ${activeNpc.profile.name}.`;
    loadModel.focus();
    return;
  }

  const runtime = activeNpc;
  appendMessage('You', playerUtterance);
  if (dialogueIntent.intent === 'free_text') dialogueInput.value = '';
  setConversationBusy(true);

  const socialContext = {
    memories: selectRelevantMemories(memoriesForNpc(m2State, runtime.profile.id), playerUtterance),
    relationship: relationshipForNpc(m2State, runtime.profile.id)
  };

  try {
    const result = await runtime.engine.respond(
      playerUtterance,
      runtime.turns,
      socialContext,
      dialogueIntent
    );
    traces.push(result.trace);
    traceOutput.textContent = JSON.stringify(result.trace, null, 2);
    console.debug('M3 ConversationTrace', result.trace);

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
    const decision = result.trace.socialDialogueDecision;
    modelStatus.textContent = `OpenRouter connected · ${decision.intent} · ${decision.focus}/${decision.stance} · ${result.trace.totalLatencyMs} ms.`;
  } catch (error) {
    console.error('M3 conversation orchestration failed before a validated response could be produced', error);
    const message = error instanceof Error ? error.message : String(error);
    modelStatus.textContent = `Conversation system error: ${message}`;
    appendMessage('System', 'Conversation failed before a validated NPC response could be produced.');
  } finally {
    setConversationBusy(false);
    dialogueInput.focus();
  }
};

for (const button of dialogueIntentButtons) {
  button.addEventListener('click', () => {
    const intent = button.dataset.dialogueIntent as Exclude<DialogueIntent, 'free_text'> | undefined;
    if (!intent || !(intent in quickIntentUtterances)) return;
    void submitDialogueTurn(quickIntentUtterances[intent], {
      intent,
      topicFactId: redTravelerExitFact.id
    });
  });
}

dialogueForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const playerUtterance = dialogueInput.value.trim();
  if (!playerUtterance) return;
  void submitDialogueTurn(playerUtterance, { intent: 'free_text' });
});'''

main = replace_once(main, old_submit, new_submit)

css_addition = '''
.dialogue-intents {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 2px 0 10px;
}

.dialogue-chip {
  padding: 6px 9px;
  border: 1px solid #ffffff24;
  border-radius: 999px;
  background: #191722;
  color: #d9cfea;
  cursor: pointer;
  font-size: 11px;
}

.dialogue-chip:hover {
  border-color: #b78cff77;
  background: #262033;
}

.dialogue-chip:disabled {
  cursor: wait;
  opacity: 0.5;
}

'''
css = replace_once(css, '\n@media (max-width: 620px) {', '\n' + css_addition + '@media (max-width: 620px) {')

main_path.write_text(main)
css_path.write_text(css)
