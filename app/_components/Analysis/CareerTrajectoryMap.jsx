"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  MapPin, 
  Clock, 
  DollarSign, 
  Target,
  ArrowRight,
  Star,
  Users,
  Briefcase
} from "lucide-react";
import { toast } from "sonner";

export default function CareerTrajectoryMap() {
  const [targetRole, setTargetRole] = useState("");
  const [trajectory, setTrajectory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedTrajectories, setSavedTrajectories] = useState([]);

  useEffect(() => {
    fetchSavedTrajectories();
  }, []);

  const fetchSavedTrajectories = async () => {
    try {
      const response = await fetch("/api/career-trajectory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setSavedTrajectories(data.trajectories);
      }
    } catch (error) {
      console.error("Error fetching saved trajectories:", error);
    }
  };

  const generateTrajectory = async () => {
    if (!targetRole.trim()) {
      toast.error("Please enter a target role");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/career-trajectory?targetRole=${encodeURIComponent(targetRole)}`);
      const data = await response.json();
      
      if (data.success) {
        setTrajectory(data.trajectory);
        toast.success("Career trajectory generated successfully!");
      } else {
        toast.error("Failed to generate trajectory");
      }
    } catch (error) {
      console.error("Error generating trajectory:", error);
      toast.error("An error occurred while generating trajectory");
    } finally {
      setLoading(false);
    }
  };

  const getStepColor = (index, total) => {
    const percentage = (index / (total - 1)) * 100;
    if (percentage < 33) return "bg-blue-500";
    if (percentage < 66) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getSalaryColor = (salary) => {
    if (salary.includes("₹")) {
      const num = parseInt(salary.replace(/[₹,]/g, ""));
      if (num < 500000) return "text-red-600";
      if (num < 1000000) return "text-yellow-600";
      return "text-green-600";
    }
    return "text-gray-600";
  };

  if (!trajectory) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Career Trajectory Mapping
            </CardTitle>
            <CardDescription>
              Map your career path from current role to your target position
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

              <Button onClick={generateTrajectory} disabled={loading}>
                {loading ? "Generating..." : "Generate Career Trajectory"}
              </Button>
            </div>

            {savedTrajectories.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Saved Trajectories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedTrajectories.map((traj) => (
                    <Card key={traj.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{traj.currentRole} → {traj.targetRole}</h4>
                          <Badge variant="outline">{traj.estimatedTimeline}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {traj.trajectorySteps.length} steps • Created {new Date(traj.createdAt).toLocaleDateString()}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            setTrajectory({
                              currentRole: traj.currentRole,
                              targetRole: traj.targetRole,
                              trajectorySteps: traj.trajectorySteps,
                              estimatedTimeline: traj.estimatedTimeline,
                              requiredSkills: traj.requiredSkills,
                              salaryProgression: traj.salaryProgression,
                              marketDemand: traj.marketDemand,
                              alternativePaths: [],
                              keyMilestones: []
                            });
                          }}
                        >
                          View Details
                        </Button>
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Career Trajectory: {trajectory.currentRole} → {trajectory.targetRole}
          </CardTitle>
          <CardDescription>
            Your personalized career development roadmap
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {trajectory.trajectorySteps.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Career Steps</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-lg font-semibold">
                    {trajectory.estimatedTimeline}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Timeline</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="text-lg font-semibold">
                    {trajectory.marketDemand}
                  </div>
                  <p className="text-sm text-muted-foreground">Market Demand</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <Target className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-lg font-semibold">
                    {trajectory.requiredSkills.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Skills Required</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Career Path Visualization */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Career Path Steps</h3>
            <div className="space-y-6">
              {trajectory.trajectorySteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full ${getStepColor(index, trajectory.trajectorySteps.length)} flex items-center justify-center text-white font-bold text-sm`}>
                      {step.step}
                    </div>
                    
                    <Card className="flex-1">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{step.role}</CardTitle>
                            <CardDescription className="mt-1">
                              Duration: {step.duration}
                            </CardDescription>
                          </div>
                          <Badge className={getSalaryColor(step.salaryRange)}>
                            <DollarSign className="h-3 w-3 mr-1" />
                            {step.salaryRange}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{step.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-sm mb-2">Required Skills</h4>
                            <div className="flex flex-wrap gap-1">
                              {step.requiredSkills.map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm mb-2">Key Responsibilities</h4>
                            <ul className="text-xs space-y-1">
                              {step.responsibilities.map((resp, respIndex) => (
                                <li key={respIndex} className="flex items-start gap-1">
                                  <span className="text-primary">•</span>
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-medium text-sm mb-2">Learning Objectives</h4>
                          <div className="flex flex-wrap gap-1">
                            {step.learningObjectives.map((objective, objIndex) => (
                              <Badge key={objIndex} variant="outline" className="text-xs">
                                {objective}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {index < trajectory.trajectorySteps.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-6 bg-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Salary Progression */}
          {trajectory.salaryProgression && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Salary Progression</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trajectory.salaryProgression.map((salary, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <h4 className="font-medium mb-2">{salary.role}</h4>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Min: {salary.minSalary}</div>
                          <div className="text-lg font-bold text-primary">{salary.averageSalary}</div>
                          <div className="text-sm text-muted-foreground">Max: {salary.maxSalary}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Key Milestones */}
          {trajectory.keyMilestones && trajectory.keyMilestones.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Key Milestones</h3>
              <div className="space-y-4">
                {trajectory.keyMilestones.map((milestone, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Star className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{milestone.milestone}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                          <Badge variant="outline" className="mt-2">
                            <Clock className="h-3 w-3 mr-1" />
                            {milestone.timeline}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Alternative Paths */}
          {trajectory.alternativePaths && trajectory.alternativePaths.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Alternative Career Paths</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trajectory.alternativePaths.map((path, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{path.path}</CardTitle>
                      <CardDescription>{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Advantages</h4>
                          <ul className="text-sm space-y-1">
                            {path.pros.map((pro, proIndex) => (
                              <li key={proIndex} className="flex items-start gap-1">
                                <span className="text-green-600">✓</span>
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">Considerations</h4>
                          <ul className="text-sm space-y-1">
                            {path.cons.map((con, conIndex) => (
                              <li key={conIndex} className="flex items-start gap-1">
                                <span className="text-red-600">⚠</span>
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Button onClick={() => setTrajectory(null)} variant="outline">
              Generate New Trajectory
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
