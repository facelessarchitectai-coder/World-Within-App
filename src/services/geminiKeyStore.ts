import { auth } from './firebase';
import firebaseConfig from '../../firebase-applet-config.json';
import { AnswerReviewFeedback, ReviewAnswerParams } from './answerReview';
import { SystemAnalysisResult } from './gemini';

// In-memory key holder (session memory)
let activeApiKey: string | null = null;
let activeUid: string | null = null;
let activeIsValidated = false;

type KeyInvalidatedListener = (reason?: string) => void;
const invalidationListeners: Set<KeyInvalidatedListener> = new Set();

export function onKeyInvalidated(listener: KeyInvalidatedListener) {
  invalidationListeners.add(listener);
  return () => {
    invalidationListeners.delete(listener);
  };
}

export function notifyKeyInvalidated(reason?: string) {
  activeIsValidated = false;
  invalidationListeners.forEach((listener) => {
    try {
      listener(reason);
    } catch (e) {
      console.error('Error notifying key invalidation listener:', e);
    }
  });
}

/**
 * Checks if a key matches the app's shared Firebase configuration key.
 */
export function isSharedFirebaseKey(key: string): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  return trimmed === firebaseConfig.apiKey || trimmed === 'AIzaSyAaWjVnHjYN2qtSInlgX6y8xXgngzzbym0';
}

/**
 * Initializes the in-memory key from sessionStorage for the given user.
 */
export function initSessionKeyForUser(uid: string): string | null {
  activeUid = uid;
  try {
    const stored = sessionStorage.getItem(`ww_gemini_key_${uid}`);
    if (stored && !isSharedFirebaseKey(stored)) {
      activeApiKey = stored;
      return stored;
    }
  } catch (e) {
    // Session storage unavailable
  }
  activeApiKey = null;
  activeIsValidated = false;
  return null;
}

/**
 * Gets the current in-memory Gemini API key.
 */
export function getActiveGeminiKey(): string | null {
  return activeApiKey;
}

/**
 * Checks if key is currently validated in memory.
 */
export function isGeminiKeyValidated(): boolean {
  return activeIsValidated && Boolean(activeApiKey);
}

/**
 * Sets the active in-memory Gemini key and caches in sessionStorage for this user session.
 */
export function setActiveGeminiKey(uid: string, key: string, validated: boolean = false) {
  activeUid = uid;
  activeApiKey = key.trim();
  activeIsValidated = validated;

  try {
    sessionStorage.setItem(`ww_gemini_key_${uid}`, activeApiKey);
  } catch (e) {
    // Ignore session storage error
  }
}

/**
 * Clears the active Gemini key from memory and sessionStorage.
 */
export function clearActiveGeminiKey(uid?: string) {
  const targetUid = uid || activeUid;
  activeApiKey = null;
  activeIsValidated = false;
  activeUid = null;

  if (targetUid) {
    try {
      sessionStorage.removeItem(`ww_gemini_key_${targetUid}`);
    } catch (e) {
      // Ignore
    }
  }
}

/**
 * Gets the current user's fresh Firebase ID token.
 */
export async function getFirebaseIdToken(): Promise<string> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('UNAUTHORIZED: No active Google sign-in session found.');
  }
  return await currentUser.getIdToken();
}

/**
 * Validates a Gemini API key with the backend endpoint.
 */
export async function validateGeminiKeyWithServer(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  const trimmed = apiKey.trim();

  // 1. Client-side guard against shared Firebase key
  if (isSharedFirebaseKey(trimmed)) {
    return {
      valid: false,
      error: 'The shared Firebase configuration key cannot be used as a Gemini API key. Please supply your own personal Gemini API key created in Google AI Studio (https://aistudio.google.com/apikey).',
    };
  }

  if (trimmed.length < 20 || !trimmed.startsWith('AIza')) {
    return {
      valid: false,
      error: 'Invalid Gemini API key format. Gemini API keys begin with "AIza" and can be obtained at https://aistudio.google.com/apikey.',
    };
  }

  // 2. Obtain fresh Firebase ID token
  let token: string;
  try {
    token = await getFirebaseIdToken();
  } catch (e: any) {
    return {
      valid: false,
      error: e?.message || 'Authentication session is invalid. Please sign in with Google again.',
    };
  }

  // 3. Call backend endpoint
  try {
    const res = await fetch('/api/validate-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-gemini-api-key': trimmed,
      },
      body: JSON.stringify({ apiKey: trimmed }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        valid: false,
        error: data.error || `Validation failed (HTTP ${res.status}). Please check your key.`,
      };
    }

    if (data.valid) {
      if (auth.currentUser?.uid) {
        setActiveGeminiKey(auth.currentUser.uid, trimmed, true);
      }
      return { valid: true };
    }

    return {
      valid: false,
      error: data.error || 'Gemini key validation was unsuccessful.',
    };
  } catch (err: any) {
    return {
      valid: false,
      error: `Network error reaching validation service: ${err?.message || 'Please check your connection and retry.'}`,
    };
  }
}

/**
 * Sends an answer review request to the backend.
 */
export async function reviewAnswerWithBackend(params: ReviewAnswerParams): Promise<AnswerReviewFeedback> {
  const token = await getFirebaseIdToken();
  const apiKey = getActiveGeminiKey();

  if (!apiKey) {
    notifyKeyInvalidated('No Gemini API key is configured. Please enter your key.');
    throw new Error('NO_KEY: Missing customer Gemini API key.');
  }

  const res = await fetch('/api/review-answer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-gemini-api-key': apiKey,
    },
    body: JSON.stringify(params),
  });

  if (res.status === 401) {
    throw new Error('UNAUTHORIZED: Your session has expired. Please sign in again.');
  }

  if (res.status === 403) {
    const errData = await res.json().catch(() => ({}));
    notifyKeyInvalidated(errData.error || 'Your Gemini API key was rejected by Google.');
    throw new Error(errData.error || 'INVALID_KEY: Your Gemini API key is invalid or unauthorized.');
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Review request failed with status ${res.status}`);
  }

  return (await res.json()) as AnswerReviewFeedback;
}

/**
 * Sends a system analysis request to the backend.
 */
export async function analyzeSystemWithBackend(input: string, contextDescription?: string): Promise<SystemAnalysisResult> {
  const token = await getFirebaseIdToken();
  const apiKey = getActiveGeminiKey();

  if (!apiKey) {
    notifyKeyInvalidated('No Gemini API key is configured. Please enter your key.');
    throw new Error('NO_KEY: Missing customer Gemini API key.');
  }

  const res = await fetch('/api/analyze-system', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-gemini-api-key': apiKey,
    },
    body: JSON.stringify({ input, contextDescription }),
  });

  if (res.status === 401) {
    throw new Error('UNAUTHORIZED: Your session has expired. Please sign in again.');
  }

  if (res.status === 403) {
    const errData = await res.json().catch(() => ({}));
    notifyKeyInvalidated(errData.error || 'Your Gemini API key was rejected by Google.');
    throw new Error(errData.error || 'INVALID_KEY: Your Gemini API key is invalid or unauthorized.');
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `System analysis failed with status ${res.status}`);
  }

  return (await res.json()) as SystemAnalysisResult;
}
