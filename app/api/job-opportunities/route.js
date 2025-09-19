import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import {
  User,
  JobOpportunity,
  UserProfile,
  SkillAssessment,
} from "@/configs/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// GET job opportunities
export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location") || "India";
    const limit = parseInt(searchParams.get("limit")) || 10;

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's profile and skills for matching
    const [profile] = await db
      .select()
      .from(UserProfile)
      .where(eq(UserProfile.userId, user[0].id))
      .limit(1);
    const assessments = await db
      .select()
      .from(SkillAssessment)
      .where(eq(SkillAssessment.userId, user[0].id));

    // Generate job opportunities using AI (in real implementation, this would integrate with job boards)
    const prompt = `
    Generate relevant job opportunities for this user profile:
    
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
    - Location: ${location}
    
    Return in JSON format:
    {
      "opportunities": [
        {
          "jobTitle": "job title",
          "company": "company name",
          "location": "job location",
          "jobDescription": "detailed job description",
          "requiredSkills": ["required skills"],
          "salaryRange": "salary range",
          "jobType": "full_time|part_time|contract|internship",
          "experienceLevel": "entry|mid|senior|lead",
          "applicationUrl": "application URL",
          "matchScore": "match score out of 100",
          "matchReasons": ["reasons for match"],
          "source": "linkedin|indeed|company_website|other"
        }
      ],
      "searchSummary": {
        "totalFound": "total opportunities found",
        "averageMatchScore": "average match score",
        "topSkills": ["most in-demand skills"],
        "salaryTrends": "salary trend information"
      }
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const opportunities = JSON.parse(response.text());

    // Save opportunities to database
    const savedOpportunities = [];
    for (const opportunity of opportunities.opportunities.slice(0, limit)) {
      const savedOpportunity = await db
        .insert(JobOpportunity)
        .values({
          userId: user[0].id,
          jobTitle: opportunity.jobTitle,
          company: opportunity.company,
          location: opportunity.location,
          jobDescription: opportunity.jobDescription,
          requiredSkills: opportunity.requiredSkills,
          salaryRange: opportunity.salaryRange,
          jobType: opportunity.jobType,
          experienceLevel: opportunity.experienceLevel,
          applicationUrl: opportunity.applicationUrl,
          matchScore: parseFloat(opportunity.matchScore),
          isApplied: false,
          applicationStatus: "not_applied",
          source: opportunity.source,
          discoveredAt: new Date().toISOString(),
        })
        .returning();

      savedOpportunities.push(savedOpportunity[0]);
    }

    return NextResponse.json({
      success: true,
      opportunities: savedOpportunities,
      searchSummary: opportunities.searchSummary,
    });
  } catch (error) {
    console.error("Error fetching job opportunities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST apply to job opportunity
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { opportunityId, applicationStatus } = body;

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedOpportunity = await db
      .update(JobOpportunity)
      .set({
        isApplied: true,
        applicationStatus: applicationStatus || "applied",
        applicationDate: new Date().toISOString(),
      })
      .where(eq(JobOpportunity.id, opportunityId))
      .returning();

    return NextResponse.json({
      success: true,
      opportunity: updatedOpportunity[0],
    });
  } catch (error) {
    console.error("Error updating job application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET user's job applications
export async function PUT(request) {
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

    const applications = await db
      .select()
      .from(JobOpportunity)
      .where(eq(JobOpportunity.userId, user[0].id))
      .orderBy(JobOpportunity.discoveredAt);

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
