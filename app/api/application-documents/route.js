import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import {
  User,
  ApplicationDocument,
  JobOpportunity,
  UserProfile,
} from "@/configs/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// GET application documents
export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobOpportunityId = searchParams.get("jobOpportunityId");

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let documents;
    if (jobOpportunityId) {
      documents = await db
        .select()
        .from(ApplicationDocument)
        .where(
          eq(ApplicationDocument.jobOpportunityId, parseInt(jobOpportunityId))
        );
    } else {
      documents = await db
        .select()
        .from(ApplicationDocument)
        .where(eq(ApplicationDocument.userId, user[0].id));
    }

    return NextResponse.json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("Error fetching application documents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create tailored application document
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { jobOpportunityId, documentType, originalContent, jobRequirements } =
      body;

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get job opportunity details
    const [jobOpportunity] = await db
      .select()
      .from(JobOpportunity)
      .where(eq(JobOpportunity.id, jobOpportunityId))
      .limit(1);

    if (!jobOpportunity) {
      return NextResponse.json(
        { error: "Job opportunity not found" },
        { status: 404 }
      );
    }

    // Get user profile for personalization
    const [profile] = await db
      .select()
      .from(UserProfile)
      .where(eq(UserProfile.userId, user[0].id))
      .limit(1);

    // Generate tailored document using AI
    const prompt = `
    Tailor this ${documentType} for the specific job application:
    
    Original Document:
    ${originalContent}
    
    Job Requirements:
    ${jobRequirements || jobOpportunity.jobDescription}
    
    Job Details:
    - Title: ${jobOpportunity.jobTitle}
    - Company: ${jobOpportunity.company}
    - Required Skills: ${JSON.stringify(jobOpportunity.requiredSkills)}
    
    User Profile:
    - Experience: ${user[0].experience || 0} years
    - Skills: ${JSON.stringify(profile?.extractedSkills || [])}
    - Industry: ${user[0].industry || "Technology"}
    
    Return in JSON format:
    {
      "tailoredContent": "tailored document content",
      "optimizationNotes": "notes on what was optimized",
      "keywordsUsed": ["keywords that were incorporated"],
      "improvements": [
        {
          "section": "document section",
          "improvement": "what was improved",
          "reason": "why this improvement was made"
        }
      ],
      "matchScore": "how well the document matches the job requirements",
      "suggestions": ["additional suggestions for improvement"]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const optimization = JSON.parse(response.text());

    // Save document to database
    const document = await db
      .insert(ApplicationDocument)
      .values({
        userId: user[0].id,
        jobOpportunityId: parseInt(jobOpportunityId),
        documentType,
        originalContent,
        tailoredContent: optimization.tailoredContent,
        jobRequirements: jobRequirements || jobOpportunity.jobDescription,
        optimizationNotes: optimization.optimizationNotes,
        keywordsUsed: optimization.keywordsUsed,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      document: document[0],
      optimization,
    });
  } catch (error) {
    console.error("Error creating application document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update application document
export async function PUT(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { documentId, tailoredContent } = body;

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedDocument = await db
      .update(ApplicationDocument)
      .set({
        tailoredContent,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(ApplicationDocument.id, documentId))
      .returning();

    return NextResponse.json({
      success: true,
      document: updatedDocument[0],
    });
  } catch (error) {
    console.error("Error updating application document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
