"use server";

import { db } from "@/configs/db";
import { IndustryInsight, User } from "@/configs/schema";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { eq } from "drizzle-orm";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

export const generateAiInsights = async (industry) => {
    const prompt = `Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "high" | "medium" | "low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "positive" | "neutral" | "negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.`

          const result = await model.generateContent(prompt);
          const response = result.response;
          const text =  response.text();

          const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

            console.log(cleanedText);
            return JSON.parse(cleanedText);
}

export async function getIndustryInsight() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.select().from(User).where(eq(User.clerkUserId, userId)).then(users => users[0]);

    if (!user) throw new Error("User not found");

    if (!user.industryInsight) {
        const insights = await generateAiInsights(user.industry);

        const [industryInsight] = await db
            .insert(IndustryInsight)
            .values({
                industry: user.industry,
                ...insights,
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            })
            .returning();

        return industryInsight;
    }

    return db
        .select()
        .from(IndustryInsight)
        .where(eq(IndustryInsight.id, user.industryInsight))
        .then(insights => insights[0]);
}
