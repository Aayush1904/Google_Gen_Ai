import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import {
  User,
  NetworkingConnection,
  UserProfile,
  SkillAssessment,
} from "@/configs/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// GET networking connections
export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const connectionType = searchParams.get("connectionType");
    const priority = searchParams.get("priority");

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

    // Generate networking connections using AI
    const prompt = `
    Generate relevant networking connection suggestions for this user profile:
    
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
    - Connection Type Filter: ${connectionType || "all"}
    - Priority Filter: ${priority || "all"}
    
    Return in JSON format:
    {
      "connections": [
        {
          "connectionName": "person's name",
          "connectionTitle": "person's job title",
          "company": "company name",
          "connectionType": "recruiter|alumni|team_lead|industry_expert|peer",
          "linkedinUrl": "LinkedIn profile URL",
          "connectionReason": "why this connection is valuable",
          "suggestedMessage": "personalized connection request message",
          "priority": "high|medium|low",
          "mutualConnections": ["mutual connections"],
          "sharedInterests": ["shared interests or skills"],
          "conversationStarters": ["suggested conversation topics"]
        }
      ],
      "networkingStrategy": {
        "approach": "overall networking approach",
        "timing": "best times to reach out",
        "followUp": "follow-up strategy",
        "valueProposition": "what value you can offer"
      }
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recommendations = JSON.parse(response.text());

    // Save connections to database
    const savedConnections = [];
    for (const connection of recommendations.connections) {
      const savedConnection = await db
        .insert(NetworkingConnection)
        .values({
          userId: user[0].id,
          connectionName: connection.connectionName,
          connectionTitle: connection.connectionTitle,
          company: connection.company,
          connectionType: connection.connectionType,
          linkedinUrl: connection.linkedinUrl,
          connectionReason: connection.connectionReason,
          suggestedMessage: connection.suggestedMessage,
          priority: connection.priority,
          connectionStatus: "suggested",
          suggestedAt: new Date().toISOString(),
        })
        .returning();

      savedConnections.push(savedConnection[0]);
    }

    return NextResponse.json({
      success: true,
      connections: savedConnections,
      networkingStrategy: recommendations.networkingStrategy,
    });
  } catch (error) {
    console.error("Error fetching networking connections:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST update connection status
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { connectionId, connectionStatus } = body;

    const user = await db
      .select()
      .from(User)
      .where(eq(User.clerkUserId, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData = { connectionStatus };
    if (connectionStatus === "connected") {
      updateData.connectedAt = new Date().toISOString();
    }

    const updatedConnection = await db
      .update(NetworkingConnection)
      .set(updateData)
      .where(eq(NetworkingConnection.id, connectionId))
      .returning();

    return NextResponse.json({
      success: true,
      connection: updatedConnection[0],
    });
  } catch (error) {
    console.error("Error updating connection status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET user's networking connections
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

    const connections = await db
      .select()
      .from(NetworkingConnection)
      .where(eq(NetworkingConnection.userId, user[0].id))
      .orderBy(NetworkingConnection.suggestedAt);

    return NextResponse.json({
      success: true,
      connections,
    });
  } catch (error) {
    console.error("Error fetching user connections:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
