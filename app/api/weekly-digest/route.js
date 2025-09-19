import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import {
  User,
  WeeklyDigest,
  JobOpportunity,
  EventRecommendation,
  LearningPathway,
  SkillAssessment,
} from "@/configs/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// GET weekly digest
export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const weekStartDate = searchParams.get("weekStartDate");
    const weekEndDate = searchParams.get("weekEndDate");

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate week dates if not provided
    const now = new Date();
    const startOfWeek = weekStartDate
      ? new Date(weekStartDate)
      : new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = weekEndDate
      ? new Date(weekEndDate)
      : new Date(now.setDate(now.getDate() - now.getDay() + 6));

    // Check if digest already exists for this week
    const existingDigest = await db
      .select()
      .from(WeeklyDigest)
      .where(
        and(
          eq(WeeklyDigest.userId, user[0].id),
          eq(WeeklyDigest.weekStartDate, startOfWeek.toISOString()),
          eq(WeeklyDigest.weekEndDate, endOfWeek.toISOString())
        )
      )
      .limit(1);

    if (existingDigest.length > 0) {
      return NextResponse.json({
        success: true,
        digest: existingDigest[0],
        fromCache: true,
      });
    }

    // Gather data for the week
    const newOpportunities = await db
      .select()
      .from(JobOpportunity)
      .where(
        and(
          eq(JobOpportunity.userId, user[0].id),
          gte(JobOpportunity.discoveredAt, startOfWeek.toISOString()),
          lte(JobOpportunity.discoveredAt, endOfWeek.toISOString())
        )
      );

    const upcomingEvents = await db
      .select()
      .from(EventRecommendation)
      .where(
        and(
          eq(EventRecommendation.userId, user[0].id),
          gte(EventRecommendation.date, startOfWeek.toISOString())
        )
      );

    const learningProgress = await db
      .select()
      .from(LearningPathway)
      .where(eq(LearningPathway.userId, user[0].id));

    const skillImprovements = await db
      .select()
      .from(SkillAssessment)
      .where(
        and(
          eq(SkillAssessment.userId, user[0].id),
          gte(SkillAssessment.completedAt, startOfWeek.toISOString())
        )
      );

    // Generate weekly digest using AI
    const prompt = `
    Generate a comprehensive weekly digest for this user:
    
    User Profile:
    - Experience: ${user[0].experience || 0} years
    - Industry: ${user[0].industry || "Technology"}
    - Week: ${startOfWeek.toDateString()} to ${endOfWeek.toDateString()}
    
    Weekly Data:
    - New Job Opportunities: ${newOpportunities.length}
    - Upcoming Events: ${upcomingEvents.length}
    - Learning Pathways: ${learningProgress.length}
    - Skill Assessments Completed: ${skillImprovements.length}
    
    Return in JSON format:
    {
      "newOpportunities": {
        "count": ${newOpportunities.length},
        "highlights": ["key opportunity highlights"],
        "topMatches": ["top matching opportunities"]
      },
      "learningProgress": {
        "pathwaysActive": ${learningProgress.length},
        "progressMade": "summary of learning progress",
        "achievements": ["learning achievements this week"]
      },
      "skillImprovements": {
        "assessmentsCompleted": ${skillImprovements.length},
        "skillsImproved": ["skills that improved"],
        "nextFocus": ["skills to focus on next"]
      },
      "upcomingEvents": {
        "count": ${upcomingEvents.length},
        "highlights": ["key upcoming events"],
        "recommendations": ["event recommendations"]
      },
      "networkingSuggestions": [
        {
          "action": "networking action",
          "reason": "why this is important",
          "timeline": "when to do this"
        }
      ],
      "marketInsights": {
        "trends": ["market trends relevant to user"],
        "opportunities": ["market opportunities"],
        "advice": ["market advice"]
      },
      "achievements": [
        {
          "achievement": "achievement description",
          "impact": "impact of this achievement"
        }
      ],
      "nextWeekGoals": [
        {
          "goal": "goal description",
          "priority": "high|medium|low",
          "actionItems": ["specific action items"]
        }
      ],
      "motivationalMessage": "personalized motivational message"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const digest = JSON.parse(response.text());

    // Save digest to database
    const weeklyDigest = await db
      .insert(WeeklyDigest)
      .values({
        userId: user[0].id,
        weekStartDate: startOfWeek.toISOString(),
        weekEndDate: endOfWeek.toISOString(),
        newOpportunities: digest.newOpportunities,
        learningProgress: digest.learningProgress,
        skillImprovements: digest.skillImprovements,
        upcomingEvents: digest.upcomingEvents,
        networkingSuggestions: digest.networkingSuggestions,
        marketInsights: digest.marketInsights,
        achievements: digest.achievements,
        nextWeekGoals: digest.nextWeekGoals,
        isRead: false,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      digest: {
        ...digest,
        id: weeklyDigest[0].id,
        weekStartDate: weeklyDigest[0].weekStartDate,
        weekEndDate: weeklyDigest[0].weekEndDate,
        isRead: weeklyDigest[0].isRead,
      },
      fromCache: false,
    });
  } catch (error) {
    console.error("Error generating weekly digest:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST mark digest as read
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { digestId } = body;

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedDigest = await db
      .update(WeeklyDigest)
      .set({
        isRead: true,
      })
      .where(eq(WeeklyDigest.id, digestId))
      .returning();

    return NextResponse.json({
      success: true,
      digest: updatedDigest[0],
    });
  } catch (error) {
    console.error("Error marking digest as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET all user digests
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

    const digests = await db
      .select()
      .from(WeeklyDigest)
      .where(eq(WeeklyDigest.userId, user[0].id))
      .orderBy(WeeklyDigest.weekStartDate);

    return NextResponse.json({
      success: true,
      digests,
    });
  } catch (error) {
    console.error("Error fetching user digests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
