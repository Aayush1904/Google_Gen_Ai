"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Target, 
  Clock, 
  BookOpen, 
  AlertCircle, 
  CheckCircle,
  BarChart3,
  Lightbulb
} from "lucide-react";
import { toast } from "sonner";

export default function SkillGapDashboard() {
  const [targetRole, setTargetRole] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customSkills, setCustomSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  const generateAnalysis = async () => {
    if (!targetRole.trim()) {
      toast.error("Please enter a target role");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/skill-gap-analysis?targetRole=${encodeURIComponent(targetRole)}`);
      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.analysis);
        toast.success("Skill gap analysis generated successfully!");
      } else {
        toast.error("Failed to generate analysis");
      }
    } catch (error) {
      console.error("Error generating analysis:", error);
      toast.error("An error occurred while generating analysis");
    } finally {
      setLoading(false);
    }
  };

  const generateCustomAnalysis = async () => {
    if (!targetRole.trim() || customSkills.length === 0) {
      toast.error("Please enter a target role and add some skills");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/skill-gap-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetRole,
          customSkills
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.analysis);
        toast.success("Custom skill gap analysis generated successfully!");
      } else {
        toast.error("Failed to generate custom analysis");
      }
    } catch (error) {
      console.error("Error generating custom analysis:", error);
      toast.error("An error occurred while generating analysis");
    } finally {
      setLoading(false);
    }
  };

  const addCustomSkill = () => {
    if (newSkill.trim() && !customSkills.includes(newSkill.trim())) {
      setCustomSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeCustomSkill = (skill) => {
    setCustomSkills(prev => prev.filter(s => s !== skill));
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-green-100 text-green-800 border-green-200"
    };
    return colors[priority] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Skill Gap Analysis
            </CardTitle>
            <CardDescription>
              Analyze the gap between your current skills and target role requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="targetRole">Target Role</Label>
                <Input
                  id="targetRole"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Senior Software Engineer, Data Scientist, Product Manager"
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={generateAnalysis} disabled={loading}>
                  {loading ? "Analyzing..." : "Generate Analysis"}
                </Button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Or Create Custom Analysis</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Add Your Current Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Enter a skill"
                      onKeyPress={(e) => e.key === "Enter" && addCustomSkill()}
                    />
                    <Button onClick={addCustomSkill} variant="outline">
                      Add
                    </Button>
                  </div>
                </div>

                {customSkills.length > 0 && (
                  <div>
                    <Label>Your Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {customSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <button
                            onClick={() => removeCustomSkill(skill)}
                            className="ml-1 hover:text-red-600"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={generateCustomAnalysis} 
                  disabled={loading || customSkills.length === 0}
                  variant="outline"
                >
                  {loading ? "Analyzing..." : "Generate Custom Analysis"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Skill Gap Analysis: {targetRole}
          </CardTitle>
          <CardDescription>
            Understanding the gap between your current skills and target role requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="gaps">Skill Gaps</TabsTrigger>
              <TabsTrigger value="learning">Learning Path</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        {analysis.skillGaps.length}
                      </div>
                      <p className="text-sm text-muted-foreground">Skill Gaps Identified</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {analysis.estimatedTimeToClose}
                      </div>
                      <p className="text-sm text-muted-foreground">Time to Close Gaps</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {analysis.marketDemand}
                      </div>
                      <p className="text-sm text-muted-foreground">Market Demand</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-medium">Technical Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.currentSkills.technical.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <h4 className="font-medium">Soft Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.currentSkills.soft.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Required Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-medium">Technical Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.requiredSkills.technical.map((skill, index) => (
                          <Badge key={index} variant="default">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <h4 className="font-medium">Soft Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.requiredSkills.soft.map((skill, index) => (
                          <Badge key={index} variant="default">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="gaps" className="space-y-6">
              <div className="space-y-4">
                {analysis.skillGaps.map((gap, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{gap.skill}</h3>
                            <Badge className={getPriorityColor(gap.priority)}>
                              {gap.priority} priority
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Current: {gap.currentLevel} → Required: {gap.requiredLevel}
                          </p>
                          <p className="text-sm">{gap.gap}</p>
                        </div>
                        <div className="ml-4">
                          {gap.priority === "high" && <AlertCircle className="h-5 w-5 text-red-500" />}
                          {gap.priority === "medium" && <Clock className="h-5 w-5 text-yellow-500" />}
                          {gap.priority === "low" && <CheckCircle className="h-5 w-5 text-green-500" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="learning" className="space-y-6">
              <div className="space-y-4">
                {analysis.learningPath.map((phase, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Phase {index + 1}: {phase.phase}
                      </CardTitle>
                      <CardDescription>
                        Duration: {phase.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Skills to Learn</h4>
                          <div className="flex flex-wrap gap-2">
                            {phase.skills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Resources</h4>
                          <div className="space-y-2">
                            {phase.resources.map((resource, resourceIndex) => (
                              <div key={resourceIndex} className="text-sm">
                                • {resource}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Priority Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.prioritySkills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <strong>Market Demand:</strong> {analysis.marketDemand}
                      </div>
                      <div className="text-sm">
                        <strong>Salary Impact:</strong> {analysis.salaryImpact}
                      </div>
                      <div className="text-sm">
                        <strong>Estimated Timeline:</strong> {analysis.estimatedTimeToClose}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-6">
            <Button onClick={() => setAnalysis(null)} variant="outline">
              Generate New Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
