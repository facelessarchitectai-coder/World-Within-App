import { GoogleGenAI } from "@google/genai";

const KEY_STORAGE = 'ww_gemini_api_key';

export function getUserApiKey(): string {
  try { return localStorage.getItem(KEY_STORAGE) || ''; } catch { return ''; }
}

export function setUserApiKey(key: string) {
  try {
    if (key.trim()) localStorage.setItem(KEY_STORAGE, key.trim());
    else localStorage.removeItem(KEY_STORAGE);
  } catch { /* storage unavailable */ }
}

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

  const apiKey = getUserApiKey();
  if (!apiKey) {
    return {
      passed: false,
      reasons: ["Add your free Gemini API key in the menu (Your Gemini Key) to run the AI check."],
      vagueWordsFound: []
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
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
