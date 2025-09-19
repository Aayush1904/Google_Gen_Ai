import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { MarketInsights } from "@/configs/schema";
import { eq, and } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// GET market insights
export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location") || "India";
    const industry = searchParams.get("industry") || "Technology";

    // Check if we have recent insights in database
    const existingInsights = await db
      .select()
      .from(MarketInsights)
      .where(
        and(
          eq(MarketInsights.location, location),
          eq(MarketInsights.industry, industry)
        )
      )
      .limit(1);

    // If we have recent data (less than 7 days old), return it
    if (existingInsights.length > 0) {
      const lastUpdate = new Date(existingInsights[0].lastUpdated);
      const now = new Date();
      const daysDiff = (now - lastUpdate) / (1000 * 60 * 60 * 24);

      if (daysDiff < 7) {
        return NextResponse.json({
          success: true,
          insights: existingInsights[0],
          fromCache: true,
        });
      }
    }

    // Generate fresh market insights using AI
    const prompt = `
    Generate comprehensive market insights for ${industry} industry in ${location}:
    
    Return in JSON format:
    {
      "trendingSkills": [
        {
          "skill": "skill name",
          "demand": "high|medium|low",
          "growth": "percentage growth",
          "description": "why this skill is trending"
        }
      ],
      "inDemandJobs": [
        {
          "title": "job title",
          "demand": "high|medium|low",
          "salaryRange": "salary range",
          "requiredSkills": ["required skills"],
          "growth": "job growth percentage"
        }
      ],
      "topHiringCompanies": [
        {
          "name": "company name",
          "industry": "company industry",
          "hiringTrend": "increasing|stable|decreasing",
          "popularRoles": ["popular job roles"],
          "companySize": "startup|mid-size|enterprise"
        }
      ],
      "salaryData": {
        "entryLevel": "salary range",
        "midLevel": "salary range",
        "seniorLevel": "salary range",
        "averageSalary": "average salary",
        "salaryGrowth": "salary growth percentage"
      },
      "marketTrends": [
        {
          "trend": "trend name",
          "description": "trend description",
          "impact": "positive|negative|neutral",
          "timeframe": "short-term|medium-term|long-term"
        }
      ],
      "recommendations": [
        {
          "category": "skill|role|company",
          "recommendation": "specific recommendation",
          "reason": "why this is recommended"
        }
      ]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insights = JSON.parse(response.text());

    // Save insights to database
    const marketInsights = await db
      .insert(MarketInsights)
      .values({
        location,
        industry,
        trendingSkills: insights.trendingSkills.map((s) => s.skill),
        inDemandJobs: insights.inDemandJobs,
        topHiringCompanies: insights.topHiringCompanies,
        salaryData: insights.salaryData,
        marketTrends: insights.marketTrends,
        lastUpdated: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      insights: {
        ...insights,
        id: marketInsights[0].id,
        location,
        industry,
        lastUpdated: marketInsights[0].lastUpdated,
      },
      fromCache: false,
    });
  } catch (error) {
    console.error("Error generating market insights:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST update market insights
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { location, industry, customData } = body;

    // Update or create market insights with custom data
    const existingInsights = await db
      .select()
      .from(MarketInsights)
      .where(
        and(
          eq(MarketInsights.location, location),
          eq(MarketInsights.industry, industry)
        )
      )
      .limit(1);

    let result;
    if (existingInsights.length > 0) {
      result = await db
        .update(MarketInsights)
        .set({
          ...customData,
          lastUpdated: new Date().toISOString(),
        })
        .where(eq(MarketInsights.id, existingInsights[0].id))
        .returning();
    } else {
      result = await db
        .insert(MarketInsights)
        .values({
          location,
          industry,
          ...customData,
          lastUpdated: new Date().toISOString(),
        })
        .returning();
    }

    return NextResponse.json({
      success: true,
      insights: result[0],
    });
  } catch (error) {
    console.error("Error updating market insights:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
