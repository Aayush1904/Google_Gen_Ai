import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import {
  User,
  EventRecommendation,
  UserProfile,
  SkillAssessment,
} from "@/configs/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// GET event recommendations
export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location") || "India";
    const eventType = searchParams.get("eventType");
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

    // Generate event recommendations using AI
    const prompt = `
    Generate relevant event recommendations for this user profile:
    
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
    - Event Type Filter: ${eventType || "all"}
    
    Return in JSON format:
    {
      "events": [
        {
          "eventTitle": "event title",
          "eventType": "conference|workshop|meetup|hackathon|webinar",
          "description": "detailed event description",
          "location": "event location",
          "date": "event date",
          "time": "event time",
          "organizer": "event organizer",
          "eventUrl": "event URL",
          "registrationUrl": "registration URL",
          "relevanceScore": "relevance score out of 100",
          "relevanceReasons": ["reasons for relevance"],
          "topics": ["event topics"],
          "speakers": ["notable speakers"],
          "cost": "event cost",
          "format": "in-person|online|hybrid"
        }
      ],
      "recommendationSummary": {
        "totalFound": "total events found",
        "averageRelevanceScore": "average relevance score",
        "upcomingEvents": "number of upcoming events",
        "eventTypes": ["types of events found"]
      }
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recommendations = JSON.parse(response.text());

    // Save recommendations to database
    const savedEvents = [];
    for (const event of recommendations.events.slice(0, limit)) {
      const savedEvent = await db
        .insert(EventRecommendation)
        .values({
          userId: user[0].id,
          eventTitle: event.eventTitle,
          eventType: event.eventType,
          description: event.description,
          location: event.location,
          date: event.date,
          time: event.time,
          organizer: event.organizer,
          eventUrl: event.eventUrl,
          registrationUrl: event.registrationUrl,
          relevanceScore: parseFloat(event.relevanceScore),
          isRegistered: false,
          discoveredAt: new Date().toISOString(),
        })
        .returning();

      savedEvents.push(savedEvent[0]);
    }

    return NextResponse.json({
      success: true,
      events: savedEvents,
      recommendationSummary: recommendations.recommendationSummary,
    });
  } catch (error) {
    console.error("Error fetching event recommendations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST register for event
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { eventId } = body;

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedEvent = await db
      .update(EventRecommendation)
      .set({
        isRegistered: true,
      })
      .where(eq(EventRecommendation.id, eventId))
      .returning();

    return NextResponse.json({
      success: true,
      event: updatedEvent[0],
    });
  } catch (error) {
    console.error("Error registering for event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET user's event registrations
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

    const events = await db
      .select()
      .from(EventRecommendation)
      .where(eq(EventRecommendation.userId, user[0].id))
      .orderBy(EventRecommendation.date);

    return NextResponse.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Error fetching user events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
