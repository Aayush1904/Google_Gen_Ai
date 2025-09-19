import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import {
  User,
  LearningPathway,
  UserProfile,
  SkillAssessment,
} from "@/configs/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// GET learning pathways
export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const pathways = await db
      .select()
      .from(LearningPathway)
      .where(eq(LearningPathway.userId, user[0].id));

    return NextResponse.json({
      success: true,
      pathways,
    });
  } catch (error) {
    console.error("Error fetching learning pathways:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create learning pathway
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { targetSkill, currentLevel, targetLevel, timeline } = body;

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's current skills and experience
    const [profile] = await db
      .select()
      .from(UserProfile)
      .where(eq(UserProfile.userId, user[0].id))
      .limit(1);
    const assessments = await db
      .select()
      .from(SkillAssessment)
      .where(eq(SkillAssessment.userId, user[0].id));

    // Generate personalized learning pathway using AI
    const prompt = `
    Create a personalized learning pathway for ${targetSkill}:
    
    User Profile:
    - Current Level: ${currentLevel}
    - Target Level: ${targetLevel}
    - Experience: ${user[0].experience || 0} years
    - Current Skills: ${JSON.stringify(profile?.extractedSkills || [])}
    - Skill Assessments: ${JSON.stringify(
      assessments.map((a) => ({
        skill: a.skillName,
        level: a.proficiencyLevel,
      }))
    )}
    - Timeline: ${timeline || "flexible"}
    
    Return in JSON format:
    {
      "pathwayName": "pathway name",
      "targetSkill": "${targetSkill}",
      "currentLevel": "${currentLevel}",
      "targetLevel": "${targetLevel}",
      "courses": [
        {
          "title": "course title",
          "platform": "platform name",
          "url": "course url",
          "description": "course description",
          "duration": "course duration",
          "difficulty": "beginner|intermediate|advanced",
          "prerequisites": ["prerequisites"],
          "learningObjectives": ["what you'll learn"],
          "price": "course price",
          "rating": "course rating"
        }
      ],
      "resources": [
        {
          "type": "book|article|video|tutorial|practice",
          "title": "resource title",
          "url": "resource url",
          "description": "resource description",
          "difficulty": "beginner|intermediate|advanced"
        }
      ],
      "timeline": "estimated timeline",
      "milestones": [
        {
          "milestone": "milestone name",
          "description": "milestone description",
          "timeline": "when to achieve this",
          "skills": ["skills gained at this milestone"]
        }
      ],
      "practiceProjects": [
        {
          "title": "project title",
          "description": "project description",
          "difficulty": "beginner|intermediate|advanced",
          "estimatedTime": "estimated time to complete",
          "skills": ["skills practiced in this project"]
        }
      ],
      "assessmentCheckpoints": [
        {
          "checkpoint": "checkpoint name",
          "description": "what to assess",
          "timeline": "when to assess",
          "criteria": ["assessment criteria"]
        }
      ]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const pathway = JSON.parse(response.text());

    // Save pathway to database
    const learningPathway = await db
      .insert(LearningPathway)
      .values({
        userId: user[0].id,
        pathwayName: pathway.pathwayName,
        targetSkill,
        currentLevel,
        targetLevel,
        courses: pathway.courses,
        resources: pathway.resources,
        timeline: pathway.timeline,
        progress: 0,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      pathway: {
        ...pathway,
        id: learningPathway[0].id,
        progress: learningPathway[0].progress,
        isCompleted: learningPathway[0].isCompleted,
      },
      learningPathway: learningPathway[0],
    });
  } catch (error) {
    console.error("Error creating learning pathway:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update learning pathway progress
export async function PUT(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { pathwayId, progress, isCompleted } = body;

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedPathway = await db
      .update(LearningPathway)
      .set({
        progress: progress || 0,
        isCompleted: isCompleted || false,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(LearningPathway.id, pathwayId))
      .returning();

    return NextResponse.json({
      success: true,
      pathway: updatedPathway[0],
    });
  } catch (error) {
    console.error("Error updating learning pathway:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
