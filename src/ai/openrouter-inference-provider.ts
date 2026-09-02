import type {
  InferenceProvider,
  InferenceProviderRequest,
  InferenceProviderResult
} from './inference.ts';

export const M1_OPENROUTER_MODEL_ID = 'minimax/minimax-m3:free';

const apiKeyStorageKey = 'emergent-npc-sandbox.openrouter.api-key';
const verifierStorageKey = 'emergent-npc-sandbox.openrouter.pkce-verifier';
const authEndpoint = 'https://openrouter.ai/auth';
const exchangeEndpoint = 'https://openrouter.ai/api/v1/auth/keys';
const chatEndpoint = 'https://openrouter.ai/api/v1/chat/completions';

const base64Url = (bytes: Uint8Array): string => {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const sha256Challenge = async (verifier: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64Url(new Uint8Array(digest));
};

const generateVerifier = (): string => {
  const random = new Uint8Array(32);
  crypto.getRandomValues(random);
  return base64Url(random);
};

const callbackUrl = (): string => `${window.location.origin}${window.location.pathname}`;

const removeAuthCodeFromUrl = (): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete('code');
  window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
};

const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const body = (await response.json()) as {
      error?: { message?: unknown; code?: unknown } | string;
      message?: unknown;
    };
    const nestedMessage =
      typeof body.error === 'object' && body.error !== null && typeof body.error.message === 'string'
        ? body.error.message
        : undefined;
    const code =
      typeof body.error === 'object' && body.error !== null && typeof body.error.code === 'string'
        ? body.error.code
        : undefined;
    const message =
      nestedMessage ??
      (typeof body.error === 'string' ? body.error : undefined) ??
      (typeof body.message === 'string' ? body.message : undefined) ??
      response.statusText;
    return code ? `${code}: ${message}` : message;
  } catch {
    return response.statusText || `HTTP ${response.status}`;
  }
};

export class OpenRouterInferenceProvider implements InferenceProvider {
  readonly providerId = 'openrouter';
  readonly modelId = M1_OPENROUTER_MODEL_ID;

  isSignedIn(): boolean {
    return sessionStorage.getItem(apiKeyStorageKey)?.startsWith('sk-or-') === true;
  }

  async completeAuthCallback(): Promise<boolean> {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) return false;

    const verifier = sessionStorage.getItem(verifierStorageKey);
    if (!verifier) {
      removeAuthCodeFromUrl();
      throw new Error('OpenRouter authorization returned without the local PKCE verifier. Start Connect again.');
    }

    const response = await fetch(exchangeEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        code_verifier: verifier,
        code_challenge_method: 'S256'
      })
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response);
      removeAuthCodeFromUrl();
      throw new Error(`OpenRouter authorization failed (${response.status}): ${message}`);
    }

    const body = (await response.json()) as { key?: unknown };
    if (typeof body.key !== 'string' || !body.key.startsWith('sk-or-')) {
      removeAuthCodeFromUrl();
      throw new Error('OpenRouter authorization did not return a usable API key.');
    }

    sessionStorage.setItem(apiKeyStorageKey, body.key);
    sessionStorage.removeItem(verifierStorageKey);
    removeAuthCodeFromUrl();
    return true;
  }

  async signIn(): Promise<void> {
    if (this.isSignedIn()) return;

    const verifier = generateVerifier();
    sessionStorage.setItem(verifierStorageKey, verifier);
    const challenge = await sha256Challenge(verifier);
    const url = new URL(authEndpoint);
    url.searchParams.set('callback_url', callbackUrl());
    url.searchParams.set('code_challenge', challenge);
    url.searchParams.set('code_challenge_method', 'S256');
    window.location.assign(url.toString());
  }

  async generate(request: InferenceProviderRequest): Promise<InferenceProviderResult> {
    const apiKey = sessionStorage.getItem(apiKeyStorageKey);
    if (!apiKey) throw new Error('OpenRouter authentication is required before generating dialogue.');

    const startedAt = performance.now();
    const response = await fetch(chatEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Emergent NPC Sandbox'
      },
      body: JSON.stringify({
        model: this.modelId,
        messages: request.messages,
        max_tokens: request.maxTokens,
        response_format: { type: 'json_object' },
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter request failed (${response.status}): ${await parseErrorMessage(response)}`);
    }

    const body = (await response.json()) as {
      model?: unknown;
      choices?: { message?: { content?: unknown } }[];
    };
    const content = body.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || content.trim().length === 0) {
      throw new Error('OpenRouter returned an empty or non-text response.');
    }

    return {
      text: content,
      providerId: this.providerId,
      modelId: typeof body.model === 'string' ? body.model : this.modelId,
      latencyMs: Math.round(performance.now() - startedAt)
    };
  }
}
