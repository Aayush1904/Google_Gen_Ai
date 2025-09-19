"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Play, 
  Clock, 
  Star, 
  ExternalLink,
  CheckCircle,
  Target,
  TrendingUp,
  Lightbulb
} from "lucide-react";
import { toast } from "sonner";

export default function LearningPathwayBuilder() {
  const [pathways, setPathways] = useState([]);
  const [newPathway, setNewPathway] = useState({
    targetSkill: "",
    currentLevel: "",
    targetLevel: "",
    timeline: ""
  });
  const [loading, setLoading] = useState(false);
  const [selectedPathway, setSelectedPathway] = useState(null);

  const levelOptions = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" }
  ];

  const timelineOptions = [
    { value: "1 month", label: "1 Month" },
    { value: "3 months", label: "3 Months" },
    { value: "6 months", label: "6 Months" },
    { value: "1 year", label: "1 Year" },
    { value: "flexible", label: "Flexible" }
  ];

  useEffect(() => {
    fetchPathways();
  }, []);

  const fetchPathways = async () => {
    try {
      const response = await fetch("/api/learning-pathway");
      const data = await response.json();
      
      if (data.success) {
        setPathways(data.pathways);
      }
    } catch (error) {
      console.error("Error fetching pathways:", error);
    }
  };

  const createPathway = async () => {
    if (!newPathway.targetSkill || !newPathway.currentLevel || !newPathway.targetLevel) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/learning-pathway", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPathway),
      });

      const data = await response.json();
      
      if (data.success) {
        setPathways(prev => [...prev, data.learningPathway]);
        setSelectedPathway(data.pathway);
        setNewPathway({ targetSkill: "", currentLevel: "", targetLevel: "", timeline: "" });
        toast.success("Learning pathway created successfully!");
      } else {
        toast.error("Failed to create learning pathway");
      }
    } catch (error) {
      console.error("Error creating pathway:", error);
      toast.error("An error occurred while creating the pathway");
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (pathwayId, progress) => {
    try {
      const response = await fetch("/api/learning-pathway", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pathwayId,
          progress
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setPathways(prev => prev.map(p => 
          p.id === pathwayId ? { ...p, progress: data.pathway.progress } : p
        ));
        toast.success("Progress updated successfully!");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress");
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      beginner: "bg-red-100 text-red-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-blue-100 text-blue-800",
      expert: "bg-green-100 text-green-800"
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800"
    };
    return colors[difficulty] || "bg-gray-100 text-gray-800";
  };

  if (selectedPathway) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {selectedPathway.pathwayName}
                </CardTitle>
                <CardDescription>
                  {selectedPathway.currentLevel} → {selectedPathway.targetLevel} • {selectedPathway.timeline}
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setSelectedPathway(null)}>
                Back to Pathways
              </Button>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{selectedPathway.progress}%</span>
              </div>
              <Progress value={selectedPathway.progress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="courses" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPathway.courses.map((course, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{course.title}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{course.platform}</Badge>
                              <Badge className={getDifficultyColor(course.difficulty)}>
                                {course.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-4 w-4" />
                            {course.rating}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Target className="h-4 w-4" />
                            <span>{course.price}</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <h4 className="font-medium text-sm mb-2">Learning Objectives</h4>
                          <div className="flex flex-wrap gap-1">
                            {course.learningObjectives.map((objective, objIndex) => (
                              <Badge key={objIndex} variant="secondary" className="text-xs">
                                {objective}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {course.url && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-3 w-full"
                            onClick={() => window.open(course.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Course
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPathway.resources.map((resource, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {resource.type === "book" && <BookOpen className="h-4 w-4" />}
                            {resource.type === "article" && <BookOpen className="h-4 w-4" />}
                            {resource.type === "video" && <Play className="h-4 w-4" />}
                            {resource.type === "tutorial" && <Lightbulb className="h-4 w-4" />}
                            {resource.type === "practice" && <Target className="h-4 w-4" />}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{resource.title}</h3>
                            <Badge className={getDifficultyColor(resource.difficulty)}>
                              {resource.difficulty}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-2">{resource.description}</p>
                            {resource.url && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-2 p-0 h-auto"
                                onClick={() => window.open(resource.url, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View Resource
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="milestones" className="space-y-4">
                <div className="space-y-4">
                  {selectedPathway.milestones.map((milestone, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{milestone.milestone}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                <Clock className="h-3 w-3 mr-1" />
                                {milestone.timeline}
                              </Badge>
                            </div>
                            <div className="mt-2">
                              <h4 className="font-medium text-sm mb-1">Skills Gained</h4>
                              <div className="flex flex-wrap gap-1">
                                {milestone.skills.map((skill, skillIndex) => (
                                  <Badge key={skillIndex} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPathway.practiceProjects.map((project, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold mb-2">{project.title}</h3>
                        <Badge className={getDifficultyColor(project.difficulty)}>
                          {project.difficulty}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2 mb-3">{project.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{project.estimatedTime}</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <h4 className="font-medium text-sm mb-2">Skills Practiced</h4>
                          <div className="flex flex-wrap gap-1">
                            {project.skills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Update Progress</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Progress value={selectedPathway.progress} className="h-2" />
                </div>
                <div className="flex gap-2">
                  {[25, 50, 75, 100].map((progress) => (
                    <Button
                      key={progress}
                      variant="outline"
                      size="sm"
                      onClick={() => updateProgress(selectedPathway.id, progress)}
                    >
                      {progress}%
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Learning Pathway Builder
          </CardTitle>
          <CardDescription>
            Create personalized learning pathways to achieve your skill goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Create New Pathway */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Create New Learning Pathway</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetSkill">Target Skill</Label>
                <Input
                  id="targetSkill"
                  value={newPathway.targetSkill}
                  onChange={(e) => setNewPathway(prev => ({ ...prev, targetSkill: e.target.value }))}
                  placeholder="e.g., React, Machine Learning, Data Analysis"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentLevel">Current Level</Label>
                <Select
                  value={newPathway.currentLevel}
                  onValueChange={(value) => setNewPathway(prev => ({ ...prev, currentLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select current level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levelOptions.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetLevel">Target Level</Label>
                <Select
                  value={newPathway.targetLevel}
                  onValueChange={(value) => setNewPathway(prev => ({ ...prev, targetLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levelOptions.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Select
                  value={newPathway.timeline}
                  onValueChange={(value) => setNewPathway(prev => ({ ...prev, timeline: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {timelineOptions.map((timeline) => (
                      <SelectItem key={timeline.value} value={timeline.value}>
                        {timeline.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={createPathway} disabled={loading} className="w-full">
              {loading ? "Creating Pathway..." : "Create Learning Pathway"}
            </Button>
          </div>

          {/* Existing Pathways */}
          {pathways.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Your Learning Pathways</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pathways.map((pathway) => (
                  <Card key={pathway.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{pathway.pathwayName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {pathway.currentLevel} → {pathway.targetLevel}
                          </p>
                        </div>
                        <Badge className={getLevelColor(pathway.currentLevel)}>
                          {pathway.currentLevel}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{pathway.progress}%</span>
                        </div>
                        <Progress value={pathway.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="text-sm text-muted-foreground">
                          {pathway.courses.length} courses • {pathway.timeline}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPathway(pathway)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
