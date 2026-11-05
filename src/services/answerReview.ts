import { reviewAnswerWithBackend } from './geminiKeyStore';

export type IssueCategory =
  | 'missing_required'
  | 'unclear_explanation'
  | 'contradiction'
  | 'optional_opportunity'
  | 'ready';

export interface AnswerReviewFeedback {
  meetsRequirements: boolean;
  issueCategory: IssueCategory;
  // Revision required structure
  whatNeedsAttention: string;
  directionToExplore: string;
  questionToHelpRevise: string;
  // Revision resolution notes
  resolvedNotes?: string;
  // Ready to move forward acknowledgment
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

/**
 * Reviews a user's answer against World Within Method step criteria using the customer's validated Gemini API key.
 * Enforces session authentication and key verification on the server.
 */
export async function reviewAnswer(params: ReviewAnswerParams): Promise<AnswerReviewFeedback> {
  const trimmed = (params.currentAnswer || '').trim();

  // If answer is completely empty
  if (!trimmed) {
    return {
      meetsRequirements: false,
      issueCategory: 'missing_required',
      whatNeedsAttention: `No answer has been entered yet for "${params.question}". This step requires your own definition to anchor this part of your system.`,
      directionToExplore: `Consider what distinct choice or boundary you want to establish here based on the purpose of this step.`,
      questionToHelpRevise: `What is the first concrete decision you want to commit to for "${params.question}"?`,
    };
  }

  try {
    return await reviewAnswerWithBackend(params);
  } catch (error: any) {
    console.error("Answer review service error:", error);
    // If the error indicates invalid key or missing key, bubble it up so the setup screen can intervene
    if (error?.message?.includes('INVALID_KEY') || error?.message?.includes('NO_KEY')) {
      throw error;
    }
    // Return a structured error response guiding the user
    return {
      meetsRequirements: false,
      issueCategory: 'unclear_explanation',
      whatNeedsAttention: `Unable to complete AI review: ${error?.message || 'Server error'}. Please verify your Gemini API key in account settings.`,
      directionToExplore: 'Check your Google AI Studio project status or re-validate your key.',
      questionToHelpRevise: 'Would you like to retry the review with your validated key?',
    };
  }
}
