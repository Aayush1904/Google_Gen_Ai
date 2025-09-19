"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, TrendingUp, Users, Lightbulb, Target } from "lucide-react";
import { toast } from "sonner";

export default function PsychometricTest() {
  const [testType, setTestType] = useState("holland_codes");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, [testType]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/psychometric-test?testType=${testType}`);
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
      toast.error("Failed to load test questions");
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

  const submitTest = async () => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/psychometric-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testType,
          answers
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.analysis);
        setTestCompleted(true);
        toast.success("Test completed successfully!");
      } else {
        toast.error("Failed to submit test");
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error("An error occurred while submitting the test");
    } finally {
      setLoading(false);
    }
  };

  const getProgress = () => {
    return ((currentQuestion + 1) / questions.length) * 100;
  };

  const getHollandCodeIcon = (code) => {
    const icons = {
      Realistic: <Target className="h-4 w-4" />,
      Investigative: <Brain className="h-4 w-4" />,
      Artistic: <Lightbulb className="h-4 w-4" />,
      Social: <Users className="h-4 w-4" />,
      Enterprising: <TrendingUp className="h-4 w-4" />,
      Conventional: <CheckCircle className="h-4 w-4" />
    };
    return icons[code] || <Brain className="h-4 w-4" />;
  };

  if (testCompleted && results) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Test Results
            </CardTitle>
            <CardDescription>
              Your personality assessment results and career insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Holland Code Results</h3>
                <div className="space-y-3">
                  {Object.entries(results.results.holland_codes).map(([code, score]) => (
                    <div key={code} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getHollandCodeIcon(code)}
                        <span className="font-medium">{code}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={score} className="w-20" />
                        <span className="text-sm font-medium">{score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Personality Traits</h3>
                <div className="flex flex-wrap gap-2">
                  {results.personalityTraits.map((trait, index) => (
                    <Badge key={index} variant="secondary">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Career Interests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.careerInterests.map((interest, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <p className="text-sm">{interest}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Work Style Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {results.workStylePreferences.map((preference, index) => (
                  <Badge key={index} variant="outline">
                    {preference}
                  </Badge>
                ))}
              </div>
            </div>

            {results.recommendedCareerPaths && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Recommended Career Paths</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.recommendedCareerPaths.map((path, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <p className="font-medium">{path}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-4">Insights</h3>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm leading-relaxed">{results.insights}</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button onClick={() => {
                setTestCompleted(false);
                setResults(null);
                fetchQuestions();
              }}>
                Retake Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Loading Test Questions</h3>
              <p className="text-muted-foreground">Please wait while we prepare your assessment...</p>
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
            <Brain className="h-5 w-5" />
            Psychometric Assessment
          </CardTitle>
          <CardDescription>
            Answer honestly to get accurate personality insights
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
            <p className="text-sm text-muted-foreground mb-4">
              Category: {currentQ.category}
            </p>
          </div>

          <RadioGroup
            value={answers[currentQ.id]?.toString() || ""}
            onValueChange={(value) => handleAnswer(currentQ.id, parseInt(value))}
            className="space-y-3"
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option.label}
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
                onClick={submitTest}
                disabled={loading || !answers[currentQ.id]}
              >
                {loading ? "Submitting..." : "Complete Test"}
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                disabled={!answers[currentQ.id]}
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
