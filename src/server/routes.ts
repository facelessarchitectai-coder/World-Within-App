import { Request, Response } from 'express';
import {
  verifyFirebaseToken,
  testGeminiApiKey,
  executeReviewAnswer,
  ReviewAnswerParams,
} from './aiService';

export async function handleValidateKeyRoute(req: Request, res: Response) {
  try {
    // 1. Verify user session via Firebase ID token
    const user = await verifyFirebaseToken(req.headers.authorization);

    // 2. Extract customer-supplied Gemini key
    const apiKey = (req.headers['x-gemini-api-key'] as string) || req.body?.apiKey;

    // 3. Live test against Gemini API
    await testGeminiApiKey(apiKey);

    return res.status(200).json({
      success: true,
      valid: true,
      userId: user.uid,
      message: 'Gemini API key verified successfully with Google AI Studio.',
    });
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (msg.startsWith('UNAUTHORIZED:')) {
      return res.status(401).json({ error: msg.replace('UNAUTHORIZED: ', '') });
    }
    if (msg.startsWith('BAD_REQUEST:')) {
      return res.status(400).json({ error: msg.replace('BAD_REQUEST: ', '') });
    }
    if (msg.startsWith('INVALID_KEY:') || msg.startsWith('QUOTA_EXHAUSTED:') || msg.startsWith('PERMISSION_DENIED:')) {
      return res.status(403).json({
        error: msg.split(': ')[1] || msg,
        invalidKey: true,
      });
    }
    return res.status(500).json({ error: msg });
  }
}

export async function handleReviewAnswerRoute(req: Request, res: Response) {
  try {
    // 1. Enforce verified Firebase session
    await verifyFirebaseToken(req.headers.authorization);

    // 2. Enforce customer-supplied Gemini key
    const apiKey = (req.headers['x-gemini-api-key'] as string) || req.body?.apiKey;

    // 3. Execute review
    const params: ReviewAnswerParams = {
      question: req.body?.question || 'System Parameter Definition',
      purposeAndRequirements: req.body?.purposeAndRequirements,
      currentAnswer: req.body?.currentAnswer || '',
      previousAnswer: req.body?.previousAnswer,
      earlierAnswersContext: req.body?.earlierAnswersContext,
      phaseTitle: req.body?.phaseTitle,
    };

    const feedback = await executeReviewAnswer(params, apiKey);
    return res.status(200).json(feedback);
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (msg.startsWith('UNAUTHORIZED:')) {
      return res.status(401).json({ error: msg.replace('UNAUTHORIZED: ', '') });
    }
    if (msg.startsWith('BAD_REQUEST:')) {
      return res.status(400).json({ error: msg.replace('BAD_REQUEST: ', '') });
    }
    if (msg.startsWith('INVALID_KEY:')) {
      return res.status(403).json({
        error: msg.replace('INVALID_KEY: ', ''),
        invalidKey: true,
      });
    }
    return res.status(500).json({ error: msg });
  }
}

export async function handleAnalyzeSystemRoute(req: Request, res: Response) {
  try {
    // 1. Enforce verified Firebase session
    await verifyFirebaseToken(req.headers.authorization);

    // 2. Enforce customer-supplied Gemini key
    const apiKey = (req.headers['x-gemini-api-key'] as string) || req.body?.apiKey;

    const input = (req.body?.input || '').trim();
    const contextDescription = req.body?.contextDescription || 'System Parameter Definition';

    if (!input) {
      return res.status(200).json({
        passed: false,
        reasons: ['No input provided. Please enter your definition.'],
        vagueWordsFound: [],
      });
    }

    const feedback = await executeReviewAnswer(
      {
        question: contextDescription,
        purposeAndRequirements:
          'Ensure the answer provides clear, distinctive architectural boundaries for the World Within system without vague platitudes or contradictions.',
        currentAnswer: input,
      },
      apiKey
    );

    if (feedback.meetsRequirements) {
      return res.status(200).json({
        passed: true,
        reasons: [],
        vagueWordsFound: [],
        reviewFeedback: feedback,
      });
    }

    const reasons = [
      feedback.whatNeedsAttention,
      feedback.directionToExplore,
      feedback.questionToHelpRevise,
    ].filter(Boolean);

    return res.status(200).json({
      passed: false,
      reasons,
      vagueWordsFound: [],
      reviewFeedback: feedback,
    });
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (msg.startsWith('UNAUTHORIZED:')) {
      return res.status(401).json({ error: msg.replace('UNAUTHORIZED: ', '') });
    }
    if (msg.startsWith('BAD_REQUEST:')) {
      return res.status(400).json({ error: msg.replace('BAD_REQUEST: ', '') });
    }
    if (msg.startsWith('INVALID_KEY:')) {
      return res.status(403).json({
        error: msg.replace('INVALID_KEY: ', ''),
        invalidKey: true,
      });
    }
    return res.status(500).json({ error: msg });
  }
}
