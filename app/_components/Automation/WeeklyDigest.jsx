"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Target, 
  Users,
  Briefcase,
  Star,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Clock,
  Award
} from "lucide-react";
import { toast } from "sonner";

export default function WeeklyDigest() {
  const [digest, setDigest] = useState(null);
  const [digests, setDigests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null);

  useEffect(() => {
    fetchDigests();
  }, []);

  const fetchDigests = async () => {
    try {
      const response = await fetch("/api/weekly-digest", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setDigests(data.digests);
        if (data.digests.length > 0) {
          setSelectedWeek(data.digests[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching digests:", error);
    }
  };

  const generateDigest = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/weekly-digest");
      const data = await response.json();
      
      if (data.success) {
        setDigest(data.digest);
        setDigests(prev => [data.digest, ...prev]);
        toast.success("Weekly digest generated successfully!");
      } else {
        toast.error("Failed to generate digest");
      }
    } catch (error) {
      console.error("Error generating digest:", error);
      toast.error("An error occurred while generating digest");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (digestId) => {
    try {
      const response = await fetch("/api/weekly-digest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ digestId }),
      });

      const data = await response.json();
      
      if (data.success) {
        setDigests(prev => prev.map(d => 
          d.id === digestId ? { ...d, isRead: true } : d
        ));
        if (digest && digest.id === digestId) {
          setDigest(prev => ({ ...prev, isRead: true }));
        }
        toast.success("Digest marked as read!");
      }
    } catch (error) {
      console.error("Error marking digest as read:", error);
      toast.error("Failed to mark digest as read");
    }
  };

  const getWeekRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  if (!digest && digests.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Digest
            </CardTitle>
            <CardDescription>
              Get personalized insights and recommendations for your career development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Digest Available</h3>
              <p className="text-muted-foreground mb-6">
                Generate your first weekly digest to get personalized insights about your career journey.
              </p>
              <Button onClick={generateDigest} disabled={loading}>
                {loading ? "Generating..." : "Generate Weekly Digest"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentDigest = digest || selectedWeek;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Digest
              </CardTitle>
              <CardDescription>
                {currentDigest && getWeekRange(currentDigest.weekStartDate, currentDigest.weekEndDate)}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {digests.length > 0 && (
                <select
                  value={selectedWeek?.id || ""}
                  onChange={(e) => {
                    const week = digests.find(d => d.id === parseInt(e.target.value));
                    setSelectedWeek(week);
                    setDigest(null);
                  }}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  {digests.map((d) => (
                    <option key={d.id} value={d.id}>
                      {getWeekRange(d.weekStartDate, d.weekEndDate)}
                    </option>
                  ))}
                </select>
              )}
              <Button onClick={generateDigest} disabled={loading}>
                {loading ? "Generating..." : "Generate New"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentDigest && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                <TabsTrigger value="learning">Learning</TabsTrigger>
                <TabsTrigger value="networking">Networking</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <Briefcase className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <div className="text-2xl font-bold text-primary mb-2">
                          {currentDigest.newOpportunities?.count || 0}
                        </div>
                        <p className="text-sm text-muted-foreground">New Opportunities</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <BookOpen className="h-6 w-6 mx-auto mb-2 text-green-600" />
                        <div className="text-2xl font-bold text-primary mb-2">
                          {currentDigest.learningProgress?.pathwaysActive || 0}
                        </div>
                        <p className="text-sm text-muted-foreground">Active Pathways</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <Target className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                        <div className="text-2xl font-bold text-primary mb-2">
                          {currentDigest.skillImprovements?.assessmentsCompleted || 0}
                        </div>
                        <p className="text-sm text-muted-foreground">Assessments</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <Users className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                        <div className="text-2xl font-bold text-primary mb-2">
                          {currentDigest.upcomingEvents?.count || 0}
                        </div>
                        <p className="text-sm text-muted-foreground">Upcoming Events</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {currentDigest.motivationalMessage && (
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <Lightbulb className="h-8 w-8 mx-auto mb-3 text-yellow-500" />
                        <p className="text-lg font-medium">{currentDigest.motivationalMessage}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {currentDigest.achievements && currentDigest.achievements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        This Week's Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentDigest.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <p className="font-medium">{achievement.achievement}</p>
                              <p className="text-sm text-muted-foreground">{achievement.impact}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="opportunities" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      New Job Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentDigest.newOpportunities?.highlights?.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                          <p className="text-sm">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Market Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentDigest.marketInsights?.trends?.map((trend, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                          <p className="text-sm">{trend}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="learning" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Learning Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Progress Made</h4>
                        <p className="text-sm text-muted-foreground">
                          {currentDigest.learningProgress?.progressMade}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Achievements</h4>
                        <div className="space-y-2">
                          {currentDigest.learningProgress?.achievements?.map((achievement, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              <span className="text-sm">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Skill Improvements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Skills Improved</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentDigest.skillImprovements?.skillsImproved?.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Next Focus Areas</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentDigest.skillImprovements?.nextFocus?.map((focus, index) => (
                            <Badge key={index} variant="outline">
                              {focus}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="networking" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Networking Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentDigest.networkingSuggestions?.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <p className="font-medium">{suggestion.action}</p>
                            <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                            <Badge variant="outline" className="mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {suggestion.timeline}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentDigest.upcomingEvents?.highlights?.map((event, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-green-500 mt-0.5" />
                          <p className="text-sm">{event}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="goals" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Next Week's Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentDigest.nextWeekGoals?.map((goal, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{goal.goal}</h4>
                            <Badge variant={goal.priority === "high" ? "default" : "secondary"}>
                              {goal.priority}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {goal.actionItems?.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                                <span className="text-sm">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {currentDigest && !currentDigest.isRead && (
            <div className="mt-6 flex justify-center">
              <Button onClick={() => markAsRead(currentDigest.id)}>
                Mark as Read
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
