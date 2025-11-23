import { GoogleGenAI, Type, Schema } from "@google/genai";
import { KeywordMetric, KeywordAnalysisResult, TrendDirection } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to get random direction for simulation variance
const getRandomDirection = () => {
  const rand = Math.random();
  if (rand > 0.6) return TrendDirection.UP;
  if (rand < 0.3) return TrendDirection.DOWN;
  return TrendDirection.STABLE;
};

export const fetchTrendingKeywords = async (): Promise<KeywordMetric[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        keyword: { type: Type.STRING },
        rank: { type: Type.INTEGER },
        previousRank: { type: Type.INTEGER },
        searchVolume: { type: Type.INTEGER },
        competition: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
      },
      required: ['keyword', 'rank', 'previousRank', 'searchVolume', 'competition']
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a list of 10 currently trending keywords in South Korea suitable for a marketing dashboard. Include realistic (simulated) search volumes and ranks.",
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a specialized SEO data engine. Provide realistic data for South Korean market trends.",
      }
    });

    const rawData = JSON.parse(response.text || '[]');
    
    // Enrich with calculated fields for UI
    return rawData.map((item: any) => {
        const change = item.previousRank - item.rank;
        let trend = TrendDirection.STABLE;
        if (change > 0) trend = TrendDirection.UP;
        if (change < 0) trend = TrendDirection.DOWN;

        return {
            ...item,
            trend,
            change: Math.abs(change)
        };
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback data if API fails or key is missing
    return [
      { keyword: "날씨", rank: 1, previousRank: 2, searchVolume: 500000, competition: 'High', trend: TrendDirection.UP, change: 1 },
      { keyword: "환율", rank: 2, previousRank: 1, searchVolume: 320000, competition: 'High', trend: TrendDirection.DOWN, change: 1 },
      { keyword: "주식", rank: 3, previousRank: 3, searchVolume: 280000, competition: 'High', trend: TrendDirection.STABLE, change: 0 },
    ];
  }
};

export const analyzeSpecificKeyword = async (keyword: string): Promise<KeywordAnalysisResult> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      difficultyScore: { type: Type.INTEGER, description: "0 to 100 SEO difficulty" },
      potentialScore: { type: Type.INTEGER, description: "0 to 100 growth potential" },
      relatedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
      seasonalTrend: {
          type: Type.ARRAY,
          items: {
              type: Type.OBJECT,
              properties: {
                  month: { type: Type.STRING },
                  volume: { type: Type.INTEGER }
              }
          }
      },
      summary: { type: Type.STRING, description: "Short strategic advice in Korean" }
    },
    required: ["difficultyScore", "potentialScore", "relatedKeywords", "seasonalTrend", "summary"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the keyword '${keyword}' for the South Korean market.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are an expert SEO consultant. Analyze the keyword provided and generate simulated but realistic historical data and strategic advice.",
      }
    });

    const result = JSON.parse(response.text || '{}');
    return { ...result, keyword };
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("Failed to analyze keyword");
  }
};