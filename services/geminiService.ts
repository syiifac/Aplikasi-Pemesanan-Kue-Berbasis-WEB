
import { GoogleGenAI, Type } from "@google/genai";
import { Cake } from "../types";

const getLocalRecommendations = (mood: string, cakes: Cake[]) => {
  if (!cakes.length) return [];

  const text = mood.toLowerCase();
  const boosts: Array<{ match: (c: Cake) => boolean; reason: string }> = [
    {
      match: (c) => /cheesecake|tiramisu|lapis/.test(`${c.name} ${c.description}`.toLowerCase()),
      reason: 'Mood sedang butuh comfort? Kue creamy dan klasik cocok banget buat nenangin hati.'
    },
    {
      match: (c) => /mango|pudding|segar|fruity|lemon|stroberi/.test(`${c.name} ${c.description}`.toLowerCase()),
      reason: 'Butuh yang segar? Dessert buah bikin mood lebih ringan dan fresh.'
    },
    {
      match: (c) => /cookies|choco|cokelat|matcha/.test(`${c.name} ${c.description}`.toLowerCase()),
      reason: 'Mood naik dengan cookies hangat dan rasa cokelat yang bikin happy.'
    }
  ];

  let scored = cakes.map(cake => {
    let score = 0;
    if (/sedih|lelah|capek|stress|stres|galau/.test(text)) score += 2;
    if (/segar|fresh|ringan|cerah/.test(text)) score += 2;
    if (/happy|senang|ceria|semangat/.test(text)) score += 2;

    let reason = 'Pilihan aman yang cocok untuk semua mood.';
    for (const b of boosts) {
      if (b.match(cake)) {
        score += 2;
        reason = b.reason;
        break;
      }
    }

    return { cake, score, reason };
  });

  scored = scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 2).map(s => ({
    cakeName: s.cake.name,
    reason: s.reason
  }));
};

export const getCakeRecommendations = async (mood: string, cakes: Cake[]) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) {
    return getLocalRecommendations(mood, cakes);
  }

  const ai = new GoogleGenAI({ apiKey });
  const cakeContext = cakes.map(c => `${c.name} (${c.description})`).join(', ');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User feels: ${mood}. Available cakes: ${cakeContext}. Suggest 2 best cakes from the list for this mood and explain why in Indonesian. Keep it cheerful.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              cakeName: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["cakeName", "reason"]
          }
        }
      }
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return getLocalRecommendations(mood, cakes);
  }
};
