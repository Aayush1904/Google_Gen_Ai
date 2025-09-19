import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import {
  User,
  CareerTrajectory,
  UserProfile,
  SkillAssessment,
} from "@/configs/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// GET career trajectory
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

    // Get user's current profile and skills
    const [profile] = await db
      .select()
      .from(UserProfile)
      .where(eq(UserProfile.userId, user[0].id))
      .limit(1);
    const assessments = await db
      .select()
      .from(SkillAssessment)
      .where(eq(SkillAssessment.userId, user[0].id));

    const currentRole = user[0].industry || "Entry Level";
    const currentSkills = profile?.extractedSkills || [];

    // Generate career trajectory using AI
    const prompt = `
    Create a detailed career trajectory from ${currentRole} to ${targetRole}:
    
    Current Profile:
    - Role: ${currentRole}
    - Experience: ${user[0].experience || 0} years
    - Skills: ${JSON.stringify(currentSkills)}
    - Industry: ${user[0].industry || "Technology"}
    
    Target Role: ${targetRole}
    
    Return in JSON format:
    {
      "currentRole": "${currentRole}",
      "targetRole": "${targetRole}",
      "trajectorySteps": [
        {
          "step": 1,
          "role": "role name",
          "description": "role description",
          "duration": "estimated duration",
          "requiredSkills": ["skills needed"],
          "responsibilities": ["key responsibilities"],
          "salaryRange": "salary range for this role",
          "learningObjectives": ["what to learn in this role"]
        }
      ],
      "estimatedTimeline": "total estimated timeline",
      "requiredSkills": ["all skills needed for the journey"],
      "salaryProgression": [
        {
          "role": "role name",
          "minSalary": "minimum salary",
          "maxSalary": "maximum salary",
          "averageSalary": "average salary"
        }
      ],
      "marketDemand": "current market demand for this trajectory",
      "alternativePaths": [
        {
          "path": "alternative path name",
          "description": "path description",
          "pros": ["advantages"],
          "cons": ["disadvantages"]
        }
      ],
      "keyMilestones": [
        {
          "milestone": "milestone name",
          "description": "milestone description",
          "timeline": "when to achieve this"
        }
      ]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const trajectory = JSON.parse(response.text());

    // Save trajectory to database
    const careerTrajectory = await db
      .insert(CareerTrajectory)
      .values({
        userId: user[0].id,
        currentRole,
        targetRole,
        trajectorySteps: trajectory.trajectorySteps,
        estimatedTimeline: trajectory.estimatedTimeline,
        requiredSkills: trajectory.requiredSkills,
        salaryProgression: trajectory.salaryProgression,
        marketDemand: trajectory.marketDemand,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      trajectory,
      careerTrajectory: careerTrajectory[0],
    });
  } catch (error) {
    console.error("Error generating career trajectory:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET saved career trajectories
export async function POST(request) {
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

    const trajectories = await db
      .select()
      .from(CareerTrajectory)
      .where(eq(CareerTrajectory.userId, user[0].id));

    return NextResponse.json({
      success: true,
      trajectories,
    });
  } catch (error) {
    console.error("Error fetching career trajectories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
