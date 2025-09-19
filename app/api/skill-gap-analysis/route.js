import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import {
  User,
  SkillGapAnalysis,
  UserProfile,
  SkillAssessment,
} from "@/configs/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// GET skill gap analysis
export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetRole = searchParams.get("targetRole");

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's current skills from profile and assessments
    const [profile] = await db
      .select()
      .from(UserProfile)
      .where(eq(UserProfile.userId, user[0].id))
      .limit(1);
    const assessments = await db
      .select()
      .from(SkillAssessment)
      .where(eq(SkillAssessment.userId, user[0].id));

    const currentSkills = {
      fromProfile: profile?.extractedSkills || [],
      fromAssessments: assessments.map((a) => ({
        skill: a.skillName,
        level: a.proficiencyLevel,
        score: a.assessmentScore,
      })),
    };

    // Generate skill gap analysis using AI
    const prompt = `
    Analyze the skill gap for transitioning to ${targetRole} role:
    
    Current Skills:
    - From Profile: ${JSON.stringify(currentSkills.fromProfile)}
    - From Assessments: ${JSON.stringify(currentSkills.fromAssessments)}
    
    Target Role: ${targetRole}
    
    Return in JSON format:
    {
      "currentSkills": {
        "technical": ["array of current technical skills"],
        "soft": ["array of current soft skills"]
      },
      "requiredSkills": {
        "technical": ["array of required technical skills"],
        "soft": ["array of required soft skills"]
      },
      "skillGaps": [
        {
          "skill": "skill name",
          "currentLevel": "current proficiency level",
          "requiredLevel": "required proficiency level",
          "gap": "gap description",
          "priority": "high|medium|low"
        }
      ],
      "prioritySkills": ["array of skills to focus on first"],
      "learningPath": [
        {
          "phase": "phase name",
          "skills": ["skills to learn in this phase"],
          "duration": "estimated duration",
          "resources": ["suggested resources"]
        }
      ],
      "estimatedTimeToClose": "estimated time to close all gaps",
      "marketDemand": "current market demand for this role",
      "salaryImpact": "potential salary impact of closing gaps"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = JSON.parse(response.text());

    // Save analysis to database
    const gapAnalysis = await db
      .insert(SkillGapAnalysis)
      .values({
        userId: user[0].id,
        targetRole,
        currentSkills,
        requiredSkills: analysis.requiredSkills,
        skillGaps: analysis.skillGaps,
        prioritySkills: analysis.prioritySkills,
        learningPath: analysis.learningPath,
        estimatedTimeToClose: analysis.estimatedTimeToClose,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      analysis,
      gapAnalysis: gapAnalysis[0],
    });
  } catch (error) {
    console.error("Error generating skill gap analysis:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create custom skill gap analysis
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { targetRole, customSkills } = body;

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate analysis with custom skills
    const prompt = `
    Analyze the skill gap for transitioning to ${targetRole} role with these custom skills:
    
    Custom Skills: ${JSON.stringify(customSkills)}
    Target Role: ${targetRole}
    
    Return the same JSON format as the GET endpoint.
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

    // Save analysis to database
    const gapAnalysis = await db
      .insert(SkillGapAnalysis)
      .values({
        userId: user[0].id,
        targetRole,
        currentSkills: customSkills,
        requiredSkills: analysis.requiredSkills,
        skillGaps: analysis.skillGaps,
        prioritySkills: analysis.prioritySkills,
        learningPath: analysis.learningPath,
        estimatedTimeToClose: analysis.estimatedTimeToClose,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      analysis,
      gapAnalysis: gapAnalysis[0],
    });
  } catch (error) {
    console.error("Error creating custom skill gap analysis:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
