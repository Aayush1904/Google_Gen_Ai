"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Brain, 
  BarChart3, 
  BookOpen, 
  Briefcase, 
  Calendar,
  TrendingUp,
  Target,
  CheckCircle,
  AlertCircle,
  Star,
  Clock
} from "lucide-react";

// Import all the components we created
import UserProfileForm from "../UserProfile/UserProfileForm";
import PsychometricTest from "../Assessments/PsychometricTest";
import SkillAssessment from "../Assessments/SkillAssessment";
import SkillGapDashboard from "../Analysis/SkillGapDashboard";
import CareerTrajectoryMap from "../Analysis/CareerTrajectoryMap";
import LearningPathwayBuilder from "../Guidance/LearningPathwayBuilder";
import JobOpportunityScanner from "../Automation/JobOpportunityScanner";
import WeeklyDigest from "../Automation/WeeklyDigest";

export default function ComprehensiveDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user-profile");
      const data = await response.json();
      
      if (data.success) {
        setUser(data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCompletionPercentage = () => {
    if (!user?.profile) return 0;
    
    const fields = [
      user.profile.resumeUrl,
      user.profile.linkedinUrl,
      user.profile.githubUrl,
      user.profile.workExperience?.length > 0,
      user.profile.education?.length > 0,
      user.profile.projects?.length > 0
    ];
    
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 mt-20">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Loading Dashboard</h3>
              <p className="text-muted-foreground">Preparing your personalized career development platform...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Career Development Platform</h1>
        <p className="text-muted-foreground">
          Your comprehensive AI-powered career development and learning companion
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="guidance">Guidance</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="digest">Digest</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <User className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-primary mb-2">
                    {getCompletionPercentage()}%
                  </div>
                  <p className="text-sm text-muted-foreground">Profile Complete</p>
                  <Progress value={getCompletionPercentage()} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-primary mb-2">
                    {user?.profile?.extractedSkills?.length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Skills Identified</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-primary mb-2">
                    0
                  </div>
                  <p className="text-sm text-muted-foreground">Learning Pathways</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <Briefcase className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold text-primary mb-2">
                    0
                  </div>
                  <p className="text-sm text-muted-foreground">Job Applications</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Get started with these essential career development tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Complete Your Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("assessments")}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Take Skills Assessment
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("analysis")}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analyze Skill Gaps
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("guidance")}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Create Learning Path
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest career development activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Profile updated</span>
                    <Badge variant="outline" className="ml-auto">Today</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Skills assessment completed</span>
                    <Badge variant="outline" className="ml-auto">2 days ago</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Learning pathway created</span>
                    <Badge variant="outline" className="ml-auto">1 week ago</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm">Complete your LinkedIn profile</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm">Take a psychometric test</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm">Set up job alerts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Profile Setup</Badge>
                    <span className="text-sm text-muted-foreground">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">First Assessment</Badge>
                    <span className="text-sm text-muted-foreground">In Progress</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium">Weekly Digest</div>
                    <div className="text-muted-foreground">Every Monday</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Skill Assessment</div>
                    <div className="text-muted-foreground">Recommended monthly</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <UserProfileForm user={user} onUpdate={fetchUserProfile} />
        </TabsContent>

        <TabsContent value="assessments">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Psychometric Assessment
                  </CardTitle>
                  <CardDescription>
                    Discover your personality traits and career interests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PsychometricTest />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Skill Assessment
                  </CardTitle>
                  <CardDescription>
                    Test your proficiency in specific skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SkillAssessment />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="space-y-6">
            <SkillGapDashboard />
            <CareerTrajectoryMap />
          </div>
        </TabsContent>

        <TabsContent value="guidance">
          <LearningPathwayBuilder />
        </TabsContent>

        <TabsContent value="opportunities">
          <JobOpportunityScanner />
        </TabsContent>

        <TabsContent value="digest">
          <WeeklyDigest />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Configure your career development preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Notification Preferences</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Weekly digest emails</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">New job opportunities</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Learning reminders</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Privacy Settings</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Share profile with mentors</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Allow networking suggestions</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
