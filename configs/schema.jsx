import { boolean, doublePrecision, integer, json, jsonb, pgEnum, pgTable, real, serial, text, timestamp, varchar, vector } from "drizzle-orm/pg-core";
import { z } from "zod";

export const PathList= pgTable('PathList',{
    id : serial('id').primaryKey(),
    pathId: varchar('pathId').notNull(),
    name : varchar('name').notNull(),
    category: varchar('category').notNull(),
    level : varchar('level').notNull(),
    includeVideo : varchar('includeVideo').notNull().default('Yes'),
    pathOutput : json('pathOutput').notNull(),
    createdBy : varchar('createdBy').notNull(),
    userName : varchar('userName').notNull(),
    userProfileImage: varchar(' userProfileImage'),
    pathImage: varchar('pathImage').default('/placeholder.svg'),
    publish:boolean('publish').default(false)
});

export const Chapters=pgTable('chapters' , {
    id:serial('id').primaryKey(),
    pathId:varchar('pathId').notNull(),
    chapterId:integer('chapterId').notNull(),
    content:jsonb('content').notNull(),
    videoId:varchar('videoId').notNull()
})



export const Ideas = pgTable('ideas' , {
    id:serial('id').primaryKey(),
    content:varchar('content').notNull(),
    name:varchar('name').notNull(),
    vote:integer('vote').default(0),
    createdAt : varchar('createdAt').notNull(),
    comments: jsonb("comments").default([]), 
})

export const CourseLinks = pgTable("course_links", {
    id: serial("id").primaryKey(),
    pathId: varchar("pathId").notNull(),  
    title: varchar("title").notNull(),
    platform: varchar("platform").notNull(),
    description: text("description").notNull(),
    url: text("url").notNull(),
});


export const demandLevelEnum = pgEnum("demand_level", ["high", "medium", "low"]);
export const marketOutlookEnum = pgEnum("market_outlook", ["positive", "neutral", "negative"]);

export const IndustryInsight = pgTable("industry_insight", {
    id: serial("id").primaryKey(),
    industry: varchar("industry").notNull().unique(), 
    salaryRanges: json("salaryRanges").notNull(),
    growthRate: real("growthRate").notNull(), 
    demandLevel: demandLevelEnum("demandLevel").notNull(),
    topSkills:  varchar("topSkills").array().notNull(), 
    marketOutlook: marketOutlookEnum("marketOutlook").notNull(),
    keyTrends: varchar("keyTrends").array().notNull(),
    recommendedSkills:varchar("recommendedSkills").array().notNull(),
    lastUpdate : timestamp("lastUpdate", { mode: "date" }).notNull().defaultNow(),
    nextUpdate : timestamp("nextUpdate", { mode: "date" }).notNull()
});

export const User = pgTable("users", {
    id: serial("id").primaryKey(),
    clerkUserId: varchar("clerkUserId").notNull().unique(),
    email: varchar("email").notNull().unique(),
    name: varchar("name").notNull(),
    imageUrl: varchar("imageUrl").default("/placeholder.svg"),
    industry: varchar("industry"),
    industryInsight: integer("industryInsight").references(() => IndustryInsight.id, { onDelete: "set null" }), 
    bio: varchar("bio"),
    experience: integer("experience"),
    skills: varchar("skills").array().notNull(),
    createdAt: varchar("createdAt").notNull(),
    updatedAt: varchar("updatedAt").notNull(),
});

export const UserIndustry = pgTable("user_industry", {
    userId: integer("userId").references(() => User.id, { onDelete: "cascade" }),
    industryId: integer("industryId").references(() => IndustryInsight.id, { onDelete: "cascade" }),
});


export const onboardingSchema = z.object({
    industry: z.string({
        required_error: "Please select an industry",
    }),
    subIndustry: z.string({
        required_error: "Please select a specialisation",
    }),
    bio: z.string().max(500).optional(),
    experience : z
        .string()
        .transform((val) => parseInt(val , 10))
        .pipe(
            z
                .number()
                .min(0 , "Experience must be atleast 0 years")
                .max(50 , "Experience cannot exceed 50 years")
        ),
        skills : z.string().transform((val) => 
            val
                ? val
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                : undefined
        )
})

export const Assessments = pgTable("assessments", {
  id: serial("id").primaryKey(), // Changed from UUID to serial for consistency
  userId: integer("userId").notNull().references(() => User.id, { onDelete: "cascade" }), // Fixed reference
  quizScore: doublePrecision("quizScore").notNull(),
  questions: jsonb("questions").notNull(),
  category: text("category").notNull(),
  improvementTip: text("improvementTip"), 
  createdAt: varchar("createdAt").notNull(), // Made consistent with the User table
  updatedAt: varchar("updatedAt").notNull(),
});