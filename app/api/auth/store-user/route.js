import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "../../../../configs/db";
import { User } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        // Check if user already exists in the database
        const existingUser = await db
            .select()
            .from(User)
            .where(eq(User.clerkUserId, user.id))
            .limit(1);

        if (existingUser.length > 0) {
            return NextResponse.json({ message: "User already exists", user: existingUser[0] });
        }

        // Insert the new user into the database
        await db.insert(User).values({
            clerkUserId: user.id,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            imageUrl: user.imageUrl || "/placeholder.svg",
            email: user.emailAddresses[0]?.emailAddress || "",
            industry: null,
            industryInsight: null,
            bio: null,
            experience: 0,
            skills: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        return NextResponse.json({ message: "User stored successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Database error", error: error.message }, { status: 500 });
    }
}
