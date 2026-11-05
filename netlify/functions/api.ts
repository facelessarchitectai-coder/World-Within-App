import {
  verifyFirebaseToken,
  testGeminiApiKey,
  executeReviewAnswer,
  ReviewAnswerParams,
} from '../../src/server/aiService';

interface HandlerEvent {
  httpMethod: string;
  path: string;
  headers: Record<string, string | undefined>;
  body: string | null;
}

interface HandlerResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

export const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-gemini-api-key',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: defaultHeaders,
      body: '',
    };
  }

  const path = event.path || '';
  const body = event.body ? JSON.parse(event.body) : {};
  const authHeader = event.headers['authorization'] || event.headers['Authorization'];
  const apiKey = (event.headers['x-gemini-api-key'] || event.headers['X-Gemini-Api-Key'] || body?.apiKey) as string | undefined;

  try {
    if (path.endsWith('/validate-key')) {
      const user = await verifyFirebaseToken(authHeader);
      await testGeminiApiKey(apiKey);
      return {
        statusCode: 200,
        headers: defaultHeaders,
        body: JSON.stringify({
          success: true,
          valid: true,
          userId: user.uid,
          message: 'Gemini API key verified successfully with Google AI Studio.',
        }),
      };
    }

    if (path.endsWith('/review-answer')) {
      await verifyFirebaseToken(authHeader);
      const params: ReviewAnswerParams = {
        question: body?.question || 'System Parameter Definition',
        purposeAndRequirements: body?.purposeAndRequirements,
        currentAnswer: body?.currentAnswer || '',
        previousAnswer: body?.previousAnswer,
        earlierAnswersContext: body?.earlierAnswersContext,
        phaseTitle: body?.phaseTitle,
      };
      const feedback = await executeReviewAnswer(params, apiKey || '');
      return {
        statusCode: 200,
        headers: defaultHeaders,
        body: JSON.stringify(feedback),
      };
    }

    if (path.endsWith('/analyze-system')) {
      await verifyFirebaseToken(authHeader);
      const input = (body?.input || '').trim();
      const contextDescription = body?.contextDescription || 'System Parameter Definition';

      if (!input) {
        return {
          statusCode: 200,
          headers: defaultHeaders,
          body: JSON.stringify({
            passed: false,
            reasons: ['No input provided. Please enter your definition.'],
            vagueWordsFound: [],
          }),
        };
      }

      const feedback = await executeReviewAnswer(
        {
          question: contextDescription,
          purposeAndRequirements:
            'Ensure the answer provides clear, distinctive architectural boundaries for the World Within system without vague platitudes or contradictions.',
          currentAnswer: input,
        },
        apiKey || ''
      );

      if (feedback.meetsRequirements) {
        return {
          statusCode: 200,
          headers: defaultHeaders,
          body: JSON.stringify({
            passed: true,
            reasons: [],
            vagueWordsFound: [],
            reviewFeedback: feedback,
          }),
        };
      }

      const reasons = [
        feedback.whatNeedsAttention,
        feedback.directionToExplore,
        feedback.questionToHelpRevise,
      ].filter(Boolean);

      return {
        statusCode: 200,
        headers: defaultHeaders,
        body: JSON.stringify({
          passed: false,
          reasons,
          vagueWordsFound: [],
          reviewFeedback: feedback,
        }),
      };
    }

    return {
      statusCode: 404,
      headers: defaultHeaders,
      body: JSON.stringify({ error: `Not Found: ${path}` }),
    };
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (msg.startsWith('UNAUTHORIZED:')) {
      return {
        statusCode: 401,
        headers: defaultHeaders,
        body: JSON.stringify({ error: msg.replace('UNAUTHORIZED: ', '') }),
      };
    }
    if (msg.startsWith('BAD_REQUEST:')) {
      return {
        statusCode: 400,
        headers: defaultHeaders,
        body: JSON.stringify({ error: msg.replace('BAD_REQUEST: ', '') }),
      };
    }
    if (msg.startsWith('INVALID_KEY:') || msg.startsWith('QUOTA_EXHAUSTED:') || msg.startsWith('PERMISSION_DENIED:')) {
      return {
        statusCode: 403,
        headers: defaultHeaders,
        body: JSON.stringify({
          error: msg.split(': ')[1] || msg,
          invalidKey: true,
        }),
      };
    }
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({ error: msg }),
    };
  }
};
