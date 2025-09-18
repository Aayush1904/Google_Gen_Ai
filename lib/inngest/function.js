import { db } from "@/configs/db";
import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { eq } from "drizzle-orm";
import { IndustryInsight } from "@/configs/schema";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateIndustryInsights = inngest.createFunction(
  { name: "Generate Industry Insights" },
  { on: { cron: "0 0 * * 0" } }, // Run every Sunday at midnight
  async ({ step }) => {
    // 1️⃣ Fetch industries from the database
    const industries = await step.run("Fetch industries", async () => {
      return await db.select({ industry: IndustryInsight.industry }).from(IndustryInsight);
    });

    // 2️⃣ Iterate through each industry and generate insights
    for (const { industry } of industries) {
      const prompt = `
        Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
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
        Include at least 5 skills and trends.
      `;

      // 3️⃣ Generate insights using Gemini AI
      const res = await step.run(`Generate insights for ${industry}`, async () => {
        try {
          const response = await model.generateContent(prompt);
          const text = response.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          return text.replace(/```(?:json)?\n?/g, "").trim(); // Remove Markdown formatting
        } catch (error) {
          console.error(`Error generating insights for ${industry}:`, error);
          return null;
        }
      });

      if (!res) continue; // Skip if AI response is empty

      let insights;
      try {
        insights = JSON.parse(res);
      } catch (error) {
        console.error(`Error parsing AI response for ${industry}:`, error);
        continue; // Skip this industry if JSON parsing fails
      }

      // 4️⃣ Update insights in the database
      await step.run(`Update insights for ${industry}`, async () => {
        await db
          .update(IndustryInsight)
          .set({
            salaryRanges: JSON.stringify(insights.salaryRanges), // Store as JSON
            growthRate: insights.growthRate,
            demandLevel: insights.demandLevel,
            topSkills: insights.topSkills,
            marketOutlook: insights.marketOutlook,
            keyTrends: insights.keyTrends,
            recommendedSkills: insights.recommendedSkills,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next update in 7 days
          })
          .where(eq(IndustryInsight.industry, industry));
      });
    }
  }
);
