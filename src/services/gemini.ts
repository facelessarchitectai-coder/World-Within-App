import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface SystemAnalysisResult {
  passed: boolean;
  reasons: string[];
  vagueWordsFound: string[];
}

export async function analyzeSystemInput(input: string): Promise<SystemAnalysisResult> {
  const vagueWords = ["aesthetic", "vibe", "creative", "nice", "cool"];
  const foundVague = vagueWords.filter(word => input.toLowerCase().includes(word));

  if (foundVague.length > 0) {
    return {
      passed: false,
      reasons: [`Found vague terminology: ${foundVague.join(", ")}. Please use more specific architectural language.`],
      vagueWordsFound: foundVague
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following system construction input for vagueness, inconsistency, or dependency behavior.
      Input: "${input}"
      
      Respond in strict JSON format:
      {
        "passed": boolean,
        "reasons": string[],
        "vagueWordsFound": string[]
      }`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      passed: result.passed ?? true,
      reasons: result.reasons ?? [],
      vagueWordsFound: result.vagueWordsFound ?? []
    };
  } catch (error) {
    console.error("Gemini analysis failed", error);
    // Fallback to basic pass if AI fails
    return { passed: true, reasons: [], vagueWordsFound: [] };
  }
}
