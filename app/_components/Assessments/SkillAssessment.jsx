"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code, CheckCircle, TrendingUp, BookOpen, Target } from "lucide-react";
import { toast } from "sonner";

export default function SkillAssessment() {
  const [skillName, setSkillName] = useState("JavaScript");
  const [skillCategory, setSkillCategory] = useState("Programming");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState(null);

  const skillOptions = [
    { name: "JavaScript", category: "Programming" },
    { name: "Python", category: "Programming" },
    { name: "React", category: "Frontend" },
    { name: "Node.js", category: "Backend" },
    { name: "SQL", category: "Database" },
    { name: "AWS", category: "Cloud" },
    { name: "Docker", category: "DevOps" },
    { name: "Machine Learning", category: "AI/ML" },
    { name: "Data Analysis", category: "Analytics" },
    { name: "UI/UX Design", category: "Design" }
  ];

  const fetchQuestions = async () => {
    if (!skillName) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/skill-assessment?skillName=${skillName}&skillCategory=${skillCategory}`);
      const data = await response.json();
      
      if (data.success) {
        setQuestions(data.questions);
        setCurrentQuestion(0);
        setAnswers({});
        setTestCompleted(false);
        setResults(null);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load assessment questions");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitAssessment = async () => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/skill-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skillName,
          skillCategory,
          questions,
          answers
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data);
        setTestCompleted(true);
        toast.success("Assessment completed successfully!");
      } else {
        toast.error("Failed to submit assessment");
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("An error occurred while submitting the assessment");
    } finally {
      setLoading(false);
    }
  };

  const getProgress = () => {
    return questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  };

  const getProficiencyColor = (level) => {
    const colors = {
      beginner: "bg-red-100 text-red-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-blue-100 text-blue-800",
      expert: "bg-green-100 text-green-800"
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  if (testCompleted && results) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Assessment Results
            </CardTitle>
            <CardDescription>
              Your {skillName} skill assessment results and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {Math.round(results.score)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <Badge className={`${getProficiencyColor(results.proficiencyLevel)} text-sm`}>
                      {results.proficiencyLevel.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">Proficiency Level</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {results.recommendations.estimatedTimeToImprove}
                    </div>
                    <p className="text-sm text-muted-foreground">Time to Improve</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Improvement Areas</h3>
              <div className="flex flex-wrap gap-2">
                {results.recommendations.improvementAreas.map((area, index) => (
                  <Badge key={index} variant="outline">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Recommended Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.recommendations.recommendedResources.map((resource, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {resource.type === "course" && <BookOpen className="h-4 w-4" />}
                          {resource.type === "tutorial" && <Code className="h-4 w-4" />}
                          {resource.type === "practice" && <Target className="h-4 w-4" />}
                          {resource.type === "book" && <BookOpen className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {resource.description}
                          </p>
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline mt-2 inline-block"
                            >
                              View Resource →
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
              <div className="space-y-2">
                {results.recommendations.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={() => {
                setTestCompleted(false);
                setResults(null);
                fetchQuestions();
              }}>
                Retake Assessment
              </Button>
              <Button variant="outline" onClick={() => {
                setSkillName("");
                setSkillCategory("");
                setQuestions([]);
                setTestCompleted(false);
                setResults(null);
              }}>
                Choose Different Skill
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!skillName) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Skill Assessment
            </CardTitle>
            <CardDescription>
              Choose a skill to assess your proficiency level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skill-select">Select Skill to Assess</Label>
              <Select onValueChange={(value) => {
                const skill = skillOptions.find(s => s.name === value);
                setSkillName(skill.name);
                setSkillCategory(skill.category);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a skill..." />
                </SelectTrigger>
                <SelectContent>
                  {skillOptions.map((skill) => (
                    <SelectItem key={skill.name} value={skill.name}>
                      {skill.name} ({skill.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {skillName && (
              <div className="space-y-2">
                <Label>Skill Category</Label>
                <Input value={skillCategory} disabled />
              </div>
            )}

            <Button 
              onClick={fetchQuestions} 
              disabled={!skillName || loading}
              className="w-full"
            >
              {loading ? "Loading..." : "Start Assessment"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0 && !loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Code className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Loading Assessment Questions</h3>
              <p className="text-muted-foreground">Please wait while we prepare your {skillName} assessment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Loading Questions</h3>
              <p className="text-muted-foreground">Preparing your {skillName} assessment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            {skillName} Assessment
          </CardTitle>
          <CardDescription>
            Test your knowledge and get personalized recommendations
          </CardDescription>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(getProgress())}% Complete</span>
            </div>
            <Progress value={getProgress()} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{currentQ.question}</h3>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="text-xs">
                {currentQ.difficulty}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {currentQ.type}
              </Badge>
            </div>
          </div>

          <RadioGroup
            value={answers[currentQ.id]?.toString() || ""}
            onValueChange={(value) => handleAnswer(currentQ.id, parseInt(value))}
            className="space-y-3"
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            {currentQuestion === questions.length - 1 ? (
              <Button
                onClick={submitAssessment}
                disabled={loading || answers[currentQ.id] === undefined}
              >
                {loading ? "Submitting..." : "Complete Assessment"}
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                disabled={answers[currentQ.id] === undefined}
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
