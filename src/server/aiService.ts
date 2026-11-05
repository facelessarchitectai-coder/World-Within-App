import { GoogleGenAI } from '@google/genai';

export const FIREBASE_PROJECT_ID = 'gen-lang-client-0315983382';
export const SHARED_FIREBASE_API_KEY = 'AIzaSyAaWjVnHjYN2qtSInlgX6y8xXgngzzbym0';

export interface VerifiedUser {
  uid: string;
  email?: string;
}

export type IssueCategory =
  | 'missing_required'
  | 'unclear_explanation'
  | 'contradiction'
  | 'optional_opportunity'
  | 'ready';

export interface AnswerReviewFeedback {
  meetsRequirements: boolean;
  issueCategory: IssueCategory;
  whatNeedsAttention: string;
  directionToExplore: string;
  questionToHelpRevise: string;
  resolvedNotes?: string;
  readyToMoveForwardExplanation?: string;
}

export interface ReviewAnswerParams {
  question: string;
  purposeAndRequirements?: string;
  currentAnswer: string;
  previousAnswer?: string;
  earlierAnswersContext?: string;
  phaseTitle?: string;
}

const REVIEW_SYSTEM_INSTRUCTION = `You are the World Within Method™ answer reviewer.
Your job is to help users recognize and correct gaps in their own answers WITHOUT writing the answers for them.

Use the existing World Within Method, the current question's purpose, and its actual requirements as the review criteria. Do NOT invent additional requirements.

For each answer:
1. Identify whether it addresses the question and includes the information needed for that step.
2. If something is missing, vague, off-topic, or inconsistent, explain the specific issue in plain language.
3. Give a direction for improving it: what to consider, clarify, connect, distinguish, or make more specific.
4. Ask ONE focused follow-up question at a time so the user can develop their own answer.
5. If reviewing a revision where a previous answer was provided, recognize what they resolved from their previous response, and explain only what still needs attention.

STRICT PROHIBITIONS (DO NOT):
- DO NOT supply a finished answer, rewrite their response, or fill in missing details for them.
- DO NOT choose their identity, voice, visual direction, world, values, or creative decisions.
- DO NOT provide a sample answer they can copy as their own.
- DO NOT treat an unusual creative choice as incorrect simply because it differs from common examples.
- DO NOT demand longer answers when a short answer already meets the requirements.
- DO NOT keep finding new problems after an answer meets the step's requirements.

DISTINGUISH BETWEEN ISSUE CATEGORIES:
- "missing_required": A missing required element that the step explicitly asks for.
- "unclear_explanation": The user provided an idea, but the explanation is too vague, ambiguous, or lacks specific detail to be operable.
- "contradiction": The answer contradicts itself or previous established answers and needs clarification.
- "optional_opportunity": An optional opportunity to explore further (not blocking, but worth thinking about).
- "ready": The answer meets all requirements.

When an answer differs from an earlier response, ask whether their thinking has changed before treating it as a mistake. If the method does not establish one correct answer, do not pretend that it does.

Keep feedback brief, supportive, and specific to what the user actually wrote. Avoid vague instructions such as "go deeper" without explaining what needs further thought.

FEEDBACK STRUCTURE REQUIREMENTS:
If a revision is needed:
- "whatNeedsAttention": Explain the specific gap or issue in plain language.
- "directionToExplore": Explain where to focus their thinking without supplying the answer.
- "questionToHelpRevise": Ask ONE targeted question to help them address the gap.

If the answer meets all requirements:
- "meetsRequirements": true
- "issueCategory": "ready"
- "readyToMoveForwardExplanation": Clearly acknowledge that the answer meets the requirements and explain briefly why it is ready to move forward.
- "whatNeedsAttention": ""
- "directionToExplore": ""
- "questionToHelpRevise": ""

Always respond in strictly valid JSON format conforming to the requested schema.`;

/**
 * Verifies the incoming Firebase ID token using Google's public tokeninfo endpoint.
 * Derives the genuine, verified UID without trusting client claims.
 */
export async function verifyFirebaseToken(authHeader: string | undefined): Promise<VerifiedUser> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('UNAUTHORIZED: Missing or invalid Authorization header. Expected Bearer token.');
  }

  const idToken = authHeader.substring(7).trim();
  if (!idToken) {
    throw new Error('UNAUTHORIZED: Empty authentication token.');
  }

  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
    if (!res.ok) {
      const errText = await res.text();
      console.error('Token validation failed from Google tokeninfo:', errText);
      throw new Error('UNAUTHORIZED: Invalid or expired Firebase authentication token.');
    }

    const data = await res.json() as any;

    // Verify audience matches this app's Firebase project
    if (data.aud !== FIREBASE_PROJECT_ID) {
      console.error(`Token audience mismatch: got ${data.aud}, expected ${FIREBASE_PROJECT_ID}`);
      throw new Error('UNAUTHORIZED: Token audience does not match application project.');
    }

    // Verify issuer is securetoken
    if (data.iss && !data.iss.includes('securetoken.google.com')) {
      throw new Error('UNAUTHORIZED: Invalid token issuer.');
    }

    const uid = data.user_id || data.sub;
    if (!uid) {
      throw new Error('UNAUTHORIZED: Unable to determine user ID from token.');
    }

    return {
      uid,
      email: data.email,
    };
  } catch (err: any) {
    if (err.message && err.message.startsWith('UNAUTHORIZED:')) {
      throw err;
    }
    throw new Error(`UNAUTHORIZED: Authentication verification error: ${err?.message || 'Unknown'}`);
  }
}

/**
 * Validates that customer key is provided, formatted properly,
 * and explicitly NOT the shared Firebase app configuration key.
 */
export function validateCustomerKey(apiKey: string | undefined): string {
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
    throw new Error('BAD_REQUEST: Customer Gemini API key is missing. A customer-supplied key is mandatory.');
  }

  const cleanKey = apiKey.trim();

  // Explicit check: reject shared Firebase key
  if (cleanKey === SHARED_FIREBASE_API_KEY) {
    throw new Error(
      'BAD_REQUEST: The shared Firebase configuration key cannot be used as a Gemini API key. ' +
      'Please supply your own personal Gemini API key created in Google AI Studio (https://aistudio.google.com/apikey).'
    );
  }

  if (cleanKey.length < 20 || !cleanKey.startsWith('AIza')) {
    throw new Error(
      'BAD_REQUEST: Invalid Gemini API key format. Gemini API keys begin with "AIza" and are obtained from Google AI Studio (https://aistudio.google.com/apikey).'
    );
  }

  return cleanKey;
}

/**
 * Performs a live verification of the customer's Gemini API key by making
 * a minimal generateContent ping against the Gemini API.
 */
export async function testGeminiApiKey(apiKey: string): Promise<boolean> {
  const cleanKey = validateCustomerKey(apiKey);

  const ai = new GoogleGenAI({ apiKey: cleanKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Ping test',
      config: {
        maxOutputTokens: 2,
      },
    });

    if (!response) {
      throw new Error('Empty response received from Gemini API.');
    }

    return true;
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
      throw new Error('INVALID_KEY: The supplied Gemini API key was rejected by Google as invalid. Please check the key in Google AI Studio.');
    }
    if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('Quota exceeded')) {
      throw new Error('QUOTA_EXHAUSTED: Gemini API quota exceeded for your project key.');
    }
    if (msg.includes('PERMISSION_DENIED')) {
      throw new Error('PERMISSION_DENIED: Gemini API permission denied for your key. Ensure the Generative Language API is enabled in your Google Cloud / AI Studio project.');
    }
    throw new Error(`VALIDATION_FAILED: Failed to validate Gemini key with Google: ${msg}`);
  }
}

/**
 * Executes an answer review request using the customer's verified Gemini API key.
 */
export async function executeReviewAnswer(
  params: ReviewAnswerParams,
  apiKey: string
): Promise<AnswerReviewFeedback> {
  const cleanKey = validateCustomerKey(apiKey);
  const trimmed = (params.currentAnswer || '').trim();

  if (!trimmed) {
    return {
      meetsRequirements: false,
      issueCategory: 'missing_required',
      whatNeedsAttention: `No answer has been entered yet for "${params.question}". This step requires your own definition to anchor this part of your system.`,
      directionToExplore: 'Consider what distinct choice or boundary you want to establish here based on the purpose of this step.',
      questionToHelpRevise: `What is the first concrete decision you want to commit to for "${params.question}"?`,
    };
  }

  const prompt = `Review the following answer for the World Within Method step:
Phase/Context: ${params.phaseTitle || 'World Within Method Protocol'}
Question / Parameter: "${params.question}"
Purpose & Requirements: "${params.purposeAndRequirements || 'Define clear, distinct parameters according to the World Within Method.'}"

Current User Answer:
"""${trimmed}"""

${params.previousAnswer && params.previousAnswer.trim() !== trimmed ? `Previous Version of Answer:\n"""${params.previousAnswer.trim()}"""\n(Note: This is a revised answer. Acknowledge what was improved or resolved in "resolvedNotes".)` : ''}

${params.earlierAnswersContext ? `Earlier Established System Context:\n"""${params.earlierAnswersContext}"""` : ''}

Respond with a JSON object with this exact structure:
{
  "meetsRequirements": boolean,
  "issueCategory": "missing_required" | "unclear_explanation" | "contradiction" | "optional_opportunity" | "ready",
  "whatNeedsAttention": "string",
  "directionToExplore": "string",
  "questionToHelpRevise": "string",
  "resolvedNotes": "string (optional, only if revision resolved a previous issue)",
  "readyToMoveForwardExplanation": "string (required if meetsRequirements is true)"
}`;

  const ai = new GoogleGenAI({ apiKey: cleanKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: REVIEW_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const meetsRequirements = Boolean(parsed.meetsRequirements);
    const issueCategory: IssueCategory = parsed.issueCategory || (meetsRequirements ? 'ready' : 'unclear_explanation');

    if (meetsRequirements) {
      return {
        meetsRequirements: true,
        issueCategory: 'ready',
        whatNeedsAttention: '',
        directionToExplore: '',
        questionToHelpRevise: '',
        resolvedNotes: parsed.resolvedNotes || (params.previousAnswer ? 'Addressed previous feedback successfully.' : undefined),
        readyToMoveForwardExplanation:
          parsed.readyToMoveForwardExplanation ||
          `Your answer directly addresses "${params.question}" with clear, distinct choices that satisfy this step's requirements. You are ready to move forward.`,
      };
    }

    return {
      meetsRequirements: false,
      issueCategory,
      whatNeedsAttention: parsed.whatNeedsAttention || `This response needs a clearer distinction to satisfy "${params.question}".`,
      directionToExplore: parsed.directionToExplore || 'Consider how this choice sets a firm rule rather than a general feeling.',
      questionToHelpRevise: parsed.questionToHelpRevise || 'How would you make this specific to your world?',
      resolvedNotes: parsed.resolvedNotes || undefined,
    };
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
      throw new Error('INVALID_KEY: Your Gemini API key is invalid or has been revoked in Google AI Studio.');
    }
    console.error('Gemini execution error:', err);
    throw new Error(`AI_ERROR: ${msg}`);
  }
}
