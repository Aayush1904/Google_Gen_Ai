import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import {
  User,
  MockInterview,
  UserProfile,
  SkillAssessment,
} from "@/configs/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// GET mock interview questions
export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const interviewType = searchParams.get("type") || "behavioral";
    const role = searchParams.get("role") || "Software Engineer";

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's profile and skills
    const [profile] = await db
      .select()
      .from(UserProfile)
      .where(eq(UserProfile.userId, user[0].id))
      .limit(1);
    const assessments = await db
      .select()
      .from(SkillAssessment)
      .where(eq(SkillAssessment.userId, user[0].id));

    // Generate interview questions using AI
    const prompt = `
    Generate ${interviewType} interview questions for ${role} position:
    
    User Profile:
    - Experience: ${user[0].experience || 0} years
    - Industry: ${user[0].industry || "Technology"}
    - Skills: ${JSON.stringify(profile?.extractedSkills || [])}
    - Skill Levels: ${JSON.stringify(
      assessments.map((a) => ({
        skill: a.skillName,
        level: a.proficiencyLevel,
      }))
    )}
    
    Interview Type: ${interviewType}
    Target Role: ${role}
    
    Return in JSON format:
    {
      "questions": [
        {
          "id": 1,
          "question": "interview question",
          "type": "behavioral|technical|system_design|situational",
          "difficulty": "easy|medium|hard",
          "category": "question category",
          "expectedAnswer": "expected answer or key points",
          "evaluationCriteria": ["criteria for evaluation"],
          "followUpQuestions": ["potential follow-up questions"],
          "tips": ["tips for answering this question"]
        }
      ],
      "interviewStructure": {
        "duration": "estimated interview duration",
        "sections": [
          {
            "section": "section name",
            "duration": "section duration",
            "questionCount": "number of questions",
            "description": "section description"
          }
        ]
      },
      "preparationTips": [
        "tip 1",
        "tip 2"
      ],
      "commonMistakes": [
        "common mistake 1",
        "common mistake 2"
      ]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const interview = JSON.parse(response.text());

    return NextResponse.json({
      success: true,
      interviewType,
      role,
      interview,
    });
  } catch (error) {
    console.error("Error generating mock interview:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST submit mock interview answers
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { interviewType, role, questions, answers } = body;

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Analyze answers using AI
    const prompt = `
    Analyze these mock interview answers and provide detailed feedback:
    
    Interview Type: ${interviewType}
    Role: ${role}
    Questions: ${JSON.stringify(questions)}
    Answers: ${JSON.stringify(answers)}
    
    Return in JSON format:
    {
      "overallScore": "score out of 100",
      "feedback": {
        "strengths": ["areas where the candidate performed well"],
        "improvementAreas": ["areas that need improvement"],
        "overallAssessment": "overall assessment of the interview performance"
      },
      "questionAnalysis": [
        {
          "questionId": 1,
          "score": "score for this question",
          "feedback": "specific feedback for this answer",
          "strengths": ["strengths in this answer"],
          "improvements": ["suggestions for improvement"],
          "sampleAnswer": "example of a good answer"
        }
      ],
      "recommendations": [
        {
          "category": "preparation|communication|technical|behavioral",
          "recommendation": "specific recommendation",
          "priority": "high|medium|low"
        }
      ],
      "nextSteps": [
        "actionable next step 1",
        "actionable next step 2"
      ]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = JSON.parse(response.text());

    // Save interview to database
    const mockInterview = await db
      .insert(MockInterview)
      .values({
        userId: user[0].id,
        interviewType,
        role,
        questions,
        answers,
        feedback: analysis.feedback,
        score: parseFloat(analysis.overallScore),
        strengths: analysis.feedback.strengths,
        improvementAreas: analysis.feedback.improvementAreas,
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      analysis,
      mockInterview: mockInterview[0],
    });
  } catch (error) {
    console.error("Error analyzing mock interview:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
