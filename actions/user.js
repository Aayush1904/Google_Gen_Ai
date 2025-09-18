"use server";

import { db } from "@/configs/db";
import { IndustryInsight, User } from "@/configs/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { generateAiInsights } from "./industry";
export async function updateUser(data) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.select().from(User).where(eq(User.clerkUserId, userId)).then(users => users[0]);

    if (!user) throw new Error("User not found");

    try {
        console.log("Updating user with data:", data);

        let industryInsight = await db
            .select()
            .from(IndustryInsight)
            .where(eq(IndustryInsight.industry, data.industry))
            .then(insights => insights[0]);

        if (!industryInsight) {
            const insights = await generateAiInsights(data.industry);
            
                    [industryInsight] = await db
                        .insert(IndustryInsight)
                        .values({
                            industry: data.industry,
                            ...insights,
                            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        })
                        .returning();
        }

        console.log("Updating user:", user.id);
        const updatedUser = await db
            .update(User)
            .set({
                industry: data.industry,
                bio: data.bio,
                skills: data.skills,
                experience: data.experience,
                industryInsight: industryInsight.id,
            })
            .where(eq(User.id, user.id))
            .returning()
            .then(res => res[0]);

        console.log("Update successful:", updatedUser);
        return { success: true, updatedUser, industryInsight };
    } catch (error) {
        console.error("Error updating user and industry:", error);
        throw new Error("Failed to update profile: " + error.message);
    }
}


export async function getUserOnboardingStatus() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.select({ industry: User.industry }).from(User).where(eq(User.clerkUserId, userId)).then(users => users[0]);

    return { isOnboarded: !!user?.industry };
}