
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async parseLandmarkDescription(text: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this South African township address description and extract structured data: "${text}". Focus on landmarks like Spaza shops, taxi ranks, schools, or house colors.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              mainLandmark: { type: Type.STRING, description: "The primary landmark (e.g., Ma-Zulu's Spaza)" },
              spatialRelation: { type: Type.STRING, description: "Spatial context (e.g., 2 houses down, behind, opposite)" },
              visualMarkers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Visual identifiers like colors, gate types, or satellite dishes" },
              suggestedCategory: { type: Type.STRING, enum: ["spaza", "transport", "house", "other"] },
              confidence: { type: Type.NUMBER }
            },
            required: ["mainLandmark", "spatialRelation", "visualMarkers", "suggestedCategory"]
          }
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini Parsing Error:", error);
      return null;
    }
  },

  async generateLandmarkRoute(from: string, to: string) {
    try {
      const prompt = `Generate a text-based navigation route for a township courier going from "${from}" to "${to}". Use local landmarks, not street names. Keep it very simple (3-4 steps). Use South African township dialect (e.g. 'Turn by the spaza').`;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      return "Start at pickup. Follow main road. Ask for the landmark locally.";
    }
  },

  async assessRouteSafety(activeIncidents: any[]) {
    try {
      if (activeIncidents.length === 0) return "No active incidents reported. The path is clear. Sharp sharp!";
      
      const prompt = `Act as a local safety coordinator. Given these incidents: ${JSON.stringify(activeIncidents)}, provide a brief, urgent 1-sentence warning for a delivery person on a bicycle or trolley. Use local context.`;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      return "Stay alert. Watch out for activity near Section B.";
    }
  },

  async getSupportResponse(userMessage: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: "You are Kasi-Bot, the support assistant for Kasi-Nav. Kasi-Nav is a township logistics app using landmarks for addresses. We use Spaza shops as hubs and local 'trolley-pushers' as couriers. Be helpful, professional, and use slight South African slang like 'Sharp sharp' or 'Eish' where appropriate."
        }
      });
      return response.text;
    } catch (error) {
      return "Sorry, I'm having trouble connecting. Try again later! Sharp sharp.";
    }
  }
};
