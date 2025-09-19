import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { UserProfile, User } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// GET user profile
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

    const profile = await db
      .select()
      .from(UserProfile)
      .where(eq(UserProfile.userId, user[0].id))
      .limit(1);

    return NextResponse.json({
      success: true,
      profile: profile[0] || null,
      user: user[0],
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create/update user profile
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      resumeUrl,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      academicTranscript,
      workExperience,
      education,
      certifications,
      projects,
    } = body;

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract skills using AI if resume URL is provided
    let extractedSkills = [];
    if (resumeUrl) {
      try {
        const prompt = `Extract technical and soft skills from this resume URL: ${resumeUrl}. Return a JSON array of skills.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const skillsText = response.text();

        // Parse the AI response to extract skills
        const skillsMatch = skillsText.match(/\[(.*?)\]/);
        if (skillsMatch) {
          extractedSkills = JSON.parse(skillsMatch[0]);
        }
      } catch (error) {
        console.error("Error extracting skills:", error);
        extractedSkills = []; // Default to empty array if parsing fails
      }
    }

    // Ensure extractedSkills is always a valid JSON object/array
    if (!extractedSkills) {
      extractedSkills = [];
    }

    const existingProfile = await db
      .select()
      .from(UserProfile)
      .where(eq(UserProfile.userId, user[0].id))
      .limit(1);

    const profileData = {
      userId: user[0].id,
      resumeUrl: resumeUrl || null,
      linkedinUrl: linkedinUrl || null,
      githubUrl: githubUrl || null,
      portfolioUrl: portfolioUrl || null,
      academicTranscript: academicTranscript || null,
      extractedSkills,
      workExperience: workExperience || null,
      education: education || null,
      certifications: certifications || null,
      projects: projects || null,
      createdAt: existingProfile.length
        ? existingProfile[0].createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let result;
    if (existingProfile.length) {
      result = await db
        .update(UserProfile)
        .set(profileData)
        .where(eq(UserProfile.userId, user[0].id))
        .returning();
    } else {
      result = await db.insert(UserProfile).values(profileData).returning();
    }

    return NextResponse.json({
      success: true,
      profile: result[0],
      extractedSkills,
    });
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
