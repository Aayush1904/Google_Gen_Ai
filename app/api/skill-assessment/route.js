import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { User, SkillAssessment } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// GET skill assessment questions
export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const skillName = searchParams.get("skillName") || "JavaScript";
    const skillCategory = searchParams.get("skillCategory") || "Programming";

    // Generate questions using AI
    const prompt = `
    Generate 20 assessment questions for ${skillName} (${skillCategory}) skill evaluation.
    Include questions of varying difficulty levels (beginner to advanced).
    
    Return in JSON format:
    {
      "questions": [
        {
          "id": 1,
          "question": "question text",
          "type": "multiple_choice",
          "options": ["option1", "option2", "option3", "option4"],
          "correctAnswer": 0,
          "difficulty": "beginner|intermediate|advanced",
          "explanation": "explanation of the correct answer"
        }
      ]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questions = JSON.parse(response.text());

    return NextResponse.json({
      success: true,
      skillName,
      skillCategory,
      questions: questions.questions,
    });
  } catch (error) {
    console.error("Error generating skill assessment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST submit skill assessment
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { skillName, skillCategory, questions, answers } = body;

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate score and analyze results
    let correctAnswers = 0;
    const totalQuestions = questions.length;

    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / totalQuestions) * 100;

    // Determine proficiency level
    let proficiencyLevel = "beginner";
    if (score >= 80) proficiencyLevel = "expert";
    else if (score >= 60) proficiencyLevel = "advanced";
    else if (score >= 40) proficiencyLevel = "intermediate";

    // Generate improvement recommendations using AI
    const prompt = `
    Analyze this skill assessment result and provide recommendations:
    
    Skill: ${skillName}
    Category: ${skillCategory}
    Score: ${score}%
    Proficiency Level: ${proficiencyLevel}
    Questions: ${JSON.stringify(questions)}
    Answers: ${JSON.stringify(answers)}
    
    Return in JSON format:
    {
      "improvementAreas": ["array of areas to improve"],
      "recommendedResources": [
        {
          "type": "course|book|tutorial|practice",
          "title": "resource title",
          "url": "resource url",
          "description": "resource description"
        }
      ],
      "nextSteps": ["array of recommended next steps"],
      "estimatedTimeToImprove": "estimated time to reach next level"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recommendations = JSON.parse(response.text());

    // Save assessment to database
    const assessment = await db
      .insert(SkillAssessment)
      .values({
        userId: user[0].id,
        skillName,
        skillCategory,
        proficiencyLevel,
        assessmentScore: score,
        questions,
        answers,
        improvementAreas: recommendations.improvementAreas,
        recommendedResources: recommendations.recommendedResources,
        completedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      assessment: assessment[0],
      score,
      proficiencyLevel,
      recommendations,
    });
  } catch (error) {
    console.error("Error submitting skill assessment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
