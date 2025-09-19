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

// User Profiling & Assessment Tables
export const UserProfile = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => User.id, { onDelete: "cascade" }),
  resumeUrl: varchar("resumeUrl"),
  linkedinUrl: varchar("linkedinUrl"),
  githubUrl: varchar("githubUrl"),
  portfolioUrl: varchar("portfolioUrl"),
  academicTranscript: jsonb("academicTranscript"),
  extractedSkills: jsonb("extractedSkills"),
  workExperience: jsonb("workExperience"),
  education: jsonb("education"),
  certifications: jsonb("certifications"),
  projects: jsonb("projects"),
  createdAt: varchar("createdAt").notNull(),
  updatedAt: varchar("updatedAt").notNull(),
});

export const PsychometricTest = pgTable("psychometric_tests", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => User.id, { onDelete: "cascade" }),
  testType: varchar("testType").notNull(), // holland_codes, big_five, etc.
  results: jsonb("results").notNull(),
  personalityTraits: jsonb("personalityTraits"),
  careerInterests: jsonb("careerInterests"),
  workStylePreferences: jsonb("workStylePreferences"),
  completedAt: varchar("completedAt").notNull(),
});

export const SkillAssessment = pgTable("skill_assessments", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => User.id, { onDelete: "cascade" }),
  skillName: varchar("skillName").notNull(),
  skillCategory: varchar("skillCategory").notNull(),
  proficiencyLevel: varchar("proficiencyLevel").notNull(), // beginner, intermediate, advanced, expert
  assessmentScore: doublePrecision("assessmentScore"),
  questions: jsonb("questions"),
  answers: jsonb("answers"),
  improvementAreas: varchar("improvementAreas").array(),
  recommendedResources: jsonb("recommendedResources"),
  completedAt: varchar("completedAt").notNull(),
});

// Analysis & Visualization Tables
export const CareerTrajectory = pgTable("career_trajectories", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => User.id, { onDelete: "cascade" }),
  currentRole: varchar("currentRole").notNull(),
  targetRole: varchar("targetRole").notNull(),
  trajectorySteps: jsonb("trajectorySteps").notNull(),
  estimatedTimeline: varchar("estimatedTimeline"),
  requiredSkills: varchar("requiredSkills").array(),
  salaryProgression: jsonb("salaryProgression"),
  marketDemand: varchar("marketDemand"),
  createdAt: varchar("createdAt").notNull(),
});

export const SkillGapAnalysis = pgTable("skill_gap_analyses", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => User.id, { onDelete: "cascade" }),
  targetRole: varchar("targetRole").notNull(),
  currentSkills: jsonb("currentSkills").notNull(),
  requiredSkills: jsonb("requiredSkills").notNull(),
  skillGaps: jsonb("skillGaps").notNull(),
  prioritySkills: varchar("prioritySkills").array(),
  learningPath: jsonb("learningPath"),
  estimatedTimeToClose: varchar("estimatedTimeToClose"),
  createdAt: varchar("createdAt").notNull(),
});

export const MarketInsights = pgTable("market_insights", {
  id: serial("id").primaryKey(),
  location: varchar("location").notNull(),
  industry: varchar("industry").notNull(),
  trendingSkills: varchar("trendingSkills").array(),
  inDemandJobs: jsonb("inDemandJobs"),
  topHiringCompanies: jsonb("topHiringCompanies"),
  salaryData: jsonb("salaryData"),
  marketTrends: jsonb("marketTrends"),
  lastUpdated: varchar("lastUpdated").notNull(),
});

// Guidance & Development Tables
export const LearningPathway = pgTable("learning_pathways", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => User.id, { onDelete: "cascade" }),
  pathwayName: varchar("pathwayName").notNull(),
  targetSkill: varchar("targetSkill").notNull(),
  currentLevel: varchar("currentLevel").notNull(),
  targetLevel: varchar("targetLevel").notNull(),
  courses: jsonb("courses").notNull(),
  resources: jsonb("resources"),
  timeline: varchar("timeline"),
  progress: doublePrecision("progress").default(0),
  isCompleted: boolean("isCompleted").default(false),
  createdAt: varchar("createdAt").notNull(),
  updatedAt: varchar("updatedAt").notNull(),
});

export const ProjectRecommendation = pgTable("project_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => User.id, { onDelete: "cascade" }),
  projectTitle: varchar("projectTitle").notNull(),
  projectDescription: text("projectDescription").notNull(),
  requiredSkills: varchar("requiredSkills").array(),
  difficultyLevel: varchar("difficultyLevel").notNull(),
  estimatedTime: varchar("estimatedTime"),
  resources: jsonb("resources"),
  portfolioValue: varchar("portfolioValue"),
  isCompleted: boolean("isCompleted").default(false),
  createdAt: varchar("createdAt").notNull(),
});

export const MockInterview = pgTable("mock_interviews", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => User.id, { onDelete: "cascade" }),
  interviewType: varchar("interviewType").notNull(), // behavioral, technical, system_design
  role: varchar("role").notNull(),
  questions: jsonb("questions").notNull(),
  answers: jsonb("answers"),
  feedback: jsonb("feedback"),
  score: doublePrecision("score"),
  strengths: varchar("strengths").array(),
  improvementAreas: varchar("improvementAreas").array(),
  completedAt: varchar("completedAt"),
  createdAt: varchar("createdAt").notNull(),
});

export const MentorMatch = pgTable("mentor_matches", {
  id: serial("id").primaryKey(),
  menteeId: integer("menteeId").notNull().references(() => User.id, { onDelete: "cascade" }),
  mentorId: integer("mentorId").notNull().references(() => User.id, { onDelete: "cascade" }),
  matchScore: doublePrecision("matchScore").notNull(),
  matchReasons: varchar("matchReasons").array(),
  status: varchar("status").notNull().default("pending"), // pending, accepted, rejected, active, completed
  menteeGoals: text("menteeGoals"),
  mentorExpertise: varchar("mentorExpertise").array(),
  communicationPreferences: jsonb("communicationPreferences"),
  matchedAt: varchar("matchedAt").notNull(),
  lastInteraction: varchar("lastInteraction"),
});

// Agentic Automations Tables
export const JobOpportunity = pgTable("job_opportunities", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => User.id, { onDelete: "cascade" }),
  jobTitle: varchar("jobTitle").notNull(),
  company: varchar("company").notNull(),
  location: varchar("location").notNull(),
  jobDescription: text("jobDescription").notNull(),
  requiredSkills: varchar("requiredSkills").array(),
  salaryRange: varchar("salaryRange"),
  jobType: varchar("jobType"), // full_time, part_time, contract, internship
  experienceLevel: varchar("experienceLevel"),
  applicationUrl: varchar("applicationUrl"),
  matchScore: doublePrecision("matchScore"),
  isApplied: boolean("isApplied").default(false),
  applicationStatus: varchar("applicationStatus").default("not_applied"),
  applicationDate: varchar("applicationDate"),
  source: varchar("source"), // linkedin, indeed, company_website, etc.
  discoveredAt: varchar("discoveredAt").notNull(),
});

export const EventRecommendation = pgTable("event_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => User.id, { onDelete: "cascade" }),
  eventTitle: varchar("eventTitle").notNull(),
  eventType: varchar("eventType").notNull(), // conference, workshop, meetup, hackathon
  description: text("description").notNull(),
  location: varchar("location").notNull(),
  date: varchar("date").notNull(),
  time: varchar("time"),
  organizer: varchar("organizer"),
  eventUrl: varchar("eventUrl"),
  registrationUrl: varchar("registrationUrl"),
  relevanceScore: doublePrecision("relevanceScore"),
  isRegistered: boolean("isRegistered").default(false),
  discoveredAt: varchar("discoveredAt").notNull(),
});

export const ApplicationDocument = pgTable("application_documents", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => User.id, { onDelete: "cascade" }),
  jobOpportunityId: integer("jobOpportunityId").references(() => JobOpportunity.id, { onDelete: "cascade" }),
  documentType: varchar("documentType").notNull(), // resume, cover_letter, application_response
  originalContent: text("originalContent"),
  tailoredContent: text("tailoredContent"),
  jobRequirements: text("jobRequirements"),
  optimizationNotes: text("optimizationNotes"),
  keywordsUsed: varchar("keywordsUsed").array(),
  createdAt: varchar("createdAt").notNull(),
  updatedAt: varchar("updatedAt").notNull(),
});

export const WeeklyDigest = pgTable("weekly_digests", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => User.id, { onDelete: "cascade" }),
  weekStartDate: varchar("weekStartDate").notNull(),
  weekEndDate: varchar("weekEndDate").notNull(),
  newOpportunities: jsonb("newOpportunities"),
  learningProgress: jsonb("learningProgress"),
  skillImprovements: jsonb("skillImprovements"),
  upcomingEvents: jsonb("upcomingEvents"),
  networkingSuggestions: jsonb("networkingSuggestions"),
  marketInsights: jsonb("marketInsights"),
  achievements: jsonb("achievements"),
  nextWeekGoals: jsonb("nextWeekGoals"),
  isRead: boolean("isRead").default(false),
  createdAt: varchar("createdAt").notNull(),
});

export const NetworkingConnection = pgTable("networking_connections", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => User.id, { onDelete: "cascade" }),
  connectionName: varchar("connectionName").notNull(),
  connectionTitle: varchar("connectionTitle"),
  company: varchar("company"),
  connectionType: varchar("connectionType").notNull(), // recruiter, alumni, team_lead, industry_expert
  linkedinUrl: varchar("linkedinUrl"),
  connectionReason: text("connectionReason"),
  suggestedMessage: text("suggestedMessage"),
  connectionStatus: varchar("connectionStatus").default("suggested"), // suggested, message_sent, connected, declined
  priority: varchar("priority").default("medium"), // high, medium, low
  suggestedAt: varchar("suggestedAt").notNull(),
  connectedAt: varchar("connectedAt"),
});