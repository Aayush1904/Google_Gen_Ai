-- Add missing columns to existing tables
-- This script adds the missing columns that are causing the database errors

-- Add missing columns to user_profiles table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "academicTranscript" jsonb;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "extractedSkills" varchar[];
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "workExperience" jsonb;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "education" jsonb;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "certifications" jsonb;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS "projects" jsonb;

-- Create new tables for career platform features
CREATE TABLE IF NOT EXISTS psychometric_tests (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "testType" VARCHAR NOT NULL,
    results JSONB NOT NULL,
    "personalityTraits" JSONB,
    "careerInterests" JSONB,
    "workStylePreferences" JSONB,
    "completedAt" VARCHAR NOT NULL,
    "createdAt" VARCHAR NOT NULL DEFAULT NOW()::text
);

CREATE TABLE IF NOT EXISTS skill_assessments (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "skillName" VARCHAR NOT NULL,
    "skillCategory" VARCHAR NOT NULL,
    "proficiencyLevel" VARCHAR NOT NULL,
    "assessmentScore" REAL NOT NULL,
    questions JSONB NOT NULL,
    answers JSONB NOT NULL,
    "improvementAreas" JSONB,
    "recommendedResources" JSONB,
    "completedAt" VARCHAR NOT NULL,
    "createdAt" VARCHAR NOT NULL DEFAULT NOW()::text
);

CREATE TABLE IF NOT EXISTS skill_gap_analysis (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "targetRole" VARCHAR NOT NULL,
    "currentSkills" JSONB NOT NULL,
    "requiredSkills" JSONB NOT NULL,
    "skillGaps" JSONB NOT NULL,
    "prioritySkills" JSONB NOT NULL,
    "learningPath" JSONB NOT NULL,
    "estimatedTimeToClose" VARCHAR NOT NULL,
    "createdAt" VARCHAR NOT NULL DEFAULT NOW()::text
);

CREATE TABLE IF NOT EXISTS career_trajectories (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "currentRole" VARCHAR NOT NULL,
    "targetRole" VARCHAR NOT NULL,
    "trajectorySteps" JSONB NOT NULL,
    "estimatedTimeline" JSONB NOT NULL,
    "requiredSkills" JSONB NOT NULL,
    "salaryProgression" JSONB NOT NULL,
    "marketDemand" JSONB NOT NULL,
    "createdAt" VARCHAR NOT NULL DEFAULT NOW()::text
);

CREATE TABLE IF NOT EXISTS market_insights (
    id SERIAL PRIMARY KEY,
    location VARCHAR NOT NULL,
    industry VARCHAR NOT NULL,
    "trendingSkills" VARCHAR[] NOT NULL,
    "inDemandJobs" JSONB NOT NULL,
    "topHiringCompanies" JSONB NOT NULL,
    "salaryData" JSONB NOT NULL,
    "marketTrends" JSONB NOT NULL,
    "lastUpdated" VARCHAR NOT NULL DEFAULT NOW()::text
);

CREATE TABLE IF NOT EXISTS learning_pathways (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "pathwayName" VARCHAR NOT NULL,
    "targetSkill" VARCHAR NOT NULL,
    "currentLevel" VARCHAR NOT NULL,
    "targetLevel" VARCHAR NOT NULL,
    courses JSONB NOT NULL,
    resources JSONB NOT NULL,
    timeline JSONB NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" VARCHAR NOT NULL DEFAULT NOW()::text,
    "updatedAt" VARCHAR NOT NULL DEFAULT NOW()::text
);

CREATE TABLE IF NOT EXISTS project_recommendations (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "projectTitle" VARCHAR NOT NULL,
    "projectDescription" TEXT NOT NULL,
    "requiredSkills" VARCHAR[] NOT NULL,
    "difficultyLevel" VARCHAR NOT NULL,
    "estimatedTime" VARCHAR NOT NULL,
    resources JSONB NOT NULL,
    "portfolioValue" VARCHAR NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" VARCHAR NOT NULL DEFAULT NOW()::text
);

CREATE TABLE IF NOT EXISTS mock_interviews (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "interviewType" VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    questions JSONB NOT NULL,
    answers JSONB NOT NULL,
    feedback JSONB NOT NULL,
    score REAL NOT NULL,
    strengths JSONB NOT NULL,
    "improvementAreas" JSONB NOT NULL,
    "completedAt" VARCHAR NOT NULL,
    "createdAt" VARCHAR NOT NULL DEFAULT NOW()::text
);

CREATE TABLE IF NOT EXISTS job_opportunities (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "jobTitle" VARCHAR NOT NULL,
    company VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "requiredSkills" VARCHAR[] NOT NULL,
    "salaryRange" VARCHAR NOT NULL,
    "jobType" VARCHAR NOT NULL,
    "experienceLevel" VARCHAR NOT NULL,
    "applicationUrl" TEXT NOT NULL,
    "matchScore" REAL NOT NULL,
    "isApplied" BOOLEAN NOT NULL DEFAULT FALSE,
    "applicationStatus" VARCHAR NOT NULL DEFAULT 'not_applied',
    source VARCHAR NOT NULL,
    "discoveredAt" VARCHAR NOT NULL DEFAULT NOW()::text,
    "applicationDate" VARCHAR
);

CREATE TABLE IF NOT EXISTS event_recommendations (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "eventTitle" VARCHAR NOT NULL,
    "eventType" VARCHAR NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR NOT NULL,
    date VARCHAR NOT NULL,
    time VARCHAR NOT NULL,
    organizer VARCHAR NOT NULL,
    "eventUrl" TEXT NOT NULL,
    "registrationUrl" TEXT NOT NULL,
    "relevanceScore" REAL NOT NULL,
    "isRegistered" BOOLEAN NOT NULL DEFAULT FALSE,
    "discoveredAt" VARCHAR NOT NULL DEFAULT NOW()::text
);

CREATE TABLE IF NOT EXISTS application_documents (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "jobOpportunityId" INTEGER REFERENCES job_opportunities(id) ON DELETE CASCADE,
    "documentType" VARCHAR NOT NULL,
    "originalContent" TEXT NOT NULL,
    "tailoredContent" TEXT NOT NULL,
    "jobRequirements" TEXT NOT NULL,
    "optimizationNotes" JSONB NOT NULL,
    "keywordsUsed" VARCHAR[] NOT NULL,
    "createdAt" VARCHAR NOT NULL DEFAULT NOW()::text,
    "updatedAt" VARCHAR NOT NULL DEFAULT NOW()::text
);

CREATE TABLE IF NOT EXISTS networking_connections (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "connectionName" VARCHAR NOT NULL,
    "connectionTitle" VARCHAR NOT NULL,
    company VARCHAR NOT NULL,
    "connectionType" VARCHAR NOT NULL,
    "linkedinUrl" TEXT NOT NULL,
    "connectionReason" TEXT NOT NULL,
    "suggestedMessage" TEXT NOT NULL,
    priority VARCHAR NOT NULL,
    "connectionStatus" VARCHAR NOT NULL DEFAULT 'suggested',
    "suggestedAt" VARCHAR NOT NULL DEFAULT NOW()::text
);

CREATE TABLE IF NOT EXISTS weekly_digests (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "weekStartDate" VARCHAR NOT NULL,
    "weekEndDate" VARCHAR NOT NULL,
    "newOpportunities" JSONB NOT NULL,
    "learningProgress" JSONB NOT NULL,
    "skillImprovements" JSONB NOT NULL,
    "upcomingEvents" JSONB NOT NULL,
    "networkingSuggestions" JSONB NOT NULL,
    "marketInsights" JSONB NOT NULL,
    achievements JSONB NOT NULL,
    "nextWeekGoals" JSONB NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" VARCHAR NOT NULL DEFAULT NOW()::text
);
