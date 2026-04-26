import { GoogleGenAI } from "@google/genai";
import { Lead, LeadStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateLeads(niche: string, location: string, userId: string): Promise<Partial<Lead>[]> {
  const prompt = `
    Find 10 high-quality business leads for the niche "${niche}" in "${location}".
    For each lead, provide:
    - Business Name
    - Website (if likely)
    - Phone (if likely)
    - A short summary/reason why they are a good lead
    - An estimated lead score (0-100) based on potential value
    - Estimated rating and review count if applicable

    Return the result strictly as a JSON array of objects with the following keys:
    "name", "website", "phone", "summary", "score", "rating", "reviews"

    Do not include any other text beside the JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    const text = response.text || "";
    const jsonMatch = text.match(/\[.*\]/s);
    if (!jsonMatch) throw new Error("Failed to parse AI response");
    
    const leadsData = JSON.parse(jsonMatch[0]);
    return leadsData.map((l: any) => ({
      ...l,
      userId,
      niche,
      location,
      status: LeadStatus.NEW,
      createdAt: new Date()
    }));
  } catch (error) {
    console.error("Gemini Lead Generation Error:", error);
    throw error;
  }
}

export async function generateOutreachMessage(lead: Partial<Lead>, userProfile: { displayName: string }): Promise<string> {
  const prompt = `
    Generate a high-converting, professional, and personalized cold outreach message for the following lead:
    Lead Name: ${lead.name}
    Niche: ${lead.niche}
    Location: ${lead.location}
    Lead Summary: ${lead.summary}
    My Name: ${userProfile.displayName}

    The message should be concise, value-driven, and end with a clear call to action.
    Target platform: Email or LinkedIn.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Failed to generate message.";
  } catch (error) {
    console.error("Gemini Outreach Generation Error:", error);
    throw error;
  }
}
