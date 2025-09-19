import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import {
  User,
  ProjectRecommendation,
  UserProfile,
  SkillAssessment,
} from "@/configs/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// GET project recommendations
export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const skill = searchParams.get("skill");
    const difficulty = searchParams.get("difficulty");

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

    // Generate project recommendations using AI
    const prompt = `
    Generate personalized project recommendations:
    
    User Profile:
    - Experience: ${user[0].experience || 0} years
    - Industry: ${user[0].industry || "Technology"}
    - Current Skills: ${JSON.stringify(profile?.extractedSkills || [])}
    - Skill Assessments: ${JSON.stringify(
      assessments.map((a) => ({
        skill: a.skillName,
        level: a.proficiencyLevel,
      }))
    )}
    - Target Skill: ${skill || "any relevant skill"}
    - Preferred Difficulty: ${difficulty || "mixed"}
    
    Return in JSON format:
    {
      "projects": [
        {
          "title": "project title",
          "description": "detailed project description",
          "requiredSkills": ["skills needed for this project"],
          "difficultyLevel": "beginner|intermediate|advanced",
          "estimatedTime": "estimated time to complete",
          "resources": [
            {
              "type": "tutorial|documentation|example",
              "title": "resource title",
              "url": "resource url",
              "description": "resource description"
            }
          ],
          "portfolioValue": "high|medium|low",
          "learningOutcomes": ["what you'll learn from this project"],
          "technologies": ["technologies used"],
          "features": ["key features to implement"],
          "challenges": ["potential challenges"],
          "tips": ["helpful tips for success"]
        }
      ],
      "projectSequence": [
        {
          "phase": "phase name",
          "projects": ["project titles for this phase"],
          "description": "phase description",
          "duration": "estimated duration"
        }
      ],
      "portfolioStrategy": {
        "diversity": "how to ensure project diversity",
        "progression": "how projects build on each other",
        "showcase": "how to showcase these projects"
      }
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recommendations = JSON.parse(response.text());

    // Save recommendations to database
    const savedProjects = [];
    for (const project of recommendations.projects) {
      const savedProject = await db
        .insert(ProjectRecommendation)
        .values({
          userId: user[0].id,
          projectTitle: project.title,
          projectDescription: project.description,
          requiredSkills: project.requiredSkills,
          difficultyLevel: project.difficultyLevel,
          estimatedTime: project.estimatedTime,
          resources: project.resources,
          portfolioValue: project.portfolioValue,
          isCompleted: false,
          createdAt: new Date().toISOString(),
        })
        .returning();

      savedProjects.push(savedProject[0]);
    }

    return NextResponse.json({
      success: true,
      recommendations: {
        ...recommendations,
        savedProjects,
      },
    });
  } catch (error) {
    console.error("Error generating project recommendations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST mark project as completed
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, isCompleted } = body;

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedProject = await db
      .update(ProjectRecommendation)
      .set({
        isCompleted: isCompleted || false,
      })
      .where(eq(ProjectRecommendation.id, projectId))
      .returning();

    return NextResponse.json({
      success: true,
      project: updatedProject[0],
    });
  } catch (error) {
    console.error("Error updating project status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
