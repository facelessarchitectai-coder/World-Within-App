import { analyzeSystemWithBackend } from './geminiKeyStore';
import { reviewAnswer, AnswerReviewFeedback } from './answerReview';

export interface SystemAnalysisResult {
  passed: boolean;
  reasons: string[];
  vagueWordsFound: string[];
  reviewFeedback?: AnswerReviewFeedback;
}

/**
 * Evaluates input using World Within Method criteria via the customer's validated Gemini API key.
 * Never uses creator, fallback, or shared Gemini credentials.
 */
export async function analyzeSystemInput(input: string, contextDescription?: string): Promise<SystemAnalysisResult> {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    return {
      passed: false,
      reasons: ["No input provided. Please enter your definition."],
      vagueWordsFound: []
    };
  }

  try {
    return await analyzeSystemWithBackend(trimmed, contextDescription);
  } catch (error: any) {
    console.error("Gemini analysis error:", error);
    if (error?.message?.includes('INVALID_KEY') || error?.message?.includes('NO_KEY')) {
      throw error;
    }
    return {
      passed: false,
      reasons: [`Analysis error: ${error?.message || 'Server connection error'}. Please verify your Gemini API key.`],
      vagueWordsFound: []
    };
  }
}

export { reviewAnswer };
export type { AnswerReviewFeedback } from "./answerReview";
