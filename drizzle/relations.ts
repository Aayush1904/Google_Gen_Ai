import { relations } from "drizzle-orm/relations";
import { industryInsight, users, userIndustry, assessments, careerTrajectories, applicationAssistants, jobOpportunities, events, freelanceGigs, learningPaths, courseRecommendations, learningSchedules, documentTemplates, mentorConnections, projectIdeas, psychometricTests, salaryBenchmarks, skillAssessments, skillGapAnalysis, userProfiles, weeklyDigests, mockInterviews, networkingSuggestions } from "./schema";

export const usersRelations = relations(users, ({one, many}) => ({
	industryInsight: one(industryInsight, {
		fields: [users.industryInsight],
		references: [industryInsight.id]
	}),
	userIndustries: many(userIndustry),
	assessments: many(assessments),
	careerTrajectories: many(careerTrajectories),
	applicationAssistants: many(applicationAssistants),
	events: many(events),
	freelanceGigs: many(freelanceGigs),
	learningPaths: many(learningPaths),
	courseRecommendations: many(courseRecommendations),
	learningSchedules: many(learningSchedules),
	jobOpportunities: many(jobOpportunities),
	documentTemplates: many(documentTemplates),
	mentorConnections_menteeId: many(mentorConnections, {
		relationName: "mentorConnections_menteeId_users_id"
	}),
	mentorConnections_mentorId: many(mentorConnections, {
		relationName: "mentorConnections_mentorId_users_id"
	}),
	projectIdeas: many(projectIdeas),
	psychometricTests: many(psychometricTests),
	salaryBenchmarks: many(salaryBenchmarks),
	skillAssessments: many(skillAssessments),
	skillGapAnalyses: many(skillGapAnalysis),
	userProfiles: many(userProfiles),
	weeklyDigests: many(weeklyDigests),
	mockInterviews: many(mockInterviews),
	networkingSuggestions: many(networkingSuggestions),
}));

export const industryInsightRelations = relations(industryInsight, ({many}) => ({
	users: many(users),
	userIndustries: many(userIndustry),
}));

export const userIndustryRelations = relations(userIndustry, ({one}) => ({
	user: one(users, {
		fields: [userIndustry.userId],
		references: [users.id]
	}),
	industryInsight: one(industryInsight, {
		fields: [userIndustry.industryId],
		references: [industryInsight.id]
	}),
}));

export const assessmentsRelations = relations(assessments, ({one}) => ({
	user: one(users, {
		fields: [assessments.userId],
		references: [users.id]
	}),
}));

export const careerTrajectoriesRelations = relations(careerTrajectories, ({one}) => ({
	user: one(users, {
		fields: [careerTrajectories.userId],
		references: [users.id]
	}),
}));

export const applicationAssistantsRelations = relations(applicationAssistants, ({one}) => ({
	user: one(users, {
		fields: [applicationAssistants.userId],
		references: [users.id]
	}),
	jobOpportunity: one(jobOpportunities, {
		fields: [applicationAssistants.jobId],
		references: [jobOpportunities.id]
	}),
}));

export const jobOpportunitiesRelations = relations(jobOpportunities, ({one, many}) => ({
	applicationAssistants: many(applicationAssistants),
	user: one(users, {
		fields: [jobOpportunities.userId],
		references: [users.id]
	}),
}));

export const eventsRelations = relations(events, ({one}) => ({
	user: one(users, {
		fields: [events.userId],
		references: [users.id]
	}),
}));

export const freelanceGigsRelations = relations(freelanceGigs, ({one}) => ({
	user: one(users, {
		fields: [freelanceGigs.userId],
		references: [users.id]
	}),
}));

export const learningPathsRelations = relations(learningPaths, ({one, many}) => ({
	user: one(users, {
		fields: [learningPaths.userId],
		references: [users.id]
	}),
	learningSchedules: many(learningSchedules),
}));

export const courseRecommendationsRelations = relations(courseRecommendations, ({one}) => ({
	user: one(users, {
		fields: [courseRecommendations.userId],
		references: [users.id]
	}),
}));

export const learningSchedulesRelations = relations(learningSchedules, ({one}) => ({
	user: one(users, {
		fields: [learningSchedules.userId],
		references: [users.id]
	}),
	learningPath: one(learningPaths, {
		fields: [learningSchedules.learningPathId],
		references: [learningPaths.id]
	}),
}));

export const documentTemplatesRelations = relations(documentTemplates, ({one}) => ({
	user: one(users, {
		fields: [documentTemplates.userId],
		references: [users.id]
	}),
}));

export const mentorConnectionsRelations = relations(mentorConnections, ({one}) => ({
	user_menteeId: one(users, {
		fields: [mentorConnections.menteeId],
		references: [users.id],
		relationName: "mentorConnections_menteeId_users_id"
	}),
	user_mentorId: one(users, {
		fields: [mentorConnections.mentorId],
		references: [users.id],
		relationName: "mentorConnections_mentorId_users_id"
	}),
}));

export const projectIdeasRelations = relations(projectIdeas, ({one}) => ({
	user: one(users, {
		fields: [projectIdeas.userId],
		references: [users.id]
	}),
}));

export const psychometricTestsRelations = relations(psychometricTests, ({one}) => ({
	user: one(users, {
		fields: [psychometricTests.userId],
		references: [users.id]
	}),
}));

export const salaryBenchmarksRelations = relations(salaryBenchmarks, ({one}) => ({
	user: one(users, {
		fields: [salaryBenchmarks.userId],
		references: [users.id]
	}),
}));

export const skillAssessmentsRelations = relations(skillAssessments, ({one}) => ({
	user: one(users, {
		fields: [skillAssessments.userId],
		references: [users.id]
	}),
}));

export const skillGapAnalysisRelations = relations(skillGapAnalysis, ({one}) => ({
	user: one(users, {
		fields: [skillGapAnalysis.userId],
		references: [users.id]
	}),
}));

export const userProfilesRelations = relations(userProfiles, ({one}) => ({
	user: one(users, {
		fields: [userProfiles.userId],
		references: [users.id]
	}),
}));

export const weeklyDigestsRelations = relations(weeklyDigests, ({one}) => ({
	user: one(users, {
		fields: [weeklyDigests.userId],
		references: [users.id]
	}),
}));

export const mockInterviewsRelations = relations(mockInterviews, ({one}) => ({
	user: one(users, {
		fields: [mockInterviews.userId],
		references: [users.id]
	}),
}));

export const networkingSuggestionsRelations = relations(networkingSuggestions, ({one}) => ({
	user: one(users, {
		fields: [networkingSuggestions.userId],
		references: [users.id]
	}),
}));