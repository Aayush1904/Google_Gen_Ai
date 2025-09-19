import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { User, PsychometricTest } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// GET psychometric test questions
export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const testType = searchParams.get("testType") || "holland_codes";

    let questions = [];

    if (testType === "holland_codes") {
      questions = [
        {
          id: 1,
          question: "I enjoy working with tools and machinery",
          category: "Realistic",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ],
        },
        {
          id: 2,
          question: "I like to investigate and research topics",
          category: "Investigative",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ],
        },
        {
          id: 3,
          question: "I enjoy creating art, music, or writing",
          category: "Artistic",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ],
        },
        {
          id: 4,
          question: "I like helping and teaching others",
          category: "Social",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ],
        },
        {
          id: 5,
          question: "I enjoy leading and managing projects",
          category: "Enterprising",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ],
        },
        {
          id: 6,
          question: "I prefer structured and organized work environments",
          category: "Conventional",
          options: [
            { value: 1, label: "Strongly Disagree" },
            { value: 2, label: "Disagree" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Agree" },
            { value: 5, label: "Strongly Agree" },
          ],
        },
      ];
    }

    return NextResponse.json({
      success: true,
      testType,
      questions,
    });
  } catch (error) {
    console.error("Error fetching psychometric test:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST submit psychometric test results
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { testType, answers } = body;

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate results using AI
    const prompt = `
    Analyze these psychometric test answers and provide insights in JSON format:
    
    Test Type: ${testType}
    Answers: ${JSON.stringify(answers)}
    
    Return:
    {
      "results": {
        "holland_codes": {
          "Realistic": number,
          "Investigative": number,
          "Artistic": number,
          "Social": number,
          "Enterprising": number,
          "Conventional": number
        }
      },
      "personalityTraits": ["array of key personality traits"],
      "careerInterests": ["array of career interests"],
      "workStylePreferences": ["array of work style preferences"],
      "recommendedCareerPaths": ["array of recommended career paths"],
      "insights": "detailed analysis of the results"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();

    // Clean the response text to remove markdown formatting
    responseText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let analysis;
    try {
      analysis = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.error("Response text:", responseText);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    // Save results to database
    const testResult = await db
      .insert(PsychometricTest)
      .values({
        userId: user[0].id,
        testType,
        results: analysis.results,
        personalityTraits: analysis.personalityTraits,
        careerInterests: analysis.careerInterests,
        workStylePreferences: analysis.workStylePreferences,
        completedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      testResult: testResult[0],
      analysis,
    });
  } catch (error) {
    console.error("Error submitting psychometric test:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
