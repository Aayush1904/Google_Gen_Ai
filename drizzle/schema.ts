import { pgTable, serial, varchar, json, boolean, integer, jsonb, text, unique, real, timestamp, foreignKey, doublePrecision, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const demandLevel = pgEnum("demand_level", ['high', 'medium', 'low'])
export const marketOutlook = pgEnum("market_outlook", ['positive', 'neutral', 'negative'])


export const pathList = pgTable("PathList", {
	id: serial().primaryKey().notNull(),
	pathId: varchar().notNull(),
	name: varchar().notNull(),
	category: varchar().notNull(),
	level: varchar().notNull(),
	pathOutput: json().notNull(),
	createdBy: varchar().notNull(),
	userName: varchar().notNull(),
	userProfileImage: varchar(" userProfileImage"),
	includeVideo: varchar().default('Yes').notNull(),
	pathImage: varchar().default('/placeholder.svg'),
	publish: boolean().default(false),
});

export const chapters = pgTable("chapters", {
	id: serial().primaryKey().notNull(),
	pathId: varchar().notNull(),
	chapterId: integer().notNull(),
	content: jsonb().notNull(),
	videoId: varchar().notNull(),
});

export const courseLinks = pgTable("course_links", {
	id: serial().primaryKey().notNull(),
	pathId: varchar().notNull(),
	title: varchar().notNull(),
	platform: varchar().notNull(),
	description: text().notNull(),
	url: text().notNull(),
});

export const industryInsight = pgTable("industry_insight", {
	id: serial().primaryKey().notNull(),
	industry: varchar().notNull(),
	salaryRanges: json().notNull(),
	growthRate: real().notNull(),
	demandLevel: demandLevel().notNull(),
	topSkills: varchar().array().notNull(),
	marketOutlook: marketOutlook().notNull(),
	keyTrends: varchar().array().notNull(),
	recommendedSkills: varchar().array().notNull(),
	lastUpdate: timestamp({ mode: 'string' }).defaultNow().notNull(),
	nextUpdate: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	unique("industry_insight_industry_unique").on(table.industry),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	clerkUserId: varchar().notNull(),
	email: varchar().notNull(),
	name: varchar().notNull(),
	imageUrl: varchar().default('/placeholder.svg'),
	industry: varchar(),
	industryInsight: integer(),
	bio: varchar(),
	experience: integer(),
	skills: varchar().array().notNull(),
	createdAt: varchar().notNull(),
	updatedAt: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.industryInsight],
			foreignColumns: [industryInsight.id],
			name: "users_industryInsight_industry_insight_id_fk"
		}).onDelete("set null"),
	unique("users_clerkUserId_unique").on(table.clerkUserId),
	unique("users_email_unique").on(table.email),
]);

export const userIndustry = pgTable("user_industry", {
	userId: integer(),
	industryId: integer(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_industry_userId_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.industryId],
			foreignColumns: [industryInsight.id],
			name: "user_industry_industryId_industry_insight_id_fk"
		}).onDelete("cascade"),
]);

export const assessments = pgTable("assessments", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	quizScore: doublePrecision().notNull(),
	questions: jsonb().notNull(),
	category: text().notNull(),
	improvementTip: text(),
	createdAt: varchar().notNull(),
	updatedAt: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "assessments_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const ideas = pgTable("ideas", {
	id: serial().primaryKey().notNull(),
	content: varchar().notNull(),
	name: varchar().notNull(),
	vote: integer().default(0),
	createdAt: varchar().notNull(),
	comments: jsonb().default([]),
});

export const careerTrajectories = pgTable("career_trajectories", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	currentRole: varchar().notNull(),
	targetRole: varchar().notNull(),
	careerPath: jsonb().notNull(),
	salaryProgression: jsonb().notNull(),
	skillRequirements: jsonb().notNull(),
	estimatedTimeline: integer(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "career_trajectories_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const applicationAssistants = pgTable("application_assistants", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	jobId: integer().notNull(),
	documentType: varchar().notNull(),
	originalContent: text().notNull(),
	tailoredContent: text().notNull(),
	changes: jsonb().default([]),
	isApproved: boolean().default(false),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "application_assistants_userId_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.jobId],
			foreignColumns: [jobOpportunities.id],
			name: "application_assistants_jobId_job_opportunities_id_fk"
		}).onDelete("cascade"),
]);

export const events = pgTable("events", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	title: varchar().notNull(),
	description: text(),
	type: varchar().notNull(),
	location: varchar().notNull(),
	url: text(),
	startDate: timestamp({ mode: 'string' }).notNull(),
	endDate: timestamp({ mode: 'string' }),
	isOnline: boolean().default(false),
	isAttending: boolean().default(false),
	relevanceScore: doublePrecision(),
	foundAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "events_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const freelanceGigs = pgTable("freelance_gigs", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	title: varchar().notNull(),
	description: text().notNull(),
	client: varchar(),
	platform: varchar().notNull(),
	url: text().notNull(),
	budget: jsonb().default({}),
	skills: jsonb().default([]),
	duration: varchar(),
	matchScore: doublePrecision(),
	applicationStatus: varchar().default('not_applied'),
	foundAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "freelance_gigs_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const learningPaths = pgTable("learning_paths", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	title: varchar().notNull(),
	description: text(),
	targetRole: varchar().notNull(),
	skillGaps: jsonb().notNull(),
	modules: jsonb().notNull(),
	estimatedDuration: integer(),
	progress: doublePrecision().default(0),
	status: varchar().default('active'),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "learning_paths_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const courseRecommendations = pgTable("course_recommendations", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	courseTitle: varchar().notNull(),
	platform: varchar().notNull(),
	url: text().notNull(),
	skill: varchar().notNull(),
	level: varchar().notNull(),
	duration: varchar(),
	rating: doublePrecision(),
	price: doublePrecision(),
	isCompleted: boolean().default(false),
	recommendedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "course_recommendations_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const learningSchedules = pgTable("learning_schedules", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	learningPathId: integer().notNull(),
	scheduledTime: timestamp({ mode: 'string' }).notNull(),
	duration: integer().notNull(),
	isCompleted: boolean().default(false),
	completedAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "learning_schedules_userId_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.learningPathId],
			foreignColumns: [learningPaths.id],
			name: "learning_schedules_learningPathId_learning_paths_id_fk"
		}).onDelete("cascade"),
]);

export const marketInsights = pgTable("market_insights", {
	id: serial().primaryKey().notNull(),
	location: varchar().notNull(),
	industry: varchar().notNull(),
	trendingSkills: jsonb().notNull(),
	inDemandJobs: jsonb().notNull(),
	topHiringCompanies: jsonb().notNull(),
	salaryData: jsonb().notNull(),
	marketTrends: jsonb().notNull(),
	lastUpdated: timestamp({ mode: 'string' }).defaultNow().notNull(),
});

export const jobOpportunities = pgTable("job_opportunities", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	title: varchar().notNull(),
	company: varchar().notNull(),
	location: varchar().notNull(),
	url: text().notNull(),
	description: text(),
	requirements: jsonb().default([]),
	salary: jsonb().default({}),
	matchScore: doublePrecision(),
	applicationStatus: varchar().default('not_applied'),
	applicationDate: timestamp({ mode: 'string' }),
	deadline: timestamp({ mode: 'string' }),
	isBookmarked: boolean().default(false),
	foundAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "job_opportunities_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const documentTemplates = pgTable("document_templates", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	documentType: varchar().notNull(),
	templateName: varchar().notNull(),
	content: text().notNull(),
	jobDescription: text(),
	isActive: boolean().default(true),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "document_templates_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const mentorConnections = pgTable("mentor_connections", {
	id: serial().primaryKey().notNull(),
	menteeId: integer().notNull(),
	mentorId: integer().notNull(),
	status: varchar().default('pending'),
	industry: varchar().notNull(),
	goals: text(),
	startDate: timestamp({ mode: 'string' }),
	endDate: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.menteeId],
			foreignColumns: [users.id],
			name: "mentor_connections_menteeId_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.mentorId],
			foreignColumns: [users.id],
			name: "mentor_connections_mentorId_users_id_fk"
		}).onDelete("cascade"),
]);

export const projectIdeas = pgTable("project_ideas", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	title: varchar().notNull(),
	description: text().notNull(),
	skills: jsonb().notNull(),
	difficulty: varchar().notNull(),
	estimatedTime: varchar().notNull(),
	resources: jsonb().default([]),
	isCompleted: boolean().default(false),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "project_ideas_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const psychometricTests = pgTable("psychometric_tests", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	testType: varchar().notNull(),
	testResults: jsonb().notNull(),
	completedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "psychometric_tests_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const salaryBenchmarks = pgTable("salary_benchmarks", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	role: varchar().notNull(),
	location: varchar().notNull(),
	experience: integer().notNull(),
	currentSalary: doublePrecision(),
	marketAverage: doublePrecision().notNull(),
	marketRange: jsonb().notNull(),
	comparison: jsonb().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "salary_benchmarks_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const skillAssessments = pgTable("skill_assessments", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	skillName: varchar().notNull(),
	skillCategory: varchar().notNull(),
	proficiencyLevel: varchar().notNull(),
	assessmentScore: doublePrecision().notNull(),
	assessmentType: varchar().notNull(),
	assessmentData: jsonb().notNull(),
	completedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "skill_assessments_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const skillGapAnalysis = pgTable("skill_gap_analysis", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	targetRole: varchar().notNull(),
	currentSkills: jsonb().notNull(),
	requiredSkills: jsonb().notNull(),
	skillGaps: jsonb().notNull(),
	prioritySkills: jsonb().notNull(),
	estimatedTimeToClose: integer(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "skill_gap_analysis_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const userProfiles = pgTable("user_profiles", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	resumeUrl: text(),
	linkedinUrl: text(),
	githubUrl: text(),
	portfolioUrl: text(),
	behanceUrl: text(),
	extractedSkills: jsonb().default([]),
	extractedExperience: jsonb().default([]),
	extractedEducation: jsonb().default([]),
	personalityTraits: jsonb().default({}),
	workStylePreferences: jsonb().default({}),
	careerInterests: jsonb().default({}),
	hollandCodes: jsonb().default({}),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_profiles_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const weeklyDigests = pgTable("weekly_digests", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	weekStart: timestamp({ mode: 'string' }).notNull(),
	weekEnd: timestamp({ mode: 'string' }).notNull(),
	activities: jsonb().notNull(),
	achievements: jsonb().notNull(),
	newOpportunities: jsonb().notNull(),
	upcomingTasks: jsonb().notNull(),
	insights: jsonb().notNull(),
	isRead: boolean().default(false),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "weekly_digests_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const mockInterviews = pgTable("mock_interviews", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	interviewType: varchar().notNull(),
	role: varchar().notNull(),
	questions: jsonb().notNull(),
	answers: jsonb().default([]),
	feedback: jsonb().default({}),
	score: doublePrecision(),
	completedAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "mock_interviews_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const networkingSuggestions = pgTable("networking_suggestions", {
	id: serial().primaryKey().notNull(),
	userId: integer().notNull(),
	targetPerson: jsonb().notNull(),
	connectionReason: text().notNull(),
	suggestedMessage: text().notNull(),
	isConnected: boolean().default(false),
	connectionDate: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "networking_suggestions_userId_users_id_fk"
		}).onDelete("cascade"),
]);
